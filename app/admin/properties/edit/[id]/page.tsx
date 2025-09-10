"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Form from "../../form";

type Property = {
    name: string;
    description: string;
    price: number;
    owner: string;
    location: string;
    contact: string;
};


export default function EditProperty() {
    const router = useRouter();
    const params = useParams();
    const propertyId = params.id;

    return (
        <Form propertyId={propertyId} />
    );
}
