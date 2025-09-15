"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function SalesForm({ salesId }: { salesId?: string }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        phone_number: "",
        email: "",
        status: "",
        message: "",
        created_at: new Date(),
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        if (!salesId) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/sales/edit/${salesId}`);
                if (!res.ok) throw new Error("Failed to fetch sales");
                const data = await res.json();
                setFormData({
                    name: data.name || "",
                    phone_number: data.phone_number || "",
                    email: data.email || "",
                    status: data.status || "",
                    message: data.message || "",
                    created_at: data.created_at || "",
                });
            } catch (err) {
                setMessage({ text: "Error loading Sales data", type: "error" });
            }
        };

        fetchData();
    }, [salesId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" });

        try {
            const url = salesId ? `/api/sales/edit/${salesId}` : "/api/sales";
            const method = salesId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (res.ok) {
                setMessage({ text: result.message || "Success!", type: "success" });
                if (!salesId) {
                    setFormData({
                        name: "",
                        phone_number: "",
                        created_at: new Date(),
                        email: "",
                        status: "",
                        message: "",
                    });
                } else {
                    router.push("/admin/sales");
                }
            } else {
                setMessage({ text: result.error || "Something went wrong", type: "error" });
            }
        } catch (err: any) {
            setMessage({ text: `Error: ${err.message}`, type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center  min-h-screen px-4 py-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl h-[50%] bg-[#aaa] p-6 sm:p-8 md:p-10 rounded-xl shadow-lg">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-black">
                    {salesId ? "Edit Leads" : "Add New Leads"}
                </h2>

                {message.text && (
                    <div
                        className={`p-3 mb-5 rounded ${message.type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { label: "Name", name: "name", placeholder: "Enter full name" },
                        { label: "Phone Number", name: "phone_number", placeholder: "Enter phone number" },
                        { label: "Email", name: "email", placeholder: "Enter email address" },
                        { label: "Status", name: "status", placeholder: "Select status" },
                    ].map(({ label, name, placeholder }) => (
                        <div key={name} className="w-full">
                            <label htmlFor={name} className="block text-sm font-medium text-gray-800 mb-1">
                                {label}
                            </label>
                            {name === "status" ? (
                                // Dropdown for status field
                                <select
                                    id={name}
                                    name={name}
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded bg-white text-[#333]"
                                    required
                                >
                                    <option value="">Select status</option>
                                    <option value="new">New</option>
                                    <option value="connected">Connected</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="sold">Sold</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="closed">Closed</option>
                                </select>
                            ) : (
                                <input
                                    id={name}
                                    name={name}
                                    type="text"
                                    value={formData[name as keyof typeof formData]}
                                    onChange={handleChange}
                                    placeholder={placeholder}
                                    className="w-full p-2 border border-gray-300 rounded bg-white text-[#333]"
                                    required
                                />
                            )}
                        </div>
                    ))}

                    {/* ✅ Add Message Textarea Field Below */}
                    <div className="md:col-span-2 w-full">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-800 mb-1">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Enter message"
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-[#333]"
                        />
                    </div>

                    <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-4">
                        <Link href="/admin/sales">
                            <button
                                type="button"
                                className="flex items-center cursor-pointer justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 w-full sm:w-auto"
                            >
                                <FaTimes />
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-teal-600 hover:bg-teal-700 cursor-pointer text-white px-4 py-2 rounded-md font-semibold disabled:opacity-70 w-full sm:w-auto"
                        >
                            {isSubmitting
                                ? salesId ? "Updating..." : "Adding..."
                                : salesId ? "Update Leads" : "Add Leads"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
