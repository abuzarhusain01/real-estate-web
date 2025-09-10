import React from "react";

const AboutContentSection = () => {
    return (
        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md mx-4 md:mx-14 my-10 p-6 md:p-10">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
                <img
                    src="/home.jpg"
                    alt="About Us"
                    className="w-full h-full object-cover rounded-2xl"
                />
            </div>
            <div className="w-full md:w-1/2 md:pl-10">
                <p className="text-3xl md:text-5xl font-sans">About Us</p>
                <div className="w-12 h-0.5 bg-teal-600 my-6"></div>
                <p className="text-sm md:text-xl font-medium mb-4">
                    Welcome to {process.env.NEXT_PUBLIC_NAME}, your trusted partner in the world of {process.env.NEXT_PUBLIC_NAME}.
                    With a passion for connecting people with their dream properties,
                    we are dedicated to providing exceptional service and delivering outstanding results.
                </p>
                <p className="text-sm md:text-md text-gray-500">
                    At Real {process.env.NEXT_PUBLIC_NAME}, we pride ourselves on being a trusted and reputable name in the
                    {process.env.NEXT_PUBLIC_NAME} industry. With years of experience and a dedicated team of professionals,
                    we are committed to providing exceptional service to our clients. Whether you are buying,
                    selling, or renting, we are here to guide you throughout the entire process and ensure a
                    smooth and successful transaction.
                </p>
            </div>
        </div>
    );
};

export default AboutContentSection;