import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import Restaurant from './components/RestaurantsPage';
import Cart from './components/Cart';
import About from './components/About';
import Offer from './components/Offer';
import Hier from './components/Hier.jsx';
import Authuser from './components/Authuser.jsx';
import { useAuth0 } from '@auth0/auth0-react';

function App() {

  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      {isAuthenticated && <Authuser />}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path ="/footer" element ={<Footer/>}/>
        <Route path="/restaurants" element={<Restaurant />} />
        <Route path="/about" element={<About />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/hier" element={<Hier />} />
      </Routes>
    </Router>
  );
}

export default App;  
