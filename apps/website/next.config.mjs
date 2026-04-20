/** @type {import("next").NextConfig} */

import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig = {
	output: "standalone",
	images: {
		unoptimized: true,
	},
};

export default withPayload(nextConfig);
