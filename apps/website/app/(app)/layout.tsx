import {ReactNode} from "react";
import {Metadata} from "next";

import './globals.css';
import {SiteHeader} from "@/components/SiteHeader";
import {Providers} from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: 'Connect Utah Today',
    template: '%s | Connect Utah Today',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteHeader />
          <div
            style={{
              padding: '1rem 0.5rem'
            }}
          >
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
