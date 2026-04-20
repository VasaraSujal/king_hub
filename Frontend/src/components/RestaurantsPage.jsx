import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer"

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("https://king-hub-1.onrender.com/api/restaurants");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter restaurants based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRestaurants(restaurants); // Show all restaurants if search is empty
    } else {
      const filtered = restaurants.filter((restaurant) =>
        restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        {/* Modern Tailwind Loader */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="text-lg text-gray-700 font-medium">Loading restaurants...</p>
      </div>
    );

  if (error)
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  return (
    <>
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8 lg:px-16 pt-25">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">All Restaurants</h1>

      {/* Search Bar */}
      <form
        className="mb-8 flex justify-center"
        onSubmit={(e) => e.preventDefault()} // Prevent page refresh on submit
      >
        <input
          type="text"
          placeholder="Search by location..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition duration-300 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                {restaurant.isPromoted && (
                  <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    Promoted
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
                <p className="text-gray-700 text-sm">
                  {restaurant.cuisine} • {restaurant.price} • ⭐ {restaurant.rating}
                </p>
                <p className="text-gray-600 text-sm">{restaurant.location}</p>

                {restaurant.discount && (
                  <div className="mt-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 inline-block rounded">
                    {restaurant.discount}
                  </div>
                )}

                {/* Opening Time */}
                <p className="text-red-500 font-semibold mt-2 text-sm">
                  {restaurant.openingTime}
                </p>

                {/* Contact Details */}
                <p className="text-gray-700 text-sm mt-2">
                  📞 Contact: <span className="font-medium">{restaurant.contact}</span>
                </p>

                <button
                  onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                  className="mt-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-full shadow-md hover:from-blue-500 hover:to-purple-600 transition duration-300 ease-in-out cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No restaurants found for this location.
          </p>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default RestaurantsPage;