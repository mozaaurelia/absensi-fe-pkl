"use client";

import { useEffect, useState } from "react";
import SplashScreen from "@/components/common/SplashScreen";

export default function ClientLayout({ children }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    document.body.style.overflow = showSplash ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSplash]);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <main className={showSplash ? "pointer-events-none" : ""}>{children}</main>
    </>
  );
}