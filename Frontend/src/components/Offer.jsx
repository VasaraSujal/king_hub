import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1200&q=80",
    title: "Delivery Offer",
    subtitle: "Up to 50% off",
    code: "WELCOME50",
  },
  {
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    title: "Weekend Deal",
    subtitle: "Flat 100 INR off",
    code: "WEEKEND100",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
    title: "New User Offer",
    subtitle: "Flat 200 INR off",
    code: "NEW200",
  },
];

const offers = [
  { title: "50% OFF up to 100 INR", desc: "Min order 700 INR", code: "WELCOME50" },
  { title: "Flat 150 INR OFF", desc: "Selected banks", code: "BANK150" },
  { title: "Late Night 60% OFF", desc: "11 PM to 5 AM", code: "NIGHT60" },
  { title: "Free Delivery Pass", desc: "Next 5 orders", code: "FREEDEL5" },
];

const restaurantDeals = [
  { restaurant: "Pizza Paradise", cuisine: "Italian", offer: "Buy 1 Get 1", code: "PIZZA2FOR1" },
  { restaurant: "Curry House", cuisine: "Indian", offer: "20% OFF combos", code: "FAMILY20" },
  { restaurant: "Sushi Spot", cuisine: "Japanese", offer: "Free roll over 800 INR", code: "SUSHIFREE" },
  { restaurant: "Dragon Wok", cuisine: "Chinese", offer: "Buy 2 Get 1", code: "DRAGON3FOR2" },
];

const paymentOffers = [
  {
    provider: "HDFC Cards",
    detail: "10% instant discount up to 150 INR",
    condition: "Min transaction 500 INR",
  },
  {
    provider: "ICICI Debit",
    detail: "5% cashback up to 200 INR",
    condition: "Min transaction 700 INR",
  },
  {
    provider: "UPI Wallets",
    detail: "Flat 75 INR cashback on selected days",
    condition: "Min transaction 300 INR",
  },
];

const usageGuides = [
  "Check validity window and minimum order value before applying any code.",
  "Partner-specific coupons work only on tagged restaurants.",
  "Bank offers are subject to issuer eligibility and may vary by card type.",
  "Cashback offers can appear post-settlement depending on partner policy.",
];

const faqs = [
  {
    question: "How do I redeem a promo code?",
    answer: "Apply the code at checkout. Valid codes are auto-calculated in your bill.",
  },
  {
    question: "Can I combine multiple offers?",
    answer: "Generally only one offer applies per order, unless explicitly stated.",
  },
  {
    question: "Do offers apply to all restaurants?",
    answer: "Some offers are global, others are partner-specific. Terms are shown on each card.",
  },
];

const OfferPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState("All");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const cuisines = useMemo(
    () => ["All", ...new Set(restaurantDeals.map((item) => item.cuisine))],
    []
  );

  const filteredDeals =
    selectedCuisineFilter === "All"
      ? restaurantDeals
      : restaurantDeals.filter((item) => item.cuisine === selectedCuisineFilter);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(`Subscribed: ${email}`);
    setEmail("");
  };

  return (
    <div className="pt-20 text-slate-800">
      <ToastContainer position="top-right" autoClose={2500} />

      <section className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-panel overflow-hidden"
        >
          <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="h-64 w-full object-cover" />
          <div className="p-7 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">{slides[currentSlide].title}</h1>
            <p className="mt-2 text-lg text-slate-600">{slides[currentSlide].subtitle}</p>
            <p className="mt-4 inline-flex rounded-full bg-blue-50 text-blue-700 px-4 py-1.5 font-semibold">
              Code: {slides[currentSlide].code}
            </p>
          </div>
        </motion.div>

        <div className="flex justify-center mt-4 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full ${currentSlide === index ? "bg-blue-700" : "bg-blue-200"}`}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-12">
        <h2 className="text-3xl font-bold text-slate-900 text-center">Available Offers</h2>
        <p className="mt-3 text-center text-slate-600 max-w-3xl mx-auto">
          Explore platform-wide promo codes for delivery savings, seasonal events, and category-based discount campaigns.
        </p>
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-5">
          {offers.map((offer) => (
            <article key={offer.code} className="surface-panel p-6">
              <h3 className="text-xl font-bold text-slate-900">{offer.title}</h3>
              <p className="mt-2 text-slate-600">{offer.desc}</p>
              <p className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {offer.code}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <h2 className="text-3xl font-bold text-slate-900">Restaurant Specials</h2>
          <div className="flex gap-2 flex-wrap">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisineFilter(cuisine)}
                className={`rounded-full px-4 py-2 text-sm font-semibold border ${
                  selectedCuisineFilter === cuisine
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-700 border-blue-200"
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDeals.map((deal) => (
            <article key={deal.code} className="surface-panel p-6">
              <p className="text-sm text-blue-700 font-semibold">{deal.cuisine}</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{deal.restaurant}</h3>
              <p className="text-slate-600 mt-2">{deal.offer}</p>
              <p className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {deal.code}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-12">
        <div className="surface-panel p-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center">Payment Partner Benefits</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {paymentOffers.map((offer) => (
              <article key={offer.provider} className="rounded-xl border border-blue-100 bg-blue-50/40 p-5">
                <h3 className="text-lg font-bold text-slate-900">{offer.provider}</h3>
                <p className="mt-2 text-slate-600">{offer.detail}</p>
                <p className="mt-2 text-sm font-medium text-blue-700">{offer.condition}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-12">
        <div className="surface-panel p-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center">Get New Offers First</h2>
          <p className="mt-2 text-center text-slate-600">Subscribe for weekly deal alerts.</p>
          <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-blue-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="rounded-xl bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center">FAQ</h2>
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
              {openFAQIndex === index && <div className="px-5 pb-5 text-slate-600">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <div className="surface-panel p-8">
          <h2 className="text-3xl font-bold text-slate-900">Offer Usage Notes</h2>
          <ul className="mt-5 space-y-3">
            {usageGuides.map((item) => (
              <li key={item} className="text-slate-600 flex items-start gap-3 leading-relaxed">
                <span className="mt-2 w-2 h-2 rounded-full bg-blue-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OfferPage;
