import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';

const OfferPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState('All');
  const [email, setEmail] = useState('');
  const [showCountdown, setShowCountdown] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 30,
    seconds: 0
  });

  // Ref for offer scroll
  const exclusiveOffersRef = useRef(null);
  const scrollToOffers = () => {
    exclusiveOffersRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const offerSlides = [
    {
      image: 'https://res.cloudinary.com/dkombksnu/image/upload/v1740049183/zkdm63zrhlxptzroc6dr.png',
      title: 'DELIVERY',
      subtitle: 'UP TO 50% OFF',
      description: 'Get the best discounts on your favorite meals!',
      discount: '50% OFF',
      subtext: 'On your first order',
      buttonText: 'Order Now',
    },
    {
      image: 'https://res.cloudinary.com/dkombksnu/image/upload/v1740049213/n4nbl39lb0lpymnd4i0c.png',
      title: 'MEGA DEAL',
      subtitle: 'FLAT ₹100 OFF',
      description: 'Exclusive discounts for limited time.',
      discount: '₹100 OFF',
      subtext: 'Use Code: MEGA100',
      buttonText: 'Claim Offer',
    },
    {
      image: 'https://res.cloudinary.com/dkombksnu/image/upload/v1740143778/lc1lcprlsovhruakxdt8.png',
      title: 'NEW OFFER',
      subtitle: 'FLAT ₹200 OFF',
      description: 'Special deal for new users only.',
      discount: '₹200 OFF',
      subtext: 'Use Code: NEW200',
      buttonText: 'Get Started',
    }
  ];

  const availableOffers = [
    { icon: '🏷️', title: '50% OFF up to ₹100', description: 'Use code: WELCOME50', validity: 'Valid till 31 March 2023', terms: 'Min order ₹700 | All restaurants' },
    { icon: '💳', title: 'Flat ₹150 OFF', description: 'HDFC Bank Cards', validity: 'Valid till 15 April 2023', terms: 'Min order ₹500 | Selected restaurants' },
    { icon: '🍔', title: 'Buy 1 Get 1 Free', description: 'Premium Burgers', validity: 'Valid till 30 April 2023', terms: 'Selected outlets | Weekend only' },
    { icon: '🌙', title: '60% OFF on Late Night', description: '11 PM - 5 AM', validity: 'Valid till 1 May 2023', terms: 'Min order ₹300 | Selected restaurants' },
    { icon: '🍕', title: 'Free Pizza', description: 'On orders above ₹999', validity: 'Valid till 10 April 2023', terms: 'Pizza outlets | Limited time' },
    { icon: '🎂', title: 'Special Birthday Offer', description: '25% extra discount', validity: 'Valid throughout 2023', terms: 'Birthday month only | All restaurants' },
  ];

  // NEW: Exclusive offers section
  const exclusiveOffers = [
    {
      id: 1,
      image: 'https://res.cloudinary.com/dkombksnu/image/upload/v1740049183/zkdm63zrhlxptzroc6dr.png',
      title: 'Premium Restaurant Bundle',
      description: 'Get 30% off on orders from our premium restaurant partners',
      promoCode: 'PREMIUM30',
      validUntil: 'March 15, 2023',
      minOrder: '₹800',
      maxDiscount: '₹300'
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/dkombksnu/image/upload/v1740049213/n4nbl39lb0lpymnd4i0c.png',
      title: 'Weekend Food Festival',
      description: 'Special discounts on all restaurants during weekends',
      promoCode: 'WEEKEND25',
      validUntil: 'April 30, 2023',
      minOrder: '₹600',
      maxDiscount: '₹250'
    },
    {
      id: 3,
      image: 'https://res.cloudinary.com/dkombksnu/image/upload/v1740143778/lc1lcprlsovhruakxdt8.png',
      title: 'Free Delivery Pass',
      description: 'Free delivery on your next 5 orders',
      promoCode: 'FREEDEL5',
      validUntil: 'March 31, 2023',
      minOrder: '₹300',
      maxDiscount: 'N/A'
    }
  ];

  // NEW: Restaurant special offers
  const restaurantSpecials = [
    {
      id: 1,
      restaurant: "Pizza Paradise",
      image: "https://res.cloudinary.com/dkombksnu/image/upload/v1740049183/zkdm63zrhlxptzroc6dr.png",
      offer: "Buy 1 Large Pizza Get 1 Medium Free",
      code: "PIZZA2FOR1",
      validDays: "Mon-Thu",
      rating: 4.5,
      cuisine: "Italian"
    },
    {
      id: 2,
      restaurant: "Curry House",
      image: "https://res.cloudinary.com/dkombksnu/image/upload/v1740049213/n4nbl39lb0lpymnd4i0c.png",
      offer: "20% OFF on Family Combos",
      code: "FAMILY20",
      validDays: "All days",
      rating: 4.2,
      cuisine: "Indian"
    },
    {
      id: 3,
      restaurant: "Sushi Spot",
      image: "https://res.cloudinary.com/dkombksnu/image/upload/v1740143778/lc1lcprlsovhruakxdt8.png",
      offer: "Free California Roll with orders over ₹800",
      code: "SUSHIFREE",
      validDays: "Weekends",
      rating: 4.7,
      cuisine: "Japanese"
    },
    {
      id: 4,
      restaurant: "Taco Fiesta",
      image: "https://res.cloudinary.com/dkombksnu/image/upload/v1740049183/zkdm63zrhlxptzroc6dr.png",
      offer: "₹150 OFF on order above ₹600",
      code: "TACO150",
      validDays: "All days",
      rating: 4.3,
      cuisine: "Mexican"
    },
    {
      id: 5,
      restaurant: "Dragon Wok",
      image: "https://res.cloudinary.com/dkombksnu/image/upload/v1740049213/n4nbl39lb0lpymnd4i0c.png",
      offer: "Buy 2 Get 1 Free on all Mains",
      code: "DRAGON3FOR2",
      validDays: "Mon-Wed",
      rating: 4.1,
      cuisine: "Chinese"
    },
    {
      id: 6,
      restaurant: "Pasta Palace",
      image: "https://res.cloudinary.com/dkombksnu/image/upload/v1740143778/lc1lcprlsovhruakxdt8.png",
      offer: "25% OFF on Pasta Combos",
      code: "PASTA25",
      validDays: "Tue-Thu",
      rating: 4.4,
      cuisine: "Italian"
    }
  ];

  const popularCuisines = [
    { name: 'Italian', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4IVvRMCEFRY1M0eUz7W5VXlWwv8XeQ_WSuQ&s' },
    { name: 'Mexican', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZxZBvj9TN6Zu7mIN8SEuscYJCQ1hGHpFoUw&s' },
    { name: 'Indian', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0faqgSpFHkRI0b-qK5ew7MKdkAHD-ve0VfQ&s' },
    { name: 'Chinese', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnDjqO5Hq0YNI81biaJNB42XRPfgNNciJhtg&s' },
    { name: 'Japanese', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCeIRBsNcKZFdsKdPhkYR-mXfzRWdkKcDCJQ&s' },
  ];

  // NEW: Payment Method Offers
  const paymentOffers = [
    {
      id: 1,
      bank: "HDFC Bank",
      logo: "https://res.cloudinary.com/dkombksnu/image/upload/v1740049183/zkdm63zrhlxptzroc6dr.png",
      offerText: "10% instant discount up to ₹150 on credit cards",
      validUntil: "March 31, 2023",
      minTransactionValue: "₹500"
    },
    {
      id: 2,
      bank: "ICICI Bank",
      logo: "https://res.cloudinary.com/dkombksnu/image/upload/v1740049213/n4nbl39lb0lpymnd4i0c.png",
      offerText: "5% cashback up to ₹200 on debit cards",
      validUntil: "April 15, 2023",
      minTransactionValue: "₹700"
    },
    {
      id: 3,
      bank: "Paytm",
      logo: "https://res.cloudinary.com/dkombksnu/image/upload/v1740143778/lc1lcprlsovhruakxdt8.png",
      offerText: "Flat ₹75 cashback on payments via Paytm Wallet",
      validUntil: "March 20, 2023",
      minTransactionValue: "₹300"
    },
    {
      id: 4,
      bank: "Amazon Pay",
      logo: "https://res.cloudinary.com/dkombksnu/image/upload/v1740049183/zkdm63zrhlxptzroc6dr.png",
      offerText: "Get 15% back up to ₹120 as Amazon Pay balance",
      validUntil: "April 30, 2023",
      minTransactionValue: "₹400"
    }
  ];

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse through our restaurant menus, add items to your cart, and proceed to checkout. Your food will be delivered to your doorstep.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit/debit cards, UPI, and cash on delivery.',
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes, you can track your order in real-time using the tracking feature in the app.',
    },
    {
      question: 'What if my food arrives late?',
      answer: 'We strive to deliver on time, but if there is a delay, please contact our support team for assistance.',
    },
    {
      question: 'Do you have vegetarian options?',
      answer: 'Yes, most of our partner restaurants offer vegetarian dishes. You can filter by dietary preferences.',
    },
    {
      question: 'How do I redeem a promo code?',
      answer: 'Enter the promo code at checkout in the designated field and the discount will be applied automatically if valid.',
    },
    {
      question: 'Can I cancel an order?',
      answer: 'Orders can be cancelled within 2 minutes of placing them. After that, please contact customer service for assistance.',
    },
    {
      question: 'Is there a minimum order value?',
      answer: 'Minimum order values vary by restaurant. This information is displayed on each restaurant page.',
    },
    {
      question: 'Are there delivery charges?',
      answer: 'Delivery charges depend on your distance from the restaurant. Many restaurants offer free delivery above a certain order value.',
    },
    {
      question: 'How do I report an issue with my order?',
      answer: 'You can report issues through the "Help" section in your order details or contact our 24/7 customer support.',
    },
  ];

  // NEW: Newsletter subscription handling

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Show toast notification with top-right position
    toast.success(`Thank you for subscribing with ${email}! You'll receive exclusive offers.`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setEmail('');
  };


  // Countdown timer effect
  useEffect(() => {
    if (!showCountdown) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newSeconds = prev.seconds - 1;

        if (newSeconds >= 0) {
          return { ...prev, seconds: newSeconds };
        }

        const newMinutes = prev.minutes - 1;
        if (newMinutes >= 0) {
          return { ...prev, minutes: newMinutes, seconds: 59 };
        }

        const newHours = prev.hours - 1;
        if (newHours >= 0) {
          return { ...prev, hours: newHours, minutes: 59, seconds: 59 };
        }

        const newDays = prev.days - 1;
        if (newDays >= 0) {
          return { ...prev, days: newDays, hours: 23, minutes: 59, seconds: 59 };
        }

        // If all time is up
        clearInterval(timer);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showCountdown]);

  // Slider effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % offerSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Function to filter restaurant specials by cuisine
  const filteredRestaurants = selectedCuisineFilter === 'All'
    ? restaurantSpecials
    : restaurantSpecials.filter(restaurant => restaurant.cuisine === selectedCuisineFilter);

  // Get unique cuisines for filter
  const uniqueCuisines = ['All', ...new Set(restaurantSpecials.map(item => item.cuisine))];

  return (
    <div className="bg-gray-100 min-h-screen font-sans pt-18">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 text-center">
  <h1 className="text-3xl font-bold">Special Offers</h1>
  <p className="mt-2">Discover amazing deals on your favorite food</p>
</header>

{/* NEW: Flash Sale Banner */}
{showCountdown && (
  <div className="bg-gradient-to-r from-orange-100 to-yellow-100 py-3 text-center">
    <div className="container mx-auto px-4">
      <p className="text-lg font-bold mb-2">FLASH SALE ENDS IN</p>
      <div className="flex justify-center items-center space-x-4">
        <div className="text-center">
          <div className="bg-white text-pink-600 rounded-lg px-3 py-2 font-bold text-xl">{timeLeft.days}</div>
          <div className="text-xs mt-1">Days</div>
        </div>
        <div className="text-2xl">:</div>
        <div className="text-center">
          <div className="bg-white text-pink-600 rounded-lg px-3 py-2 font-bold text-xl">{timeLeft.hours}</div>
          <div className="text-xs mt-1">Hours</div>
        </div>
        <div className="text-2xl">:</div>
        <div className="text-center">
          <div className="bg-white text-pink-600 rounded-lg px-3 py-2 font-bold text-xl">{timeLeft.minutes}</div>
          <div className="text-xs mt-1">Mins</div>
        </div>
        <div className="text-2xl">:</div>
        <div className="text-center">
          <div className="bg-white text-pink-600 rounded-lg px-3 py-2 font-bold text-xl">{timeLeft.seconds}</div>
          <div className="text-xs mt-1">Secs</div>
        </div>
      </div>
      <button
        onClick={scrollToOffers}
        className="mt-3 bg-white text-pink-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors cursor-pointer">
        VIEW OFFERS
      </button>
    </div>
  </div>
)}

      {/* Offer Slider */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Static Container */}
          <motion.div
            className="rounded-lg overflow-hidden shadow-lg bg-white p-6 text-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Dynamic Image */}
            <motion.img
              key={offerSlides[currentSlide].image}
              src={offerSlides[currentSlide].image}
              alt={offerSlides[currentSlide].title}
              className="w-full h-64 object-cover mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* Dynamic Title */}
            <motion.h2
              key={offerSlides[currentSlide].title}
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {offerSlides[currentSlide].title}
            </motion.h2>

            {/* Dynamic Subtitle */}
            <motion.p
              key={offerSlides[currentSlide].subtitle}
              className="text-xl text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {offerSlides[currentSlide].subtitle}
            </motion.p>

            {/* Dynamic Description */}
            <motion.p
              key={offerSlides[currentSlide].description}
              className="text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {offerSlides[currentSlide].description}
            </motion.p>

            {/* Dynamic Discount */}
            <motion.p
              key={offerSlides[currentSlide].discount}
              className="text-red-600 font-bold text-lg mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {offerSlides[currentSlide].discount}
            </motion.p>

            {/* Dynamic Subtext */}
            <motion.p
              key={offerSlides[currentSlide].subtext}
              className="text-sm text-gray-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {offerSlides[currentSlide].subtext}
            </motion.p>

            {/* NEW: Action Button */}
            <motion.button
              key={`btn-${offerSlides[currentSlide].title}`}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {offerSlides[currentSlide].buttonText}
            </motion.button>
          </motion.div>

          {/* Slider Indicators */}
          <div className="flex justify-center mt-4">
            {offerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`mx-1 w-3 h-3 rounded-full ${currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Exclusive Offers Section */}
      <section ref={exclusiveOffersRef} className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Exclusive Offers</h2>
          <p className="text-center text-gray-600 mb-8">Limited time deals you won't find anywhere else</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exclusiveOffers.map(offer => (
              <div key={offer.id} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg overflow-hidden shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
                <img src={offer.image} alt={offer.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="mb-4">{offer.description}</p>
                  <div className="bg-white text-blue-600 p-3 rounded-lg mb-4 text-center font-bold cursor-pointer">
                    {offer.promoCode}
                  </div>
                  <div className="text-sm">
                    <p>Valid until: {offer.validUntil}</p>
                    <p>Min. order: {offer.minOrder}</p>
                    {offer.maxDiscount !== 'N/A' && <p>Max discount: {offer.maxDiscount}</p>}
                  </div>
                  <button className="mt-4 w-full bg-white text-blue-600 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors cursor-pointer">
                    Claim Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Offers */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Available Offers</h2>
          <p className="text-center text-gray-600 mb-8">Great deals you can use right now</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableOffers.map((offer, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">{offer.icon}</span>
                  <h3 className="text-xl font-semibold">{offer.title}</h3>
                </div>
                <p className="text-gray-600 mb-2">{offer.description}</p>
                <p className="text-green-600 font-bold">{offer.validity}</p>
                <p className="text-sm text-gray-500 mb-4">{offer.terms}</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Restaurant Special Offers */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Restaurant Special Offers</h2>
          <p className="text-center text-gray-600 mb-4">Exclusive deals from your favorite restaurants</p>

          {/* Cuisine Filter */}
          <div className="flex flex-wrap justify-center mb-6 gap-2">
            {uniqueCuisines.map(cuisine => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisineFilter(cuisine)}
                className={`px-4 py-2 rounded-full ${selectedCuisineFilter === cuisine
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors`}
              >
                {cuisine}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img src={restaurant.image} alt={restaurant.restaurant} className="w-full h-40 object-cover" />
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-sm flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{restaurant.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{restaurant.restaurant}</h3>
                  <p className="text-sm text-gray-500 mb-3">{restaurant.cuisine} • {restaurant.validDays}</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <p className="text-blue-800 font-medium">{restaurant.offer}</p>
                    <div className="flex items-center mt-2">
                      <span className="font-bold text-blue-600 mr-2">Code:</span>
                      <span className="bg-blue-100 px-2 py-1 rounded text-blue-800">{restaurant.code}</span>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cuisines */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Popular Cuisines</h2>
          <p className="text-center text-gray-600 mb-8">Explore food from around the world</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {popularCuisines.map((cuisine, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <img src={cuisine.image} alt={cuisine.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-center">{cuisine.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Payment Partner Offers</h2>
          <p className="text-center text-gray-600 mb-8">Special discounts with partner banks and wallets</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentOffers.map(offer => (
              <div
                key={offer.id}
                className="bg-gray-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={offer.logo}
                    alt={offer.bank}
                    className="h-16 w-auto object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">{offer.bank}</h3>
                <p className="text-blue-700 font-medium text-center mb-3">{offer.offerText}</p>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Valid until:</span>
                    <span className="font-medium">{offer.validUntil}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min transaction:</span>
                    <span className="font-medium">{offer.minTransactionValue}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-white border border-blue-600 text-blue-600 py-2 rounded font-semibold hover:bg-blue-50 transition-colors cursor-pointer">
                  Apply Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Frequently Asked Questions</h2>
          <p className="text-center text-gray-600 mb-8">Get answers to common questions about our offers</p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left font-semibold flex justify-between items-center"
                  onClick={() => setOpenFAQIndex(openFAQIndex === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <span className="text-blue-600">
                    {openFAQIndex === index ? '−' : '+'}
                  </span>
                </button>

                {openFAQIndex === index && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <ToastContainer />
      
      <section className="py-8 bg-gradient-to-r from-green-100 to-lime-100 text-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Get Exclusive Offers</h2>
          <p className="mb-6">Subscribe to our newsletter and never miss a discount</p>

          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="px-4 py-3 rounded-l-lg md:flex-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-r-lg font-bold hover:bg-yellow-400 transition-colors mt-2 md:mt-0 cursor-pointer"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-4 text-sm opacity-80">
            By subscribing, you agree to receive marketing emails from us. You can unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OfferPage;