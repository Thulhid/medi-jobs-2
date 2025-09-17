"use client";

import Image from "next/image";

export interface AvatarProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  shape?: "circle" | "square";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className = "",
  shape = "circle",
}: AvatarProps) {
  const sizeClass = sizeClasses[size];
  const textSizeClass = textSizeClasses[size];
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded";

  // Generate fallback from alt text if not provided
  const fallbackText = fallback || alt.charAt(0).toUpperCase();

  if (src) {
    return (
      <div
        className={`relative ${sizeClass} ${shapeClass} overflow-hidden ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} ${shapeClass} bg-gray-100 flex items-center justify-center ${textSizeClass} font-medium text-gray-700 ${className}`}
    >
      {fallbackText}
    </div>
  );
}

// Specialized logo component
export interface LogoAvatarProps extends Omit<AvatarProps, "shape" | "alt"> {
  name: string;
}

export function LogoAvatar({
  name,
  src,
  size = "md",
  className = "",
}: LogoAvatarProps) {
  return (
    <Avatar
      src={src}
      alt={`${name} logo`}
      fallback={name.charAt(0).toUpperCase()}
      size={size}
      shape="square"
      className={className}
    />
  );
}
