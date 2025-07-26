"use client";
import React, { useState, useEffect } from "react";

const ToggleSwitcher = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false); // لتحديد إذا تم تحميل الثيم

  useEffect(() => {
    // قراءة الثيم المخزن أول ما الكومبوننت يركب
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDark(savedTheme === "dark");
    document.documentElement.setAttribute("data-theme", savedTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // نتأكد إن المكون جاهز قبل التغيير
    const theme = isDark ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [isDark, mounted]);

  // منع أي فلاش عن طريق إخفاء الزر قبل ما نحمل الثيم
  if (!mounted) return <div style={{ width: "3em", height: "1.5em" }} />;

  return (
    <label className="relative inline-block w-[3em] h-[1.5em]">
      <input
        type="checkbox"
        checked={isDark}
        onChange={() => setIsDark(!isDark)}
        className="opacity-0 w-0 h-0 peer"
      />
      <span
        className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#2a2a2a] rounded-4xl overflow-hidden transition-all duration-400 peer-checked:bg-[#00a6ff]
          before:content-[''] before:absolute before:h-[1em] before:w-[1em] before:rounded-3xl before:left-[0.3em] before:bottom-[0.3em] before:transition-all before:duration-400 before:ease-[cubic-bezier(0.81,-0.04,0.38,1.5)] before:shadow-[inset_6px_-3px_0px_0px_#fff]
          peer-checked:before:translate-x-[1.3em] peer-checked:before:shadow-[inset_12px_-3px_0px_12px_#ffcf48]"
      >
        <div className="bg-white rounded-full absolute w-[4px] h-[4px] left-[2em] top-[0.4em] transition-all duration-400 peer-checked:opacity-0"></div>
        <div className="bg-white rounded-full absolute w-[4px] h-[4px] left-[1.8em] top-[1em] transition-all duration-400 peer-checked:opacity-0"></div>
        <div className="bg-white rounded-full absolute w-[4px] h-[4px] left-[2.5em] top-[0.8em] transition-all duration-400 peer-checked:opacity-0"></div>
      </span>
    </label>
  );
};

export default ToggleSwitcher;
