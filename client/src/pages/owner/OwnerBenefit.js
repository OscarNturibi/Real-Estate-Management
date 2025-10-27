import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    title: "Wide Market Reach",
    description:
      "Reach thousands of verified tenants actively searching for rental properties through our trusted platform.",
    icon: "🏡",
  },
  {
    title: "Easy Property Management",
    description:
      "List, edit, and monitor your properties seamlessly using your personalized dashboard.",
    icon: "💼",
  },
  {
    title: "Transparent Payments",
    description:
      "Enjoy fast, secure, and transparent rent payments directly through our integrated system.",
    icon: "💰",
  },
  {
    title: "Data Insights",
    description:
      "Make smarter decisions with real-time analytics and performance reports for your listings.",
    icon: "📊",
  },
  {
    title: "Maintenance Tracking",
    description:
      "Receive and manage maintenance requests directly from tenants with instant updates.",
    icon: "🛠️",
  },
  {
    title: "24/7 Accessibility",
    description:
      "Access your owner dashboard anytime, anywhere — fully optimized for both desktop and mobile.",
    icon: "📱",
  },
];

const OwnerBenefit = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Benefits of Being a Property owner
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Partner with RealtyHub and simplify property ownership. Enjoy full
          control, secure payments, and powerful insights — all in one place.
        </p>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-5xl mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {benefit.title}
            </h3>
            <p className="text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <button
          onClick={() => navigate("/owner-register")}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
        >
          Join as a Property owner
        </button>
      </motion.div>
    </div>
  );
};

export default OwnerBenefit;
