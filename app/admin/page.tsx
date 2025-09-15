"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Bell, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Lazy-loaded components
const StatsSection = React.lazy(() => import("../../components/ui/adminComponents/StatsSection"));
const ChartSection = React.lazy(() => import("../../components/ui/adminComponents/ChartSection"));
const PropertiesSection = React.lazy(() => import("../../components/ui/adminComponents/PropertiesSection"));
const LeadsSection = React.lazy(() => import("../../components/ui/adminComponents/LeadsSection"));
// Types
type Property = {
    id: number;
    name: string;
    image?: string;
    price: number;
    owner_contact?: string;
    location?: string;
    created_at: string | Date;
    images?: string[];
    status?: string;
};

type Sale = {
    id: number;
    buyer_name?: string;
    amount?: number;
    price?: number;
    date: string;
    message?: string;
    property_id?: number;
    name?: string;
    created_at?: string | Date;
};

const Dashboard = () => {
    const [userData, setUserData] = useState<{ id: string; name: string } | null>(null);
    const [totalProperties, setTotalProperties] = useState<number>(0);
    const [totalSales, setTotalSales] = useState<number>(0);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [chartData, setChartData] = useState<any[]>([]);
    const [soldProperties, setSoldProperties] = useState<Property[]>([]);
    const [leads, setLeads] = useState<Sale[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentLeadsPage, setCurrentLeadsPage] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const propertiesPerPage = 3;
    const leadsPerPage = 5;

    const router = useRouter();

    const formatINR = (amount: number) =>
        amount.toLocaleString("en-IN", { style: "currency", currency: "INR" });

    useEffect(() => {
        const storedData = localStorage.getItem("user");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setUserData({ id: parsedData.id, name: parsedData.name });
        } else {
            router.push("/admin");
        }
    }, [router]);

    useEffect(() => {
        Promise.all([
            fetch("/api/properties/count").then(res => res.json()),
            fetch("/api/sales").then(res => res.json()),
            fetch("/api/properties").then(res => res.json())
        ])
            .then(([propCount, salesData, propertiesData]) => {
                setTotalProperties(propCount?.total || 0);

                const sales: Sale[] = salesData.sales || [];
                setTotalSales(sales.length);
                const incomeTotal = sales.reduce((sum, s) => sum + (s.amount || s.price || 0), 0);
                setTotalIncome(incomeTotal);

                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const monthlyStats: Record<string, number> = {};
                months.forEach(m => monthlyStats[m] = 0);
                sales.forEach(sale => {
                    const dateObj = new Date(sale.date);
                    if (!isNaN(dateObj.getTime())) {
                        const monthName = dateObj.toLocaleString("default", { month: "short" });
                        monthlyStats[monthName] += (sale.amount || sale.price || 0);
                    }
                });
                setChartData(months.map(m => ({ month: m, income: monthlyStats[m] })));

                const allProperties: Property[] = propertiesData?.properties || [];
                const soldProps = allProperties.filter(p => p.status === "sold");
                setSoldProperties(soldProps);

                const sortedLeads = [...sales].sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setLeads(sortedLeads);
            })
            .catch(err => console.error("Dashboard fetch error", err))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("admin/auth/signin");
    };

    // Search filtering
    const filteredProperties = soldProperties.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.location?.toLowerCase().includes(searchQuery.toLowerCase()) || "")
    );

    const filteredLeads = leads.filter(l =>
        (l.buyer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
        (l.name?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
        (l.message?.toLowerCase().includes(searchQuery.toLowerCase()) || "")
    );

    // Properties pagination
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const currentProperties = filteredProperties.slice(startIndex, startIndex + propertiesPerPage);

    // Leads pagination
    const totalLeadsPages = Math.ceil(filteredLeads.length / leadsPerPage);
    const leadsStartIndex = (currentLeadsPage - 1) * leadsPerPage;
    const currentLeads = filteredLeads.slice(leadsStartIndex, leadsStartIndex + leadsPerPage);

    return (
        <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 text-white" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full text-white rounded-lg border border-gray-300"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Bell className="text-white" />
                    <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <span className="text-white font-semibold">
                        {userData?.name || "Guest"}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-white hover:underline text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats Section with Lazy Loading */}
            <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-2xl h-[100px]" />
                    ))}
                </div>
            }>
                <StatsSection
                    loading={loading}
                    totalProperties={totalProperties}
                    totalIncome={totalIncome}
                    totalSales={totalSales}
                    formatINR={formatINR}
                />
            </Suspense>

            {/* Chart Section with Lazy Loading */}
            <Suspense fallback={<div className="bg-gray-200 rounded-2xl h-[350px] animate-pulse" />}>
                <ChartSection
                    loading={loading}
                    chartData={chartData}
                    formatINR={formatINR}
                />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Properties Section with Lazy Loading */}
                <Suspense fallback={
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2 shadow space-y-4 animate-pulse">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-[70px] bg-gray-200 rounded-lg" />
                        ))}
                    </div>
                }>
                    <PropertiesSection
                        loading={loading}
                        currentProperties={currentProperties}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        formatINR={formatINR}
                    />
                </Suspense>

                {/* Leads Section with Lazy Loading */}
                <Suspense fallback={
                    <div className="bg-[#f3f6fd] border border-[#dce4f3] shadow rounded-2xl p-6 space-y-4 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-[50px] bg-gray-200 rounded-lg" />
                        ))}
                    </div>
                }>
                    <LeadsSection
                        loading={loading}
                        currentLeads={currentLeads}
                        currentLeadsPage={currentLeadsPage}
                        totalLeadsPages={totalLeadsPages}
                        setCurrentLeadsPage={setCurrentLeadsPage}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default Dashboard;