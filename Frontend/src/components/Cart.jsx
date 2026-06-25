import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://king-hub-1.onrender.com";

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
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const getItemKey = (item) => item?._id || item?.id || item?.itemId || item?.foodname;
  const getItemName = (item) => item?.foodname || item?.itemName || item?.name || "Food Item";
  const getItemImage = (item) => item?.imageUrl || item?.image || item?.bgImage || "https://via.placeholder.com/300x200?text=Food+Image";
  const getFallbackItemImage = (item) => {
    const itemName = encodeURIComponent(getItemName(item));
    return `https://via.placeholder.com/300x200?text=${itemName}`;
  };

  useEffect(() => {
    const addresses = JSON.parse(localStorage.getItem("savedAddresses") || "[]");
    setSavedAddresses(addresses);
  }, []);

  const getTotal = () => {
    if (!cartItems || cartItems.length === 0) {
      return 0;
    }

    return cartItems.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  };

  const getFinalTotal = () => {
    return getTotal() - discount + deliveryFee;
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "first10") {
      setDiscount(getTotal() * 0.1);
    } else if (couponCode.toLowerCase() === "free") {
      setDiscount(50);
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
    if (!isAuthenticated) {
      await loginWithRedirect();
      return;
    }

    if (!address.trim()) {
      alert("Please enter a delivery address");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    const stripe = await loadStripe(
      "pk_test_51QzA2LKS3UqIJrTgrHvrBDYirStwZHOOq2XrnOjGCwGk5B9BMvynXpRCLUKKEsRHUSDuOkHdZku875rlNWpYpSZZ00ZKLqjASA"
    );

    if (!stripe) {
      alert("Unable to start checkout right now.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            name: getItemName(item),
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1),
            imageUrl: getItemImage(item),
          })),
          deliveryAddress: address,
          deliveryOption,
          totalAmount: getFinalTotal(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();

      if (!session.url) {
        throw new Error("Session URL is missing");
      }

      window.location.href = session.url;
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(219,234,254,0.9),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_42%,_#eef2ff_100%)] pt-24 pb-16 text-slate-800">
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] border border-blue-100 bg-white p-6 sm:p-8 shadow-xl"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                Checkout
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                Your cart is ready for final review.
              </h1>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Review items, adjust quantities, add your address, and continue to payment when you are ready.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto lg:min-w-[320px]">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-2xl font-extrabold text-slate-950">{cartItems.length}</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">Items</p>
              </div>
              <div className="rounded-2xl bg-blue-50 px-4 py-4">
                <p className="text-2xl font-extrabold text-slate-950">₹{getTotal().toFixed(0)}</p>
                <p className="mt-1 text-sm font-semibold text-blue-700">Subtotal</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-4">
                <p className="text-2xl font-extrabold text-slate-950">{isAuthenticated ? "In" : "Guest"}</p>
                <p className="mt-1 text-sm font-semibold text-emerald-700">Status</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">Cart items</h2>
                  <p className="mt-1 text-slate-600">{cartItems.length === 0 ? "No items in cart" : `${cartItems.length} item${cartItems.length === 1 ? "" : "s"} in your cart`}</p>
                </div>
                {cartItems.length > 0 && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate("/menu")}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Clear all items from cart?")) {
                          cartItems.forEach((item) => removeFromCart(getItemKey(item)));
                        }
                      }}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 cursor-pointer"
                    >
                      Clear Cart
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {cartItems.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-slate-300"
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
                    </div>
                    <h3 className="text-2xl font-bold text-slate-950">Your cart is empty</h3>
                    <p className="mt-2 text-slate-600">Looks like you haven’t added anything yet.</p>
                    <button
                      onClick={() => navigate("/menu")}
                      className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
                    >
                      Explore Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.article
                        key={getItemKey(item) || index}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-44 lg:w-52">
                            <img
                              src={getItemImage(item)}
                              alt={getItemName(item)}
                              className="h-56 w-full object-cover sm:h-full"
                              onError={(event) => {
                                const fallbackSrc = getFallbackItemImage(item);
                                if (event.currentTarget.src !== fallbackSrc) {
                                  event.currentTarget.src = fallbackSrc;
                                }
                              }}
                            />
                          </div>

                          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <h3 className="text-2xl font-bold text-slate-950">{getItemName(item)}</h3>
                                {item.description && (
                                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="rounded-full bg-blue-50 px-4 py-2 text-lg font-bold text-blue-700">
                                ₹{Number(item.price || 0).toFixed(2)}
                              </div>
                            </div>

                            <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-600">Quantity</p>
                                <div className="mt-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                                  <button
                                    onClick={() => updateQuantity(getItemKey(item), "subtract")}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="min-w-12 px-4 text-center text-sm font-bold text-slate-950">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(getItemKey(item), "add")}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-lg font-bold text-white shadow-sm transition hover:bg-slate-800 cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                                  Total: ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                                </div>
                                {showConfirmRemove === getItemKey(item) ? (
                                  <button
                                    onClick={() => handleRemoveItem(getItemKey(item))}
                                    className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 cursor-pointer"
                                  >
                                    Confirm Remove
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleRemoveItem(getItemKey(item))}
                                    className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Delivery address */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-950">Delivery address</h2>
              <div className="mt-4 space-y-4">
                <div className="relative">
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  />

                  {savedAddresses.length > 0 && (
                    <div className="mt-2">
                      <button
                        onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                        className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 cursor-pointer"
                      >
                        Use Saved Address
                      </button>

                      {showAddressDropdown && (
                        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                          {savedAddresses.map((savedAddress, index) => (
                            <button
                              key={index}
                              onClick={() => selectAddress(savedAddress)}
                              className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm text-slate-700 last:border-b-0 hover:bg-blue-50 cursor-pointer"
                            >
                              {savedAddress}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={saveAddress}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 cursor-pointer"
                >
                  Save This Address
                </button>
              </div>
            </motion.section>

            {/* Delivery options */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-950">Delivery options</h2>
              <div className="mt-4 space-y-3">
                {[
                  { key: "standard", title: "Standard Delivery", meta: "Free • 2-3 days" },
                  { key: "express", title: "Express Delivery", meta: "₹49 • Same day" },
                  { key: "scheduled", title: "Scheduled Delivery", meta: "₹29 • Choose date & time" },
                ].map((option) => {
                  const isActive = deliveryOption === option.key;

                  return (
                    <button
                      key={option.key}
                      onClick={() => updateDeliveryOption(option.key)}
                      className={`w-full rounded-2xl border p-4 text-left transition cursor-pointer ${
                        isActive ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          checked={isActive}
                          readOnly
                          className="mt-1 h-4 w-4 text-blue-600"
                        />
                        <div>
                          <span className="block font-semibold text-slate-950">{option.title}</span>
                          <span className="text-sm text-slate-600">{option.meta}</span>
                        </div>
                      </div>

                      {option.key === "scheduled" && isActive && (
                        <div className="mt-4 space-y-3 border-t border-blue-100 pt-4">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                              Delivery Date
                            </label>
                            <input
                              type="date"
                              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                              Delivery Time
                            </label>
                            <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100">
                              <option value="">Select a time slot</option>
                              <option value="9am-12pm">9:00 AM - 12:00 PM</option>
                              <option value="12pm-3pm">12:00 PM - 3:00 PM</option>
                              <option value="3pm-6pm">3:00 PM - 6:00 PM</option>
                              <option value="6pm-9pm">6:00 PM - 9:00 PM</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.section>

            {/* Apply coupon */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-950">Apply coupon</h2>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  onClick={applyCoupon}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
                >
                  Apply
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Try FIRST10 for 10% off or FREE for ₹50 off.
              </p>
            </motion.section>
          </div>

          <div className="xl:col-span-4">
            {/* Sticky Order Summary & Proceed to Payment */}
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-28 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Order summary</h2>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-950">₹{getTotal().toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-emerald-600">Discount</span>
                      <span className="font-semibold text-emerald-600">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-slate-600">Delivery Fee</span>
                    <span className="font-semibold text-slate-950">
                      {deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : "Free"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-lg font-bold text-slate-950">
                    <span>Total</span>
                    <span>₹{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <button
                  onClick={makePayment}
                  disabled={isProcessing || cartItems.length === 0}
                  className={`inline-flex w-full items-center justify-center rounded-full px-5 py-4 text-lg font-semibold text-white transition cursor-pointer ${
                    isProcessing || cartItems.length === 0
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-slate-950 hover:bg-slate-800"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : isAuthenticated ? (
                    "Proceed to Payment"
                  ) : (
                    "Sign In to Pay"
                  )}
                </button>

                {!isAuthenticated && (
                  <p className="mt-3 text-center text-xs text-slate-500">
                    You can add items to cart as a guest. Sign in only when you are ready to pay.
                  </p>
                )}
                <p className="mt-2 text-center text-xs text-slate-500">
                  Secure payment powered by Stripe.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CartPage;
