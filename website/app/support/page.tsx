import GofundmeWidget from "@/components/Support/GoFundMeWidget";
import type {Metadata} from 'next';
import {PageHeading} from "@/components/PageHeading";
import {ImageEmbed} from "@/components/Support/ImageEmbed";


export const metadata: Metadata = {
  title: 'Events'
}

const gofundmeEmbeds = [
  {
    title: "Help a Loving Aunt Whose Husband Was Abducted By ICE",
    url: "https://www.gofundme.com/f/vqzgsc-help-for-my-aunt/widget/large?sharesheet=undefined&attribution_id=sl:d3796f69-9d01-49b4-88c1-4bb2d35d84eb",
  },
  {
    title: "Free a Loving Dad",
    url: "https://www.gofundme.com/f/help-free-our-loving-dad-from-ice-custody/widget/medium?sharesheet=undefined&attribution_id=sl:1578666a-5a62-4218-b878-0dad9cc697a1",
  },
  {
    title: "Support a family",
    url: "https://www.gofundme.com/f/donaciones-para-llevar-a-mi-bebe-a-guatemala/widget/large?sharesheet=undefined&attribution_id=sl:9add82f5-e545-4243-b912-a6f4ab4b5885",
  },
  {
    title: "Aid Maribel's Family",
    url: "https://www.gofundme.com/f/aid-maribels-family-in-their-time-of-need/widget/large?sharesheet=undefined&attribution_id=sl:fca519c2-0e01-4fe4-b0da-43bb58c26f06",
  },
  {
    title: "Immigration Legal Fund",
    url: "https://www.gofundme.com/f/help-reunite-our-family-urgent-immigration-support-needed/widget/large?sharesheet=undefined&attribution_id=sl:6744a7e7-114c-4f74-9ec6-5f1b4d0b6aec",
  },
];

const imageEmbeds = [
  {
    title: "Support Khairo",
    img: "/assets/khairo.png",
    alt: "Support Khairo",
  },
  {
    title: "Support Luna",
    img: "/assets/luna.png",
    alt: "Support Luna",
  },
];

export default function SupportPage() {
  return (
    <div>
      <main>
        <PageHeading heading={'h1'}>Support a Cause</PageHeading>
        <p>
          Below are causes endorsed by local organizations which you may choose to donate to. Click on a widget to learn more about the individual causes. <>disclaimer</>
        </p>
        {gofundmeEmbeds.map((gfm, index) => (
          <GofundmeWidget key={index} url={gfm.url} title={gfm.title} />
        ))}
        {imageEmbeds.map((img, index) => (
          <ImageEmbed key={index} img={img.img} alt={img.alt} title={img.title} />
        ))}
      </main>
      {/*<div*/}
      {/*  id="disclaimer-popover"*/}
      {/*  style={{*/}
      {/*    display: "none",*/}
      {/*    position: "fixed",*/}
      {/*    top: "20%",*/}
      {/*    left: "50%",*/}
      {/*    transform: "translate(-50%,0)",*/}
      {/*    background: "#fff",*/}
      {/*    border: "1px solid #888",*/}
      {/*    boxShadow: "0 4px 24px rgba(0,0,0,0.18)",*/}
      {/*    padding: "2em",*/}
      {/*    maxWidth: 500,*/}
      {/*    zIndex: 1000,*/}
      {/*    borderRadius: 8,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <strong>Disclaimer:</strong> Connect Utah Today provides links to third-party charitable organizations for your convenience. We do not collect or process donations directly; all donations are handled by the respective organizations. The inclusion of any link does not imply endorsement or recommendation. We make no representations about the accuracy or completeness of the information provided. By clicking on a donation link, you will leave our website and be subject to the policies and terms of the third-party site. Connect Utah Today is not responsible for the content or privacy practices of any linked site. This site does not provide legal, tax, or financial advice—please consult with an appropriate professional before making a donation or regarding the tax deductibility of your contribution.*/}
      {/*  <br />*/}
      {/*  <br />*/}
      {/*  <button onClick={closeDisclaimer} style={{ marginTop: "1em", padding: "0.5em 1.5em" }}>*/}
      {/*    Close*/}
      {/*  </button>*/}
      {/*</div>*/}
    </div>
  );
}
