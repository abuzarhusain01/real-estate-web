import Link from "next/link";

interface StatsSectionProps {
    loading: boolean;
    totalProperties: number;
    totalIncome: number;
    totalSales: number;
    formatINR: (amount: number) => string;
}

const StatsSection = ({
    loading,
    totalProperties,
    totalIncome,
    totalSales,
    formatINR
}: StatsSectionProps) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-2xl h-[100px]" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="admin/properties">
                <div className="bg-[#e0f7f1] border border-[#bdf1e6] shadow rounded-2xl p-6 min-h-[100px] flex flex-col justify-center">
                    <h2 className="text-sm text-gray-600">Total Properties</h2>
                    <p className="text-2xl font-semibold">{totalProperties}</p>
                </div>
            </Link>
            <div className="bg-[#fff4e5] border border-[#ffdfba] shadow rounded-2xl p-6 min-h-[100px] flex flex-col justify-center">
                <h2 className="text-sm text-gray-600">Total Income</h2>
                <p className="text-2xl font-semibold">{formatINR(totalIncome)}</p>
            </div>
            <Link href="admin/sales">
                <div className="bg-[#e5f7ff] border border-[#b3e5ff] shadow rounded-2xl p-6 min-h-[100px] flex flex-col justify-center">
                    <h2 className="text-sm text-gray-600">Total Leads</h2>
                    <p className="text-2xl font-semibold">{totalSales}</p>
                </div>
            </Link>
        </div>
    );
};

export default StatsSection;