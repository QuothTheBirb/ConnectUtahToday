import { Metadata } from "next";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { ReactNode } from "react";
import configPromise from "@/payload.config";

import "./globals.scss";

import { Providers } from "@/components/Providers";
import { SiteDisclaimer } from "@/components/SiteDisclaimer";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
	title: {
		default: "Connect Utah Today",
		template: "%s | Connect Utah Today",
	},
};

export default async function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	const payload = await getPayload({ config: configPromise });
	const { user } = await payload.auth({ headers: await headers() });
	const settings = await payload.findGlobal({
		slug: "site-settings",
	});

	return (
		<html lang="en">
			<body>
				<Providers>
					<SiteDisclaimer
						enabled={
							settings["site-disclaimer"]?.enableSiteDisclaimer ??
							false
						}
						title={settings["site-disclaimer"]?.title ?? ""}
						message={settings["site-disclaimer"]?.message ?? ""}
						buttonText={
							settings["site-disclaimer"]?.buttonText ??
							"I understand."
						}
					/>
					<SiteHeader user={user} />
					<div
						style={{
							padding: "1rem 0.5rem",
						}}
					>
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
