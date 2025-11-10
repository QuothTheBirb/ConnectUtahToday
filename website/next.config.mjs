import {withPayload} from '@payloadcms/next/withPayload';

/** @type {import("next").NextConfig} */
const nextConfig = {
	// output: "standalone",
	images: {
		unoptimized: true,
	},
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ];
  }
};

export default withPayload(nextConfig);
