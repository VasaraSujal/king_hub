// Frontend/src/components/RestaurantDetails.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  IoStar,
  IoStarHalf,
  IoStarOutline,
  IoTime,
  IoCall,
  IoLocation,
  IoArrowBack,
  IoSearch,
  IoFilter,
  IoCart,
  IoAdd,
  IoRemove,
  IoHeart,
  IoHeartOutline,
  IoPricetag,
  IoInformationCircle,
} from "react-icons/io5";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://king-hub-1.onrender.com";

const RestaurantDetails = ({ restaurantId, cartItems }) => {
  const { id } = useParams();
  const resolvedRestaurantId = restaurantId || id;

  const getRandomImage = (seed, width = 1200, height = 700) =>
    `https://picsum.photos/seed/${encodeURIComponent(
      seed || "king-hub"
    )}/${width}/${height}`;

  const getFoodKeyword = (item, categoryName = "") => {
    const itemText = `${item?.itemName || item?.name || ""} ${
      item?.description || ""
    } ${categoryName}`.toLowerCase();

    const keywordMap = [
      ["burger", "burger"],
      ["pizza", "pizza"],
      ["fries", "fries"],
      ["french fry", "fries"],
      ["chicken", "fried chicken"],
      ["paneer", "paneer curry"],
      ["sandwich", "sandwich"],
      ["wrap", "wrap"],
      ["roll", "roll"],
      ["pasta", "pasta"],
      ["noodle", "noodles"],
      ["biryani", "biryani"],
      ["rice", "rice bowl"],
      ["salad", "salad"],
      ["soup", "soup"],
      ["curry", "curry"],
      ["taco", "tacos"],
      ["shawarma", "shawarma"],
      ["dosa", "dosa"],
      ["idli", "idli"],
      ["ice cream", "ice cream"],
      ["cake", "cake"],
      ["dessert", "dessert"],
      ["coffee", "coffee"],
      ["tea", "tea"],
      ["juice", "juice"],
      ["drink", "cold drink"],
      ["soda", "soda"],
    ];

    const match = keywordMap.find(([needle]) => itemText.includes(needle));
    return match ? match[1] : (categoryName || "food").toLowerCase();
  };

  const getFoodImage = (item, categoryName = "") => {
    const keyword = getFoodKeyword(item, categoryName);
    const lockSeed = item?.id || item?._id || item?.itemName || item?.name || keyword;
    return `https://loremflickr.com/900/600/${encodeURIComponent(
      keyword
    )}?lock=${encodeURIComponent(lockSeed)}`;
  };

  const getRestaurantCoverImage = () => {
    if (restaurant?.bgImage) return restaurant.bgImage;
    return getRandomImage(`${resolvedRestaurantId || "restaurant"}-cover`);
  };

  const getRestaurantLogoImage = () => {
    if (restaurant?.logo) return restaurant.logo;
    return getRandomImage(`${resolvedRestaurantId || "restaurant"}-logo`, 300, 300);
  };

  const getMenuItemImage = (item, categoryName = "") => {
    return getFoodImage(item, categoryName);
  };

  const getItemKey = (item) => item?._id || item?.id || item?.itemName || item?.name;

  const normalizeCartItem = (item, categoryName = "") => {
    const foodname = item?.foodname || item?.itemName || item?.name || "Food Item";

    return {
      _id: getItemKey(item),
      id: item?.id || item?._id || item?.itemName || item?.name,
      foodname,
      itemName: item?.itemName || foodname,
      description: item?.description || "",
      imageUrl: item?.imageUrl || item?.image || getFoodImage(item, categoryName),
      price: Number(item?.price || item?.totalPrice || 0),
      quantity: Number(item?.quantity || 1),
      categoryName,
      addOns: item?.addOns || [],
      allergies: item?.allergies || [],
      spiceLevel: item?.spiceLevel || 0,
      rating: item?.rating || 0,
      isPopular: Boolean(item?.isPopular),
    };
  };

  const withFallbackImage = (event, seed, width = 800, height = 600) => {
    const fallbackSrc = getRandomImage(seed, width, height);
    if (event.currentTarget.src !== fallbackSrc) {
      event.currentTarget.src = fallbackSrc;
    }
  };

  // State for the restaurant data
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPopular, setFilterPopular] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState(cartItems || []); // Initialize with cartItems
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [activeItemModal, setActiveItemModal] = useState(null);
  const [showHoursModal, setShowHoursModal] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    diet: [],
    spiceLevel: [],
    priceRange: [],
    allergies: [],
    popularOnly: false,
  });

  const menuRef = useRef(null);
  const cartRef = useRef(null);

  useEffect(() => {
    setCart(cartItems || []);
  }, [cartItems]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle outside click for cart
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        showCart
      ) {
        setShowCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCart]);

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!resolvedRestaurantId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://king-hub-1.onrender.com/api/restaurants/${resolvedRestaurantId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant data");
        }
        const data = await response.json();
        setRestaurant(data);
        setActiveCategory(data.menu?.[0]?.id || data.menu?.[0]?.categoryName || ""); // Set the first category as active
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [resolvedRestaurantId]);

  // Monitor Cart Updates
  useEffect(() => {
    console.log("Updated Cart State:", cart);
  }, [cart]);

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51QzA2LKS3UqIJrTgrHvrBDYirStwZHOOq2XrnOjGCwGk5B9BMvynXpRCLUKKEsRHUSDuOkHdZku875rlNWpYpSZZ00ZKLqjASA"
    );

    console.log("Cart Items Before Payment:", cartItems);
    console.log("Local Cart State:", cart);

    // Use cartItems prop if available, otherwise fallback to local cart state
    const itemsToProcess = cartItems && cartItems.length > 0 ? cartItems : cart;

    if (!itemsToProcess || itemsToProcess.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    const body = { items: itemsToProcess };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();
      console.log("Session URL:", session.url);

      if (!session.url) {
        throw new Error("Session URL is missing");
      }

      window.location.href = session.url; // Redirect to Stripe checkout page
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      if (filterType === "priceRange") {
        return { ...prev, priceRange: [value] }; // Only store the selected value
      }

      if (filterType === "popularOnly") {
        return { ...prev, popularOnly: value };
      }

      return {
        ...prev,
        [filterType]: prev[filterType].includes(value)
          ? prev[filterType].filter((item) => item !== value)
          : [...prev[filterType], value],
      };
    });
  };

  // Filter menu items based on search and filters
  const getFilteredMenuItems = (items) => {
    return items.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by Diet
      if (
        selectedFilters.diet.length > 0 &&
        !selectedFilters.diet.includes(item.diet)
      ) {
        return false;
      }

      // Filter by Allergies
      if (selectedFilters.allergies.length > 0) {
        // Convert "No Dairy" to "Dairy" for filtering
        const selectedAllergies = selectedFilters.allergies.map((allergy) =>
          allergy.replace("No ", "")
        );

        // Exclude items that contain any selected allergy
        if (
          item.allergies.some((allergen) =>
            selectedAllergies.includes(allergen)
          )
        ) {
          return false;
        }
      }

      // Filter by Spice Level
      if (
        selectedFilters.spiceLevel.length > 0 &&
        !selectedFilters.spiceLevel.includes(item.spiceLevel)
      ) {
        return false;
      }

      // ✅ Filter by Price Range
      if (selectedFilters.priceRange.length > 0) {
        const selectedPrice = selectedFilters.priceRange[0]; // Only one value

        const itemPrice = item.price;
        if (
          (selectedPrice === "below_200" && itemPrice >= 200) ||
          (selectedPrice === "200_500" &&
            (itemPrice < 200 || itemPrice > 500)) ||
          (selectedPrice === "above_500" && itemPrice <= 500)
        ) {
          return false;
        }
      }
      if (filterPopular && !item.isPopular) {
        return false;
      }

      return matchesSearch;
    });
  };

  // Add to cart function
  const addToCart = (item) => {
    const normalizedItem = normalizeCartItem(item);
    const existingItemIndex = cart.findIndex(
      (cartItem) => getItemKey(cartItem) === getItemKey(normalizedItem)
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: (updatedCart[existingItemIndex].quantity || 1) + 1,
      };
      setCart(updatedCart);
    } else {
      setCart([...cart, normalizedItem]);
    }
  };

  // Remove from cart function
  const removeFromCart = (itemId) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) => getItemKey(cartItem) === itemId
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      if (updatedCart[existingItemIndex].quantity > 1) {
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity - 1,
        };
        setCart(updatedCart);
      } else {
        setCart(cart.filter((item) => getItemKey(item) !== itemId));
      }
    }
  };

  // Toggle favorite status
  const toggleFavorite = (itemId) => {
    if (favorites.includes(itemId)) {
      setFavorites(favorites.filter((id) => id !== itemId));
    } else {
      setFavorites([...favorites, itemId]);
    }
  };

  // Show notification when item is added to cart
