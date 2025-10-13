"use client";
import React, { useEffect, useState, Suspense, lazy, useCallback, useMemo } from "react";
import { Star } from 'lucide-react';

// Lazy load sections
const HeroSection = lazy(() => import('./homeComponants/HeroSection'));
const WhatWeDoSection = lazy(() => import('./homeComponants/WhatWeDoSection'));
const FeaturedPropertiesSection = lazy(() => import('./homeComponants/FeaturedPropertiesSection'));
const AllPropertiesSection = lazy(() => import('./homeComponants/AllPropertiesSection'));
const TestimonialsSection = lazy(() => import('./homeComponants/TestimonialsSection'));
const ReviewsSection = lazy(() => import('./homeComponants/ReviewsSection'));
const AboutSection = lazy(() => import('./homeComponants/AboutSection'));
const ContactFormSection = lazy(() => import('./homeComponants/ContactFormSection'));
const ChatWidget = lazy(() => import('./ChatWidget'));

type Property = {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    owner_name: string;
    location: string;
    owner_contact: string;
    status: string;
    is_featured?: boolean;
    is_hotspot?: boolean;
    is_favourites?: boolean;
};

type Review = {
    id: number;
    rating: number;
    comment: string;
    user_id?: string;
    created_at: string;
};

type Customer = {
    id: number;
    name: string;
    email: string;
};

const ITEMS_PER_PAGE = 50;

// Skeleton loader component for properties
const PropertySkeleton = () => (
    <div className="w-80 min-w-[320px] bg-white rounded-xl shadow-md p-4 animate-pulse mx-auto">
        <div className="w-full h-56 bg-gray-300 rounded-lg mb-4" />
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-1/3 mt-4" />
    </div>
);

const PropertyCard = React.memo(({
    property,
    handleFavorite
}: {
    property: Property;
    handleFavorite: (id: number, is_favourites: boolean) => void;
}) => (
    <div className="w-80 min-w-[320px] bg-transparent rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-xl mx-auto">
        <div className="relative rounded-lg overflow-hidden shadow-md">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    handleFavorite(property.id, !property.is_favourites);
                }}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition"
            >
                {property.is_favourites ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-red-500 fill-red-500"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12.1 21.35l-1.1-1.02C5.14 15.22 2 12.17 2 8.5 2 6.01 4.01 4 6.5 4c1.74 0 3.41 1.01 4.1 2.09C11.09 5.01 12.76 4 14.5 4 16.99 4 19 6.01 19 8.5c0 3.67-3.14 6.72-8.9 11.83l-1.1 1.02z" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21C12 21 4 13.75 4 8.5C4 6 6 4 8.5 4C10 4 11.5 5 12 6C12.5 5 14 4 15.5 4C18 4 20 6 20 8.5C20 13.75 12 21 12 21Z"
                        />
                    </svg>
                )}
            </button>
            <img src={property.image} alt={property.name} className="w-full h-56 object-cover" />
        </div>
        <div className="p-4">
            <p className="text-sm text-black uppercase">{property.location}</p>
            <h3 className="mt-2 text-xl font-semibold text-gray-900">{property.name}</h3>
            <p className="mt-1 text-gray-600 text-sm">{property.description}</p>
            <p className="mt-3 text-teal-600 text-lg font-bold">₹{Number(property.price).toLocaleString("en-IN")}</p>
        </div>
    </div>
));

PropertyCard.displayName = 'PropertyCard';

