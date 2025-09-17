"use client";

import {AnimatePresence, motion} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import {LoadingSpinner} from "@/modules/shared/components/loading-spinner";

const image = [
  "/images/landing_page_slider/1 (4).jpg",
  "/images/landing_page_slider/1 (5).jpg",
  "/images/landing_page_slider/1 (6).jpg",
  "/images/landing_page_slider/1 (7).jpg",
  "/images/landing_page_slider/1 (8).jpg",
]

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const interval = setInterval(() => {
      setIndex((precIndex) => (precIndex + 1) % image.length);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }



  return (
    <section className=" w-full h-screen overflow-hidden  relative">

      <AnimatePresence mode="wait">
        <motion.div
          key={image[index]}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={image[index]}
            alt={`Banner ${index + 1}`}
            width={1920}
            height={1080}
            className="w-full  h-screen object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>


      <div className="absolute inset-0 h-screen bg-black/50 z-0" />

      <div className=" z-10 w-full max-w-[1440px]  h-screen">

        <div className="flex items-center gap-1 mt-20 px-6 w-full max-w-[1440px] mx-auto lg:hidden ">
          <Link
            href="/vacancies"
            className="relative flex items-center text-sm justify-center px-3 py-2 h-full w-full bg-[#007F4E] text-white cursor-pointer rounded transition-normal duration-300"
          >
           Permanent
          </Link>
          <Link
            href="/locum-vacancy"
            className="relative flex items-center text-sm justify-center px-3 py-2 h-full w-full bg-[#007F4E] text-white cursor-pointer rounded transition-normal duration-300"
          >
          Locum
          </Link>
          <Link
            href="/hospitals"
            className="relative flex items-center text-sm justify-center px-3 py-2 h-full w-full bg-[#007F4E] text-white cursor-pointer rounded transition-normal duration-300"
          >
            Hospitals
          </Link>
          <Link
            href="/news"
            className="relative flex items-center text-sm justify-center px-3 py-2 h-full w-full bg-[#007F4E] text-white cursor-pointer rounded transition-normal duration-300"
          >
            News
          </Link>
        </div>


        <div className="hidden md:flex absolute bottom-96 md:bottom-6 right-10 flex-col gap-1 z-20">
          <Link
            href="https://www.facebook.com/Medijobs.lk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-15 md:h-15 rounded-full flex items-center justify-center transition-all duration-300 group"
          >
            <Image
              src="/images/social-media/facebook.png"
              alt="Facebook"
              width={35}
              height={35}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
          <Link
            href="https://www.instagram.com/medijobs.lk?igsh=djFhdHE2dXJubzV6"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-15 md:h-15 rounded-full flex items-center justify-center transition-all duration-300 group"
          >
            <Image
              src="/images/social-media/instagram.png"
              alt="Instagram"
              width={35}
              height={35}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
          <Link
            href="https://www.linkedin.com/company/medijobs-lk/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-15 md:h-15 rounded-full flex items-center justify-center transition-all duration-300 group"
          >
            <Image
              src="/images/social-media/linkedln.png"
              alt="LinkedIn"
              width={50}
              height={50}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
          <Link
            href="https://wa.me/+94773351707"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-15 md:h-15 rounded-full flex items-center justify-center transition-all duration-300 group"
          >
            <Image
              src="/images/social-media/whatsapp.png"
              alt="WhatsApp"
              width={35}
              height={35}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
        </div>

        <div className="  absolute bottom-48 lg:bottom-15 left-10">
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4">
            Be an Expert
          </h1>
          <p className="text-white/90 max-w-2xl pr-4 mb-4">
            To be the leading career platform for healthcare professionals, connecting doctors, nurses, pharmacists, lab technicians, therapists, and medical staff with trusted institutions empowering careers and strengthening Sri Lanka’s healthcare sector.
          </p>
          <div className="flex flex-wrap gap-3 ">
            <Link
              href="/contact"
              className="px-4 py-2 rounded-full bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Take a Demo
            </Link>
            <Link
              href="/request-now"
              className="px-6 py-2 rounded-full bg-[#007F4E] text-white text-sm font-medium hover:bg-[#1E4A28] transition-colors"
            >
              Connect
            </Link>
          </div>


          <div className="flex md:hidden gap-3 mt-4 pt-8">
            <Link
              href="https://www.facebook.com/Medijobs.lk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <Image
                src="/images/social-media/facebook.png"
                alt="Facebook"
                width={35}
                height={35}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </Link>
            <Link
              href="https://www.instagram.com/medijobs.lk?igsh=djFhdHE2dXJubzV6"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <Image
                src="/images/social-media/instagram.png"
                alt="Instagram"
                width={35}
                height={35}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </Link>
            <Link
              href="https://www.linkedin.com/company/medijobs-lk/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <Image
                src="/images/social-media/linkedln.png"
                alt="LinkedIn"
                width={50}
                height={50}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </Link>
            <Link
              href="https://wa.me/+94773351707"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <Image
                src="/images/social-media/whatsapp.png"
                alt="WhatsApp"
                width={35}
                height={35}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
