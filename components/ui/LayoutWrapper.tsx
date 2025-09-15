"use client";

import { usePathname } from "next/navigation";
import Footer from "@/component/Footer";
import { ReactNode } from "react";
import AppBar from "@/app/admin/AppBar";

export default function ConditionalLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Check if we're on admin pages
    const isAdminPage = pathname.startsWith("/admin");

    // Hide footer on auth pages (both regular and admin)
    const hideFooter =
        pathname.startsWith("/auth") ||
        pathname.startsWith("/admin/auth") ||
        ["/login", "/signup", "/logout"].includes(pathname);

    // Hide AppBar on auth pages
    const hideAppBar =
        pathname.startsWith("/admin/auth") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/auth") ||
        ["/login", "/signup", "/logout"].includes(pathname);

    return (
        <>
            {/* Show AppBar only for admin pages and not on auth pages */}
            {isAdminPage && !hideAppBar && <AppBar />}

            <div className="relative w-full h-full">
                <img
                    src="/form1.jpg"
                    alt="contact"
                    className="absolute inset-0 w-full h-full object-cover brightness-50 z-0"
                />
                <div className="relative z-30">
                    {children}
                </div>
            </div>

            {/* Show Footer only for non-admin pages and not on auth pages */}
            {!isAdminPage && !hideFooter && <Footer />}
        </>
    );
}
