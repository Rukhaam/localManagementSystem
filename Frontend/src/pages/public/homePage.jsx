import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Zap,
  ChevronDown,
  Search,
  Star,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  fetchCategories,
  fetchActiveProviders,
  setSelectedCategory,
} from "../../redux/slices/exploreSlice";

import { featuresData } from "../../utils/homeData";
import { faqs } from "../../utils/faqsData";

export default function Home() {
  const dispatch = useDispatch();

  const { categories, providers, selectedCategoryId, isLoading, error } =
    useSelector((state) => state.explore);

  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    if (providers.length === 0) {
      dispatch(fetchActiveProviders(""));
    }
  }, [dispatch, categories.length, providers.length]);

  const handleCategoryClick = (categoryId) => {
    const newCategoryId = selectedCategoryId === categoryId ? "" : categoryId;
    dispatch(setSelectedCategory(newCategoryId));

    setTimeout(() => {
      document
        .getElementById("providers-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const displayedProviders = selectedCategoryId
    ? providers.filter(
        (provider) => provider.category_id === selectedCategoryId
      )
    : providers;

  const marqueeItems = [
    ...categories,
    ...categories,
    ...categories,
    ...categories,
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] w-full font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. HERO SECTION                            */}
      <section className="relative overflow-hidden bg-white border-b border-gray-200 py-20 md:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="animate-fade-in-up opacity-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-8">
            <ShieldCheck size={16} />
            <span>Trusted by 10,000+ local residents</span>
          </div>

          <h1 className="animate-fade-in-up delay-100 opacity-0 text-5xl md:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight max-w-4xl">
            Expert local services, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              right at your doorstep.
            </span>
          </h1>

          <p className="animate-fade-in-up delay-200 opacity-0 mt-6 text-xl text-gray-500 max-w-2xl">
            From emergency plumbing to professional home cleaning. Connect with
            verified local professionals instantly and get the job done right.
          </p>

          <div className="animate-fade-in-up delay-300 opacity-0 mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() =>
                document
                  .getElementById("providers-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group flex items-center justify-center gap-2 bg-gray-900 text-white font-medium text-lg px-8 py-4 rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20"
            >
              <Search size={20} />
              Find a Professional
            </button>
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 font-medium text-lg px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              Become a Provider
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. PURE CSS MARQUEE                        */}
      {/* ========================================== */}
      <div className="relative bg-white overflow-hidden py-8 border-b border-gray-200 flex items-center">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
          {categories.length > 0 ? (
            marqueeItems.map((cat, i) => (
              <div
                key={i}
                className="flex items-center mx-6 group cursor-default"
              >
                <Zap className="w-5 h-5 text-gray-300 mr-3 group-hover:text-blue-500 transition-colors" />
                <span className="text-gray-400 font-bold text-xl uppercase tracking-widest group-hover:text-gray-900 transition-colors">
                  {cat.name}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center mx-8">
              <span className="text-gray-300 font-bold text-xl uppercase tracking-widest">
                LOADING SERVICES...
              </span>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 w-full pb-24">
        {/* ========================================== */}
        {/* 3. NEW: SLICK FEATURES GRID                */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Everything you need to get it done.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Powerful features designed to help you find, book, and manage
              local services smarter and faster. No clutter, just results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuresData.map((feature) => (
              <div
                key={feature.id}
                className="group bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-100 transition-all duration-300"
              >
                <div className="text-sm font-extrabold text-blue-600 mb-4 tracking-widest">
                  {feature.id}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* 4. VISUAL CATEGORIES GRID                  */}
        {/* ========================================== */}
        <section className="bg-white border-y border-gray-200 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                Explore Services
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Select a category below to filter our verified professionals.
              </p>
            </div>

            {isLoading && categories.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-gray-100 rounded-2xl h-64 animate-pulse border border-gray-200"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`text-left group relative bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                      selectedCategoryId === category.id
                        ? "ring-2 ring-blue-600 border-transparent shadow-md"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="h-40 w-full bg-gray-100 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img
                        src={
                          "https://img.freepik.com/premium-photo/male-hand-touching-service-concept_220873-7591.jpg"
                        }
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    {selectedCategoryId === category.id && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-blue-600 p-1.5 rounded-full shadow-sm">
                        <CheckCircle2 size={18} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================== */}
        {/* 5. PROVIDER GRID SECTION                   */}
        {/* ========================================== */}
        <section
          id="providers-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24"
        >
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {selectedCategoryId
                    ? "Filtered Professionals"
                    : "Top Rated Professionals"}
                </h2>
                <p className="text-gray-500 mt-2">
                  Hire highly-rated experts in your area.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryClick("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    selectedCategoryId === ""
                      ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      selectedCategoryId === cat.id
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {isLoading && providers.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-gray-50 rounded-2xl h-48 border border-gray-100 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : displayedProviders.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">
                  No professionals found
                </h3>
                <p className="text-gray-500 mt-1">
                  Try selecting a different category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProviders.map((provider) => (
                  <div
                    key={provider.profile_id}
                    className="group bg-white rounded-2xl border border-gray-200 p-6 flex flex-col hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {provider.name}
                          </h3>
                          <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1">
                            {provider.category_name}
                          </p>
                        </div>

                        {/* 🌟 ACTUAL DYNAMIC RATING LOGIC HERE */}
                        {/* 🌟 BULLETPROOF DYNAMIC RATING LOGIC */}
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-bold text-gray-700">
                            {/* Checks for both snake_case and camelCase, defaults to "New" if 0 */}
                            {provider.average_rating > 0 ||
                            provider.averageRating > 0
                              ? Number(
                                  provider.average_rating ||
                                    provider.averageRating
                                ).toFixed(1)
                              : "New"}
                          </span>

                          {(provider.total_reviews > 0 ||
                            provider.totalReviews > 0) && (
                            <span className="text-xs font-medium text-gray-400 ml-0.5">
                              ({provider.total_reviews || provider.totalReviews}
                              )
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {provider.bio ||
                          "No description provided. Ready to work!"}
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <Link
                        to={`/customer/provider/${provider.profile_id}`}
                        className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-900 hover:text-white transition-colors border border-gray-200 hover:border-gray-900"
                      >
                        View Profile
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 6. FAQ SECTION                             */}
      <section className="bg-white py-24 border-t border-gray-200 mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-lg">
              Everything you need to know about how LocalHub works.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                  activeFaq === index
                    ? "border-blue-200 bg-blue-50/50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                  className="w-full text-left px-6 py-6 font-semibold text-gray-900 flex justify-between items-center focus:outline-none"
                >
                  <span className="text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${
                      activeFaq === index ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    activeFaq === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
