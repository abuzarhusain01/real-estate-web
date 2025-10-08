import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "../types";
import PropertySkeleton from "./PropertySkeleton";

interface AllPropertiesSectionProps {
    allProperties: Property[];
    propertiesLoading: boolean;
    allCurrentPage: number;
    allTotalPages: number;
    setAllCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    handleFavorite: (id: number, is_favourites: boolean) => void;
}

// Helper to handle numbers, lakh, crore inputs
const formatPrice = (price: string | number) => {
    if (typeof price === "number") return price.toLocaleString("en-IN");

    let numPrice = 0;
    const lowerPrice = price.toString().toLowerCase().trim();

    if (lowerPrice.includes("lakh")) {
        numPrice = parseFloat(lowerPrice.replace("lakh", "").trim()) * 100000;
    } else if (lowerPrice.includes("crore")) {
        numPrice = parseFloat(lowerPrice.replace("crore", "").trim()) * 10000000;
    } else {
        numPrice = parseFloat(lowerPrice);
    }

    return isNaN(numPrice) ? "0" : numPrice.toLocaleString("en-IN");
};

const AllPropertiesSection: React.FC<AllPropertiesSectionProps> = ({
    allProperties,
    propertiesLoading,
    allCurrentPage,
    allTotalPages,
    setAllCurrentPage,
    handleFavorite
}) => {
    return (
        <div className="px-6 py-10 md:px-11 max-w-[98%] md:py-25 mx-auto">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-5xl font-sans text-gray-900">All Properties</h2>
                <p className="mt-6 text-lg text-gray-600">
                    Browse all available properties and explore the best options for your needs.
                </p>
                <br />
                <div className="h-0.5 w-12 bg-teal-400 mx-auto" />
            </div>

            {/* Property Grid (same as Featured) */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertiesLoading ? (
                    Array.from({ length: 6 }).map((_, i) => <PropertySkeleton key={i} />)
                ) : (
                    allProperties.map((property) => (
                        <div
                            key={property.id}
                            className="bg-transparent rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <Link href={`/properties/detail/${property.id}`}>
                                <div className="relative h-60 w-full">
                                    <Image
                                        src={property.image || "/placeholder-property.jpg"}
                                        alt={property.name}
                                        fill
                                        className="object-cover rounded-xl"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFavorite(property.id, !property.is_favourites);
                                        }}
                                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition"
                                    >
                                        {property.is_favourites ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                className="w-5 h-5 text-red-500"
                                            >
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4 8 4 9.5 5 10 6.1 10.5 5 12 4 13.5 4 16 4 18 6 18 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                className="w-5 h-5 text-red-500"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.318 6.318a4.5 4.5 0 0 1 6.364 0L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 0 1 0-6.364z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="p-4">
                                    <p className="text-gray-600 text-sm mb-2">
                                        {property.location}
                                    </p>
                                    <h2 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                                        {property.name}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-2">
                                        {property.description}
                                    </p>
                                    <p className="mt-3 text-teal-600 text-lg font-bold">
                                        ₹{formatPrice(property.price)}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls (same as Featured) */}
            {!propertiesLoading && allTotalPages > 1 && (
                <div className="mt-10 flex justify-center space-x-4">
                    <button
                        onClick={() => setAllCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={allCurrentPage === 1}
                        className="px-4 py-2 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    >
                        Previous
                    </button>

                    {Array.from({ length: allTotalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => setAllCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${allCurrentPage === pageNum
                                ? "bg-teal-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        onClick={() => setAllCurrentPage(prev => Math.min(prev + 1, allTotalPages))}
                        disabled={allCurrentPage === allTotalPages}
                        className="px-4 py-2 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllPropertiesSection;
