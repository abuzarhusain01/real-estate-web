"use client";
import { Home, FileText, FileCheck, DollarSign } from "lucide-react";

export default function PropertyServices() {
    const services = [
        {
            title: "Home Loans",
            desc: "View & compare your best offers and apply online",
            icon: Home,
            bg: "bg-blue-50",
            color: "text-blue-600",
        },
        {
            title: "Legal Assistance",
            desc: "Get help with documentation, RERA, and verification",
            icon: FileText,
            bg: "bg-green-50",
            color: "text-green-600",
        },
        {
            title: "Registration Support",
            desc: "Assistance with property registration and stamp duty",
            icon: FileCheck,
            bg: "bg-yellow-50",
            color: "text-yellow-600",
        },
        {
            title: "Property Valuation",
            desc: "Find the accurate price of your property with expert tools",
            icon: DollarSign,
            bg: "bg-purple-50",
            color: "text-purple-600",
        },
    ];

    return (
        <div className="w-full max-w-[92%] mx-auto mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Property Services</h2>

            <div className="flex gap-4 overflow-x-auto cursor-pointer pb-4 px-2 scroll-smooth">
                {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                        <div
                            key={index}
                            className={`min-w-[280px] ${service.bg} rounded-xl p-4 hover:shadow-md transition transform hover:scale-105 duration-300 flex items-start gap-4 shadow-sm flex-shrink-0`}
                        >
                            <div className={`p-2 rounded-full ${service.bg}`}>
                                <Icon className={`h-8 w-8 ${service.color}`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">{service.title}</h3>
                                <p className="text-sm text-gray-600">{service.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
