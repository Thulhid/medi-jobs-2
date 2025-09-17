'use client'

import {usePathname} from "next/navigation";
import Link from "next/link";

interface Props{
    href: string,
    label: string,
    onClick?: () => void,
}

export const MobileNavLink = ({href, label, onClick}: Props)=> {
    const pathname = usePathname();

    const isActive = href === '/'
        ? pathname === '/'
        : pathname.startsWith(href);

    return (
        <div className="flex justify-center py-3">
            <Link
                href={href}
                onClick={onClick}
                className={
                    "px-6 py-2 rounded-full text-sm transition-colors " +
                    (isActive
                        ? "bg-[#007F4E] text-white"
                        : "text-gray-800 hover:bg-gray-100")
                }
            >
                {label}
            </Link>
        </div>
    );
}
