"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {Menu, X} from "lucide-react";
import {motion} from "framer-motion";
import {NavLink} from "@/modules/navbar/components/nav-link";
import {MobileNavLink} from "@/modules/navbar/components/mobile-nav-link";


export const Navbar = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll, {passive: true});
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <header
            className={`w-full fixed flex items-center z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-1' : 'bg-transparent py-0 md:py-2 '}`}>

            <div className="hidden lg:flex px-10 left-0 right-0 items-center w-full justify-between mx-auto">
                <Link href="/">
                    <div
                        className={`w-28 h-auto overflow-hidden rounded-full p-2 transition-all duration-300 ${scrolled ? 'bg-white' : 'bg-white'}`}>
                        <Image
                            src={'/images/logo/logo.png'}
                            alt={'medijobs.lk'}
                            width={1920}
                            height={1080}
                            className={'w-full h-auto object-cover'}/>
                    </div>
                </Link>
                <div
                    className="w-auto h-10 rounded-full z-10 bg-white flex items-center shadow  overflow-hidden px-1 cursor-pointer">
                    <nav className="flex w-full justify-between gap-4">
                        <NavLink href="/" label="Home"/>
                        <NavLink href="/permanent-vacancies" label="Permanent Vacancies"/>
                        <NavLink href="/locum-vacancy" label="Locum Vacancies"/>
                        <NavLink href="/hospitals" label="Featured Hospitals"/>
                        <NavLink href="/news" label="News"/>
                        <NavLink href="/contact" label="Contact Us"/>
                    </nav>
                </div>

                <div className=" flex items-center justify-center  h-10 rounded-full p-1 bg-white">
                    <Link
                        href="/signin"
                        className="relative flex items-center text-sm justify-center px-6 py-2 h-full w-full bg-white text-[#1E4A28] cursor-pointer rounded-full hover:bg-[#007F4E] hover:text-white transition-normal duration-300"
                    >
                        Log In
                    </Link>
                </div>
            </div>


            <div className="lg:hidden w-full">
                <div
                    className="flex items-center justify-between p-2 bg-white bg-gradient-to-b from-white via-white to-transparent ">
                    <div className="flex items-center">
                        <Link href="/">
                            <div className={'rounded w-full h-full px-2'}>
                                <Image
                                    src={'/images/logo/logo.png'}
                                    alt={'medijobs.lk'}
                                    width={1920}
                                    height={1080}
                                    className={'w-36 h-auto object-cover'}
                                />
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center">
                        <button
                            type="button"
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen((v) => !v)}
                            className="inline-flex items-center justify-center p-3 rounded text-[#1E4A28] transition-colors hover:bg-gray-100"
                        >
                            {mobileOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <motion.div
                        initial={{opacity: 0, y: 0}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 0}}
                        transition={{duration: 0.2}}
                        className="bg-white border-b shadow-lg py-12 "
                    >
                        <div className="h-screen space-y-1 text-center font-semibold ">
                            <MobileNavLink
                                href="/"
                                label="Home"
                                onClick={() => setMobileOpen(false)}
                            />
                            <MobileNavLink
                                href="/permanent-vacancies"
                                label="Permanent Vacancies"
                                onClick={() => setMobileOpen(false)}
                            />
                            <MobileNavLink
                                href="/locum-vacancy"
                                label="Locum Vacancies"
                                onClick={() => setMobileOpen(false)}
                            />
                            <MobileNavLink
                                href="/hospitals"
                                label="Featured Hospitals"
                                onClick={() => setMobileOpen(false)}
                            />
                            <MobileNavLink
                                href="/news"
                                label="News"
                                onClick={() => setMobileOpen(false)}
                            />
                            <MobileNavLink
                                href="/contact"
                                label="Contact Us"
                                onClick={() => setMobileOpen(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </header>
    );
}
