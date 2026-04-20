import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer.jsx";

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const faqData = [
  {
    question: "What are the working hours?",
    answer:
      "Choose flexible slots including mornings, evenings, and weekends depending on availability.",
  },
  {
    question: "Do I need my own vehicle?",
    answer: "Yes, a personal vehicle and valid driving license are required.",
  },
  {
    question: "How much can I earn?",
    answer: "Earnings are based on deliveries completed and performance incentives.",
  },
];

function Hier() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    vehicleType: "",
    licenseNumber: "",
    experience: "",
  });

  const [openFAQ, setOpenFAQ] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("https://king-hub-1.onrender.com/api/hier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Application submitted successfully!");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          vehicleType: "",
          licenseNumber: "",
          experience: "",
        });
      } else {
        toast.error(data.error || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting your application.");
    }
    setLoading(false);
  };

  const benefits = [
    {
      title: "Competitive Pay",
      text: "Weekly payouts with bonuses for peak-hour and high-performance deliveries.",
    },
    {
      title: "Flexible Schedule",
      text: "Work when you want and balance your daily routine with preferred slots.",
    },
    {
      title: "Growth Support",
      text: "Get onboarding support, route guidance, and partner assistance when needed.",
    },
  ];

  const requirements = [
    "Valid driving license and your own bike, scooter, or car",
    "Basic knowledge of local routes and navigation apps",
    "Ability to work flexible shifts including weekends",
    "Good communication and customer service skills",
  ];

  const onboardingSteps = [
    {
      title: "Profile Verification",
      detail: "Submit your details and verify identity, contact, and driving credentials.",
    },
    {
      title: "Orientation",
      detail: "Understand delivery flow, app operations, safety expectations, and customer handling.",
    },
    {
      title: "Go Live",
      detail: "Start taking delivery requests in preferred zones and track earnings in real time.",
    },
  ];

  const earningBreakdown = [
    "Base payout per completed delivery",
    "Distance-based incremental incentives for longer routes",
    "Peak hour multipliers during high demand windows",
    "Weekly consistency bonuses for active partners",
  ];

  return (
    <div className="pt-20 text-slate-800">
      <ToastContainer position="top-right" autoClose={2800} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-white to-blue-200/60" />
        <div className="relative container mx-auto px-6 pt-16 pb-14 md:pt-20 md:pb-20">
          <motion.div initial="hidden" animate="visible" variants={reveal} className="max-w-3xl">
            <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-4 py-1.5 text-sm font-semibold">
              Join King Hub
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Become a delivery partner and grow with us.
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-2xl leading-relaxed">
              Enjoy flexible schedules, transparent earnings, and an efficient app workflow designed for delivery partners.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-slate-900 text-center">Why Join Us</h2>
        <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-5">
          {benefits.map((item) => (
            <article key={item.title} className="surface-panel p-6">
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-12">
        <div className="surface-panel p-7 md:p-9">
          <h2 className="text-3xl font-bold text-slate-900">Requirements</h2>
          <ul className="mt-5 space-y-3">
            {requirements.map((item) => (
              <li key={item} className="text-slate-600 flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-blue-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-6">
          <article className="surface-panel p-7">
            <h2 className="text-2xl font-bold text-slate-900">How Onboarding Works</h2>
            <div className="mt-5 space-y-4">
              {onboardingSteps.map((step, index) => (
                <div key={step.title} className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                  <p className="text-sm font-semibold text-blue-700">Step {index + 1}</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-slate-600">{step.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-panel p-7">
            <h2 className="text-2xl font-bold text-slate-900">Earnings Structure</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Your income depends on completed deliveries, active hours, location demand, and incentive eligibility.
            </p>
            <ul className="mt-5 space-y-3">
              {earningBreakdown.map((item) => (
                <li key={item} className="text-slate-600 flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full bg-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
          <div className="surface-panel p-7 md:p-9">
            <h2 className="text-3xl font-bold text-slate-900 text-center">Apply Now</h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Bike">Bike</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Car">Car</option>
                </select>

                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="Driving License Number"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <input
                type="number"
                name="experience"
                placeholder="Years of Experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full rounded-xl border border-blue-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-3 max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <div key={faq.question} className="surface-panel overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full px-5 py-4 text-left flex justify-between items-center"
              >
                <span className="font-semibold text-slate-800">{faq.question}</span>
                <span className="text-blue-700 text-lg">{openFAQ === index ? "-" : "+"}</span>
              </button>
              {openFAQ === index && <div className="px-5 pb-5 text-slate-600">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Hier;
