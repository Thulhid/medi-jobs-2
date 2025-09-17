"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/modules/ui/components/form";
import { InputField } from "@/modules/shared/components/input-field";
import { SecureLogobox } from "@/modules/shared/components/secure-logobox";
import { MarkdownEditorField } from "@/modules/shared/components/markdown-editor-field";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/ui/components/button";
import { useCreateNews } from "@/modules/backend/news/hooks/use-create-news";
import { CustomTableBackHeader } from "@/modules/shared/components/custom-table-back-header";

const AddNewsFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  image: z.string().nonempty("Please add a cover image"),
  description: z.string().min(10, {
    message: "Please add your news description here.",
  }),
  category: z.string().nonempty("Please select a category"),
});

export const AddNews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { createNews } = useCreateNews();

  const addNewsForm = useForm<z.infer<typeof AddNewsFormSchema>>({
    resolver: zodResolver(AddNewsFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      category: "",
    },
  });

  async function onSubmit(data: z.infer<typeof AddNewsFormSchema>) {
    try {
      setIsLoading(true);
      
      await createNews({
        title: data.title,
        description: data.description,
        image: data.image,
        category: data.category,
      });

      addNewsForm.reset();
      router.push("/admin-dashboard/news");
    } catch (error) {
      console.error("Error creating news:", error);
      alert("An error occurred while creating the news article. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <CustomTableBackHeader header="news" link="true" />

      <Form {...addNewsForm}>
        <form onSubmit={addNewsForm.handleSubmit(onSubmit)} className="w-full space-y-6">
          <InputField
            fieldName="title"
            fieldLabel="News Title"
            placeholder="Add your news title here"
            control={addNewsForm.control}
            required={true}
          />

          <SecureLogobox
            fieldName="image"
            fieldLabel="Cover Image"
            control={addNewsForm.control}
            required={true}
            setValue={addNewsForm.setValue}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003049]">
              Category <span className="text-rose-600">*</span>
            </label>
            <select
              {...addNewsForm.register("category")}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Category</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Technology">Technology</option>
              <option value="Research">Research</option>
              <option value="Employment">Employment</option>
              <option value="Education">Education</option>
              <option value="Policy">Policy</option>
            </select>
            {addNewsForm.formState.errors.category && (
              <p className="text-red-600 text-sm">
                {addNewsForm.formState.errors.category.message}
              </p>
            )}
          </div>

          <MarkdownEditorField
            fieldName="description"
            fieldLabel="Description"
            control={addNewsForm.control}
            required={true}
          />

          <div className="flex w-full items-center justify-end">
            <Button
              type="submit"
              className="text-white bg-green-500"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add News"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};