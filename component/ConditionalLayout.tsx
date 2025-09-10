"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import { ReactNode } from "react";
import AppBar from "@/app/admin/AppBar";

export default function ClientLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Check if we're on admin pages
    const isAdminPage = pathname.startsWith("/admin");

    // Hide footer on auth pages (both regular and admin)
    const hideFooter = pathname.startsWith("/auth") ||
        pathname.startsWith("/admin/auth") ||
        ["/login", "/signup", "/logout"].includes(pathname);

    // Hide AppBar on auth pages
    const hideAppBar = pathname.startsWith("/admin/auth") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/auth") ||
        ["/login", "/signup", "/logout"].includes(pathname);

    return (
        <>
            {/* Show AppBar only for admin pages and not on auth pages */}
            {isAdminPage && !hideAppBar && <AppBar />}

            {children}

            {/* Show Footer only for non-admin pages and not on auth pages */}
            {!isAdminPage && !hideFooter && <Footer />}
        </>
    );
}