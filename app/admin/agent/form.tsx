"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function AgentForm({ agentId }: { agentId?: string }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        phone_number: "",
        email: "",
        gender: "",
        status: "",
        roll: "",
        password: "",
        experience: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        if (!agentId) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/agent/edit/${agentId}`);
                if (!res.ok) throw new Error("Failed to fetch agent");
                const data = await res.json();
                setFormData({
                    name: data.name || "",
                    phone_number: data.phone_number || "",
                    email: data.email || "",
                    gender: data.gender || "",
                    status: data.status || "",
                    roll: data.roll || "",
                    password: "", // do not prefill password
                    experience: data.experience || "",
                });
            } catch (err) {
                setMessage({ text: "Error loading agent data", type: "error" });
            }
        };

        fetchData();
    }, [agentId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" });

        try {
            const url = agentId ? `/api/agent/edit/${agentId}` : "/api/agent";
            const method = agentId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            console.log("Response:", result);

            if (res.ok) {
                setMessage({ text: result.message || "Success!", type: "success" });
                if (!agentId) {
                    setFormData({
                        name: "",
                        phone_number: "",
                        email: "",
                        gender: "",
                        status: "",
                        roll: "",
                        password: "",
                        experience: "",
                    });
                } else {
                    router.push("/admin/agent");
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
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="w-full max-w-5xl h-[50%] bg-[#aaa] rounded-xl shadow-lg my-10 p-6 sm:p-10">
                <h2 className="text-2xl font-semibold mb-6 text-center text-black">
                    {agentId ? "Edit Agent" : "Add New Agent"}
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

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { label: "Agent Name", name: "name", placeholder: "E.g. John Doe" },
                        { label: "Phone Number", name: "phone_number", placeholder: "E.g. 9876543210" },
                        { label: "Email", name: "email", placeholder: "E.g. john@example.com" },
                        { label: "Gender", name: "gender", placeholder: "E.g. Male / Female" },
                        { label: "Status", name: "status", placeholder: "E.g. Active, Inactive" },
                        { label: "Roll", name: "roll", placeholder: "E.g. Agent / Admin" },
                        { label: "Experience", name: "experience", placeholder: "E.g. 5 years" },
                        { label: "Password", name: "password", placeholder: "Enter secure password" },
                    ].map(({ label, name, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-800" htmlFor={name}>
                                {label}
                            </label>
                            {name === "status" ? (
                                <select
                                    id={name}
                                    name={name}
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="mt-2 p-2 w-full border border-gray-300 bg-white rounded text-[#333]"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            ) : (
                                <input
                                    id={name}
                                    name={name}
                                    type={name === "password" ? "password" : "text"}
                                    value={formData[name as keyof typeof formData] || ""}
                                    onChange={handleChange}
                                    className="mt-2 p-2 w-full border border-gray-300 bg-white rounded text-[#333]"
                                    placeholder={placeholder}
                                    required={name !== "experience" && name !== "password"}
                                // ✅ experience optional, password optional in edit
                                />
                            )}
                        </div>
                    ))}

                    <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-4">
                        <Link href="/admin/agent">
                            <button
                                type="button"
                                className="flex items-center cursor-pointer justify-center gap-2 bg-gray-500 text-white font-semibold px-4 py-2 rounded-md w-full sm:w-auto"
                            >
                                <FaTimes className="text-white" />
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-teal-600 hover:bg-teal-700 cursor-pointer text-white font-semibold px-4 py-2 rounded-md w-full sm:w-auto disabled:opacity-70"
                        >
                            {isSubmitting
                                ? agentId ? "Updating..." : "Adding..."
                                : agentId ? "Update Agent" : "Add Agent"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
