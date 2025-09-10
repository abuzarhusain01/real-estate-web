"use client";
import Image from "next/image";
import getBankIcon from "../../utilis/getBankLogo";

interface Bank {
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
}

interface HomeLoanOffersProps {
    banks: Bank[];
    onClaim: (bankId: number) => void;
}

// ✅ EMI Calculation Helper
function calculateEMI(loanAmount: number, annualInterest: number, tenureYears: number) {
    const P = loanAmount;
    const R = annualInterest / 12 / 100;
    const N = tenureYears * 12;

    if (R === 0) return Math.round(P / N);

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    return Math.round(emi);
}

export default function HomeLoanOffers({ banks, onClaim }: HomeLoanOffersProps) {
    return (
        <div className="w-full max-w-[92%] mx-auto py-10">
            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Home Loan Offers
                <span className="bg-yellow-100 text-red-600 text-xs px-2 py-1 rounded-full">
                    New
                </span>
            </h2>

            {/* Scrollable Cards */}
            <div className="relative">
                <div className="flex gap-4 cursor-pointer overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                    {banks.map((item) => {
                        const tenureInYears = Number(
                            (item.year_tenure || item.tenure).toString().replace(/\D/g, "") || 0
                        );

                        return (
                            <div
                                key={item.id}
                                className="border min-w-[290px] flex flex-col justify-between flex-shrink-0 transform transition-transform hover:scale-105 duration-300 p-4 bg-white rounded-xl shadow"
                            >
                                {/* 👇 Card Top (Content) */}
                                <div>
                                    {/* Bank Logo + Name */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <Image
                                            src={getBankIcon(item.bank_name)}
                                            alt={item.bank_name}
                                            width={50}
                                            height={50}
                                            className="rounded bg-transparent"
                                        />
                                        <h2 className="font-bold px-2">{item.bank_name}</h2>
                                    </div>

                                    {/* Loan Info */}
                                    <p>Loan Amount: ₹{Number(item.loan_amount).toLocaleString("en-IN")}</p>
                                    <p>Interest: {item.interest}%</p>
                                    <p>Tenure: {tenureInYears} years</p>
                                    <p>
                                        EMI: ₹
                                        {calculateEMI(
                                            Number(item.loan_amount),
                                            Number(item.interest),
                                            tenureInYears
                                        ).toLocaleString("en-IN")}
                                    </p>

                                    {/* Loan Disbursement Info */}
                                    <p className="text-md font-medium text-red-600 mt-2">
                                        Get Loan disbursed under {item.loan_disbursed} Days
                                    </p>
                                </div>

                                {/* 👇 Card Bottom (Fixed Claim Button Row) */}
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-xs bg-yellow-100 text-orange-700 px-2 py-1 rounded">
                                        Rewards ₹{Number(item.rewards).toLocaleString("en-IN")}
                                    </span>
                                    <button
                                        onClick={() => onClaim(item.id)}
                                        className="text-xs text-white cursor-pointer bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Claim Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
