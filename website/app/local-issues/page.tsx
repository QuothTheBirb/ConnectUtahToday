import {Metadata} from "next";
import LocalIssuesCarousel from "@/components/LocalIssuesCarousel/localIssuesCarousel";

export const metadata: Metadata = {
  title: "Local Activism Campaigns & Issues",
}

const LocalIssues = () => {
  return (
    <>
      <main>
        <h1>Local Activism Campaigns & Issues</h1>
        <LocalIssuesCarousel />
      </main>
    </>
  )
}

export default LocalIssues;
