"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle, X } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

type Property = {
    id: number;
    image: string;
    images: string[];
    name: string;
    description: string;
    price: number | string;
    owner_name: string;
    location: string;
    owner_contact: string;
    status: number | string;
    created_at: string | Date;
};

// 🟢 Utility function: lakh/crore handle
function parsePrice(input: string | number): number {
    if (typeof input === "number") return input;

    let value = input.toLowerCase().trim();

    if (value.includes("lakh")) {
        const num = parseFloat(value.replace("lakh", "").trim());
        return isNaN(num) ? 0 : num * 1_00_000;
    } else if (value.includes("crore")) {
        const num = parseFloat(value.replace("crore", "").trim());
        return isNaN(num) ? 0 : num * 1_00_00_000;
    } else {
        const num = parseFloat(value.replace(/,/g, ""));
        return isNaN(num) ? 0 : num;
    }
}

export default function Properties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProperties, setTotalProperties] = useState(0);

    const [searchName, setSearchName] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    // Image gallery state
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedPropertyName, setSelectedPropertyName] = useState("");
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    useEffect(() => {
        const fetchPaginatedProperties = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/properties?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
                const data = await res.json();
                setProperties(data.properties || []);
                setFilteredProperties(data.properties || []);
                setTotalProperties(data.total || 0);
            } catch (error) {
                console.error("Failed to fetch paginated properties", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaginatedProperties();
    }, [currentPage]);

    const deleteProperties = async (id: number) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        try {
            const res = await fetch(`/api/properties/delete/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const error = await res.json();
                alert("Failed: " + (error.error || res.statusText));
                return;
            }
            setProperties((prev) => prev.filter((p) => p.id !== id));
            setFilteredProperties((prev) => prev.filter((p) => p.id !== id)); // ✅ keep filters in sync
        } catch (error) {
            alert("Error deleting property");
            console.error(error);
        }
    };

    useEffect(() => {
        const filtered = properties.filter((p) =>
            p.name.toLowerCase().includes(searchName.toLowerCase()) &&
            p.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
            String(p.status).toLowerCase().includes(searchStatus.toLowerCase())
        );
        setFilteredProperties(filtered);
    }, [searchName, searchLocation, searchStatus, properties]);

    const handleImageClick = (property: Property) => {
        // Show all images: banner + rest
        const images: string[] = [
            ...(property.image ? [property.image] : []),  // banner first
            ...(Array.isArray(property.images) ? property.images : [])
        ];
        setSelectedImages(images);
        setSelectedPropertyName(property.name);
        setIsGalleryOpen(true);
    };

    const totalPages = Math.ceil(totalProperties / ITEMS_PER_PAGE);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    return (
        <div className="min-h-screen w-full px-4 py-10 sm:px-6 md:px-6 lg:px-10 xl:px-20">
            <div className="max-w-7xl mx-auto bg-[#aaa] rounded-2xl px-4 sm:px-6 md:px-8 py-8 sm:py-10">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-10">
                    <h1 className="text-2xl sm:text-4xl font-semibold text-white text-center sm:text-left">
                        Properties List
                    </h1>
                    <div className="flex gap-x-5">
                        <h2 className="text-2xl font-black text-white">Total Properties</h2>
                        <p className="text-2xl font-semibold text-white">{totalProperties}</p>
                    </div>
                    <Link
                        href="/admin/properties/new"
                        className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 sm:px-7 sm:py-3 rounded-xl shadow-lg transition-all text-sm sm:text-base"
                    >
                        <PlusCircle size={20} /> Add New Property
                    </Link>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 pb-10 gap-4 w-full mt-4">
                    <input
                        type="text"
                        placeholder="Search by Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-gray-800"
                    />
                    <input
                        type="text"
                        placeholder="Search by Location"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-gray-800"
                    />
                    <select
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-gray-800"
                    >
                        <option value="">All Status</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="rent">Rent</option>
                        <option value="sold">Sold</option>
                        <option value="ready to move">Ready to move</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-4 font-semibold">Name</th>
                                    <th className="px-4 py-4 font-semibold">Description</th>
                                    <th className="px-4 py-4 font-semibold">Price</th>
                                    <th className="px-4 py-4 font-semibold">Owner</th>
                                    <th className="px-4 py-4 font-semibold">Location</th>
                                    <th className="px-4 py-4 font-semibold">Contact</th>
                                    <th className="px-4 py-4 font-semibold">Status</th>
                                    <th className="px-4 py-4 font-semibold">Date</th>
                                    <th className="px-4 py-4 font-semibold">Image</th>
                                    <th className="px-4 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    [...Array(ITEMS_PER_PAGE)].map((_, index) => (
                                        <tr key={index} className="animate-pulse">
                                            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                                            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                            <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                            <td className="px-4 py-4"><div className="h-3 bg-gray-200 rounded w-20"></div></td>
                                            <td className="px-4 py-4"><div className="h-12 w-16 bg-gray-200 rounded"></div></td>
                                            <td className="px-4 py-4"><div className="h-6 bg-gray-200 rounded w-12"></div></td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredProperties.map((property) => (
                                        <tr key={property.id} className="hover:bg-gray-50 transition-all duration-150">
                                            <td className="px-4 py-4 text-gray-900 font-medium">{property.name}</td>
                                            <td className="px-4 py-4 text-gray-700 max-w-xs whitespace-normal break-words">{property.description}</td>
                                            <td className="px-4 py-4 text-gray-900 font-medium">
                                                ₹{parsePrice(property.price).toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-4 py-4 text-gray-900">{property.owner_name}</td>
                                            <td className="px-4 py-4 text-gray-900">{property.location}</td>
                                            <td className="px-4 py-4 text-gray-900">{property.owner_contact}</td>
                                            <td className="px-4 py-4 text-gray-900">{property.status}</td>
                                            <td className="px-4 py-3 text-gray-900">
                                                {property.created_at ? (
                                                    <>
                                                        <div>
                                                            {new Date(property.created_at).toLocaleDateString("en-GB", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </div>
                                                        <div>
                                                            {new Date(property.created_at).toLocaleTimeString("en-GB", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            })}
                                                        </div>
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-gray-900">
                                                <img
                                                    src={property.image}
                                                    alt={property.name}
                                                    className="w-16 h-12 object-cover rounded cursor-pointer hover:opacity-80"
                                                    onClick={() => handleImageClick(property)}
                                                />
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex gap-2 justify-end flex-wrap">
                                                    <Link href={`/admin/properties/edit/${property.id}`} className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-100 text-xs sm:text-sm">
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteProperties(property.id)}
                                                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-100 text-xs sm:text-sm">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button onClick={handlePrevious} disabled={currentPage === 1} className="px-4 py-2 bg-white border rounded disabled:opacity-50">
                            Previous
                        </button>
                        <span className="text-gray-800">Page {currentPage} of {totalPages}</span>
                        <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 bg-white border rounded disabled:opacity-50">
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Image Gallery Modal */}
            {isGalleryOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Images - {selectedPropertyName}
                            </h3>
                            <button
                                onClick={() => setIsGalleryOpen(false)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {selectedImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${selectedPropertyName} - Image ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg shadow-md"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
