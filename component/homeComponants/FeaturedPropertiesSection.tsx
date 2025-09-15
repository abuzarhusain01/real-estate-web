import React from "react";
import Link from "next/link";
import { Property } from "../types";
import PropertyCard from "./PropertyCard";
import PropertySkeleton from "./PropertySkeleton";

interface FeaturedPropertiesSectionProps {
    featuredProperties: Property[];
    propertiesLoading: boolean;
    featuredCurrentPage: number;
    featuredTotalPages: number;
    setFeaturedCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    handleFavorite: (id: number, is_favourites: boolean) => void;
}

const FeaturedPropertiesSection: React.FC<FeaturedPropertiesSectionProps> = ({
    featuredProperties,
    propertiesLoading,
    featuredCurrentPage,
    featuredTotalPages,
    setFeaturedCurrentPage,
    handleFavorite
}) => {
    return (
        <div className="px-6 py-10 md:px-11 max-w-[98%] md:py-25 mx-auto">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-5xl font-sans text-gray-900">Featured Properties</h2>
                <p className="mt-6 text-lg text-gray-600">
                    Discover our hand-picked selection of top-notch properties with outstanding features,
                </p>
                <p className="text-lg text-gray-600">
                    guaranteed to meet your {process.env.NEXT_PUBLIC_NAME} needs and exceed your expectations.
                </p>
                <br />
                <div className="h-0.5 w-12 bg-teal-400 mx-auto" />
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertiesLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <PropertySkeleton key={i} />
                    ))
                ) : (
                    featuredProperties.map((property) => (
                        <Link href={`/properties/detail/${property.id}`} key={property.id}>
                            <PropertyCard
                                property={property}
                                handleFavorite={handleFavorite}
                            />
                        </Link>
                    ))
                )}
            </div>

            {!propertiesLoading && featuredTotalPages > 1 && (
                <div className="mt-10 flex  justify-center space-x-4">
                    <button
                        onClick={() => setFeaturedCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={featuredCurrentPage === 1}
                        className="px-4 py-2 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    >
                        Previous
                    </button>

                    {Array.from({ length: featuredTotalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => setFeaturedCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${featuredCurrentPage === pageNum
                                ? "bg-teal-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        onClick={() => setFeaturedCurrentPage(prev => Math.min(prev + 1, featuredTotalPages))}
                        disabled={featuredCurrentPage === featuredTotalPages}
                        className="px-4 py-2 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default FeaturedPropertiesSection;