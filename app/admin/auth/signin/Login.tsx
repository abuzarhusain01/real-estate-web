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

            localStorage.setItem(
                "user",
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
        <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f4f0] px-4 py-8 md:px-12">
            <div>
                <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
                    <img src="/f2logo.png" alt="Logo" className="h-8 w-auto" />
                    <span className="text-gray-600">
                        F2<span className="text-teal-400">Realtors</span>
                    </span>
                </Link>
            </div>

            {/* Image Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
                <div className="relative w-full md:h-[80vh] rounded-xl overflow-hidden ">
                    <Image
                        src="/login.png"
                        alt="Login"
                        width={600}
                        height={400}
                        className="rounded-xl w-full h-auto object-cover md:h-full"
                        priority
                    />
                </div>
            </div>

            {/* Form Side */}
            <div className="flex flex-col justify-center w-full md:w-1/2 px-4 sm:px-8 py-4 md:py-12 max-w-md mx-auto">
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
    );
}
