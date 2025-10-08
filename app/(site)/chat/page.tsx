"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";

export default function Chat({ messages = [], setMessages = () => { } }) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingMessage, setTypingMessage] = useState("");
    const [comparisonProperties, setComparisonProperties] = useState<any[]>([]);
    const [showComparison, setShowComparison] = useState(false);
    const [propertyDetails, setPropertyDetails] = useState<Record<string, any>>({});
    const messagesEndRef = useRef<HTMLDivElement | null>(null);


    // Auto scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();

        // Add event listener for custom addToComparison events
        const handleComparisonClick = (e) => {
            if (e.target.classList.contains('add-to-comparison')) {
                const propertyId = e.target.getAttribute('data-id');
                const propertyName = e.target.getAttribute('data-name');
                addToComparison(propertyId, propertyName);
            }
        };

        document.addEventListener('click', handleComparisonClick);

        return () => {
            document.removeEventListener('click', handleComparisonClick);
        };
    }, [messages, isTyping]);

    // Fetch property details when added to comparison
    useEffect(() => {
        const fetchPropertyDetails = async (propertyId) => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/property/${propertyId}`);
                const data = await response.json();
                setPropertyDetails(prev => ({
                    ...prev,
                    [propertyId]: data
                }));
            } catch (error) {
                console.error("Error fetching property details:", error);
            }
        };

        comparisonProperties.forEach(property => {
            if (!propertyDetails[property.id]) {
                fetchPropertyDetails(property.id);
            }
        });
    }, [comparisonProperties]);

    // Typing animation effect
    const typeMessage = (content) => {
        setIsTyping(true);
        setTypingMessage("");

        // Strip tags but preserve text properly
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        const plainText = tempDiv.innerText || tempDiv.textContent;

        let index = -1;
        const typeInterval = setInterval(() => {
            if (index < plainText.length) {
                setTypingMessage((prev) => prev + plainText[index]);
                index++;
            } else {
                clearInterval(typeInterval);
                setIsTyping(false);
                setTypingMessage("");
                // Add the full message with HTML formatting
                setMessages((prev) => [...prev, { role: "assistant", content }]);
            }
        }, 30); // typing speed
    };

    // Add property to comparison
    const addToComparison = (propertyId, propertyName) => {
        // Check if property already exists in comparison
        if (comparisonProperties.some(p => p.id === propertyId)) {
            return;
        }

        // Add to comparison
        setComparisonProperties(prev => [...prev, { id: propertyId, name: propertyName }]);

        // Show confirmation message
        const confirmationMessage = `Added "${propertyName}" to comparison. You have ${comparisonProperties.length + 1} properties in comparison.`;
        setMessages(prev => [...prev, {
            role: "assistant",
            content: `<div style="background:#e0f7fa;border-radius:8px;padding:10px;margin:10px 0;">
                <div style="display:flex;align-items:center;">
                    <span style="margin-right:8px;"> ✅</span>
                    <span>${confirmationMessage}</span>
                </div>
            </div>`
        }]);
    };

    // Remove property from comparison
    const removeFromComparison = (propertyId) => {
        setComparisonProperties(prev => prev.filter(p => p.id !== propertyId));
    };

    // Clear all comparisons
    const clearComparison = () => {
        setComparisonProperties([]);
        setShowComparison(false);
        setPropertyDetails({});
    };

    const handleSubmit = async (e) => {
        e && e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input };
        const currentMessages = [...messages, userMessage];

        setMessages(currentMessages);
        setInput("");
        setLoading(true);

        // Searching animation
        setIsTyping(true);
        setTypingMessage("Searching our database");
        let dots = "";
        const searchInterval = setInterval(() => {
            dots = dots.length >= 3 ? "" : dots + ".";
            setTypingMessage("Searching our database" + dots);
        }, 500);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // ✅ Send only last 5 messages to prevent server overload
                body: JSON.stringify({ messages: currentMessages.slice(-5) }),
            });

            const data = await response.json();
            clearInterval(searchInterval);

            const aiContent = data.content || "No response from server";

            setLoading(false);
            setIsTyping(false);
            setTypingMessage("");

            // Typing animation for assistant reply
            typeMessage(aiContent);
        } catch (error) {
            console.error("API Error:", error);
            clearInterval(searchInterval);
            setLoading(false);
            setIsTyping(false);
            setTypingMessage("");
            typeMessage("Error connecting to server. Please try again.");
        }
    };

    // Clear conversation function
    const clearChat = () => {
        setMessages([]);
        setComparisonProperties([]);
        setShowComparison(false);
        setPropertyDetails({});
    };

    // Comparison view component
    const ComparisonView = () => {
        if (!showComparison || comparisonProperties.length === 0) return null;

        return (
            <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Property Comparison</h3>
                        <button
                            onClick={() => setShowComparison(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left">Feature</th>
                                    {comparisonProperties.map(property => (
                                        <th key={property.id} className="border p-2 text-center relative">
                                            {property.name}
                                            <button
                                                onClick={() => removeFromComparison(property.id)}
                                                className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-xs"
                                            >
                                                ✕
                                            </button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border p-2 font-medium">Price</td>
                                    {comparisonProperties.map(property => (
                                        <td key={property.id} className="border p-2 text-center">
                                            {propertyDetails[property.id] ?
                                                `₹${Number(propertyDetails[property.id].price).toLocaleString("en-IN")}` :
                                                "Loading..."
                                            }
                                        </td>
                                    ))}
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border p-2 font-medium">Location</td>
                                    {comparisonProperties.map(property => (
                                        <td key={property.id} className="border p-2 text-center">
                                            {propertyDetails[property.id] ?
                                                propertyDetails[property.id].location :
                                                "Loading..."
                                            }
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border p-2 font-medium">Bedrooms</td>
                                    {comparisonProperties.map(property => (
                                        <td key={property.id} className="border p-2 text-center">
                                            {propertyDetails[property.id] ?
                                                propertyDetails[property.id].bedrooms :
                                                "Loading..."
                                            }
                                        </td>
                                    ))}
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border p-2 font-medium">Bathrooms</td>
                                    {comparisonProperties.map(property => (
                                        <td key={property.id} className="border p-2 text-center">
                                            {propertyDetails[property.id] ?
                                                propertyDetails[property.id].bathrooms :
                                                "Loading..."
                                            }
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border p-2 font-medium">Status</td>
                                    {comparisonProperties.map(property => (
                                        <td key={property.id} className="border p-2 text-center">
                                            {propertyDetails[property.id] ?
                                                propertyDetails[property.id].status :
                                                "Loading..."
                                            }
                                        </td>
                                    ))}
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border p-2 font-medium">Description</td>
                                    {comparisonProperties.map(property => (
                                        <td key={property.id} className="border p-2 text-center text-sm">
                                            {propertyDetails[property.id] ?
                                                (propertyDetails[property.id].description || "No description").substring(0, 100) + "..." :
                                                "Loading..."
                                            }
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border p-2 font-medium">Action</td>
                                    {comparisonProperties.map(property => (
                                        <td key={property.id} className="border p-2 text-center">
                                            <a
                                                href={`/properties/detail/${property.id}`}
                                                target="_blank"
                                                className="text-blue-500 hover:text-blue-700 text-sm"
                                            >
                                                View Details
                                            </a>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={clearComparison}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={() => setShowComparison(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Close Comparison
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {/* Header with clear button and comparison button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">🏠 Property Assistant</h2>
                <div className="flex gap-2">
                    {comparisonProperties.length > 0 && (
                        <button
                            onClick={() => setShowComparison(true)}
                            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            Compare ({comparisonProperties.length})
                        </button>
                    )}
                    {messages.length > 0 && (
                        <button
                            onClick={clearChat}
                            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                        >
                            Clear Chat
                        </button>
                    )}
                </div>
            </div>

            {/* Chat messages area */}
            <div className="border rounded-lg p-4 bg-[#f8f4f0] h-[50vh] overflow-y-auto">
                {/* Welcome message when no messages */}
                {messages.length === 0 && (
                    <div className="text-center text-gray-600 mt-8">
                        <div className="text-4xl mb-4">🏠</div>
                        <div className="text-lg font-medium mb-2">Welcome to Property Assistant!</div>
                        <div className="text-sm text-gray-500 mb-4">
                            I can help you search for properties with specific criteria
                        </div>
                        <div className="text-xs text-gray-400 bg-white p-3 rounded-lg max-w-md mx-auto">
                            <strong>Try examples like:</strong><br />
                            • "3 bedroom properties in Mumbai"<br />
                            • "2 BHK under 50 lakh in Delhi"<br />
                            • "Properties in Goa with 2 bathrooms"<br />
                            • "4 bedroom houses in Bangalore under 1 crore"
                        </div>
                    </div>
                )}

                {messages.map((m, i) => (
                    <div key={i} className="mb-4">
                        <div
                            className={`p-3 rounded-lg max-w-[85%] ${m.role === "user"
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-white shadow-sm"
                                }`}
                        >
                            <div className="text-xs font-semibold mb-1 opacity-70">
                                {m.role === "user" ? "You" : "Property Assistant"}
                            </div>
                            <div
                                className="text-sm"
                                dangerouslySetInnerHTML={{
                                    __html: m.content.replace(/\n/g, "<br/>"),
                                }}
                            />
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isTyping && typingMessage && (
                    <div className="mb-4">
                        <div className="bg-white shadow-sm p-3 rounded-lg max-w-[85%]">
                            <div className="text-xs font-semibold mb-1 opacity-70">
                                Property Assistant
                            </div>
                            <div className="text-sm">
                                {typingMessage}
                                <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading indicator */}
                {loading && !isTyping && (
                    <div className="mb-4">
                        <div className="bg-white shadow-sm p-3 rounded-lg max-w-[85%]">
                            <div className="text-xs font-semibold mb-1 opacity-70">
                                Property Assistant
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    ></div>
                                </div>
                                <span className="ml-2">Processing your request...</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scroll target */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <input
                    className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search properties... (e.g., '3 BHK in Mumbai', '2 bedroom under 50 lakh')"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    disabled={loading || isTyping || !input.trim()}
                >
                    {loading ? (
                        <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : "Send"}
                </button>
            </form>

            {/* Quick search suggestions */}
            {messages.length === 0 && (
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {[
                        "3 BHK in Mumbai",
                        "2 bedroom under 50 lakh",
                        "Properties in Goa",
                        "4 bedroom houses"
                    ].map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => {
                                if (!loading && !isTyping) {
                                    setInput(suggestion);
                                }
                            }}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                            disabled={loading || isTyping}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {/* Comparison view modal */}
            <ComparisonView />
        </div>
    );
}