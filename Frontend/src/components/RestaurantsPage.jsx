import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter((restaurant) =>
        restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  const heroStats = useMemo(
    () => [
      { label: "Restaurants", value: restaurants.length.toString().padStart(2, "0") },
      { label: "Avg. Rating", value: "4.8" },
      { label: "Delivery Ready", value: "24/7" },
    ],
    [restaurants.length]
  );

  const getRestaurantImage = (restaurant) =>
    restaurant?.image || restaurant?.bgImage || "https://via.placeholder.com/800x500?text=Restaurant+Image";

  if (loading) {
    return (
      <div className="min-h-screen pt-28 bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center space-y-4 px-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-lg font-medium text-slate-700">Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 bg-gradient-to-b from-slate-50 to-white px-4 flex items-center justify-center">
        <div className="max-w-xl rounded-3xl border border-red-100 bg-white p-8 shadow-lg text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Unable to load</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Restaurants could not be loaded</h1>
          <p className="mt-3 text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/60 pt-24 pb-14 text-slate-800">
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 rounded-[2rem] border border-blue-100 bg-white shadow-xl p-6 sm:p-8">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              Explore restaurants
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
              Discover the best kitchens near your area.
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600 leading-relaxed">
              Search by location, compare cuisines, and open a restaurant page with a cleaner premium browsing flow.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-xl">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-4">
                  <p className="text-2xl font-extrabold text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-sm font-semibold text-blue-700">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-[2rem] border border-blue-100 bg-slate-950 text-white shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 h-full flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Search focus</p>
                <h2 className="mt-3 text-2xl font-bold">Filter by location and keep the results centered.</h2>
                <p className="mt-3 text-slate-300 leading-relaxed">
                  The page is intentionally narrower to improve readability and make each restaurant card feel more premium.
                </p>
              </div>

              <form className="mt-8 flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="min-w-0 flex-1 rounded-full border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="rounded-full bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Restaurant list</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950">All restaurants</h2>
          </div>
          <p className="text-slate-600">
            {filteredRestaurants.length} {filteredRestaurants.length === 1 ? "result" : "results"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-6">
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <article
                key={restaurant._id}
                className="group overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getRestaurantImage(restaurant)}
                    alt={restaurant.name}
                    className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(event) => {
                      const fallbackSrc = "https://via.placeholder.com/800x500?text=Restaurant+Image";
                      if (event.currentTarget.src !== fallbackSrc) {
                        event.currentTarget.src = fallbackSrc;
                      }
                    }}
                  />
                  {restaurant.isPromoted && (
                    <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950 shadow">
                      Promoted
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/65 to-transparent" />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">{restaurant.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">{restaurant.cuisine}</p>
                    </div>
                    <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                      ⭐ {restaurant.rating}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Location</p>
                      <p className="mt-1 font-medium text-slate-800">{restaurant.location}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Delivery</p>
                      <p className="mt-1 font-medium text-slate-800">{restaurant.deliveryTime || "30-40 mins"}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    {restaurant.discount && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                        {restaurant.discount}
                      </span>
                    )}
                    <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                      {restaurant.openingTime || restaurant.openTime || "Open today"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-slate-600">
                    📞 {restaurant.contact}
                  </p>

                  <button
                    onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-3 font-semibold text-white shadow-lg shadow-slate-900/10 transition-colors hover:bg-slate-800 cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-blue-200 bg-white/80 p-10 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">No results</p>
            <h3 className="mt-3 text-2xl font-bold text-slate-950">No restaurants found for this location.</h3>
            <p className="mt-2 text-slate-600">Try a different location or clear the search field.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default RestaurantsPage;
