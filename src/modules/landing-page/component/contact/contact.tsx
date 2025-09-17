"use client";

import { Control, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Mail, MapPin, Loader2} from "lucide-react";
import { FaFacebook, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/modules/shared/components/loading-spinner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/ui/components/form";
import { Input } from "@/modules/ui/components/input";
import { Textarea } from "@/modules/ui/components/textarea";
import { Button } from "@/modules/ui/components/button";

import Image from "next/image";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  organization: z.string().min(1, "Organization is required"),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof schema>;

export const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<
      FormValues,
      FormValues,
      FormValues
    >,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      organization: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      setSubmitStatus({ type: null, message: '' });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully.'
        });
        form.reset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please check your connection and try again.'
      });
      console.error("", error)
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen h-full bg-white">

      <div className="items-center justify-center w-full relative">
        <Image
          src={'/images/landing_page_slider/1 (4).jpg'}
          alt={'medijobs.lk'}
          width={1920}
          height={1080}
          className={'w-full h-64 object-cover '}
        />
        <div className="absolute inset-0 bg-black/50 z-0" />

      </div>

      <div className="w-full max-w-[1440px] mx-auto  z-10 p-4 ">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Contact Us</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Have questions, feedback, or need assistance? We&apos;re here to help!
            Whether you&apos;re a job seeker, or employer,
            our team is ready to support you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">

          <section className="lg:col-span-2 lg:order-2 order-1 bg-green-50">
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(
                    onSubmit as unknown as SubmitHandler<FormValues>,
                  )}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <FormField
                    control={form.control as unknown as Control<FormValues>}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as unknown as Control<FormValues>}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="hello@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+94 777 123 456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Hospital/Organization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            placeholder="Please describe your inquiry or message..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2 space-y-4">
                    {submitStatus.type && (
                      <div className={`p-4 rounded-md ${submitStatus.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {submitStatus.message}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="min-w-36 bg-[#007F4E] hover:bg-[#007F4E]"
                      >
                        {submitting ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="size-4 animate-spin" /> Sending...
                          </span>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </section>

          {/* Contact Details - Second on mobile, Left on desktop */}
          <section className="lg:col-span-1 lg:order-1 order-2 ">
            <div className="rounded-lg bg-card p-6 shadow-sm bg-green-50">
              <h2 className="text-lg font-medium mb-4">Get in touch</h2>

              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="size-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-muted-foreground">+94 777 21 31 32</div>
                    <div className="text-muted-foreground">+94 740 077 815</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="size-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground">
                      medijobs.lk@gmail.com
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <MapPin className="size-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-muted-foreground">
                      No. 85, Sanasa Ideal Complex, Bauddhaloka Mawatha, Gampaha.
                    </div>
                  </div>
                </li>
              </ul>

              <div className="mt-6">
                <div className="font-medium mb-2">Social</div>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/Medijobs.lk"
                    aria-label="Facebook"
                    className="inline-flex items-center justify-center size-9 rounded-md border hover:bg-accent transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook className="size-4 " />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/medijobs-lk/"
                    aria-label="LinkedIn"
                    className="inline-flex items-center justify-center size-9 rounded-md border hover:bg-accent transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin className="size-4 " />
                  </a>
                  <a
                    href="https://www.instagram.com/medijobs.lk/"
                    aria-label="Instagram"
                    className="inline-flex items-center justify-center size-9 rounded-md border hover:bg-accent transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="size-4 " />
                  </a>
                  <a
                    href="https://wa.me/94777312132"
                    aria-label="WhatsApp"
                    className="inline-flex items-center justify-center size-9 rounded-md border hover:bg-accent transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="size-4 " />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}