"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
// import Link from "next/link";
import {format} from "date-fns";
import {DatePicker} from "@/modules/shared/components/date-picker";
import {LoadingSpinner} from "@/modules/shared/components/loading-spinner";
// import { Pagination } from "@/modules/shared/components/pagination";
import {useGetAllCorporateTitle} from "@/modules/backend/corporate-title/hooks/use-get-all-corporate-title";

// const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

interface Vacancy {
  id: number;
  designation: string;
  city: string;
  country: string;
  summary: string;
  banner: string;
  startDate: string;
  endDate: string;
  noOfPositions: number;
  contactPerson: string;
  email: string;
  portalUrl?: string;
  hospital: {
    id: number;
    name: string;
    logo: string;
  };
  corporateTitle: {
    id: number;
    name: string;
  };
  employmentType: {
    id: number;
    name: string;
  };
  workPlaceType: {
    id: number;
    name: string;
  };
  sbu: {
    id: number;
    name: string;
  };
  clicks: Array<{
    id: number;
    createdAt: string;
  }>;
}

// Define the coming soon vacancy type
interface ComingSoonVacancy {
  id: number;
  designation: string;
  city: string;
  country: string;
  hospital: {
    id: number;
    name: string;
    logo: string;
  };
  corporateTitle: {
    id: number;
    name: string;
  };
  employmentType: {
    id: number;
    name: string;
  };
  workPlaceType: {
    id: number;
    name: string;
  };
}

