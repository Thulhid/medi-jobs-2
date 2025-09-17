"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { LoadingSpinner } from "@/modules/shared/components/loading-spinner";

type Hospital = {
  id: number;
  name: string;
  email: string;
  mobile: string;
  logo: string | null;
  banner?: string | null;
  description: string;
};

type Job = {
  id: number;
  designation: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  hospitalId: number;
  vacancyOption?: string;
  hospital: {
    id: number;
    name: string;
    logo: string;
  };
  employmentType: {
    id: number;
    name: string;
  };
  workPlaceType: {
    id: number;
    name: string;
  };
  corporateTitle: {
    id: number;
    name: string;
  };
}



export const HospitalPublicDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  const getVacancyRoute = (job: Job): string => {
    return job.vacancyOption === 'Locum' ? `/locum-vacancy/${job.id}` : `/vacancies/${job.id}`;
  };

  const handleVacancyClick = async (vacancyId: number) => {
    try {
      await fetch('/api/backend/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vacancyId }),
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/backend/hospital/${id}`);
        if (!res.ok) throw new Error("Failed to load hospital");
        const data = await res.json();
        setHospital(data);
      } catch (e: unknown) {
        setError((e as { message?: string })?.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/backend/vacancy?public=true`);
        if (!res.ok) throw new Error("Failed to load jobs");
        const data = await res.json();
      
        const hospitalJobs = data.filter((job: Job) => job.hospitalId === parseInt(id));
        setJobs(hospitalJobs);
      } catch (e: unknown) {
        setError((e as { message?: string })?.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hospital Not Available</h1>
          <p className="text-gray-600 mb-6">
            {error?.includes('not available') 
              ? "This hospital is currently not available for public viewing." 
              : error || "Hospital not found"}
          </p>
          <Link
            href="/hospitals"
            className="px-6 py-3 bg-[#007F4E] text-white rounded-lg hover:bg-[#006641] transition-colors"
          >
            Browse Other Hospitals
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className=" w-full mb-4 ">

      <div className="items-center justify-center w-full relative">

        <Image
          src={hospital.banner ?? '/images/landing_page_slider/1 (4).jpg'}
          alt={hospital.name}
          width={1920}
          height={1080}
          className={'w-full h-64 object-cover'}
        />
        <div className="absolute inset-0 bg-black/50 z-0" />
      </div>

      <div className="w-full max-w-[1440px] mx-auto top-64 z-10 px-4">
        <div className="p-6 ">
          <Link
            href="/hospitals"
            className=" text-[#007F4E] hover:text-[#007F4E] inline-block hover:border-b border-[#007F4E]"
          >
            ← Back to Hospital
          </Link>
        </div>

        <div className="relative w-full">
          <div className=" flex items-center gap-3">
            {hospital.logo ? (
              <div className="relative rounded bg-white ">
                <Image
                  src={hospital.logo}
                  alt={hospital.name}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            ) : null}
            <h1 className="text-black text-2xl md:text-xl font-semibold">
              {hospital.name}
              <p className="text-sm font-semibold mb-4">Number of Vacancies : <span className="text-gray-700">{jobs.filter(job => job.hospitalId === hospital.id).length}</span></p>
            </h1>
          </div>
        </div>

        <div className="px-4 ">
          <p className="text-gray-700 ">
            {hospital.description}
          </p>
        </div>
        <div className="px-4 mt-4 flex items-center gap-2">
          <p className="text-gray-700 border border-gray-200 p-2 rounded w-84 flex items-center gap-2">
            <Mail />
            Email: {hospital.email}</p>
          {hospital.mobile && (
            <p className="text-gray-700 border border-gray-200 p-2 rounded w-84 flex items-center gap-2">
              <Phone />
              Mobile: {hospital.mobile}
            </p>
          )}
        </div>
      </div>
      <div className="w-full max-w-[1440px] mx-auto px-4 mt-8">

        {jobs.filter(job => job.hospitalId === hospital.id).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No vacancies available at this hospital currently.</p>
          </div>
        ) : (  
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {jobs.filter(job => job.hospitalId === hospital.id).map((job) => (
              <Link
                key={job.id}
                href={getVacancyRoute(job)}
                onClick={() => handleVacancyClick(job.id)}
                className="block"
              >
                <div className="bg-green-100 rounded-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer h-48 flex flex-col relative">
                  <div className="absolute top-3 right-3 z-10">
                    {job.hospital?.logo ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded">
                        <Image
                          src={job.hospital.logo}
                          alt={job.hospital.name}
                          width={48}
                          height={48}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 bg-[#007F4E] rounded flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {job.hospital.name ? job.hospital.name.charAt(0).toUpperCase() : "H"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-3 pr-16">
                    <div className="bg-white text-black text-xs px-3 py-1 rounded-full inline-block">
                      Closing: {new Date(job.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </div>
                  </div>

                  <div className="text-sm text-black mb-2">
                    {job.hospital.name}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex-grow leading-tight capitalize">
                    {job.designation}
                  </h3>

                  <div className="text-sm text-gray-600 mb-3">
                    {job.city}, {job.country}
                  </div>

                  <div className="flex gap-2 mt-auto flex-wrap">
                    <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full capitalize">
                      {job.employmentType?.name}
                    </span>
                    <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full capitalize">
                      {job.workPlaceType?.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
