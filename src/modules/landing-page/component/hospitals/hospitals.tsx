"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
// import Link from "next/link";
import useSWR from "swr";
import {LoadingSpinner} from "@/modules/shared/components/loading-spinner";
import {Pagination} from "@/modules/shared/components/pagination";

type Hospital = {
  id: number;
  name: string;
  email: string;
  logo: string;
  banner?: string | null;
  description: string;
  city: string;
  country: string;
};

// Define the coming soon hospital type
type ComingSoonHospital = {
  id: number;
  name: string;
  logo: string;
  city: string;
  country: string;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function HospitalsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(14);
  const [loading, setLoading] = useState(true);
  const [showCountries, setShowCountries] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    country: ''
  });

  // Hard-coded coming soon hospitals data
  const comingSoonHospitals: ComingSoonHospital[] = [
    {
      id: 999971,
      name: " Colombo Medical Center",
      logo: "/images/sample/hospital-icon.png",
      city: "Colombo",
      country: "Sri Lanka"
    },
    {
      id: 999972,
      name: "Kandy Hospital",
      logo: "/images/sample/hospital-icon.png",
      city: "Kandy",
      country: "Sri Lanka"
    },
    {
      id: 999973,
      name: " Medical Center",
      logo: "/images/sample/hospital-icon.png",
      city: "Galle",
      country: "Sri Lanka"
    }
  ];

  const { data} = useSWR<Hospital[]>(
    "/api/backend/hospital",
    fetcher,
  );

  const countries = [...new Set(data?.map(h => h.country).filter(Boolean))].sort();

  // Filter cities based on selected country
  const cities = [...new Set(
    filters.country
      ? data
          ?.filter(h => h.country === filters.country)
          .map(h => h.city) || []
      : data?.map(h => h.city) || []
  )].filter(Boolean).sort();

  const filteredHospitals = data?.filter(hospital => {
    const matchesSearch = filters.search === '' ||
      hospital.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCity = filters.city === '' || hospital.city === filters.city;
    const matchesCountry = filters.country === '' || hospital.country === filters.country;

    return matchesSearch && matchesCity && matchesCountry;
  }) || [];

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => {
      if (name === 'country') {
        return { ...prev, country: value, city: '' };
      }
      return { ...prev, [name]: value };
    });
    setCurrentPage(1);
    setShowCountries(false);
    setShowCities(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      city: '',
      country: ''
    });
    setCurrentPage(1);
    setShowCountries(false);
    setShowCities(false);
  };


  // const paginatedHospitals = useMemo(() => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   return filteredHospitals.slice(startIndex, endIndex);
  // }, [filteredHospitals, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    const resultsSection = document.getElementById('hospitals-results');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }, []);

    // Handle click outside to close dropdowns
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
          setShowCountries(false);
        }
        if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
          setShowCities(false);
        }
      };

      if (showCountries || showCities) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showCountries, showCities]);

  if (loading) {
    return (
      <section className="flex justify-center items-center h-screen">
        <LoadingSpinner className="h-96" />
      </section>
    );
  }

  return (
    <main className="w-full mx-auto mb-4">
      <div className="items-center justify-center w-full relative">
        <Image
          src={'/images/landing-page-slider/image1.jpg'}
          alt={'medijobs.lk'}
          width={1920}
          height={1080}
          className={'w-full h-64 object-cover'}
        />
        <div className="absolute inset-0 bg-black/50 z-0" />
      </div>

      <div className="w-full max-w-[1440px] mx-auto top-64 z-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 mb-6 gap-4">
          <h1 className="text-2xl font-semibold">Featured Hospitals</h1>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full py-2 px-4 bg-[#007F4E] text-white rounded flex items-center justify-center gap-2"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className={`${!showFilters ? 'hidden md:block' : ''} bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8`}>
          <div className={`grid gap-4 ${filters.country ? 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1 ">Search</label>
              <input
                type="text"
                name="search"
                placeholder="  Search hospitals..."
                value={filters.search}
                onChange={handleInputChange}
                className="w-full h-9 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#007F4E] focus:border-transparent"
              />
            </div>

            <div className="w-full relative z-18" ref={countryRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Country</label>
              <button
                type="button"
                onClick={() => {
                  setShowCountries(!showCountries);
                  setShowCities(false);
                }}
                className="flex border border-gray-300 rounded p-2 items-center justify-between w-full text-left text-sm text-black mb-1 focus:outline-none cursor-pointer"
              >
                <span>{filters.country || "Select Countries"}</span>
                <svg
                  className={`h-5 w-5 text-black transform transition-transform ${showCountries ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showCountries && (
                <div className="max-h-48 overflow-y-auto p-2 border border-gray-300 rounded mt-1 absolute z-10 bg-white w-full shadow-lg">
                  {countries.length === 0 ? (
                    <div className="text-sm text-black py-2">No countries found</div>
                  ) : (
                    countries.map(country => (
                      <div
                        key={country}
                        onClick={() => handleFilterChange('country', country)}
                        className={`p-2 text-sm cursor-pointer hover:bg-green-100 rounded ${filters.country === country ? 'bg-green-100 font-medium text-black' : 'text-black'}`}
                      >
                        {country}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {filters.country && (
              <div className="w-full relative z-17" ref={cityRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select City</label>
                <button
                  type="button"
                  onClick={() => {
                    setShowCities(!showCities);
                    setShowCountries(false);
                  }}
                  className="flex border border-gray-300 rounded p-2 items-center justify-between w-full text-left text-sm text-black mb-1 focus:outline-none cursor-pointer"
                  disabled={!filters.country}
                >
                  <span>{filters.city || "Select Cities"}</span>
                  <svg
                    className={`h-5 w-5 text-black transform transition-transform ${showCities ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {showCities && (
                  <div className="max-h-48 overflow-y-auto p-2 border border-gray-300 rounded mt-1 absolute z-10 bg-white w-full shadow-lg">
                    {cities.length === 0 ? (
                      <div className="text-sm text-black py-2">No cities found</div>
                    ) : (
                      cities.map(city => (
                        <div
                          key={city}
                          onClick={() => handleFilterChange('city', city)}
                          className={`p-2 text-sm cursor-pointer hover:bg-green-100 rounded ${filters.city === city ? 'bg-green-100 font-medium text-black' : 'text-black'}`}
                        >
                          {city}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {(filters.search || filters.city || filters.country) && (
              <button
                onClick={resetFilters}
                className="w-36 px-1 py-1  text-sm text-white bg-[#007F4E] rounded hover:bg-[#006641] h-9 mt-0 md:mt-6"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        <div id="hospitals-results" className="space-y-6">
          {/* Coming Soon Hospitals Section */}
          <div className="mb-10">
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-6">
              {comingSoonHospitals.map((h) => (
                <div
                  key={h.id}
                  className="group p-2 rounded-xl border bg-green-100 border-green-200 hover:shadow-lg transition-all duration-300 opacity-75"
                >
                  <div className="relative h-12 md:h-16 w-full mb-2 md:mb-3">
                    {h.logo ? (
                      <Image
                        src={h.logo}
                        alt={h.name}
                        fill
                        className="object-contain w-16 h-16"
                      />
                    ) : (
                      <div className="h-full w-full rounded bg-gray-100 flex items-center justify-center text-sm md:text-lg font-bold text-gray-600">
                        {h.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-900 leading-tight">
                      {h.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Hospitals Section */}
          {/* <h2 className="text-xl font-semibold mb-4">Available Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-6">
            {paginatedHospitals.map((h) => (
              <Link
                key={h.id}
                href={`/hospitals/${h.id}`}
                className="group p-2 rounded-xl border bg-green-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-12 md:h-16 w-full mb-2 md:mb-3">
                  {h.logo ? (
                    <Image
                      src={h.logo}
                      alt={h.name}
                      fill
                      className="object-contain w-16 h-16"
                    />
                  ) : (
                    <div className="h-full w-full rounded bg-gray-100 flex items-center justify-center text-sm md:text-lg font-bold text-gray-600">
                      {h.name[0]}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xs md:text-sm font-semibold text-gray-900 leading-tight">
                    {h.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div> */}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredHospitals.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            showItemsInfo={false}
          />
        </div>
      </div>
    </main>
  );
}
