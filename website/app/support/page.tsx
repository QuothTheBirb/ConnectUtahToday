"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

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
  const disclaimerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && document.querySelector(".gfm-embed")) {
      const existing = document.querySelector('script[src*="gofundme.com/static/js/embed.js"]');
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://www.gofundme.com/static/js/embed.js";
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const disclaimer = disclaimerRef.current;
      const disclaimerLink = document.getElementById("disclaimer-link");
      if (
        disclaimer &&
        disclaimer.style.display === "block" &&
        !disclaimer.contains(e.target as Node) &&
        e.target !== disclaimerLink
      ) {
        disclaimer.style.display = "none";
      }
    }
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  function openDisclaimer(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (disclaimerRef.current) {
      disclaimerRef.current.style.display = "block";
    }
  }
  function closeDisclaimer() {
    if (disclaimerRef.current) {
      disclaimerRef.current.style.display = "none";
    }
  }

  return (
    <div>
      <Head>
        <title>Support a Cause</title>
      </Head>
      <nav>
        <Link href="/">Home</Link> | <Link href="/calendar">Calendar</Link> |{" "}
        <Link href="/events">Events</Link> | <Link href="/volunteer">Volunteering</Link> |{" "}
        <Link href="/support">Support a Cause</Link> | <Link href="/latest-updates">Latest Updates</Link> |{" "}
        <Link href="/activism">Activism</Link>
      </nav>
      <main>
        <h1>Support a Cause</h1>
        <p>
          Below are causes endorsed by local organizations which you may choose to donate to. Click on a widget to learn more about the individual causes.{" "}
          <a href="#" id="disclaimer-link" style={{ textDecoration: "underline", cursor: "pointer" }} onClick={openDisclaimer}>
            Disclaimer
          </a>
          .
        </p>
        {gofundmeEmbeds.map((gfm) => (
          <section key={gfm.title} style={{ marginTop: "2em" }}>
            <h2>{gfm.title}</h2>
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                margin: "1em auto",
                padding: "2em",
                border: "2px dashed #ccc",
                textAlign: "center",
              }}
            >
              <div className="gfm-embed" data-url={gfm.url}></div>
            </div>
          </section>
        ))}
        {imageEmbeds.map((img) => (
          <section key={img.title} style={{ marginTop: "2em" }}>
            <h2>{img.title}</h2>
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                margin: "1em auto",
                textAlign: "left",
              }}
            >
              <img src={img.img} alt={img.alt} style={{ maxWidth: "100%", borderRadius: 8 }} />
            </div>
          </section>
        ))}
      </main>
      <div
        ref={disclaimerRef}
        id="disclaimer-popover"
        style={{
          display: "none",
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translate(-50%,0)",
          background: "#fff",
          border: "1px solid #888",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          padding: "2em",
          maxWidth: 500,
          zIndex: 1000,
          borderRadius: 8,
        }}
      >
        <strong>Disclaimer:</strong> Connect Utah Today provides links to third-party charitable organizations for your convenience. We do not collect or process donations directly; all donations are handled by the respective organizations. The inclusion of any link does not imply endorsement or recommendation. We make no representations about the accuracy or completeness of the information provided. By clicking on a donation link, you will leave our website and be subject to the policies and terms of the third-party site. Connect Utah Today is not responsible for the content or privacy practices of any linked site. This site does not provide legal, tax, or financial advice—please consult with an appropriate professional before making a donation or regarding the tax deductibility of your contribution.
        <br />
        <br />
        <button onClick={closeDisclaimer} style={{ marginTop: "1em", padding: "0.5em 1.5em" }}>
          Close
        </button>
      </div>
    </div>
  );
}