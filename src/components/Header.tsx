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
  let lastScrollY = window.scrollY;
  const THRESHOLD = 25;

  const handleScroll = () => {
    const current = window.scrollY;

    if (current < 0.5) {
      setVisible(true);
    } else if (current > lastScrollY) {
      setVisible(false); // scrolling down
    } else if (lastScrollY - current > THRESHOLD) {
      setVisible(true); // strong scroll up
    }

    lastScrollY = current;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    // <header className="w-full top-0 left-0 right-0 bg-white shadow-md">
    <header  className={`fixed top-0 left-0 right-0 w-full bg-white shadow-md z-[9999]
      transition-transform duration-300 ${
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

