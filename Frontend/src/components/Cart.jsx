import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CartPage = ({
  cartItems = [],
  updateQuantity,
  removeFromCart,
  calculateTotal,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [showConfirmRemove, setShowConfirmRemove] = useState(null);
  const navigate = useNavigate();

  // Load saved addresses from localStorage on component mount
  useEffect(() => {
    const addresses = JSON.parse(
      localStorage.getItem("savedAddresses") || "[]"
    );
    setSavedAddresses(addresses);
  }, []);

  // Ensure calculateTotal is a valid function and returns a number
  const getTotal = () => {
    // Calculate the sum of (price * quantity) for each item in cartItems
    if (!cartItems || cartItems.length === 0) {
      return 0;
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    return total;
  };

  const getFinalTotal = () => {
    return getTotal() - discount + deliveryFee;
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "first10") {
      const discountAmount = getTotal() * 0.1; // 10% discount
      setDiscount(discountAmount);
    } else if (couponCode.toLowerCase() === "free") {
      setDiscount(50); // Flat ₹50 off
    } else {
      alert("Invalid coupon code");
      setDiscount(0);
    }
  };

  const updateDeliveryOption = (option) => {
    setDeliveryOption(option);
    if (option === "express") {
      setDeliveryFee(49);
    } else if (option === "standard") {
      setDeliveryFee(0);
    } else if (option === "scheduled") {
      setDeliveryFee(29);
    }
  };

  const saveAddress = () => {
    if (!address.trim()) {
      alert("Please enter an address");
      return;
    }
    const updatedAddresses = [...savedAddresses, address];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
    setAddress("");
    alert("Address saved successfully!");
  };

  const selectAddress = (selectedAddress) => {
    setAddress(selectedAddress);
    setShowAddressDropdown(false);
  };

  const makePayment = async () => {
    if (!address.trim()) {
      alert("Please enter a delivery address");
      return;
    }

    const stripe = await loadStripe(
      "pk_test_51QzA2LKS3UqIJrTgrHvrBDYirStwZHOOq2XrnOjGCwGk5B9BMvynXpRCLUKKEsRHUSDuOkHdZku875rlNWpYpSZZ00ZKLqjASA"
    );

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    setIsProcessing(true);
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(
        "https://king-hub-1.onrender.com/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              name: item.foodname,
              price: item.price,
              quantity: item.quantity,
            })),
            deliveryAddress: address,
            deliveryOption: deliveryOption,
            totalAmount: getFinalTotal(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();

      if (!session.url) {
        throw new Error("Session URL is missing");
      }

      // Redirect to Stripe checkout page
      window.location.href = session.url;
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // Function to handle item removal with confirmation
  const handleRemoveItem = (itemId) => {
    if (showConfirmRemove === itemId) {
      removeFromCart(itemId);
      setShowConfirmRemove(null);
    } else {
      setShowConfirmRemove(itemId);
      setTimeout(() => setShowConfirmRemove(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Header with animation */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 mb-8 text-center"
        >
          Your Cart ({cartItems.length} Items)
        </motion.h1>

        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          {/* Cart Items Section */}
          <div className="w-full md:w-2/3">
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center"
              >
                <div className="flex flex-col items-center justify-center py-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-xl text-gray-500 mb-4">
                    Your cart is empty.
                  </p>
                  <p className="text-gray-400 mb-6">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <button
                    onClick={() => navigate("/menu")}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg focus:outline-none transition-all duration-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Explore Menu
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6 p-6"
                  >
                    <div className="flex flex-col sm:flex-row items-center">
                      <img
                        src={item.imageUrl}
                        alt={item.foodname}
                        className="w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0 hover:scale-105 transition-transform duration-300"
                      />
                      <div className="sm:ml-6 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div>
                            <p className="text-xl font-semibold text-gray-900 mb-1">
                              {item.foodname}
                            </p>
                            {item.description && (
                              <p className="text-sm text-gray-500 mb-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <p className="text-lg font-medium text-gray-800 mb-4 sm:mb-0">
                            ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
                          <div className="flex items-center mb-4 sm:mb-0">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, "subtract")
                              }
                              className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-lg focus:outline-none transition-colors duration-200 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-gray-700 font-medium mx-4">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, "add")}
                              className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-lg focus:outline-none transition-colors duration-200 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-700 font-medium">
                              Total: ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                            {showConfirmRemove === item._id ? (
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg focus:outline-none transition-colors duration-200"
                              >
                                Confirm
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="mb-6 flex justify-between items-center">
                  <button
                    onClick={() => navigate("/menu")}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Continue Shopping
                  </button>
                  {cartItems.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm("Clear all items from cart?")) {
                          cartItems.forEach((item) => removeFromCart(item._id));
                        }
                      }}
                      className="text-red-500 hover:text-red-700 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Clear Cart
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Side Sections */}
          <div className="w-full md:w-1/3 space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getTotal().toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">
                      -₹{discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : "Free"}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{getFinalTotal().toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Coupon Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Apply Coupon
              </h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Try 'FIRST10' for 10% off or 'FREE' for ₹50 off
              </p>
            </motion.div>

            {/* Delivery Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Delivery Options
              </h2>
              <div className="space-y-3">
                <div
                  onClick={() => updateDeliveryOption("standard")}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    deliveryOption === "standard"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={deliveryOption === "standard"}
                      onChange={() => updateDeliveryOption("standard")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <span className="block font-medium">
                        Standard Delivery
                      </span>
                      <span className="text-sm text-gray-500">
                        Free • 2-3 days
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => updateDeliveryOption("express")}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    deliveryOption === "express"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={deliveryOption === "express"}
                      onChange={() => updateDeliveryOption("express")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <span className="block font-medium">
                        Express Delivery
                      </span>
                      <span className="text-sm text-gray-500">
                        ₹49 • Same day
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => updateDeliveryOption("scheduled")}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    deliveryOption === "scheduled"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div
                    onClick={() => updateDeliveryOption("scheduled")}
                    className={`cursor-pointer transition-all duration-200 ${
                      deliveryOption === "scheduled"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={deliveryOption === "scheduled"}
                        onChange={() => updateDeliveryOption("scheduled")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="block font-medium">
                          Scheduled Delivery
                        </span>
                        <span className="text-sm text-gray-500">
                          ₹29 • Choose date & time
                        </span>
                      </div>
                    </div>

                    {/* Date and Time Selector that appears when scheduled delivery is selected */}
                    {deliveryOption === "scheduled" && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min={new Date().toISOString().split("T")[0]} // Set min to today
                            onChange={(e) => {
                              // Handle date selection
                              console.log("Selected date:", e.target.value);
                              // You can store this in state if needed
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery Time
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              // Handle time selection
                              console.log(
                                "Selected time slot:",
                                e.target.value
                              );
                              // You can store this in state if needed
                            }}
                          >
                            <option value="">Select a time slot</option>
                            <option value="9am-12pm">9:00 AM - 12:00 PM</option>
                            <option value="12pm-3pm">12:00 PM - 3:00 PM</option>
                            <option value="3pm-6pm">3:00 PM - 6:00 PM</option>
                            <option value="6pm-9pm">6:00 PM - 9:00 PM</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Address Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  />

                  {savedAddresses.length > 0 && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          setShowAddressDropdown(!showAddressDropdown)
                        }
                        className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Use Saved Address
                      </button>

                      {showAddressDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                          {savedAddresses.map((savedAddress, index) => (
                            <div
                              key={index}
                              onClick={() => selectAddress(savedAddress)}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                            >
                              {savedAddress}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={saveAddress}
                    className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    Save This Address
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Checkout Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                onClick={makePayment}
                disabled={isProcessing || cartItems.length === 0}
                className={`w-full py-4 rounded-xl font-medium text-white text-lg shadow-lg transition-all duration-300 flex items-center justify-center ${
                  isProcessing || cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Proceed to Payment</>
                )}
              </button>
              <p className="text-xs text-center text-gray-500 mt-2">
                Secure payment powered by Stripe
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;