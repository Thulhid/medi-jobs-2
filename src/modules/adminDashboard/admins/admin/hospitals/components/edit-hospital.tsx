"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetHospitalById } from "@/modules/backend/hospital/hooks/use-gey-by-id-hospital";
import { useUpdateHospital } from "@/modules/backend/hospital/hooks/use-update-hospital";
import { SecureLogobox } from "@/modules/shared/components/secure-logobox";
import { Form } from "@/modules/ui/components/form";
import { InputField } from "@/modules/shared/components/input-field";
import { Button } from "@/modules/ui/components/button";
import { LoadingButton } from "@/modules/shared/components/loading-button";
import { LoadingSpinner } from "@/modules/shared/components/loading-spinner";
import { CustomTableBackHeader } from "@/modules/shared/components/custom-table-back-header";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please provide a valid email." }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be add." }).optional(),
  country: z.string().min(2, { message: "Country must be add." }).optional(),
  logo: z.string().nonempty("Logo is required"),
  banner: z.string().nonempty("Banner is required"),
  mobile: z.string().min(2, { message: "Mobile must be add." }).optional(),
});

export const HospitalEdit = () => {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || "");
  const router = useRouter();

  const { hospital, hospitalLoading: loadingHospital } = useGetHospitalById(id);
  const { updateHospital, hospitalLoading: saving } = useUpdateHospital();
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
      city: "",
      country: "",
      mobile: "",
      logo: "",
      banner: "",
    },
  });

  useEffect(() => {
    if (hospital) {
      form.reset({
        name: hospital.name || "",
        email: hospital.email || "",
        description: hospital.description || "",
        city: hospital.city || "",
        country: hospital.country || "",
        mobile: hospital.mobile || "",
        logo: hospital.logo || "",
        banner: hospital.banner || "",
      });
    }
  }, [hospital, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setError("");
    if (!id) return;

    try {
      const updated = await updateHospital(id, {
        name: data.name,
        email: data.email,
        description: data.description,
        city: data.city,
        country: data.country,
        mobile: data.mobile,
        logo: data.logo,
        banner: data.banner,
      });
      if (updated) {
        router.push("/admin-dashboard/hospitals");
      } else {
        setError("Failed to update hospital. Please try again.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Unexpected error while updating hospital.");
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

      {loadingHospital ? (
        <LoadingSpinner />
      ) : !hospital ? (
        <div className="text-sm text-rose-600">Hospital not found.</div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Hospital Logo Upload with S3 */}
            <SecureLogobox
              fieldName="logo"
              fieldLabel="Hospital Logo"
              control={form.control}
              required={true}
              setValue={form.setValue}
              existingValue={hospital.logo}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                fieldName="name"
                fieldLabel="Hospital Name"
                placeholder="Hospital name"
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
                placeholder="Hospital email"
                control={form.control}
                required={true}
                type="email"
              />
              <InputField
                fieldName="country"
                fieldLabel="Country"
                placeholder="Country where the hospital is located"
                control={form.control}
                required={true}
              />
              <InputField
                fieldName="mobile"
                fieldLabel="Mobile"
                placeholder="What is your Hospital mobile?"
                control={form.control}
                required={true}
                type="number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Hospital Description <span className="text-rose-600">*</span>
              </label>
              <textarea
                {...form.register("description", { required: true })}
                placeholder="Hospital description"
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
              existingValue={hospital.banner || ""}
            />

            <div className="flex justify-end">
              {saving ? (
                <LoadingButton />
              ) : (
                <Button
                  className="text-white bg-violet-700"
                  size="sm"
                  type="submit"
                >
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
