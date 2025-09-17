"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/ui/components/select";
import { RequiredIndicator } from "./required-indicator";

interface Option {
  value: string;
  label: string;
}

interface SelectOptionFieldProps {
  fieldName: string;
  fieldLabel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  required?: boolean;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}

export const SelectOptionField = ({
  fieldName,
  fieldLabel,
  control,
  required,
  options,
  placeholder,
  disabled,
}: SelectOptionFieldProps) => {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="text-start">
          <FormLabel className="gap-1 flex text-sm">
            {fieldLabel}
            {required ? <RequiredIndicator /> : null}
          </FormLabel>
          <FormControl>
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={placeholder ?? "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
