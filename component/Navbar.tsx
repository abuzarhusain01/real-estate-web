
'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut, Heart } from "lucide-react";
import "./navbar.css";


export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("customerUser");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("customerUser");
        setUser(null);
        setIsLoggedIn(false);
        router.push("/auth/login");
    };


    const navLink = (href: string, label: string, isMobile: boolean = false) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 text-base transition-colors ${isActive ? "text-teal-400" : "text-white hover:text-teal-400"
                    }`}
            >
                {label}
            </Link>
        );
    };

    return (
        <nav className="bg-transparent text-white px-6 md:px-12 py-6 relative z-50">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
                    <img src="/f2logo.png" alt="Logo" className="h-8 w-auto" />
                    <span>
                        F2<span className="text-teal-400">Realtors</span>
                    </span>
                </Link>

                {/* Desktop Navigation - show only on lg+ */}
                <div className="hidden lg:flex gap-8 items-center text-base">
                    {navLink("/", "Home")}
                    {navLink("/about-us", "About")}
                    {navLink("/services", "Services")}
                    {navLink("/properties", "Properties")}
                    {navLink("/contact-us", "Contact")}
                    {navLink("/comparison", "Comparison")}
                    <Link href="/favourites" className="hover:text-teal-400 transition-colors">
                        <Heart className={`w-5 h-5 ${pathname === "/favourites" ? "text-teal-400" : "text-white"}`} />
                    </Link>
                </div>

                {/* Desktop Auth Section - show only on lg+ */}
                <div className="hidden lg:flex items-center gap-4 text-base">
                    {isLoggedIn ? (
                        <>
                            <span className="text-base">{user?.name || user?.email}</span>
                            <button onClick={handleLogout} className="flex cursor-pointer items-center hover:text-teal-400 transition-colors">
                                <LogOut className="w-4 h-4 mr-1" /> Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/auth/login" className="hover:text-teal-400 cursor-pointer transition-colors text-base">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile + Tablet Menu Toggle - show below lg */}
                <div className="lg:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white ">
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile + Tablet Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-gray-900 px-4 pb-4 pt-2 mt-2 rounded-xl space-y-1 max-h-[60vh] overflow-y-auto h-[37vh]
                  ">
                    {navLink("/", "Home", true)}
                    {navLink("/about-us", "About", true)}
                    {navLink("/services", "Services", true)}
                    {navLink("/properties", "Properties", true)}
                    {navLink("/contact-us", "Contact", true)}
                    {navLink("/comparison", "Comparison", true)}
                    <Link
                        href="/favourites"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2 text-base transition-colors ${pathname === "/favourites" ? "text-teal-400" : "text-white hover:text-teal-400"
                            }`}
                    >
                        <Heart className="w-4 h-4" />
                        Favourites
                    </Link>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-3 px-4 pt-2">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="Avatar"
                                className="w-6 h-6 rounded-full border"
                            />
                            <span className="text-base">{user?.name || user?.email}</span>
                            <button
                                onClick={handleLogout}
                                className="text-base text-red-400 cursor-pointer hover:underline flex items-center gap-1 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                router.push("/auth/login");
                                setIsMenuOpen(false);
                            }}
                            className="px-4 py-2 text-base cursor-pointer flex items-center gap-1 hover:text-teal-400 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Login
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
