"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useGetNewsById } from "@/modules/backend/news/hooks/use-get-news-by-id";
import { LoadingSpinner } from "@/modules/shared/components/loading-spinner";
import { CustomTableBackHeader } from "@/modules/shared/components/custom-table-back-header";
import { Button } from "@/modules/ui/components/button";

export const ViewIndividualNews = () => {
    const params = useParams();
    const router = useRouter();
    const newsId = params.id as string;

    const { news, newsLoading } = useGetNewsById(newsId);

    if (newsLoading) {
        return <LoadingSpinner />;
    }

    if (!news) {
        return (
            <div className="space-y-6">
                <CustomTableBackHeader header="news" link="true" />
                <div className="text-center py-12">
                    <p className="text-gray-500">News article not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <CustomTableBackHeader header="news" link="true" />

            <div className="bg-white rounded-lg border overflow-hidden">
                {/* Header Image */}
                <div className="relative w-full h-64 md:h-80">
                    <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Category and Date */}
                    <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {news.category}
                        </span>
                        <p className="text-sm text-gray-500">
                            {new Date(news.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900">
                        {news.title}
                    </h1>

                    {/* Description */}
                    <div className="prose prose-neutral max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {news.description}
                        </ReactMarkdown>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t">
                        <Link href={`/admin-dashboard/news/${news.id}/edit`}>
                            <Button className="text-white bg-blue-500" size="sm">
                                Edit Article
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                        >
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};