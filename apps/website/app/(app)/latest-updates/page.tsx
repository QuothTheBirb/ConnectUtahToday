import type {Metadata} from 'next';

import {LatestUpdates} from "@/components/LatestUpdates";
import {PageHeading} from "@/components/PageHeading";
import {PageCard} from "@/components/PageCard";

export const metadata: Metadata = {
  title: "Latest Updates",
}

export default function LatestUpdatesPage() {
  return (
    <PageCard>
      <PageHeading heading={'h1'}>Latest Updates</PageHeading>
      <p style={{
        marginBottom: '1rem'
      }}>
        Latest updates from local organizations via Instagram.
      </p>
      <LatestUpdates />
    </PageCard>
  );
}
