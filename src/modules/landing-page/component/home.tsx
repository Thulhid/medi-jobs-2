"use client";

import {AnimatePresence, motion} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import {LoadingSpinner} from "@/modules/shared/components/loading-spinner";
import {SocialIcon} from "@/modules/shared/components/social-icon";

const image = [
    "/images/landing-page-slider/image1.jpg",
    "/images/landing-page-slider/image2.jpg",
    "/images/landing-page-slider/image3.jpg",
    "/images/landing-page-slider/image4.jpg",
    "/images/landing-page-slider/image5.jpg",
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
        return <LoadingSpinner className="min-h-screen"/>;
    }


    return (
        <section className=" w-full h-screen overflow-hidden  relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={image[index]}
                    className="absolute inset-0"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 1}}
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


            <div className="absolute inset-0 h-screen bg-gradient-to-t from-black to-transparent z-0"/>

            <div className=" z-10 w-full h-screen relative ">

                <div className="flex items-center gap-1 mt-20 px-6 w-full mx-auto lg:hidden ">

                    {[
                        {
                            link: "vacancies",
                            title: "Permanent"
                        },
                        {
                            link: "locum-vacancies",
                            title: "Locum"
                        },
                        {
                            link: "hospitals",
                            title: "Hospitals"
                        },
                        {
                            link: "news",
                            title: "News"
                        },
                    ]?.map((
                        link: {
                            title: string,
                            link: string
                        }
                    ) => (
                        <Link
                            key={link.title}
                            href={`/${link.link}`}
                            className="text-sm text-center px-3 py-2 h-full w-full bg-[#007F4E] hover:bg-[#1E4A28] transition-all ease-in-out duration-300 text-white cursor-pointer rounded"
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>


                <div className="hidden md:flex absolute bottom-6 right-10 flex-col gap-2 z-20">
                    {
                        [
                            {
                                link: 'https://www.facebook.com/Medijobs.lk',
                                image: 'facebook'
                            },
                            {
                                link: 'https://www.instagram.com/medijobs.lk?igsh=djFhdHE2dXJubzV6',
                                image: 'instagram'
                            },
                            {
                                link: 'https://www.linkedin.com/company/medijobs-lk/',
                                image: 'linkedin'
                            },
                            {
                                link: 'https://wa.me/+94777312132',
                                image: 'whatsapp'
                            }
                        ]?.map((
                            social: { link: string, image: string },
                        ) => (
                            <SocialIcon key={social.image} link={social.link} image={social.image} alt={social.image}/>
                        ))
                    }
                </div>

                <div className="absolute bottom-24 left-10">
                    <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4">
                        Be an Expert
                    </h1>
                    <p className="text-white/90 max-w-2xl pr-4 mb-4">
                        To be the leading career platform for healthcare professionals, connecting doctors, nurses,
                        pharmacists, lab technicians, therapists, and medical staff with trusted institutions empowering
                        careers and strengthening Sri Lanka’s healthcare sector.
                    </p>
                    <div className="flex flex-wrap gap-3 ">
                        <Link
                            href="/contact"
                            className="px-8 py-2 rounded-full bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                            Take a Demo
                        </Link>
                        <Link
                            href="/request-now"
                            className="px-8 py-2 rounded-full bg-[#007F4E] text-white text-sm font-medium hover:bg-[#1E4A28] transition-colors"
                        >
                            Connect
                        </Link>
                    </div>


                    <div className="flex md:hidden gap-3 mt-4 pt-8">
                        {
                            [
                                {
                                    link: 'https://www.facebook.com/Medijobs.lk',
                                    image: 'facebook'
                                },
                                {
                                    link: 'https://www.instagram.com/medijobs.lk?igsh=djFhdHE2dXJubzV6',
                                    image: 'instagram'
                                },
                                {
                                    link: 'https://www.linkedin.com/company/medijobs-lk/',
                                    image: 'linkedin'
                                },
                                {
                                    link: 'https://wa.me/+94777312132',
                                    image: 'whatsapp'
                                }
                            ]?.map((
                                social: { link: string, image: string },
                            ) => (
                                <SocialIcon key={social.image} link={social.link} image={social.image}
                                            alt={social.image}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    );
};
