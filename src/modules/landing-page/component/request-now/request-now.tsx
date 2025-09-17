"use client";

import {Control, Resolver, SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Building, CheckCircle, Mail, Phone, User} from "lucide-react";
import {useEffect, useState} from "react";
import {LoadingSpinner} from "@/modules/shared/components/loading-spinner";
import Image from "next/image";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/modules/ui/components/form";
import {Input} from "@/modules/ui/components/input";
import {Textarea} from "@/modules/ui/components/textarea";
import {Button} from "@/modules/ui/components/button";
// import { useCreateUserRequest } from "@/modules/backend/user-request/hooks/use-create-user-reques";

const schema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contact: z.string().min(10, "Contact number must be at least 10 digits"),
  designation: z.string().min(1, "Designation is required"),
  hospital: z.string().min(1, "Hospital/Organization is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

export const RequestNow = () => {
  // const { createUserRequest, userRequestLoading } = useCreateUserRequest();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<
      FormValues,
      FormValues,
      FormValues
    >,
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      contact: "",
      designation: "",
      hospital: "",
      message: "",
    },
  });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitStatus({ type: null, message: '' });
      
      // const result = await createUserRequest(values);
      
      if (true) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your request has been submitted successfully.'
        });
        form.reset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'Failed to submit request. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred while submitting your request. Please try again.'
      });
      console.error("",error)
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
    <section className="w-full min-h-screen bg-green-50">

      <div className="items-center justify-center w-full relative">
        <Image
          src={'/images/landing_page_slider/1 (5).jpg'}
          alt={'medijobs.lk'}
          width={1920}
          height={1080}
          className={'w-full h-64 object-cover'}
        />
        <div className="absolute inset-0 bg-black/20 z-0" />

      </div>

      <div className="w-full max-w-4xl mx-auto p-6 -mt-10 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Submit Your Request</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ready to advance your healthcare career? Fill out the form below and our team will connect you with the right opportunities.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                onSubmit as unknown as SubmitHandler<FormValues>,
              )}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control as unknown as Control<FormValues>}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        First Name *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Dev" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as unknown as Control<FormValues>}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Last Name *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Mark" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Number *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+94 77 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation/Position *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Doctor, Nurse, Pharmacist" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hospital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Current Hospital/Organization *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your workplace" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message/Additional Information *</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Tell us about your career goals, experience, or any specific requirements..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Status */}
              {submitStatus.type && (
                <div className={`p-4 rounded-md flex items-center gap-3 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {submitStatus.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="min-w-48 bg-[#007F4E] hover:bg-[#006A41] text-white"
                  size="lg"
                >
                  {/*{userRequestLoading ? (*/}
                  {/*  <span className="inline-flex items-center gap-2">*/}
                  {/*    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...*/}
                  {/*  </span>*/}
                  {/*) : (*/}
                  {/*  "Submit Request"*/}
                  {/*)}*/}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <Phone className="w-6 h-6 mx-auto mb-2 text-[#007F4E]" />
              <p className="font-medium">Call Us</p>
              <p className="text-sm text-gray-600">+94 777 21 31 32</p>
            </div>
            <div>
              <Mail className="w-6 h-6 mx-auto mb-2 text-[#007F4E]" />
              <p className="font-medium">Email Us</p>
              <p className="text-sm text-gray-600">medijobs.lk@gmail.com</p>
            </div>
            <div>
              <Building className="w-6 h-6 mx-auto mb-2 text-[#007F4E]" />
              <p className="font-medium">Visit Us</p>
              <p className="text-sm text-gray-600">No. 85, Sanasa Ideal Complex, Gampaha</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
