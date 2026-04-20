
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SuccessPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const location = useLocation();
  const getItemName = (item) => item.foodname || item.itemName || item.name || 'Food Item';
  
  // Get cart data from route state or local storage as fallback
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    // Try to get cart items from location state first
    const stateCartItems = location.state?.cartItems;
    
    if (stateCartItems && stateCartItems.length > 0) {
      setCartItems(stateCartItems);
    } else {
      // Fallback to localStorage if no items in state
      try {
        const savedCartItems = localStorage.getItem('cartItems');
        if (savedCartItems) {
          setCartItems(JSON.parse(savedCartItems));
        }
      } catch (error) {
        console.error('Error retrieving cart from localStorage:', error);
      }
    }
  }, [location.state]);

  // Calculate total bill correctly from cart items
  const totalBill = cartItems.reduce(
    (acc, item) => acc + (item.price * (item.quantity || 1)), 
    0
  ).toFixed(2);

  // Generate a random order number
  useEffect(() => {
    const generateOrderNumber = () => {
      return `#${Math.floor(100000 + Math.random() * 900000)}`;
    };
    setOrderNumber(generateOrderNumber());
  }, []);

  // Copy order number to clipboard
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="bg-blue-50 rounded-2xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full">
        {/* Success Indicator */}
        <div className="flex flex-col items-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">
            Payment Successful
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-xl">
            Thank you for your purchase! Your transaction has been completed successfully.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-700">Order Number:</span>
            <div className="flex items-center">
              <span className="font-bold text-blue-700 mr-2">{orderNumber}</span>
              <button
                onClick={copyOrderNumber}
                className="text-gray-500 hover:text-blue-600 transition"
                aria-label="Copy Order Number"
              >
                {isCopied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Order Item Details */}
          <div className="space-y-2 mb-4">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={index} className="flex justify-between text-gray-600">
                  <span>{getItemName(item)} × {item.quantity || 1}</span>
                  <span>₹{(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-2">No items in order</div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-blue-700">₹{totalBill}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200 transition transform hover:scale-105 active:scale-95"
            >
              Download Receipt
            </button>
            <button
              className="flex items-center justify-center bg-green-100 text-green-700 py-3 rounded-lg hover:bg-green-200 transition transform hover:scale-105 active:scale-95"
            >
              Share Order
            </button>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center">
          <a
            href="/"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 shadow-lg transform hover:scale-105 active:scale-95"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;