export default function LocumVacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCorporateTitles, setShowCorporateTitles] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchCorporateTitle, setSearchCorporateTitle] = useState("");
  const corporateTitleRef = useRef<HTMLDivElement>(null);
  const hospitalRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const { corporateTitle: allCorporateTitles = [] } = useGetAllCorporateTitle();

  // Hard-coded coming soon vacancies data
  const comingSoonVacancies: ComingSoonVacancy[] = [
    {
      id: 999981,
      designation: "Locum Practitioner",
      city: "Colombo",
      country: "Sri Lanka",
      hospital: {
        id: 1001,
        name: "Colombo Medical Center",
        logo: "/images/sample/permenant-vacancy.jpg"
      },
      corporateTitle: {
        id: 2001,
        name: "General Practitioner"
      },
      employmentType: {
        id: 3002,
        name: "Locum"
      },
      workPlaceType: {
        id: 4001,
        name: "On-site"
      }
    },
    {
      id: 999982,
      designation: "Locum Anesthesiologist",
      city: "Kandy",
      country: "Sri Lanka",
      hospital: {
        id: 1002,
        name: "Kandy Teaching Hospital",
        logo: "/images/sample/permenant-vacancy.jpg"
      },
      corporateTitle: {
        id: 2002,
        name: "Specialist"
      },
      employmentType: {
        id: 3002,
        name: "Locum"
      },
      workPlaceType: {
        id: 4001,
        name: "On-site"
      }
    },
    {
      id: 999983,
      designation: "Locum Radiologist",
      city: "Galle",
      country: "Sri Lanka",
      hospital: {
        id: 1003,
        name: "Galle District Hospital",
        logo: "/images/sample/permenant-vacancy.jpg"
      },
      corporateTitle: {
        id: 2003,
        name: "Specialist"
      },
      employmentType: {
        id: 3002,
        name: "Locum"
      },
      workPlaceType: {
        id: 4001,
        name: "On-site"
      }
    }
  ];

  const [filters, setFilters] = useState({
    city: '',
    hospital: '',
    country: '',
    corporateTitles: [] as string[],
    designation: '',
    date: ''
  });


  const getFilteredCountries = () => {
    if (filters.hospital) {

      return [...new Set(
        vacancies
          .filter(v => v.hospital.name === filters.hospital)
          .map(v => v.country)
      )].sort();
    } else {

      return [...new Set(vacancies.map(v => v.country))].sort();
    }
  };

  const getFilteredCities = () => {
    let filteredVacancies = vacancies;


    if (filters.hospital) {
      filteredVacancies = filteredVacancies.filter(v => v.hospital.name === filters.hospital);
    }


    if (filters.country) {
      filteredVacancies = filteredVacancies.filter(v => v.country === filters.country);
    }

    return [...new Set(filteredVacancies.map(v => v.city))].sort();
  };

  const getFilteredCorporateTitles = () => {
    if (filters.hospital) {

      const hospitalVacancies = vacancies.filter(v => v.hospital.name === filters.hospital);
      const hospitalCorporateTitleCounts = hospitalVacancies.reduce((acc, vacancy) => {
        const title = vacancy.corporateTitle.name;
        acc[title] = (acc[title] || 0) + 1;
        return acc;

      }, {} as Record<string, number>);


      return allCorporateTitles
        .map(({ name }: { name: string }) => ({
          name,
          count: hospitalCorporateTitleCounts[name] || 0
        }))
        .filter((item: { name: string; count: number }) => item.count > 0)
        .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
    } else {

      const corporateTitleCounts = vacancies.reduce((acc, vacancy) => {
        const title = vacancy.corporateTitle.name;
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return allCorporateTitles
        .map(({ name }: { name: string }) => ({
          name,
          count: corporateTitleCounts[name] || 0
        }))
        .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
    }
  };

  const countries = getFilteredCountries();
  const cities = getFilteredCities();
  const hospitals = [...new Set(vacancies.map(v => v.hospital.name))].sort();
  const corporateTitlesWithCounts = getFilteredCorporateTitles();


  const filteredCorporateTitles = corporateTitlesWithCounts.filter(({ name }: { name: string }) =>
    name.toLowerCase().includes(searchCorporateTitle.toLowerCase())
  );

  useEffect(() => {
    setMounted(true);
    const fetchVacancies = async () => {
      try {
        const response = await fetch("/api/backend/vacancy?public=true&vacancyOption=Locum", {
          cache: 'no-store',
          next: { revalidate: 60 }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch vacancies: ${response.statusText}`);
        }

        const data = await response.json();

        const currentDate = new Date();
        const approvedVacancies = data.filter((vacancy: Vacancy) => {
          const endDate = new Date(vacancy.endDate);
          return endDate >= currentDate;
        });


        setVacancies(approvedVacancies);
        setFilteredVacancies(approvedVacancies);
      } catch (err) {
        console.error('Error fetching vacancies:', err);
        setError(err instanceof Error ? err.message : "An error occurred while loading vacancies");
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, [mounted, searchCorporateTitle, ]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (corporateTitleRef.current && !corporateTitleRef.current.contains(event.target as Node)) {
        setShowCorporateTitles(false);
      }
      if (hospitalRef.current && !hospitalRef.current.contains(event.target as Node)) {
        setShowHospitals(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountries(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCities(false);
      }
    };

    if (showCorporateTitles || showHospitals || showCountries || showCities) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCorporateTitles, showHospitals, showCountries, showCities ,filteredVacancies,currentPage ,itemsPerPage]);

  // const handleVacancyClick = async (vacancyId: number) => {
  //   try {
  //     await fetch("/api/backend/click", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ vacancyId }),
  //     });
  //   } catch (error) {
  //     console.error("Failed to record click:", error);
  //   }
  // };




  const applyFilters = () => {
    const filtered = vacancies.filter(vacancy => {

      const matchesCity = !filters.city || vacancy.city === filters.city;
      const matchesCountry = !filters.country || vacancy.country === filters.country;


      const matchesHospital = !filters.hospital || vacancy.hospital.name === filters.hospital;
      const matchesCorporateTitle = filters.corporateTitles.length === 0 ||
        filters.corporateTitles.includes(vacancy.corporateTitle.name);
      const matchesDesignation = !filters.designation ||
        vacancy.designation.toLowerCase().includes(filters.designation.toLowerCase());


      let matchesDate = true;
      if (filters.date) {
        try {
          const selectedDate = new Date(filters.date);
          const startDate = new Date(vacancy.startDate);
          const endDate = new Date(vacancy.endDate);

          selectedDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          matchesDate = selectedDate >= startDate && selectedDate <= endDate;
        } catch (error) {
          console.error('Error processing date filter:', error);
          matchesDate = true;
        }
      }

      return matchesCity && matchesCountry && matchesHospital &&
        matchesCorporateTitle && matchesDesignation && matchesDate;
    });
    setFilteredVacancies(filtered);
  };


  const resetFilters = () => {
    setFilters({
      city: '',
      hospital: '',
      country: '',
      corporateTitles: [],
      designation: '',
      date: ''
    });
    setFilteredVacancies(vacancies);
    setShowCorporateTitles(false);
    setShowHospitals(false);
    setShowCountries(false);
    setShowCities(false);
    setSearchCorporateTitle('');
  };





  const handleFilterChange = (name: string, value: string) => {
    if (name === 'hospital') {
      setFilters(prev => ({
        ...prev,
        [name]: value,
        corporateTitles: [],
        country: '',
        city: ''
      }));
    } else if (name === 'country') {
      setFilters(prev => ({
        ...prev,
        [name]: value,
        city: ''
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }


    setShowHospitals(false);
    setShowCountries(false);
    setShowCities(false);
  };

  const handleCorporateTitleToggle = (title: string) => {
    setFilters(prev => {
      const newCorporateTitles = prev.corporateTitles.includes(title)
        ? prev.corporateTitles.filter(t => t !== title)
        : [...prev.corporateTitles, title];

      return {
        ...prev,
        corporateTitles: newCorporateTitles
      };
    });
  };


  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [filters, vacancies]);


  // const paginatedVacancies = useMemo(() => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   return filteredVacancies.slice(startIndex, endIndex);
  // }, [filteredVacancies, currentPage, itemsPerPage]);

  // const totalPages = Math.ceil(filteredVacancies.length / itemsPerPage);

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);

  //   const resultsSection = document.getElementById('vacancies-results');
  //   if (resultsSection) {
  //     resultsSection.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  if (loading) {
    return (
      <section className="flex justify-center items-center h-screen">
        <LoadingSpinner className="h-96" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-semibold mb-6">Available Vacancies</h1>
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mb-4">


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

      <div className="w-full max-w-[1440px] mx-auto top-64 z-10 px-4 ">
        <div className="flex items-center justify-start mt-4">
          <h1 className="text-2xl font-semibold mb-4">Locum Vacancies</h1>
        </div>
        <div className="w-full max-w-[1440px] mx-auto">

          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full py-2 px-4 bg-[#007F4E] text-white rounded-md flex items-center justify-center gap-2"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className={`bg-white p-4 rounded mb-8 ${!showFilters ? 'hidden md:block' : ''}`}>

            <div className="md:col-span-2 mb-2">
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  name="designation"
                  value={filters.designation}
                  onChange={(e) => handleFilterChange('designation', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                  placeholder="Enter Designation To Search..."
                  className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#007F4E] focus:border-transparent"
                />
                <button
                  onClick={applyFilters}
                  className="bg-[#007F4E] text-white px-4 h-9 rounded hover:bg-[#006641] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#007F4E] focus:ring-offset-2 whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

              <div className="w-full relative z-19" ref={hospitalRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Hospital</label>
                <button
                  type="button"
                  onClick={() => {
                    setShowHospitals(!showHospitals);
                    setShowCorporateTitles(false);
                    setShowCountries(false);
                    setShowCities(false);
                  }}
                  className="flex border border-gray-300 rounded p-2 items-center justify-between w-full text-left text-sm text-black mb-1 focus:outline-none cursor-pointer"
                >
                  <span>{filters.hospital || "Select Hospital"}</span>
                  <svg
                    className={`h-5 w-5 text-black transform transition-transform ${showHospitals ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {showHospitals && (
                  <div className="max-h-48 overflow-y-auto p-2 border border-gray-300 rounded mt-1 absolute z-10 bg-white w-full shadow-lg">
                    {hospitals.length === 0 ? (
                      <div className="text-sm text-black py-2">No hospitals found</div>
                    ) : (
                      hospitals.map(hospital => (
                        <div
                          key={hospital}
                          onClick={() => handleFilterChange('hospital', hospital)}
                          className={`p-2 text-sm cursor-pointer hover:bg-green-100 rounded ${filters.hospital === hospital ? 'bg-green-100 font-medium text-black' : 'text-black'}`}
                        >
                          {hospital}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="w-full relative z-20" ref={corporateTitleRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1 z-10">Select Corporate Title</label>
                <button
                  type="button"
                  onClick={() => setShowCorporateTitles(!showCorporateTitles)}
                  className="flex border border-gray-300 rounded p-2 items-center justify-between w-full text-left text-sm  text-black mb-1 focus:outline-none cursor-pointer"
                >
                  <span>Select Corporate Title</span>
                  <svg
                    className={`h-5 w-5 text-black transform transition-transform ${showCorporateTitles ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {showCorporateTitles && (
                  <div className="max-h-48 overflow-y-auto p-2 border border-gray-300 rounded mt-1 absolute z-10 bg-white w-full shadow-lg">
                    <div className="mb-2">
                      <input
                        type="text"
                        value={searchCorporateTitle}
                        onChange={(e) => setSearchCorporateTitle(e.target.value)}
                        placeholder="Search corporate titles..."
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#007F4E] focus:border-transparent"
                      />
                    </div>

                    {filteredCorporateTitles.length === 0 ? (
                      <div className="text-sm text-black py-2">No corporate titles found</div>
                    ) : (
                      filteredCorporateTitles.map(({ name }: { name: string }) => (
                        <div key={name} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`corporate-title-${name}`}
                            checked={filters.corporateTitles.includes(name)}
                            onChange={() => handleCorporateTitleToggle(name)}
                            className="h-4 w-4 text-[#007F4E] rounded border-gray-300 focus:ring-[#007F4E]"
                          />
                          <label
                            htmlFor={`corporate-title-${name}`}
                            className={`ml-2 text-sm ${filters.corporateTitles.includes(name) ? 'font-medium text-gray-900' : 'text-black'}`}
                          >
                            {name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </div>

              <div className="w-full relative z-18" ref={countryRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Country</label>
                <button
                  type="button"
                  onClick={() => {
                    setShowCountries(!showCountries);
                    setShowHospitals(false);
                    setShowCorporateTitles(false);
                    setShowCities(false);
                  }}
                  className="flex border border-gray-300 rounded p-2 items-center justify-between w-full text-left text-sm text-black mb-1 focus:outline-none cursor-pointer"
                >
                  <span>{filters.country || "Select Country"}</span>
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
                      setShowHospitals(false);
                      setShowCorporateTitles(false);
                      setShowCountries(false);
                    }}
                    className="flex border border-gray-300 rounded p-2 items-center justify-between w-full text-left text-sm text-black mb-1 focus:outline-none cursor-pointer"
                    disabled={!filters.country}
                  >
                    <span>{filters.city || "Select City"}</span>
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

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1 ">Select Date</label>
                <div className="">
                  <DatePicker
                    selectedDate={filters.date ? new Date(filters.date) : undefined}
                    onSelect={(date) => {
                      setFilters(prev => ({
                        ...prev,
                        date: date ? format(date, 'yyyy-MM-dd') : ''
                      }));
                    }}
                    placeholder="Pick a date"
                    className="text-black "
                  />
                </div>
              </div>

              {(filters.country || filters.city || filters.date || filters.designation || filters.hospital || filters.corporateTitles.length > 0) && (
                <div className="flex justify-center items-end">
                  <button
                    onClick={resetFilters}
                    className="w-36 py-1 mb-2.5 mr-16 px-2 bg-[#007F4E] text-white rounded hover:bg-[#006641] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>


        <div id="vacancies-results">
          {/* Coming Soon Vacancies Section */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 mt-8">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {comingSoonVacancies.map((vacancy) => (
                <div
                  key={vacancy.id}
                  className="bg-green-100 rounded-md border border-green-200 p-3 md:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer h-40 flex flex-col relative opacity-75"
                >
                  <div className="absolute top-2 md:top-3 right-2 md:right-3 z-10">
                    {(() => {
                      const logo = vacancy.hospital?.logo as string | undefined;
                      if (logo) {
                        return (
                          <div className="relative h-16 w-16 md:h-16 md:w-16 overflow-hidden">

                          </div>
                        );
                      }

                      const colors = [
                        "bg-blue-600",
                        "bg-green-600",
                        "bg-purple-600",
                        "bg-red-600",
                        "bg-yellow-600",
                      ];
                      const colorIndex = vacancy.hospital.id % colors.length;
                      return (
                        <div
                          className={`h-6 w-6 md:h-10 md:w-10 ${colors[colorIndex]} rounded-full flex items-center justify-center shadow-md`}
                        >
                          <span className="text-white text-xs md:text-xs font-bold">
                            {vacancy.hospital.name
                              ? vacancy.hospital.name.charAt(0).toUpperCase()
                              : "-"}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                   <div className="mb-2 md:mb-3 pr-48 md:pr-32 items-start " >
                    <div className="text-xs md:text-sm font-bold bg-green-600 rounded-full py-1 text-white text-center ">
                      Available Soon
                    </div>
                  </div>


                  <div className="text-sm md:text-base text-black">
                    {vacancy.hospital.name}
                  </div>

                  <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-2 md:mb-3 flex-grow leading-tight capitalize">
                    {vacancy.designation}
                  </h3>

                  <div className="flex gap-1 md:gap-2 mt-auto flex-wrap">
                    <span className="bg-gray-900 text-white text-xs px-2 md:px-3 py-1 rounded-full capitalize">
                      {vacancy.employmentType?.name}
                    </span>
                    <span className="bg-gray-900 text-white text-xs px-2 md:px-3 py-1 rounded-full capitalize">
                      {vacancy.workPlaceType?.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locum Vacancies Section */}
          {/* <h2 className="text-xl font-semibold mb-4">Available Now</h2>
          {filteredVacancies.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-black text-lg">
                No vacancies available at the moment.
              </p>
              <p className="text-black text-sm mt-2">
                Please check back later for new opportunities.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedVacancies.map((vacancy) => (
                  <Link
                    key={vacancy.id}
                    href={`/locum-vacancy/${vacancy.id}`}
                    onClick={() => handleVacancyClick(vacancy.id)}
                    className="block"
                  >
                    <div className="bg-green-100 rounded-md border border-gray-200 p-3 md:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer h-40 flex flex-col relative">
                      <div className="absolute top-2 md:top-3 right-2 md:right-3 z-10">
                        {(() => {
                          const logo = vacancy.hospital?.logo as string | undefined;
                          if (logo) {
                            return (
                              <div className="relative h-16 w-16 md:h-16 md:w-16 overflow-hidden">
                                <Image
                                  src={logo}
                                  alt={vacancy.hospital.name}
                                  width={1920}
                                  height={1080}
                                  className="object-cover h-full w-full"
                                />
                              </div>
                            );
                          }

                          const colors = [
                            "bg-blue-600",
                            "bg-green-600",
                            "bg-purple-600",
                            "bg-red-600",
                            "bg-yellow-600",
                          ];
                          const colorIndex = vacancy.hospital.id % colors.length;
                          return (
                            <div
                              className={`h-6 w-6 md:h-10 md:w-10 ${colors[colorIndex]} rounded-full flex items-center justify-center shadow-md`}
                            >
                              <span className="text-white text-xs md:text-xs font-bold">
                                {vacancy.hospital.name
                                  ? vacancy.hospital.name.charAt(0).toUpperCase()
                                  : "-"}
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="mb-2 md:mb-3 pr-48 md:pr-32 items-start">
                        <div className="bg-white text-black text-xs px-2 md:px-3 py-1 rounded-full">
                          Closing On: {formatDate(vacancy.endDate)}
                        </div>
                      </div>

                      <div className="text-sm md:text-base text-black">
                        {vacancy.hospital.name}
                      </div>

                      <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-2 md:mb-3 flex-grow leading-tight capitalize">
                        {vacancy.designation}
                      </h3>

                      <div className="flex gap-1 md:gap-2 mt-auto flex-wrap">
                        <span className="bg-gray-900 text-white text-xs px-2 md:px-3 py-1 rounded-full capitalize">
                          {vacancy.employmentType?.name}
                        </span>
                        <span className="bg-gray-900 text-white text-xs px-2 md:px-3 py-1 rounded-full capitalize">
                          {vacancy.workPlaceType?.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredVacancies.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                showItemsInfo={false}
              />
            </div>
          )} */}
        </div>
      </div>
    </section>
  );
}
