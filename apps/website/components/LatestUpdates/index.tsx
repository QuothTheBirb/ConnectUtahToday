'use client';

import {useEffect, useRef} from "react";
import {strippedEmbedsHtml} from "@/components/LatestUpdates/strippedEmbedsHtml";

export const LatestUpdates = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.querySelector('script[src="//www.instagram.com/embed.js"]')) {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, []);

  useEffect(() => {
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  });

  return (
      <div
        ref={containerRef}
        style={{ marginTop: "2em", display: "flex", flexDirection: "column", alignItems: "center" }}
        dangerouslySetInnerHTML={{ __html: strippedEmbedsHtml }}
      />
  )
}
