"use client";
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Property } from "../types";
import PropertySkeleton from "./PropertySkeleton";
import PropertyCard from "./PropertyCard";

interface AllPropertiesSectionProps {
  allProperties: Property[];
  propertiesLoading: boolean;
  allCurrentPage: number;
  allTotalPages: number;
  setAllCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  handleFavorite: (id: number, is_favourites: boolean) => void;
}

function deriveCities(list: Property[]): string[] {
  const set = new Set<string>();
  for (const p of list) {
    const loc = (p.location || "").split(",").map((s) => s.trim());
    const city = loc[loc.length - 1] || loc[0];
    if (city) set.add(city);
  }
  return Array.from(set);
}

const FALLBACK_CITIES = [
  "Mumbai","Bangalore","Delhi","Gurgaon","Pune","Noida","Hyderabad",
];

/** Lightweight in-view gate: only mount children when visible */
const InView: React.FC<{ children: React.ReactNode; root?: Element | null }> = ({ children, root }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { root: (root as Element) || null, rootMargin: "200px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, root]);

  return <div ref={ref} style={{ contentVisibility: shown ? "visible" as any : "auto" }}>{shown ? children : <div style={{ width: 320 }} />}</div>;
};

const AllPropertiesSection: React.FC<AllPropertiesSectionProps> = ({
  allProperties,
  propertiesLoading,
  handleFavorite,
}) => {
  // Cities with an "All" tab at the beginning
  const cities = useMemo(() => {
    const fromData = deriveCities(allProperties);
    const base = fromData.length ? fromData : FALLBACK_CITIES;
    return ["All", ...base];
  }, [allProperties]);

  const [activeCity, setActiveCity] = useState<string>("All");

  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = useCallback((px: number) => {
    scrollerRef.current?.scrollBy({ left: px, behavior: "smooth" });
  }, []);

  // compute once per click; keep filter cheap
  const filtered = useMemo(() => {
    if (activeCity === "All") return allProperties;
    const needle = activeCity.toLowerCase();
    // avoid repeated toLowerCase inside loop
    return allProperties.filter((p) => {
      const hay = String((p as any).city || p.location || "").toLowerCase();
      return hay.includes(needle);
    });
  }, [allProperties, activeCity]);

  // snap back to start when tab changes (less jank)
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: "instant" as any });
  }, [activeCity]);

  return (
    <section className="px-3 md:px-1 pt-2 pb-8">
      <div className="bg-white px-6 md:px-10 py-6 md:py-8 max-w-[92%] mx-auto rounded-2xl text-center shadow-sm overflow-hidden">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl mt-8 font-semibold text-gray-900">
            Hot Selling Real Estate Projects in India
          </h2>
          <p className="mt-1 text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            A handpicked collection of the country’s most in-demand residential developments.
            These properties, from modern apartments to premium villas, offer unmatched value
            in top cities with ideal locations, smart amenities, and trusted builders.
          </p>
        </div>

        {/* City pills (with All) */}
        <div className="mt-6 flex gap-2 flex-wrap justify-center">
          {cities.map((c) => {
            const isActive = activeCity === c;
            return (
              <button
                key={c}
                onClick={() => setActiveCity(c)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  isActive ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                }`}
                aria-pressed={isActive}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Horizontal card scroller */}
        <div className="relative mt-4">
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pr-8 snap-x snap-mandatory"
          >
            {(propertiesLoading)
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="min-w-[320px]" style={{ contentVisibility: "auto" as any }}>
                    <PropertySkeleton />
                  </div>
                ))
              : filtered.map((property) => (
                  <InView key={property.id} root={scrollerRef.current}>
                   
                    <Link
                      href={`/properties/detail/${property.id}`}
                      prefetch={false}
                      className="block"
                    >
                      {/* PropertyCard should be React.memo; images should lazy-load inside */}
                      <div style={{ contentVisibility: "auto" as any }}>
                        <PropertyCard
                          property={property}
                          handleFavorite={handleFavorite}
                        />
                      </div>
                    </Link>
                  </InView>
                ))}
          </div>
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy(-360)}
            className="absolute top-1/2 -translate-y-1/2 left-2 inline-flex items-center justify-center rounded-full border bg-white shadow-md hover:shadow-lg transition h-9 w-9"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy(360)}
            className="absolute top-1/2 -translate-y-1/2 right-2 inline-flex items-center justify-center rounded-full border bg-white shadow-md hover:shadow-lg transition h-9 w-9"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AllPropertiesSection;
