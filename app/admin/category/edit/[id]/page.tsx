"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import Form from "../../form";

type Category = {
    id: number;
    title: string;
    description: string;
};

export default function EditCategory() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id;

    return (
        <Form categoryId={categoryId} />
    );
}
