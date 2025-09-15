"use client";
import { Eye, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Bank = {
    id: number; // from alias
    bank_name: string;
    interest: string;
    loan_amount: string;
    year_tenure: string;
    rewards: string;
    loan_disbursed: string;
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

export default function Bank() {
    const [bank, setBank] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [totalBank, setTotalBank] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    useEffect(() => {
        fetch("/api/bank")
            .then((res) => res.json())
            .then((data) => {
                // console.log("Bank data:", bank);

                setBank(data.bank || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const fetchTotalBank = async () => {
            try {
                const res = await fetch("/api/bank/count");
                const data = await res.json();
                setTotalBank(data?.total);
            } catch (err) {
                console.error("Failed to fetch total bank", err);
            }
        };
        fetchTotalBank();
    }, []);

    const deleteBank = async (id: number) => {
        if (!confirm("Are you sure you want to delete this bank?")) return;
        try {
            const res = await fetch(`/api/bank/delete/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const error = await res.json();
                alert("Failed: " + error.error || res.statusText);
                return;
            }
            setBank((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            alert("Error deleting bank");
            console.error(error);
        }
    };

    // ✅ Filtering logic (name only since email field doesn't exist in Bank type)
    const filteredBank = bank.filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = a.bank_name.toLowerCase().includes(q);
        return matchesSearch;
    });

    // ✅ Pagination based on filteredBank
    const totalPages = Math.ceil(filteredBank.length / ITEMS_PER_PAGE);

    const paginatedBank = filteredBank.slice(
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
        <div className="w-full  py-10 px-4 md:px-20 min-h-screen">
            <div className="max-w-7xl mx-auto bg-[#aaa] rounded-2xl px-4 sm:px-6 md:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4 sm:mb-0">
                        Bank List
                    </h1>
                    <div className="flex gap-x-5">
                        <h2 className="text-2xl font-black text-white">Total Bank</h2>
                        {loading ? (
                            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse"></div>
                        ) : (
                            <p className="text-2xl font-semibold text-white">{totalBank}</p>
                        )}
                    </div>
                    <Link
                        href="/admin/bank/new"
                        className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 sm:px-7 sm:py-3 rounded-xl shadow-lg transition-all text-sm sm:text-base"
                    >
                        <PlusCircle size={18} />
                        Add New Bank
                    </Link>
                </div>

                {/* 🔍 Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 pb-10 gap-4 w-full mt-4">
                    <input
                        type="text"
                        placeholder="Search by Bank Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-gray-800"
                        disabled={loading}
                    />
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
                                        <th className="px-4 py-3">Bank Name</th>
                                        <th className="px-4 py-3">Interest</th>
                                        <th className="px-4 py-3">Loan Amount</th>
                                        <th className="px-4 py-3">Year Tenure</th>
                                        <th className="px-4 py-3">Rewards</th>
                                        <th className="px-4 py-3">Loan Disbursed</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedBank.map((bank) => (
                                        <tr key={bank.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 font-medium text-gray-900">
                                                {bank.bank_name}
                                            </td>
                                            <td className="px-4 py-4">
                                                {bank.interest}%
                                            </td>
                                            <td className="px-4 py-4">
                                                ₹{Number(bank.loan_amount).toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-4 py-4">
                                                {bank.year_tenure}
                                                &nbsp;
                                                Years
                                            </td>
                                            <td className="px-4 py-4">
                                                ₹{Number(bank.rewards).toLocaleString("en-IN")}

                                            </td>
                                            <td className="px-4  py-4">
                                                {bank.loan_disbursed}
                                                &nbsp;
                                                Days
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Link
                                                        href={`/admin/bank/edit/${bank.id}`}
                                                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteBank(bank.id)}
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

                {!loading && filteredBank.length === 0 && (
                    <div className="bg-gray-200 rounded-lg mt-5 p-5 text-center">
                        <p className="text-gray-600">No banks found. Create your first bank!</p>
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
            </div>
        </div>
    );
}