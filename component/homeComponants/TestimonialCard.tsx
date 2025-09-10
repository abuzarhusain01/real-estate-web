import React from "react";
import { Star } from 'lucide-react';
import { Review } from "../types";

interface TestimonialCardProps {
    review: Review;
}

const TestimonialCard = React.memo(({ review }: TestimonialCardProps) => (
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

export default TestimonialCard;