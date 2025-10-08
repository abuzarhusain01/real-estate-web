"use client";
import React, { Suspense, lazy, useState, useCallback } from "react";
import Navbar from "@/component/Navbar";

// Lazy load components
const HeroSection = lazy(() => import("../../../component/propertiesComponants/HeroSection"));
const PropertiesSection = lazy(() => import("../../../component/propertiesComponants/PropertiesSection"));
const ContactSection = lazy(() => import("../../../component/propertiesComponants/ContactSection"));

// Loading components
const HeroSkeleton = () => (
    <div className="relative w-full h-auto flex justify-center py-4">
        <div className="w-full px-2 sm:px-4 md:px-14">
            <div className="relative rounded-2xl h-[320px] md:h-[650px] bg-gray-300 animate-pulse">
                <div className="absolute top-0 left-0 w-full z-30">
                    <Navbar />
                </div>
                <div className="absolute inset-0 flex flex-col mb-36 items-center justify-center text-center px-4 z-10">
                    <div className="text-white max-w-4xl space-y-6">
                        <div className="h-6 bg-gray-400 rounded w-32 mx-auto"></div>
                        <div className="h-16 bg-gray-400 rounded w-96 mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const PropertiesSkeleton = () => (
    <section className="px-6 py-10 md:px-11 max-w-[98%] mx-auto">
        <div className="max-w-7xl mx-auto text-center">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto mt-4 animate-pulse"></div>
            <div className="h-0.5 w-12 bg-gray-300 mx-auto my-4 animate-pulse"></div>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="w-80 min-w-[320px] bg-white rounded-xl shadow-md mx-auto animate-pulse">
                    <div className="w-full h-56 bg-gray-300 rounded-t-xl"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

const ContactSkeleton = () => (
    <section className="relative w-full font-sans h-auto flex justify-center py-10">
        <div className="w-full max-w-[92%] px-1 md:px-1 relative">
            <div className="w-full h-[800px] bg-gray-300 rounded-2xl animate-pulse">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl w-11/12 md:w-5/6 h-2/3 flex flex-col items-center justify-center">
                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                    <div className="h-8 bg-gray-300 rounded w-64 mt-4 animate-pulse"></div>
                    <div className="w-12 h-0.5 bg-gray-300 my-4 animate-pulse"></div>
                    <div className="w-full px-10 space-y-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-8 bg-gray-300 rounded animate-pulse"></div>
                        ))}
                        <div className="h-10 bg-gray-300 rounded-full w-40 mx-auto animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default function Properties() {
    // State to manage filters and filtered count
    const [filters, setFilters] = useState({
        searchQuery: "",
        minPrice: 0,
        maxPrice: 88451087,
        selectedStatus: [] as string[],
        selectedBedrooms: [] as string[],
        selectedBathrooms: [] as string[],
        selectedLocation: [] as string[],
        selectedLandmarks: [] as string[],
    });

    const [filteredCount, setFilteredCount] = useState(0);

    // Handle filter changes from HeroSection
    const handleFiltersChange = useCallback((newFilters: typeof filters) => {
        setFilters(newFilters);
    }, []);

    // Handle filtered count changes from PropertiesSection
    const handleFilteredCountChange = useCallback((count: number) => {
        setFilteredCount(count);
    }, []);

    return (
        <div className="bg-[#f8f4f0]">
            {/* Hero Section with Search & Filters */}
            <Suspense fallback={<HeroSkeleton />}>
                <HeroSection
                    onFiltersChange={handleFiltersChange}
                    filteredCount={filteredCount}
                />
            </Suspense>

            {/* Properties Listing Section */}
            <Suspense fallback={<PropertiesSkeleton />}>
                <PropertiesSection
                    filters={filters}
                    onFilteredCountChange={handleFilteredCountChange}
                />
            </Suspense>

            {/* Contact Form Section */}
            <Suspense fallback={<ContactSkeleton />}>
                <ContactSection />
            </Suspense>
        </div>
    );
}