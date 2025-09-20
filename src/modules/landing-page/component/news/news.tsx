"use client";

import React from "react";
import Image from "next/image";

const newsArticles = [
  {
    id: 1,
    title: "WHO Academy online learning platform.",
    description: `
🌍 At the WHO Academy, we believe that access to high-quality lifelong learning opportunities should be universal — no matter where you live, or what language you speak.

📚 That’s why we’ve built an online learning platform that delivers personalized learning experiences tailored to each learner’s needs — helping you stay current, adapt to change and take courses grounded in the latest science.

The online learning platform offers:

🔹 Free courses developed by WHO experts and adult learning specialists.
🔹 A curated portfolio of more than 300 courses available across 12 languages.
🔹 Interactive and collaborative features to enhance engagement.
🔹 A strong focus on accessibility and inclusion.

🎉 Whether you're looking to deepen your expertise, grow your career or simply expand your knowledge, this platform is your gateway to lifelong learning in health]

Register for free and start your learning journey today ➡ <a href="https://whoacademy.org">whoacademy.org</a>
`,
    image: "/images/news/news1.jpg",
    category: "Health",
  },
  {
    id: 2,
    title: "සිසු හෙද පුහුණුවට බඳවා ගැනීමේ සම්මුඛ පරීක්ෂණ",
    description: `
සිසු හෙද පුහුණුවට බඳවා ගැනීමේ සම්මුඛ පරීක්ෂණ අද සහ හෙට පැවැත්වේ.

සිසු හෙද පුහුණුව සඳහා බඳවා ගැනීමේ සම්මුඛ පරීක්ෂණ කොළඹ, කළුතර, ගම්පහ සහ කෑගල්ල දිස්ත්‍රික්කවලට අදාළව අනිද්දා (20) සහ 21 දිනවල කොළඹ 10, සෞඛ්‍ය හා ජනමාධ්‍ය අමාත්‍යාංශයේ දී පැවැත්වේ.

මහනුවර, මාතලේ සහ නුවරඑළිය දිස්ත්‍රික්කවලට අදාළ සිසු හෙද පුහුණුව සඳහා බඳවා ගැනීමේ සම්මුඛ පරීක්ෂණ 2025/09/20 සහ 2025/09/21 දිනවල මහනුවර හෙද විදුහලේ දී පැවැත්වේ.

මෙම සම්මුඛ පරීක්ෂණවලට පැමිණිය යුතු වන්නේ සෞඛ්‍ය හා ජනමාධ්‍ය අමාත්‍යාංශය විසින් නිල වශයෙන් දැනුම් දුන් පුද්ගලයන් පමණක් බව සෞඛ්‍ය හා ජනමාධ්‍ය අමාත්‍යාංශය නිවේදනය කරයි.
`,
    image: "/images/news/news2.png",
    category: "Education",
  },
];

export const News = () => {
  return (
    <section className="w-full mb-4">
      <div className="items-center justify-center w-full relative">
        <Image
          src={"/images/landing_page_slider/1 (4).jpg"}
          alt={"medijobs.lk"}
          width={1920}
          height={1080}
          className={"w-full h-64 object-cover"}
        />
        <div className="absolute inset-0 bg-black/50 z-0" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white"></div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 mt-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">News</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div
                className="relative h-60 cursor-pointer group"
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
              <div className="p-4 h-60">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-6">
                  {article.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {newsArticles.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No News Articles
            </h3>
            <p className="text-gray-500">
              Check back later for the latest healthcare news.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
