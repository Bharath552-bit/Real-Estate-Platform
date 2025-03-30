"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";
import Footer from "../components/Footer";
import EMICalculator from "../components/EMICalculator";

export default function Home() {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Filters
  const [locationQuery, setLocationQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    let userId = null;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.user_id;
    } catch (error) {
      console.error("Error decoding token:", error);
    }

    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/properties/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        let properties = res.data;
        if (userId) {
          properties = properties.filter((prop) => prop.seller !== userId);
        }
        setAllProperties(properties);
        setFilteredProperties(properties);
      })
      .catch(() => setErrorMsg("Failed to load properties."))
      .finally(() => setLoading(false));

    axios
      .get("http://127.0.0.1:8000/api/properties/wishlist/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const wishlistPropertyIds = res.data.map((item) => item.property.id);
        setWishlistIds(wishlistPropertyIds);
      })
      .catch((error) => console.error("Error fetching wishlist:", error));
  }, [router]);

  useEffect(() => {
    let updatedList = [...allProperties];

    if (locationQuery.trim() !== "") {
      updatedList = updatedList.filter((prop) =>
        prop.location.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    if (propertyType) {
      updatedList = updatedList.filter(
        (prop) =>
          prop.property_type.toLowerCase() === propertyType.toLowerCase()
      );
    }

    if (sortOption === "price_asc") {
      updatedList.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOption === "price_desc") {
      updatedList.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    setFilteredProperties(updatedList);
  }, [locationQuery, propertyType, sortOption, allProperties]);

  const onToggleWishlist = async (propertyId, isCurrentlyWishlisted) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      if (isCurrentlyWishlisted) {
        await axios.delete(
          `http://127.0.0.1:8000/api/properties/wishlist/remove/${propertyId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlistIds((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await axios.post(
          `http://127.0.0.1:8000/api/properties/wishlist/add/`,
          { property: propertyId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistIds((prev) => [...prev, propertyId]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading properties...
        </p>
      </div>
    );

  return (
    <>
      {/* Full-width Search & Filter Bar */}
      <div className="bg-white shadow-lg p-6 border-b border-gray-300 text-black w-full">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="🔍 Search by location..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="p-3 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 w-full"
          />
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="p-3 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="">🏠 All Property Types</option>
            <option value="sell">📌 Sell</option>
            <option value="rent">🛏️ Rent</option>
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-3 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="">📊 Sort By</option>
            <option value="price_asc">⬇️ Price: Low to High</option>
            <option value="price_desc">⬆️ Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Section - Scrollable Property Listings */}
        <div className="md:col-span-3 overflow-y-auto max-h-screen pr-4">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 text-center">
            🏡 Explore Properties
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isWishlisted={wishlistIds.includes(property.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>

        {/* Right Section - Fixed EMI Calculator */}
        <div className="md:col-span-1 sticky top-6 h-full">
          <EMICalculator />
        </div>
      </div>

      <Footer />
    </>
  );
}
