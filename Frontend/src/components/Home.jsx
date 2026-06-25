import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PopularLocalities from "./Location";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  const highlights = [
    { label: "Delivery in", value: "30 mins" },
    { label: "Rated", value: "4.8/5" },
    { label: "Active partners", value: "500+" },
  ];

  const featured = [
    {
      name: "Burger King",
      meta: "Fast Food • 130 INR • 4.5",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Pizza Hut",
      meta: "Italian • 140 INR • 4.7",
      image:
        "https://images.unsplash.com/photo-1548365328-9f547fb0953f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Sushi House",
      meta: "Japanese • 150 INR • 4.8",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const trustHighlights = [
    { title: "On-time Delivery", value: "96%", detail: "Average delivery ETA met across key zones" },
    { title: "Repeat Customers", value: "68%", detail: "Users who place more than 3 orders monthly" },
    { title: "Partner Restaurants", value: "500+", detail: "Verified kitchens and top-rated outlets" },
    { title: "Support Response", value: "<5 min", detail: "Median first response on live support" },
  ];

  const appFeatures = [
    {
      title: "Smart Restaurant Discovery",
      description:
        "Find relevant options quickly with cuisine filters, ratings, and location-based suggestions.",
    },
    {
      title: "Transparent Billing",
      description:
        "Clear pricing with subtotal, delivery fee, taxes, and offers shown before payment.",
    },
    {
      title: "Reliable Delivery Tracking",
      description:
        "Track every order stage from kitchen confirmation to rider dispatch and doorstep delivery.",
    },
  ];

  const steps = [
    "Choose your restaurant",
    "Add favorite items",
    "Checkout securely",
    "Track and enjoy delivery",
  ];

  const testimonials = [
    {
      name: "Aarav",
      text: "Smooth ordering, fast delivery, and food quality is always reliable.",
    },
    {
      name: "Nisha",
      text: "The interface is clean and I can reorder in seconds.",
    },
    {
      name: "Rohit",
      text: "Best local delivery experience I have used so far.",
    },
  ];

  const supportPills = [
    { value: "24/7", label: "Support" },
    { value: "30 min", label: "ETA" },
    { value: "Fresh", label: "Packing" },
  ];

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse restaurants, add items to your cart, and complete checkout. We will handle the rest.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "All major cards, UPI, and cash on delivery are supported.",
    },
    {
      question: "Can I track my order?",
      answer: "Yes, live order status is available once your order is confirmed.",
    },
    {
      question: "Do you have vegetarian options?",
      answer:
        "Yes, partner restaurants include a wide selection of vegetarian dishes.",
    },
  ];

  const featuredFallback = (name) =>
    `https://via.placeholder.com/600x450?text=${encodeURIComponent(name || "Restaurant")}`;

  const handleOrderNow = () => {
    setLoading(true);
    setTimeout(() => navigate("/restaurants"), 600);
  };

  return (
    <div className="pt-20 text-slate-800">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_30%),linear-gradient(180deg,_#f8fbff,_#ffffff)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-14 md:pt-16 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div initial="hidden" animate="visible" variants={reveal} className="lg:col-span-7 max-w-3xl">
              <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-1.5 text-sm font-semibold shadow-sm">
                Premium food delivery, reimagined
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-950">
                Faster ordering. Cleaner decisions. Better meals.
              </h1>
              <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-2xl">
                Discover trusted restaurants, save favorites, and check out with a layout that feels calm, polished,
                and built for real ordering.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={handleOrderNow}
                  className="rounded-full bg-slate-950 text-white px-6 py-3.5 font-semibold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {loading ? "Opening..." : "Browse Restaurants"}
                </button>
                <button
                  onClick={() => navigate("/menu")}
                  className="rounded-full border border-blue-200 bg-white px-6 py-3.5 font-semibold text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-xl">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/85 border border-blue-100 px-4 py-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">{item.label}</p>
                    <p className="mt-1 text-lg sm:text-xl font-extrabold text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-blue-200/60 via-transparent to-cyan-200/40 blur-2xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80"
                    alt="Delicious food platter"
                    className="w-full h-[300px] sm:h-[380px] object-cover"
                  />
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-slate-950/85 text-white backdrop-blur-md p-4 sm:p-5 shadow-xl">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-blue-200 font-semibold">Today’s top pick</p>
                        <h2 className="text-xl sm:text-2xl font-bold">Fresh delivery, every time</h2>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="text-xs text-slate-300">Average delivery</p>
                        <p className="text-lg font-bold">30 min</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
        <div className="surface-panel p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Why people choose us</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950">Designed for clear ordering, not clutter.</h2>
            </div>
            <p className="text-slate-600 max-w-2xl md:text-right leading-relaxed">
              Each section is spaced to breathe, cards are aligned consistently, and the content stays focused on what
              users actually need when deciding where to order.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {appFeatures.map((feature, index) => (
              <article key={feature.title} className="rounded-2xl border border-blue-100 bg-white p-5 md:p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    0{index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-950">{feature.title}</h3>
                </div>
                <p className="mt-4 text-slate-600 leading-relaxed">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <article className="surface-panel p-6 md:p-8 h-full flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Featured kitchens</p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950">Best-rated restaurants right now</h2>
              </div>
              <button
                onClick={() => navigate("/restaurants")}
                className="hidden sm:inline-flex rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 items-stretch">
              {featured.map((item) => (
                <article key={item.name} className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-[4/3] w-full object-cover"
                    onError={(event) => {
                      const fallbackSrc = featuredFallback(item.name);
                      if (event.currentTarget.src !== fallbackSrc) {
                        event.currentTarget.src = fallbackSrc;
                      }
                    }}
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-lg font-bold text-slate-950">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">{item.meta}</p>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="surface-panel p-6 md:p-8 h-full flex flex-col">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Delivery promise</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950">Reliable service built into every order</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 flex-1 content-start">
              {trustHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 min-h-[160px] flex flex-col justify-between">
                  <p className="text-2xl font-extrabold text-slate-950">{item.value}</p>
                  <p className="mt-1 font-semibold text-blue-700">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
        <div className="surface-panel p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">How it works</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950">Simple steps, cleaner alignment.</h2>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, idx) => (
              <div key={step} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="mt-4 font-semibold text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <article className="surface-panel p-6 md:p-8 h-full flex flex-col">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Delivery confidence</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">Coverage and safety standards</h3>
            <p className="mt-4 text-slate-600 leading-relaxed">
              King Hub supports high-demand residential and commercial zones with optimized rider assignment. Orders
              are routed with minimal hand-off to reduce delays and maintain freshness.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {supportPills.map((pill) => (
                <div key={pill.label} className="rounded-2xl border border-blue-100 bg-blue-50/40 px-4 py-4 text-center">
                  <p className="text-lg font-extrabold text-slate-950">{pill.value}</p>
                  <p className="mt-1 text-sm font-semibold text-blue-700">{pill.label}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-panel p-6 md:p-8 h-full flex flex-col">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Customer voice</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">What customers say</h3>
            <div className="mt-5 space-y-4 flex-1">
              {testimonials.map((item) => (
                <blockquote key={item.name} className="rounded-2xl border border-blue-100 bg-white p-4">
                  <p className="text-slate-600 leading-relaxed">“{item.text}”</p>
                  <footer className="mt-3 text-sm font-semibold text-blue-700">{item.name}</footer>
                </blockquote>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
        <div className="surface-panel p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Popular localities</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950">Top pickup and delivery zones</h2>
            </div>
            <p className="text-slate-600 max-w-xl leading-relaxed">
              This block is unique to the homepage, so users see the delivery footprint before exploring other routes.
            </p>
          </div>
          <div className="mt-6">
            <PopularLocalities />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12 pb-14">
        <div className="surface-panel p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Frequently asked questions</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950">Everything you need to know</h2>
            </div>
          </div>
          <div className="mt-6 space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="overflow-hidden rounded-2xl border border-blue-100 bg-white">
                <button
                  onClick={() => setOpenFAQIndex(openFAQIndex === index ? null : index)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center cursor-pointer"
                >
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  <span className="text-blue-700 text-lg">{openFAQIndex === index ? "-" : "+"}</span>
                </button>
                {openFAQIndex === index && <div className="px-5 pb-5 text-slate-600 leading-relaxed">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
