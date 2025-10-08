"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";

interface SimilarProperty {
    id: number;
    image: string;
    name: string;
    price: number;
    bedrooms: string;
    bathrooms: string;
    balconies: string;
}

interface Property {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    owner_name: string;
    location: string;
    owner_contact: string;
    status: string;
    images: string[];
    bedrooms: string;
    bathrooms: string;
    balconies: string;
    furnishing: string;
    carpet_area: string;
    floor: string;
    flooring: string;
    lifts: string;
    project: string;
    transaction_type: string;
    facing: string;
    address: string;
    overlooking: string;
    landmarks: string;
    booking_amount: string;
    price_breakup: string;
    flat: string;
    shopping_centers: string;
    educational_institute: string;
    nearby_localities: string;
    home_loans: string;
    emi: string;
}

interface SimilarPropertiesProps {
    similarProducts: SimilarProperty[];
    hasMoreSimilar: boolean;
    onLoadMore: () => void;
    onAddToCompare: (property: Property) => void;
}

function CompareIcon({
    onClick,
    isHovered,
    onMouseEnter,
    onMouseLeave
}: {
    onClick: (e: React.MouseEvent) => void;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) {
    return (
        <div className="relative inline-block">
            <button
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-110 duration-200"
            >
                <Plus size={16} />
            </button>
            {isHovered && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
                    Add to Compare
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
            )}
        </div>
    );
}

export default function SimilarProperties({
    similarProducts,
    hasMoreSimilar,
    onLoadMore,
    onAddToCompare
}: SimilarPropertiesProps) {
    const [hoveredCompareButton, setHoveredCompareButton] = useState<string | null>(null);

    if (similarProducts.length === 0) return null;

    return (
        <div className="w-full max-w-[92%] mx-auto mt-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                Similar Properties
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {similarProducts.map((prod) => (
                    <Link
                        key={prod.id}
                        href={`/properties/detail/${prod.id}`}
                        className="bg-white text-black p-3 sm:p-4 rounded-xl shadow transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-50 flex flex-col"
                    >
                        <Image
                            src={prod.image}
                            alt={prod.name}
                            width={200}
                            height={200}
                            className="h-36 sm:h-40 w-full object-cover rounded-md"
                        />
                        <p className="mt-2 text-sm sm:text-base font-semibold truncate">{prod.name}</p>
                        <p className="text-black font-medium mb-2 text-sm sm:text-base">
                            ₹{Number(prod.price).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                            {prod.bedrooms && prod.bedrooms !== '' ? `${prod.bedrooms} BHK` : 'N/A BHK'}
                            {prod.bathrooms && prod.bathrooms !== '' ? `, ${prod.bathrooms} Bath` : ', N/A Bath'}
                            {prod.balconies && prod.balconies !== '' ? `, ${prod.balconies} Balcony` : ', N/A Balcony'}
                        </p>
                        <div className="flex justify-end mt-2">
                            <CompareIcon
                                onClick={(e) => {
                                    e.preventDefault();
                                    onAddToCompare(prod as Property);
                                }}
                                isHovered={hoveredCompareButton === `similar-${prod.id}`}
                                onMouseEnter={() => setHoveredCompareButton(`similar-${prod.id}`)}
                                onMouseLeave={() => setHoveredCompareButton(null)}
                            />
                        </div>
                    </Link>
                ))}
            </div>

            {hasMoreSimilar && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={onLoadMore}
                        className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
