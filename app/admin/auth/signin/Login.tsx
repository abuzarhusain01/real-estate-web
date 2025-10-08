"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showForgotForm, setShowForgotForm] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMessage, setResetMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Login failed");
                return;
            }

            // Instead of "user", store admin-specific key
            localStorage.setItem(
                "adminUser",
                JSON.stringify({ id: data.user.id, name: data.user.name })
            );


            router.push("/admin");
        } catch (error) {
            console.error("Login error", error);
            alert("Something went wrong");
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/forget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: resetEmail }),
            });

            const data = await res.json();
            if (!res.ok) {
                setResetMessage(data.error || "Failed to send reset link.");
            } else {
                setResetMessage("Reset link sent to your email.");
            }
        } catch (err) {
            setResetMessage("Something went wrong.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f4f0] px-4 py-8 md:px-12">
            <div>
                <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
                    <img src="/f2logo.png" alt="Logo" className="h-8 w-auto" />
                    <span className="text-gray-600">
                        F2<span className="text-teal-400">Realtors</span>
                    </span>
                </Link>
            </div>

            {/* Main Container */}
            <div className="flex flex-col lg:flex-col xl:flex-row items-center xl:items-center gap-10 max-w-6xl mx-auto">

                {/* Image Section */}
                <div className="w-full xl:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-lg md:max-w-2xl h-72 md:h-[400px] lg:h-[480px] xl:h-[80vh] overflow-hidden">
                        <Image
                            src="/login.png"
                            alt="Auth"
                            fill
                            className="object-contain  rounded-xl"
                            priority
                        />
                    </div>
                </div>
                {/* Form Side */}
                <div className="w-full max-w-lg md:max-w-xl mx-auto xl:mx-0 xl:w-1/2  rounded-xl  px-6 py-8 md:px-10 md:py-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center md:text-left">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 mb-8 text-center md:text-left">Sign in to your account</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                            <div className="text-right mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotForm(!showForgotForm)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Forgot Password Form */}
                    {showForgotForm && (
                        <div className="mt-8 border-t pt-6">
                            <h3 className="text-md font-semibold mb-2 text-gray-700">Reset Your Password</h3>
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
                                >
                                    Send Reset Link
                                </button>
                                {resetMessage && (
                                    <p className="text-sm text-gray-600 mt-2">{resetMessage}</p>
                                )}
                            </form>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
