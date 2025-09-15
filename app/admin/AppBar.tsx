import React, { useState } from 'react'
import Link from 'next/link';
import { Menu, X } from "lucide-react";

const AppBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLink = (href, label) => (
        <Link
            href={href}
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-2 text-base text-gray-800 hover:text-teal-600 transition-colors"
        >
            {label}
        </Link>
    );

    return (
        <nav className="bg-[#f8f4f0]  text-gray-800 px-6 md:px-12 py-6 relative z-50">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                    <img src="/f2logo.png" alt="Logo" className="h-8 w-auto" />
                    <span>
                        F2<span className="text-teal-600">Realtors</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-8 items-center text-base">
                    {navLink("/admin/properties", "Properties")}
                    {navLink("/admin/agent", "Agent")}
                    {navLink("/admin/sales", "Leads")}
                    {navLink("/admin/bank", "Bank Loans")}
                    {navLink("/admin/category", "Categories")}
                </div>

                {/* Desktop Social Icons */}
                <div className="hidden md:flex items-center gap-4 text-gray-800 text-lg">
                    <i className="fab fa-twitter hover:text-teal-600 transition-colors cursor-pointer"></i>
                    <i className="fab fa-pinterest hover:text-teal-600 transition-colors cursor-pointer"></i>
                    <i className="fab fa-youtube hover:text-teal-600 transition-colors cursor-pointer"></i>
                    <i className="fab fa-instagram hover:text-teal-600 transition-colors cursor-pointer"></i>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-900/90 px-4 pb-4 pt-2 mt-2 rounded-xl space-y-2">
                    {navLink("/admin/properties", "Properties")}
                    {navLink("/admin/agent", "Agent")}
                    {navLink("/admin/sales", "Leads")}
                    {navLink("/admin/bank", "Bank Loans")}
                    {navLink("/admin/category", "Categories")}

                    {/* Mobile Social Icons */}
                    <div className="flex justify-center gap-6 pt-4 pb-2 text-white text-lg">
                        <i className="fab fa-twitter hover:text-teal-400 transition-colors cursor-pointer"></i>
                        <i className="fab fa-pinterest hover:text-teal-400 transition-colors cursor-pointer"></i>
                        <i className="fab fa-youtube hover:text-teal-400 transition-colors cursor-pointer"></i>
                        <i className="fab fa-instagram hover:text-teal-400 transition-colors cursor-pointer"></i>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default AppBar