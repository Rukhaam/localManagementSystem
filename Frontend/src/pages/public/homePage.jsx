import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchCategories,
  fetchActiveProviders,
  setSelectedCategory,
} from "../../redux/slices/exploreSlice";

export default function Home() {
  const dispatch = useDispatch();

  // Grab state directly from Redux
  const { categories, providers, selectedCategoryId, isLoading, error } =
    useSelector((state) => state.explore);

  // FAQ State
  const [activeFaq, setActiveFaq] = useState(null);

  // 1. Fetch data on mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchActiveProviders("")); // Fetch all providers initially
  }, [dispatch]);

  // 2. Handle Category Filter Click
  const handleCategoryClick = (categoryId) => {
    // If they click the already selected category, unselect it (show all)
    const newCategoryId = selectedCategoryId === categoryId ? "" : categoryId;
    dispatch(setSelectedCategory(newCategoryId));
    dispatch(fetchActiveProviders(newCategoryId));

    // Smooth scroll down to the providers section
    setTimeout(() => {
      document
        .getElementById("providers-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const faqs = [
    {
      q: "How do I book a service?",
      a: "Simply browse our categories, select a trusted professional, and pick a date that works for you!",
    },
    {
      q: "Are the service providers verified?",
      a: "Yes! Every provider goes through a strict manual approval process by our admin team before they can accept jobs.",
    },
    {
      q: "How do I pay?",
      a: "Currently, payments are handled directly with the provider after the job is completed to your satisfaction.",
    },
    {
      q: "Can I cancel a booking?",
      a: "Yes, you can cancel any booking request from your dashboard as long as the provider hasn't arrived yet.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      {/* Inline style for smooth Marquee animation */}
      {/* Inline style for smooth Left-to-Right Marquee animation */}
      <style>{`
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-reverse {
          display: flex;
          white-space: nowrap;
          animation: marquee-reverse 35s linear infinite;
        }
      `}</style>

      {/* ========================================== */}
      {/* 1. HERO SECTION                            */}
      {/* ========================================== */}
      <section className="bg-white border-b border-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Left: Text Content */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Expert services, <br className="hidden md:block" /> right at your
              doorstep.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0">
              From emergency plumbing to professional home painting. Connect
              with verified local professionals instantly and get the job done
              right.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() =>
                  document
                    .getElementById("providers-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
              >
                Find a Professional
              </button>
              <Link
                to="/register"
                className="bg-white text-gray-800 border-2 border-gray-200 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Become a Provider
              </Link>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="flex-1 w-full">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Professional cleaning service"
              className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      </section>


      <div className="relative bg-gray-900 overflow-hidden py-6 border-y border-gray-800 shadow-2xl">
        {/* Left and Right Gradient Fades for a seamless look */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max">
          <div className="animate-marquee-reverse flex items-center">
            {categories.length > 0 ? (
              [
                ...categories,
                ...categories,
                ...categories,
                ...categories,
                ...categories,
              ].map((cat, i) => (
                <div key={i} className="flex items-center mx-8 group">
                  {/* Lightning Bolt SVG */}
                  <svg
                    className="w-7 h-7 text-blue-500 mr-4 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
                  </svg>
                  <span className="text-gray-200 font-extrabold text-2xl uppercase tracking-widest group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                </div>
              ))
            ) : (
              // Fallback if categories are loading
              <div className="flex items-center mx-8">
                <span className="text-gray-400 font-bold text-xl uppercase tracking-widest">
                  LOADING SERVICES...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 w-full pb-20">
        {/* ========================================== */}
        {/* 3. VISUAL CATEGORIES GRID                  */}
        {/* ========================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Our Top Categories
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Select a service below to see our certified professionals.
            </p>
          </div>

          {isLoading && categories.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-blue-600 font-bold text-xl">
                Loading categories...
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`text-left group bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 ${
                    selectedCategoryId === category.id
                      ? "ring-4 ring-blue-500 border-transparent"
                      : "border-gray-100"
                  }`}
                >
                  <div className="h-48 w-full bg-gray-200 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img
                      src={`https://source.unsplash.com/600x400/?${category.name.replace(
                        " ",
                        ","
                      )},service`}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="mt-4 text-blue-600 font-semibold text-sm group-hover:text-blue-800 flex items-center gap-1">
                      {selectedCategoryId === category.id
                        ? "Currently Viewing"
                        : "View Providers"}{" "}
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ========================================== */}
        {/* 4. PROVIDER GRID SECTION                   */}
        {/* ========================================== */}
        <section
          id="providers-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-3xl shadow-sm border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">
              {selectedCategoryId
                ? "Filtered Providers"
                : "Top Rated Providers"}
            </h2>

            {/* Quick Pill Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryClick("")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors border ${
                  selectedCategoryId === ""
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors border ${
                    selectedCategoryId === cat.id
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-gray-100 rounded-xl h-48 border border-gray-200 animate-pulse"
                ></div>
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-gray-800">
                No providers found
              </h3>
              <p className="text-gray-500 mt-2">
                Try selecting a different category or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <div
                  key={provider.profile_id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-lg transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {provider.name}
                        </h3>
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          {provider.category_name}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Available
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                      {provider.bio}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Link
                      to={`/customer/provider/${provider.profile_id}`}
                      className="block w-full text-center bg-blue-50 text-blue-700 font-bold py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-colors border border-blue-100 hover:border-blue-600"
                    >
                      View Profile & Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ========================================== */}
      {/* 5. FAQ SECTION                             */}
      {/* ========================================== */}
      <section className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
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
                className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                  className="w-full text-left px-6 py-5 font-bold text-gray-800 flex justify-between items-center focus:outline-none"
                >
                  {faq.q}
                  <span
                    className={`text-blue-600 text-xl transition-transform ${
                      activeFaq === index ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-200 pt-4 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
