export type ParsedPosterEvent = {
	title?: string;
	description?: string;
	date?: { start?: string; end?: string };
	time?: {
		start?: string;
		end?: string;
	};
	location?: {
		country?: string;
		state?: string;
		city?: string;
		street?: string;
		postalCode?: string;
		venue?: string;
	};
	links?: string[];
	sponsors?: [];
	status: "success" | "no_event_found" | "error";
	error?: string;
	adminNotes?: string;
} | null;

// How long to wait for the RunPod job to finish
const TOTAL_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
// How long each individual HTTP request is allowed to take
const REQUEST_TIMEOUT_MS = 30 * 1000; // 30 seconds
// Delay between status polls
const POLL_INTERVAL_MS = 5000; // 5 seconds

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (
	url: string,
	init: RequestInit,
	timeoutMs: number,
): Promise<Response> => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		return await fetch(url, { ...init, signal: controller.signal });
	} finally {
		clearTimeout(timeoutId);
	}
};

const normalizeOutput = (raw: unknown): ParsedPosterEvent => {
	let output: any = raw;

	if (typeof output === "string") {
		try {
			output = JSON.parse(output);
		} catch (error) {
			console.error("Failed to parse scan output as JSON:", output);
		}
	}

	if (output && typeof output === "object" && "error" in output) {
		throw new Error(`Worker Error: ${output.error}`);
	}

	if (!output) return null;

	return output;
};

export const scanPosterWithRunpod = async (
	images: Buffer[],
): Promise<ParsedPosterEvent> => {
	const RUNPOD_ID = process.env.RUNPOD_ENDPOINT_ID;
	const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;

	if (!RUNPOD_ID || !RUNPOD_API_KEY) {
		throw new Error(
			"RunPod configuration is missing (RUNPOD_ENDPOINT_ID or RUNPOD_API_KEY).",
		);
	}

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (RUNPOD_API_KEY) {
		headers["Authorization"] = `Bearer ${RUNPOD_API_KEY}`;
	}

	const body = JSON.stringify({
		input: {
			images: images.map((buf) => buf.toString("base64")),
		},
		policy: {
			executionTimeout: TOTAL_TIMEOUT_MS,
			lowPriority: false,
			ttl: 86400000,
		},
	});

	const url = `https://api.runpod.ai/v2/${RUNPOD_ID}/run`;
	console.log(`Scanning poster via: ${url}`);

	const submitResponse = await fetchWithTimeout(
		url,
		{
			method: "POST",
			headers,
			body,
		},
		REQUEST_TIMEOUT_MS,
	);
	if (!submitResponse.ok) {
		const errorText = await submitResponse.text();
		throw new Error(
			`Scan API error (${submitResponse.status}): ${errorText}`,
		);
	}

	const submitResult = await submitResponse.json();
	const jobId: string | undefined = submitResult.id;
	if (!jobId) {
		throw new Error(
			`Scan API did not return a job id: ${JSON.stringify(submitResult)}`,
		);
	}

	const statusUrl = `https://api.runpod.ai/v2/${RUNPOD_ID}/status/${jobId}`;
	const deadline = Date.now() + TOTAL_TIMEOUT_MS;

	while (Date.now() < deadline) {
		await sleep(POLL_INTERVAL_MS);

		let statusResponse: Response;
		try {
			statusResponse = await fetchWithTimeout(
				statusUrl,
				{
					method: "GET",
					headers,
				},
				REQUEST_TIMEOUT_MS,
			);
		} catch (error) {
			console.warn(`Status poll failed, will retry: ${String(error)}`);
			continue;
		}

		if (!statusResponse.ok) {
			const errorText = await statusResponse.text();

			if (statusResponse.status >= 500) {
				console.warn(
					`Status poll returned ${statusResponse.status}, will retry: ${errorText}`,
				);
				continue;
			}

			throw new Error(
				`Scan API status error (${statusResponse.status}): ${errorText}`,
			);
		}

		const statusResult = await statusResponse.json();
		const status: string | undefined = statusResult.status;

		if (status === "COMPLETED") {
			return normalizeOutput(statusResult.output);
		}

		if (
			status === "FAILED" ||
			status === "CANCELLED" ||
			status === "TIMED_OUT"
		) {
			throw new Error(
				`Scan job ${status}: ${JSON.stringify(statusResult.error ?? statusResult.output ?? {})}`,
			);
		}
		// Otherwise: IN_QUEUE or IN_PROGRESS keep polling
	}

	// Local deadline reached; attempt to cancel
	try {
		await fetchWithTimeout(
			`https://api.runpod.ai/v2/${RUNPOD_ID}/cancel/${jobId}`,
			{
				method: "POST",
				headers,
			},
			REQUEST_TIMEOUT_MS,
		);
	} catch (error) {
		console.warn(`Cancel request failed: ${String(error)}`);
	}

	throw new Error(
		`Scan job ${jobId} did not finish within ${TOTAL_TIMEOUT_MS}ms`,
	);
};
