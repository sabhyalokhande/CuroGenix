"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
)
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
)
const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
)

// Import Leaflet only on client side
let L: any = null
if (typeof window !== 'undefined') {
  L = require('leaflet')
  require('leaflet/dist/leaflet.css')
}

// India state data with coordinates and medicine stock information
const indiaStates = [
  { name: 'Maharashtra', lat: 19.7515, lng: 75.7139, status: 'good', stock: 1247, pharmacies: 89 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025, status: 'low', stock: 156, pharmacies: 12 },
  { name: 'Karnataka', lat: 15.3173, lng: 75.7139, status: 'good', stock: 892, pharmacies: 67 },
  { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, status: 'low', stock: 234, pharmacies: 18 },
  { name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569, status: 'good', stock: 756, pharmacies: 54 },
  { name: 'Gujarat', lat: 22.2587, lng: 71.1924, status: 'low', stock: 189, pharmacies: 15 },
  { name: 'Punjab', lat: 31.1471, lng: 75.3412, status: 'good', stock: 445, pharmacies: 32 },
  { name: 'Andhra Pradesh', lat: 15.9129, lng: 79.7400, status: 'low', stock: 267, pharmacies: 21 },
  { name: 'Telangana', lat: 18.1124, lng: 79.0193, status: 'good', stock: 634, pharmacies: 48 },
  { name: 'West Bengal', lat: 22.9868, lng: 87.8550, status: 'low', stock: 198, pharmacies: 16 },
  { name: 'Rajasthan', lat: 27.0238, lng: 74.2179, status: 'good', stock: 523, pharmacies: 39 },
  { name: 'Madhya Pradesh', lat: 23.5937, lng: 78.9629, status: 'low', stock: 145, pharmacies: 11 },
  { name: 'Bihar', lat: 25.0961, lng: 85.3131, status: 'low', stock: 89, pharmacies: 7 },
  { name: 'Odisha', lat: 20.9517, lng: 85.0985, status: 'good', stock: 378, pharmacies: 28 },
  { name: 'Kerala', lat: 10.8505, lng: 76.2711, status: 'good', stock: 567, pharmacies: 42 },
  { name: 'Assam', lat: 26.2006, lng: 92.9376, status: 'low', stock: 123, pharmacies: 9 },
  { name: 'Jharkhand', lat: 23.6102, lng: 85.2799, status: 'low', stock: 78, pharmacies: 6 },
  { name: 'Chhattisgarh', lat: 21.2787, lng: 81.8661, status: 'good', stock: 234, pharmacies: 17 },
  { name: 'Haryana', lat: 29.0588, lng: 76.0856, status: 'good', stock: 345, pharmacies: 26 },
  { name: 'Uttarakhand', lat: 30.0668, lng: 79.0193, status: 'low', stock: 67, pharmacies: 5 },
  { name: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, status: 'good', stock: 189, pharmacies: 14 },
  { name: 'Tripura', lat: 23.9408, lng: 91.9882, status: 'low', stock: 45, pharmacies: 3 },
  { name: 'Meghalaya', lat: 25.4670, lng: 91.3662, status: 'low', stock: 34, pharmacies: 2 },
  { name: 'Manipur', lat: 24.6637, lng: 93.9063, status: 'low', stock: 23, pharmacies: 2 },
  { name: 'Nagaland', lat: 26.1584, lng: 94.5624, status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Goa', lat: 15.2993, lng: 74.1240, status: 'good', stock: 156, pharmacies: 12 },
  { name: 'Arunachal Pradesh', lat: 28.2180, lng: 94.7278, status: 'low', stock: 8, pharmacies: 1 },
  { name: 'Mizoram', lat: 23.7307, lng: 92.7173, status: 'low', stock: 15, pharmacies: 1 },
  { name: 'Sikkim', lat: 27.5330, lng: 88.5122, status: 'low', stock: 9, pharmacies: 1 },
  { name: 'Jammu and Kashmir', lat: 33.7782, lng: 76.5762, status: 'good', stock: 234, pharmacies: 18 },
  { name: 'Ladakh', lat: 34.1526, lng: 77.5771, status: 'low', stock: 23, pharmacies: 2 },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, status: 'good', stock: 89, pharmacies: 7 },
  { name: 'Dadra and Nagar Haveli', lat: 20.1809, lng: 72.8311, status: 'low', stock: 34, pharmacies: 2 },
  { name: 'Daman and Diu', lat: 20.3974, lng: 72.8328, status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Lakshadweep', lat: 10.5667, lng: 72.6417, status: 'low', stock: 5, pharmacies: 1 },
  { name: 'Puducherry', lat: 11.9416, lng: 79.8083, status: 'good', stock: 67, pharmacies: 5 },
  { name: 'Andaman and Nicobar Islands', lat: 11.7401, lng: 92.6586, status: 'low', stock: 8, pharmacies: 1 }
] as const

// Major cities data with coordinates and medicine stock
const majorCities = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra', status: 'good', stock: 456, pharmacies: 34 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025, state: 'Delhi', status: 'low', stock: 156, pharmacies: 12 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, state: 'Karnataka', status: 'good', stock: 345, pharmacies: 26 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', status: 'good', stock: 234, pharmacies: 18 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal', status: 'low', stock: 123, pharmacies: 9 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana', status: 'good', stock: 289, pharmacies: 22 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra', status: 'good', stock: 198, pharmacies: 15 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat', status: 'low', stock: 89, pharmacies: 7 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan', status: 'good', stock: 156, pharmacies: 12 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', status: 'low', stock: 78, pharmacies: 6 },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh', status: 'low', stock: 45, pharmacies: 3 },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882, state: 'Maharashtra', status: 'good', stock: 123, pharmacies: 9 },
  { name: 'Indore', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh', status: 'low', stock: 67, pharmacies: 5 },
  { name: 'Thane', lat: 19.2183, lng: 72.9781, state: 'Maharashtra', status: 'good', stock: 134, pharmacies: 10 },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh', status: 'low', stock: 34, pharmacies: 2 },
  { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh', status: 'low', stock: 56, pharmacies: 4 },
  { name: 'Patna', lat: 25.5941, lng: 85.1376, state: 'Bihar', status: 'low', stock: 23, pharmacies: 2 },
  { name: 'Vadodara', lat: 22.3072, lng: 73.1812, state: 'Gujarat', status: 'low', stock: 45, pharmacies: 3 },
  { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538, state: 'Uttar Pradesh', status: 'low', stock: 34, pharmacies: 2 },
  { name: 'Ludhiana', lat: 30.9010, lng: 75.8573, state: 'Punjab', status: 'good', stock: 89, pharmacies: 7 },
  { name: 'Agra', lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh', status: 'low', stock: 23, pharmacies: 2 },
  { name: 'Nashik', lat: 19.9975, lng: 73.7898, state: 'Maharashtra', status: 'good', stock: 78, pharmacies: 6 },
  { name: 'Faridabad', lat: 28.4089, lng: 77.3178, state: 'Haryana', status: 'good', stock: 67, pharmacies: 5 },
  { name: 'Meerut', lat: 28.9845, lng: 77.7064, state: 'Uttar Pradesh', status: 'low', stock: 34, pharmacies: 2 },
  { name: 'Rajkot', lat: 22.3039, lng: 70.8022, state: 'Gujarat', status: 'low', stock: 23, pharmacies: 2 },
  { name: 'Kalyan-Dombivali', lat: 19.2350, lng: 73.1295, state: 'Maharashtra', status: 'good', stock: 56, pharmacies: 4 },
  { name: 'Vasai-Virar', lat: 19.4259, lng: 72.8225, state: 'Maharashtra', status: 'good', stock: 45, pharmacies: 3 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh', status: 'low', stock: 34, pharmacies: 2 },
  { name: 'Srinagar', lat: 34.0837, lng: 74.7973, state: 'Jammu and Kashmir', status: 'good', stock: 67, pharmacies: 5 },
  { name: 'Aurangabad', lat: 19.8762, lng: 75.3433, state: 'Maharashtra', status: 'good', stock: 45, pharmacies: 3 },
  { name: 'Dhanbad', lat: 23.7957, lng: 86.4304, state: 'Jharkhand', status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Amritsar', lat: 31.6340, lng: 74.8723, state: 'Punjab', status: 'good', stock: 56, pharmacies: 4 },
  { name: 'Allahabad', lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh', status: 'low', stock: 23, pharmacies: 2 },
  { name: 'Ranchi', lat: 23.3441, lng: 85.3096, state: 'Jharkhand', status: 'low', stock: 8, pharmacies: 1 },
  { name: 'Howrah', lat: 22.5958, lng: 88.2636, state: 'West Bengal', status: 'low', stock: 34, pharmacies: 2 },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu', status: 'good', stock: 78, pharmacies: 6 },
  { name: 'Jabalpur', lat: 23.1815, lng: 79.9864, state: 'Madhya Pradesh', status: 'low', stock: 23, pharmacies: 2 },
  { name: 'Gwalior', lat: 26.2183, lng: 78.1828, state: 'Madhya Pradesh', status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Vijayawada', lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh', status: 'low', stock: 45, pharmacies: 3 },
  { name: 'Jodhpur', lat: 26.2389, lng: 73.0243, state: 'Rajasthan', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu', status: 'good', stock: 56, pharmacies: 4 },
  { name: 'Raipur', lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh', status: 'good', stock: 45, pharmacies: 3 },
  { name: 'Kota', lat: 25.2138, lng: 75.8648, state: 'Rajasthan', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362, state: 'Assam', status: 'low', stock: 34, pharmacies: 2 },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, state: 'Chandigarh', status: 'good', stock: 89, pharmacies: 7 },
  { name: 'Solapur', lat: 17.6599, lng: 75.9064, state: 'Maharashtra', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Hubli-Dharwad', lat: 15.3647, lng: 75.1240, state: 'Karnataka', status: 'good', stock: 45, pharmacies: 3 },
  { name: 'Mysore', lat: 12.2958, lng: 76.6394, state: 'Karnataka', status: 'good', stock: 56, pharmacies: 4 },
  { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047, state: 'Tamil Nadu', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Bareilly', lat: 28.3670, lng: 79.4304, state: 'Uttar Pradesh', status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Aligarh', lat: 27.8974, lng: 78.0880, state: 'Uttar Pradesh', status: 'low', stock: 8, pharmacies: 1 },
  { name: 'Tiruppur', lat: 11.1085, lng: 77.3411, state: 'Tamil Nadu', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Gurgaon', lat: 28.4595, lng: 77.0266, state: 'Haryana', status: 'good', stock: 78, pharmacies: 6 },
  { name: 'Moradabad', lat: 28.8389, lng: 78.7738, state: 'Uttar Pradesh', status: 'low', stock: 6, pharmacies: 1 },
  { name: 'Jalandhar', lat: 31.3260, lng: 75.5762, state: 'Punjab', status: 'good', stock: 45, pharmacies: 3 },
  { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, state: 'Kerala', status: 'good', stock: 67, pharmacies: 5 },
  { name: 'Salem', lat: 11.6643, lng: 78.1460, state: 'Tamil Nadu', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Warangal', lat: 17.9689, lng: 79.5941, state: 'Telangana', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Guntur', lat: 16.2991, lng: 80.4575, state: 'Andhra Pradesh', status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Bhiwandi', lat: 19.2965, lng: 73.0631, state: 'Maharashtra', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Saharanpur', lat: 29.9675, lng: 77.5536, state: 'Uttar Pradesh', status: 'low', stock: 8, pharmacies: 1 },
  { name: 'Gorakhpur', lat: 26.7606, lng: 83.3732, state: 'Uttar Pradesh', status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Bikaner', lat: 28.0229, lng: 73.3119, state: 'Rajasthan', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Amravati', lat: 20.9374, lng: 77.7796, state: 'Maharashtra', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Noida', lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh', status: 'good', stock: 67, pharmacies: 5 },
  { name: 'Jamshedpur', lat: 22.8046, lng: 86.2029, state: 'Jharkhand', status: 'low', stock: 23, pharmacies: 2 },
  { name: 'Bhilai', lat: 21.5189, lng: 81.2835, state: 'Chhattisgarh', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Cuttack', lat: 20.4625, lng: 85.8830, state: 'Odisha', status: 'good', stock: 45, pharmacies: 3 },
  { name: 'Firozabad', lat: 27.1591, lng: 78.3958, state: 'Uttar Pradesh', status: 'low', stock: 6, pharmacies: 1 },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673, state: 'Kerala', status: 'good', stock: 56, pharmacies: 4 },
  { name: 'Nellore', lat: 14.4426, lng: 79.9865, state: 'Andhra Pradesh', status: 'low', stock: 8, pharmacies: 1 },
  { name: 'Bhavnagar', lat: 21.7645, lng: 72.1519, state: 'Gujarat', status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Dehradun', lat: 30.3165, lng: 78.0322, state: 'Uttarakhand', status: 'low', stock: 23, pharmacies: 2 },
  { name: 'Durgapur', lat: 23.5204, lng: 87.3119, state: 'West Bengal', status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Asansol', lat: 23.6889, lng: 86.9661, state: 'West Bengal', status: 'low', stock: 8, pharmacies: 1 },
  { name: 'Rourkela', lat: 22.2492, lng: 84.8828, state: 'Odisha', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Nanded', lat: 19.1383, lng: 77.3210, state: 'Maharashtra', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Kolhapur', lat: 16.7050, lng: 74.2433, state: 'Maharashtra', status: 'good', stock: 45, pharmacies: 3 },
  { name: 'Ajmer', lat: 26.4499, lng: 74.6399, state: 'Rajasthan', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Akola', lat: 20.7096, lng: 77.0026, state: 'Maharashtra', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Gulbarga', lat: 17.3297, lng: 76.8343, state: 'Karnataka', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Loni', lat: 28.7515, lng: 77.2885, state: 'Uttar Pradesh', status: 'low', stock: 6, pharmacies: 1 },
  { name: 'Ujjain', lat: 23.1765, lng: 75.7885, state: 'Madhya Pradesh', status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Siliguri', lat: 26.7271, lng: 88.3953, state: 'West Bengal', status: 'low', stock: 23, pharmacies: 2 },
  { name: 'Jhansi', lat: 25.4484, lng: 78.5685, state: 'Uttar Pradesh', status: 'low', stock: 8, pharmacies: 1 },
  { name: 'Ulhasnagar', lat: 19.2183, lng: 73.1634, state: 'Maharashtra', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Jammu', lat: 32.7266, lng: 74.8570, state: 'Jammu and Kashmir', status: 'good', stock: 45, pharmacies: 3 },
  { name: 'Sangli-Miraj', lat: 16.8524, lng: 74.5815, state: 'Maharashtra', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Mangalore', lat: 12.9141, lng: 74.8560, state: 'Karnataka', status: 'good', stock: 45, pharmacies: 3 },
  { name: 'Erode', lat: 11.3410, lng: 77.7172, state: 'Tamil Nadu', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Belgaum', lat: 15.8497, lng: 74.4977, state: 'Karnataka', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Ambattur', lat: 13.0982, lng: 80.1614, state: 'Tamil Nadu', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567, state: 'Tamil Nadu', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Malegaon', lat: 20.5538, lng: 74.5255, state: 'Maharashtra', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Gaya', lat: 24.7914, lng: 85.0002, state: 'Bihar', status: 'low', stock: 8, pharmacies: 1 },
  { name: 'Jalgaon', lat: 21.0077, lng: 75.5626, state: 'Maharashtra', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Udaipur', lat: 24.5854, lng: 73.7125, state: 'Rajasthan', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Maheshtala', lat: 22.5086, lng: 88.2532, state: 'West Bengal', status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Tirupur', lat: 11.1085, lng: 77.3411, state: 'Tamil Nadu', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Davanagere', lat: 14.4644, lng: 75.9218, state: 'Karnataka', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Kozhikode', lat: 11.2588, lng: 75.7804, state: 'Kerala', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Akbarpur', lat: 26.4307, lng: 82.5373, state: 'Uttar Pradesh', status: 'low', stock: 6, pharmacies: 1 },
  { name: 'Lakhimpur', lat: 27.9483, lng: 80.7825, state: 'Uttar Pradesh', status: 'low', stock: 4, pharmacies: 1 },
  { name: 'Karnal', lat: 29.6857, lng: 76.9905, state: 'Haryana', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Bathinda', lat: 30.2070, lng: 74.9489, state: 'Punjab', status: 'good', stock: 12, pharmacies: 1 },
  { name: 'Alwar', lat: 27.5665, lng: 76.6108, state: 'Rajasthan', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Ratlam', lat: 23.3341, lng: 75.0376, state: 'Madhya Pradesh', status: 'low', stock: 8, pharmacies: 1 },
  { name: 'Mathura', lat: 27.4924, lng: 77.6737, state: 'Uttar Pradesh', status: 'low', stock: 12, pharmacies: 1 },
  { name: 'Kollam', lat: 8.8932, lng: 76.6141, state: 'Kerala', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Patiala', lat: 30.3398, lng: 76.3869, state: 'Punjab', status: 'good', stock: 34, pharmacies: 2 },
  { name: 'Bharatpur', lat: 27.2156, lng: 77.4909, state: 'Rajasthan', status: 'good', stock: 12, pharmacies: 1 },
  { name: 'Panipat', lat: 29.3909, lng: 76.9635, state: 'Haryana', status: 'good', stock: 23, pharmacies: 2 },
  { name: 'Darbhanga', lat: 26.1520, lng: 85.8970, state: 'Bihar', status: 'low', stock: 6, pharmacies: 1 },
  { name: 'Bhiwani', lat: 28.7975, lng: 76.1311, state: 'Haryana', status: 'good', stock: 12, pharmacies: 1 },
  { name: 'Kurnool', lat: 15.8281, lng: 78.0373, state: 'Andhra Pradesh', status: 'low', stock: 8, pharmacies: 1 }
] as const

interface InteractiveIndiaMapProps {
  onStateHover?: (state: { name: string; status: 'good' | 'low'; stock: number; pharmacies: number }) => void
  onStateClick?: (state: { name: string; status: 'good' | 'low'; stock: number; pharmacies: number }) => void
  onCityHover?: (city: { name: string; state: string; status: 'good' | 'low'; stock: number; pharmacies: number }) => void
  onCityClick?: (city: { name: string; state: string; status: 'good' | 'low'; stock: number; pharmacies: number }) => void
  className?: string
}

// Component to render state areas with large circles representing state boundaries
function StateAreas({ onStateHover, onStateClick }: {
  onStateHover?: (state: { name: string; status: 'good' | 'low'; stock: number; pharmacies: number }) => void
  onStateClick?: (state: { name: string; status: 'good' | 'low'; stock: number; pharmacies: number }) => void
}) {
  return (
    <>
      {indiaStates.map((state) => (
        <Circle
          key={state.name}
          center={[state.lat, state.lng]}
          radius={80000} // Large radius to represent state area
          color={state.status === 'good' ? '#22c55e' : '#ef4444'}
          fillColor={state.status === 'good' ? '#22c55e' : '#ef4444'}
          fillOpacity={0.2}
          weight={2}
          eventHandlers={{
            mouseover: (e) => {
              e.target.setStyle({
                fillOpacity: 0.6,
                weight: 3,
                color: state.status === 'good' ? '#16a34a' : '#dc2626'
              });
              onStateHover?.(state);
            },
            mouseout: (e) => {
              e.target.setStyle({
                fillOpacity: 0.2,
                weight: 2,
                color: state.status === 'good' ? '#22c55e' : '#ef4444'
              });
            },
            click: () => onStateClick?.(state)
          }}
        >
          <Tooltip>
            <div className="text-sm font-medium">
              <div className="font-bold">{state.name}</div>
              <div className={`mt-1 ${state.status === 'good' ? 'text-green-600' : 'text-red-600'}`}>
                Stock: {state.stock} units
              </div>
              <div className="text-gray-600">Pharmacies: {state.pharmacies}</div>
              <div className={`text-xs ${state.status === 'good' ? 'text-green-500' : 'text-red-500'}`}>
                {state.status === 'good' ? '✅ Good Stock' : '⚠️ Low Stock'}
              </div>
            </div>
          </Tooltip>
        </Circle>
      ))}
    </>
  )
}

// Component to render city areas with smaller circles representing city boundaries
function CityAreas({ onCityHover, onCityClick }: {
  onCityHover?: (city: { name: string; state: string; status: 'good' | 'low'; stock: number; pharmacies: number }) => void
  onCityClick?: (city: { name: string; state: string; status: 'good' | 'low'; stock: number; pharmacies: number }) => void
}) {
  return (
    <>
      {majorCities.map((city) => (
        <Circle
          key={city.name}
          center={[city.lat, city.lng]}
          radius={25000} // Smaller radius to represent city area
          color={city.status === 'good' ? '#22c55e' : '#ef4444'}
          fillColor={city.status === 'good' ? '#22c55e' : '#ef4444'}
          fillOpacity={0.3}
          weight={1}
          eventHandlers={{
            mouseover: (e) => {
              e.target.setStyle({
                fillOpacity: 0.7,
                weight: 2,
                color: city.status === 'good' ? '#16a34a' : '#dc2626'
              });
              onCityHover?.(city);
            },
            mouseout: (e) => {
              e.target.setStyle({
                fillOpacity: 0.3,
                weight: 1,
                color: city.status === 'good' ? '#22c55e' : '#ef4444'
              });
            },
            click: () => onCityClick?.(city)
          }}
        >
          <Tooltip>
            <div className="text-sm font-medium">
              <div className="font-bold">{city.name}</div>
              <div className="text-gray-600">{city.state}</div>
              <div className={`mt-1 ${city.status === 'good' ? 'text-green-600' : 'text-red-600'}`}>
                Stock: {city.stock} units
              </div>
              <div className="text-gray-600">Pharmacies: {city.pharmacies}</div>
              <div className={`text-xs ${city.status === 'good' ? 'text-green-500' : 'text-red-500'}`}>
                {city.status === 'good' ? '✅ Good Stock' : '⚠️ Low Stock'}
              </div>
            </div>
          </Tooltip>
        </Circle>
      ))}
    </>
  )
}

export function InteractiveIndiaMap({
  onStateHover,
  onStateClick,
  onCityHover,
  onCityClick,
  className = ""
}: InteractiveIndiaMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Prevent hydration mismatch by not rendering anything until client-side
  if (!isClient) {
    return (
      <div className={`bg-gray-900 rounded-lg flex items-center justify-center ${className}`} style={{ minHeight: '400px' }}>
        <div className="text-white">Loading interactive map...</div>
      </div>
    )
  }

  // Ensure Leaflet is loaded only on client
  if (typeof window === 'undefined') {
    return (
      <div className={`bg-gray-900 rounded-lg flex items-center justify-center ${className}`} style={{ minHeight: '400px' }}>
        <div className="text-white">Loading interactive map...</div>
      </div>
    )
  }

  return (
    <div className={`${className}`} style={{ backgroundColor: '#1a1a1a' }}>
      <MapContainer
        center={[23.5937, 78.9629]} // Center of India
        zoom={5}
        className="w-full h-full"
        zoomControl={false}
        style={{ backgroundColor: '#1a1a1a' }}
      >
        {/* Dark theme tile layer - India focused */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          className="dark-tiles"
        />
        
        <ZoomControl position="bottomright" />
        
        {/* State areas */}
        <StateAreas onStateHover={onStateHover} onStateClick={onStateClick} />
        
        {/* City areas */}
        <CityAreas onCityHover={onCityHover} onCityClick={onCityClick} />
      </MapContainer>
    </div>
  )
} 