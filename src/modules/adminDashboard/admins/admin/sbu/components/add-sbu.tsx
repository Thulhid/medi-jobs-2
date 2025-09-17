"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/modules/ui/components/form";
import { InputField } from "@/modules/shared/components/input-field";
import { SelectOptionField } from "@/modules/shared/components/select-option-field";
import { Button } from "@/modules/ui/components/button";
import { LoadingButton } from "@/modules/shared/components/loading-button";
import { useCreateSbu } from "@/modules/backend/sbu/hooks/use-create-sbu";
import { useGetAllHospital } from "@/modules/backend/hospital/hooks/use-get-all-hospital";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "SBU name must be at least 2 characters." }),
  hospitalId: z.string().nonempty("Hospital is required"),
  city: z.string().min(2, { message: "City must be add." }),
});

export const SbuAdd = () => {
  const router = useRouter();
  const { createSbu, hospitalLoading } = useCreateSbu();
  const { hospital } = useGetAllHospital();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      hospitalId: "",
      city: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const created = await createSbu({
      name: data.name,
      hospitalId: data.hospitalId,
      city: data.city,
    });
    if (created) {
      router.push("/admin-dashboard/sbu");
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin-dashboard/sbu"
        className="text-sm text-[#007f4e] hover:underline inline-flex items-center gap-1"
      >
        ← BACK TO SBU
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add New SBU</h1>
        <p className="text-sm text-gray-600 mt-1">
          Create a new Strategic Business Unit
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InputField
              fieldName="name"
              fieldLabel="SBU Name"
              placeholder="SBU name"
              control={form.control}
              required={true}
            />

            <SelectOptionField
              fieldName="hospitalId"
              fieldLabel="Hospital"
              control={form.control}
              required={true}
              options={
                hospital?.map((h: { id: number; name: string }) => ({
                  value: String(h.id),
                  label: h.name,
                })) || []
              }
              placeholder="Select Hospital"
            />
            <InputField
              fieldName="city"
              fieldLabel="City"
              placeholder="City where the hospital is located"
              control={form.control}
              required={true}
            />
            
          </div>

          <div className="flex items-center justify-end w-full">
            {hospitalLoading ? (
              <LoadingButton />
            ) : (
              <Button
                className="text-white bg-[#007F4E]"
                size="sm"
                type="submit"
              >
                Add SBU
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
