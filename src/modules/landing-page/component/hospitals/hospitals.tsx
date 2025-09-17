"use client";

import Image from "next/image";

type ComingSoonHospital = {
  id: number;
  name: string;
  logo: string;
  city: string;
  country: string;
};


export default function HospitalsPage() {
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

  return (
    <main className="w-full mx-auto mb-4">
      <div className="items-center justify-center w-full relative">
        <Image
          src={'/images/landing_page_slider/1 (4).jpg'}
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
        </div>
      </div>
    </main>
  );
}
