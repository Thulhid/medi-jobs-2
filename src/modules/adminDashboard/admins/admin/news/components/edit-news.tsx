"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/modules/ui/components/form";
import { InputField } from "@/modules/shared/components/input-field";
import { SecureLogobox } from "@/modules/shared/components/secure-logobox";
import { MarkdownEditorField } from "@/modules/shared/components/markdown-editor-field";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/modules/ui/components/button";
import { useUpdateNews } from "@/modules/backend/news/hooks/use-update-news";
import { useGetNewsById } from "@/modules/backend/news/hooks/use-get-news-by-id";
import { CustomTableBackHeader } from "@/modules/shared/components/custom-table-back-header";
import { LoadingSpinner } from "@/modules/shared/components/loading-spinner";

const EditNewsFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  image: z.string().nonempty("Please add a cover image"),
  description: z.string().min(10, {
    message: "Please add your news description here.",
  }),
  category: z.string().nonempty("Please select a category"),
});

export const EditNews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;
  
  const { updateNews } = useUpdateNews();
  const { news, newsLoading } = useGetNewsById(newsId);

  const editNewsForm = useForm<z.infer<typeof EditNewsFormSchema>>({
    resolver: zodResolver(EditNewsFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      category: "",
    },
  });

  useEffect(() => {
    if (news) {
      editNewsForm.reset({
        title: news.title,
        description: news.description,
        image: news.image,
        category: news.category,
      });
    }
  }, [news, editNewsForm]);

  async function onSubmit(data: z.infer<typeof EditNewsFormSchema>) {
    try {
      setIsLoading(true);
      
      await updateNews(newsId, {
        title: data.title,
        description: data.description,
        image: data.image,
        category: data.category,
      });

      router.push("/admin-dashboard/news");
    } catch (error) {
      console.error("Error updating news:", error);
      alert("An error occurred while updating the news article. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  if (newsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <CustomTableBackHeader header="news" link="true" />

      <Form {...editNewsForm}>
        <form onSubmit={editNewsForm.handleSubmit(onSubmit)} className="w-full space-y-6">
          <InputField
            fieldName="title"
            fieldLabel="News Title"
            placeholder="Add your news title here"
            control={editNewsForm.control}
            required={true}
          />

          <SecureLogobox
            fieldName="image"
            fieldLabel="Cover Image"
            control={editNewsForm.control}
            required={true}
            setValue={editNewsForm.setValue}
            existingValue={news?.image}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#003049]">
              Category <span className="text-rose-600">*</span>
            </label>
            <select
              {...editNewsForm.register("category")}
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
            {editNewsForm.formState.errors.category && (
              <p className="text-red-600 text-sm">
                {editNewsForm.formState.errors.category.message}
              </p>
            )}
          </div>

          <MarkdownEditorField
            fieldName="description"
            fieldLabel="Description"
            control={editNewsForm.control}
            required={true}
          />

          <div className="flex w-full items-center justify-end">
            <Button
              type="submit"
              className="text-white bg-blue-500"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update News"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};