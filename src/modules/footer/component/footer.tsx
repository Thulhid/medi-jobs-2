"use client";

import Link from "next/link";
import Image from "next/image";


export const Footer = () => {
  return (
    <footer className="w-full h-auto border-t border-gray-200">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">

          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start">
            <Link href="/" className="block mb-2">
              <Image
                src={'/images/logo/logo.png'}
                alt={'medijobs.lk'}
                width={1920}
                height={1080}
                className={'w-36 h-auto object-cover'}
              />
            </Link>
            <p className="text-sm  text-center md:text-left w-68">
              &quot;The heartbeat of medical hiring, empowering healthcare professionals and driving careers forward.&quot;
            </p>
          </div>

          <div className="col-span-1">
            <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
            <ul className="space-y-1">
              <li><Link href="/vacancies" className="text-sm hover:underline">Permanent Vacancies</Link></li>
              <li><Link href="/locum-vacancy" className="text-sm hover:underline">Locum Vacancies</Link></li>
              <li><Link href="/hospitals" className="text-sm hover:underline">Hospitals</Link></li>
              <li><Link href="/news" className="text-sm hover:underline">News</Link></li>
              <li><Link href="/contact" className="text-sm hover:underline">Contact Us</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h2 className="text-lg font-semibold mb-2">Related Links</h2>
            <ul className="space-y-1 ">
              <li><Link href="http://www.mri.gov.lk/" target="_blank" className="text-sm hover:underline">Medical Research Institute Sri Lanka</Link></li>
              <li><Link href="https://slmc.gov.lk/" target="_blank" className="text-sm hover:underline">Sri Lanka Medical Council</Link></li>
              <li><Link href="https://www.who.int/southeastasia/" target="_blank" className="text-sm hover:underline">World Health Organization</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
            <ul className="space-y-2">
              <li>
                <Link href="mailto:medijobs.lk@gmail.com" className="text-sm hover:underline">
                  medijobs.lk@gmail.com
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link href="tel:+94777312132" className="text-sm hover:underline">
                  +94 777 31 21 32
                </Link>
                <span className="text-gray-400">|</span>
                <Link href="tel:+94332215216" className="text-sm hover:underline">
                  +94 33 2 215 216
                </Link>
              </li>
              <li className="text-sm">
                <p className="mb-1">Career Invesment & Management Agency (Pvt) Ltd.</p>
                <p>No 85, Sanasa Ideal Complex,<br />
                  Bauddhaloka Mawatha, Gampaha.</p>
              </li>
            </ul>

            <div className="flex gap-4 mt-3">
              <Link href="https://www.facebook.com/Medijobs.lk" target="_blank" className="hover:opacity-80 transition-opacity" aria-label="Facebook">
                <Image src="/images/footer/facebook.png" alt="Facebook" width={20} height={20} className="w-4 h-4" />
              </Link>
              <Link href="https://www.instagram.com/medijobs.lk/" target="_blank" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
                <Image src="/images/footer/instagram.png" alt="Instagram" width={20} height={20} className="w-4 h-4" />
              </Link>
              <Link href="https://www.linkedin.com/company/medijobs-lk/" target="_blank" className="hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                <Image src="/images/footer/linkedin.png" alt="LinkedIn" width={20} height={20} className="w-4 h-4" />
              </Link>
              <Link href="https://wa.me/94777312132" target="_blank" className="hover:opacity-80 transition-opacity" aria-label="WhatsApp">
                <Image src="/images/footer/whatsapp.png" alt="WhatsApp" width={20} height={20} className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center border-t border-gray-200 py-2 mt-8">
        <div className="text-center text-xs"><p>Copyright 2025 Medi Jobs | All Rights Reserved | Designed & Developed by <Link className="font-semibold text-black" href="https://alphamedia.lk" target="_blank">Alpha Media</Link> | Terms and Conditions | Privacy Policy</p> </div>
      </div>
    </footer>
  )
}