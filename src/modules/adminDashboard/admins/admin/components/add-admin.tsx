"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAdmin } from "@/modules/backend/admin/hooks/use-create-admin";
import { Form } from "@/modules/ui/components/form";
import { InputField } from "@/modules/shared/components/input-field";
import { PasswordInput } from "@/modules/shared/components/password-input";
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
    mobile: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const AddAdmin = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role?.metaCode?.toUpperCase?.();
  const isSuper = (role || "").includes("SUPER");

  useEffect(() => {
    if (status === "authenticated" && !isSuper) {
      router.replace("/admin-dashboard/admins");
    }
  }, [status, isSuper, router]);

  const { createAdmin, loading } = useCreateAdmin();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
    },
  });

  if (status === "loading")
    return <div className="p-4 text-sm text-gray-500">Loading...</div>;
  if (!isSuper)
    return <div className="p-4 text-sm text-rose-600">Unauthorized</div>;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await createAdmin({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      mobile: data.mobile,
    });
    router.push("/admin-dashboard/admins");
  };

  return (
    <div className="space-y-4">
      <CustomTableBackHeader header="admins" link="true" />
      <div>
        <h1 className="text-2xl font-semibold ">Add User</h1>
        <p className="text-gray-600">Create a new admin user.</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded border p-4 grid md:grid-cols-2 gap-4"
        >
          <InputField
            fieldName="firstname"
            fieldLabel="First Name"
            placeholder="First name"
            control={form.control}
            required={true}
          />
          <InputField
            fieldName="lastname"
            fieldLabel="Last Name"
            placeholder="Last name"
            control={form.control}
            required={true}
          />
          <div className="md:col-span-2">
            <InputField
              fieldName="email"
              fieldLabel="Email"
              placeholder="Email"
              control={form.control}
              required={true}
              type="email"
            />
          </div>
          <div className="md:col-span-2">
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Password"
              control={form.control}
              required={true}
            />
          </div>
          <div className="md:col-span-2">
            <PasswordInput
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter password"
              control={form.control}
              required={true}
            />
          </div>
          <div className="md:col-span-2">
            <InputField
              fieldName="mobile"
              fieldLabel="Mobile"
              placeholder="Mobile"
              control={form.control}
              required={false}
              type="tel"
            />
          </div>
          <div className="md:col-span-2 flex items-end justify-end gap-3">
            {loading ? (
              <LoadingButton text="Creating..." />
            ) : (
              <Button type="submit" variant="outline">
                Create Admin
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin-dashboard/admins")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
