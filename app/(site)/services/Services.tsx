"use client";
import React, { useState, useCallback, Suspense, lazy } from "react";

// Lazy load sections
const ServicesHeroSection = lazy(() => import('../../../component/serviceComponants/ServicesHeroSection'));
const PropertySalesSection = lazy(() => import('../../../component/serviceComponants/PropertySalesSection'));
const PropertyRentalsSection = lazy(() => import('../../../component/serviceComponants/PropertyRentalsSection'));
const ContactFormSection = lazy(() => import('../../../component/serviceComponants/ContactFormSection'));

const ServicesPage = () => {
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
                <ServicesHeroSection />
            </Suspense>

            {/* Property Sales Section 1 */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <PropertySalesSection
                    image="/sale.jpg"
                    title="Property Sales"
                    description={`Looking to buy or sell a property? Look no further. ${process.env.NEXT_PUBLIC_NAME} offers a wide range of properties for sale, matching you with your dream home or investment. Trust our experienced team to guide you through the entire process.`}
                />
            </Suspense>

            {/* Property Rentals Section 1 */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <PropertyRentalsSection
                    image="/rental.jpg"
                    title="Interior Design"
                    description={`Elevate your living experience with premium Interior Design by ${process.env.NEXT_PUBLIC_NAME}. We collaborate with top designers to craft luxurious, elegant, and timeless interiors for homes and offices.`}
                />
            </Suspense>

            {/* Property Sales Section 2 */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <PropertySalesSection
                    image="/sale2.jpg"
                    title="Property Rentals"
                    description={`In search of a rental property? ${process.env.NEXT_PUBLIC_NAME} has you covered. Our vast portfolio of properties for rent caters to all your needs and preferences. With our assistance, you can find the perfect rental space in no time. Let's get started.`}
                />
            </Suspense>

            {/* Property Rentals Section 2 */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <PropertyRentalsSection
                    image="/rental2.jpg"
                    title="Commercial Real Estate"
                    description={`At ${process.env.NEXT_PUBLIC_NAME}, we connect businesses with premium commercial properties. Whether you're expanding your office, opening a retail store, or investing in industrial space, we help you secure the right property for success.`}
                />
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

export default ServicesPage;