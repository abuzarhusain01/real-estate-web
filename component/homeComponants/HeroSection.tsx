"use client";
import React from "react";
import Image from "next/image";
import Navbar from "../Navbar";
//Use next/image for responsive, compressed, cached delivery.

const HeroSection = () => {
  return (
    <div className="relative w-full flex justify-center py-4">
      <div className="w-full px-4 md:px-14">

        <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[650px]">

          <Image
            src="/homepage.jpg"
            alt="Find your perfect property"
            fill
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/2w...AAA"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            className="object-cover"
          />


          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/35 pointer-events-none" />


          <div className="absolute top-0 left-0 w-full z-20">
            <Navbar />
          </div>


          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
            <div className="text-white max-w-4xl space-y-6">
              <p className="text-xl md:text-2xl drop-shadow-lg">
                Discover Your Dream Home with Us
              </p>
              <h1 className="text-2xl md:text-7xl font-sans drop-shadow-lg">
                Find the Perfect Property <br className="hidden md:block" /> for Your Lifestyle
              </h1>
              <br />
              <button
                type="button"
                className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer text-lg tracking-wide px-10 py-3 rounded-full mx-auto transition-colors"
              >
                Start Searching
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
