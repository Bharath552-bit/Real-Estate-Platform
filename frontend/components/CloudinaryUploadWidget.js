"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";

function CloudinaryWidgetButton({ onUploadSuccess }) {
  useEffect(() => {
    if (!window.cloudinary) {
      console.error("Cloudinary widget script not loaded.");
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dh80llo0m", // Replace with your Cloudinary cloud name
        uploadPreset: "realestate", // Replace with your upload preset name
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary widget error:", error);
        }
        if (!error && result && result.event === "success") {
          console.log("Upload successful:", result.info);
          onUploadSuccess(result.info.secure_url);
        }
      }
    );

    const button = document.getElementById("upload_widget");
    if (button) {
      const clickHandler = () => widget.open();
      button.addEventListener("click", clickHandler);
      return () => {
        button.removeEventListener("click", clickHandler);
      };
    }
  }, [onUploadSuccess]);

  return (
    <button
      id="upload_widget"
      className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition"
    >
      Upload Image
    </button>
  );
}

export default function CloudinaryUploadWidget({ onUploadSuccess }) {
  const [cloudinaryLoaded, setCloudinaryLoaded] = useState(false);

  useEffect(() => {
    // Check if the Cloudinary script has already loaded
    if (window.cloudinary) {
      setCloudinaryLoaded(true);
    }
  }, []);

  return (
    <>
      {/* If the script isn't loaded, load it */}
      {!cloudinaryLoaded && (
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log("Cloudinary widget script loaded in component");
            setCloudinaryLoaded(true);
          }}
        />
      )}
      {cloudinaryLoaded ? (
        <CloudinaryWidgetButton onUploadSuccess={onUploadSuccess} />
      ) : (
        <div>Loading upload widget...</div>
      )}
    </>
  );
}
