
// components/PropertyHotspots.tsx
"use client";
import Image from "next/image";
import Link from "next/link";

interface Property {
    id: number;
    image: string;
    name: string;
    location: string;
    price: number;
}

interface PropertyHotspotsProps {
    hotspots: Property[];
    location: string;
    address: string;
}

export default function PropertyHotspots({ hotspots, location, address }: PropertyHotspotsProps) {
    return (
        <div className="w-full max-w-[92%] mx-auto mt-10 bg-white rounded-xl p-6 md:p-10 shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Hotspots in <span className="underline">{location}</span>
                    <span className="text-red-500 bg-red-100 px-2 py-1 text-xs rounded-full ml-2">magicHomes</span>
                </h2>
            </div>

            <p className="text-gray-600 mb-6">
                <span className="font-bold text-black">Rest of {location}</span> {address}
            </p>

            <div className="overflow-x-auto">
                <div className="flex gap-6 w-max pb-2">
                    {hotspots.map((hotspotProperty) => (
                        <Link
                            key={hotspotProperty.id}
                            href={`/properties/detail/${hotspotProperty.id}`}
                            className="min-w-[120px] text-center transition-transform duration-300 hover:scale-105 hover:shadow-md p-2 rounded-lg"
                        >
                            <Image
                                src={hotspotProperty.image}
                                alt={hotspotProperty.name}
                                width={100}
                                height={100}
                                className="w-[100px] h-[100px] rounded-full mx-auto object-cover"
                            />
                            <p className="text-sm font-medium mt-2">{hotspotProperty.name}</p>
                            <p className="text-sm text-gray-600">{hotspotProperty.location}</p>
                            <p className="text-xs text-gray-500">₹{Number(hotspotProperty.price).toLocaleString("en-IN")}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}