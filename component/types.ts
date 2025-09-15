export type Property = {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    owner_name: string;
    location: string;
    owner_contact: string;
    status: string;
    is_featured?: boolean;
    is_hotspot?: boolean;
    is_favourites?: boolean;
};

export type Review = {
    id: number;
    rating: number;
    comment: string;
    user_id?: string;
    created_at: string;
};

export type Customer = {
    id: number;
    name: string;
    email: string;
};