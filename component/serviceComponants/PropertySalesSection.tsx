import React from "react";

interface PropertySalesSectionProps {
    image: string;
    title: string;
    description: string;
}

const PropertySalesSection: React.FC<PropertySalesSectionProps> = ({
    image,
    title,
    description
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md mx-4 md:mx-14 my-10 p-6 md:p-10">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
                <img
                    src={image}
                    alt="About Us"
                    className="w-full h-full object-cover rounded-2xl"
                />
            </div>
            <div className="w-full md:w-1/2 md:pl-10">
                <p className="text-3xl px-7 md:text-4xl">{title}</p>
                <div className="w-12 ml-7 h-0.5 bg-teal-600 my-6"></div>
                <p className="text-md text-gray-700 px-7 font-medium mb-4">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default PropertySalesSection;