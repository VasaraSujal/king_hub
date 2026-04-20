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
import Authuser from './components/Authuser.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import RestaurantDetails from "./components/RestaurantDetails";
import SuccessPage from "./components/SuccessPage";
import CancelPage from "./components/CancelPage";
// import { useState } from 'react';

function App() {

  const { isAuthenticated } = useAuth0();
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cartItems') || '[]');
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const getItemId = (item) => item?._id || item?.id || item?.itemId || item?.foodname;

  const normalizeCartItem = (item) => {
    const quantity = Number(item?.quantity || 1);
    const basePrice = Number(item?.price ?? item?.totalPrice ?? 0);
    const displayName = item?.foodname || item?.itemName || item?.name || 'Food Item';

    return {
      ...item,
      _id: getItemId(item),
      id: item?.id || item?._id || item?.itemId || item?.foodname,
      foodname: displayName,
      itemName: item?.itemName || displayName,
      imageUrl: item?.imageUrl || item?.image || item?.bgImage || '',
      price: basePrice,
      quantity,
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
      <Navbar cartItems={cartItems} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path ="/footer" element ={<Footer/>}/>
        <Route path="/restaurants" element={<Restaurant />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
        <Route path="/menu" element={<Menu addToCart={addToCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} calculateTotal={calculateTotal} />} />
        <Route path="/hier" element={<Hier />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
      </Routes>
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
