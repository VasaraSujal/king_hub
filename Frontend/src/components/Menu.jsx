import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  ShoppingCart,
  Star,
  Heart,
  Filter,
  X,
  Plus,
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

const sizeMultipliers = { Small: 1, Medium: 1.2, Large: 1.5 };
const fallbackImage = "https://via.placeholder.com/600x400?text=Food+Image";

const Menu = ({ addToCart, toggleWishlist, isWishlisted = () => false }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Pizza");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState("grid");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchSticky, setIsSearchSticky] = useState(false);
  const searchRef = useRef(null);
  const [searchHeight, setSearchHeight] = useState(0);
  const [sortBy, setSortBy] = useState("popularity");
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

  // Make search bar sticky after scrolling past a threshold and keep placeholder height
  useEffect(() => {
    const updateHeight = () => {
      if (!searchRef.current) return;
      const inner = searchRef.current.firstElementChild;
      const h = inner ? inner.getBoundingClientRect().height : searchRef.current.getBoundingClientRect().height;
      setSearchHeight(h);
    };

    const onScroll = () => {
      const threshold = 200; // px scrolled before making search fixed — adjustable
      setIsSearchSticky(window.scrollY > threshold);
    };

    updateHeight();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const url = `https://king-hub-1.onrender.com/api/menu/${selectedCategory.toLowerCase()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!Array.isArray(data)) {
          setMenuItems([]);
          setFilteredItems([]);
          return;
        }

        const enrichedItems = data.map((item) => ({
          ...item,
          selectedSize: item.selectedSize || "Small",
          rating: item.rating || (Math.random() * 2 + 3).toFixed(1),
          reviews: item.reviews || Math.floor(Math.random() * 500) + 10,
          preparationTime: item.preparationTime || Math.floor(Math.random() * 20) + 10,
        }));

        setMenuItems(enrichedItems);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
        setFilteredItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [selectedCategory]);

  const getDisplayName = (item) => item.foodname || item.restaurantName || item.name || "Food item";

  const calculatePrice = (item) => {
    return (Number(item?.price || 0) * (sizeMultipliers[item?.selectedSize] || 1)).toFixed(2);
  };

  const sortItems = (items, sortMethod) => {
    const copy = [...items];

    switch (sortMethod) {
      case "price-asc":
        return copy.sort((a, b) => Number(calculatePrice(a)) - Number(calculatePrice(b)));
      case "price-desc":
        return copy.sort((a, b) => Number(calculatePrice(b)) - Number(calculatePrice(a)));
      case "rating":
        return copy.sort((a, b) => Number(b.rating) - Number(a.rating));
      case "time":
        return copy.sort((a, b) => Number(a.preparationTime) - Number(b.preparationTime));
      default:
        return copy;
    }
  };

  useEffect(() => {
    const lowerSearchTerm = searchTerm.trim().toLowerCase();

    const baseItems = menuItems.filter((item) => {
      if (!lowerSearchTerm) return true;
      return [item.foodname, item.restaurantName, item.description, item.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(lowerSearchTerm));
    });

    setFilteredItems(sortItems(baseItems, sortBy));
  }, [searchTerm, sortBy, menuItems]);

  useEffect(() => {
    if (!selectedItem) return;

    const basePrice = Number(calculatePrice(selectedItem));
    const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + Number(addon.price || 0), 0);
    setTotalCustomPrice(basePrice + addOnsTotal);
  }, [selectedAddOns, selectedItem]);

  const handleSearch = () => {
    const lowerSearchTerm = searchTerm.trim().toLowerCase();
    if (!lowerSearchTerm) {
      setFilteredItems(sortItems(menuItems, sortBy));
      return;
    }

    const matchingCategory = categories.find((category) => category.name.toLowerCase() === lowerSearchTerm);
    if (matchingCategory) {
      setSelectedCategory(matchingCategory.name);
      return;
    }

    const filtered = menuItems.filter((item) =>
      [item.foodname, item.restaurantName, item.description, item.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(lowerSearchTerm))
    );
    setFilteredItems(sortItems(filtered, sortBy));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm("");
    setMobileMenuOpen(false);
  };

  const handleSizeChange = (id, newSize) => {
    const updatedItems = menuItems.map((item) => (item._id === id ? { ...item, selectedSize: newSize } : item));
    setMenuItems(updatedItems);
    setFilteredItems(sortItems(updatedItems, sortBy));
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
    setSelectedAddOns((current) =>
      current.some((item) => item.id === addon.id)
        ? current.filter((item) => item.id !== addon.id)
        : [...current, addon]
    );
  };

  const confirmAddToCart = () => {
    const cartIcon = document.getElementById("cart-icon");
    if (cartIcon) {
      cartIcon.classList.add("animate-bounce");
      setTimeout(() => {
        cartIcon.classList.remove("animate-bounce");
      }, 1000);
    }

    const customizedItem = {
      ...selectedItem,
      addOns: selectedAddOns,
      totalPrice: totalCustomPrice,
    };

    addToCart(customizedItem);
    toast.success(`${getDisplayName(selectedItem)} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    closeCustomizeModal();
  };

  const handleWishlistToggle = (item) => {
    if (typeof toggleWishlist !== "function") return;

    const added = toggleWishlist(item);
    toast.info(
      added ? `${getDisplayName(item)} saved to wishlist!` : `${getDisplayName(item)} removed from wishlist!`,
      {
        position: "top-right",
        autoClose: 1500,
      }
    );
  };

  const currentCategoryIcon = categories.find((category) => category.name === selectedCategory)?.icon || "🍽️";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,237,213,0.8),_transparent_35%),linear-gradient(180deg,_#fffdf9_0%,_#fff_42%,_#f8fafc_100%)] text-slate-800 pt-[60px] md:pt-[72px]">
      <ToastContainer />
      
      {/* Search bar - becomes fixed after scrolling */}
      <div className="w-full z-40 sticky top-[60px] md:top-[72px]">
        <div className="border-b border-orange-100 bg-white/95 backdrop-blur-md shadow-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5">
            <div className="relative mx-auto max-w-3xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search dishes, restaurants, cuisines, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-full border border-slate-200 bg-white px-12 py-2.5 text-sm shadow-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-950 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity duration-200 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        className={`fixed left-0 top-0 z-50 h-full w-72 border-r border-orange-100 bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-100 px-5 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Categories</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Browse menu</h2>
        </div>
        <div className="space-y-2 px-4 py-4">
          {categories.map((category) => {
            const isActive = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition cursor-pointer ${
                  isActive
                    ? "bg-slate-950 text-white shadow-lg"
                    : "bg-slate-50 text-slate-800 hover:bg-orange-50"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-[144px] self-start h-fit rounded-[1.75rem] border border-orange-100 bg-white p-4 shadow-sm">
            <div className="px-2 pb-4 pt-2 border-b border-slate-100">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Categories</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Browse menu</h2>
            </div>
            <div className="mt-4 space-y-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category.name;
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition cursor-pointer ${
                      isActive
                        ? "bg-slate-950 text-white shadow-lg"
                        : "bg-slate-50 text-slate-800 hover:bg-orange-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </span>
                    <span className={`text-xs font-semibold ${isActive ? "text-orange-200" : "text-slate-400"}`}>
                      {isActive ? "Active" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="lg:col-span-9 xl:col-span-9 space-y-6">
            <section className="relative z-10 rounded-[2rem] border border-orange-100 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-2xl">
                  <span className="inline-flex rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">
                    {currentCategoryIcon} {selectedCategory}
                  </span>
                  <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
                    A focused menu view for faster browsing.
                  </h1>
                  <p className="mt-3 max-w-xl text-slate-600 leading-relaxed">
                    Search the current category, compare items by price or rating, and open customization only when you need it.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto xl:min-w-[320px]">
                  <div className="sm:flex-1 w-full min-w-0 rounded-2xl bg-orange-50 px-4 py-4">
                    <p className="text-2xl font-extrabold text-slate-950">{filteredItems.length}</p>
                    <p className="mt-1 text-sm font-semibold text-orange-700">Items</p>
                  </div>
                  <div className="sm:flex-1 w-full min-w-0 rounded-2xl bg-slate-100 px-4 py-4">
                    <p className="text-2xl font-extrabold text-slate-950">4.8</p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">Avg. rating</p>
                  </div>
                  <div className="sm:flex-1 w-full min-w-0 rounded-2xl bg-emerald-50 px-4 py-4">
                    <p className="text-2xl font-extrabold text-slate-950">{menuItems.length ? "Live" : "--"}</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-700">Menu</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm text-slate-600">
                  {isLoading ? "Loading items..." : `${filteredItems.length} items available in this category`}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 shadow-sm">
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                        viewType === "grid" ? "bg-white text-slate-950 shadow" : "text-slate-500"
                      }`}
                      onClick={() => setViewType("grid")}
                    >
                      Grid
                    </button>
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                        viewType === "list" ? "bg-white text-slate-950 shadow" : "text-slate-500"
                      }`}
                      onClick={() => setViewType("list")}
                    >
                      List
                    </button>
                  </div>

                  <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    <span className="text-sm font-semibold text-slate-600">Sort</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-sm font-medium text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="popularity">Most Popular</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="time">Fastest Prep Time</option>
                    </select>
                  </label>
                </div>
              </div>
            </section>

            {isLoading ? (
              <div className="rounded-[2rem] border border-orange-100 bg-white p-10 shadow-sm">
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
                  <p className="text-lg font-medium text-slate-700">Loading delicious food...</p>
                </div>
              </div>
            ) : filteredItems.length > 0 ? (
              viewType === "grid" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredItems.map((item) => {
                    const displayName = getDisplayName(item);
                    const wishlisted = isWishlisted(item._id);

                    return (
                              <article
                              key={item._id}
                              className="group overflow-hidden rounded-[1.75rem] border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                            >
                        <div className="relative overflow-hidden">
                          <img
                            src={item.imageUrl || item.image || fallbackImage}
                            alt={displayName}
                            className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(event) => {
                              if (event.currentTarget.src !== fallbackImage) {
                                event.currentTarget.src = fallbackImage;
                              }
                            }}
                          />
                          <button
                            onClick={() => handleWishlistToggle(item)}
                            className="absolute right-4 top-4 rounded-full bg-white/95 p-2.5 shadow-lg transition hover:bg-red-50 cursor-pointer"
                            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart
                              size={20}
                              className={wishlisted ? "fill-red-500 text-red-500" : "text-slate-400"}
                            />
                          </button>
                          <div className="absolute bottom-4 left-4 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            {item.preparationTime} mins
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-bold text-slate-950">{displayName}</h3>
                              <p className="mt-1 text-sm text-slate-600">{item.restaurantName || item.category || selectedCategory}</p>
                            </div>
                            <div className="rounded-xl bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                              ₹{calculatePrice(item)}
                            </div>
                          </div>

                          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                            {item.description || "Delicious and freshly prepared just for you."}
                          </p>

                          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <Star className="fill-amber-400 text-amber-400" size={16} />
                              <span className="font-semibold text-slate-800">{item.rating}</span>
                              <span>({item.reviews})</span>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">{item.preparationTime} min prep</span>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm font-semibold text-slate-600">Size</p>
                            <div className="mt-2 flex gap-2">
                              {["Small", "Medium", "Large"].map((size) => (
                                <button
                                  key={size}
                                  onClick={() => handleSizeChange(item._id, size)}
                                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                    item.selectedSize === size
                                      ? "bg-slate-950 text-white"
                                      : "bg-slate-100 text-slate-700 hover:bg-orange-50"
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => openCustomizeModal(item)}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 shadow-md cursor-pointer"
                          >
                            Add to Cart
                            <ShoppingCart size={16} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item) => {
                    const displayName = getDisplayName(item);
                    const wishlisted = isWishlisted(item._id);

                    return (
                      <article
                        key={item._id}
                        className="overflow-hidden rounded-[1.5rem] border border-orange-100 bg-white shadow-sm transition hover:shadow-xl cursor-pointer"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative sm:w-56 lg:w-64">
                            <img
                              src={item.imageUrl || item.image || fallbackImage}
                              alt={displayName}
                              className="h-64 w-full object-cover sm:h-full"
                              onError={(event) => {
                                if (event.currentTarget.src !== fallbackImage) {
                                  event.currentTarget.src = fallbackImage;
                                }
                              }}
                            />
                            <button
                              onClick={() => handleWishlistToggle(item)}
                              className="absolute right-4 top-4 rounded-full bg-white/95 p-2.5 shadow-lg transition hover:bg-red-50 cursor-pointer"
                              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                              <Heart
                                size={20}
                                className={wishlisted ? "fill-red-500 text-red-500" : "text-slate-400"}
                              />
                            </button>
                          </div>

                          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                            <div>
                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div>
                                  <h3 className="text-2xl font-bold text-slate-950">{displayName}</h3>
                                  <p className="mt-1 text-sm text-slate-600">{item.restaurantName || item.category || selectedCategory}</p>
                                </div>
                                <div className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
                                  ₹{calculatePrice(item)}
                                </div>
                              </div>

                              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                                {item.description || "Delicious and freshly prepared just for you."}
                              </p>

                              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium">
                                  <Star className="fill-amber-400 text-amber-400" size={16} />
                                  {item.rating} ({item.reviews})
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">
                                  {item.preparationTime} min prep
                                </span>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                                  Freshly made
                                </span>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-600">Size</p>
                                <div className="mt-2 flex gap-2">
                                  {["Small", "Medium", "Large"].map((size) => (
                                    <button
                                      key={size}
                                      onClick={() => handleSizeChange(item._id, size)}
                                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                        item.selectedSize === size
                                          ? "bg-slate-950 text-white"
                                          : "bg-slate-100 text-slate-700 hover:bg-orange-50"
                                      }`}
                                    >
                                      {size}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <button
                                onClick={() => openCustomizeModal(item)}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
                              >
                                Add to Cart
                                <ShoppingCart size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="rounded-[2rem] border border-dashed border-orange-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <Search size={28} />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-slate-950">No items found</h3>
                <p className="mt-2 text-slate-600">
                  We couldn't find any menu items matching your current search.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-5 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            )}
          </main>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around py-3">
          <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center text-orange-600 cursor-pointer">
            <Filter size={20} />
            <span className="mt-1 text-xs font-medium">Categories</span>
          </button>
          <button className="flex flex-col items-center text-slate-500 cursor-pointer">
            <Heart size={20} />
            <span className="mt-1 text-xs font-medium">Wishlist</span>
          </button>
          <button className="relative flex flex-col items-center text-slate-500 cursor-pointer">
            <ShoppingCart id="mobile-cart-icon" size={22} />
            <span className="mt-1 text-xs font-medium">Cart</span>
            <span className="absolute -right-2 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              0
            </span>
          </button>
        </div>
      </div>

      {customizeModalOpen && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-md"
          onClick={closeCustomizeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-orange-100 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Customize</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-950">Adjust your order</h3>
                </div>
                <button onClick={closeCustomizeModal} className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200 cursor-pointer">
                  <X size={18} className="text-slate-600" />
                </button>
              </div>
              <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3">
                <h4 className="text-lg font-semibold text-slate-950">{getDisplayName(selectedItem)}</h4>
                <p className="text-sm text-slate-600">Size: {selectedItem.selectedSize}</p>
              </div>
            </div>

            <div className="px-5 py-5">
              <h4 className="text-base font-semibold text-slate-950">Add-ons</h4>
              <p className="mt-1 text-sm text-slate-600">
                Choose extra toppings or sides to personalize the item.
              </p>

              <div className="mt-4 space-y-3">
                {customizeOptions.map((option) => {
                  const isSelected = selectedAddOns.some((item) => item.id === option.id);

                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleAddon(option)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition cursor-pointer ${
                        isSelected
                          ? "border-orange-200 bg-orange-50"
                          : "border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            isSelected ? "border-orange-500 bg-orange-500 text-white" : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected ? <Check size={12} /> : null}
                        </span>
                        <span className="font-medium text-slate-800">{option.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">₹{option.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Base price</span>
                  <span className="font-semibold">₹{calculatePrice(selectedItem)}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="space-y-1">
                    {selectedAddOns.map((addon) => (
                      <div key={addon.id} className="flex items-center justify-between text-slate-600">
                        <span>{addon.name}</span>
                        <span>₹{addon.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-950">
                  <span>Total</span>
                  <span>₹{totalCustomPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={confirmAddToCart}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
              >
                Add to Cart
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
