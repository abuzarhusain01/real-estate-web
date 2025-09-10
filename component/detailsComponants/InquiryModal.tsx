// components/InquiryModal.tsx
"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface UserData {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyName: string;
    propertyId: number;
    userData: UserData | null;
}

export default function InquiryModal({
    isOpen,
    onClose,
    propertyName,
    propertyId,
    userData
}: InquiryModalProps) {
    const [formData, setFormData] = useState({
        name: userData?.name || "",
        email: userData?.email || "",
        phone_number: userData?.phone || "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                name: userData.name || "",
                email: userData.email || "",
                phone_number: userData.phone || ""
            }));
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    property_id: propertyId,
                    property_name: propertyName,
                    customer_id: userData?.id || null
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit form');
            }

            setSubmitted(true);
            if (!userData) {
                setFormData({ name: "", email: "", phone_number: "", message: "" });
            } else {
                setFormData(prev => ({ ...prev, message: "" }));
            }

            setTimeout(() => {
                onClose();
                setSubmitted(false);
            }, 2000);
        } catch (error: any) {
            console.error('Error submitting form:', error);
            setError(error.message || 'Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#000]/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-4">Raise Inquiry</h2>
                <p className="text-gray-600 mb-6">Inquire about {propertyName}</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mb-2">
                    <div>
                        <label className="block text-gray-700 text-base md:text-lg font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border-b border-black p-2 outline-none bg-transparent"
                            required
                            disabled={!!userData?.name}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-base md:text-lg font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border-b border-black p-2 outline-none bg-transparent"
                            required
                            disabled={!!userData?.email}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-base md:text-lg font-medium">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="w-full border-b border-black p-2 outline-none bg-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-base md:text-lg font-medium">
                            Message
                        </label>
                        <textarea
                            name="message"
                            rows={2}
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full border-b border-black p-2 outline-none bg-transparent"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm tracking-wide px-8 py-3 rounded-full mx-auto transition-colors disabled:opacity-70"
                    >
                        {isSubmitting ? "Sending..." : "Request a Call Back"}
                    </button>

                    {submitted && (
                        <p className="text-green-600 text-center mt-2">Message sent successfully!</p>
                    )}
                </form>
            </div>
        </div>
    );
}