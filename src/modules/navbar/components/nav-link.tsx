import Link from "next/link";
import {usePathname} from "next/navigation";

interface Props{
    href: string,
    label: string,
}

export const NavLink = ({href, label}: Props)=> {
    const pathname = usePathname();

    const isActive = href === '/'
        ? pathname === '/'
        : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={
                "px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap " +
                (isActive
                    ? "bg-[#007F4E] text-white"
                    : "text-gray-700 hover:bg-gray-100")
            }
        >
            {label}
        </Link>
    );
}
