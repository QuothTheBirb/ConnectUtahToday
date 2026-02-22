import {Metadata} from "next";

import {LocalIssuesCarousel} from "@/components/LocalIssuesCarousel";
import {PageHeading} from "@/components/PageHeading";
import {PageCard} from "@/components/PageCard";

export const metadata: Metadata = {
  title: "Local Activism Campaigns & Issues",
}

const LocalIssues = () => {
  return (
    <PageCard>
      <PageHeading heading={'h1'}>Local Activism Campaigns & Issues</PageHeading>
      <LocalIssuesCarousel />
    </PageCard>
  )
}

export default LocalIssues;
