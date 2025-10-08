"use client";
import { Eye, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Sales = {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    status: string;
    message: string;
    created_at: string | Date;
};

const ITEMS_PER_PAGE = 10;

// Skeleton Loader Component
const SkeletonLoader = () => {
    return (
        <div className="bg-white rounded-lg shadow border overflow-hidden border-gray-200 animate-pulse">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </th>
                            <th className="px-4 py-3">
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                            </th>
                            <th className="px-4 py-3">
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </th>
                            <th className="px-4 py-3">
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </th>
                            <th className="px-4 py-3">
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </th>
                            <th className="px-4 py-3 text-right">
                                <div className="h-4 bg-gray-300 rounded w-16 ml-auto"></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function Sales() {
    const [sales, setSales] = useState<Sales[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [totalSales, setTotalSales] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    useEffect(() => {
        fetch("/api/sales")
            .then((res) => res.json())
            .then((data) => {
                setSales(data.sales || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const fetchTotalSales = async () => {
            try {
                const res = await fetch("/api/sales/count");
                const data = await res.json();
                setTotalSales(data?.total);
            } catch (err) {
                console.error("Failed to fetch total sales", err);
            }
        };
        fetchTotalSales();
    }, []);

    const deleteSales = async (id: number) => {
        if (!confirm("Are you sure you want to delete this sales?")) return;
        try {
            const res = await fetch(`/api/sales/delete/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const error = await res.json();
                alert("Failed: " + error.error || res.statusText);
                return;
            }
            setSales((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            alert("Error deleting sales");
            console.error(error);
        }
    };

    // ✅ Filtering logic (name + phone + email + status)
    const filteredSales = sales.filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            a.name.toLowerCase().includes(q) ||
            a.phone_number.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q);

        const matchesStatus = searchStatus ? a.status === searchStatus : true;

        return matchesSearch && matchesStatus;
    });

    // ✅ Pagination based on filteredSales
    const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

    const paginatedSales = filteredSales.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <div className="min-h-screen w-full px-4 py-10 sm:px-6 md:px-6 lg:px-10 xl:px-20">
            <div className="max-w-7xl mx-auto bg-[#aaa] rounded-2xl px-4 sm:px-6 md:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4 sm:mb-0">
                        Leads List
                    </h1>
                    <div className="flex gap-x-5">
                        <h2 className="text-2xl font-black text-white">Total Leads</h2>
                        {loading ? (
                            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse"></div>
                        ) : (
                            <p className="text-2xl font-semibold text-white">{totalSales}</p>
                        )}
                    </div>
                    <Link
                        href="/admin/sales/new"
                        className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 sm:px-7 sm:py-3 rounded-xl shadow-lg transition-all text-sm sm:text-base"
                    >
                        <PlusCircle size={18} />
                        Add New Leads
                    </Link>
                </div>

                {/* 🔍 Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 pb-10 gap-4 w-full mt-4">
                    <input
                        type="text"
                        placeholder="Search by Name, Phone or Email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-gray-800"
                        disabled={loading}
                    />
                    <select
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-gray-800"
                        disabled={loading}
                    >
                        <option value="">All Status</option>
                        <option value="new">New</option>
                        <option value="connected">Connected</option>
                        <option value="contacted">Contacted</option>
                        <option value="sold">Sold</option>
                        <option value="rejected">Rejected</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                {/* Table or Skeleton */}
                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <div className="bg-white rounded-lg shadow border overflow-hidden border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Phone Number</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedSales.map((sales) => (
                                        <tr key={sales.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">{sales.name}</td>
                                            <td className="px-4 py-3">{sales.phone_number}</td>
                                            <td className="px-4 py-3">{sales.email}</td>
                                            <td className="px-4 py-3">{sales.status}</td>
                                            <td className="px-4 py-3">
                                                {sales.created_at
                                                    ? new Date(sales.created_at).toLocaleString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })
                                                    : ""}
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedMessage(sales.message);
                                                            setShowModal(true);
                                                        }}
                                                        className="text-green-600 hover:text-green-800 px-3 py-1 rounded hover:bg-green-100 text-sm"
                                                        title="View Message"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <Link
                                                        href={`/admin/sales/edit/${sales.id}`}
                                                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-100 text-sm"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteSales(sales.id)}
                                                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-100 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {!loading && filteredSales.length === 0 && (
                    <div className="bg-gray-200 rounded-lg mt-5 p-5 text-center">
                        <p className="text-gray-600">No sales found. Create your first sale!</p>
                    </div>
                )}

                {!loading && totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-center items-center mt-6 space-y-3 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md border text-sm font-medium ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            Previous
                        </button>
                        <span className="text-gray-700 text-sm font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-md border text-sm font-medium ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* ✅ Modal for Message */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-xl">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg font-bold"
                            >
                                ×
                            </button>
                            <h2 className="text-lg font-semibold mb-3">Message</h2>
                            <p className="text-gray-800 whitespace-pre-line">{selectedMessage || "No message available."}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}