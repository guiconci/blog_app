import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SunIcon, MoonIcon, BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/react/24/outline';

const Header = () => {
    // Set use state of darkMode and setDarkMode to false in the beginning
    const [darkMode, setDarkMode] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const location = useLocation();
    const { pathname } = location;

    // Set the theme in the first render, only runs on first load due to [] in the end
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const perfersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Check inital or preferred theme and set theme
        if (storedTheme === "dark" || (!storedTheme && perfersDark)) {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
        else {
            document.documentElement.classList.remove("dark");
            setDarkMode(false);
        }
        //this part sets it to run only once
    }, []);

    useEffect(() => {
        const onResize = () => setOpenMenu(false);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Toggle modes logic for the button
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        //add class dark to classlist
        document.documentElement.classList.toggle("dark");
        //change theme in local storage
        localStorage.setItem("theme", newMode ? "dark" : "light");
        //tells react about change
        setDarkMode(newMode);
    }

    const handleLogOut = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        console.log(localStorage.getItem("role"));
        window.location.href = "/";
    }

    return (
        <header className="sticky top-0 px-1 py-1 mb-2 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur shadow dark:shadow-white/10 transition-all duration-300">
            <div className="max-w-screen-lg mx-auto px-0.5 py-0.5 flex justify-between items-start">
                {/* Left: Your Name */}
                <div id="head-name" className="flex my-auto items-center text-lg font-semibold text-gray-800 dark:text-white">
                    Guilherme Conci Dev
                </div>

                {/* Right: Nav Links + Dark Mode Button */}
                <div className="flex items-center gap-4">
                    {/* Home button Logic */}
                    {pathname !== '/' && ( //It doesn't show on home page.
                        <nav className="flex items-center gap-4" >
                            <Link to="/" className="hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>Home</Link>
                        </nav>
                    )}
                    {/* Login Link only shows when not logged */}
                    {!localStorage.getItem("role") ?
                        (
                            <nav className="flex items-center gap-4" >
                                <Link to="/login" className="font-sans text-gray-700 dark:text-gray-300 hover:underline"
                                    style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Login
                                </Link>
                            </nav>
                        )
                        :
                        (
                            <nav className="hidden md:flex items-center gap-4">
                                <Link style={{ fontFamily: "'Inter', sans-serif" }} to="/author-home"
                                    className="text-gray-700 dark:text-gray-300 hover:underline">
                                    Manage
                                </Link>
                                <Link style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 300 }} onClick={handleLogOut}
                                    className="text-gray-700 dark:text-gray-300 hover:underline">
                                    Logout
                                </Link>
                            </nav>
                        )}
                    {/* Mobile hamburger */}
                    {localStorage.getItem("role") && (
                        <button
                            className="md:hidden p-2"
                            onClick={() => setOpenMenu(o => !o)}
                            aria-label="Toggle menu"
                        >
                            {/* simple hamburger icon */}
                            {openMenu ?
                                <BarsArrowUpIcon className="h-6 w-6" /> :
                                <BarsArrowDownIcon className="h-6 w-6" />}
                        </button>
                    )}

                    {/* Mobile menu panel */}
                    {openMenu && (
                        <nav className="absolute flex flex-col top-full right-0 mt-2 p-4 space-y-2 rounded 
                            bg-background-light/95 dark:bg-background-dark/95 shadow-2xl
                            shadow-black/50 dark:shadow-highlight2-dark/25 dark:shadow-sm md:hidden">
                            <Link style={{ fontFamily: "'Inter', sans-serif" }} to="/author-home" 
                            onClick={() => setOpenMenu(false)}
                            className="text-gray-700 dark:text-gray-300 hover:underline"
                            >
                                Manage
                            </Link>
                            <Link style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 300 }} onClick={handleLogOut}
                                className="text-gray-700 dark:text-gray-300 hover:underline">
                                Logout
                            </Link>
                        </nav>
                    )}

                    {/* Theme toggle */}
                    <button onClick={toggleDarkMode}
                        id="dark-toggle" className="text-gray-500 dark:text-white-300 text-xl" aria-label="Switch to dark mode">
                        {/* Sets Moon or Sun icons depending on the mode dark:light */}
                        {!darkMode ? (
                            <MoonIcon className="h-7 w-7 sm:h-6 sm:w-6" />
                        ) : (
                            <SunIcon className="h-7 w-7 sm:h-6 sm:w-6" />
                        )}
                    </button>
                </div>
            </div>
        </header >
    );
};

export default Header;