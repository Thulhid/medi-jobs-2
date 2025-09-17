"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/ui/components/form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/modules/ui/components/input";
import { RequiredIndicator } from "@/modules/shared/components/required-indicator";

interface Props {
  name: string;
  label: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  required: boolean;
}

export const PasswordInput = ({
  name,
  label,
  placeholder,
  control,
  required,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={"text-start !text-sm"}>
          <FormLabel className=" gap-1 flex  text-sm">
            {label}
            {required && <RequiredIndicator />}
          </FormLabel>
          <FormControl>
            <div style={{ position: "relative" }}>
              <Input
                className={"h-9 bg-white !text-sm"}
                placeholder={placeholder}
                type={showPassword ? "text" : "password"}
                {...field}
              />
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeIcon size={20} className={"text-gray-400"} />
                ) : (
                  <EyeOffIcon size={20} className={"text-gray-400"} />
                )}
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
