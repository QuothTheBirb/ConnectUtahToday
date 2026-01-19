import {PageHeading} from "@/components/PageHeading";

export const ImageEmbed = ({ title, img, alt }: { title: string; img: string; alt: string }) => {
  return (
    <section style={{ marginTop: "2em" }}>
      <PageHeading heading={'h2'}>{title}</PageHeading>
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          margin: "1em auto",
          textAlign: "left",
        }}
      >
        <img src={img} alt={alt} style={{ maxWidth: "100%", borderRadius: 8 }} />
      </div>
    </section>  )
}
