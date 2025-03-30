"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

export default function Dashboard() {
  const router = useRouter();
  const { username, accessToken, logout } = useAuthStore();
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [properties, setProperties] = useState([]);

  // Update currentUser from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("username");
      setCurrentUser(storedName || username || "User");
    }
  }, [username, accessToken]);

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    setLoading(true);
    // Fetch properties and wishlist concurrently
    Promise.all([
      axios.get("http://127.0.0.1:8000/api/properties/user/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      axios.get("http://127.0.0.1:8000/api/properties/wishlist/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ])
      .then(([propertiesRes, wishlistRes]) => {
        setProperties(propertiesRes.data);
        setWishlist(wishlistRes.data);
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, [accessToken, router]);

  const handleDelete = async (propertyId) => {
    if (!accessToken) return;
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/properties/${propertyId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProperties((prev) => prev.filter((prop) => prop.id !== propertyId));
      alert("Property deleted successfully.");
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  const handleRemoveFromWishlist = async (propertyId) => {
    if (!accessToken) return;
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/properties/wishlist/remove/${propertyId}/`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setWishlist((prev) =>
        prev.filter((item) => item.property.id !== propertyId)
      );
      alert("Removed from wishlist successfully.");
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  // Helper function: returns the first image from an array, or the single image if not an array
  const getThumbnail = (property) => {
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      return property.images[0];
    } else if (property.image) {
      return property.image;
    }
    return null;
  };

  if (loading)
    return <div className="text-center mt-8 text-black">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl border border-gray-300">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">Dashboard</h2>
      <p className="text-center text-black">Welcome, {currentUser}!</p>

      {/* Properties Added by User */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-black mb-4">Your Properties</h3>
        {properties.length === 0 ? (
          <p className="text-center text-black">You have not added any properties.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => {
              const thumbnail = getThumbnail(property);
              return (
                <div
                  key={property.id}
                  className="bg-white rounded-lg shadow overflow-hidden border border-gray-300 hover:shadow-lg transition"
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-black">
                      {property.name || "Untitled Property"}
                    </h3>
                    <p className="text-gray-700">
                      {property.description
                        ? property.description.substring(0, 100) + "..."
                        : "No description available"}
                    </p>
                    <div className="flex justify-between mt-4">
                      <span className="text-green-600 font-semibold">
                        ₹{property.price}
                      </span>
                      <span className="text-gray-700">{property.location}</span>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Link href={`/property/${property.id}`}>
                        <button className="bg-gradient-to-l from-[#6254b6] to-[#4634a2] text-white py-1 px-3 rounded hover:bg-blue-700 transition">
                          View Details
                        </button>
                      </Link>
                      <Link href={`/property/edit/${property.id}`}>
                        <button className="bg-gray-200 text-black py-1 px-3 rounded hover:bg-gray-300 transition">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Wishlist */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-black mb-4">Your Wishlist</h3>
        {wishlist.length === 0 ? (
          <p className="text-center text-black">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlist.map((item) => {
              const property = item.property;
              const thumbnail = getThumbnail(property);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow overflow-hidden border border-gray-300 hover:shadow-lg transition"
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-black">
                      {property.name || "Unnamed Property"}
                    </h3>
                    <p className="text-gray-700">
                      {property.description
                        ? property.description.substring(0, 100) + "..."
                        : "No description available"}
                    </p>
                    <div className="flex justify-between mt-4">
                      <span className="text-green-600 font-semibold">
                        ₹{property.price}
                      </span>
                      <span className="text-gray-700">{property.location}</span>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Link href={`/property/${property.id}`}>
                        <button className="bg-gradient-to-l from-[#6254b6] to-[#4634a2] text-white py-1 px-3 rounded hover:bg-blue-700 transition">
                          View Details
                        </button>
                      </Link>
                      <button
                        onClick={() => handleRemoveFromWishlist(property.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <Link href="/property/add">
          <button className="bg-gradient-to-l from-[#6254b6] to-[#4634a2] text-white py-2 px-4 rounded hover:bg-gray-300 transition">
            Add New Property
          </button>
        </Link>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-300 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
