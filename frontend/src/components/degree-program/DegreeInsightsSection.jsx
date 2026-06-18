const articles = [
  {
    title: "A Guide to Online Bachelor's Degrees",
    description:
      "Online bachelor's degrees have become increasingly popular, especially for students in need of greater flexibility. Learn more about this degree option and the many benefits it has to offer.",
    updated: "Last updated on March 9, 2025",
    meta: "Article",
  },
  {
    title: "A Guide to Online Master's Degrees",
    description:
      "Master's degrees come with many benefits, and now a growing number of students are opting to earn their master’s degree online.",
    updated: "Last updated on December 31, 2025",
    meta: "Article",
  },
  {
    title: "Should You Go Back to School? 7 Things to Consider",
    description:
      "Going back to school as an adult has the potential to boost your career possibilities and your income. Check out some questions to ask yourself as you figure out what's best for you.",
    updated: "Last updated on October 8, 2025",
    meta: "Article",
  },
  {
    title: "10 Surprising Benefits of Online Learning in 2026",
    description:
      "Interested in pursuing an online educational program? Find out about the specific benefits that come with pursuing an online education.",
    updated: "Last updated on November 15, 2025",
    meta: "Article · 6 min read",
  },
];

const ArticleCard = ({ article }) => {
  return (
    <div className="bg-white border border-[#e6ebf2] rounded-xl p-6 hover:shadow-md transition">
      <h3 className="text-[15px] font-semibold text-[#1f1f1f] mb-2 leading-snug">
        {article.title}
      </h3>

      <p className="text-sm text-gray-700 mb-6 leading-relaxed">
        {article.description}
      </p>

      <div className="text-xs text-gray-500 space-y-1">
        <p>{article.updated}</p>
        <p>{article.meta}</p>
      </div>
    </div>
  );
};

const DegreeInsightsSection = () => {
  return (
    <section className="py-14">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[26px] font-bold text-[#1f1f1f]">
            Gain helpful insight on degree-related topics
          </h2>

          <button className="text-sm font-medium text-red-600 hover:underline">
            Explore all articles
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DegreeInsightsSection;
