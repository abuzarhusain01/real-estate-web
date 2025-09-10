import { Button } from "@/components/ui/button";
import { Sale } from "./Dashboard";

interface LeadsSectionProps {
    loading: boolean;
    currentLeads: Sale[];
    currentLeadsPage: number;
    totalLeadsPages: number;
    setCurrentLeadsPage: (page: number) => void;
}

const LeadsSection = ({
    loading,
    currentLeads,
    currentLeadsPage,
    totalLeadsPages,
    setCurrentLeadsPage
}: LeadsSectionProps) => {
    if (loading) {
        return (
            <div className="bg-[#f3f6fd] border border-[#dce4f3] shadow rounded-2xl p-6 space-y-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-[50px] bg-gray-200 rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-[#f3f6fd] border border-[#dce4f3] shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>
            <div className="space-y-4">
                {currentLeads.length > 0 ? (
                    currentLeads.map((lead) => (
                        <div key={lead.id} className="flex justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    {lead.buyer_name?.charAt(0) || "L"}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{lead.name || lead.buyer_name || "New Lead"}</h3>
                                    <p className="text-sm text-gray-500">
                                        {lead.message || `Property ID: ${lead.property_id || 'N/A'}`}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                                <p>{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ""}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No leads yet</p>
                )}
                <div className="flex justify-between items-center mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentLeadsPage((p) => Math.max(p - 1, 1))}
                        disabled={currentLeadsPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                        Page {currentLeadsPage} of {totalLeadsPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentLeadsPage((p) => Math.min(p + 1, totalLeadsPages))}
                        disabled={currentLeadsPage === totalLeadsPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LeadsSection;