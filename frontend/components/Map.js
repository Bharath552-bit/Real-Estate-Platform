"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ lat, lng, onLocationSelect }) => {
  const [position, setPosition] = useState([lat || 20.5937, lng || 78.9629]);

  useEffect(() => {
    if (lat && lng) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        if (onLocationSelect) {
          onLocationSelect(lat, lng);
        }
      },
    });
    return null;
  };

  return (
    <MapContainer center={position} zoom={6} className="h-72 w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} />
      <MapClickHandler />
    </MapContainer>
  );
};

export default Map;
