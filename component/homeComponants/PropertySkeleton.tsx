import React from "react";

const PropertySkeleton = () => (
    <div className="w-80 min-w-[320px] bg-white rounded-xl shadow-md p-4 animate-pulse mx-auto">
        <div className="w-full h-56 bg-gray-300 rounded-lg mb-4" />
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-1/3 mt-4" />
    </div>
);

export default PropertySkeleton;