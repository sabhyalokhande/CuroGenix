"use client";

import { useEffect, useRef, useState } from "react";
import Map from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function getRandomStatus() {
  return Math.random() > 0.5 ? "good" : "low";
}
function getRandomStock() {
  return Math.floor(Math.random() * 1500) + 50;
}
function getRandomPharmacies() {
  return Math.floor(Math.random() * 100) + 5;
}

export default function InteractiveIndiaMapMaplibre() {
  const [cityGeoJSON, setCityGeoJSON] = useState<any>(null);
  const [popup, setPopup] = useState<any>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  // Load all Indian city boundaries from a GeoJSON file
  useEffect(() => {
    fetch("/data/india-cities.geojson")
      .then(res => res.json())
      .then(data => {
        // Assign random dummy stock data to every city
        const features = data.features.map((feature: any) => {
          const status = getRandomStatus();
          return {
            ...feature,
            properties: {
              ...feature.properties,
              status,
              stock: getRandomStock(),
              pharmacies: getRandomPharmacies()
            }
          };
        });
        setCityGeoJSON({ ...data, features });
      });
  }, []);

  // Add city and state boundaries to the map on load
  useEffect(() => {
    if (!cityGeoJSON) return;
    const map = mapRef.current && mapRef.current.getMap();
    if (!map) return;
    if (!map.getSource("cities")) {
      map.addSource("cities", { type: "geojson", data: cityGeoJSON });
      map.addLayer({
        id: "city-boundaries",
        type: "fill",
        source: "cities",
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "name"], hoveredCity],
              ["case",
                ["==", ["get", "status"], "good"], "#22c55e",
                ["==", ["get", "status"], "low"], "#ef4444",
                "#000"
              ],
            "#000"
          ],
          "fill-opacity": [
            "case",
            ["==", ["get", "name"], hoveredCity], 0.7,
            0.7
          ]
        }
      });
      map.addLayer({
        id: "city-lines",
        type: "line",
        source: "cities",
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "status"], "good"], "#16a34a",
            ["==", ["get", "status"], "low"], "#dc2626",
            "#888"
          ],
          "line-width": [
            "case",
            ["==", ["get", "name"], hoveredCity], 3,
            1
          ]
        }
      });
      // Add state boundaries as a thick line
      map.addLayer({
        id: "state-boundaries-thick",
        type: "line",
        source: "cities",
        filter: ["==", ["geometry-type"], "Polygon"],
        layout: {},
        paint: {
          "line-color": "#fff",
          "line-width": 4,
          "line-opacity": 0.7
        }
      }, "city-lines");
    }
    // Hover interaction
    map.on("mousemove", (e: any) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["city-boundaries"]
      });
      if (features.length > 0) {
        const feature = features[0];
        setHoveredCity(feature.properties.name);
        setHoveredStatus(feature.properties.status);
        setPopup({
          lngLat: e.lngLat,
          properties: feature.properties
        });
        map.getCanvas().style.cursor = "pointer";
      } else {
        setHoveredCity(null);
        setHoveredStatus(null);
        setPopup(null);
        map.getCanvas().style.cursor = "";
      }
    });
    map.on("mouseleave", "city-boundaries", () => {
      setHoveredCity(null);
      setHoveredStatus(null);
      setPopup(null);
      map.getCanvas().style.cursor = "";
    });
  }, [cityGeoJSON, hoveredCity]);

  return (
    <div style={{ width: "100%", height: "700px", borderRadius: 12, overflow: "hidden" }}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 80.9, latitude: 22.5, zoom: 4.5 }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        mapLib={maplibregl}
        attributionControl={false}
        reuseMaps
      />
      {/* Popup for hover */}
      {popup && (
        <div
          style={{
            position: "absolute",
            left: `calc(${popup.lngLat.x}px + 10px)`,
            top: `calc(${popup.lngLat.y}px - 30px)`,
            background: "#222",
            color: "#fff",
            padding: 10,
            borderRadius: 8,
            pointerEvents: "none",
            zIndex: 10,
            minWidth: 120
          }}
        >
          <div style={{ fontWeight: 700 }}>{popup.properties.name}</div>
          {popup.properties.state && (
            <div style={{ color: "#aaa", fontSize: 12 }}>{popup.properties.state}</div>
          )}
          {popup.properties.stock && (
            <div style={{ color: popup.properties.status === "good" ? "#22c55e" : "#ef4444", fontWeight: 500 }}>
              {popup.properties.status === "good" ? "Supply" : "Shortage"}: {popup.properties.stock} units
            </div>
          )}
          {popup.properties.pharmacies && (
            <div style={{ color: "#aaa", fontSize: 12 }}>Pharmacies: {popup.properties.pharmacies}</div>
          )}
          {popup.properties.status && (
            <div style={{ fontSize: 12, color: popup.properties.status === "good" ? "#22c55e" : "#ef4444" }}>
              {popup.properties.status === "good" ? "✅ Good Stock" : "⚠️ Low Stock"}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 