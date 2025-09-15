import React from "react";

interface PropertyRentalsSectionProps {
    image: string;
    title: string;
    description: string;
}

const PropertyRentalsSection: React.FC<PropertyRentalsSectionProps> = ({
    image,
    title,
    description
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg px-6 py-10 md:px-10 md:py-16 mx-4 md:mx-auto max-w-[92%]">
            <div className="md:w-1/2 w-full space-y-6 md:pr-10">
                <h1 className="text-3xl px-7 md:text-4xl">{title}</h1>
                <div className="w-12 ml-7 h-0.5 bg-teal-600"></div>
                <p className="text-gray-700 px-7 leading-relaxed">
                    {description}
                </p>
            </div>
            <div className="md:w-1/2 w-full mt-8 md:mt-0">
                <img
                    src={image}
                    alt="Our Story"
                    className="w-full h-[300px] md:h-[550px] object-cover rounded-xl"
                />
            </div>
        </div>
    );
};

export default PropertyRentalsSection;