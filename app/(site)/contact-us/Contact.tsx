"use client";
import React, { useState, useCallback, } from "react";
import Navbar from '@/component/Navbar'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        phone_number: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Memoized form handlers to prevent unnecessary re-renders
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);


    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    status: 'new',
                    date: new Date().toISOString().split("T")[0],
                }),
            });

            if (res.ok) {
                setSubmitted(true);
                setFormData({ name: "", email: "", phone_number: "", message: "" });
                // Auto-hide success message after 5 seconds
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                const error = await res.json();
                alert("Error: " + (error.message || "Failed to submit"));
            }
        } catch (err) {
            alert("Submission failed. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    }, [formData]);

    return (
        <div className="bg-[#f8f4f0]">

            <div className="relative w-full h-auto flex justify-center py-4">
                <div className="w-full px-4 md:px-14">
                    {/* ✅ Wrapper with rounded corners and overflow hidden */}
                    <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[650px]">

                        {/* ✅ Background Image */}
                        <img
                            src="/contact.jpg"
                            alt="contact"
                            className="w-full h-full object-cover filter brightness-45"
                        />

                        {/* ✅ Navbar inside the image */}
                        <div className="absolute top-0 left-0 w-full z-20">
                            <Navbar />
                        </div>

                        {/* ✅ Centered overlay text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                            <div className="text-white max-w-4xl space-y-6">
                                <p className="text-xl md:text-2xl drop-shadow-lg">
                                    Contact Us
                                </p>
                                <h1 className="text-4xl md:text-7xl  leading-tight drop-shadow-lg">
                                    We’re Just a Phone Call <br className="hidden md:block" />
                                    or Message Away
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-transparent text-black px-6 py-16 md:px-20 grid md:grid-cols-2 gap-12 items-center">

                <div>
                    <h2 className="text-3xl md:text-4xl mb-6">
                        We are excited to connect with you and assist you with your real estate needs
                    </h2>

                    <div className="space-y-6 text-sm md:text-base">
                        <div>
                            <h4 className="text-teal-600 font-medium uppercase text-sm">Phone</h4>
                            <p className="font-bold">P: +918810600135</p>
                        </div>
                        <div>
                            <h4 className="text-teal-600 font-medium uppercase text-sm">Email</h4>
                            <p className="font-bold">contact@info.com</p>
                        </div>
                        <div>
                            <h4 className="text-teal-600 font-medium uppercase text-sm">Address</h4>
                            <p className="font-bold">A: F2 Fintech Pvt Ltd, A-25, M-1 Arv Park, A-Block, Sector 63, Noida</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-md w-full">
                    <h4 className="text-center text-sm uppercase text-gray-600 mb-1">Contact Us</h4>
                    <h3 className="text-2xl text-center font-semibold mb-4">Reach Out To Us</h3>
                    <div className="w-8 h-0.5 bg-teal-400 mx-auto mb-6" />

                    <form
                        onSubmit={handleSubmit} className="space-y-4 mb-2">
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
                            className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer font-semibold text-sm tracking-wide px-8 py-3 rounded-full mx-auto transition-colors disabled:opacity-70"
                        >
                            {isSubmitting ? "Sending..." : "Request a Call Back"}
                        </button>

                        {submitted && (
                            <p className="text-green-600 text-center mt-2">Message sent successfully!</p>
                        )}
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Contact
