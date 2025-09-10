import React from "react";
import { Review } from "../types";
import TestimonialCard from "./TestimonialCard";

interface TestimonialsSectionProps {
    reviews: Review[];
    reviewsLoading: boolean;
    testimonialsCurrentPage: number;
    testimonialsTotalPages: number;
    testimonialsPerPage: number;
    setTestimonialsCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
    reviews,
    reviewsLoading,
    testimonialsCurrentPage,
    testimonialsTotalPages,
    testimonialsPerPage,
    setTestimonialsCurrentPage
}) => {
    return (
        <section className="bg-white rounded-2xl shadow-lg px-6 py-10 md:px-10 md:py-16 mx-4 md:mx-auto max-w-[92%]">
            <div className="mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="text-4xl md:text-5xl font-sans leading-tight text-gray-900">
                        <p className="text-teal-500 font-bold">"</p>
                        <p>Read from clients who</p>
                        <p>have found the perfect</p>
                        <p>place where they can create…</p>
                    </div>
                    <div className="w-10 h-[2px] bg-teal-500 mt-6 mb-6"></div>
                    <p className="text-gray-600 text-base md:text-sm leading-relaxed mb-8">
                        Discover testimonials from satisfied clients who have found their dream properties
                        with {process.env.NEXT_PUBLIC_NAME}, the trusted experts in helping you find the perfect place to call home.
                    </p>
                </div>

                <div className="space-y-6">
                    {reviewsLoading ? (
                        <div className="animate-pulse space-y-6">
                            <div className="bg-gray-200 rounded-xl h-32"></div>
                            <div className="bg-gray-200 rounded-xl h-32"></div>
                        </div>
                    ) : reviews.length > 0 ? (
                        <>
                            {reviews
                                .slice(
                                    (testimonialsCurrentPage - 1) * testimonialsPerPage,
                                    testimonialsCurrentPage * testimonialsPerPage
                                )
                                .map((review, index) => (
                                    <TestimonialCard key={review.id ?? index} review={review} />
                                ))}

                            {testimonialsTotalPages > 1 && (
                                <div className="mt-4 flex justify-center space-x-2">
                                    <button
                                        onClick={() => setTestimonialsCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={testimonialsCurrentPage === 1}
                                        className="px-3 py-1 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: testimonialsTotalPages }, (_, i) => i + 1).map(pageNum => (
                                        <button
                                            key={pageNum}
                                            onClick={() => setTestimonialsCurrentPage(pageNum)}
                                            className={`px-3 cursor-pointer py-1 rounded-md transition-colors text-sm ${testimonialsCurrentPage === pageNum
                                                ? "bg-teal-600 text-white"
                                                : "bg-gray-200 hover:bg-gray-300"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setTestimonialsCurrentPage(prev => Math.min(prev + 1, testimonialsTotalPages))}
                                        disabled={testimonialsCurrentPage === testimonialsTotalPages}
                                        className="px-3 py-1 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <p>No reviews yet. Be the first to leave a review!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;