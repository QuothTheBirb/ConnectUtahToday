"use client"

import {PageHeading} from "@/components/PageHeading";
import {useEffect, useRef, useState} from "react";
import styles from './GoFundMeWidget.module.scss';

// Based on the GoFundMe embed script: https://www.gofundme.com/static/js/embed.js

// I'm not using GoFundMe's provided iframe script, since it's not compatible with Next.js rendering, like, at all.
// Functionally, this is about the same as their embed script, but with a few changes to improve scaling and prevent content overflow on mobile devices.
const GofundmeWidget = ({ url, title }: { url: string, title: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeWidth, setIframeWidth] = useState<number>(480); // 480px appears to be the standard/default width for most GoFundMe embeds.
  const [iframeHeight, setIframeHeight] = useState<number>(() => {
    // Initial height based on widget size in URL.
    if (url.includes('/widget/small')) return 70;
    if (url.includes('/widget/medium')) return 200;

    // Default to 500px if the widget size is large or unspecified.
    return 500;
  });
  const [scale, setScale] = useState(1);

  // Update iframe size on page load.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin === 'https://www.gofundme.com' &&
        event.data &&
        event.data.type === 'gfm-embed-widget-resize' &&
        iframeRef.current &&
        iframeRef.current.contentWindow === event.source
      ) {
        if (event.data.offsetWidth) {
          setIframeWidth(event.data.offsetWidth);
        }

        if (event.data.offsetHeight) {
          setIframeHeight(event.data.offsetHeight);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [])

  // Handle responsive scaling on mobile.
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;

        if (containerWidth < iframeWidth) {
          const newScale = containerWidth / iframeWidth;

          setScale(newScale);
        } else {
          setScale(1);
        }
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [iframeWidth]);

  return (
    <section className={styles.section}>
      <PageHeading heading={'h2'}>{title}</PageHeading>
      <div
        ref={containerRef}
        className={styles.container}
        style={{
          maxWidth: `${iframeWidth}px`,
          height: `${iframeHeight * scale}px`,
        }}
      >
        <iframe
          ref={iframeRef}
          src={url}
          className={styles.iframe}
          style={{
            width: `${iframeWidth}px`,
            height: `${iframeHeight}px`,
            transform: scale < 1 ? `scale(${scale})` : 'none',
          }}
          title={title}
          sandbox={'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms'}
          referrerPolicy={'no-referrer'}
          scrolling={'no'}
        />
      </div>
    </section>
  );
}
export default GofundmeWidget
