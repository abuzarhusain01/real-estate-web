
// Main DetailPage component with lazy loading
"use client";
import { notFound } from "next/navigation";
import Navbar from "@/component/Navbar";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useParams } from "next/navigation";

// Lazy load components

const PropertyGallery = lazy(() => import("../../../../../component/detailsComponants/PropertyGallery"));
const PropertyHotspots = lazy(() => import("../../../../../component/detailsComponants/PropertyHotspots"));
const SimilarProperties = lazy(() => import("../../../../../component/detailsComponants/SimilarProperties"));
const HomeLoanOffers = lazy(() => import("../../../../../component/detailsComponants/HomeLoanOffers"));
const PropertyServices = lazy(() => import("../../../../../component/detailsComponants/PropertyServices"));
const OtherProperties = lazy(() => import("../../../../../component/detailsComponants/OtherProperties"));
const VerifiedProperties = lazy(() => import("../../../../../component/detailsComponants/VerifiedProperties"));
const PropertyTools = lazy(() => import("../../../../../component/detailsComponants/PropertyTools"));
const InquiryModal = lazy(() => import("../../../../../component/detailsComponants/InquiryModal"));

// Loading component
function LoadingSection() {
    return (
        <div className="w-full max-w-[92%] mx-auto mt-10 bg-white rounded-xl p-6 md:p-10 shadow">
            <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-32 bg-gray-300 rounded"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>
    );
}

type Property = {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    owner_name: string;
    location: string;
    owner_contact: string;
    status: string;
    images: string[];
    bedrooms: string;
    bathrooms: string;
    balconies: string;
    furnishing: string;
    carpet_area: string;
    floor: string;
    flooring: string;
    lifts: string;
    project: string;
    transaction_type: string;
    facing: string;
    address: string;
    overlooking: string;
    landmarks: string;
    booking_amount: string;
    price_breakup: string;
    flat: string;
    shopping_centers: string;
    educational_institute: string;
    nearby_localities: string;
    home_loans: string;
    emi: string;
};

type SimilarProperty = {
    id: number;
    image: string;
    name: string;
    price: number;
    bedrooms: string;
    bathrooms: string;
    balconies: string;
};

type UserData = {
    id: string;
    name: string;
    email: string;
    phone?: string;
};

type Bank = {
    id: number;
    bank_name: string;
    interest: string;
    loan_amount: string;
    tenure: string;
    emi: string;
    rewards: string;
    bg_color: string;
    loan_disbursed: string;
    year_tenure?: string;
};

async function getBank() {
    const res = await fetch("/api/bank", { cache: "no-store" });
    const data = await res.json();
    if (Array.isArray(data)) return data;
    else if (data.offers && Array.isArray(data.offers)) return data.offers;
    else if (data.banks && Array.isArray(data.banks)) return data.banks;
    else if (data.bank && Array.isArray(data.bank)) return data.bank;
    else return [];
}

async function handleClaim(bankId: number) {
    try {
        const res = await fetch(`/api/bank/claim/${bankId}`, {
            method: "POST",
        });
        if (res.ok) {
            alert("Claim request submitted!");
        } else {
            alert("Failed to claim. Try again.");
        }
    } catch (error) {
        console.error("Error claiming loan:", error);
    }
}

