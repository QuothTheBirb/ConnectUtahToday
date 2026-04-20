export async function scanPosterWithRunpod(images: Buffer | Buffer[]) {
	// Mocking for local development
	if (process.env.SCAN_POSTER_MOCK === "true") {
		const imageArray = Array.isArray(images) ? images : [images];
		return imageArray.map((_, i) => ({
			status: "success",
			title: `Mock Event ${i + 1}`,
			description:
				"This is a mock event description extracted from the poster.",
			date: {
				start: new Date().toISOString(),
			},
			location: {
				city: "Salt Lake City",
				state: "UT",
				country: "US",
			},
			links: ["https://example.com"],
		}));
	}

	const RUNPOD_ID = process.env.RUNPOD_ENDPOINT_ID;
	const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;
	const LOCAL_URL = process.env.SCAN_POSTER_LOCAL_URL;

	console.log(LOCAL_URL);

	if (!LOCAL_URL && (!RUNPOD_ID || !RUNPOD_API_KEY)) {
		throw new Error(
			"RunPod configuration is missing (RUNPOD_ENDPOINT_ID or RUNPOD_API_KEY), and no SCAN_POSTER_LOCAL_URL is set.",
		);
	}

	const imageArray = Array.isArray(images) ? images : [images];
	const imagesB64 = imageArray.map((buf) => buf.toString("base64"));

	const url = LOCAL_URL || `https://api.runpod.ai/v2/${RUNPOD_ID}/runsync`;
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (!LOCAL_URL && RUNPOD_API_KEY) {
		headers["Authorization"] = `Bearer ${RUNPOD_API_KEY}`;
	}

	const response = await fetch(url, {
		method: "POST",
		headers,
		body: JSON.stringify({
			input: {
				images: imagesB64,
			},
		}),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Scan API error (${response.status}): ${errorText}`);
	}

	const result = await response.json();

	// If using LOCAL_URL, the response might be direct output or follow RunPod format
	if (LOCAL_URL && result.output) {
		return result.output;
	}

	if (result.status === "COMPLETED" || (LOCAL_URL && !result.status)) {
		// RunPod returns the handler's return value (list) in the 'output' field
		const output = result.output || result;
		try {
			return typeof output === "string" ? JSON.parse(output) : output;
		} catch (e) {
			console.error("Failed to parse scan output as JSON:", output);
			return output;
		}
	}

	throw new Error(
		`Scan job failed or timed out: ${result.status || "unknown status"}`,
	);
}
