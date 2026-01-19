import type {Metadata} from 'next';

import {LatestUpdates} from "@/components/LatestUpdates";
import {PageHeading} from "@/components/PageHeading";

export const metadata: Metadata = {
  title: "Latest Updates",
}

export default function LatestUpdatesPage() {
  return (
    <main>
      <PageHeading heading={'h1'}>Latest Updates</PageHeading>
      <h2 style={{ fontWeight: 400, color: "#555", marginTop: ".5em" }}>
        Latest updates from local organizations via Instagram.
      </h2>
      <LatestUpdates />
    </main>
  );
}
