"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Form from "../../form";


type Sales = {
    name: string;
    phone_number: string;
    date: string; // or Date if you're using real Date objects
    email: string;
    status: "New " | "Contacted" | "Connected" | "Rejected" | "Closed" | "Closed"; // assuming it's an ENUM
};

export default function EditSles() {
    const router = useRouter();
    const params = useParams();
    const salesId = params.id;

    return (
        <Form salesId={salesId} />
    );
}