async function getSimilarProducts(id: string, bedrooms: string, bathrooms: string, balconies: string, page: number = 1, limit: number = 6): Promise<SimilarProperty[]> {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        if (bedrooms && bedrooms !== '') {
            params.append('bedrooms', bedrooms);
        }
        if (bathrooms && bathrooms !== '') {
            params.append('bathrooms', bathrooms);
        }
        if (balconies && balconies !== '') {
            params.append('balconies', balconies);
        }

        const res = await fetch(`/api/properties/similar/${id}?${params.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error('Failed to fetch similar properties:', res.status);
            return [];
        }

        const data = await res.json();

        return data.map((property: any) => ({
            id: property.id,
            image: property.image,
            name: property.name,
            price: property.price,
            bedrooms: property.bedrooms || '',
            bathrooms: property.bathrooms || '',
            balconies: property.balconies || ''
        }));

    } catch (error) {
        console.error('Error fetching similar properties:', error);
        return [];
    }
}

async function getNearbyProperties(location: string, excludeId: number): Promise<Property[]> {
    const res = await fetch(`/api/properties?location=${location}&exclude_id=${excludeId}`, {
        cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.properties || [];
}

async function getProjectProperties(project: string, excludeId: number): Promise<Property[]> {
    const res = await fetch(`/api/properties?project=${project}&exclude_id=${excludeId}`, {
        cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.properties || [];
}

async function getVerifiedProperties(project: string, excludeId: number): Promise<Property[]> {
    const res = await fetch(`/api/properties?project=${project}&exclude_id=${excludeId}&verified=true`, {
        cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.properties || [];
}

export default function DetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [property, setProperty] = useState<Property | null>(null);
    const [similarProducts, setSimilarProducts] = useState<SimilarProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [hotspots, setHotspots] = useState<Property[]>([]);
    const [nearbyProperties, setNearbyProperties] = useState<Property[]>([]);
    const [verifiedProperties, setVerifiedProperties] = useState<Property[]>([]);
    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [compareList, setCompareList] = useState<Property[]>([]);
    const [similarPage, setSimilarPage] = useState(1);
    const [hasMoreSimilar, setHasMoreSimilar] = useState(true);
    const [bank, setBank] = useState<Bank[]>([]);
    const SIMILAR_PER_PAGE = 6;

    const fetchUserFromAuth = useCallback(async () => {
        try {
            const res = await fetch('/api/auth', {
                method: 'GET',
                credentials: 'include',
            });

            if (res.ok) {
                const authData = await res.json();
                // Only store customerUser in localStorage
                const customer = authData.customer || authData.user;
                if (customer) {
                    setUserData({
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone
                    });
                    localStorage.setItem("customerUser", JSON.stringify(customer));
                }
            }
        } catch (error) {
            console.error('Failed to fetch user from auth API', error);
        }
    }, []);

    useEffect(() => {
        // Check localStorage for customerUser only
        const storedCustomer = localStorage.getItem('customerUser');
        if (storedCustomer) {
            try {
                const customer = JSON.parse(storedCustomer);
                setUserData({
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone
                });
            } catch (err) {
                console.error('Failed to parse customerUser', err);
                fetchUserFromAuth();
            }
        } else {
            fetchUserFromAuth();
        }
    }, [fetchUserFromAuth]);


    const addToCompare = (propertyToAdd: Property) => {
        const savedCompareList = localStorage.getItem('compareList');
        let currentCompareList: Property[] = [];

        if (savedCompareList) {
            try {
                currentCompareList = JSON.parse(savedCompareList);
            } catch (error) {
                console.error('Failed to parse compare list', error);
            }
        }

        const isAlreadyInCompare = currentCompareList.some(p => p.id === propertyToAdd.id);

        if (isAlreadyInCompare) {
            alert('Property already added to comparison');
            return;
        }

        if (currentCompareList.length >= 3) {
            alert('You can compare maximum 3 properties');
            return;
        }

        const updatedCompareList = [...currentCompareList, propertyToAdd];
        setCompareList(updatedCompareList);
        localStorage.setItem('compareList', JSON.stringify(updatedCompareList));
        alert('Property added to comparison');
    };

    const loadMoreSimilar = async () => {
        if (!property) return;

        try {
            const newSimilar = await getSimilarProducts(
                id,
                property.bedrooms,
                property.bathrooms,
                property.balconies,
                similarPage + 1,
                SIMILAR_PER_PAGE
            );

            if (newSimilar.length > 0) {
                setSimilarProducts([...similarProducts, ...newSimilar]);
                setSimilarPage(similarPage + 1);
            } else {
                setHasMoreSimilar(false);
            }
        } catch (error) {
            console.error('Error loading more similar properties:', error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/properties/detail/${id}`, {
                    cache: "no-store",
                });

                if (!res.ok) {
                    notFound();
                    return;
                }

                const propertyData: Property = await res.json();
                setProperty(propertyData);

                const similarData = await getSimilarProducts(
                    id,
                    propertyData.bedrooms,
                    propertyData.bathrooms,
                    propertyData.balconies,
                    1,
                    SIMILAR_PER_PAGE
                );
                setSimilarProducts(similarData);

                if (similarData.length < SIMILAR_PER_PAGE) {
                    setHasMoreSimilar(false);
                }

                const bankData = await getBank();
                setBank(bankData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    useEffect(() => {
        if (property?.location && property?.id) {
            const fetchHotspots = async () => {
                const url = `/api/properties?is_hotspot=1&location=${property.location}&exclude_id=${property.id}`;

                try {
                    const res = await fetch(url);
                    if (!res.ok) {
                        console.error("Response not OK", res.status);
                        return;
                    }

                    const data = await res.json();

                    if (Array.isArray(data.properties)) {
                        setHotspots(data.properties);
                    }
                } catch (err) {
                    console.error("Fetch error", err);
                }
            };

            const fetchNearbyProperties = async () => {
                try {
                    const data = await getNearbyProperties(property.location, property.id);
                    setNearbyProperties(data);
                } catch (err) {
                    console.error("Nearby properties fetch error", err);
                }
            };

            const fetchVerifiedProperties = async () => {
                try {
                    const data = await getVerifiedProperties(property.project, property.id);
                    setVerifiedProperties(data);
                } catch (err) {
                    console.error("Verified properties fetch error", err);
                }
            };

            fetchHotspots();
            fetchNearbyProperties();
            fetchVerifiedProperties();
        }
    }, [property?.location, property?.id, property?.project]);

    const handleCompareProjects = () => {
        if (property) {
            addToCompare(property);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="w-full max-w-3xl px-6 animate-pulse space-y-6">
                    <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto" />
                    <div className="h-5 bg-gray-300 rounded w-1/3 mx-auto" />
                    <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto" />
                    <div className="h-5 bg-gray-300 rounded w-full mx-auto" />
                    <div className="h-5 bg-gray-300 rounded w-5/6 mx-auto" />

                    <div className="flex justify-center gap-6 pt-6">
                        <div className="h-10 w-32 bg-gray-300 rounded" />
                        <div className="h-10 w-32 bg-gray-300 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!property) return <div>Property not found</div>;

    return (
        <div className="bg-[#f8f4f0]  py-10">
            <div className="absolute bg-black top-0 left-0 w-full z-20">
                <Navbar />
            </div>

            {/* Main Property Details - Always visible (above fold) */}
            <div className="w-full max-w-[92%] mx-auto mt-20 bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                <div className="px-4 sm:px-6 pt-6 md:px-10">
                    <p className="text-sm font-sm text-gray-800">
                        {property.flat} Flat For Sale in {property.project},{" "}
                        <span className="underline font-semibold text-gray-900">{property.location}</span>
                    </p>
                </div>

                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 mt-3 p-4">
                        <Image
                            src={property.image}
                            alt={property.name}
                            width={1200}
                            height={800}
                            className="w-full h-[220px] sm:h-[300px] md:h-[400px] object-cover rounded-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-6 md:p-8 text-black md:w-1/2 flex flex-col justify-center">
                        <div className="flex flex-wrap gap-3 bg-gray-100 px-3 py-3 rounded-md mb-3 text-xs md:text-sm font-medium text-gray-700">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-black font-bold">🛏️ bedrooms</span> {property.bedrooms}
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-black font-bold">🛁 bathrooms</span> {property.bathrooms}
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-black font-bold">🏡 balconies</span> {property.balconies}
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-black font-bold">🪟 furnishing</span> {property.furnishing}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                ₹{Number(property.price).toLocaleString("en-IN")}
                            </h1>
                            <div className="text-xs sm:text-sm text-blue-600 font-medium flex flex-wrap gap-2 mt-1">
                                <span>EMI - ₹{Number(property.emi).toLocaleString("en-IN")}</span>
                                <span>|</span>
                                <span className="underline cursor-pointer">Need Home Loan? Check Eligibility</span>
                            </div>
                        </div>

                        <p className="text-base sm:text-lg font-medium mb-2">
                            {property.name} in <span className="underline font-semibold">{property.address}</span>
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-800 mt-4">
                            <div><strong>Carpet Area:</strong> {property.carpet_area}</div>
                            <div><strong>Project:</strong> {property.project}</div>
                            <div><strong>Floor:</strong> {property.floor}</div>
                            <div><strong>Transaction Type:</strong> {property.transaction_type}</div>
                            <div><strong>Status:</strong> {property.status}</div>
                            <div><strong>Facing:</strong> {property.facing}</div>
                            <div><strong>Lifts:</strong> {property.lifts}</div>
                            <div><strong>Furnished:</strong> {property.furnishing}</div>
                        </div>

                        <hr className="mt-3" />

                        <div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-between gap-3">
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => setIsInquiryModalOpen(true)}
                                    className="bg-black text-white cursor-pointer font-semibold px-4 py-2 w-full sm:w-auto rounded-md hover:bg-gray-800 transition-colors"
                                >
                                    Raise Inquiry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lazy loaded Property Gallery */}
                <Suspense fallback={<LoadingSection />}>
                    <PropertyGallery
                        images={property.images || []}
                        propertyName={property.name}
                    />
                </Suspense>
            </div>

            {/* More Details Section - Always visible */}
            <div className="w-full max-w-[92%] mx-auto mt-10 bg-white rounded-xl p-6 md:p-10 shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">More Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-gray-800">
                    <div><strong>Price Breakup:</strong>&nbsp;₹{Number(property.price_breakup).toLocaleString("en-IN")} | ₹{Number(property.emi).toLocaleString("en-IN")}</div>
                    <div><strong>Booking Amount:</strong>&nbsp;₹{Number(property.booking_amount).toLocaleString("en-IN")}</div>
                    <div><strong>Address:</strong> <span className="">{property.address}</span></div>
                    <div><strong>Landmarks:</strong> <span className="">{property.landmarks}</span></div>
                    <div><strong>Furnishing:</strong> <span className="">{property.furnishing}</span></div>
                    <div><strong>Flooring:</strong> <span className="">{property.flooring}</span></div>
                    <div><strong>Overlooking:</strong> <span className="">{property.overlooking}</span></div>
                </div>

                <div className="mt-6 bg-yellow-100 border border-yellow-400 text-yellow-900 px-4 py-2 rounded-md flex items-center justify-between">
                    <span className="font-bold mr-2 bg-yellow-300 px-2 py-1 rounded">Offer</span>
                    <span>Save upto 40% on your Dream Home Interiors from Top Brands →</span>
                </div>

                <div className="mt-6 text-gray-800">
                    <p>
                        <strong>Description:</strong>{property.description}
                    </p>
                </div>

                <div className="mt-6 flex gap-4 flex-wrap">
                    {/* <button className="group bg-red-600 cursor-pointer text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 relative overflow-hidden">
                        <span className="block group-hover:hidden">Contact Owner</span>/
                        <span className="hidden group-hover:block">{property.owner_contact}</span>
                    </button> */}
                    <a
                        href={`tel:${property.owner_contact}`}
                        className="group bg-red-600 cursor-pointer text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700"
                    >
                        Contact Owner
                    </a>

                </div>
            </div>

            {/* About Project Section */}
            <div className="w-full max-w-[92%] mx-auto mt-10 bg-white rounded-xl p-6 md:p-10 shadow">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">About Project</h2>

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
                        <Image
                            src={property.image}
                            alt={property.name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                        />
                        <div className="flex flex-col w-full sm:w-auto">
                            <h3 className="text-lg font-semibold text-gray-900">{property.project}</h3>
                            <p className="text-sm text-gray-600">
                                Price: <span className="font-medium">₹{Number(property.price).toLocaleString("en-IN")}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Configuration: <span className="font-medium">{property.flat} flats</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleCompareProjects}
                            className="border px-4 py-2 cursor-pointer rounded-full font-medium text-gray-700 hover:bg-gray-100 w-full sm:w-auto text-center"
                        >
                            Compare Projects
                        </button>
                        <Link
                            href="/comparison"
                            className="border px-4 py-2 cursor-pointer rounded-full font-medium text-gray-700 hover:bg-gray-100 w-full sm:w-auto text-center"
                        >
                            View Comparison ({compareList.length})
                        </Link>
                    </div>
                </div>
            </div>


            {/* Lazy loaded sections */}
            <Suspense fallback={<LoadingSection />}>
                <PropertyHotspots
                    hotspots={hotspots}
                    location={property.location}
                    address={property.address}
                />
            </Suspense>

            <Suspense fallback={<LoadingSection />}>
                <OtherProperties
                    nearbyProperties={nearbyProperties}
                    onAddToCompare={addToCompare}
                />
            </Suspense>

            <Suspense fallback={<LoadingSection />}>
                <VerifiedProperties
                    verifiedProperties={verifiedProperties}
                    fallbackProperty={property}
                    onAddToCompare={addToCompare}
                />
            </Suspense>

            <Suspense fallback={<LoadingSection />}>
                <SimilarProperties
                    similarProducts={similarProducts}
                    hasMoreSimilar={hasMoreSimilar}
                    onLoadMore={loadMoreSimilar}
                    onAddToCompare={addToCompare}
                />
            </Suspense>

            <Suspense fallback={<LoadingSection />}>
                <PropertyServices />
            </Suspense>

            <Suspense fallback={<LoadingSection />}>
                <HomeLoanOffers
                    banks={bank}
                    onClaim={handleClaim}
                />
            </Suspense>

            <Suspense fallback={<LoadingSection />}>
                <PropertyTools />
            </Suspense>

            {/* Closer to Your Search Section */}
            <div className="w-full max-w-[92%] mx-auto mt-10 bg-white rounded-xl p-6 md:p-10 ">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Closer to Your Search</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Popular Luxury Searches</h3>
                        <ul className="space-y-2 text-sm">
                            {[
                                `Luxury ${property.flat} in ${property.location}`,
                                `Luxury Flats in ${property.location}`,
                                `${property.furnishing} Flats in ${property.location}`,
                                `${property.transaction_type} Properties in ${property.location}`,
                            ].map((item, index) => (
                                <li key={index} className="text-blue-600 hover:underline cursor-pointer">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Similar Properties in {property.location}</h3>
                        <ul className="space-y-2 text-sm">
                            {[
                                `${property.bedrooms} BHK Flats in ${property.location}`,
                                `${property.bedrooms} BHK ${property.furnishing} in ${property.location}`,
                                `Flats with ${property.balconies} Balconies in ${property.location}`,
                                `${property.flat} for ${property.transaction_type} in ${property.location}`,
                                `Properties on ${property.floor} Floor in ${property.location}`,
                            ].map((item, index) => (
                                <li key={index} className="text-blue-600 hover:underline cursor-pointer">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Budget Searches</h3>
                        <ul className="space-y-2 text-sm">
                            {[
                                `Flats in ${property.location} under 25L`,
                                `Flats in ${property.location} under 30L`,
                                `Flats in ${property.location} under 35L`,
                                `Flats in ${property.location} under 40L`,
                                `Flats in ${property.location} under 50L`,
                            ].map((item, index) => (
                                <li key={index} className="text-blue-600 hover:underline cursor-pointer">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Project & Area Searches</h3>
                        <ul className="space-y-2 text-sm">
                            {[
                                `${property.bedrooms} BHK in ${property.project}`,
                                `Properties in ${property.project}`,
                                `${property.carpet_area} Area Flats`,
                                `${property.facing} Facing Properties`,
                                `Properties with ${property.lifts} Lifts`,
                            ].map((item, index) => (
                                <li key={index} className="text-blue-600 hover:underline cursor-pointer">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-6 flex justify-center">
                    <button className="text-black cursor-pointer hover:underline font-medium">
                        View more
                    </button>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Disclaimer: {process.env.NEXT_PUBLIC_NAME} has endeavoured to ascertain the requirement of RERA registration.
                        However, the advertiser claims that there is no requirement for such registration. Users are
                        cautioned accordingly...{" "}
                    </p>
                </div>
            </div>

            {/* Comparison Sticky Bar */}
            {compareList.length > 0 && (
                <div className="fixed bottom-2 left-2 right-2 md:bottom-6 md:left-6 md:right-6 bg-white border border-gray-200 rounded-xl shadow-lg p-3 md:p-4 z-50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center max-w-6xl mx-auto gap-3 md:gap-4">

                        {/* Compare Items */}
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <span className="font-semibold text-gray-800 text-sm w-full md:w-auto mb-1 md:mb-0">
                                Compare ({compareList.length}/3)
                            </span>
                            <div className="flex flex-wrap gap-1 w-full md:w-auto">
                                {compareList.map((comp) => (
                                    <div
                                        key={comp.id}
                                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs shadow-sm max-w-[100px] truncate"
                                    >
                                        <span className="truncate">{comp.name}</span>
                                        <button
                                            onClick={() => {
                                                const updatedCompareList = compareList.filter(
                                                    (p) => p.id !== comp.id
                                                );
                                                setCompareList(updatedCompareList);
                                                localStorage.setItem(
                                                    "compareList",
                                                    JSON.stringify(updatedCompareList)
                                                );
                                            }}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-1 mt-2 md:mt-0 w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    setCompareList([]);
                                    localStorage.removeItem("compareList");
                                }}
                                className="text-xs text-gray-600 hover:text-gray-800 border border-gray-200 rounded-full px-3 py-2 w-full sm:w-auto text-center transition hover:bg-gray-50"
                            >
                                Clear
                            </button>
                            <Link
                                href="/comparison"
                                className="bg-blue-600 text-white px-3 py-2 rounded-full text-xs w-full sm:w-auto text-center hover:bg-blue-700 transition"
                            >
                                Compare
                            </Link>
                        </div>

                    </div>
                </div>
            )}


            {/* Inquiry Modal */}
            <Suspense fallback={null}>
                <InquiryModal
                    isOpen={isInquiryModalOpen}
                    onClose={() => setIsInquiryModalOpen(false)}
                    propertyName={property.name}
                    propertyId={property.id}
                    userData={userData}
                />
            </Suspense>
        </div>
    );
}
