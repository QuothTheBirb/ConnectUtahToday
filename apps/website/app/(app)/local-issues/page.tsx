import {Metadata} from "next";

import {LocalIssuesCarousel} from "@/components/LocalIssuesCarousel";
import {PageHeading} from "@/components/PageHeading";

export const metadata: Metadata = {
  title: "Local Activism Campaigns & Issues",
}

const LocalIssues = () => {
  return (
    <main>
      <PageHeading heading={'h1'}>Local Activism Campaigns & Issues</PageHeading>
      <LocalIssuesCarousel />
    </main>
  )
}

export default LocalIssues;
