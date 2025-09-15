import React from "react";

interface ContactFormSectionProps {
    formData: {
        name: string;
        email: string;
        message: string;
        phone_number: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    submitted: boolean;
}

const ContactFormSection: React.FC<ContactFormSectionProps> = ({
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    submitted
}) => {
    return (
        <div className="relative w-full font-sans h-auto flex justify-center py-10">
            <div className="relative w-full h-auto flex justify-center py-10">
                <div className="w-full max-w-[92%] px-1 md:px-1 relative">
                    <img
                        src="/appoinment.jpg"
                        alt="Background"
                        className="w-full h-[800px] object-cover rounded-2xl"
                        loading="lazy"
                    />

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl w-11/12 md:w-5/6 h-2/3 flex flex-col items-center justify-center px-4 overflow-y-auto">
                        <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-500 px-3 py-1 rounded-md">
                            Contact Us
                        </p>

                        <h2 className="text-2xl md:text-4xl font-sans text-center text-gray-800 mt-2">
                            Schedule an Appointment
                        </h2>

                        <div className="w-12 h-0.5 bg-teal-600 my-4"></div>

                        <form
                            onSubmit={handleSubmit}
                            className="w-full px-10 flex flex-col mb-2 gap-6"
                        >
                            <div className="w-full">
                                <label className="block text-gray-700 text-base md:text-lg font-medium">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-teal-600 transition-colors"
                                    required
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-base md:text-lg font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-teal-600 transition-colors"
                                    required
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-base md:text-lg font-medium">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-teal-600 transition-colors"
                                    required
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-base md:text-lg font-medium">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    rows={2}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-400 bg-transparent resize-none focus:outline-none focus:border-teal-600 transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer font-semibold text-sm tracking-wide px-8 py-3 rounded-full mx-auto transition-colors disabled:opacity-70"
                            >
                                {isSubmitting ? "Sending..." : "Request a Call Back"}
                            </button>

                            {submitted && (
                                <p className="text-green-600 text-center mt-2">Message sent successfully!</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactFormSection;