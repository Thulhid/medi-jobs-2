"use client";

import { Button } from "@/modules/ui/components/button";

interface LoadingButtonProps {
  text?: string;
  size?: "sm" | "default" | "lg" | "icon";
}

export const LoadingButton = ({
  text = "Saving...",
  size = "sm",
}: LoadingButtonProps) => {
  return (
    <Button size={size} disabled>
      <span className="inline-flex items-center gap-2">
        <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
        {text}
      </span>
    </Button>
  );
};
