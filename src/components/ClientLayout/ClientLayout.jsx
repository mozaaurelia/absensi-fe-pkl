"use client";

import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen/SplashScreen";

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

      <main
        className={`transition-all duration-700 ${
          showSplash ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {children}
      </main>
    </>
  );
}