"use client";
import React, { useState, useCallback } from "react";

export default function ContactSection() {
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        phone_number: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // Form handlers
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSubmitError("");
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const response = await fetch("/api/sales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({
                    ...formData,
                    status: 'new',
                    date: new Date().toISOString().split("T")[0],
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                setFormData({ name: "", email: "", phone_number: "", message: "" });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                const errorData = await response.json();
                setSubmitError(errorData.message || "Failed to submit form");
            }
        } catch (error) {
            setSubmitError("Network error. Please check your connection.");
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, isSubmitting]);

    return (
        <section className="relative w-full font-sans h-auto flex justify-center py-10">
            <div className="relative w-full h-auto flex justify-center py-10">
                <div className="w-full max-w-[92%] px-1 md:px-1 relative">
                    <img
                        src="/appoinment.jpg"
                        alt="Background"
                        className="w-full h-[800px] object-cover rounded-2xl"
                        loading="lazy"
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl w-11/12 md:w-5/6 h-2/3 flex flex-col items-center justify-center px-4 overflow-y-auto">
                        <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-500 px-3 py-1 rounded-md">
                            Contact Us
                        </p>

                        <h2 className="text-2xl md:text-4xl font-sans text-center text-gray-800 mt-2">
                            Schedule an Appointment
                        </h2>

                        <div className="w-12 h-0.5 bg-teal-600 my-4"></div>

                        <form onSubmit={handleSubmit} className="w-full px-10 mb-2 flex flex-col gap-6">
                            <div className="w-full">
                                <label className="block text-gray-700 text-base md:text-lg font-medium">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-teal-600 transition-colors"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-base md:text-lg font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-teal-600 transition-colors"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-base md:text-lg font-medium">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    className="w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-teal-600 transition-colors"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-base md:text-lg font-medium">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    rows={2}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className="w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-teal-600 transition-colors"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer font-semibold text-sm tracking-wide px-8 py-3 rounded-full mx-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                )}
                                {isSubmitting ? "Sending..." : "Request a Call Back"}
                            </button>

                            {submitError && (
                                <p className="text-red-600 text-center text-sm">{submitError}</p>
                            )}

                            {submitted && (
                                <p className="text-green-600 text-center">✓ Message sent successfully!</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}