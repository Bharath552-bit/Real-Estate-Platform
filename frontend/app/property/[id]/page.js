"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import jwtDecode from "jwt-decode";
import dynamic from "next/dynamic";

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function PropertyDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("accessToken");
    let userId = null;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        userId = decoded.user_id;
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }

    api
      .get(`properties/${id}/`)
      .then((res) => {
        setProperty(res.data);
        if (res.data.seller === userId) {
          setIsOwner(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching property:", err);
        setError(
          err.response?.status === 404
            ? "Property not found"
            : "An error occurred while fetching data"
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleContactSeller = async () => {
    if (!property?.id || !property?.seller) return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const response = await api.post(
        "chats/rooms/create/",
        { property: property.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const chatRoomId = response.data.id;
      router.push(`/chat/${chatRoomId}`);
    } catch (err) {
      console.error("Error creating chat room:", err.response?.data || err);
      setError("Unable to connect with the seller. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  // Helper function to safely parse JSON fields (if needed)
  const parseField = (field) => {
    try {
      return typeof field === "string" ? JSON.parse(field) : field;
    } catch {
      return field;
    }
  };

  const amenities = property.amenities ? parseField(property.amenities) : [];
  const securityFeatures = property.security_features
    ? parseField(property.security_features)
    : [];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="w-full h-96 flex overflow-x-auto space-x-2 p-5">
          {Array.isArray(property.images) && property.images.length > 0 ? (
            property.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Property Image ${index + 1}`}
                className="h-96 w-auto object-cover rounded"
              />
            ))
          ) : property.images ? (
            <img
              src={property.images}
              alt={property.name || "Property Image"}
              className="w-full h-full object-cover p-5 rounded"
            />
          ) : (
            <img
              src="/default-property.jpg"
              alt="Property Image"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {property.name || "No title available"}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {property.description || "No description available"}
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="block text-gray-500">Price</span>
              <span className="text-2xl font-semibold text-green-600">
                {property.price
                  ? property.sell_or_rent === "rent"
                    ? `₹${property.price}/month`
                    : `₹${property.price}`
                  : "N/A"}
              </span>
            </div>

            <div>
              <span className="block text-gray-500">Sell or Rent</span>
              <span className="text-xl text-gray-700">
                {property.sell_or_rent === "rent" ? "For Rent" : "For Sale"}
              </span>
            </div>

            <div>
              <span className="block text-gray-500">Location</span>
              <span className="text-xl text-gray-700">
                {property.location || "Location not specified"}
              </span>
            </div>

            <div>
              <span className="block text-gray-500">Property Type</span>
              <span className="text-xl text-gray-700">
                {property.property_type || "N/A"}
              </span>
            </div>

            {property.property_type !== "land" && (
              <div>
                <span className="block text-gray-500">Furnished Status</span>
                <span className="text-xl text-gray-700">
                  {property.furnished_status || "N/A"}
                </span>
              </div>
            )}

            {property.property_type === "apartment" && (
              <>
                <div>
                  <span className="block text-gray-500">Floor Number</span>
                  <span className="text-xl text-gray-700">
                    {property.floor_number || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500">Total Floors</span>
                  <span className="text-xl text-gray-700">
                    {property.total_floors || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500">Property Age</span>
                  <span className="text-xl text-gray-700">
                    {property.property_age || "N/A"}
                  </span>
                </div>
              </>
            )}

            {property.nearby_landmarks && (
              <div className="col-span-2">
                <span className="block text-gray-500">Nearby Landmarks</span>
                <span className="text-xl text-gray-700">
                  {property.nearby_landmarks}
                </span>
              </div>
            )}

            {property.parking_availability && (
              <div>
                <span className="block text-gray-500">
                  Parking Availability
                </span>
                <span className="text-xl text-gray-700">
                  {property.parking_availability}
                </span>
              </div>
            )}

            {securityFeatures && securityFeatures.length > 0 && (
              <div className="col-span-2">
                <span className="block text-gray-500">
                  Security Features
                </span>
                <ul className="list-disc list-inside text-gray-700">
                  {securityFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {amenities && amenities.length > 0 && (
              <div className="col-span-2">
                <span className="block text-gray-500">Amenities</span>
                <ul className="list-disc list-inside text-gray-700">
                  {amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {!isOwner && (
            <div className="mt-8">
              <button
                onClick={handleContactSeller}
                disabled={!property?.seller}
                className={`w-full py-3 rounded-lg shadow transition duration-300 ${
                  property?.seller
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {property?.seller
                  ? `Contact ${property.seller_name || "Seller"}`
                  : "Seller not available"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
