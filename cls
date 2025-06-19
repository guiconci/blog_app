[33mcommit 4936fe9b1185e96e9e50e1eff03d725c44c1e730[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m)[m
Author: Guilherme Conci <guiconci@hotmail.com>
Date:   Thu Jun 19 23:39:40 2025 +0200

    Adjusted menu links and animations in header

[1mdiff --git a/client/src/App.jsx b/client/src/App.jsx[m
[1mindex a9e7797..f317bdf 100644[m
[1m--- a/client/src/App.jsx[m
[1m+++ b/client/src/App.jsx[m
[36m@@ -1,6 +1,7 @@[m
 import { Outlet, useLocation } from "react-router-dom";[m
 import { useUnsavedChanges } from "./context/unsavedChangesContext";[m
 import Header from "./components/Header";[m
[32m+[m[32mimport { useEffect } from "react";[m
 [m
 [m
 function App() {[m
[1mdiff --git a/client/src/components/Header.jsx b/client/src/components/Header.jsx[m
[1mindex 0b505fc..2c32711 100644[m
[1m--- a/client/src/components/Header.jsx[m
[1m+++ b/client/src/components/Header.jsx[m
[36m@@ -1,10 +1,14 @@[m
 import React, { useState, useEffect } from "react";[m
[31m-import { Link } from "react-router-dom";[m
[31m-import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';[m
[32m+[m[32mimport { Link, useLocation } from "react-router-dom";[m
[32m+[m[32mimport { SunIcon, MoonIcon, BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/react/24/outline';[m
 [m
 const Header = () => {[m
     // Set use state of darkMode and setDarkMode to false in the beginning[m
     const [darkMode, setDarkMode] = useState(false);[m
[32m+[m[32m    const [openMenu, setOpenMenu] = useState(false);[m
[32m+[m
[32m+[m[32m    const location = useLocation();[m
[32m+[m[32m    const { pathname } = location;[m
 [m
     // Set the theme in the first render, only runs on first load due to [] in the end[m
     useEffect(() => {[m
[36m@@ -42,41 +46,84 @@[m [mconst Header = () => {[m
     }[m
 [m
     return ([m
[31m-        <header className="sticky top-0 px-1 pb-[5px] mb-2 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur shadow dark:shadow-white/10 transition-all duration-300">[m
[32m+[m[32m        <header className="sticky top-0 px-1 py-1 mb-2 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur shadow dark:shadow-white/10 transition-all duration-300">[m
             <div className="max-w-screen-lg mx-auto px-0.5 py-0.5 flex justify-between items-start">[m
                 {/* Left: Your Name */}[m
[31m-                <div id="head-name" className="text-md font-semibold text-gray-800 dark:text-white">[m
[32m+[m[32m                <div id="head-name" className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">[m
                     Guilherme Conci Dev[m
                 </div>[m
 [m
                 {/* Right: Nav Links + Dark Mode Button */}[m
                 <div className="flex items-center gap-4">[m
[32m+[m[32m                    {/* Home button Logic */}[m
[32m+[m[32m                    {pathname !== '/' && ( //It doesn't show on home page.[m
[32m+[m[32m                        <nav className="flex items-center gap-4" >[m
[32m+[m[32m                            <Link to="/" className="hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>Home</Link>[m
[32m+[m[32m                        </nav>[m
[32m+[m[32m                    )}[m
                     {/* Login Link only shows when not logged */}[m
                     {!localStorage.getItem("role") ?[m
[31m-                        (<Link to="/login" className="text-gray-700 dark:text-gray-300 hover:underline">[m
[31m-                            Login[m
[31m-                        </Link>)[m
[32m+[m[32m                        ([m
[32m+[m[32m                            <nav className="flex items-center gap-4" >[m
[32m+[m[32m                                <Link to="/login" className="font-sans text-gray-700 dark:text-gray-300 hover:underline"[m
[32m+[m[32m                                    style={{ fontFamily: "'Inter', sans-serif" }}>[m
[32m+[m[32m                                    Login[m
[32m+[m[32m                                </Link>[m
[32m+[m[32m                            </nav>[m
[32m+[m[32m                        )[m
                         :[m
                         ([m
[31m-                            <div className="flex items-center gap-4">[m
[31m-                                < a style={{ fontFamily: "'Inter', sans-serif" }} href="/author-home"[m
[32m+[m[32m                            <nav className="hidden md:flex items-center gap-4">[m
[32m+[m[32m                                <Link style={{ fontFamily: "'Inter', sans-serif" }} to="/author-home"[m
                                     className="text-gray-700 dark:text-gray-300 hover:underline">[m
[31m-                                    Projects Dashboard[m
[31m-                                </a>[m
[31m-                                <button style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 300 }} onClick={handleLogOut}[m
[32m+[m[32m                                    Manage[m
[32m+[m[32m                                </Link>[m
[32m+[m[32m                                <Link style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 300 }} onClick={handleLogOut}[m
                                     className="text-gray-700 dark:text-gray-300 hover:underline">[m
                                     Logout[m
[31m-                                </button>[m
[31m-                            </div>[m
[32m+[m[32m                                </Link>[m
[32m+[m[32m                            </nav>[m
                         )}[m
[32m+[m[32m                    {/* Mobile hamburger */}[m
[32m+[m[32m                    {localStorage.getItem("role") && ([m
[32m+[m[32m                        <button[m
[32m+[m[32m                            className="md:hidden p-2"[m
[32m+[m[32m                            onClick={() => setOpenMenu(o => !o)}[m
[32m+[m[32m                            aria-label="Toggle menu"[m
[32m+[m[32m                        >[m
[32m+[m[32m                            {/* simple hamburger icon */}[m
[32m+[m[32m                            {openMenu ?[m[41m [m
[32m+[m[32m                                <BarsArrowUpIcon className="h-6 w-6"/> :[m[41m [m
[32m+[m[32m                                <BarsArrowDownIcon className="h-6 w-6"/>}[m
[32m+[m[32m                        </button>[m
[32m+[m[32m                    )}[m
[32m+[m[41m                    [m
[32m+[m
[32m+[m
[32m+[m[32m                    {/* Mobile menu panel */}[m
[32m+[m[32m                    {openMenu && ([m
[32m+[m[32m                        <nav className="absolute flex flex-col top-full right-0 mt-2 p-4 space-y-2 rounded[m[41m [m
[32m+[m[32m                            bg-background-light/95 dark:bg-background-dark/95 shadow-2xl[m
[32m+[m[32m                            shadow-black/50 dark:shadow-highlight2-dark/25 dark:shadow-sm md:hidden">[m
[32m+[m[32m                            <Link style={{ fontFamily: "'Inter', sans-serif" }} to="/author-home"[m
[32m+[m[32m                                className="text-gray-700 dark:text-gray-300 hover:underline">[m
[32m+[m[32m                                Manage[m
[32m+[m[32m                            </Link>[m
[32m+[m[32m                            <Link style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 300 }} onClick={handleLogOut}[m
[32m+[m[32m                                className="text-gray-700 dark:text-gray-300 hover:underline">[m
[32m+[m[32m                                Logout[m
[32m+[m[32m                            </Link>[m
[32m+[m[32m                        </nav>[m
[32m+[m[32m                    )}[m
[32m+[m
                     {/* Theme toggle */}[m
                     <button onClick={toggleDarkMode}[m
                         id="dark-toggle" className="text-gray-500 dark:text-white-300 text-xl" aria-label="Switch to dark mode">[m
                         {/* Sets Moon or Sun icons depending on the mode dark:light */}[m
[31m-                        {darkMode ? ([m
[31m-                            <MoonIcon className="h-5 w-5" />[m
[32m+[m[32m                        {!darkMode ? ([m
[32m+[m[32m                            <MoonIcon className="h-7 w-7 sm:h-6 sm:w-6" />[m
                         ) : ([m
[31m-                            <SunIcon className="h-5 w-5" />[m
[32m+[m[32m                            <SunIcon className="h-7 w-7 sm:h-6 sm:w-6" />[m
                         )}[m
                     </button>[m
                 </div>[m
[1mdiff --git a/client/src/hooks/useTipTapEditor.js b/client/src/hooks/useTipTapEditor.js[m
[1mindex 64db2c1..8c3effe 100644[m
[1m--- a/client/src/hooks/useTipTapEditor.js[m
[1m+++ b/client/src/hooks/useTipTapEditor.js[m
[36m@@ -70,7 +70,7 @@[m [mexport function useTiptapEditor(initialContent, initialImages = []) {[m
 [m
     const insertImage = useCallback((url, public_id) => {[m
         if (!editor?.commands) return;[m
[31m-        editor.chain().focus().setImage({ src: url, width: 750, style: "border-radius: 5px; display: block; margin: 0 auto;" }).run();[m
[32m+[m[32m        editor.chain().focus().setImage({ src: url, width: 750, style: "border-radius: 5px; display: block; margin: 8px auto;" }).run();[m
         if (public_id) setUploadedImages(prev => [...prev, { url, public_id }]); //only add to array, images with public id meaning they were uploded.[m
     }, [editor]);[m
 [m
[1mdiff --git a/client/tailwind.config.js b/client/tailwind.config.js[m
[1mindex 6a59cf0..56fccee 100644[m
[1m--- a/client/tailwind.config.js[m
[1m+++ b/client/tailwind.config.js[m
[36m@@ -42,11 +42,12 @@[m [mmodule.exports = {[m
             code: { color: theme('colors.textMain.light') },[m
             iframe: {[m
               display: 'block',[m
[31m-              margin: '0 auto',[m
[31m-              maxWidth: '700px',[m
[32m+[m[32m              margin: '8px auto',[m
[32m+[m[32m              maxWidth: '750px',[m
               width: '100%',[m
               /* let the browser keep its intrinsic ratio: */[m
               aspectRatio: '16/9',[m
[32m+[m[32m              borderRadius: '5px'[m
             },[m
           },[m
         },[m
