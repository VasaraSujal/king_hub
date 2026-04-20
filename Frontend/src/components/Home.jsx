import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";
import PopularLocalities from "./Location";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

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

  const handleOrderNow = () => {
    setLoading(true);
    setTimeout(() => navigate("/restaurants"), 600);
  };

  return (
    <div className="pt-20 text-slate-800">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-white to-blue-200/60" />
        <div className="relative container mx-auto px-6 pt-16 pb-14 md:pt-20 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
            <motion.div initial="hidden" animate="visible" variants={reveal} className="max-w-3xl">
              <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-4 py-1.5 text-sm font-semibold">
                Food delivery, simplified
              </span>
              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-tight text-slate-900">
                Delicious meals delivered with speed and consistency.
              </h1>
              <p className="mt-5 text-lg text-slate-600 max-w-2xl leading-relaxed">
                Discover trusted restaurants, order in a few taps, and get your food delivered hot and on time.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={handleOrderNow}
                  className="rounded-xl bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700"
                >
                  {loading ? "Opening..." : "Order Now"}
                </button>
                <button
                  onClick={() => navigate("/menu")}
                  className="rounded-xl border border-blue-200 bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Explore Menu
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="rounded-3xl overflow-hidden border border-blue-100 bg-white shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80"
                  alt="Delicious food platter"
                  className="w-full h-[280px] md:h-[420px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-14">
        <h2 className="text-3xl font-bold text-slate-900 text-center">Featured Restaurants</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item) => (
            <article key={item.name} className="surface-panel overflow-hidden">
              <img src={item.image} alt={item.name} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                <p className="mt-1 text-slate-600">{item.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-14">
        <div className="surface-panel p-7 md:p-10">
          <h2 className="text-3xl font-bold text-slate-900 text-center">Why Customers Trust King Hub</h2>
          <p className="mt-3 text-center text-slate-600 max-w-3xl mx-auto">
            We focus on dependable operations and a transparent ordering flow so users can order confidently any day.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustHighlights.map((item) => (
              <div key={item.title} className="rounded-xl border border-blue-100 bg-blue-50/40 p-5">
                <p className="text-2xl font-extrabold text-slate-900">{item.value}</p>
                <p className="mt-1 font-semibold text-blue-700">{item.title}</p>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-14">
        <div className="rounded-2xl border border-blue-100 bg-white p-7 md:p-10">
          <h2 className="text-3xl font-bold text-slate-900 text-center">How It Works</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-5">
            {steps.map((step, idx) => (
              <div key={step} className="rounded-xl bg-blue-50/50 border border-blue-100 p-5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="mt-3 font-semibold text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-14">
        <div className="grid lg:grid-cols-2 gap-6">
          <article className="surface-panel p-7">
            <h3 className="text-2xl font-bold text-slate-900">Service Coverage and Delivery Zones</h3>
            <p className="mt-3 text-slate-600 leading-relaxed">
              King Hub supports high-demand residential and commercial zones with optimized rider assignment. If a
              location falls outside a delivery radius, nearby alternatives are suggested automatically.
            </p>
            <p className="mt-3 text-slate-600 leading-relaxed">
              We continuously expand to new areas based on demand, partner availability, and fulfillment quality to
              maintain consistent delivery standards.
            </p>
          </article>
          <article className="surface-panel p-7">
            <h3 className="text-2xl font-bold text-slate-900">Order Safety and Quality Standards</h3>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Partner restaurants follow hygiene and packing guidelines for better food quality in transit. Orders are
              routed with minimal hand-off to reduce delays and maintain freshness.
            </p>
            <p className="mt-3 text-slate-600 leading-relaxed">
              In case of issue, users can raise support directly from order flow for faster and contextual resolution.
            </p>
          </article>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-14">
        <h2 className="text-3xl font-bold text-slate-900 text-center">Product Features</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {appFeatures.map((feature) => (
            <article key={feature.title} className="surface-panel p-6">
              <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-14">
        <h2 className="text-3xl font-bold text-slate-900 text-center">What Customers Say</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="surface-panel p-6">
              <p className="text-slate-600">"{item.text}"</p>
              <footer className="mt-4 text-sm font-semibold text-blue-700">{item.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <PopularLocalities />

      <section className="container mx-auto px-6 py-14">
        <h2 className="text-3xl font-bold text-slate-900 text-center">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="surface-panel overflow-hidden">
              <button
                onClick={() => setOpenFAQIndex(openFAQIndex === index ? null : index)}
                className="w-full px-5 py-4 text-left flex justify-between items-center"
              >
                <span className="font-semibold text-slate-800">{faq.question}</span>
                <span className="text-blue-700 text-lg">{openFAQIndex === index ? "-" : "+"}</span>
              </button>
              {openFAQIndex === index && (
                <div className="px-5 pb-5 text-slate-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
