"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";

type Property = {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    owner_name: string;
    location: string;
    owner_contact: string;
    status: string;
    is_hotspot?: boolean;
    is_favourites?: boolean;
    type?: string;
    bedrooms?: number;
    bathrooms?: number;
    landmarks?: string;
};

type PropertiesSectionProps = {
    filters?: {
        searchQuery: string;
        minPrice: number;
        maxPrice: number;
        selectedStatus: string[];
        selectedBedrooms: string[];
        selectedBathrooms: string[];
        selectedLocation: string[];
        selectedLandmarks: string[];
    };
    onFilteredCountChange?: (count: number) => void;
};

// Loading components
const PropertySkeleton = React.memo(() => (
    <div className="w-full bg-white rounded-xl shadow-md p-4 animate-pulse">
        <div className="w-full h-56 bg-gray-300 rounded-lg mb-4" />
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-1/3 mt-4" />
    </div>
));

const CardLoader = React.memo(() => (
    <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <span className="ml-3 text-gray-600">Loading more...</span>
    </div>
));

export default function PropertiesSection({ filters, onFilteredCountChange }: PropertiesSectionProps) {
    // State management
    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const [allPage, setAllPage] = useState(1);
    const [hasMoreAll, setHasMoreAll] = useState(true);

    // Loading states
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isAllLoading, setIsAllLoading] = useState(false);
    const [allInitialLoaded, setAllInitialLoaded] = useState(false);

    // Refs
    const allEndRef = useRef<HTMLDivElement>(null);

    // Property Card Component
    const PropertyCard = React.memo(({
        property,
        handleFavorite
    }: {
        property: Property;
        handleFavorite: (id: number, is_favourites: boolean) => void;
    }) => {
        const [imageLoaded, setImageLoaded] = useState(false);
        const [imageError, setImageError] = useState(false);

        return (
            <div className="w-full rounded-xl transition-transform duration-200 hover:scale-105 hover:shadow-xl">

                <div className="relative rounded-lg overflow-hidden shadow-md">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleFavorite(property.id, !property.is_favourites);
                        }}
                        className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition"
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
                                    d="M12 21c0 0-8-7.25-8-12.5C4 6 6 4 8.5 4S12 6 12 6s1.5-2 3.5-2S20 6 20 8.5C20 13.75 12 21 12 21z"
                                />
                            </svg>
                        )}
                    </button>

                    <div className="relative w-full h-56">
                        {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                        )}
                        <img
                            src={imageError ? "/placeholder-property.jpg" : property.image}
                            alt={property.name}
                            className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => {
                                setImageError(true);
                                setImageLoaded(true);
                            }}
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className="p-4">
                    <p className="text-sm text-gray-600 uppercase font-medium">{property.location}</p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900 line-clamp-1">{property.name}</h3>
                    <p className="mt-1 text-gray-600 text-sm line-clamp-2">{property.description}</p>
                    <p className="mt-3 text-teal-600 text-lg font-bold">₹{Number(property.price).toLocaleString("en-IN")}</p>
                </div>
            </div>
        );
    });

    PropertyCard.displayName = 'PropertyCard';

    // Favorite handler
    const handleFavorite = useCallback(async (id: number, is_favourites: boolean) => {
        try {
            const res = await fetch("/api/properties/favourites", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, is_favourites }),
            });

            if (!res.ok) throw new Error("Failed to update favorite");

            // Update local state
            setAllProperties(prev =>
                prev.map(p =>
                    p.id === id ? { ...p, is_favourites } : p
                )
            );
        } catch (error) {
            console.error("Favorite update error:", error);
            alert("Something went wrong");
        }
    }, []);

    // Fetch properties function
    const fetchProperties = useCallback(async (page: number): Promise<Property[]> => {
        try {
            const response = await fetch(`/api/properties?page=${page}&limit=6`, {
                method: "GET",
                headers: {
                    'Cache-Control': 'no-cache',
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return Array.isArray(data.properties) ? data.properties : [];
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }, []);

    // Load more function
    const loadMoreAll = useCallback(async () => {
        if (isAllLoading || !hasMoreAll) return;

        setIsAllLoading(true);
        try {
            const newProperties = await fetchProperties(allPage);

            if (newProperties.length === 0) {
                setHasMoreAll(false);
            } else {
                setAllProperties(prev => [...prev, ...newProperties]);
                setAllPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error loading all properties:', error);
        } finally {
            setIsAllLoading(false);
        }
    }, [allPage, isAllLoading, hasMoreAll, fetchProperties]);

    // Initial data load
    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            try {
                const allData = await fetchProperties(1);
                if (!isMounted) return;

                setAllProperties(allData);
                setAllPage(2);
                setAllInitialLoaded(true);
                if (allData.length < 6) setHasMoreAll(false);
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                if (isMounted) setIsInitialLoading(false);
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, [fetchProperties]);

    // Apply filters to properties
    const applyFilters = useCallback((properties: Property[]): Property[] => {
        if (!filters) return properties;

        const {
            searchQuery,
            minPrice,
            maxPrice,
            selectedStatus,
            selectedBedrooms,
            selectedBathrooms,
            selectedLocation,
            selectedLandmarks,
        } = filters;

        return properties.filter(property => {
            // Search query filter
            if (searchQuery &&
                !property.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !property.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !property.location.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Price filter
            if (property.price < minPrice || property.price > maxPrice) {
                return false;
            }

            // Status filter
            if (selectedStatus.length > 0 && property.status && !selectedStatus.includes(property.status)) {
                return false;
            }

            // Bedroom filter
            if (selectedBedrooms.length > 0 && property.bedrooms && !selectedBedrooms.includes(property.bedrooms.toString())) {
                return false;
            }

            // Bathroom filter
            if (selectedBathrooms.length > 0 && property.bathrooms && !selectedBathrooms.includes(property.bathrooms.toString())) {
                return false;
            }

            // Location filter
            if (selectedLocation.length > 0 && property.location && !selectedLocation.includes(property.location)) {
                return false;
            }

            // Landmark filter
            if (selectedLandmarks.length > 0 && property.landmarks && !selectedLandmarks.includes(property.landmarks)) {
                return false;
            }

            return true;
        });
    }, [filters]);

    // Apply filters and notify parent of count
    const filteredAllProperties = useMemo(() => {
        const filtered = applyFilters(allProperties);
        if (onFilteredCountChange) {
            onFilteredCountChange(filtered.length);
        }
        return filtered;
    }, [applyFilters, allProperties, onFilteredCountChange]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !isAllLoading && hasMoreAll && allInitialLoaded) {
                    loadMoreAll();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '200px',
            }
        );

        const currentRef = allEndRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [isAllLoading, hasMoreAll, loadMoreAll, allInitialLoaded]);

    // Memoized property list
    const allPropertyList = useMemo(() =>
        filteredAllProperties.map((property) => (
            <Link href={`/properties/detail/${property.id}`} key={property.id} prefetch={false}>
                <PropertyCard property={property} handleFavorite={handleFavorite} />
            </Link>
        ))
        , [filteredAllProperties, handleFavorite]);

    if (isInitialLoading) {
        return (
            <section className="px-6 py-10 md:px-11 max-w-[98%] mx-auto">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="h-8 bg-gray-300 rounded w-64 mx-auto animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-80 mx-auto mt-4 animate-pulse"></div>
                    <div className="h-0.5 w-12 bg-gray-300 mx-auto my-4 animate-pulse"></div>
                </div>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <PropertySkeleton key={index} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="px-6 py-10 md:px-11 max-w-[98%] mx-auto">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl text-gray-900">All Properties</h2>
                <p className="mt-4 text-lg text-gray-600">Browse all available properties.</p>
                <div className="h-0.5 w-12 bg-teal-400 mx-auto my-4" />
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">

                {allPropertyList}
            </div>

            {isAllLoading && <CardLoader />}
            {hasMoreAll && <div ref={allEndRef} className="h-10" />}

            {filteredAllProperties.length === 0 && !isInitialLoading && !isAllLoading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                </div>
            )}
        </section>
    );
}