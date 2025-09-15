"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/component/Navbar';
import Image from 'next/image';
import { X, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Property = {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    owner_name: string;
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
};

const Comparison = () => {
    const [compareList, setCompareList] = useState<Property[]>([]);
    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Load comparison list from localStorage
        const savedCompareList = localStorage.getItem('compareList');
        if (savedCompareList) {
            try {
                const parsedList = JSON.parse(savedCompareList);
                setCompareList(parsedList);
            } catch (error) {
                console.error('Failed to parse compare list', error);
            }
        }

        // Fetch all properties for selection
        fetchAllProperties();
    }, []);

    const fetchAllProperties = async () => {
        try {
            const res = await fetch('/api/properties?limit=50');
            if (res.ok) {
                const data = await res.json();
                setAllProperties(data.properties || []);
            }
        } catch (error) {
            console.error('Failed to fetch properties', error);
        }
    };

    const removeFromCompare = (propertyId: number) => {
        const updatedCompareList = compareList.filter(p => p.id !== propertyId);
        setCompareList(updatedCompareList);
        localStorage.setItem('compareList', JSON.stringify(updatedCompareList));
    };

    const addToCompare = (property: Property) => {
        if (compareList.length >= 3) {
            alert('You can compare maximum 3 properties');
            return;
        }

        if (compareList.some(p => p.id === property.id)) {
            alert('Property already in comparison');
            return;
        }

        const updatedCompareList = [...compareList, property];
        setCompareList(updatedCompareList);
        localStorage.setItem('compareList', JSON.stringify(updatedCompareList));
        setIsAddModalOpen(false);
    };

    const clearAllComparisons = () => {
        setCompareList([]);
        localStorage.removeItem('compareList');
    };

    const filteredProperties = allProperties.filter(property =>
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.project.toLowerCase().includes(searchQuery.toLowerCase())
    ).filter(property => !compareList.some(comp => comp.id === property.id));

    const comparisonFeatures = [
        { key: 'price', label: 'Price', format: (value: any) => `₹${Number(value).toLocaleString("en-IN")}` },
        { key: 'location', label: 'Location' },
        { key: 'project', label: 'Project' },
        { key: 'flat', label: 'Configuration' },
        { key: 'carpet_area', label: 'Carpet Area' },
        { key: 'bedrooms', label: 'Bedrooms' },
        { key: 'bathrooms', label: 'Bathrooms' },
        { key: 'balconies', label: 'Balconies' },
        { key: 'floor', label: 'Floor' },
        { key: 'furnishing', label: 'Furnishing' },
        { key: 'facing', label: 'Facing' },
        { key: 'status', label: 'Status' },
        { key: 'emi', label: 'EMI', format: (value: any) => `₹${Number(value).toLocaleString("en-IN")}` },
        { key: 'booking_amount', label: 'Booking Amount', format: (value: any) => `₹${Number(value).toLocaleString("en-IN")}` },
        { key: 'flooring', label: 'Flooring' },
        { key: 'lifts', label: 'Lifts' },
        { key: 'overlooking', label: 'Overlooking' },
        { key: 'landmarks', label: 'Landmarks' },
    ];

    return (
        <div className="bg-[#f8f4f0] min-h-screen">
            <div className="relative w-full h-auto flex justify-center py-4">
                <div className="w-full px-4 md:px-14">
                    <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[650px]">
                        <img
                            src="/comparison.jpg"
                            alt="Background"
                            className="w-full h-full object-cover filter brightness-45"
                        />

                        <div className="absolute top-0 left-0 w-full z-20">
                            <Navbar />
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                            <div className="text-white max-w-4xl space-y-6">
                                <p className="text-xl md:text-2xl drop-shadow-lg">Comparison</p>
                                <h1 className="text-4xl md:text-7xl font-sans leading-tight drop-shadow-lg">
                                    Compare Projects and <br className="hidden md:block" /> Find the Best Fit
                                </h1>
                                {compareList.length > 0 && (
                                    <p className="text-lg drop-shadow-lg">
                                        {compareList.length} {compareList.length === 1 ? 'Property' : 'Properties'} Selected for Comparison
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                        <ArrowLeft size={20} />
                        Back to Properties
                    </Link>
                    {compareList.length > 0 && (
                        <button
                            onClick={clearAllComparisons}
                            className="text-red-600 hover:text-red-800 font-medium"
                        >
                            Clear All Comparisons
                        </button>
                    )}
                </div>

                {compareList.length === 0 ? (
                    // Empty State
                    <div className="bg-white rounded-xl p-8 text-center shadow">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Plus size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties to Compare</h3>
                            <p className="text-gray-600 mb-6">Add properties to your comparison list to see detailed side-by-side comparisons</p>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-blue-600 text-white cursor-pointer  px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Properties to Compare
                            </button>
                        </div>
                    </div>
                ) : (
                    // Comparison Table
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">Property Comparison</h2>
                                {compareList.length < 3 && (
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="bg-blue-600 text-white  px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Add Property
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left p-4 font-semibold text-gray-800 min-w-[200px]">Feature</th>
                                        {compareList.map((property) => (
                                            <th key={property.id} className="text-center p-4 min-w-[250px]">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => removeFromCompare(property.id)}
                                                        className="absolute -top-2 -right-2 bg-red-500 cursor-pointer text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                    <Image
                                                        src={property.image}
                                                        alt={property.name}
                                                        width={200}
                                                        height={120}
                                                        className="w-full h-24 object-cover rounded-lg mb-2"
                                                    />
                                                    <h3 className="font-semibold text-sm text-gray-800">{property.name}</h3>
                                                    <p className="text-xs text-gray-600">{property.location}</p>
                                                </div>
                                            </th>
                                        ))}
                                        {/* Add Property Slot */}
                                        {compareList.length < 3 && (
                                            <th className="text-center p-4 min-w-[250px]">
                                                <button
                                                    onClick={() => setIsAddModalOpen(true)}
                                                    className="w-full h-24 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                                                >
                                                    <div className="text-center">
                                                        <Plus size={24} className="text-gray-400 mx-auto mb-1" />
                                                        <p className="text-xs text-gray-500">Add Property</p>
                                                    </div>
                                                </button>
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonFeatures.map((feature, index) => (
                                        <tr key={feature.key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="p-4 font-medium text-gray-800 border-r">{feature.label}</td>
                                            {compareList.map((property) => (
                                                <td key={property.id} className="p-4 text-center text-gray-700">
                                                    {feature.format
                                                        ? feature.format(property[feature.key as keyof Property] || 'N/A')
                                                        : property[feature.key as keyof Property] || 'N/A'
                                                    }
                                                </td>
                                            ))}
                                            {compareList.length < 3 && (
                                                <td className="p-4 text-center text-gray-400">-</td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 border-t bg-gray-50">
                            <div className="flex flex-wrap gap-4 justify-center">
                                {compareList.map((property) => (
                                    <div key={property.id} className="flex gap-2">
                                        <Link
                                            href={`/properties/detail/${property.id}`}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            View {property.name}
                                        </Link>
                                        <button
                                            onClick={() => {
                                                // Add to inquiry or contact owner logic
                                                window.open(`tel:${property.owner_contact}`, '_self');
                                            }}
                                            className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                                        >
                                            Contact Owner
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Property Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Add Property to Compare</h2>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-gray-500 cursor-pointer hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search properties by name, location, or project..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Properties List */}
                        <div className="overflow-y-auto max-h-96">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredProperties.slice(0, 20).map((property) => (
                                    <div
                                        key={property.id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => addToCompare(property)}
                                    >
                                        <div className="flex gap-3">
                                            <Image
                                                src={property.image}
                                                alt={property.name}
                                                width={80}
                                                height={60}
                                                className="w-20 h-15 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm text-gray-800">{property.name}</h3>
                                                <p className="text-xs text-gray-600">{property.location}</p>
                                                <p className="text-xs text-gray-600">{property.project}</p>
                                                <p className="text-sm font-medium text-gray-800">₹{Number(property.price).toLocaleString("en-IN")}</p>
                                                <p className="text-xs text-blue-600">{property.flat} | {property.carpet_area}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredProperties.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No properties found matching your search</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t flex justify-end">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Tips */}
            {compareList.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 mt-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Comparison Tips</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Compare similar property types for better insights</li>
                            <li>• Consider location proximity to your workplace and amenities</li>
                            <li>• Factor in additional costs like maintenance and registration</li>
                            <li>• Check the project's completion status and possession timeline</li>
                        </ul>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Comparison;