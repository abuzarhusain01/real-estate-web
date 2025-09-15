import React from "react";
import { Star } from 'lucide-react';
import { Customer } from "../types";

interface ReviewsSectionProps {
    customer: Customer | null;
    rating: number;
    setRating: (rating: number) => void;
    hover: number;
    setHover: (hover: number) => void;
    comment: string;
    setComment: (comment: string) => void;
    handleSubmitReview: () => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
    customer,
    rating,
    setRating,
    hover,
    setHover,
    comment,
    setComment,
    handleSubmitReview
}) => {
    return (
        <div className="bg-[#3e558c] text-white rounded-2xl p-10 mx-auto max-w-[92%] flex flex-col md:flex-row items-center justify-between shadow-lg">
            <div className="md:w-1/2 flex justify-center">
                <img
                    src="/rating.png"
                    alt="Rating Illustration"
                    width={500}
                    height={400}
                    className="rounded-xl w-full h-auto object-cover md:h-full"
                />
            </div>

            <div className="md:w-1/2 px-7 space-y-4">
                <h2 className="text-5xl py-3 font-bold">Rating and Review</h2>
                <p className="text-3xl">How are you feeling?</p>
                <p className="text-lg text-white/80">
                    Your input is valuable in helping us better understand your
                    needs and tailor our service accordingly.
                </p>

                {customer ? (
                    <p className="text-sm text-green-300">
                        ✓ Logged in as {customer.name}
                    </p>
                ) : (
                    <p className="text-sm text-yellow-300">
                        ⚠ Please login to submit a review
                    </p>
                )}

                <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                            className={`w-7 h-7 cursor-pointer transition ${(hover || rating) >= star
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-white'
                                }`}
                        />
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a Comment.."
                    className="w-full p-4 mt-4 rounded-xl bg-white text-black resize-none min-h-[100px]"
                    disabled={!customer}
                />

                <button
                    onClick={handleSubmitReview}
                    disabled={!customer || rating === 0 || comment.trim() === ''}
                    className={`font-sans cursor-pointer text-md px-9 py-2 rounded-full transition-colors ${customer && rating > 0 && comment.trim() !== ''
                        ? 'bg-teal-500 hover:bg-teal-600 text-white'
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        }`}
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
};

export default ReviewsSection;