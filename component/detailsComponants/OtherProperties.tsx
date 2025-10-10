// components/OtherProperties.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";

interface Property {
    id: number;
    image: string;
    name: string;
    price: number;
    carpet_area: string;
    address: string;
    status: string;
}

interface OtherPropertiesProps {
    nearbyProperties: Property[];
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

export default function OtherProperties({ nearbyProperties, onAddToCompare }: OtherPropertiesProps) {
    const [hoveredCompareButton, setHoveredCompareButton] = useState<string | null>(null);

    return (
        <div className="w-full max-w-[92%] mx-auto mt-10 bg-white rounded-xl p-6 md:p-10 shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Other Properties in this Project and Nearby
            </h2>

            <div className="overflow-x-auto">
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                    {nearbyProperties.slice(0, 5).map((nearbyProp) => (
                        <Link
                            key={`nearby-${nearbyProp.id}`}
                            href={`/properties/detail/${nearbyProp.id}`}
                            className="bg-white rounded-lg shadow p-4 flex-shrink-0 w-[85%] sm:w-[280px] md:w-[300px] snap-center transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            <Image
                                src={nearbyProp.image}
                                alt={nearbyProp.name}
                                width={300}
                                height={200}
                                className="rounded-xl h-40 w-full object-cover mb-3"
                            />
                            <p className="text-sm font-medium">{nearbyProp.name}</p>
                            <p className="text-gray-700 font-semibold">  ₹{formatPrice(nearbyProp.price)} | {nearbyProp.carpet_area}</p>
                            <p className="text-gray-600 text-sm">{nearbyProp.address}</p>
                            <p className="text-gray-500 text-xs">{nearbyProp.status}</p>
                            <div className="flex justify-end ">
                                <CompareIcon
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onAddToCompare(nearbyProp);
                                    }}
                                    isHovered={hoveredCompareButton === `nearby-${nearbyProp.id}`}
                                    onMouseEnter={() => setHoveredCompareButton(`nearby-${nearbyProp.id}`)}
                                    onMouseLeave={() => setHoveredCompareButton(null)}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
