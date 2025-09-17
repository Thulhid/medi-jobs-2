"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass, X } from "lucide-react";
import { LoadingSpinner } from "@/modules/shared/components/loading-spinner";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isValidUrl = (value: string): boolean => {
  if (!value || value.trim() === '') return false;

  try {
    const url = new URL(value.trim());
    // Check if it's a proper HTTP/HTTPS URL
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

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
  vacancyOption?: string;
  hospital: { id: number; name: string; logo: string; description: string; banner: string};
  corporateTitle: { id: number; name: string };
  employmentType: { id: number; name: string };
  workPlaceType: { id: number; name: string };
  sbu: { id: number; name: string };
  clicks: { id: number; createdAt: string }[];
}



export default function PublicLocumVacancyDetail({ id }: { id: string }) {
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplyOpen, setApplyOpen] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const response = await fetch(`/api/backend/vacancy/${id}?public=true`);
        if (!response.ok) {
          if (response.status === 404)
            throw new Error("Vacancy not found or no longer available");
          throw new Error("Failed to fetch vacancy details");
        }
        const data = await response.json();
        setVacancy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
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

  if (error || !vacancy) {
    return (
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold mb-4">Vacancy Not Available</h1>
          <p className="text-red-600 mb-4">{error || "Vacancy not found"}</p>
          <Link
            href="/locum-vacancy"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Locum Vacancies
          </Link>
        </div>
      </main>
    );
  }

  return (
    <section className=" w-full ">
      <div className="items-center justify-center w-full relative">

        <div className="w-full h-64 hidden md:block">
          <Image
            src={vacancy.hospital.logo}
            alt={`Job Advertisement - ${vacancy.designation}`}
            width={1980}
            height={1080}
            className="w-full h-64 object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/50 z-0" />
      </div>
      <div className="mx-auto w-full max-w-[1440px] px-4 p-2">
        <Link
          href="/locum-vacancy"
          className="text-[#007F4E] hover:text-[#007F4E] mb-4 inline-block"
        >
          ← Back to Locum Vacancies
        </Link>


        {vacancy.banner && isValidUrl(vacancy.banner) && (
          <div className="mb-8">
            <div className="mx-auto w-full max-w-[720px] bg-white  border overflow-hidden">
              <div className="w-full h-[500px] overflow-y-auto  overflow-x-hidden">
                <Image
                  src={vacancy.banner}
                  alt={`Job Advertisement - ${vacancy.designation}`}
                  width={1400}
                  height={2000}
                  className="w-full h-auto block cursor-pointer hover:opacity-90 transition-opacity"
                  priority
                  onClick={() => setIsImageFullscreen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {isImageFullscreen && vacancy.banner && isValidUrl(vacancy.banner) && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setIsImageFullscreen(false)}>
            <div className="relative" onClick={e => e.stopPropagation()}>

              <Image
                src={vacancy.banner}
                alt={`Fullscreen - ${vacancy.designation}`}
                width={1920}
                height={1080}
                className="max-h-[90vh] max-w-[90vw] w-full object-contain"
                priority
              />


              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageFullscreen(false);
                }}
                className="absolute top-4 right-4 px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors shadow-lg"
                aria-label="Close fullscreen"
              >
                <X className="h-4 w-4" />
              </button>


              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageFullscreen(false);
                  setApplyOpen(true);
                }}
                className="h-8 w-36 absolute bottom-4 right-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2 shadow-lg"
              >
                <Compass className="h-4 w-4" />
                Apply Now
              </button>
            </div>
          </div>
        )}
        <div className="flex items-start gap-4  ">
          {vacancy.hospital.logo && isValidUrl(vacancy.hospital.logo) ? (

            <div className="relative">
              <Image
                src={vacancy.hospital.logo}
                alt={vacancy.hospital.name}
                width={1920}
                height={1080}
                className="object-cover rounded h-24 w-full"
              />
            </div>
          ) : (
            <div className="h-12 w-12 bg-gray-200 rounded  items-center justify-center flex-shrink-0 ">
              <span className="text-gray-500 text-sm font-medium">
                {vacancy.hospital.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 block ">
            <p className="text-lg font-semibold text-gray-900">
              {vacancy.hospital.name}
            </p>
             <div className="text-sm text-gray-600 mt-1 flex-col space-y-1 hidden md:flex ">
          <span>
            <span className="font-medium capitalize">Opening date:</span>{" "}
            {formatDate(vacancy.startDate)}
          </span>
          <span>
            <span className="font-medium capitalize">Closing date:</span>{" "}
            {formatDate(vacancy.endDate)}
          </span>
        </div>
          </div>
          <div className="ml-auto flex">
            <button
              type="button"
              onClick={() => setApplyOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Compass className="size-5 " />
              Apply now
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-600 mt-1 flex flex-col mb-4 px-4  md:hidden">
          <span>
            <span className="font-medium capitalize">Opening date:</span>{" "}
            {formatDate(vacancy.startDate)}
          </span>
          <span>
            <span className="font-medium capitalize">Closing date:</span>{" "}
            {formatDate(vacancy.endDate)}
          </span>
        </div>



        <h1 className="text-2xl font-bold text-gray-900 mb-3 capitalize">
          Designation : {vacancy.designation}
        </h1>


        <div className="bg-white rounded-lg mb-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line capitalize">
            {vacancy.summary || "Please refer the advertisement."}
          </p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 capitalize">
              <span className="font-semibold capitalize">Corporate title:</span>{" "}
              {vacancy.corporateTitle?.name || "-"}
            </p>
            <p className="text-sm text-gray-600 capitalize">
              <span className="font-semibold capitalize">Strategic business unit:</span>{" "}
              {vacancy.sbu?.name || "-"}
            </p>
            <p className="text-sm text-gray-600 capitalize">
              <span className="font-semibold capitalize">Workplace type:</span>{" "}
              {vacancy.workPlaceType?.name || "-"}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 capitalize">
              <span className="font-semibold capitalize">Location:</span>{" "}
              {vacancy.city}, {vacancy.country}
            </p>
            <p className="text-sm text-gray-600 capitalize">
              <span className="font-semibold capitalize">Employment type:</span>{" "}
              {vacancy.employmentType?.name || "-"}
            </p>
            <p className="text-sm text-gray-600 capitalize">
              <span className="font-semibold capitalize">Vacancy type:</span>{" "}
              {vacancy.vacancyOption || "-"}
            </p>
          </div>
        </div>


        {isApplyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setApplyOpen(false)} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-lg font-semibold">Apply for {vacancy.designation}</h2>
                <button
                  type="button"
                  onClick={() => setApplyOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Choose how you want to apply for this vacancy.
              </p>

              <div className="flex flex-col-2 items-center justify-center gap-4 ">

                {(() => {
                  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
                  const phone = `+94773351707`;
                  const msg =
                    `Hello, I am interested in the ${vacancy.designation} position at ${vacancy.hospital.name}.` +
                    `\nVacancy ID: ${vacancy.id}` +
                    `\nHospital: ${vacancy.hospital.name} ` +
                    `\nLink: ${process.env.NEXT_PUBLIC_DOMAIN_URL}   ${currentUrl}` +
                    `\n\nThank you for choosing us.please attach your CV`;
                  const wa = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                  return (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-64 text-center px-4 py-2 rounded-md  border border-green-600 text-black hover:bg-green-700 hover:border-green-700 flex flex-col items-center justify-center gap-2"
                      onClick={() => setApplyOpen(false)}
                    >
                      <Image 
                        src="/images/apply-now/whatsapp.png"
                        alt="WhatsApp" 
                        width={200}
                        height={200}
                        className="w-12 h-12"
                      />
                       via WhatsApp
                    </a>
                  );
                })()}


                {(() => {

                  const portalUrlValue = vacancy.portalUrl?.trim();


                  const hasPortalUrl = portalUrlValue &&
                    portalUrlValue !== '' &&
                    portalUrlValue !== 'null' &&
                    portalUrlValue !== 'undefined';

                  const hasValidPortal = hasPortalUrl && isValidUrl(portalUrlValue);


                  const hasEmail = vacancy.email && vacancy.email.trim() !== '';

                  console.log('Portal URL Debug:', {
                    originalPortalUrl: vacancy.portalUrl,
                    portalUrlTrimmed: portalUrlValue,
                    hasPortalUrl: hasPortalUrl,
                    isValidUrl: hasPortalUrl ? isValidUrl(portalUrlValue) : false,
                    hasValidPortal: hasValidPortal,
                    hasEmail: hasEmail,
                    vacancyId: vacancy.id,
                    designation: vacancy.designation
                  });


                  const forceShowPortal = hasPortalUrl;

                  if (hasValidPortal || forceShowPortal) {

                    const urlToUse = hasValidPortal ? portalUrlValue : portalUrlValue;
                    return (
                      <a
                        href={urlToUse}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col w-64 text-center px-4 py-2 rounded-md border  items-center justify-center gap-2 ${hasValidPortal
                            ? 'border-blue-600 text-black hover:bg-blue-400'
                            : 'border-orange-600 text-black hover:bg-orange-400'
                          }`}
                        onClick={() => setApplyOpen(false)}
                      >
                        <Image 
                          src="/images/apply-now/internet.png"
                          alt="Portal" 
                          width={200}
                          height={200}
                          className="w-12 h-12"
                        />
                        via Portal
                      </a>
                    );
                  } else if (hasEmail) {

                    const subject = `Application for ${vacancy.designation} at ${vacancy.hospital.name}`;
                    const body = `Dear ${vacancy.contactPerson || "Hiring Manager"},\r\n\r\nI am writing to express my interest in the ${vacancy.designation} position at ${vacancy.hospital.name}.\r\n\r\nVacancy Details:\r\n- Position: ${vacancy.designation}\r\n- Location: ${vacancy.city}, ${vacancy.country}\r\n- Vacancy ID: ${vacancy.id}\r\n- Job Posting: ${typeof window !== "undefined" ? window.location.href : ""}\r\n\r\nI have attached my resume and cover letter for your review. I look forward to the opportunity to discuss how my skills and experience align with your requirements.\r\n\r\nThank you for your time and consideration.\r\n\r\nBest regards,\r\n[Your Full Name]\r\n[Your Contact Information]`;
                    const mail = `mailto:${vacancy.email}?cc=medijobs.lk@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    return (
                      <a
                        href={mail}
                        className="flex flex-col w-64 text-center px-4 py-2 rounded-md border border-blue-400 hover:bg-blue-400  items-center justify-center gap-2"
                        onClick={() => setApplyOpen(false)}
                      >
                        <Image 
                          src="/images/apply-now/mail.png"
                          alt="Email" 
                          width={200}
                          height={200}
                          className="w-12 h-12"
                        />
                         via Email
                      </a>
                      
                    );
                  }


                  return null;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}