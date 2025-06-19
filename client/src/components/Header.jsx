import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Header = () => {
    // Set use state of darkMode and setDarkMode to false in the beginning
    const [darkMode, setDarkMode] = useState(false);

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
        <header className="sticky top-0 px-1 pb-[5px] mb-2 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur shadow dark:shadow-white/10 transition-all duration-300">
            <div className="max-w-screen-lg mx-auto px-0.5 py-0.5 flex justify-between items-start">
                {/* Left: Your Name */}
                <div id="head-name" className="text-md font-semibold text-gray-800 dark:text-white">
                    Guilherme Conci Dev
                </div>

                {/* Right: Nav Links + Dark Mode Button */}
                <div className="flex items-center gap-4">
                    {/* Login Link only shows when not logged */}
                    {!localStorage.getItem("role") ?
                        (<Link to="/login" className="text-gray-700 dark:text-gray-300 hover:underline">
                            Login
                        </Link>)
                        :
                        (
                            <div className="flex items-center gap-4">
                                < a style={{ fontFamily: "'Inter', sans-serif" }} href="/author-home"
                                    className="text-gray-700 dark:text-gray-300 hover:underline">
                                    Projects Dashboard
                                </a>
                                <button style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 300 }} onClick={handleLogOut}
                                    className="text-gray-700 dark:text-gray-300 hover:underline">
                                    Logout
                                </button>
                            </div>
                        )}
                    {/* Theme toggle */}
                    <button onClick={toggleDarkMode}
                        id="dark-toggle" className="text-gray-500 dark:text-white-300 text-xl" aria-label="Switch to dark mode">
                        {/* Sets Moon or Sun icons depending on the mode dark:light */}
                        {darkMode ? (
                            <MoonIcon className="h-5 w-5" />
                        ) : (
                            <SunIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>
        </header >
    );
};

export default Header;