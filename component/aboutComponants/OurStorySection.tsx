import React from "react";

const OurStorySection = () => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg px-6 py-10 md:px-10 md:py-16 mx-4 md:mx-auto max-w-[92%]">
            <div className="md:w-1/2 w-full space-y-6 md:pr-10">
                <h1 className="text-3xl md:text-5xl">Our Story</h1>
                <div className="w-12 h-0.5 bg-teal-600"></div>
                <p className="text-lg md:text-xl text-black leading-relaxed">
                    Founded 10 years ago by John Oliver, our company was born out of a deep understanding of the challenges and frustrations that buyers, sellers, and investors often face in the market.
                </p>
                <p className="text-gray-700 text-md leading-relaxed">
                    {process.env.NEXT_PUBLIC_NAME} has been a leading player in the industry for over two decades. With an unwavering commitment to excellence and a customer-centric approach, we have earned the trust of thousands of clients. Our extensive experience, combined with our team of dedicated professionals, allows us to deliver unparalleled service and superior results. Whether you are buying, selling, or investing in {process.env.NEXT_PUBLIC_NAME}, you can rely on {process.env.NEXT_PUBLIC_NAME} to guide you every step of the way.
                </p>
            </div>
            <div className="md:w-1/2 w-full mt-8 md:mt-0">
                <img
                    src="/story.jpg"
                    alt="Our Story"
                    className="w-full h-[300px] md:h-[550px] object-cover rounded-xl"
                />
            </div>
        </div>
    );
};

export default OurStorySection;