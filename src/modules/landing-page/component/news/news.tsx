"use client";

import React, {useEffect, useState} from 'react'
import Image from 'next/image'
import {ChevronLeft, ChevronRight, X} from 'lucide-react'
import {LoadingSpinner} from "@/modules/shared/components/loading-spinner";
import {useGetAllNews} from "@/modules/backend/news/hooks/use-get-all-news";


export const News = () => {
  const { news: newsData, newsLoading: dataLoading } = useGetAllNews();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Convert database news to display format and extract images
  const newsArticles = newsData || [];
  const images = newsArticles.map(article => article.image);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const openImageModal = (imageSrc: string) => {
    const index = images.indexOf(imageSrc);
    setCurrentImageIndex(index);
    setSelectedImage(imageSrc);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const goToPreviousImage = () => {
    const prevIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  const goToNextImage = () => {
    const nextIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImage) {
        if (e.key === 'ArrowLeft') {
          goToPreviousImage();
        } else if (e.key === 'ArrowRight') {
          goToNextImage();
        } else if (e.key === 'Escape') {
          closeImageModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, currentImageIndex]);


  if (loading || dataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className='w-full mb-4'>

      <div className="items-center justify-center w-full relative">
        <Image
          src={'/images/landing-page-slider/image1.jpg'}
          alt={'medijobs.lk'}
          width={1920}
          height={1080}
          className={'w-full h-64 object-cover'}
        />
        <div className="absolute inset-0 bg-black/50 z-0" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 mt-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">News</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div
                className="relative h-48 cursor-pointer group"
                onClick={() => openImageModal(article.image)}
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {article.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {newsArticles.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No News Articles</h3>
            <p className="text-gray-500">Check back later for the latest healthcare news.</p>
          </div>
        )}
      </div>


      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>

            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={goToPreviousImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 p-2 hover:bg-black/30 rounded-full"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={goToNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 p-2 hover:bg-black/30 rounded-full"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="relative max-h-full max-w-full">
              <Image
                src={selectedImage}
                alt={`Gallery image ${currentImageIndex + 1} of ${images.length}`}
                width={1200}
                height={800}
                className="object-cover max-h-[90vh] w-full h-full"
                priority
              />
            </div>

            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setSelectedImage(images[index]);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
