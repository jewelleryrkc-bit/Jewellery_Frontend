/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import TopHeader from "./TopHeader";
import MiddleHeader from "./MiddleHeader";
import BottomHeader from "./BottomHeader";

interface HeaderProps {
  user?: { username: string };
}

export default function Header({ user }: HeaderProps) {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollPos = window.scrollY;
    let ticking = false;
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if(!ticking){
        window.requestAnimationFrame(() => {
          setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
          lastScrollPos = currentScrollPos;
          ticking = false;
        });
        ticking = true;
        return;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible]);

  return (
    // <header className="w-full top-0 left-0 right-0 bg-white shadow-md">
    <header className={`fixed top-0 left-0 right-0 w-full bg-white shadow-md z-[9999] transition-transform duration-300 ${
    visible ? "translate-y-0" : "-translate-y-full"
  }`}
  style={{ willChange: "transform" }}
  >
      <TopHeader />
      <MiddleHeader />
      <BottomHeader />
    </header>
  );
}

