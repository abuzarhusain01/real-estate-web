// components/PropertyGallery.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyGalleryProps {
    images: string[];
    propertyName: string;
}

export default function PropertyGallery({ images, propertyName }: PropertyGalleryProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openModal = (index: number) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const nextImage = () => {
        setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    };

    const prevImage = () => {
        setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="w-full max-w-[92%] mx-auto mt-10">
            <h2 className="text-3xl text-gray-800 mb-6 text-center">
                Property Gallery
            </h2>

            <div className="overflow-x-auto">
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow p-2 flex-shrink-0 w-[85%] sm:w-[280px] md:w-[300px] snap-center transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                            onClick={() => openModal(idx)}
                        >
                            <Image
                                src={img}
                                alt={`${propertyName} - Image ${idx + 1}`}
                                width={300}
                                height={200}
                                className="rounded-xl h-40 w-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>


            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
                    >
                        <X size={32} />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 text-white hover:text-gray-300 z-60"
                            >
                                <ChevronLeft size={48} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 text-white hover:text-gray-300 z-60"
                            >
                                <ChevronRight size={48} />
                            </button>
                        </>
                    )}

                    <div className="relative max-w-7xl max-h-full mx-4">
                        <Image
                            src={images[currentImageIndex]}
                            alt={`${propertyName} - Image ${currentImageIndex + 1}`}
                            width={1200}
                            height={800}
                            className="max-w-full max-h-[90vh] object-contain"
                        />

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}