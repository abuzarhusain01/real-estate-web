import React from "react";

const services = [
    {
        number: "01",
        title: "Property Sales",
        description: "Find your dream home with F2Realtors - our expert team will guide you through the process and ensure a smooth transaction.",
    },
    {
        number: "02",
        title: "Property Rentals",
        description: "Find your dream rental property with F2Realtors, offering a variety of options to suit your needs and preferences.",
    },
    {
        number: "03",
        title: "Property Management",
        description: "Trust F2Realtors to handle the day-to-day management of your property, maximizing its value and minimizing your stress.",
    },
    {
        number: "04",
        title: "Lucrative Investments",
        description: "F2Realtors presents lucrative investment opportunities in the F2Realtors market, providing high returns on investments.",
    },
];

const WhatWeDoSection = () => {
    return (
        <div className="bg-white px-6 py-10 md:px-10 max-w-[92%] md:py-25 mx-auto rounded-2xl text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-sans text-black mb-4">What We Do</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-10">
                Simplifying the journey of buying, selling, and renting properties. Our expert
                team provides comprehensive {process.env.NEXT_PUBLIC_NAME} solutions tailored to your needs
            </p>
            <div className="h-0.5 w-12 bg-teal-400 mx-auto mb-16" />
            <div className="md:grid md:grid-cols-4 gap-10 cursor-pointer text-left flex overflow-x-auto snap-x snap-mandatory px-4">
                {services.map((item, index) => (
                    <div
                        key={index}
                        className="snap-start shrink-0 w-[80%] sm:w-[60%] md:w-auto mb-6 md:mb-0 p-5 rounded-xl transition-all duration-300 hover:bg-teal-50 hover:shadow-lg"
                    >
                        <p className="text-teal-500 font-medium mb-4">{item.number}</p>
                        <h3 className="text-xl font-sans text-black mb-4">{item.title}</h3>
                        <p className="text-gray-500">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhatWeDoSection;