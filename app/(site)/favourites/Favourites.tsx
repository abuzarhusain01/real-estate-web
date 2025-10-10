"use client";
import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/component/Navbar";
import Image from "next/image";
import Link from "next/link";

type Property = {
    id: number;
    image: string;
    name: string;
    price: number;
    location: string;
    description: string;
    is_favourites: boolean;
};

const Favourites = () => {
    const [favorites, setFavorites] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ⭐ Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/properties/favourites", {
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

            const data = await res.json();
            setFavorites(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch favourites:", err);
            setError(err instanceof Error ? err.message : "Failed to load favourites");
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleFavorite = useCallback(async (id: number, is_favourites: boolean) => {
        try {
            const res = await fetch("/api/properties/favourites", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, is_favourites }),
            });

            if (!res.ok) throw new Error("Failed to update favorite");

            // Update local state immediately
            setFavorites((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, is_favourites } : p
                )
            );
        } catch (error) {
            console.error("Favorite update error:", error);
            alert("Something went wrong");
        }
    }, []);

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

    // ⭐ Pagination logic
    const totalPages = Math.ceil(favorites.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = favorites.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="bg-[#f8f4f0] min-h-screen">
            {/* Hero Section */}
            <div className="relative w-full h-auto flex justify-center py-4">
                <div className="w-full px-4 md:px-14">
                    <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[650px]">
                        <Image
                            src="/alex.jpg"
                            alt="Favorites Background"
                            fill
                            className="object-cover filter brightness-45"
                            priority
                        />
                        <div className="absolute top-0 left-0 w-full z-20">
                            <Navbar />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                            <div className="text-white max-w-4xl space-y-6">
                                <p className="text-xl md:text-2xl drop-shadow-lg">Favourites</p>
                                <h1 className="text-4xl md:text-5xl font-sans leading-tight drop-shadow-lg">
                                    Discover Your Favourites
                                </h1>
                                <h1 className="text-3xl md:text-4xl font-sans leading-tight drop-shadow-lg">
                                    Handpicked Just for You
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-sans py-6 mb-6 flex justify-center text-gray-800">
                    Your Favourite Properties
                </h1>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-xl shadow animate-pulse"
                            >
                                <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 mb-4">You haven't saved any properties yet.</p>
                        <Link
                            href="/properties"
                            className="text-teal-600 hover:underline font-medium"
                        >
                            Browse Properties
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentItems.map((property) => (
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
                            ))}
                        </div>

                        {/* ⭐ Pagination Controls (with numbered buttons) */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex justify-center space-x-4">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${currentPage === pageNum
                                            ? "bg-teal-600 text-white"
                                            : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                    </>
                )}
            </div>
        </div>
    );
};

export default Favourites;
