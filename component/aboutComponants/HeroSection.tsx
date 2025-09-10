import React from "react";
import Navbar from '@/component/Navbar';

const AboutHeroSection = () => {
    return (
        <div className="relative w-full h-auto flex justify-center py-4">
            <div className="w-full px-4 md:px-14">
                <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[650px]">
                    <img
                        src="/alex.jpg"
                        alt="Background"
                        className="w-full h-full object-cover filter brightness-45"
                    />
                    <div className="absolute top-0 left-0 w-full z-20">
                        <Navbar />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                        <div className="text-white max-w-4xl space-y-6">
                            <p className="text-xl md:text-2xl drop-shadow-lg">About</p>
                            <h1 className="text-4xl md:text-7xl font-sans leading-tight drop-shadow-lg">
                                Discover Our Story and <br className="hidden md:block" /> Expertise
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutHeroSection;