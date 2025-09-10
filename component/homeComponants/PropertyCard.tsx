import React from "react";
import { Property } from "../types";


interface PropertyCardProps {
    property: Property;
    handleFavorite: (id: number, is_favourites: boolean) => void;
}

const PropertyCard = React.memo(({ property, handleFavorite }: PropertyCardProps) => (
    <div className="w-80 min-w-[320px] bg-transparent rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-xl mx-auto">
        <div className="relative rounded-lg overflow-hidden shadow-md">
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
                        className="w-5 h-5 text-red-500 fill-red-500"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12.1 21.35l-1.1-1.02C5.14 15.22 2 12.17 2 8.5 2 6.01 4.01 4 6.5 4c1.74 0 3.41 1.01 4.1 2.09C11.09 5.01 12.76 4 14.5 4 16.99 4 19 6.01 19 8.5c0 3.67-3.14 6.72-8.9 11.83l-1.1 1.02z" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 0 1 6.364 0L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 0 1 0-6.364z"
                        />
                    </svg>

                )}
            </button>
            <img src={property.image} alt={property.name} className="w-full h-56 object-cover" />
        </div>
        <div className="p-4">
            <p className="text-sm text-black uppercase">{property.location}</p>
            <h3 className="mt-2 text-xl font-semibold text-gray-900">{property.name}</h3>
            <p className="mt-1 text-gray-600 text-sm">{property.description}</p>
            <p className="mt-3 text-teal-600 text-lg font-bold">₹{Number(property.price).toLocaleString("en-IN")}</p>
        </div>
    </div>
));

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;