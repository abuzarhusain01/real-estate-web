
// components/PropertyTools.tsx
"use client";
import { Calculator, TrendingUp, MapPin, BadgeDollarSign } from "lucide-react";

export default function PropertyTools() {
    const tools = [
        {
            title: "EMI Calculator",
            desc: "Know how much you'll have to pay every month...",
            icon: Calculator,
            bg: "bg-red-50",
        },
        {
            title: "Property Valuation",
            desc: "Know the right value for your property...",
            icon: BadgeDollarSign,
            bg: "bg-green-50",
        },
        {
            title: "Investment Hotspot",
            desc: "Discover top localities in your city...",
            icon: MapPin,
            bg: "bg-blue-50",
        },
        {
            title: "Rates & Trends",
            desc: "Know all about Property Rates & Trends...",
            icon: TrendingUp,
            bg: "bg-yellow-50",
        },
    ];

    return (
        <div className="w-full max-w-[92%] mx-auto py-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                Tools to Help You Decide Better
            </h2>

            <div className="flex gap-4 cursor-pointer overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory">
                {tools.map((tool, index) => (
                    <div
                        key={index}
                        className={`min-w-[250px] ${tool.bg} border rounded-lg shadow p-4 hover:shadow-md transition transform hover:scale-105 duration-300 snap-start flex-shrink-0`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <tool.icon className="w-6 h-6 text-red-500" />
                            <h3 className="font-semibold text-sm">{tool.title}</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{tool.desc}</p>
                        <p className="text-red-500 text-sm font-medium cursor-pointer hover:underline">
                            Read more →
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}