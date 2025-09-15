"use client";

import React from "react";
import { useParams } from "next/navigation";
import Form from "../../form";

export default function EditBank() {
    const params = useParams<{ id: string }>();
    const bankId = params?.id;   // ✅ safe extract

    if (!bankId) {
        return <p className="text-center py-10">Loading Bank...</p>;
    }

    return <Form bankId={bankId} />;
}
