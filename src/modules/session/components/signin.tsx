"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/modules/shared/components/input-field";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SigninSchema } from "@/modules/session/schema/schema";
import { PasswordInput } from "@/modules/shared/components/password-input";
import { Button } from "@/modules/ui/components/button";
import { Form } from "@/modules/ui/components/form";
import { toast } from "sonner";

export const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, status } = useSession();

  const router = useRouter();

  const getRedirectPath = (roleMeta?: string) => {
    const role = roleMeta?.toUpperCase?.() ?? "";
    if (role.includes("RECRUITER")) return "/recruiter-dashboard";
    if (role.includes("SUPER") || role === "ADMIN" || role.includes("ADMIN"))
      return "/admin-dashboard";
    return "/admin-dashboard"; // default to admin
  };

  useEffect(() => {
    if (session?.user) {
      const role = session.user.role.metaCode;
      router.push(getRedirectPath(role));
    }
  }, [session, router]);

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = session.user.role.metaCode;
      router.push(getRedirectPath(role));
    }
  }, [session, status, router]);

  const onSubmit = async (data: z.infer<typeof SigninSchema>) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        if (res.error.includes('Hospital deactivated')) {
          toast.error("Hospital deactivated. Please contact system manager.", {
            style: {
              backgroundColor: "#ef4444",
              color: "#fff",
            },
          });
        } else {
          toast.error("Login failed. Please check your credentials.", {
            style: {
              backgroundColor: "#ef4444",
              color: "#fff",
            },
          });
        }
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        const role = session.user.role.metaCode;
        window.location.href = getRedirectPath(role);
      } else {

        window.location.href = "/admin-dashboard";
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.", {
        style: {
          backgroundColor: "#ef4444",
          color: "#fff",
        },
      });
      setIsLoading(false);
    }
  };

  return (
    <div className={"w-screen h-screen flex items-center justify-center"}>
      <div
        className={
          "hidden md:flex items-center justify-center h-screen relative w-3/5 "
        }
      >
        <Image
          src={"/images/session/banner.jpg"}
          alt={"trainee.lk banner"}
          width={1920}
          height={1080}
          className={"h-full w-full object-cover"}
        />
        <div
          className={
            "absolute top-0 right-0 bottom-0 left-0  bg-gradient-to-t from-black/90 to-transparent opacity-90"
          }
        />
        <div className={"absolute bottom-16 left-10 p-4  z-30"}>
          <div className={"mb-6"}>
            <h1 className={"text-7xl font-semibold mb-2 text-white"}>
              Be an Expert
            </h1>
            <p className={"text-sm font-normal w-full md:w-[60%] text-white"}>
              To be the leading career platform for healthcare professionals, connecting doctors, nurses, pharmacists, lab technicians, therapists, and medical staff with trusted institutions empowering careers and strengthening Sri Lanka’s healthcare sector.
            </p>
          </div>
        </div>
      </div>

      <div
        className={
          "p-6 flex flex-col items-center justify-center h-screen relative w-full md:w-2/5"
        }
      >
        <Image
          src={"/login-mobile.jpg"}
          alt={"trainee lk"}
          width={1080}
          height={1920}
          className={
            "md:hidden h-full w-full object-cover absolute z-0 inset-0 opacity-25"
          }
        />
        <div className={"absolute inset-0 bg-white/50 z-10"}></div>
        <div
          className={
            "w-full flex items-center justify-center mx-auto mb-10 z-10"
          }
        >
          <Image
            src={"/images/logo/logo.png"}
            alt={"medijobs.lk logo"}
            width={500}
            height={500}
            className={"w-96 h-auto object-cover"}
          />
        </div>
        <div className={"w-full md:w-2/3  flex flex-col items-start mb-8 z-10"}>
          <h2 className={"text-2xl md:text-4xl font-semibold"}>Sign in.</h2>
          <p className="text-sm md:text-lg">
            Enter your email and password to sign in!
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:w-2/3 space-y-6 z-10"
          >
            <div className={"grid grid-cols-1 w-full gap-4"}>
              <InputField
                fieldName={"email"}
                fieldLabel={"Email"}
                placeholder={"hospitalname@example.com"}
                control={form.control}
                required={true}
              />

              <PasswordInput
                name={"password"}
                label={"Password"}
                placeholder={"password"}
                control={form.control}
                required={true}
              />
            </div>

            <div className={" w-full"}>
              <Button
                className={
                  "cursor-pointer transition-all ease-in-out duration-300 bg-[#1e4a28] text-white hover:bg-[#007f4e]  capitalize text-sm w-full h-10  "
                }
                size={"sm"}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
