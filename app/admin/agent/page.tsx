"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

type Agent = {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    gender: string;
    status: string;
    roll: string;
    password: string | number;
    experience: string | number;
};

const ITEMS_PER_PAGE = 10;

// Skeleton Loader Component
const SkeletonLoader = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-pulse">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 md:px-7 py-4 font-semibold">
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </th>
                            <th className="px-4 md:px-7 py-4 font-semibold">
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </th>
                            <th className="px-4 md:px-7 py-4 font-semibold">
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </th>
                            <th className="px-4 md:px-7 py-4 font-semibold">
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </th>
                            <th className="px-4 md:px-7 py-4 font-semibold">
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </th>
                            <th className="px-4 md:px-7 py-4 font-semibold">
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </th>
                            <th className="px-4 md:px-7 py-4 font-semibold">
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                            </th>
                            <th className="px-4 md:px-7 py-4 font-semibold text-right">
                                <div className="h-4 bg-gray-300 rounded w-16 ml-auto"></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 md:px-7 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </td>
                                <td className="px-4 md:px-7 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                                </td>
                                <td className="px-4 md:px-7 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                </td>
                                <td className="px-4 md:px-7 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </td>
                                <td className="px-4 md:px-7 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </td>
                                <td className="px-4 md:px-7 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </td>
                                <td className="px-4 md:px-7 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                                </td>
                                <td className="px-4 md:px-7 py-4 text-right">
                                    <div className="flex gap-2 justify-end flex-wrap">
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

export default function Agent() {
    const [agent, setAgent] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); // ✅ merged search (name + phone)
    const [searchStatus, setSearchStatus] = useState("");

    useEffect(() => {
        fetch("/api/agent")
            .then((res) => res.json())
            .then((data) => {
                setAgent(data.agent || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const deleteAgent = async (id: number) => {
        if (!confirm("Are you sure you want to delete this agent?")) return;

        try {
            const res = await fetch(`/api/agent/delete/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const error = await res.json();
                alert("Failed: " + error.error || res.statusText);
                return;
            }
            setAgent((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            alert("Error deleting agent");
            console.error(error);
        }
    };

    const [totalAgent, setTotalAgent] = useState<number>(0);

    useEffect(() => {
        const fetchTotalAgent = async () => {
            try {
                const res = await fetch("/api/agent/count");
                const data = await res.json();
                setTotalAgent(data?.total);
            } catch (err) {
                console.error("Failed to fetch total agent", err);
            }
        };

        fetchTotalAgent();
    }, []);

    // ✅ Filtering logic
    const filteredAgents = agent.filter((a) => {
        const matchesSearch =
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.phone_number.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = searchStatus ? a.status === searchStatus : true;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);

    const paginatedagent = filteredAgents.slice(
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
        <div className=" w-full  py-10 px-4 md:px-20 min-h-screen">
            <div className="max-w-7xl mx-auto bg-[#aaa] rounded-2xl px-4 py-6 md:px-8 md:py-10">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl md:text-4xl font-semibold text-white text-center sm:text-left">
                        Agent List
                    </h1>
                    <div className=" flex gap-x-5">
                        <h2 className="text-2xl font-black text-white">Total Agent</h2>
                        {loading ? (
                            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse"></div>
                        ) : (
                            <p className="text-2xl  font-semibold text-white">{totalAgent}</p>
                        )}
                    </div>
                    <Link
                        href="/admin/agent/new"
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 md:px-7 md:py-3 rounded-xl shadow-lg transition-all"
                    >
                        <PlusCircle size={20} />
                        Add New Agent
                    </Link>
                </div>

                {/* 🔍 Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 pb-10 gap-4 w-full mt-4">
                    <input
                        type="text"
                        placeholder="Search by Name or Phone"
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
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Table or Skeleton */}
                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto ">
                            <table className="min-w-full text-sm text-left whitespace-nowrap">
                                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 md:px-7 py-4 font-semibold">Name</th>
                                        <th className="px-4 md:px-7 py-4 font-semibold">Phone</th>
                                        <th className="px-4 md:px-7 py-4 font-semibold">Email</th>
                                        <th className="px-4 md:px-7 py-4 font-semibold">Gender</th>
                                        <th className="px-4 md:px-7 py-4 font-semibold">Status</th>
                                        <th className="px-4 md:px-7 py-4 font-semibold">Role</th>
                                        <th className="px-4 md:px-7 py-4 font-semibold">experience</th>
                                        <th className="px-4 md:px-7 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedagent.map((agent) => (
                                        <tr key={agent.id} className="hover:bg-gray-50 transition-all duration-150">
                                            <td className="px-4 md:px-7 py-4 text-gray-900 font-medium">{agent.name}</td>
                                            <td className="px-4 md:px-7 py-4 text-gray-700 truncate">{agent.phone_number}</td>
                                            <td className="px-4 md:px-7 py-4 text-gray-900">{agent.email}</td>
                                            <td className="px-4 md:px-7 py-4 text-gray-900">{agent.gender}</td>
                                            <td className="px-4 md:px-7 py-4 text-gray-900">{agent.status}</td>
                                            <td className="px-4 md:px-7 py-4 text-gray-900">{agent.roll}</td>
                                            <td className="px-4 md:px-7 py-4 text-gray-900">{agent.experience}</td>
                                            <td className="px-4 md:px-7 py-4 text-right">
                                                <div className="flex gap-2 justify-end flex-wrap">
                                                    <Link
                                                        href={`/admin/agent/edit/${agent.id}`}
                                                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-100"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteAgent(agent.id)}
                                                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-100"
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

                {!loading && filteredAgents.length === 0 && (
                    <div className="bg-gray-200 rounded-lg mt-5 p-5 text-center">
                        <p className="text-gray-600">No agents found. Try changing your filters!</p>
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-4 flex-wrap">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md border ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-700 font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-md border ${currentPage === totalPages
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