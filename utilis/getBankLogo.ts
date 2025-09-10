// utils/getBankLogo.ts

const bankLogos: Record<string, string> = {
    sbi: "/banks/sbi.jpg",
    hdfc: "/banks/hdfc.jpg",
    icici: "/banks/icici.jpg",
    axis: "/banks/axis.jpg",
    pnb: "/banks/pnb.jpg",
    indusind: "/banks/indusind.jpg",
    yes: "/banks/yes.jpg",
    kotak: "/banks/kotak.jpg",
    idfc: "/banks/idfc.jpg",
    bob: "/banks/bob.jpg", // Bank of Baroda
    canara: "/banks/canara.jpg",
    union: "/banks/union.jpg",
    indian: "/banks/indian.jpg", // Indian Bank
    central: "/banks/central.jpg", // Central Bank of India
    boi: "/banks/boi.jpg", // Bank of India
    uco: "/banks/uco.jpg",
    federal: "/banks/federal.jpg",
    south: "/banks/south.jpg", // South Indian Bank
    karur: "/banks/karur.jpg", // Karur Vysya
    rbl: "/banks/rbl.jpg",
    bandhan: "/banks/bandhan.jpg",
    idbi: "/banks/idbi.jpg"
};

export default function getBankLogo(bankName: string): string {
    const normalized = bankName.toLowerCase();

    // check kis key ko match karta hai
    for (const key in bankLogos) {
        if (normalized.includes(key)) {
            return bankLogos[key];
        }
    }

    // agar kuch na mile to fallback
    return "/banks/default-bank.jpg";
}
