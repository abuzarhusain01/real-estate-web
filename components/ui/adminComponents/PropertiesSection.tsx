import { Button } from "@/components/ui/button";
import { Property } from "./Dashboard";

interface PropertiesSectionProps {
    loading: boolean;
    currentProperties: Property[];
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    formatINR: (amount: number) => string;
}

const PropertiesSection = ({
    loading,
    currentProperties,
    currentPage,
    totalPages,
    setCurrentPage,
    formatINR
}: PropertiesSectionProps) => {
    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2 shadow space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-[70px] bg-gray-200 rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2 shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Sold Properties</h2>
            <div className="space-y-4 overflow-x-auto">
                {currentProperties.map((prop) => (
                    <div
                        key={prop.id}
                        className="flex flex-col sm:flex-row justify-between gap-4 border p-4 rounded-xl bg-[#fafafa] w-full"
                    >
                        <div className="flex gap-4 flex-1 min-w-0">
                            <img
                                src={prop.image || prop.images?.[0] || "/placeholder.jpg"}
                                alt={prop.name}
                                className="w-24 h-16 rounded-md object-cover bg-gray-200 flex-shrink-0"
                            />
                            <div className="truncate">
                                <h3 className="font-semibold truncate">{prop.name}</h3>
                                <p className="text-sm text-gray-500 truncate">{prop.location}</p>
                                <p className="text-sm text-gray-500 truncate">
                                    Contact: {prop.owner_contact}
                                </p>
                            </div>
                        </div>
                        <div className="text-right mt-2 sm:mt-0 flex-shrink-0">
                            <p className="text-sm text-gray-500">
                                Sold on: {prop.created_at ? new Date(prop.created_at).toLocaleDateString() : ""}
                            </p>
                            <p className="text-sm font-semibold">
                                Price: {formatINR(prop.price)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4">
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default PropertiesSection;