"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

// ✅ TypeScript interface for form data
interface PropertyFormData {
    name: string;
    image: string;
    description: string;
    price: string;
    owner_name: string;
    location: string;
    owner_contact: string;
    status: string;
    is_featured: boolean;
    images: string[];
    bedrooms: string;
    bathrooms: string;
    balconies: string;
    furnishing: string;
    carpet_area: string;
    floor: string;
    flooring: string;
    lifts: string;
    project: string;
    transaction_type: string;
    facing: string;
    address: string;
    overlooking: string;
    landmarks: string;
    booking_amount: string;
    price_breakup: string;
    flat: string;
    shopping_centers: string;
    educational_institute: string;
    nearby_localities: string;
    home_loans: string;
    emi: string;
    is_hotspot: boolean;
    created_at: Date;
}

export default function PropertyForm({ propertyId }: { propertyId?: string }) {
    const router = useRouter();

    const initialFormData: PropertyFormData = {
        name: "",
        image: "",
        description: "",
        price: "",
        owner_name: "",
        location: "",
        owner_contact: "",
        status: "",
        is_featured: false,
        images: [],
        bedrooms: "",
        bathrooms: "",
        balconies: "",
        furnishing: "",
        carpet_area: "",
        floor: "",
        flooring: "",
        lifts: "",
        project: "",
        transaction_type: "",
        facing: "",
        address: "",
        overlooking: "",
        landmarks: "",
        booking_amount: "",
        price_breakup: "",
        flat: "",
        shopping_centers: "",
        educational_institute: "",
        nearby_localities: "",
        home_loans: "",
        emi: "",
        is_hotspot: false,
        created_at: new Date(),
    };

    const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [step, setStep] = useState(1);
    const [sectionTitle, setSectionTitle] = useState("Step 1: Basic Details");

    const requiredFieldsPerStep: { [key: number]: string[] } = {
        1: ["name", "description", "price"],
        7: ["image"], // ✅ Banner image required
    };

    useEffect(() => {
        if (!propertyId) return;
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/properties/edit/${propertyId}`);
                if (!res.ok) throw new Error("Failed to fetch property");
                const data = await res.json();
                setFormData((prev) => ({
                    ...prev,
                    ...data,
                    is_featured: data.is_featured === 1 || data.is_featured === true,
                    is_hotspot: data.is_hotspot === 1 || data.is_hotspot === true,
                    images: Array.isArray(data.images) ? data.images : [],
                    created_at: data.created_at || "",
                }));
            } catch (err) {
                console.error("Error fetching property:", err);
                setMessage({ text: "Error loading property data", type: "error" });
            }
        };
        fetchData();
    }, [propertyId]);

    useEffect(() => {
        const titles = [
            "Step 1: Basic Details",
            "Step 2: Owner & Location",
            "Step 3: Interior Details",
            "Step 4: Amenities",
            "Step 5: Final Details",
            "Step 6: Review & Submit",
        ];
        setSectionTitle(titles[step - 1]);
    }, [step]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const validateStep = () => {
        const requiredFields = requiredFieldsPerStep[step] || [];
        for (const field of requiredFields) {
            const value = (formData as any)[field];
            if (!value || value.toString().trim() === "") {
                const label = field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
                setMessage({ text: `Please fill the "${label}" field.`, type: "error" });
                return false;
            }
        }
        setMessage({ text: "", type: "" });
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" });

        try {
            const url = propertyId ? `/api/properties/edit/${propertyId}` : "/api/properties";
            const method = propertyId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (res.ok) {
                setMessage({ text: result.message || "Success!", type: "success" });
                if (!propertyId) {
                    setFormData(initialFormData);
                    setStep(1);
                } else {
                    router.push("/admin/properties");
                }
            } else {
                setMessage({ text: result.error || "Something went wrong", type: "error" });
            }
        } catch (err: any) {
            console.error("Submission error:", err);
            setMessage({ text: `Error: ${err.message}`, type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (validateStep() && step < 7) setStep((s) => s + 1);
    };

    const prevStep = (e: React.MouseEvent) => {
        e.preventDefault();
        if (step > 1) setStep((s) => s - 1);
    };

    const cancel = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push("/admin/properties");
    };

    const inputClass =
        "w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-gray-800";

    const renderStep = () => {
        const section = [
            ["name", "Property Name"],
            ["description", "Description"],
            ["price", "Price"],
            ["booking_amount", "Booking Amount"],

            ["owner_name", "Owner Name"],
            ["owner_contact", "Owner Contact"],
            ["location", "Location"],
            ["landmarks", "Landmarks"],
            ["address", "Address"],

            ["bedrooms", "Bedrooms"],
            ["bathrooms", "Bathrooms"],
            ["balconies", "Balconies"],
            ["carpet_area", "Carpet Area"],
            ["furnishing", "Furnishing"],

            ["facing", "Facing"],
            ["flat", "Flat Type"],
            ["floor", "Floor"],
            ["flooring", "Flooring"],
            ["lifts", "Lifts"],
            ["overlooking", "Overlooking"],

            ["project", "Project Name"],
            ["shopping_centers", "Shopping Centers"],
            ["price_breakup", "Price Breakup"],
            ["educational_institute", "Educational Institute"],
            ["nearby_localities", "Nearby Localities"],
        ];

        const getFields = (range: number[]) => (
            <div className="grid gap-4">
                {section.slice(range[0], range[1]).map(([name, placeholder]) => (
                    <input
                        key={name}
                        type="text"
                        name={name}
                        placeholder={placeholder}
                        value={(formData as any)[name]}
                        onChange={handleChange}
                        className={inputClass}
                    />
                ))}
            </div>
        );

        switch (step) {
            case 1:
                return (
                    <div className="grid gap-4">
                        {getFields([0, 4])}
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">Select Status</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="rent">Rent</option>
                            <option value="sold">Sold</option>
                            <option value="ready to move">Ready to Move</option>
                        </select>
                    </div>
                );
            case 2:
                return getFields([4, 9]);
            case 3:
                return getFields([9, 14]);
            case 4:
                return getFields([14, 20]);
            case 5:
                return getFields([20, 25]);
            case 6:
                return (
                    <div className="grid gap-6">
                        {/* Banner Image Upload */}
                        <div>
                            <label className="block mb-1 text-gray-800 font-medium">Banner Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setFormData((prev) => ({ ...prev, image: reader.result as string }));
                                    };
                                    reader.readAsDataURL(file);
                                }}
                                className={inputClass}
                            />
                            {formData.image && (
                                <img
                                    src={formData.image}
                                    alt="Banner Preview"
                                    className="mt-3 max-h-48 rounded-xl shadow"
                                />
                            )}
                        </div>

                        {/* Similar Images Upload */}
                        <div>
                            <label className="block mb-1 text-gray-800 font-medium">Similar Images</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (!files) return;
                                    const readers = Array.from(files).map(
                                        (file) =>
                                            new Promise<string>((resolve, reject) => {
                                                const reader = new FileReader();
                                                reader.onloadend = () => resolve(reader.result as string);
                                                reader.onerror = reject;
                                                reader.readAsDataURL(file);
                                            })
                                    );
                                    Promise.all(readers).then((newImages) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            images: [...prev.images, ...newImages],
                                        }));
                                    });
                                }}
                                className={inputClass}
                            />
                            {formData.images?.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative">
                                            <img
                                                src={img}
                                                alt={`Similar ${idx + 1}`}
                                                className="h-24 w-full object-cover rounded-lg shadow"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        images: prev.images.filter((_, i) => i !== idx),
                                                    }));
                                                }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Checkboxes */}
                        <div className="grid gap-4">
                            <label className="flex items-center gap-3 text-gray-800 text-sm sm:text-base">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-teal-600"
                                />
                                Mark as <span className="font-medium">Featured Property</span>
                            </label>
                            <label className="flex items-center gap-3 text-gray-800 text-sm sm:text-base">
                                <input
                                    type="checkbox"
                                    name="is_hotspot"
                                    checked={formData.is_hotspot}
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-red-500"
                                />
                                Mark as <span className="font-medium">Hotspot Property</span>
                            </label>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex  ">
            <div className="flex justify-center items-center w-full relative">
                {/* Background Image */}
                {/* <img
                    src="/form1.jpg"
                    alt="contact"
                    className="absolute inset-0 w-full h-full object-cover brightness-40"
                /> */}

                {/* Form Overlay */}
                <div className="relative z-50 max-w-2xl w-full px-4">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-2xl p-9 border bg-[#aaa]"
                    >
                        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
                            {propertyId ? "Edit Property" : "Add New Property"}
                        </h3>

                        <div className="w-full bg-gray-300 rounded-full h-3">
                            <div
                                className="bg-teal-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${(step / 7) * 100}%` }}
                            />
                        </div>

                        <h2 className="text-xl font-semibold text-teal-700 border-b pb-2">{sectionTitle}</h2>

                        {message.text && (
                            <div
                                className={`p-3 rounded-lg text-sm font-medium ${message.type === "success"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        {renderStep()}

                        <div className={`flex flex-wrap gap-4 pt-6 ${step === 1 ? "justify-end" : "justify-between"}`}>
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-4 py-2 bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 rounded-xl text-sm"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={cancel}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-700 rounded-xl text-sm"
                            >
                                Cancel
                            </button>
                            {step < 6 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-xl text-sm"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 cursor-pointer text-white rounded-xl text-sm"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
}