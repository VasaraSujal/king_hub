import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import Restaurant from './components/RestaurantsPage';
import Menu from './components/Menu';
import Cart from './components/Cart';
import About from './components/About';
import Offer from './components/Offer';
import Hier from './components/Hier.jsx';
import Wishlist from './components/Wishlist.jsx';
import Authuser from './components/Authuser.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import RestaurantDetails from "./components/RestaurantDetails";
import SuccessPage from "./components/SuccessPage";
import CancelPage from "./components/CancelPage";
// import { useState } from 'react';

function App() {

  const { isAuthenticated } = useAuth0();
  const [cartItems, setCartItems] = useState([]);
  const createWishlistImageDataUrl = (label) => {
    const safeLabel = (label || 'Food Item').toString().slice(0, 24);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f8c9d4" />
            <stop offset="100%" stop-color="#ffd7a8" />
          </linearGradient>
        </defs>
        <rect width="900" height="600" rx="36" fill="url(#g)" />
        <circle cx="150" cy="120" r="70" fill="rgba(255,255,255,0.28)" />
        <circle cx="760" cy="480" r="120" fill="rgba(255,255,255,0.18)" />
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
          font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#1f2937">
          ${safeLabel.replace(/[&<>]/g, '')}
        </text>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const isGeneratedImageUrl = (url) =>
    typeof url === 'string' && (url.includes('loremflickr.com') || url.includes('picsum.photos') || url.includes('via.placeholder.com'));

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
      return Array.isArray(savedItems)
        ? savedItems.map((item) => {
            const displayName = item?.foodname || item?.itemName || item?.name || 'Food Item';
            const imageUrl = item?.imageUrl || item?.image || item?.bgImage;

            return {
              ...item,
              imageUrl: imageUrl && !isGeneratedImageUrl(imageUrl)
                ? imageUrl
                : createWishlistImageDataUrl(displayName),
            };
          })
        : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const getItemId = (item) => item?._id || item?.id || item?.itemId || item?.foodname;

  const getCartItemUniqueId = (item) => {
    const baseId = item?._id || item?.id || item?.itemId || item?.foodname || 'item';
    const size = item?.selectedSize || 'Small';
    const addOnsKey = Array.isArray(item?.addOns)
      ? item.addOns.map(a => a.id || a.name).sort().join(',')
      : '';
    return `${baseId}-${size}-${addOnsKey}`;
  };

  const normalizeCartItem = (item) => {
    const quantity = Number(item?.quantity || 1);
    const basePrice = Number(item?.totalPrice ?? item?.price ?? 0);
    const displayName = item?.foodname || item?.itemName || item?.name || 'Food Item';
    const uniqueId = getCartItemUniqueId(item);

    return {
      ...item,
      _id: uniqueId,
      id: uniqueId,
      foodname: displayName,
      itemName: item?.itemName || displayName,
      imageUrl: item?.imageUrl || item?.image || item?.bgImage || '',
      price: basePrice,
      quantity,
    };
  };

  const normalizeWishlistItem = (item) => {
    const displayName = item?.foodname || item?.itemName || item?.name || 'Food Item';
    const sourceImage = item?.imageUrl || item?.image || item?.bgImage;

    return {
      ...item,
      _id: getItemId(item),
      id: item?.id || item?._id || item?.itemId || item?.foodname || item?.itemName || item?.name,
      foodname: displayName,
      itemName: item?.itemName || displayName,
      imageUrl: sourceImage && !isGeneratedImageUrl(sourceImage)
        ? sourceImage
        : createWishlistImageDataUrl(displayName),
      price: Number(item?.price ?? item?.totalPrice ?? 0),
      description: item?.description || '',
    };
  };

  const addToCart = (item) => {
    const normalizedItem = normalizeCartItem(item);

    setCartItems((prev) => {
      const existing = prev.find((cartItem) => getItemId(cartItem) === getItemId(normalizedItem));
      if (existing) {
        return prev.map((cartItem) =>
          getItemId(cartItem) === getItemId(normalizedItem)
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      }
      return [...prev, normalizedItem];
    });
  };

  const toggleWishlist = (item) => {
    const normalizedItem = normalizeWishlistItem(item);
    const itemId = getItemId(normalizedItem);

    const isAlreadyWishlisted = wishlistItems.some(
      (wishlistedItem) => getItemId(wishlistedItem) === itemId
    );

    setWishlistItems((prev) =>
      isAlreadyWishlisted
        ? prev.filter((wishlistedItem) => getItemId(wishlistedItem) !== itemId)
        : [...prev, normalizedItem]
    );

    return !isAlreadyWishlisted;
  };

  const isWishlisted = (itemId) =>
    wishlistItems.some((wishlistedItem) => getItemId(wishlistedItem) === itemId);

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => getItemId(item) !== itemId));
  };

  const updateQuantity = (itemId, action) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (getItemId(item) !== itemId) return item;

          const currentQuantity = Number(item.quantity || 1);
          if (action === 'add') {
            return { ...item, quantity: currentQuantity + 1 };
          }

          if (action === 'subtract') {
            return { ...item, quantity: Math.max(1, currentQuantity - 1) };
          }

          return item;
        })
        .filter((item) => Number(item.quantity || 1) > 0)
    );
  };

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);

  return (
    <Router>
      <ScrollToTop />
      {isAuthenticated && <Authuser />}
      <Navbar cartItems={cartItems} wishlistItems={wishlistItems} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path ="/footer" element ={<Footer/>}/>
        <Route path="/restaurants" element={<Restaurant />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails cartItems={cartItems} wishlistItems={wishlistItems} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
        <Route path="/menu" element={<Menu addToCart={addToCart} wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} />} />
        <Route path="/about" element={<About />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} calculateTotal={calculateTotal} />} />
        <Route path="/wishlist" element={<Wishlist wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} addToCart={addToCart} />} />
        <Route path="/hier" element={<Hier />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

export default App;  
