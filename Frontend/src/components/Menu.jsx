
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  ShoppingCart,
  Star,
  Heart,
  ChevronDown,
  ArrowRight,
  Filter,
  X,
  Plus,
  Minus,
  Check,
} from "lucide-react";

const categories = [
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Garlic Bread", icon: "🥖" },
  { name: "Salads", icon: "🥗" },
  { name: "Cold Drinks", icon: "🥤" },
  { name: "Chinese Food", icon: "🥡" },
  { name: "Punjabi Food", icon: "🍲" },
];

// Customize options - these would ideally come from your API
const customizeOptions = [
  { id: 1, name: "Handmade Dough", price: 100 },
  { id: 2, name: "Cheese Burst", price: 100 },
  { id: 3, name: "Extra Cheese", price: 40 },
  { id: 4, name: "Onion", price: 25 },
  { id: 5, name: "Jelapino", price: 25 },
  { id: 6, name: "Tomato", price: 25 },
  { id: 7, name: "Paneer", price: 35 },
  { id: 8, name: "Corn", price: 30 },
];

const Menu = ({ addToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Pizza");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState("grid");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");

  // New state for customization modal
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [totalCustomPrice, setTotalCustomPrice] = useState(0);

  useEffect(() => {
    if (!customizeModalOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeCustomizeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [customizeModalOpen]);

  const sizeMultipliers = { Small: 1, Medium: 1.2, Large: 1.5 };

  useEffect(() => {
    setIsLoading(true);
    const url = `https://king-hub-1.onrender.com/api/menu/${selectedCategory.toLowerCase()}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const updatedData = data.map((item) => ({
            ...item,
            selectedSize: "Small",
            rating: (Math.random() * 2 + 3).toFixed(1), // Mock rating between 3.0-5.0
            reviews: Math.floor(Math.random() * 500) + 10, // Mock review count
            preparationTime: Math.floor(Math.random() * 20) + 10, // Mock prep time in minutes
          }));
          setMenuItems(updatedData);
          setFilteredItems(sortItems(updatedData, sortBy));
          setIsLoading(false);
        } else {
          console.error("Error response:", data);
          setMenuItems([]);
          setFilteredItems([]);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
        setIsLoading(false);
      });
  }, [selectedCategory]);

  const sortItems = (items, sortMethod) => {
    switch (sortMethod) {
      case "price-asc":
        return [...items].sort(
          (a, b) =>
            parseFloat(calculatePrice(a)) - parseFloat(calculatePrice(b))
        );
      case "price-desc":
        return [...items].sort(
          (a, b) =>
            parseFloat(calculatePrice(b)) - parseFloat(calculatePrice(a))
        );
      case "rating":
        return [...items].sort(
          (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
        );
      case "time":
        return [...items].sort(
          (a, b) =>
            parseFloat(a.preparationTime) - parseFloat(b.preparationTime)
        );
      default: // popularity
        return items;
    }
  };

  useEffect(() => {
    setFilteredItems(
      sortItems(
        menuItems.filter((item) =>
          item.foodname?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        sortBy
      )
    );
  }, [searchTerm, sortBy, menuItems]);

  // Calculate the total price including add-ons
  useEffect(() => {
    if (selectedItem) {
      const basePrice = parseFloat(calculatePrice(selectedItem));
      const addOnsTotal = selectedAddOns.reduce(
        (sum, addon) => sum + addon.price,
        0
      );
      setTotalCustomPrice(basePrice + addOnsTotal);
    }
  }, [selectedAddOns, selectedItem]);

  const handleSearch = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchingCategory = categories.find(
      (cat) => cat.name.toLowerCase() === lowerSearchTerm
    );

    if (matchingCategory) {
      setSelectedCategory(matchingCategory.name);
    } else {
      const filtered = menuItems.filter((item) =>
        item.foodname?.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredItems(sortItems(filtered, sortBy));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm("");
    setMobileMenuOpen(false);
  };

  const handleSizeChange = (id, newSize) => {
    const updatedItems = menuItems.map((item) =>
      item._id === id ? { ...item, selectedSize: newSize } : item
    );
    setMenuItems(updatedItems);
    setFilteredItems(
      sortItems(
        updatedItems.filter((item) =>
          item.foodname?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        sortBy
      )
    );
  };

  const calculatePrice = (item) => {
    return (item.price * (sizeMultipliers[item.selectedSize] || 1)).toFixed(2);
  };

  const openCustomizeModal = (item) => {
    setSelectedItem(item);
    setSelectedAddOns([]);
    setCustomizeModalOpen(true);
  };

  const closeCustomizeModal = () => {
    setCustomizeModalOpen(false);
    setSelectedItem(null);
    setSelectedAddOns([]);
  };

  const toggleAddon = (addon) => {
    if (selectedAddOns.some((item) => item.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter((item) => item.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const confirmAddToCart = () => {
    // Create a vibration animation on the cart icon
    const cartIcon = document.getElementById("cart-icon");
    if (cartIcon) {
      cartIcon.classList.add("animate-bounce");
      setTimeout(() => {
        cartIcon.classList.remove("animate-bounce");
      }, 1000);
    }

    // Create a new item with the selected add-ons
    const customizedItem = {
      ...selectedItem,
      addOns: selectedAddOns,
      totalPrice: totalCustomPrice,
    };

    addToCart(customizedItem);
    toast.success(`${selectedItem.foodname} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    closeCustomizeModal();
  };

  const toggleFavorite = (itemId) => {
    if (favorites.includes(itemId)) {
      setFavorites(favorites.filter((id) => id !== itemId));
    } else {
      setFavorites([...favorites, itemId]);
      toast.info("Added to favorites!", {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white font-sans relative">
      {/* Toast Container */}
      <ToastContainer />

      {/* Search Bar */}
      <div className="fixed top-14 left-0 right-0 bg-white shadow-md z-50 p-4">
        <div className="container mx-auto">
          <div className="relative w-full max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for dishes, restaurants, or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 pl-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 shadow-sm"
            />
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={20}
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition duration-300"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 transform md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-orange-600">Categories</h2>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-64px)]">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-300 flex items-center ${
                selectedCategory === category.name
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "bg-white text-gray-800 hover:bg-orange-100"
              }`}
            >
              <span className="mr-3">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Categories - Desktop */}
          <aside className="hidden md:block w-64 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto bg-white rounded-xl shadow-md p-4 mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
              Categories
            </h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition duration-300 flex items-center ${
                    selectedCategory === category.name
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                      : "bg-white text-gray-800 hover:bg-orange-100"
                  }`}
                >
                  <span className="mr-3 text-xl">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Menu Content */}
          <main className="flex-1 mt-10">
            {/* Category Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {categories.find((c) => c.name === selectedCategory)?.icon ||
                    ""}{" "}
                  {selectedCategory}
                </h2>
                <p className="text-gray-500 mt-1">
                  {filteredItems.length} items available
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
                {/* View Type Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-3 py-1 rounded-lg ${
                      viewType === "grid" ? "bg-white shadow-sm" : ""
                    }`}
                    onClick={() => setViewType("grid")}
                  >
                    Grid
                  </button>
                  <button
                    className={`px-3 py-1 rounded-lg ${
                      viewType === "list" ? "bg-white shadow-sm" : ""
                    }`}
                    onClick={() => setViewType("list")}
                  >
                    List
                  </button>
                </div>

                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="time">Fastest Prep Time</option>
                </select>
              </div>
            </div>

            {/* Menu Items */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                  <p className="text-lg text-gray-700 font-medium">
                    Loading delicious food...
                  </p>
                </div>
              </div>
            ) : filteredItems.length > 0 ? (
              viewType === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.foodname || "Food item"}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=Food+Image";
                          }}
                        />
                        <button
                          onClick={() => toggleFavorite(item._id)}
                          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                        >
                          <Heart
                            size={20}
                            className={`${
                              favorites.includes(item._id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg text-gray-800">
                            {item.foodname || item.restaurantName}
                          </h3>
                          <div className="flex items-center">
                            <Star
                              className="text-yellow-500 fill-yellow-500"
                              size={16}
                            />
                            <span className="text-sm font-medium ml-1 text-gray-700">
                              {item.rating}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              ({item.reviews})
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                          {item.description ||
                            "Delicious and freshly prepared just for you"}
                        </p>

                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            {item.preparationTime} mins
                          </span>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Size:
                            </span>
                            <div className="flex space-x-2">
                              {["Small", "Medium", "Large"].map((size) => (
                                <button
                                  key={size}
                                  onClick={() =>
                                    handleSizeChange(item._id, size)
                                  }
                                  className={`px-2 py-1 text-xs rounded-md ${
                                    item.selectedSize === size
                                      ? "bg-orange-500 text-white"
                                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-800">
                              ₹{calculatePrice(item)}
                            </span>
                            <button
                              onClick={() => openCustomizeModal(item)}
                              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition duration-300 flex items-center"
                            >
                              Add to Cart
                              <ArrowRight size={16} className="ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row transform transition-all duration-300 hover:shadow-xl h-auto sm:h-48" // Fixed height for list view
                    >
                      <div className="relative w-full sm:w-40 md:w-56">
                        <img
                          src={item.imageUrl}
                          alt={item.foodname || "Food item"}
                          className="w-full h-48 sm:h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=Food+Image";
                          }}
                        />
                        <button
                          onClick={() => toggleFavorite(item._id)}
                          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                        >
                          <Heart
                            size={20}
                            className={`${
                              favorites.includes(item._id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-lg text-gray-800">
                                  {item.foodname || item.restaurantName}
                                </h3>
                                <div className="flex items-center sm:hidden">
                                  <Star
                                    className="text-yellow-500 fill-yellow-500"
                                    size={16}
                                  />
                                  <span className="text-sm font-medium ml-1 text-gray-700">
                                    {item.rating}
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                {item.description ||
                                  "Delicious and freshly prepared just for you"}
                              </p>

                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span className="flex items-center mr-4">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                  </svg>
                                  {item.preparationTime} mins
                                </span>
                                <div className="hidden sm:flex items-center">
                                  <Star
                                    className="text-yellow-500 fill-yellow-500"
                                    size={16}
                                  />
                                  <span className="text-sm font-medium ml-1 text-gray-700">
                                    {item.rating}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({item.reviews})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between">
                          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                            <span className="text-sm font-medium text-gray-600">
                              Size:
                            </span>
                            <div className="flex space-x-2">
                              {["Small", "Medium", "Large"].map((size) => (
                                <button
                                  key={size}
                                  onClick={() =>
                                    handleSizeChange(item._id, size)
                                  }
                                  className={`px-2 py-1 text-xs rounded-md ${
                                    item.selectedSize === size
                                      ? "bg-orange-500 text-white"
                                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center">
                            <span className="text-xl font-bold text-gray-800 mr-4">
                              ₹{calculatePrice(item)}
                            </span>
                            <button
                              onClick={() => openCustomizeModal(item)}
                              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition duration-300 flex items-center"
                            >
                              Add to Cart
                              <ArrowRight size={16} className="ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="bg-white p-8 rounded-xl shadow text-center">
                <div className="text-orange-500 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  No items found
                </h3>
                <p className="text-gray-500 mt-2">
                  We couldn't find any menu items matching your search.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300"
                >
                  Clear Search
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-3 z-30 md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="flex flex-col items-center text-orange-500"
        >
          <Filter size={20} />
          <span className="text-xs mt-1">Categories</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <Heart size={20} />
          <span className="text-xs mt-1">Favorites</span>
        </button>
        <div className="relative">
          <button className="flex flex-col items-center text-gray-500">
            <ShoppingCart id="mobile-cart-icon" size={24} />
            <span className="text-xs mt-1">Cart</span>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Customize Modal */}
      {customizeModalOpen && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4"
          onClick={closeCustomizeModal}
        >
          <div
            className="bg-white/95 rounded-2xl shadow-2xl border border-blue-100/70 max-w-md w-full max-h-[90vh] overflow-y-auto transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 rounded-t-xl">
              <div className="flex justify-between items-center p-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Customize as per your taste
                </h3>
                <button
                  onClick={closeCustomizeModal}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="px-4 pb-2">
                <h4 className="text-lg font-medium">
                  {selectedItem.foodname || selectedItem.restaurantName}
                </h4>
                <p className="text-sm text-gray-500">
                  Size: {selectedItem.selectedSize}
                </p>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-md font-semibold text-gray-700 mb-2">
                  Add On ({selectedAddOns.length}/{customizeOptions.length})
                </h4>
                <div className="space-y-3">
                  {customizeOptions.map((option) => {
                    const isSelected = selectedAddOns.some(
                      (item) => item.id === option.id
                    );
                    return (
                      <div
                        key={option.id}
                        className="flex items-center justify-between border-b border-gray-100 pb-2"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`addon-${option.id}`}
                            checked={isSelected}
                            onChange={() => toggleAddon(option)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`addon-${option.id}`}
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            {option.name}
                          </label>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700">
                            ₹{option.price}
                          </span>
                          <button
                            onClick={() => toggleAddon(option)}
                            className={`ml-3 p-1 rounded-full ${
                              isSelected
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {isSelected ? (
                              <Check size={16} className="text-blue-600" />
                            ) : (
                              <Plus size={16} className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 rounded-b-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Base Price:
                </span>
                <span className="text-sm font-medium text-gray-700">
                  ₹{calculatePrice(selectedItem)}
                </span>
              </div>

              {selectedAddOns.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Add Ons:
                  </h5>
                  <div className="space-y-1">
                    {selectedAddOns.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">{addon.name}</span>
                        <span className="text-gray-700">₹{addon.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-lg font-bold text-gray-800">
                  ₹{totalCustomPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={confirmAddToCart}
                className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              >
                Add to Cart
                <ShoppingCart size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
