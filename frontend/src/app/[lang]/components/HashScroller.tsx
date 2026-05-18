"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const MAX_WAIT_MS = 4000;
const POLL_INTERVAL_MS = 60;

function scrollToHash() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;

  const id = decodeURIComponent(hash.slice(1));
  const start = performance.now();

  const tryScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (performance.now() - start < MAX_WAIT_MS) {
      window.setTimeout(tryScroll, POLL_INTERVAL_MS);
    }
  };

  tryScroll();
}

export default function HashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [pathname]);

  return null;
}
