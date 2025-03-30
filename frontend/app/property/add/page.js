"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CloudinaryUploadWidget from "@/components/CloudinaryUploadWidget";
import api from "@/utils/api";

export default function AddProperty() {
  const router = useRouter();
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
  const [imageURL, setImageURL] = useState([]);
  const [popup, setPopup] = useState(null);

  const showPopup = (message, isError = false) => {
    setPopup({ message, isError });
    setTimeout(() => setPopup(null), 3000);
  };

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
    setImageURL([...imageURL, url]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = imageURL.filter((_, i) => i !== index);
    setImageURL(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    // Append non-array fields (only if not empty)
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (key === "security_features" || key === "amenities") {
          data.append(key, JSON.stringify(value));
        } else {
          value.forEach((item) => data.append(key, item));
        }
      } else if (value !== "") {
        data.append(key, value);
      }
    });
    // Append images only if available, as a JSON string
    if (imageURL.length > 0) {
      data.append("images", JSON.stringify(imageURL));
    }
    try {
      await api.post("properties/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showPopup("Property added successfully!", false);
      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (err) {
      console.error("Submission error:", err);
      const errorMsg =
        err.response && err.response.data
          ? JSON.stringify(err.response.data)
          : "Server error. Please try again.";
      showPopup(errorMsg, true);
    }
  };

  const propertyAmenities = {
    apartment: ["Gym", "Swimming Pool", "Clubhouse", "Garden", "Play Area","lift"],
    independent_house: ["Garden", "Private Parking", "Terrace", "Security"],
    villa: ["Private Pool", "Landscaped Garden", "Security", "Garage"],
    land: ["Road Access", "Water Supply", "Electricity", "Security"],
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl border border-gray-300">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">Add Property</h2>
      <AnimatePresence>
        {popup && (
          <motion.div
            className={`mb-4 p-3 rounded ${
              popup.isError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
            }`}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>
      <CloudinaryUploadWidget onUploadSuccess={handleUploadSuccess} />
      {imageURL.length > 0 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto">
          {imageURL.map((url, index) => (
            <div key={index} className="relative flex-shrink-0">
              <img src={url} alt="Uploaded" className="w-40 h-24 object-cover rounded" />
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
            className="p-3 bg-gray-100 border rounded text-black"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="p-3 bg-gray-100 border rounded text-black"
            required
          />
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 bg-gray-100 border rounded text-black"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-3 bg-gray-100 border rounded text-black"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
            className="p-3 bg-gray-100 border rounded text-black"
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
            className="p-3 bg-gray-100 border rounded text-black"
          >
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        {formData.property_type !== "land" && (
          <div className="grid grid-cols-2 gap-4">
            <select
              name="furnished_status"
              value={formData.furnished_status}
              onChange={handleChange}
              className="p-3 bg-gray-100 border rounded text-black"
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
              className="p-3 bg-gray-100 border rounded text-black"
            />
          </div>
        )}
        {formData.property_type === "apartment" && (
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="floor_number"
              placeholder="Floor Number"
              value={formData.floor_number}
              onChange={handleChange}
              className="p-3 bg-gray-100 border rounded text-black"
            />
            <input
              type="number"
              name="total_floors"
              placeholder="Total Floors"
              value={formData.total_floors}
              onChange={handleChange}
              className="p-3 bg-gray-100 border rounded text-black"
            />
            <select
              name="property_age"
              value={formData.property_age}
              onChange={handleChange}
              className="p-3 bg-gray-100 border rounded text-black"
            >
              <option value="">Property Age</option>
              <option value="new">New</option>
              <option value="1-5">1-5 years</option>
              <option value="5-10">5-10 years</option>
            </select>
          </div>
        )}
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold text-black">Amenities</legend>
          <div className="grid grid-cols-2 gap-4">
            {propertyAmenities[formData.property_type]?.map((amenity) => (
              <label key={amenity} className="text-black">
                <input
                  type="checkbox"
                  value={amenity}
                  onChange={(e) => handleCheckboxChange(e, "amenities")}
                  className="mr-2"
                />
                {amenity}
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded">
          Add Property
        </button>
      </form>
    </div>
  );
}
