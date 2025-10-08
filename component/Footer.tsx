import React from 'react'
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#f9f5f1] text-gray-800 py-12 md:py-20 lg:py-16">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start md:mb-9">
        {/* Logo */}
        <div className="mb-6 md:mb-0">
          <Link href="/" className="flex items-center gap-2">
            <img src="/f2logo.png" alt="Logo" className="h-[60px] w-[70px]" />
            <span className="text-gray-600 font-bold text-lg">
              F2<span className="text-teal-400">Realtors</span>
            </span>
          </Link>
        </div>

        {/* About Us */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl mb-4">About Us</h2>
          <p className="text-gray-600">
            At F2 Realtors, we pride ourselves on being a trusted and reputable
            name in the F2 Realtors industry with years of experience.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl mb-4">Contact Info</h2>
          <p className="text-teal-600">
            F2 Fintech Pvt Ltd, A-25, M-1 Arv Park, A-Block, Sector 63, Noida
          </p>
          <p className="text-teal-600">contact@info.com</p>
          <p className="text-teal-600">+918810600135</p>
          <span className="text-[#f9f5f1] text-[5px] hover:text-gray-300">4BU24R</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-[#f9f5f1] border-t border-gray-200 mt-1 pt-1 sm:mt-12 sm:pt-6">

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-col lg:flex-row flex-wrap items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-lg text-gray-600 text-center w-full md:text-center lg:text-left mt-1 lg:w-auto">
            Copyright © 2025{" "}
            <span>
              F2<span className="text-teal-600">Realtors</span>
            </span>
          </p>

          {/* Social Icons */}
          <div className="flex space-x-6 text-black text-xl justify-center w-full md:justify-center lg:w-auto mt-4 md:mt-2 md:mb-1  lg:mt-0">
            <i className="fab fa-twitter"></i>
            <i className="fab fa-pinterest"></i>
            <i className="fab fa-youtube"></i>
            <i className="fab fa-instagram"></i>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
