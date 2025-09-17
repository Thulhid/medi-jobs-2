"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/ui/components/form";
import { RequiredIndicator } from "./required-indicator";
import { Input } from "@/modules/ui/components/input";

interface InputFieldProps {
  fieldName: string;
  fieldLabel: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  required: boolean;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
}

// example types => string, number, tel(for phone numbers)

export const InputField = ({
  fieldName,
  placeholder,
  fieldLabel,
  control,
  required,
  type = "text",
  disabled,
}: InputFieldProps) => {
  const pattern = type === "tel" ? "^\\+?[0-9]{7,15}$" : undefined;
  const title =
    type === "tel"
      ? "Please enter a valid phone number (e.g. +1234567890 or 0712345678)"
      : undefined;

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-col justify-start items-start">
          <FormLabel className=" gap-1 flex  text-sm">
            {fieldLabel}
            {required && <RequiredIndicator />}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              pattern={pattern}
              title={title}
              disabled={disabled}
              className="h-9 bg-white text-sm"
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
