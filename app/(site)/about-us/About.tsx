"use client";
import React, { useState, useCallback, Suspense, lazy } from "react";

// Lazy load sections
const AboutHeroSection = lazy(() => import('../../../component/aboutComponants/HeroSection'));
const AboutContentSection = lazy(() => import('../../../component/aboutComponants/AboutContentSection'));
const ClientCentricSection = lazy(() => import('../../../component/aboutComponants/ClientCentricSection'));
const OurStorySection = lazy(() => import('../../../component/aboutComponants/OurStorySection'));
const ContactFormSection = lazy(() => import('../../../component/aboutComponants/ContactFormSection'));
const AboutPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        phone_number: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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
            {/* Hero Section */}
            <Suspense fallback={<div className="animate-pulse h-[650px] bg-gray-200"></div>}>
                <AboutHeroSection />
            </Suspense>

            {/* About Content Section */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <AboutContentSection />
            </Suspense>

            {/* Client Centric Section */}
            <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200"></div>}>
                <ClientCentricSection />
            </Suspense>

            {/* Our Story Section */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <OurStorySection />
            </Suspense>

            <br />

            {/* Contact Form Section */}
            <Suspense fallback={<div className="animate-pulse h-[800px] bg-gray-200"></div>}>
                <ContactFormSection
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitted={submitted}
                />
            </Suspense>
        </div>
    )
}

export default AboutPage;