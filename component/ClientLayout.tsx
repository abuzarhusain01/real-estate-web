"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Hide footer on login/signup/logout/auth pages (including admin auth)
    const hideFooter = pathname.startsWith("/auth") ||
        pathname.startsWith("/admin/auth") ||
        ["/login", "/signup", "/logout"].includes(pathname);

    return (
        <>
            {children}
            {!hideFooter && <Footer />}
        </>
    );
}