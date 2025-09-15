import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ChartSectionProps {
    loading: boolean;
    chartData: any[];
    formatINR: (amount: number) => string;
}

const ChartSection = ({ loading, chartData, formatINR }: ChartSectionProps) => {
    if (loading) {
        return <div className="bg-gray-200 rounded-2xl h-[350px] animate-pulse" />;
    }

    return (
        <div className="bg-[#f1f5ff] border border-[#d8e3ff] shadow rounded-2xl p-4 sm:p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Revenue Overview</h2>
                <span className="text-sm text-gray-500">Period: This Year</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatINR(value)} />
                    <Line type="monotone" dataKey="income" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ChartSection;