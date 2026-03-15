import { useEffect, useState, useRef } from "react";
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
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchCategories,
  fetchActiveProviders,
  setSelectedCategory,
} from "../../redux/slices/exploreSlice";

import { featuresData, getCategoryImage } from "../../utils/homeData";
import { faqs } from "../../utils/faqsData";
import AsyncSelect from "react-select/async";
import { getCategoryIcon } from "../../utils/marqueeData.jsx";
let searchTimeout;

export default function Home() {
  const dispatch = useDispatch();
  const sliderRef = useRef(null);

  const {
    categories,
    providers,
    pagination,
    selectedCategoryId,
    isLoading,
    error,
  } = useSelector((state) => state.explore);

  const [activeFaq, setActiveFaq] = useState(null);
  const [searchArea, setSearchArea] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }

    if (providers.length === 0 && !selectedCategoryId && !searchArea) {
      dispatch(fetchActiveProviders({ page: 1 }));
    }
  }, [
    dispatch,
    categories.length,
    providers.length,
    selectedCategoryId,
    searchArea,
  ]);

  const handleSliderScroll = () => {
    if (!sliderRef.current) return;
    const scrollPosition = sliderRef.current.scrollLeft;
    const itemWidth = sliderRef.current.firstChild.offsetWidth + 24;
    const newIndex = Math.round(scrollPosition / itemWidth);
    setActiveSlideIndex(newIndex);
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const itemWidth = sliderRef.current.firstChild.offsetWidth + 24;
      sliderRef.current.scrollBy({
        left: direction * itemWidth,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryClick = (categoryId) => {
    const newCategoryId = selectedCategoryId === categoryId ? "" : categoryId;
    dispatch(setSelectedCategory(newCategoryId));

    setCurrentPage(1);

    dispatch(
      fetchActiveProviders({
        categoryId: newCategoryId,
        serviceArea: searchArea,
        page: 1,
      })
    );

    setTimeout(() => {
      document
        .getElementById("providers-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);

    dispatch(
      fetchActiveProviders({
        categoryId: selectedCategoryId,
        serviceArea: searchArea,
        page: 1,
      })
    );

    document
      .getElementById("providers-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    dispatch(
      fetchActiveProviders({
        categoryId: selectedCategoryId,
        serviceArea: searchArea,
        page: newPage,
      })
    );

    document
      .getElementById("providers-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const marqueeItems = [
    ...categories,
    ...categories,
    ...categories,
    ...categories,
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] w-full font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. HERO SECTION */}
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

          <div className="animate-fade-in-up delay-300 opacity-0 mt-10 w-full max-w-2xl">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center w-full shadow-xl shadow-gray-900/5 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 transition-colors focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20"
            >
              <div className="pl-6 pr-1 text-blue-600">
                <MapPin size={24} />
              </div>

              <div className="flex-1">
                <AsyncSelect
                  cacheOptions
                  loadOptions={(inputValue) => {
                    return new Promise((resolve) => {
                      if (!inputValue || inputValue.length < 3)
                        return resolve([]);

                      clearTimeout(searchTimeout);

                      const GEOAPIFY_API_KEY = import.meta.env
                        .VITE_GEOAPIFY_API_KEY;

                      searchTimeout = setTimeout(async () => {
                        try {
                          const res = await fetch(
                            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(inputValue)}&type=city&filter=countrycode:in&format=json&apiKey=${GEOAPIFY_API_KEY}`
                          );
                          const data = await res.json();
                          if (data.results) {
                            const options = data.results.map((place) => ({
                              label: place.state
                                ? `${place.city}, ${place.state}`
                                : place.city,
                              value: place.city,
                            }));

                            const uniqueOptions = Array.from(
                              new Set(options.map((a) => a.value))
                            )
                              .map((value) =>
                                options.find((a) => a.value === value)
                              )
                              .filter((opt) => opt.value);

                            resolve(uniqueOptions);
                          } else {
                            resolve([]);
                          }
                        } catch (err) {
                          resolve([]);
                        }
                      }, 400);
                    });
                  }}
                  onChange={(option) =>
                    setSearchArea(option ? option.value : "")
                  }
                  placeholder="Search by city or area..."
                  noOptionsMessage={() => "Type a city name..."}
                  isClearable
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: "none",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      cursor: "text",
                      minHeight: "60px",
                    }),
                    input: (provided) => ({
                      ...provided,

                      fontSize: "1.125rem",
                      fontWeight: "500",
                      color: "#111827",
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      fontSize: "1.125rem",
                      color: "#9ca3af",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: "1rem",
                      overflow: "hidden",
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      marginTop: "8px",
                      zIndex: 50,
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused ? "#eff6ff" : "white",
                      color: "#111827",
                      padding: "12px 16px",
                      cursor: "pointer",
                    }),
                  }}
                />
              </div>

              <button
                type="submit"
                className=" h-[52px] w-[20px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 transition-colors md:h-[52px] md:w-[100px] flex items-center justify-center md:m-1.5 rounded-xl shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. PURE CSS MARQUEE WITH DYNAMIC SVGS */}
      <div className="relative bg-white overflow-hidden py-10 border-b border-gray-200 flex items-center">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max animate-scroll hover:[animation-play-state:paused] py-2">
          {categories.length > 0 ? (
            marqueeItems.map((cat, i) => (
              <button
                key={i}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center justify-center mx-8 md:mx-12 group cursor-pointer focus:outline-none"
              >
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-lg transition-all duration-300 mb-3">
                  {getCategoryIcon(cat.name)}
                </div>
                <span className="text-gray-500 font-bold text-xs md:text-sm uppercase tracking-widest group-hover:text-gray-900 transition-colors">
                  {cat.name}
                </span>
              </button>
            ))
          ) : (
            <div className="flex items-center mx-8">
              <span className="text-gray-300 font-bold text-xl uppercase tracking-widest animate-pulse">
                LOADING SERVICES...
              </span>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 w-full pb-24">
        {/* 3. SLICK FEATURES GRID */}
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

        {/* 4. VISUAL CATEGORIES SLIDER W/ ARROWS & DOTS */}
        <section className="bg-gray-50 border-y border-gray-200 py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                  Explore Services
                </h2>
                <p className="text-gray-500 text-lg">
                  Swipe or use arrows to select a category and filter our
                  verified professionals.
                </p>
              </div>

              {/* 🌟 Desktop Arrow Buttons */}
              <div className="hidden md:flex gap-3">
                <button
                  onClick={() => scrollSlider(-1)}
                  className="p-4 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => scrollSlider(1)}
                  className="p-4 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* The Horizontal Scrolling Slider */}
            <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
              {/* CSS classes applied to hide scrollbar while keeping scroll functionality */}
              <div
                ref={sliderRef}
                onScroll={handleSliderScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
              >
                {isLoading && categories.length === 0
                  ? /* Loading Skeletons for Slider */
                    [1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="min-w-[280px] sm:min-w-[320px] h-[400px] shrink-0 snap-start bg-gray-200 rounded-3xl animate-pulse"
                      ></div>
                    ))
                  : /* Actual Category Cards */
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`text-left group relative min-w-[280px] sm:min-w-[320px] h-[400px] shrink-0 snap-start rounded-3xl overflow-hidden focus:outline-none transition-all duration-300 ${
                          selectedCategoryId === category.id
                            ? "ring-4 ring-blue-600 ring-offset-4 ring-offset-gray-50 scale-[1.02] shadow-2xl"
                            : "hover:shadow-2xl hover:-translate-y-2 shadow-md border border-gray-200/50"
                        }`}
                      >
                        {/* Dynamic Background Image */}
                        <img
                          src={getCategoryImage(category.name)}
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />

                        {/* Dark Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Card Content (Bottom Aligned) */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                          <h3 className="text-2xl font-extrabold text-white mb-2 group-hover:text-blue-300 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-200 text-sm line-clamp-2 font-medium leading-relaxed">
                            {category.description}
                          </p>
                        </div>

                        {/* Selected State Indicator */}
                        {selectedCategoryId === category.id && (
                          <div className="absolute top-6 right-6 bg-blue-600 text-white p-2 rounded-full shadow-lg animate-fade-in-up">
                            <CheckCircle2 size={24} />
                          </div>
                        )}
                      </button>
                    ))}

                {/* Spacer block to ensure the last item can scroll fully into view */}
                <div className="min-w-[1px] shrink-0"></div>
              </div>

              {/* 🌟 The Dotted Bar (Pagination Indicators) */}
              {!isLoading && categories.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {categories.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                        activeSlideIndex === index
                          ? "w-8 bg-blue-600"
                          : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. PROVIDER GRID SECTION */}
        <section
          id="providers-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24"
        >
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {selectedCategoryId || searchArea
                    ? "Filtered Professionals"
                    : "Top Rated Professionals"}
                </h2>
                <p className="text-gray-500 mt-2">
                  {searchArea
                    ? `Showing results for "${searchArea}"`
                    : "Hire highly-rated experts in your area."}
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

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-gray-50 rounded-2xl h-48 border border-gray-100 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : providers.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">
                  No professionals found
                </h3>
                <p className="text-gray-500 mt-1">
                  {searchArea
                    ? `We couldn't find anyone serving "${searchArea}". Try clearing the search.`
                    : "Try selecting a different category."}
                </p>

                {searchArea && (
                  <button
                    onClick={() => {
                      setSearchArea("");
                      setCurrentPage(1);
                      dispatch(
                        fetchActiveProviders({
                          categoryId: selectedCategoryId,
                          serviceArea: "",
                          page: 1,
                        })
                      );
                    }}
                    className="mt-4 px-6 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider) => (
                  <div
                    key={provider.profile_id}
                    className="group bg-white rounded-2xl border border-gray-200 p-6 flex flex-col hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
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

                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-bold text-gray-700">
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

                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {provider.bio ||
                          "No description provided. Ready to work!"}
                      </p>

                      {provider.service_area && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 w-fit px-2.5 py-1 rounded-md border border-gray-100">
                          <MapPin size={12} className="text-blue-500" />
                          Serves: {provider.service_area}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 z-10">
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

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 border-t border-gray-100 pt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
                >
                  Previous
                </button>
                <span className="text-sm font-semibold text-gray-500">
                  Page{" "}
                  <span className="text-gray-900">
                    {pagination.currentPage}
                  </span>{" "}
                  of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 6. FAQ SECTION */}
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
