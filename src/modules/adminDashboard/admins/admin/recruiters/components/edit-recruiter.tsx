"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/modules/ui/components/form";
import { InputField } from "@/modules/shared/components/input-field";
import { SelectOptionField } from "@/modules/shared/components/select-option-field";
import { Button } from "@/modules/ui/components/button";
import { LoadingButton } from "@/modules/shared/components/loading-button";
import { LoadingSpinner } from "@/modules/shared/components/loading-spinner";
import { useGetAllRecruiterType } from "@/modules/backend/recruiter-type/hooks/use-get-all-recruiter-type";
import { useUpdateRecruiter } from "@/modules/backend/recruiter/hooks/use-update-recruiter";
// Note: the hook name is misnamed in the file; alias it locally for clarity
import { useGetHospitalById as useGetRecruiterById } from "@/modules/backend/recruiter/hooks/use-get-by-id-recruiter";
import { CustomTableBackHeader } from "@/modules/shared/components/custom-table-back-header";

const FormSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please provide a valid email." }),
  mobile: z
    .string()
    .min(10, { message: "Please provide a valid mobile number." }),
  recruiterTypeId: z.string().nonempty("Recruiter type is required"),
});

export const RecruiterEdit = () => {
  const params = useParams<{ id: string }>();
  const id = String(params?.id) || "";
  const router = useRouter();

  const { recruiter, recruiterLoading } = useGetRecruiterById(id);
  const { updateRecruiter, recruiterLoading: saving } = useUpdateRecruiter();
  const { recruiterType } = useGetAllRecruiterType();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      recruiterTypeId: "",
    },
  });

  useEffect(() => {
    if (!recruiter) return;
    form.reset({
      firstname: recruiter.firstname || "",
      lastname: recruiter.lastname || "",
      email: recruiter.email || "",
      mobile: recruiter.mobile || "",
      recruiterTypeId: String(recruiter.recruiterTypeId) || "",
    });
  }, [recruiter, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!id) return;
    const updated = await updateRecruiter(id, {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      mobile: data.mobile,
      recruiterTypeId: data.recruiterTypeId,
    });
    if (updated) router.push("/admin-dashboard/recruiters");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <CustomTableBackHeader header="recruiters" link="true" />
        <h1 className="text-3xl font-bold text-black">EDIT RECRUITER</h1>
        <p className="text-gray-600">Update recruiter details.</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        {recruiterLoading ? (
          <LoadingSpinner />
        ) : !recruiter ? (
          <div className="text-sm text-rose-600">Recruiter not found.</div>
        ) : (
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
                  options={
                    recruiterType?.map((rt: { id: number; name: string }) => ({
                      value: String(rt.id),
                      label: rt.name,
                    })) || []
                  }
                  placeholder="Select Recruiter Type"
                />

                <div className="space-y-2">
                  <SelectOptionField
                    fieldName="hospital"
                    fieldLabel="Hospital"
                    control={form.control}
                    required={true}
                    options={
                      recruiter?.hospital?.name
                        ? [
                            {
                              value: recruiter.hospital.name,
                              label: recruiter.hospital.name,
                            },
                          ]
                        : []
                    }
                    placeholder="Select Hospital"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <div className="flex gap-3">
                  <Link
                    href="/admin-dashboard/recruiters"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  {saving ? (
                    <LoadingButton />
                  ) : (
                    <Button
                      className="text-white bg-green-500"
                      size="sm"
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};
