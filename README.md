# CUROGENIX

_Transforming Healthcare Supply with Intelligent Innovation_

![last commit](https://img.shields.io/badge/last%20commit-yesterday-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-97.5%25-blue)
![Languages](https://img.shields.io/badge/languages-3-blue)

---

_Built with the tools and technologies:_

![npm](https://img.shields.io/badge/npm-red)
![Autoprefixer](https://img.shields.io/badge/Autoprefixer-red)
![PostCSS](https://img.shields.io/badge/PostCSS-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow)
![Leaflet](https://img.shields.io/badge/Leaflet-green)
![React](https://img.shields.io/badge/React-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Zod](https://img.shields.io/badge/Zod-blue)
![date-fns](https://img.shields.io/badge/datefns-pink)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-pink)
![YAML](https://img.shields.io/badge/YAML-red)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)

---

## 🩺 Overview
CuroGenix is a healthcare supply intelligence platform that detects anomalies in the public medicine distribution chain. It aims to prevent black-market activities and price shortages of essential medicines in rural areas by tracking medicine allocation and raising real-time alerts to the government for necessary action.

---

**❓ Problem**

The government sends large quantities of essential medicines to Public Health Organizations (PHOs) and other public entities in rural areas through the pharmaceutical supply chain.

However, in many rural regions:
 - Sufficient medicines are missing from their designated locations.
 - End-users (rural citizens) often do not receive the medicines they need.
 - This leads to panic, price gouging, and black-market resale of essential drugs.

Where are these medicines going?

---

**🔍 Why This Problem Exists**

- Medicines are dispatched by the government with batch numbers and assigned PHO details.
- In practice, these medicines are diverted by middlemen or fraudulent pharmacies to other unintended locations.
- As a result, PHOs don't receive their allocations, and rural patients are denied access to essential treatments.

---

**💡 Our Solution**

CuroGenix introduces a real-time medicine tracking and verification system using OCR and barcode scanning.

**How It Works:**

**1. Medicine Packaging:**
Each medicine batch has a unique barcode with key metadata (medicine name, batch number, allocated PHO).

**2. OCR & Image Scan:**
Field agents or local authorities scan the medicine using a mobile app, which:
 - Extracts details via OCR.
 - Detects the current location of the medicine.

**3. Verification Engine:**
The scanned data is verified against the central government database to:
 - Confirm whether the medicine is at its intended PHO.
 - Check for anomalies (e.g., wrong location, unallocated movement).

**4. Alert System:**
If an anomaly is detected:
 - The system flags it and alerts the government.
 - Authorities can identify the fraudulent entity (pharmacy, distributor, etc.).
 - Investigations can begin immediately to correct the supply chain breach.

---

## 🚀 Getting Started

### Prerequisites

This project requires the following dependencies:

- **Programming Language**: TypeScript  
- **Package Manager**: npm

---

### Installation

Build InnovateX from the source and install dependencies:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sabhyalokhande/InnovateX
   
2. **Navigate to the project directory:**

    ```bash
    cd InnovateX
    
3. **Install the dependencies:**

Using npm:

    npm install

---

### Usage

Run the project with:

Using npm:

    npm start

---

### Testing

InnovateX uses the {test_framework} test framework. Run the test suite with:

Using npm:

    npm test

---
