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
      <div className="flex items-center justify-center h-screen bg-gray-200">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading properties...
        </p>
      </div>
    );

  return (
    <>
      {/* Full-width Search & Filter Bar */}
      <div className="w-full p-6 text-black bg-white border-b border-gray-300 shadow-lg">
        <div className="container grid grid-cols-1 gap-4 mx-auto md:grid-cols-3">
          <input
            type="text"
            placeholder="🔍 Search by location..."
            value={locationQuery}
            
onChange={(e) => setLocationQuery(e.target.value)}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full p-3 text-black bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">🏠 All Property Types</option>
              <option value="apartment">Apartment</option>
              <option value="independent_house">Independent House</option>
              <option value="villa">Villa</option>
              <option value="land">Land</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">📊 Sort By</option>
            <option value="price_asc">⬇️ Price: Low to High</option>
            <option value="price_desc">⬆️ Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container grid min-h-screen grid-cols-1 gap-6 p-6 mx-auto bg-gray-100 md:grid-cols-4">
        {/* Left Section - Scrollable Property Listings */}
        <div className="max-h-screen pr-4 overflow-y-auto md:col-span-3">
          <h1 className="mb-6 text-4xl font-bold text-center text-gray-900">
            🏡 Explore Properties
          </h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
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
        <div className="sticky h-full md:col-span-1 top-6">
          <EMICalculator />
        </div>
      </div>

      <Footer />
    </>
  );
}