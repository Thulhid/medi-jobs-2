"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateHospital } from "@/modules/backend/hospital/hooks/use-create-hospital";
import { SecureLogobox } from "@/modules/shared/components/secure-logobox";
import { Form } from "@/modules/ui/components/form";
import { InputField } from "@/modules/shared/components/input-field";
import { Button } from "@/modules/ui/components/button";
import { LoadingButton } from "@/modules/shared/components/loading-button";
import { CustomTableBackHeader } from "@/modules/shared/components/custom-table-back-header";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please provide a valid email." }),
  description: z
    .string()
    .min(5, { message: "Description  about the hospital" }),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters." })
    .optional(),
  mobile: z.string().min(10, { message: "Mobile number is required" }),
  logo: z.string().nonempty("Logo is required"),
  banner: z.string().nonempty("Banner is required"),
  country: z.string().min(2, { message: "Country must be at least 2 characters." }),
});

export const HospitalAdd = () => {
  const router = useRouter();
  const { createHospital, hospitalLoading } = useCreateHospital();
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
      city: "",
      mobile: "",
      logo: "",
      banner: "",
      country: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setError("");
    try {
      const created = await createHospital({
        name: data.name,
        email: data.email,
        description: data.description,
        city: data.city,
        mobile: data.mobile,
        country: data.country,
        logo: data.logo,
        banner: data.banner,
      });
      if (created) {
        router.push("/admin-dashboard/hospitals");
      } else {
        setError(
          "Failed to create hospital. Please check inputs and try again.",
        );
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Unexpected error while creating hospital.");
    }
  };

  return (
    <div className="space-y-6">
      <CustomTableBackHeader header="hospitals" link="true" />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Hospital Logo Upload with S3 */}
          <SecureLogobox
            fieldName="logo"
            fieldLabel="Hospital Logo"
            control={form.control}
            required={true}
            setValue={form.setValue}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              fieldName="name"
              fieldLabel="Hospital Name"
              placeholder="What is your Hospital name?"
              control={form.control}
              required={true}
            />
            <InputField
              fieldName="city"
              fieldLabel="City"
              placeholder="City where the hospital is located"
              control={form.control}
              required={false}
            />
            <InputField
              fieldName="email"
              fieldLabel="Hospital Email"
              placeholder="What is your Hospital email?"
              control={form.control}
              required={true}
              type="email"
            />
            <InputField
              fieldName="mobile"
              fieldLabel="Mobile"
              placeholder="What is your Hospital mobile?"
              control={form.control}
              required={true}
              type="number"
            />
            <InputField
              fieldName="country"
              fieldLabel="Country"
              placeholder="Country where the hospital is located"
              control={form.control}
              required={true}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Hospital Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              {...form.register("description")}
              placeholder="What is your Hospital description?"
              className="border rounded px-3 py-2 w-full min-h-48"
            />
          </div>

          {/* Hospital Banner Upload with S3 */}
          <SecureLogobox
            fieldName="banner"
            fieldLabel="Hospital Banner"
            control={form.control}
            required={true}
            setValue={form.setValue}
          />

          <div className="flex justify-end">
            {hospitalLoading ? (
              <LoadingButton />
            ) : (
              <Button
                className="text-white bg-green-500"
                size="sm"
                type="submit"
              >
                Add Hospital
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
