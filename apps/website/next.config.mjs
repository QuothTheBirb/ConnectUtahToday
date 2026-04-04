;
/** @type {import("next").NextConfig} */

import path from "path";
import { fileURLToPath } from "url";
import { withPayload } from "@payloadcms/next/withPayload";





const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
	output: "standalone",
	outputFileTracingRoot: path.join(__dirname, "../../"),
	images: {
		unoptimized: true,
	},
};

export default withPayload(nextConfig);
