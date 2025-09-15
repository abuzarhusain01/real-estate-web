import React from "react";
import Link from "next/link";
import { Property } from "../types";
import PropertyCard from "./PropertyCard";
import PropertySkeleton from "./PropertySkeleton";

interface AllPropertiesSectionProps {
    allProperties: Property[];
    propertiesLoading: boolean;
    allCurrentPage: number;
    allTotalPages: number;
    setAllCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    handleFavorite: (id: number, is_favourites: boolean) => void;
}

const AllPropertiesSection: React.FC<AllPropertiesSectionProps> = ({
    allProperties,
    propertiesLoading,
    allCurrentPage,
    allTotalPages,
    setAllCurrentPage,
    handleFavorite
}) => {
    return (
        <div className="px-6 font-sans py-4 md:px-11 max-w-[98%] md:py-4 mx-auto">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-5xl text-gray-900">All Properties</h2>
                <p className="mt-4 text-sm text-gray-600">Browse all available properties.</p>
                <br />
                <div className="h-0.5 w-12 bg-teal-400 mx-auto" />
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertiesLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <PropertySkeleton key={i} />
                    ))
                ) : (
                    allProperties.map((property) => (
                        <Link href={`/properties/detail/${property.id}`} key={property.id}>
                            <PropertyCard
                                property={property}
                                handleFavorite={handleFavorite}
                            />
                        </Link>
                    ))
                )}
            </div>

            {!propertiesLoading && allTotalPages > 1 && (
                <div className="mt-10 flex justify-center space-x-4">
                    <button
                        onClick={() => setAllCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={allCurrentPage === 1}
                        className="px-4 py-2 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    >
                        Previous
                    </button>

                    {Array.from({ length: allTotalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => setAllCurrentPage(pageNum)}
                            className={`px-4 py-2 cursor-pointer rounded-md transition-colors ${allCurrentPage === pageNum
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
                        className="px-4 py-2 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllPropertiesSection;