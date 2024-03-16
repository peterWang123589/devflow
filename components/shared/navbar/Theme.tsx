"use client";

import React, { useEffect, useState } from "react";

import { useTheme } from "@/context/ThemeProvider";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";
import { themes } from "@/constants";
const preferDark = () => {
  return window && window.matchMedia("(prefers-color-scheme: dark)").matches;
};
const getMode = () => {
  return window && window.localStorage.getItem("theme");
};
const ThemeIcon = ({ mode }: { mode: string }) => {
  const [logo,setLogo] = useState("")



useEffect(()=>{

  const theme = getMode();
  if (theme) {
    
    setLogo(theme === "light" ? "sun.svg" : "moon.svg")
  } else {
    setLogo(preferDark() ? "moon.svg" : "sun.svg")
  
  }
},[mode])
  return (
  <Image
      src={`/assets/icons/${logo}`}
      alt="sun"
      width={20}
      height={20}
      className="active-theme"
    />
  );
};
const Theme = () => {
  const { mode, setMode } = useTheme();



  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
          <ThemeIcon mode={mode} />
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border py-2 dark:border-dark-400 dark:bg-dark-300">
          {themes.map((item) => (
            <MenubarItem
              key={item.value}
              className="flex items-center gap-4 px-2.5 py-2 dark:focus:bg-dark-400"
              onClick={() => {
                if (item.value !== "system") {
                  localStorage.theme = item.value;
                } else {
                  localStorage.removeItem("theme");
                }
                setMode(item.value);
              }}
            >
              <Image
                src={item.icon}
                alt={item.value}
                width={16}
                height={16}
                className={`${mode === item.value && "active-theme"}`}
              />
              <p
                className={`body-semibold text-light-500 ${
                  mode === item.value
                    ? "text-primary-500"
                    : "text-dark100_light900"
                }`}
              >
                {item.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Theme;
