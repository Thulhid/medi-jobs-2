import Link from "next/link";
import Image from "next/image";

interface Props {
    link: string,
    image: string;
    alt: string;
}

export const SocialIcon = ({
                               link,
                               image,
                               alt
                           }: Props) => {
    return (
        <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 object-cover rounded-full flex items-center justify-center transition-all duration-300 group"
        >
            <Image
                src={`/images/social-media/${image}.png`}
                alt={alt}
                width={512}
                height={512}
                className="group-hover:scale-110 transition-transform duration-300 w-full h-full"
            />
        </Link>
    )
}
