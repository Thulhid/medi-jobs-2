import Image from "next/image";
import Link from "next/link";

type NewsCardProps = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  createdAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const NewsCard = ({
  id,
  title,
  category,
  description,
  image,
  createdAt,
  onDelete,
}: NewsCardProps) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow cursor-pointer bg-white hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-52 group">
        <Link href={`/admin-dashboard/news/${id}`} className="block w-full h-full relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <Link
            href={`/admin-dashboard/news/${id}/edit`}
            className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-700"
            aria-label="Edit news article"
          >
            Edit
          </Link>
          <Link
            href={`/admin-dashboard/news/${id}`}
            className="bg-green-600 text-white px-3 py-1 rounded-full text-xs hover:bg-green-700"
            aria-label="View news article"
          >
            View
          </Link>
          <button
            onClick={onDelete}
            className="bg-red-600 text-white px-3 py-1 rounded-full text-xs hover:bg-red-700"
            aria-label="Delete news article"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {category}
          </span>
          <p className="text-sm text-gray-500">
            {new Date(createdAt).toDateString()}
          </p>
        </div>
        <Link
          href={`/admin-dashboard/news/${id}`}
          className="text-xl font-semibold text-gray-900 hover:text-green-800 transition-colors line-clamp-2"
        >
          {title}
        </Link>
        <p className="text-gray-700 text-sm mt-2 line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
};

export default NewsCard;