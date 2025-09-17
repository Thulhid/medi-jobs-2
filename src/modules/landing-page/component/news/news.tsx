"use client";

import React from 'react'
import Image from 'next/image'

const newsArticles = [
    {
        id: 1,
        title: "Sri Lanka Launches New Healthcare Initiative",
        description:
            "The Ministry of Health announced a nationwide healthcare program aimed at improving access to medical services in rural areas. The program will focus on providing modern facilities and better-trained staff.",
        image: "/images/news/healthcare-initiative.jpg",
        category: "Health",
    },
    {
        id: 2,
        title: "Colombo Medical Conference 2025 Announced",
        description:
            "The annual Colombo Medical Conference will bring together top medical professionals from around the world to share knowledge, research, and new technology in the healthcare sector.",
        image: "/images/news/medical-conference.jpg",
        category: "Events",
    },
    {
        id: 3,
        title: "Breakthrough in Cardiology Research",
        description:
            "Researchers at the National Hospital have reported a major breakthrough in cardiology treatments, potentially improving outcomes for patients with heart disease across the country.",
        image: "/images/news/cardiology-breakthrough.jpg",
        category: "Research",
    },
    {
        id: 4,
        title: "New Radiology Department Opens in Kandy",
        description:
            "Kandy Teaching Hospital has officially opened a state-of-the-art radiology department, equipped with the latest imaging technology to better diagnose and treat patients.",
        image: "/images/news/radiology-department.jpg",
        category: "Infrastructure",
    },
];

export const News = () => {
  return (
    <section className='w-full mb-4'>

      <div className="items-center justify-center w-full relative">
        <Image
          src={'/images/landing_page_slider/1 (4).jpg'}
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
                onClick={() => {}}
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
    </section>
  )
}
