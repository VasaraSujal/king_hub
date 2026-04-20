import React, { useState } from "react";
import { motion } from "framer-motion";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const values = [
  {
    title: "Fast Delivery",
    description:
      "Orders are routed to nearby partners to keep delivery time low and food quality high.",
  },
  {
    title: "Trusted Partners",
    description:
      "We work with highly rated restaurants so every order meets quality expectations.",
  },
  {
    title: "Reliable Support",
    description:
      "From order issues to payment help, our support flow is built for quick resolution.",
  },
];

const team = [
  { name: "Sujal Vasara", role: "Founder" },
  { name: "Product Team", role: "User Experience" },
  { name: "Operations Team", role: "Delivery Network" },
];

const stats = [
  { label: "Active Restaurants", value: "500+" },
  { label: "Cities Served", value: "25+" },
  { label: "Orders Delivered", value: "1M+" },
  { label: "Customer Rating", value: "4.8/5" },
];

const principles = [
  {
    title: "Customer-First Decision Making",
    text: "Feature priorities are evaluated against checkout simplicity, delivery predictability, and support turnaround.",
  },
  {
    title: "Operational Reliability",
    text: "We invest in uptime, order-state accuracy, and dispatch quality to reduce failed and delayed orders.",
  },
  {
    title: "Partner Growth",
    text: "Restaurants receive insights and campaign opportunities to improve conversion and repeat orders.",
  },
];

const roadmap = [
  {
    phase: "Phase 1",
    title: "Core Ordering",
    desc: "Built baseline discovery, cart, checkout, and payment workflows.",
  },
  {
    phase: "Phase 2",
    title: "Delivery Intelligence",
    desc: "Improved ETA consistency and assignment logic across busy zones.",
  },
  {
    phase: "Phase 3",
    title: "Experience Expansion",
    desc: "Expanded partner network, personalization, and support tooling.",
  },
];

const AboutUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("https://king-hub-1.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setSuccess(response.ok ? "Message sent successfully!" : "Something went wrong, try again.");
      if (response.ok) setFormData({ name: "", email: "", message: "" });
    } catch {
      setSuccess("Error connecting to server.");
    }
    setLoading(false);
  };

  return (
    <div className="text-slate-800">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-white to-blue-200/60" />
        <div className="relative container mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-24">
          <motion.div initial="hidden" animate="visible" variants={reveal} className="max-w-4xl">
            <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-1.5 text-sm font-semibold">
              About King Hub
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
              A modern food delivery experience designed for speed and trust.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
              King Hub connects people with great restaurants through a simple and reliable ordering flow. Our focus is
              consistent quality, clear communication, and delightful customer experience.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
            className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="surface-panel p-5">
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reveal}
          className="grid md:grid-cols-3 gap-6"
        >
          {values.map((item) => (
            <article key={item.title} className="surface-panel p-7">
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{item.description}</p>
            </article>
          ))}
        </motion.div>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={reveal}
          className="grid lg:grid-cols-2 gap-8"
        >
          <div className="surface-panel p-8">
            <h2 className="text-3xl font-bold text-slate-900">Our Story</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              King Hub started with a single goal: make ordering food effortless. Over time, we evolved from a small
              local network into a dependable platform serving thousands of customers with transparent pricing and
              smooth checkout.
            </p>
          </div>

          <div className="surface-panel p-8">
            <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Deliver a premium ordering experience with fast dispatch, dependable restaurant quality, and responsive
              support so users can order confidently at any time.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reveal}
          className="surface-panel p-8 md:p-10"
        >
          <h2 className="text-3xl font-bold text-slate-900 text-center">How We Build Product Decisions</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {principles.map((item) => (
              <article key={item.title} className="surface-panel p-5">
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{item.text}</p>
              </article>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reveal}
          className="surface-panel p-8 md:p-10"
        >
          <h2 className="text-3xl font-bold text-slate-900 text-center">Platform Journey</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {roadmap.map((item) => (
              <article key={item.phase} className="surface-panel p-5">
                <p className="text-sm font-semibold text-blue-700">{item.phase}</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reveal}
          className="surface-panel p-8 md:p-10"
        >
          <h2 className="text-3xl font-bold text-slate-900 text-center">Meet the Team</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {team.map((member) => (
              <div key={member.name} className="surface-panel p-5">
                <p className="text-lg font-bold text-slate-900">{member.name}</p>
                <p className="mt-1 text-slate-600">{member.role}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reveal}
          className="grid lg:grid-cols-2 gap-8"
        >
          <div className="surface-panel p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Join Our Community</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Get product updates, restaurant launches, and exclusive offers delivered to your inbox.
            </p>
            <form
              className="mt-6 flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="surface-panel p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Contact Us</h2>
            <p className="mt-3 text-slate-600">Have a question or feedback? We would love to hear from you.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 disabled:opacity-70"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
              {success && <p className="text-sm font-medium text-blue-700">{success}</p>}
            </form>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
