"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/component/Navbar";

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

type HeroSectionProps = {
    onFiltersChange?: (filters: any) => void;
    filteredCount?: number;
};

export default function HeroSection({ onFiltersChange, filteredCount = 0 }: HeroSectionProps) {
    // Filter states
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
    const [selectedBathrooms, setSelectedBathrooms] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
    const [selectedLandmarks, setSelectedLandmarks] = useState<string[]>([]);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Search and price states
    const [searchQuery, setSearchQuery] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(88451087);

    // Filter options state
    const [filterOptions, setFilterOptions] = useState({
        status: [] as string[],
        bedrooms: [] as string[],
        bathrooms: [] as string[],
        location: [] as string[],
        landmarks: [] as string[],
    });

    // Fetch filter options
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const res = await fetch('/api/properties?all=true');
                if (res.ok) {
                    const data = await res.json();
                    const properties = data.properties || [];

                    const status = [...new Set(properties.map((p: Property) => p.status).filter(Boolean))];
                    const bedrooms = [...new Set(properties.map((p: Property) => p.bedrooms?.toString()).filter(Boolean))];
                    const bathrooms = [...new Set(properties.map((p: Property) => p.bathrooms?.toString()).filter(Boolean))];
                    const location = [...new Set(properties.map((p: Property) => p.location).filter(Boolean))];
                    const landmarks = [...new Set(properties.map((p: Property) => p.landmarks).filter(Boolean))];

                    setFilterOptions({
                        status,
                        bedrooms,
                        bathrooms,
                        location,
                        landmarks,
                    });
                }
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchFilterOptions();
    }, []);

    // Notify parent component when filters change
    useEffect(() => {
        if (onFiltersChange) {
            onFiltersChange({
                searchQuery,
                minPrice,
                maxPrice,
                selectedStatus,
                selectedBedrooms,
                selectedBathrooms,
                selectedLocation,
                selectedLandmarks,
            });
        }
    }, [searchQuery, minPrice, maxPrice, selectedStatus, selectedBedrooms, selectedBathrooms, selectedLocation, selectedLandmarks, onFiltersChange]);

    // Filter change handlers
    const handleStatusChange = (status: string) => {
        setSelectedStatus(prev =>
            prev.includes(status)
                ? prev.filter(t => t !== status)
                : [...prev, status]
        );
        setOpenDropdown(null);
    };

    const handleBedroomChange = (bedroom: string) => {
        setSelectedBedrooms(prev =>
            prev.includes(bedroom)
                ? prev.filter(b => b !== bedroom)
                : [...prev, bedroom]
        );
        setOpenDropdown(null);
    };

    const handleBathroomChange = (bathroom: string) => {
        setSelectedBathrooms(prev =>
            prev.includes(bathroom)
                ? prev.filter(b => b !== bathroom)
                : [...prev, bathroom]
        );
        setOpenDropdown(null);
    };

    const handleLocationChange = (location: string) => {
        setSelectedLocation(prev =>
            prev.includes(location)
                ? prev.filter(l => l !== location)
                : [...prev, location]
        );
        setOpenDropdown(null);
    };

    const handleLandmarkChange = (landmark: string) => {
        setSelectedLandmarks(prev =>
            prev.includes(landmark)
                ? prev.filter(a => a !== landmark)
                : [...prev, landmark]
        );
        setOpenDropdown(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (openDropdown && !target.closest('.dropdown-container')) {
                setOpenDropdown(null);
            }
        };

        if (openDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openDropdown]);

    return (
        <div className="relative w-full h-auto flex justify-center py-4">
            <div className="w-full px-2 sm:px-4 md:px-14">
                <div className="relative rounded-2xl h-[320px] md:h-[650px]">
                    <img
                        src="/properties.jpg"
                        alt="Background"
                        className="w-full h-full object-cover filter brightness-45"
                        loading="eager"
                    />

                    {/* Navbar */}
                    <div className="absolute top-0 left-0 w-full z-30">
                        <Navbar />
                    </div>

                    {/* Hero Content */}
                    <div className="absolute inset-0 flex flex-col mb-36 items-center justify-center text-center px-4 z-10">
                        <div className="text-white max-w-4xl space-y-6">
                            <p className="text-xl md:text-2xl drop-shadow-lg">Properties</p>
                            <h1 className="text-4xl md:text-7xl leading-tight drop-shadow-lg">
                                Looking to Buy, Sell, <br className="hidden md:block" />
                                Rent, Invest or Manage?
                            </h1>
                        </div>
                    </div>

                    {/* Search & Filter Section */}
                    <div className="absolute inset-0 flex items-end mb-14 justify-center z-20 px-2 sm:px-4 md:px-10">
                        <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-2 sm:p-3 md:p-4 w-full max-w-[95%] sm:max-w-[93%]">

                            {/* Search Bar + Price Range */}
                            <div className="mb-3 sm:mb-4 flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4">
                                {/* Search Bar */}
                                <div className="relative w-full md:w-1/2">
                                    <input
                                        type="text"
                                        placeholder="SEARCH"
                                        className="w-full p-2 sm:p-3 md:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm md:text-base"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 sm:h-5 sm:w-5 absolute right-2 sm:right-3 top-2 sm:top-3 md:top-4 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>

                                {/* Price Range */}
                                <div className="w-full md:w-1/2">
                                    <div className="flex justify-between mb-1 sm:mb-2 flex-wrap gap-1">
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">Price range:</span>
                                        <span className="text-xs sm:text-sm font-medium text-gray-900">
                                            ₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-500">₹0</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="88451087"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                            className="w-full h-[6px] sm:h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-500">₹88.5M</span>
                                    </div>
                                </div>
                            </div>

                            {/* Filter Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">

                                {/* Types Dropdown */}
                                <div className="relative dropdown-container">
                                    <button
                                        className={`w-full p-3 border cursor-pointer border-gray-300 rounded-lg flex justify-between items-center ${openDropdown === 'status' ? 'ring-2 ring-teal-500' : ''}`}
                                        onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                                    >
                                        <span>Types</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {openDropdown === 'status' && (
                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                                            {filterOptions.status.map(status => (
                                                <div key={status} className={`px-4 py-2 hover:bg-teal-50 cursor-pointer ${selectedStatus.includes(status) ? 'bg-teal-100' : ''}`} onClick={() => handleStatusChange(status)}>
                                                    {status}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedStatus.length > 0 && (
                                        <div className="mt-2  flex flex-wrap gap-2">
                                            {selectedStatus.map(status => (
                                                <span key={status} className="inline-flex items-center px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">
                                                    {status}
                                                    <button onClick={() => handleStatusChange(status)} className="ml-1 cursor-pointer text-teal-800 hover:text-teal-900">&times;</button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Bedrooms Filter */}
                                <div className="relative dropdown-container">
                                    <button
                                        className={`w-full p-3 border cursor-pointer border-gray-300 rounded-lg flex justify-between items-center ${openDropdown === 'bedroom' ? 'ring-2 ring-teal-500' : ''}`}
                                        onClick={() => setOpenDropdown(openDropdown === 'bedroom' ? null : 'bedroom')}
                                    >
                                        <span>Bedrooms</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {openDropdown === 'bedroom' && (
                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                                            {filterOptions.bedrooms.map(bedroom => (
                                                <div key={bedroom} className={`px-4 py-2 hover:bg-teal-50 cursor-pointer ${selectedBedrooms.includes(bedroom) ? 'bg-teal-100' : ''}`} onClick={() => handleBedroomChange(bedroom)}>
                                                    {bedroom}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedBedrooms.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedBedrooms.map(bedroom => (
                                                <span key={bedroom} className="inline-flex items-center px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">
                                                    {bedroom}
                                                    <button onClick={() => handleBedroomChange(bedroom)} className="ml-1 cursor-pointer text-teal-800 hover:text-teal-900">&times;</button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Bathrooms Filter */}
                                <div className="relative dropdown-container">
                                    <button
                                        className={`w-full p-3 cursor-pointer border border-gray-300 rounded-lg flex justify-between items-center ${openDropdown === 'bathroom' ? 'ring-2 ring-teal-500' : ''}`}
                                        onClick={() => setOpenDropdown(openDropdown === 'bathroom' ? null : 'bathroom')}
                                    >
                                        <span>Bathrooms</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {openDropdown === 'bathroom' && (
                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                                            {filterOptions.bathrooms.map(bathroom => (
                                                <div key={bathroom} className={`px-4 py-2 hover:bg-teal-50 cursor-pointer ${selectedBathrooms.includes(bathroom) ? 'bg-teal-100' : ''}`} onClick={() => handleBathroomChange(bathroom)}>
                                                    {bathroom}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedBathrooms.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedBathrooms.map(bathroom => (
                                                <span key={bathroom} className="inline-flex items-center px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">
                                                    {bathroom}
                                                    <button onClick={() => handleBathroomChange(bathroom)} className="ml-1 cursor-pointer text-teal-800 hover:text-teal-900">&times;</button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Cities Filter */}
                                <div className="relative dropdown-container">
                                    <button
                                        className={`w-full p-3 cursor-pointer border border-gray-300 rounded-lg flex justify-between items-center ${openDropdown === 'location' ? 'ring-2 ring-teal-500' : ''}`}
                                        onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                                    >
                                        <span>Cities</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {openDropdown === 'location' && (
                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                                            {filterOptions.location.map(location => (
                                                <div key={location} className={`px-4 py-2 hover:bg-teal-50 cursor-pointer ${selectedLocation.includes(location) ? 'bg-teal-100' : ''}`} onClick={() => handleLocationChange(location)}>
                                                    {location}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedLocation.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedLocation.map(location => (
                                                <span key={location} className="inline-flex items-center px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">
                                                    {location}
                                                    <button onClick={() => handleLocationChange(location)} className="ml-1 cursor-pointer text-teal-800 hover:text-teal-900">&times;</button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Landmark Dropdown */}
                                <div className="relative dropdown-container">
                                    <button
                                        className={`w-full cursor-pointer p-2 sm:p-3 border border-gray-300 rounded-lg flex justify-between items-center text-xs sm:text-sm ${openDropdown === 'landmark' ? 'ring-2 ring-teal-500' : ''}`}
                                        onClick={() => setOpenDropdown(openDropdown === 'landmark' ? null : 'landmark')}
                                    >
                                        <span>Landmark</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {openDropdown === 'landmark' && (
                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto text-xs sm:text-sm">
                                            {filterOptions.landmarks.map(landmark => (
                                                <div key={landmark} className={`px-3 py-1 sm:px-4 sm:py-2 hover:bg-teal-50 cursor-pointer ${selectedLandmarks.includes(landmark) ? 'bg-teal-100' : ''}`} onClick={() => handleLandmarkChange(landmark)}>
                                                    {landmark}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedLandmarks.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedLandmarks.map(landmark => (
                                                <span key={landmark} className="inline-flex items-center px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">
                                                    {landmark}
                                                    <button onClick={() => handleLandmarkChange(landmark)} className="ml-1 cursor-pointer text-teal-800 hover:text-teal-900">&times;</button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Property Count */}
                            <div className="pt-1 sm:pt-2 text-right text-xs sm:text-sm">
                                <span className="text-gray-600 font-medium">
                                    {filteredCount} properties found
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}