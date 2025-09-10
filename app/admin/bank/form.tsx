"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function BankForm({ bankId }: { bankId?: string }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        bank_name: "",
        interest: "",
        loan_amount: "",
        year_tenure: "",
        rewards: "",
        loan_disbursed: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        if (!bankId) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/bank/edit/${bankId}`);
                if (!res.ok) throw new Error("Failed to fetch bank");
                const data = await res.json();
                setFormData({
                    bank_name: data.bank_name || "",
                    interest: data.interest || "",
                    loan_amount: data.loan_amount || "",
                    year_tenure: data.year_tenure || "",
                    rewards: data.rewards || "",
                    loan_disbursed: data.loan_disbursed || "",
                });
            } catch (err) {
                setMessage({ text: "Error loading Bank data", type: "error" });
            }
        };

        fetchData();
    }, [bankId]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" });

        try {
            const url = bankId ? `/api/bank/edit/${bankId}` : "/api/bank";
            const method = bankId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (res.ok) {
                setMessage({ text: result.message || "Success!", type: "success" });
                if (!bankId) {
                    setFormData({
                        bank_name: "",
                        interest: "",
                        loan_amount: "",
                        year_tenure: "",
                        rewards: "",
                        loan_disbursed: "",
                    });
                } else {
                    router.push("/admin/bank");
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
        <div className="flex justify-center items-center min-h-screen px-4 py-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl  h-[50%] bg-[#aaa] p-6 sm:p-8 md:p-10 rounded-xl shadow-lg">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-black">
                    {bankId ? "Edit Bank" : "Add New Bank"}
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
                        { label: "Bank Name", name: "bank_name", placeholder: "Enter bank name" },
                        { label: "Interest", name: "interest", placeholder: "Enter interest rate" },
                        { label: "Loan Amount", name: "loan_amount", placeholder: "Enter loan amount" },
                        { label: "Year Tenure", name: "year_tenure", placeholder: "Enter loan tenure" },
                        { label: "Rewards", name: "rewards", placeholder: "Enter rewards/benefits" },
                        { label: "Loan Disbursed", name: "loan_disbursed", placeholder: "Enter disbursed days" },
                    ].map(({ label, name, placeholder }) => (
                        <div key={name} className="w-full">
                            <label htmlFor={name} className="block text-sm font-medium text-gray-800 mb-1">
                                {label}
                            </label>

                            <input
                                id={name}
                                name={name}
                                type={name === "loan_amount" || name === "loan_disbursed" ? "number" : "text"}
                                value={formData[name as keyof typeof formData]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                className="w-full p-2 border border-gray-300 rounded bg-white text-[#333]"
                                required
                            />
                        </div>
                    ))}

                    <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-4">
                        <Link href="/admin/bank">
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
                                ? bankId ? "Updating..." : "Adding..."
                                : bankId ? "Update Bank" : "Add Bank"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}