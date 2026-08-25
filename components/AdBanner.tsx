"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Google AdSense ad banner component.
 * Usage: <AdBanner slot="1234567890" format="auto" />
 *
 * The AdSense script is loaded globally in layout.tsx.
 * Replace `slot` values with your actual AdSense ad unit IDs.
 */
export default function AdBanner({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style,
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
      pushed.current = true;
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`ad-container my-4 ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client="ca-pub-6216304334889617"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}