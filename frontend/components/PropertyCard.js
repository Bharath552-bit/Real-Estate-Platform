"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PropertyCard({ property, isWishlisted, onToggleWishlist }) {
  const [loading, setLoading] = useState(false);

  const handleWishlistClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onToggleWishlist(property.id, isWishlisted);
    } catch (error) {
      console.error("Error toggling wishlist:", error.response?.data || error.message);
    }
    setLoading(false);
  };

  // Determine thumbnail: if property.images exists and is an array with content, use the first image;
  // Otherwise, if property.image exists, use that.
  const thumbnail =
    property.images && Array.isArray(property.images) && property.images.length > 0
      ? property.images[0]
      : property.image;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out p-4 border border-gray-300 text-black"
      whileHover={{ scale: 1.02 }}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={property.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-xl font-semibold">{property.name}</h3>
        <p className="text-gray-600">{property.location}</p>
        <p className="text-teal-600 font-bold text-lg mt-2">₹{property.price}</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Link href={`/property/${property.id}`} className="text-teal-600 hover:underline">
          View Details
        </Link>
        <motion.button
          onClick={handleWishlistClick}
          whileTap={{ scale: 0.8 }}
          disabled={loading}
          className="focus:outline-none"
        >
          {loading ? (
            <span className="text-gray-500 text-2xl animate-pulse">⏳</span>
          ) : isWishlisted ? (
            <span className="text-red-500 text-2xl">❤️</span>
          ) : (
            <span className="text-gray-500 text-2xl">🤍</span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
