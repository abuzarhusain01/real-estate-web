"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import Form from "../../form";

type Agent = {
    name: string;
    phone_number: string;
    email: string;
    gender: "Male" | "Female" | "Other";
    status: "Active" | "Inactive";
    roll: string;
    password: string;
    experience: string | number;
    image: string;
};


export default function EditAgent() {
    const router = useRouter();
    const params = useParams();
    const agentId = params.id;

    return (
        <Form agentId={agentId} />
    );
}
