"use client";

import Image from "next/image";

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

export const VacanciesPage = () => {
    const comingSoonVacancies: ComingSoonVacancy[] = [
        {
            id: 999991,
            designation: "Senior Cardiologist",
            city: "Colombo",
            country: "Sri Lanka",
            hospital: {
                id: 1001,
                name: "National Hospital",
                logo: "/images/sample/permenant-vacancy.jpg",
            },
            corporateTitle: {
                id: 2001,
                name: "Consultant",
            },
            employmentType: {
                id: 3001,
                name: "Full Time",
            },
            workPlaceType: {
                id: 4001,
                name: "On-site",
            },
        },
        {
            id: 999992,
            designation: "Pediatric Surgeon",
            city: "Kandy",
            country: "Sri Lanka",
            hospital: {
                id: 1002,
                name: "Kandy General Hospital",
                logo: "/images/sample/permenant-vacancy.jpg",
            },
            corporateTitle: {
                id: 2002,
                name: "Specialist",
            },
            employmentType: {
                id: 3001,
                name: "Full Time",
            },
            workPlaceType: {
                id: 4001,
                name: "On-site",
            },
        },
        {
            id: 999993,
            designation: "Radiology Technician",
            city: "Galle",
            country: "Sri Lanka",
            hospital: {
                id: 1003,
                name: "Galle District Hospital",
                logo: "/images/sample/permenant-vacancy.jpg",
            },
            corporateTitle: {
                id: 2003,
                name: "Technician",
            },
            employmentType: {
                id: 3001,
                name: "Full Time",
            },
            workPlaceType: {
                id: 4001,
                name: "On-site",
            },
        },
    ];

    return (
        <section className="w-full mb-4">
            <div className="items-center justify-center w-full relative">
                <Image
                    src={"/images/landing_page_slider/1 (4).jpg"}
                    alt={"medijobs.lk"}
                    width={1920}
                    height={1080}
                    className={"w-full h-64 object-cover"}
                />
                <div className="absolute inset-0 bg-black/50 z-0" />
            </div>

            <div className="w-full max-w-[1440px] mx-auto top-64 z-10 px-4 ">
                <div className="flex items-center justify-start mt-4">
                    <h1 className="text-2xl font-semibold mb-4">Permanent Vacancies</h1>
                </div>

                <div id="vacancies-results">
                    {/* Coming Soon Vacancies Section */}
                    <div className="mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {comingSoonVacancies.map((vacancy) => (
                                <div
                                    key={vacancy.id}
                                    className="bg-green-100 rounded-md border border-green-200 p-3 md:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer h-40 flex flex-col relative opacity-75"
                                >

                                    <div className="mb-2 md:mb-3 pr-48 md:pr-32 items-start">
                                        <div className="text-xs md:text-sm font-bold bg-green-600 rounded-full px-2 py-1 text-white text-center">
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
                </div>
            </div>
        </section>
    );
};
