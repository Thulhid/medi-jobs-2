"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/modules/ui/components/form";
import { InputField } from "@/modules/shared/components/input-field";
import { Button } from "@/modules/ui/components/button";
import { LoadingButton } from "@/modules/shared/components/loading-button";
import { LoadingSpinner } from "@/modules/shared/components/loading-spinner";
import { useGetSbuById } from "@/modules/backend/sbu/hooks/use-gey-by-id-sbu";
import { useUpdateSbu } from "@/modules/backend/sbu/hooks/use-update-sbu";


const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "SBU name must be at least 2 characters." }),
});

export const SbuEdit = () => {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || "");
  const router = useRouter();

  const { sbu, sbuLoading } = useGetSbuById(id);
  const { updateSbu, sbuLoading: saving } = useUpdateSbu();
 

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (sbu) {
      form.reset({ name: sbu.name || "" });
    }
  }, [sbu, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!id) return;
    const updated = await updateSbu(id, { name: data.name, hospitalId: String(sbu?.hospitalId), city: sbu?.city || "" });
    if (updated) router.push("/admin-dashboard/sbu");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          href="/admin-dashboard/sbu"
          className="text-sm text-[#007f4e] hover:underline"
        >
          {`<`} BACK TO SBU
        </Link>
        <h1 className="text-3xl font-bold text-black">EDIT SBU</h1>
        <p className="text-gray-600">Update Strategic Business Unit details.</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        {sbuLoading ? (
          <LoadingSpinner />
        ) : !sbu ? (
          <div className="text-sm text-rose-600">SBU not found.</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <InputField
                  fieldName="name"
                  fieldLabel="SBU Name"
                  placeholder="Enter SBU name"
                  control={form.control}
                  required={true}
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <div className="flex gap-3">
                  <Link
                    href="/admin-dashboard/sbu"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  {saving ? (
                    <LoadingButton />
                  ) : (
                    <Button
                      className="text-white bg-[#007F4E]"
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
