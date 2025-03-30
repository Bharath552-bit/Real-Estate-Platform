"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CloudinaryUploadWidget from "@/components/CloudinaryUploadWidget";
import api from "@/utils/api"; // Axios instance with your configuration
import jwtDecode from "jwt-decode";

export default function EditProperty() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  // Store multiple images as an array
  const [imageURLs, setImageURLs] = useState([]);
  // Initialize all property fields (update keys as needed)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    price: "",
    property_type: "apartment",
    sell_or_rent: "sell",
    furnished_status: "",
    floor_number: "",
    total_floors: "",
    property_age: "",
    nearby_landmarks: "",
    parking_availability: "",
    security_features: [],
    amenities: [],
  });

  const propertyAmenities = {
    apartment: ["Gym", "Swimming Pool", "Clubhouse", "Garden", "Play Area"],
    independent_house: ["Garden", "Private Parking", "Terrace", "Security"],
    villa: ["Private Pool", "Landscaped Garden", "Security", "Garage"],
    land: ["Road Access", "Water Supply", "Electricity", "Security"],
  };

  const showPopup = (message, isError = false) => {
    setPopup({ message, isError });
    setTimeout(() => setPopup(null), 3000);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await api.get(`properties/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setFormData({
          name: data.name,
          location: data.location,
          description: data.description,
          price: data.price,
          property_type: data.property_type,
          sell_or_rent: data.sell_or_rent || "sell",
          furnished_status: data.furnished_status || "",
          floor_number: data.floor_number || "",
          total_floors: data.total_floors || "",
          property_age: data.property_age || "",
          nearby_landmarks: data.nearby_landmarks || "",
          parking_availability: data.parking_availability || "",
          security_features: data.security_features || [],
          amenities: data.amenities || [],
        });
        // Set images as an array from the backend (or empty array if none exist)
        setImageURLs(data.images || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching property details:", err.response?.data || err);
        setErrorMsg("Failed to load property details.");
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e, field) => {
    const updatedList = formData[field].includes(e.target.value)
      ? formData[field].filter((item) => item !== e.target.value)
      : [...formData[field], e.target.value];
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleUploadSuccess = (url) => {
    setImageURLs([...imageURLs, url]);
    showPopup("Image uploaded successfully!", false);
  };

  const handleRemoveImage = (index) => {
    const updated = imageURLs.filter((_, i) => i !== index);
    setImageURLs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }
      const data = new FormData();
      // Append non-array fields if not empty
      Object.entries(formData).forEach(([key, value]) => {
        if (!Array.isArray(value) && value !== "") {
          data.append(key, value);
        }
      });
      // Append array fields as JSON strings
      data.append("security_features", JSON.stringify(formData.security_features));
      data.append("amenities", JSON.stringify(formData.amenities));
      // Append images array as JSON string
      data.append("images", JSON.stringify(imageURLs));
      
      await api.put(`properties/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      showPopup("Property updated successfully!", false);
      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (err) {
      console.error("Error updating property:", err.response?.data || err);
      const errorData = err.response?.data ? err.response.data : {};
      setErrorMsg("Failed to update property. " + JSON.stringify(errorData));
    }
  };

  if (loading) return <div className="text-center mt-8 text-gray-700">Loading...</div>;
  if (errorMsg) return <div className="text-center mt-8 text-red-600">{errorMsg}</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl border border-gray-300">
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-3 rounded ${popup.isError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Edit Property</h2>
      <CloudinaryUploadWidget onUploadSuccess={handleUploadSuccess} />
      {imageURLs.length > 0 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto">
          {imageURLs.map((url, index) => (
            <div key={index} className="relative flex-shrink-0">
              <img src={url} alt={`Uploaded ${index}`} className="w-40 h-24 object-cover rounded" />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Property Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 border rounded text-gray-900"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 border rounded text-gray-900"
            required
          />
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 bg-gray-100 border rounded text-gray-900"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-3 bg-gray-100 border rounded text-gray-900"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
            className="p-3 bg-gray-100 border rounded text-gray-900"
          >
            <option value="apartment">Apartment</option>
            <option value="independent_house">Independent House</option>
            <option value="villa">Villa</option>
            <option value="land">Land</option>
          </select>
          <select
            name="sell_or_rent"
            value={formData.sell_or_rent}
            onChange={handleChange}
            className="p-3 bg-gray-100 border rounded text-gray-900"
          >
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select
            name="furnished_status"
            value={formData.furnished_status}
            onChange={handleChange}
            className="p-3 bg-gray-100 border rounded text-gray-900"
          >
            <option value="">Select Furnished Status</option>
            <option value="furnished">Furnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
          <input
            type="text"
            name="nearby_landmarks"
            placeholder="Nearby Landmarks"
            value={formData.nearby_landmarks}
            onChange={handleChange}
            className="p-3 bg-gray-100 border rounded text-gray-900"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            name="floor_number"
            placeholder="Floor Number"
            value={formData.floor_number}
            onChange={handleChange}
            className="p-3 bg-gray-100 border rounded text-gray-900"
          />
          <input
            type="number"
            name="total_floors"
            placeholder="Total Floors"
            value={formData.total_floors}
            onChange={handleChange}
            className="p-3 bg-gray-100 border rounded text-gray-900"
          />
          <select
            name="property_age"
            value={formData.property_age}
            onChange={handleChange}
            className="p-3 bg-gray-100 border rounded text-gray-900"
          >
            <option value="">Property Age</option>
            <option value="new">New</option>
            <option value="1-5">1-5 years</option>
            <option value="5-10">5-10 years</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="parking_availability"
            placeholder="Parking Availability"
            value={formData.parking_availability}
            onChange={handleChange}
            className="p-3 bg-gray-100 border rounded text-gray-900"
          />
          {/* You can add additional inputs for security_features here if needed. */}
        </div>
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold text-gray-900">Amenities</legend>
          <div className="grid grid-cols-2 gap-4">
            {propertyAmenities[formData.property_type]?.map((amenity) => (
              <label key={amenity} className="text-gray-900">
                <input
                  type="checkbox"
                  value={amenity}
                  onChange={(e) => handleCheckboxChange(e, "amenities")}                  className="mr-2"
                />
                {amenity}
              </label>
            ))}
          </div>
        </fieldset>
        <button
          type="submit"
          className="w-full bg-gradient-to-l from-[#6254b6] to-[#4634a2] cursor-pointer text-white p-3 rounded hover:bg-blue-600 transition"
        >
          Update Property
        </button>
      </form>
    </div>
  );
}
