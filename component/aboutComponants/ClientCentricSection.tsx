import React from "react";

const ClientCentricSection = () => {
    return (
        <div className="flex flex-col items-center text-center px-6 py-16 bg-[#f9f6f2]">
            <p className="text-sm uppercase tracking-widest text-teal-600 mb-2">
                Client-Centric Approach
            </p>
            <div className="w-12 h-0.5 bg-teal-600 my-6"></div>
            <h2 className="text-2xl md:text-5xl text-black leading-snug">
                Our clients are our priority. Exceptional customer <br className="hidden md:block" />
                service and personalized experiences define our <br className="hidden md:block" />
                company culture.
            </h2>
        </div>
    );
};

export default ClientCentricSection;