"use client";

export interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

export function StatusBadge({
  status,
  variant,
  className = "",
}: StatusBadgeProps) {
  // Auto-detect variant based on status if not provided
  const getVariant = (status: string): string => {
    if (variant) return variant;

    const statusLower = status.toLowerCase();
    if (
      statusLower.includes("approved") ||
      statusLower.includes("active") ||
      statusLower.includes("success")
    ) {
      return "success";
    }
    if (
      statusLower.includes("rejected") ||
      statusLower.includes("error") ||
      statusLower.includes("failed")
    ) {
      return "error";
    }
    if (statusLower.includes("pending") || statusLower.includes("warning")) {
      return "warning";
    }
    if (statusLower.includes("info")) {
      return "info";
    }
    return "default";
  };

  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-rose-100 text-rose-800",
    info: "bg-blue-100 text-blue-800",
  };

  const variantClass =
    variantClasses[getVariant(status) as keyof typeof variantClasses];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClass} ${className}`}
    >
      {status}
    </span>
  );
}