const showItemAddedNotification = (item) => {
  toast.success(`${item} added to cart`, {
    position: "top-right",
    autoClose: 2000, // Ensure this is set
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

  // Scroll to category
  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);

    // Give time for the category content to render
    setTimeout(() => {
      const categoryElement = document.getElementById(`category-${categoryId}`);
      if (categoryElement) {
        window.scrollTo({
          top: categoryElement.offsetTop - 100,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // Calculate cart totals
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = 1.99;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + deliveryFee + tax;

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-indigo-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-indigo-300 mb-4 animate-bounce"></div>
          <div className="h-6 w-48 bg-indigo-200 rounded mb-6"></div>
          <p className="text-indigo-600 font-medium">
            Loading restaurant details...
          </p>
        </div>
      </div>
    );
  }

  // Display error if no data
  if (!restaurant) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-indigo-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl max-w-md mx-auto">
          <div className="text-indigo-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Restaurant Not Found
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            We couldn't find the restaurant you're looking for.
          </p>
          <button
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-indigo-200"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Item detail modal
  const ItemDetailModal = () => {
    if (!activeItemModal) return null;

    const item = activeItemModal;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl m-4 max-h-[90vh] flex flex-col">
          <button
            onClick={() => setActiveItemModal(null)}
            className="absolute top-4 right-4 z-30 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="relative h-64">
            <img
              src={getMenuItemImage(item)}
              alt={item.foodname || item.itemName || item.name}
              className="w-full h-full object-cover"
              onError={(e) =>
                withFallbackImage(
                  e,
                  `${getItemKey(item) || item.itemName || "modal-item"}-modal`,
                  900,
                  600
                )
              }
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h2 className="text-white text-2xl font-bold">{item.foodname || item.itemName || item.name}</h2>
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(item.rating) ? (
                        <IoStar />
                      ) : i < Math.ceil(item.rating) &&
                        item.rating % 1 !== 0 ? (
                        <IoStarHalf />
                      ) : (
                        <IoStarOutline />
                      )}
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-white font-medium text-sm">
                  {item.rating} ({item.reviewCount || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">
                ₹{item.price.toFixed(2)}
              </span>
              <button
                onClick={() => toggleFavorite(getItemKey(item))}
                className={`p-2 rounded-full ${
                  favorites.includes(getItemKey(item))
                    ? "text-pink-500 bg-pink-100"
                    : "text-gray-400 bg-gray-100"
                } transition-colors`}
              >
                {favorites.includes(getItemKey(item)) ? (
                  <IoHeart className="h-6 w-6" />
                ) : (
                  <IoHeartOutline className="h-6 w-6" />
                )}
              </button>
            </div>

            <p className="text-gray-700 mb-6">{item.description}</p>

            {item.allergies?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">
                  Allergen Information
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.allergies.map((allergy, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-indigo-800 mb-2">Spice Level</h3>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-6 rounded-full ${
                      i < Number(item.spiceLevel || 0) ? "bg-red-500" : "bg-gray-200"
                    }`}
                  />
                ))}
                <div className="ml-2 text-gray-600 text-sm">
                  {
                    ["Not Spicy", "Mild", "Medium", "Spicy", "Very Spicy"][
                      Number(item.spiceLevel || 0)
                    ]
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Hours modal component
  const HoursModal = () => {
    if (!showHoursModal) return null;

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
        <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl m-4">
          <button
            onClick={() => setShowHoursModal(false)}
            className="absolute top-4 right-4 z-30 p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hours of Operation
            </h2>
            <div className="divide-y divide-gray-200">
              {days.map((day) => (
                <div
                  key={day}
                  className={`py-3 flex justify-between items-center ${
                    day === today.toLowerCase() ? "bg-indigo-50 -mx-6 px-6" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <span className="capitalize font-medium text-gray-900">
                      {day}
                    </span>
                    {day === today.toLowerCase() && (
                      <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="text-gray-600">
                    {restaurant.hours?.[day] || "Closed"}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center text-gray-800">
                <IoInformationCircle className="text-indigo-500 mr-2" />
                <span>
                  {restaurant.openTime ? (
                    <span className="font-medium">Currently Open</span>
                  ) : (
                    <span className="font-medium text-gray-600">
                      Currently Closed
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-indigo-50 min-h-screen font-sans">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Header/Hero Section */}
          <div className="relative h-72 md:h-96">
            <div className="absolute inset-0">
              <img
                src={getRestaurantCoverImage()}
                alt={restaurant.name || "Restaurant cover"}
                className="w-full h-full object-cover"
                onError={(e) =>
                  withFallbackImage(
                    e,
                    `${resolvedRestaurantId || "restaurant"}-cover-fallback`,
                    1400,
                    900
                  )
                }
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
            </div>

            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={() => window.history.back()}
                className="p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <IoArrowBack size={22} />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-6 py-6 md:px-10 md:py-8 flex items-end">
              <div className="flex items-center">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl transform -translate-y-4">
                  <img
                    src={getRestaurantLogoImage()}
                    alt={`${restaurant.name || "Restaurant"} logo`}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      withFallbackImage(
                        e,
                        `${resolvedRestaurantId || "restaurant"}-logo-fallback`,
                        300,
                        300
                      )
                    }
                  />
                </div>
                <div className="ml-4 md:ml-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {restaurant.name || "Restaurant"}
                  </h1>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => {
                        const ratingValue = i + 1;
                        return (
                          <span key={i} className="mr-0.5">
                            {ratingValue <= restaurant.rating ? (
                              <IoStar className="text-yellow-400" size={18} />
                            ) : ratingValue <= Math.ceil(restaurant.rating) &&
                              restaurant.rating % 1 !== 0 ? (
                              <IoStarHalf
                                className="text-yellow-400"
                                size={18}
                              />
                            ) : (
                              <IoStarOutline
                                className="text-yellow-300"
                                size={18}
                              />
                            )}
                          </span>
                        );
                      })}
                    </div>
                    <span className="ml-2 text-white font-medium">
                      {restaurant.rating?.toFixed(1) || "0.0"}{" "}
                      <span className="opacity-80">
                        ({restaurant.reviewCount || 0} reviews)
                      </span>
                    </span>
                    <span className="ml-4 text-white font-bold">
                      {restaurant.priceLevel || "$"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {restaurant.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Info Cards */}
          <div className="px-4 md:px-10 py-4 -mt-6">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center group">
                  <div className="p-3 bg-indigo-100 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <IoLocation size={22} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-gray-500 font-medium">
                      Location
                    </div>
                    <div className="text-base font-medium text-gray-800">
                      {restaurant.location || "Address unavailable"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center group">
                  <div
                    className="p-3 bg-green-100 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300"
                    onClick={() => setShowHoursModal(true)}
                  >
                    <IoTime size={22} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-gray-500 font-medium">
                      Hours
                    </div>
                    <div
                      className="text-base font-medium text-gray-800 flex items-center cursor-pointer"
                      onClick={() => setShowHoursModal(true)}
                    >
                      {restaurant.isOpen ? (
                        <span className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                          Open now
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                          Closed
                        </span>
                      )}
                      {restaurant.closingTime && (
                        <>
                          <span className="mx-2 text-gray-400">•</span>
                          <span>Closes at {restaurant.closeTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center group">
                  <a
                    href={`tel:${restaurant.contact}`}
                    className="p-3 bg-blue-100 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                  >
                    <IoCall size={22} />
                  </a>
                  <div className="ml-4">
                    <div className="text-sm text-gray-500 font-medium">
                      Contact
                    </div>
                    <a
                      href={`tel:${restaurant.contact}`}
                      className="text-base font-medium text-gray-800 hover:text-indigo-600 transition-colors"
                    >
                      {restaurant.contact || "Phone unavailable"}
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                    <IoTime size={22} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-gray-500 font-medium">
                      Delivery Time
                    </div>
                    <div className="text-base font-medium text-gray-800">
                      {restaurant.deliveryTime || "30-45 minutes"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-3 bg-pink-100 rounded-full text-pink-600">
                    <IoPricetag size={22} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-gray-500 font-medium">
                      Delivery Fee
                    </div>
                    <div className="text-base font-medium text-gray-800">
                      {restaurant.deliveryFee || "$0.00"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Filter/Search Section */}
          <div
            className={`sticky w-370 mx-auto p-6 top-0 rounded-xl pt-4 pb-2 bg-indigo-50 z-20 transition-all duration-300 ${
              scrolled ? "shadow-md" : ""
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  className={`px-5 py-3 rounded-xl font-medium ${
                    filterPopular
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  } transition-colors duration-300`}
                  onClick={() => setFilterPopular(!filterPopular)}
                >
                  Popular Items
                </button>
                <button
                  className="p-3 rounded-xl bg-white text-gray-600 hover:bg-gray-100 transition-colors duration-300"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <IoFilter size={22} />
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 bg-white rounded-xl p-4 shadow-lg animate-slideDown">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Diet</h3>
                    <div className="space-y-2">
                      {[
                        "Vegetarian",
                        "Vegan",
                        "Gluten-Free",
                        "Non-Vegetarian",
                      ].map((diet) => (
                        <label key={diet} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            checked={selectedFilters.diet.includes(diet)}
                            onChange={() => handleFilterChange("diet", diet)}
                          />
                          <span className="ml-2 text-gray-700">{diet}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Allergies
                    </h3>
                    <div className="space-y-2">
                      {["No Dairy", "No Nuts", "No Eggs"].map((allergy) => (
                        <label key={allergy} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            checked={selectedFilters.allergies.includes(
                              allergy
                            )}
                            onChange={() =>
                              handleFilterChange("allergies", allergy)
                            }
                          />
                          <span className="ml-2 text-gray-700">{allergy}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Price Range
                    </h3>
                    <div className="flex flex-col space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.priceRange.includes(
                            "below_200"
                          )}
                          onChange={() =>
                            handleFilterChange("priceRange", "below_200")
                          }
                          className="form-checkbox text-blue-600"
                        />
                        <span className="text-gray-700">Below ₹200</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.priceRange.includes(
                            "200_500"
                          )}
                          onChange={() =>
                            handleFilterChange("priceRange", "200_500")
                          }
                          className="form-checkbox text-blue-600"
                        />
                        <span className="text-gray-700">₹200 - ₹500</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.priceRange.includes(
                            "above_500"
                          )}
                          onChange={() =>
                            handleFilterChange("priceRange", "above_500")
                          }
                          className="form-checkbox text-blue-600"
                        />
                        <span className="text-gray-700">Above ₹500</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Spice Level
                    </h3>
                    <div className="space-y-2">
                      {["Not Spicy", "Mild", "Medium", "Spicy"].map((level) => (
                        <label key={level} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            checked={selectedFilters.spiceLevel.includes(level)}
                            onChange={() =>
                              handleFilterChange("spiceLevel", level)
                            }
                          />
                          <span className="ml-2 text-gray-700">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                  <button
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg mr-3 hover:bg-gray-300 transition-colors duration-300"
                    onClick={() =>
                      setSelectedFilters({
                        diet: [],
                        allergies: [],
                        priceRange: [],
                        spiceLevel: [],
                      })
                    }
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Category Navigation */}
            <div className="mt-6 mb-2 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2 pb-1">
                {restaurant.menu?.map((category) => (
                  <button
                    key={category.id}
                    className={`whitespace-nowrap px-5 py-2 rounded-full font-medium transition-all ${
                      activeCategory === category.id
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => scrollToCategory(category.id)}
                  >
                    {category.categoryName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <div className="px-4 md:px-10 pb-32" ref={menuRef}>
            <div className="mt-8 space-y-10">
              {(() => {
                const hasItems = restaurant.menu?.some((category) => {
                  const filteredItems = getFilteredMenuItems(
                    category.items || []
                  );
                  return filteredItems.length > 0;
                });

                if (!hasItems) {
                  return (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="text-4xl text-gray-300 mb-4">🍽️</div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        No Items Found
                      </h2>
                      <p className="text-gray-600 text-center max-w-md">
                        We couldn't find any items matching your search and
                        filters. Try adjusting your filters or search term.
                      </p>
                    </div>
                  );
                }

                return restaurant.menu?.map((category) => {
                  const filteredItems = getFilteredMenuItems(
                    category.items || []
                  );
                  if (
                    filteredItems.length === 0 &&
                    (searchTerm !== "" || filterPopular)
                  ) {
                    return null;
                  }

                  return (
                    <div
                      key={category.id || category.categoryName}
                      id={`category-${category.id || category.categoryName}`}
                      className="scroll-mt-32"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {category.categoryName}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => {
                          const itemKey = getItemKey(item);
                          const normalizedItem = normalizeCartItem(item, category.categoryName);

                          return (
                          <div
                            key={itemKey}
                            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group cursor-pointer"
                            onClick={() => setActiveItemModal(normalizedItem)}
                          >
                            <div className="relative h-48">
                              <img
                                      src={getMenuItemImage(item, category.categoryName)}
                                alt={item.itemName}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) =>
                                  withFallbackImage(
                                    e,
                                    `${getItemKey(item) || item.itemName || "card-item"}-card`,
                                    700,
                                    450
                                  )
                                }
                              />
                              {item.isPopular && (
                                <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  Popular
                                </div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                    toggleFavorite(itemKey);
                                }}
                                className={`absolute top-2 right-2 p-2 rounded-full ${
                                  favorites.includes(itemKey)
                                    ? "bg-pink-500 text-white"
                                    : "bg-white/70 text-gray-600 hover:bg-white"
                                } transition-colors`}
                              >
                                {favorites.includes(itemKey) ? (
                                  <IoHeart size={18} />
                                ) : (
                                  <IoHeartOutline size={18} />
                                )}
                              </button>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                  {item.itemName}
                                </h3>
                                <span className="font-bold text-indigo-600">
                                  ₹{item.price?.toFixed(2) || "0.00"}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {item.description}
                              </p>
                              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                                <div className="flex items-center text-yellow-400">
                                  <IoStar size={16} />
                                  <span className="ml-1 text-gray-700 text-sm font-medium">
                                    {item.rating || "0.0"}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(normalizedItem);
                                  }}
                                  className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-colors ml-auto"
                                >
                                  <IoAdd size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Cart Floating Button */}
          <div className="fixed bottom-6 right-6 z-30">
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <IoCart size={24} />
              {cart.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </div>
              )}
            </button>
          </div>

          {/* Cart Slide Panel */}
          {showCart && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex justify-end animate-fadeIn"
              onClick={() => setShowCart(false)}
            >
              <div
                ref={cartRef}
                className="w-full max-w-md bg-white h-full animate-slideInRight"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Your Order
                      </h2>
                      <button
                        onClick={() => setShowCart(false)}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 text-gray-600">
                      <span className="font-medium text-indigo-600">
                        {restaurant.name || "Restaurant"}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{restaurant.distance || "Nearby"}</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 text-gray-300 mb-4">
                          <IoCart size={80} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Your cart is empty
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-xs">
                          Add items from the menu to start your order.
                        </p>
                        <button
                          onClick={() => setShowCart(false)}
                          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Browse Menu
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {cart.map((item) => (
                          <div
                            key={getItemKey(item)}
                            className="flex items-center bg-gray-50 rounded-xl p-4"
                          >
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.imageUrl || getMenuItemImage(item)}
                                alt={item.foodname || item.itemName}
                                className="w-full h-full object-cover"
                                onError={(e) =>
                                  withFallbackImage(
                                    e,
                                    `${getItemKey(item) || item.foodname || item.itemName || "cart-item"}-cart`,
                                    300,
                                    300
                                  )
                                }
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-900">
                                  {item.foodname || item.itemName}
                                </h4>
                                <span className="font-bold text-indigo-600">
                                  ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                                {item.description}
                              </p>
                              <div className="flex items-center mt-3">
                                <button
                                  onClick={() => removeFromCart(getItemKey(item))}
                                  className="p-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                  <IoRemove size={16} />
                                </button>
                                <span className="mx-3 font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="p-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                  <IoAdd size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="pt-6 border-t border-gray-200">
                          <div className="mb-2 flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                              ₹{cartTotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="mb-2 flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className="font-medium">
                              ₹{deliveryFee.toFixed(2)}
                            </span>
                          </div>
                          <div className="mb-2 flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">
                              ₹{tax.toFixed(2)}
                            </span>
                          </div>
                          <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between">
                            <span className="font-bold text-gray-900">
                              Total
                            </span>
                            <span className="font-bold text-gray-900">
                              ₹{finalTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {cart.length > 0 && (
                    <div className="p-6 border-t border-gray-200">
                      <button
                        onClick={makePayment}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantDetails;