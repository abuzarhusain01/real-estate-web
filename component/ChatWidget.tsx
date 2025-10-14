"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Chat from "@/app/(site)/chat/page";

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]); // chat state

    return (
        <div
            className="
                fixed bottom-4 right-5 z-50
            "
        >
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

            {open && (
                <div
                    className="w-[90vw] max-w-sm h-[70vh] sm:w-96 md:h-[600px] sm:h-[500px] bg-white shadow-2xl rounded-xl border flex flex-col"
                >
                    <div className="flex justify-between items-center bg-teal-600 text-white p-3 rounded-t-xl">
                        <span className="font-semibold">F2Realtors Assistant</span>
                        <button
                            onClick={() => setOpen(false)}
                            className="hover:text-gray-200 transition"
                        >
                            ✖
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <Chat messages={messages} setMessages={setMessages} />
                    </div>
                </div>
            )}
        </div>
    );
}