const TestimonialCard = React.memo(({ review }: { review: Review }) => (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <div className="flex space-x-1 mb-4">
            {[...Array(5)].map((_, idx) => (
                <Star
                    key={idx}
                    className={`w-5 h-5 ${idx < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
        <p className="text-gray-800 text-sm font-sans leading-relaxed mb-4">"{review.comment}"</p>
        <p className="text-teal-600 font-sans text-sm">{review.user_id || 'Anonymous'}</p>
    </div>
));

TestimonialCard.displayName = 'TestimonialCard';

// Static data moved outside component to prevent recreation on every render
const services = [
    {
        number: "01",
        title: "Property Sales",
        description: "Find your dream home with F2Realtors - our expert team will guide you through the process and ensure a smooth transaction.",
    },
    {
        number: "02",
        title: "Property Rentals",
        description: "Find your dream rental property with F2Realtors, offering a variety of options to suit your needs and preferences.",
    },
    {
        number: "03",
        title: "Property Management",
        description: "Trust F2Realtors to handle the day-to-day management of your property, maximizing its value and minimizing your stress.",
    },
    {
        number: "04",
        title: "Lucrative Investments",
        description: "F2Realtors presents lucrative investment opportunities in the F2Realtors market, providing high returns on investments.",
    },
];

export default function Properties() {
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [featuredCurrentPage, setFeaturedCurrentPage] = useState(1);
    const [allCurrentPage, setAllCurrentPage] = useState(1);
    const [featuredTotalProperties, setFeaturedTotalProperties] = useState(0);
    const [allTotalProperties, setAllTotalProperties] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [propertiesLoading, setPropertiesLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [testimonialsPerPage] = useState(3);
    const [testimonialsCurrentPage, setTestimonialsCurrentPage] = useState(1);
    const [testimonialsTotalPages, setTestimonialsTotalPages] = useState(0);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        phone_number: "",
    });

    // State for dropdown options
    const [filterOptions, setFilterOptions] = useState({
        status: [] as string[],
        bedrooms: [] as string[],
        bathrooms: [] as string[],
        location: [] as string[],
        landmarks: [] as string[],
    });

    // Check if user is logged in
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const customer = JSON.parse(userData);
                setCustomer(customer);
            } catch (error) {
                console.error('Failed to parse user data', error);
            }
        }
    }, []);

    const fetchUserFromAuth = useCallback(async () => {
        try {
            const res = await fetch('/api/auth', {
                method: 'GET',
                credentials: 'include',
            });

            if (res.ok) {
                const authData = await res.json();
                if (authData.customer || authData.user) {
                    const customer = authData.customer || authData.user;
                    setCustomer(customer);
                    localStorage.setItem('user', JSON.stringify(customer));
                }
            }
        } catch (error) {
            console.error('Failed to fetch user from auth API', error);
        }
    }, []);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const customer = JSON.parse(userData);
                setCustomer(customer);
            } catch (error) {
                console.error('Failed to parse user data', error);
                fetchUserFromAuth();
            }
        } else {
            fetchUserFromAuth();
        }
    }, [fetchUserFromAuth]);

    const fetchReviews = useCallback(async () => {
        try {
            setReviewsLoading(true);
            const res = await fetch('/api/review');
            if (res.ok) {
                const { reviews } = await res.json();
                setReviews(reviews || []);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setReviewsLoading(false);
        }
    }, []);

    // Memoized calculations to prevent unnecessary recalculations
    const featuredTotalPages = useMemo(() => Math.ceil(featuredTotalProperties / ITEMS_PER_PAGE), [featuredTotalProperties]);
    const allTotalPages = useMemo(() => Math.ceil(allTotalProperties / ITEMS_PER_PAGE), [allTotalProperties]);

    const fetchProperties = useCallback(async (featuredPage: number, allPage: number) => {
        try {
            setError(null);
            setPropertiesLoading(true);

            const [featuredRes, allRes] = await Promise.all([
                fetch(`/api/properties?is_featured=1&page=${featuredPage}&limit=${ITEMS_PER_PAGE}`),
                fetch(`/api/properties?page=${allPage}&limit=${ITEMS_PER_PAGE}`)
            ]);

            if (!featuredRes.ok || !allRes.ok) {
                console.error('Failed to fetch properties');
            }

            const [featuredData, allData] = await Promise.all([
                featuredRes.json(),
                allRes.json()
            ]);

            setFeaturedProperties(featuredData.properties || []);
            setAllProperties(allData.properties || []);
            setFeaturedTotalProperties(featuredData.total || featuredData.properties.length);
            setAllTotalProperties(allData.total || allData.properties.length);
            setPropertiesLoading(false);
        } catch (err) {
            console.error("Error fetching properties:", err);
            setError(err instanceof Error ? err.message : 'Failed to load properties');
            setPropertiesLoading(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties(featuredCurrentPage, allCurrentPage);
        fetchReviews();
    }, [featuredCurrentPage, allCurrentPage, fetchProperties, fetchReviews]);

    // Calculate total pages for testimonials
    useEffect(() => {
        setTestimonialsTotalPages(Math.ceil(reviews.length / testimonialsPerPage));
    }, [reviews, testimonialsPerPage]);

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

    const handleFavorite = useCallback(async (id: number, is_favourites: boolean) => {
        try {
            const res = await fetch("/api/properties/favourites", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, is_favourites }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update favorite");
            }

            setFeaturedProperties(prev =>
                prev.map(prop =>
                    prop.id === id ? { ...prop, is_favourites } : prop
                )
            );
            setAllProperties(prev =>
                prev.map(prop =>
                    prop.id === id ? { ...prop, is_favourites } : prop
                )
            );
        } catch (error) {
            console.error("Favorite update error:", error);
            alert(error instanceof Error ? error.message : "Something went wrong");
        }
    }, []);

    const handleSubmitReview = async () => {
        if (!customer) {
            alert('Please login to submit a review.');
            return;
        }

        if (!rating || !comment.trim()) {
            alert('Please provide a rating and comment.');
            return;
        }

        try {
            const res = await fetch('/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating,
                    message: comment,
                    user_id: customer.name
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setRating(0);
                setComment('');
                alert('Thank you for your feedback!');
                fetchReviews();
            } else {
                console.error("API Error:", data);
                alert(data.error || 'Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Something went wrong.');
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-[#f8f4f0] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className=" bg-[#f8f4f0]">
            {/* Hero Section */}
            <Suspense fallback={<div className="animate-pulse h-[650px] bg-gray-200"></div>}>
                <HeroSection />
            </Suspense>

            <br />

            {/* What We Do Section */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <WhatWeDoSection />
            </Suspense>

            {/* Featured Properties */}
            {/* <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <FeaturedPropertiesSection
                    featuredProperties={featuredProperties}
                    propertiesLoading={propertiesLoading}
                    featuredCurrentPage={featuredCurrentPage}
                    featuredTotalPages={featuredTotalPages}
                    setFeaturedCurrentPage={setFeaturedCurrentPage}
                    handleFavorite={handleFavorite}
                />
            </Suspense> */}

            {/* All Properties with Pagination */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <AllPropertiesSection
                    allProperties={allProperties}
                    propertiesLoading={propertiesLoading}
                    allCurrentPage={allCurrentPage}
                    allTotalPages={allTotalPages}
                    setAllCurrentPage={setAllCurrentPage}
                    handleFavorite={handleFavorite}
                />
            </Suspense>

            <br />
            <br />

            {/* Testimonials Section */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <TestimonialsSection
                    reviews={reviews}
                    reviewsLoading={reviewsLoading}
                    testimonialsCurrentPage={testimonialsCurrentPage}
                    testimonialsTotalPages={testimonialsTotalPages}
                    testimonialsPerPage={testimonialsPerPage}
                    setTestimonialsCurrentPage={setTestimonialsCurrentPage}
                />
            </Suspense>

            <br />
            <br />

            {/* Reviews Section */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <ReviewsSection
                    customer={customer}
                    rating={rating}
                    setRating={setRating}
                    hover={hover}
                    setHover={setHover}
                    comment={comment}
                    setComment={setComment}
                    handleSubmitReview={handleSubmitReview}
                />
            </Suspense>

            <br />
            <br />

            {/* About Section */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <AboutSection />
            </Suspense>

            {/* Contact Form Section */}
            <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200"></div>}>
                <ContactFormSection
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitted={submitted}
                />
            </Suspense>

            {/* ai bot */}
            <Suspense fallback={null}>
                <ChatWidget />
            </Suspense>

        </div>
    );
}