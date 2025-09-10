// app/admin/layout.tsx
import { ReactNode } from "react";
import LayoutWrapper from "@/components/ui/LayoutWrapper";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <LayoutWrapper>
            {children}
        </LayoutWrapper>
    );
}