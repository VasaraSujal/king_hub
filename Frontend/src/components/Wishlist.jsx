import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";

const Wishlist = ({ wishlistItems = [], toggleWishlist, addToCart }) => {
  const getItemName = (item) => item?.foodname || item?.itemName || item?.name || "Food Item";
  const getItemImage = (item) => item?.imageUrl || item?.image || item?.bgImage || "https://via.placeholder.com/300x200?text=Food+Image";
  const getFallbackItemImage = (item) => {
    const itemName = encodeURIComponent(getItemName(item));
    return `https://via.placeholder.com/300x200?text=${itemName}`;
  };
  const getItemPrice = (item) => Number(item?.price ?? item?.totalPrice ?? 0);

  const handleRemove = (item) => {
    if (typeof toggleWishlist === "function") {
      toggleWishlist(item);
    }
  };

  const handleAddToCart = (item) => {
    if (typeof addToCart === "function") {
      addToCart(item);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-rose-100 bg-white/85 p-6 shadow-lg backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Link to="/menu" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-3 cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to menu
              </Link>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Wishlist</h1>
              <p className="mt-3 max-w-2xl text-slate-600 text-lg">
                Saved dishes that you can move to cart whenever you’re ready.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 border border-rose-100 shadow-sm">
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
              <span className="font-semibold text-slate-800">{wishlistItems.length} saved</span>
            </div>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xl sm:p-12">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
              <Heart className="h-10 w-10 text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No saved items yet</h2>
            <p className="mb-6 text-slate-600">
              Tap the heart on any dish to save it here for later.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-3 text-white font-semibold shadow-lg transition-colors hover:bg-rose-600 cursor-pointer"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {wishlistItems.map((item) => {
              const itemName = getItemName(item);
              const itemPrice = getItemPrice(item);

              return (
                <div key={item._id || item.id || itemName} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <div className="relative h-56">
                    <img
                      src={getItemImage(item)}
                      alt={itemName}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(event) => {
                        const fallbackSrc = getFallbackItemImage(item);
                        if (event.currentTarget.src !== fallbackSrc) {
                          event.currentTarget.src = fallbackSrc;
                        }
                      }}
                    />
                    <div className="absolute right-3 top-3 rounded-full bg-white/95 p-2 shadow-md">
                      <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h2 className="text-xl font-bold leading-tight text-slate-900">{itemName}</h2>
                      <span className="text-lg font-bold text-rose-600">₹{itemPrice.toFixed(2)}</span>
                    </div>

                    <p className="mb-5 line-clamp-2 text-sm text-slate-600">
                      {item.description || "A tasty saved item ready to be added to your cart."}
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-slate-800 cursor-pointer"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="inline-flex items-center justify-center rounded-xl bg-rose-50 px-4 py-3 font-semibold text-rose-600 transition-colors hover:bg-rose-100 cursor-pointer"
                        aria-label={`Remove ${itemName} from wishlist`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
