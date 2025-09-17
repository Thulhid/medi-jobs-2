"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateRecruiter } from "@/modules/backend/recruiter/hooks/use-create-recruiter";
import { useGetAllHospital } from "@/modules/backend/hospital/hooks/use-get-all-hospital";
import { useGetAllRecruiterType } from "@/modules/backend/recruiter-type/hooks/use-get-all-recruiter-type";
import { useGetAllUserRole } from "@/modules/backend/user-role/hooks/use-get-all-user-role";
import { Form } from "@/modules/ui/components/form";
import { InputField } from "@/modules/shared/components/input-field";
import { PasswordInput } from "@/modules/shared/components/password-input";
import { SelectOptionField } from "@/modules/shared/components/select-option-field";
import { Button } from "@/modules/ui/components/button";
import { LoadingButton } from "@/modules/shared/components/loading-button";
import { CustomTableBackHeader } from "@/modules/shared/components/custom-table-back-header";

const FormSchema = z
  .object({
    firstname: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastname: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please provide a valid email." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters." }),
    mobile: z
      .string()
      .min(7, { message: "Please provide a valid mobile number." }),
    recruiterTypeId: z.string().nonempty("Recruiter type is required"),
    hospitalId: z.string().nonempty("Hospital is required"),
    roleId: z.string().nonempty("Role is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const RecruiterAdd = () => {
  const router = useRouter();
  const { createRecruiter, recruiterLoading } = useCreateRecruiter();
  const { hospital, hospitalLoading, error: hospitalError } = useGetAllHospital();
  const { recruiterType, recruiterTypeLoading, error: recruiterTypeError } = useGetAllRecruiterType();
  const { userRole, userRoleLoading, error: userRoleError } = useGetAllUserRole();
  const [submitError, setSubmitError] = useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
      recruiterTypeId: "",
      hospitalId: "",
      roleId: "",
    },
  });

  const recruiterTypeId = form.watch("recruiterTypeId");

  const metaByTypeId = useMemo(() => {
    const selected = (recruiterType ?? []).find(
      (rt: { id: number; metaCode: string }) =>
        String(rt.id) === String(recruiterTypeId),
    );
    return selected?.metaCode || "";
  }, [recruiterTypeId, recruiterType]);

  useEffect(() => {
    if (!metaByTypeId) return;
    const matching = (userRole ?? []).find(
      (r: { id: number; metaCode: string }) =>
        String(r.metaCode) === String(metaByTypeId),
    );
    if (matching?.id)
      form.setValue("roleId", String(matching.id), { shouldValidate: true });
  }, [metaByTypeId, userRole, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setSubmitError("");
    
    // Validate that required data is loaded
    if (!hospital?.length) {
      setSubmitError("Hospital data not loaded. Please refresh the page.");
      toast.error("Hospital data not loaded. Please refresh the page.");
      return;
    }
    
    if (!recruiterType?.length) {
      setSubmitError("Recruiter type data not loaded. Please refresh the page.");
      toast.error("Recruiter type data not loaded. Please refresh the page.");
      return;
    }
    
    if (!userRole?.length) {
      setSubmitError("User role data not loaded. Please refresh the page.");
      toast.error("User role data not loaded. Please refresh the page.");
      return;
    }
    
    const created = await createRecruiter({
      id: "",
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      mobile: data.mobile,
      recruiterTypeId: data.recruiterTypeId,
      hospitalId: data.hospitalId,
      roleId: data.roleId,
    });
    
    if (created && (created as { error?: string }).error) {
      const errorMessage = (created as { error: string }).error;
      setSubmitError(errorMessage);
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (errorMessage.includes("email")) {
        form.setError("email", { 
          type: "manual", 
          message: "This email is already registered" 
        });
      }
    } else if (created) {
      toast.success("Recruiter created successfully!");
      router.push("/admin-dashboard/recruiters");
    }
  };

  // Show loading state while data is being fetched
  if (hospitalLoading || recruiterTypeLoading || userRoleLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <CustomTableBackHeader header="recruiters" link="true" />
          <h1 className="text-3xl font-bold text-black">ADD NEW RECRUITER</h1>
          <p className="text-gray-600">Create a new recruiter profile.</p>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007F4E] mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading required data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if data failed to load
  if (hospitalError || recruiterTypeError || userRoleError) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <CustomTableBackHeader header="recruiters" link="true" />
          <h1 className="text-3xl font-bold text-black">ADD NEW RECRUITER</h1>
          <p className="text-gray-600">Create a new recruiter profile.</p>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">
              Failed to load required data. Please refresh the page and try again.
            </p>
            <p className="text-red-500 text-sm mt-1">
              {hospitalError?.message || recruiterTypeError?.message || userRoleError?.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <CustomTableBackHeader header="recruiters" link="true" />
        <h1 className="text-3xl font-bold text-black">ADD NEW RECRUITER</h1>
        <p className="text-gray-600">Create a new recruiter profile.</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                fieldName="firstname"
                fieldLabel="First Name"
                placeholder="Enter first name"
                control={form.control}
                required={true}
              />
              <InputField
                fieldName="lastname"
                fieldLabel="Last Name"
                placeholder="Enter last name"
                control={form.control}
                required={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                fieldName="email"
                fieldLabel="Email"
                placeholder="Enter email address"
                control={form.control}
                required={true}
                type="email"
              />
              <PasswordInput
                name="password"
                label="Password"
                placeholder="Enter password"
                control={form.control}
                required={true}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter password"
                control={form.control}
                required={true}
              />
            </div>

            <div className="space-y-2">
              <InputField
                fieldName="mobile"
                fieldLabel="Mobile"
                placeholder="Enter mobile number"
                control={form.control}
                required={true}
                type="tel"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectOptionField
                fieldName="recruiterTypeId"
                fieldLabel="Recruiter Type"
                control={form.control}
                required={true}
                options={(recruiterType ?? []).map(
                  (rt: { id: number; name: string }) => ({
                    value: String(rt.id),
                    label: rt.name,
                  }),
                )}
                placeholder="Select Recruiter Type"
              />
              <SelectOptionField
                fieldName="hospitalId"
                fieldLabel="Hospital"
                control={form.control}
                required={true}
                options={(hospital ?? []).map(
                  (h: { id: number; name: string }) => ({
                    value: String(h.id),
                    label: h.name,
                  }),
                )}
                placeholder="Select Hospital"
              />
            </div>

          
            <input type="hidden" value={form.watch("roleId") || ""} readOnly />

           

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <div className="flex gap-3">
                <Link
                  href="/admin-dashboard/recruiters"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-[#1E4A28]  transition-colors"
                >
                  Cancel
                </Link>
                {recruiterLoading ? (
                  <LoadingButton />
                ) : (
                  <Button
                    className="text-white bg-[#007F4E] hover:bg-[#1E4A28] "
                    size="sm"
                    type="submit"
                  >
                    Add Recruiter
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
