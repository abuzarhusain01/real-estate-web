import React from "react";

const AboutSection = () => {
    return (
        <section className="bg-white font-sans py-16 px-4 md:px-10 max-w-[92%] mx-auto rounded-2xl">
            <div className="flex flex-col md:flex-row items-start gap-10">
                <div className="md:w-1/2 w-full overflow-hidden rounded-xl">
                    <img
                        src="/home.jpg"
                        alt="House"
                        className="w-full h-[300px] md:h-[500px] object-cover rounded-xl"
                        loading="lazy"
                    />
                </div>

                <div className="md:w-1/2 py-11 w-full">
                    <h2 className="text-3xl md:text-5xl font-sans text-gray-900 mb-4">
                        Connecting people with <br />
                        perfect homes is our passion.
                    </h2>
                    <div className="w-12 h-0.5 bg-teal-500 mb-6"></div>
                    <p className="text-gray-600 text-base leading-relaxed mb-6">
                        With a genuine passion for helping people find their dream homes,
                        we are dedicated to connecting buyers and sellers in the
                        {process.env.NEXT_PUBLIC_NAME},
                        market. Trust us to make your home buying or selling experience
                        seamless and satisfying.
                    </p>
                    {/* <button className="bg-teal-500 hover:bg-teal-600 text-white px-9 py-3 rounded-full text-sm font-semibold transition-colors">
                        READ MORE
                    </button> */}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;