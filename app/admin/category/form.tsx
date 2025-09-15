"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";

const Form = ({ categoryId }: { categoryId?: string }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        if (!categoryId) return;

        const fetchCategory = async () => {
            try {
                const res = await fetch(`/api/categories/edit/${categoryId}`);
                if (!res.ok) throw new Error("Failed to fetch category");

                const data = await res.json();
                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                });
            } catch (err) {
                console.error(err);
                setMessage({ text: "Error loading category data", type: "error" });
            }
        };

        fetchCategory();
    }, [categoryId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { title, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [title]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" });

        try {
            let response;
            if (categoryId) {
                response = await fetch(`/api/categories/edit/${categoryId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
            } else {
                response = await fetch("/api/categories", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
            }

            const result = await response.json();

            if (response.ok) {
                setMessage({
                    text: `Category ${categoryId ? "updated" : "added"} successfully!`,
                    type: "success",
                });
                if (!categoryId) {
                    setFormData({ title: "", description: "" });
                }
            } else {
                setMessage({
                    text: `Failed: ${result.error || "Something went wrong"}`,
                    type: "error",
                });
            }
        } catch (error: any) {
            setMessage({
                text: `An error occurred: ${error.message}`,
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  px-4 py-12">
            <div className="w-full max-w-md bg-[#aaa] rounded-xl shadow-lg p-6 sm:p-10">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-black">
                    {categoryId ? "Edit Category" : "Add New Category"}
                </h2>

                {message.text && (
                    <div
                        className={`p-3 mb-4 rounded ${message.type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-800">
                            Category Name
                        </label>
                        <input
                            id="title"
                            title="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 bg-white rounded text-[#333]"
                            placeholder="Enter Category name"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-800">
                            Category Description
                        </label>
                        <input
                            id="description"
                            title="description"
                            type="text"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-2 p-2 w-full border border-gray-300 bg-white rounded text-[#333]"
                            placeholder="Enter Category description"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 flex-wrap">
                        <Link href="/admin/category">
                            <button
                                type="button"
                                className="flex items-center gap-2 cursor-pointer bg-gray-500 text-white font-semibold px-4 py-2 rounded-md"
                            >
                                <FaTimes className="text-white" />
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-teal-600 hover:bg-teal-700 cursor-pointer text-white font-semibold px-4 py-2 rounded-md disabled:opacity-70"
                        >
                            {isSubmitting
                                ? categoryId ? "Updating..." : "Adding..."
                                : categoryId ? "Update Category" : "Add Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;
