# 🧠 Flex-Living Project Memory & State Tracker

> **Repository:** `https://github.com/kayzredman/flex-living.git`  
> **Active Working Branch:** `dev`  
> **Production Branch:** `main`  
> **Governance Model:** QA Agent Lead with SME Agents (UI/UX, Backend/DB, Integration, Security/Compliance, Performance)

---

## 🎯 Executive Overview & Value Proposition
Flex-Living is a tech-enabled real estate operating system for emerging African markets (Accra, Lagos, Nairobi) addressing infrastructure deficits:
* **The Problem:** Frequent grid power outages, erratic municipal water, unverified internet speeds, and 1–2 year upfront rent demands.
* **The Solution:** 
  1. **Flex-Trust:** Ground-truth 200+ point property audits by vetted Field Scouts awarding verified badges (Solar, Starlink, Borehole, Smart Access).
  2. **Flex-Stay:** Automated 99.5% uptime SLA guarantee with real-time IoT monitoring and a Hybrid Non-IoT WhatsApp fallback.
  3. **Flex-Advance:** Monthly rent financing, enabling tenants to pay monthly while landlords receive upfront capital.

---

## 🛡️ SME Agent Governance Model
* **QA Agent (Lead & Gatekeeper):** Runs all acceptance test suites, enforces zero-regression quality standards, and authorizes merges from `dev` to `main`.
* **🎨 UI/UX Agent:** Enforces brand design tokens (Coral `#E94560`, Deep Teal `#0F3460`, Gold `#E9A319`), glassmorphism aesthetics, and exports all mockups to `prototype/mockups/`.
* **🏗️ Backend / DB Agent:** Architectures microservices (Node.js/Python), manages PostgreSQL/PostGIS schemas, and enforces data integrity.
* **🔌 Integration Agent:** Connects third-party APIs (Ghana Card/Smile Identity KYC, WhatsApp Meta Cloud/Twilio, PostGIS spatial algorithms).
* **🔒 Security & Compliance Agent:** Enforces JWT authorization, device API tokens, geofencing fraud prevention, and role-based access control (RBAC).
* **⚡ Performance Agent:** Implements time-series indexing, spatial queries optimization, and caching.

---

## 📈 Milestone Progress & Completed Jobs

### ✅ Phase 1: Foundations (Certified by QA)
1. **Multi-Tenant Database & PostGIS:** PostgreSQL 15 + PostGIS docker containerized with spatial index support.
2. **Identity & Trust Core (`backend/identity-service` - Port 3000):**
   - Phone OTP registration (`/v1/auth/register`) and JWT verification (`/v1/auth/verify-otp`).
   - Mocked Ghana Card KYC validation (`/v1/auth/kyc`) with automatic Tier 2 elevation.
3. **Listing Catalog Service (`backend/listing-service` - Port 8000):**
   - Python FastAPI service with GeoAlchemy2 spatial querying (`GET /v1/listings?lat=...&lng=...&radius_km=...`).
4. **Interactive Web Platform (`prototype/` - Port 5174):**
   - Benchmarked against **Airbnb Luxe, Blueground & Spleet**:
     - **Interactive Split-Screen Map View**: Interactive PostGIS property pins with price pills (`GHS 4.0k`, `$267`), hover previews, and SVG infrastructure heat map.
     - **Global Currency Switcher**: Real-time conversion across GHS, USD, and NGN.
     - **5-Photo Luxury Hero Grid & Full-Screen Photo Lightbox**: Categorized audit proofs (Victron solar inverter, Starlink dish, borehole tanks, smart locks).
     - **Interactive Flex-Advance Simulator Modal**: Tenure slider (3–24 mos) showing upfront cash retention vs traditional 2-year advance.
     - **Host Infrastructure Command Hub**: 4-KPI financial & uptime cards + 2-column live power telemetry and WhatsApp caretaker morning pulse.
5. **Tenant Mobile App Scaffolding (`mobile/`):**
   - React Native (Expo) app with NativeWind configured with brand design tokens.

### ✅ Phase 2: Scout Engine & IoT Telemetry (Certified by QA)
1. **Field Scout Engine (`backend/scout-service` - Port 3001):**
   - Task dispatch queue (`POST /v1/scout/tasks`).
   - 200+ point audit checklist submission (`POST /v1/scout/tasks/:id/submit`).
   - Automated badge evaluation (Solar, Starlink, Borehole, Smart Access) and payout calculator ($25 base + $10 bonus = $35).
2. **IoT Telemetry & SLA Watchdog (`backend/iot-service` - Port 3002):**
   - Device registry with unique `device_key` authentication.
   - High-frequency telemetry ingestion (grid voltage, generator status, water PSI, internet Mbps).
   - Automated SLA Watchdog triggering active `POWER_FAILURE` breach and self-healing resolution upon power restoration.

### ✅ Phase 3: Hybrid Non-IoT Fallback & Fintech Engine (Certified by QA)
1. **Tenant Outage Reporting (`backend/hybrid-sla-service` - Port 3003):**
   - One-tap outage filing with Geofence verification (< 500m radius check) and live 2-Hour SLA Countdown Timer (7,200s).
2. **Caretaker Morning WhatsApp Pulse Checks:**
   - Daily morning health checks with proactive fuel refill alert dispatching (`NEEDS_DIESEL`).
3. **15% Host Escrow Reserve & Auto-Settlement:**
   - Automatic deduction of $35.00 rent credit from host escrow upon confirmed breach.
4. **Flex-Advance Rental Financing Engine:**
   - Automated credit underwriting evaluating DTI ratios (< 40% threshold approved with prime 1.5%/month rate).

### ✅ Phase 4: Unified API Gateway, Caretaker WhatsApp Webhook & Mobile App Elevation (Certified by QA)
1. **Unified Reverse Proxy API Gateway (`backend/api-gateway` - Port 3004):**
   - Single point of entry routing `/v1/auth`, `/v1/listings`, `/v1/scout`, `/v1/iot`, `/v1/sla`, and `/v1/fintech`.
2. **Inbound WhatsApp Caretaker Webhook (`POST /v1/sla/whatsapp/inbound`):**
   - Natural language parser extracting grid status (`NORMAL` / `GRID_OFF`), fuel level (`FULL` / `NEEDS_DIESEL`), and water reserves.
   - Automatic dispatch alert for diesel refills.
3. **Full-Featured Mobile Application (`mobile/App.js`):**
   - 4-Tab Navigation:
     - **Explore:** PostGIS listings, amenity filters, and currency switcher.
     - **Smart Key:** 1-Tap NFC/BLE digital lock unlock simulation with AES-256 handshake.
     - **SLA Diagnostics:** Geofenced outage claim and live 2-Hour countdown timer.
     - **Flex-Profile:** Tier 2 Ghana Card KYC badge, payroll deduction schedule, and upfront savings.
4. **Automated QA Phase 4 Test Suite (`backend/qa_phase4_test.js`):**
   - 22/22 tests passing across Gateway health, spatial listing query, WhatsApp webhook, geofenced claims, underwriting, and scout queue.

### ✅ Phase 7: Field Scout Management Portal, Fleet Governance & AI Vision Scanner (QA Certified - 9/9 Tests Passed):
  - **Field Scout Operations Portal (`prototype/src/pages/ScoutPortal.jsx`):**
    - Multi-city Scout workbench (Ama in Accra, Chinedu in Lagos, Njeri in Nairobi).
    - Interactive 200-point physical audit workbench: Power switchover (< 8s), generator acoustic level (< 45 dB), Starlink speedtest (> 50 Mbps), borehole TDS purity (< 150 PPM), smart lock pairing.
    - Scout Bounty Wallet ($50 / GHS 750 per certified audit) with instant MTN Mobile Money cashout trigger.
    - **Scout Fleet Governance & Lifecycle (`prototype/src/pages/ScoutPortal.jsx` & `mobile/App.js`):**
      - **Onboard Scout (`POST /v1/scout/onboard`):** Vets engineer name, phone, operating metro, KYC National ID (Ghana Card/NIN), hardware toolkit check, and payout details.
      - **Yank / Offboard Scout (`PATCH /v1/scout/:id/status` or `DELETE /v1/scout/:id`):** Instantly revokes dispatch privileges, disables task queue, freezes wallet, and reassigns tickets.
      - **Reinstate Scout:** Restores vetted status once equipment is re-calibrated.
  - **AI Vision Property Scanner (`backend/scout-service/src/ai_scanner.js` on Port `3001`):**
    - Multi-modal visual heuristics & telemetry OCR (`POST /v1/scout/ai-scan`).
    - Detects solar inverter models (Victron/Deye), Starlink satellite geometry, Sintex borehole tanks, and smart deadbolts.
    - Achieved 95% confidence score with instant 5-minute pre-certification and +43% dynamic yield lift.
  - **Multi-Category Photo Uploaders:**
    - Web (`AddPropertyModal.jsx`): File browse / drag-drop with 4 categorized upload slots (Living Room, Solar Inverter, Starlink Dish, Borehole Tank).
    - Mobile (`mobile/App.js`): 4-step wizard with dedicated photo gallery slots and camera trigger.

### ✅ Phase 5: AI Dynamic Pricing & Diaspora Surge Engine (Certified by QA)
1. **Dynamic Pricing Microservice (`backend/pricing-service` - Port 3005):**
   - Dynamic yield calculation combining infrastructure badge premiums (+18% Solar, +12% Starlink, +8% Borehole, +5% Smart Access = +43% verified premium) with seasonal surge multipliers.
   - Diaspora event calendar: "December in Ghana (Detty December)" at 1.85x peak multiplier.
   - Host 12-month dynamic yield projection curve.
2. **Host Dashboard Integration (`prototype/src/pages/LandlordDashboard.jsx`):**
   - Live AI Yield & Diaspora Surge Optimizer panel with monthly surge bar chart and peak Detty December revenue lift.
3. **Automated QA Phase 5 Test Suite (`backend/qa_phase5_test.js`):**
   - 21/21 tests passing across Gateway routing, diaspora calendar query, peak/off-peak pricing, multi-currency (USD/GHS), and 12-month projections.

### ✅ Phase 6: Production SMS & WhatsApp Cloud Engine + Multi-Property Portfolio Analytics (Certified by QA)
1. **Communication Engine (`backend/communication-service` - Port 3006):**
   - Outbound WhatsApp caretaker morning pulse prompt generator formatted for Meta Cloud API.
   - Low-latency tenant blackout reassurance SMS dispatcher with solar backup confirmation via direct African carrier routes.
   - Urgent automated WhatsApp diesel reorder alert for hosts when fuel drops $\le 25\%$.
   - Full message delivery audit trail and logs query.
2. **Multi-Property Host Portfolio & Statutory Tax Compliance:**
   - Multi-unit aggregation across Accra, Lagos, and Nairobi.
   - Zero-strike reduced escrow rate (10% hold instead of 15%).
   - Ghana Revenue Authority (GRA) 8% statutory rent withholding tax remittance calculation and certificate generation.
3. **Automated QA Phase 6 Test Suite (`backend/qa_phase6_test.js`):**
   - 24/24 tests passing across Gateway routing, WhatsApp prompts, SMS reassurance broadcasts, diesel alerts, and host portfolio tax rollups.

### ✅ Phase 8: 5 Strategic Gap Pillars (Certified across Web & Mobile)
1. **Pillar 1: Interactive Mobile Money (MoMo / M-Pesa) STK Push Payment Rails:**
   - Real-time network selector: MTN MoMo, Telecel Cash, M-Pesa Safaricom, and Visa/Card.
   - Realistic phone USSD modal overlay simulating live STK prompt with 4-digit PIN authorization.
   - Automated 15% Escrow lock, transaction receipt issuance, and instant Digital Smart Key unlocking.
2. **Pillar 2: Offline-First Field Scout Engine (Basement / Borehole Pit Mode):**
   - Toggleable cellular signal simulation (`[🟢 4G Connected]` vs `[🔴 0 Bars - Basement/Borehole Pit]`).
   - Offline local caching queue for 200-point audits, acoustic readings, and equipment photos.
   - Amber offline alert banner and 1-tap `⚡ Sync Queued Audits` cloud auto-upload upon re-establishing connection.
3. **Pillar 3: Interactive WhatsApp Caretaker Daily Pulse Bot Simulator:**
   - Simulated Meta Cloud API 07:00 AM daily check with live chatbox log.
   - 3 interactive 1-tap quick buttons: `[🟢 Grid OK & Tank 100%]`, `[⚡ ECG Outage - Inverter Active]`, and `[🚨 Diesel Below 20%]`.
   - Real-time IoT SLA monitor telemetry updates and automated fuel dispatch triggers.
4. **Pillar 4: TTLock / Tuya Hardware Smart Lock Time-Bound PIN Engine:**
   - Active 6-digit Master Keypad PIN (`849 201`) synced with physical lock status.
   - Self-expiring temporary guest pass generator: `🧹 Cleaner (2h)`, `🛵 Delivery (45m)`, `👥 Guest (24h)`.
   - 1-tap `📲 Share PIN via WhatsApp` trigger with direct message formatting.
5. **Pillar 5: SmileID Diaspora Biometric Liveness & KYC Fast-Track:**
   - Interactive 3D selfie liveness check modal with face oval alignment and blink detection.
   - Cross-border national database clearance (Ghana Card / Nigerian NIN / Passport AML).
   - Unlocks full Tier-2 GHS 24,000 / $18,000 Flex-Advance rent financing facility with zero paperwork.

### ✅ Phase 9: Granular Feature Flags Remote Engine & Web Admin Command Center (QA Certified - 25/25 Tests Passed)
1. **Remote Configuration Engine (`backend/api-gateway/src/feature_flags.js` & `index.js` - Port 3004):**
   - **20 Granular Feature Switches:**
     - *Discovery:* `FLAG_VERIFIED_BADGES`, `FLAG_200_POINT_TELEMETRY`, `FLAG_CURRENCY_SWITCHER`.
     - *FinTech:* `FLAG_FLEX_ADVANCE_MONTHLY`, `FLAG_MOMO_USSD_PUSH`, `FLAG_HOST_ESCROW_VAULT`, `FLAG_SAVINGS_SIMULATOR`.
     - *KYC & Identity:* `FLAG_SMILEID_BIOMETRICS`, `FLAG_PAYROLL_DEDUCTION`.
     - *Smart Access:* `FLAG_DIGITAL_DOOR_UNLOCK`, `FLAG_TTLOCK_MASTER_PIN`, `FLAG_TTLOCK_GUEST_PASSES`, `FLAG_WHATSAPP_PIN_SHARE`, `FLAG_STARLINK_WIFI_CARD`.
     - *SLA & Uptime:* `FLAG_SLA_REPORT_OUTAGE`, `FLAG_SLA_2HR_CURE_TIMER`, `FLAG_SLA_MOMO_REFUND`, `FLAG_CARETAKER_WHATSAPP_BOT`.
     - *Scout Fleet:* `FLAG_SCOUT_HEADER_MODE`, `FLAG_SCOUT_OFFLINE_MODE`, `FLAG_SCOUT_AI_VISION`, `FLAG_SCOUT_FLEET_GOVERNANCE`.
     - *Host Operations:* `FLAG_HOST_LIST_PROPERTY`, `FLAG_AI_SURGE_PRICING`, `FLAG_GRA_TAX_REMITTANCE`.
   - **1-Click Market Presets:**
     - `MARKET_BASELINE`: Pegs app directly to existing market incumbents (Meqasa/Airbnb). Hides intimidating SLA countdowns, 15% escrow penalties, and 3D liveness, providing a clean, frictionless discovery & upfront rental flow.
     - `FINTECH_ESCROW`: Turns on Flex-Advance monthly rent, MoMo USSD prompt, 15% escrow vault, and SmileID KYC.
     - `FULL_FLEX`: Enables all 20 autonomous superpowers.
   - **REST Endpoints:** `GET /v1/config/flags`, `PATCH /v1/config/flags` (granular or preset updates), `POST /v1/config/flags/reset`. Disk persistent in `flags.json`.
2. **Web Admin Feature Flag Dashboard (`prototype/src/pages/AdminFlags.jsx`):**
   - 1-click preset selector, domain category filter chips, search input, and animated iOS toggle switches for all 20 flags.
   - Immediate real-time sync across Web and Expo mobile clients without requiring server restart or re-deployments.
3. **Mobile Remote Flag Control (`mobile/App.js`):**
   - Header quick pill `[ 🎛️ Flags: (Baseline/FinTech/Full) ]` opening native Feature Flag Control Modal.
   - Reactive UI rendering: dynamically shows/hides infrastructure badges, 200-point telemetry, MoMo vs Card checkout, bottom navigation tabs (Scout Mode, SLA Outage), and 3D selfie scanner based on active flags.
4. **Automated QA Test Suite (`backend/qa_feature_flags_test.js`):**
   - 25/25 tests passing (100%) across flag queries, preset transitions, granular toggling, and reset behaviors.

### ✅ Phase 10: Master Figma Artboard Pixel-for-Pixel Desktop & Mobile Implementation (QA Certified)
1. **Master Figma Desktop Artboard Alignment (`prototype/src/App.jsx` & `prototype/src/pages/Home.jsx`):**
   - Exact replication of `figma_desktop_ui.jpg`:
     - **Header Bar:** Gold geometric `F` glyph + `Flex` (gold `#E9A319`) and `Living` (white) brand logo.
     - **Clean Nav Menu:** `Properties` (active with gold underline), `Neighborhoods`, `Experiences`, `Investment`, `About`.
     - **Wide Search Capsule:** `[ 🔍 Accra, Lagos, Nairobi ] | [ 📅 Dates ] | [ 👥 Guests ] | [ Search (Solid Gold Pill) ]`.
     - **2-Column Split Hero:** Bold heading (`Discover Exquisite Living in Africa's Vibrant Cities`), modern description, gold pill button (`Explore Collection`), and contemporary African architectural villa render with `99.5% INFRASTRUCTURE SLA GUARANTEE` glow pill.
     - **Property Cards:** `#161B26` dark canvas, 16:9 images, large gold prices, beds/baths/sqft specs, pool/gym/smart home amenities row.
     - **Signature 4-Column Gold Telemetry Row on Every Card:**
       `[ ⚡ 24/7 SOLAR ]` `[ 🌐 STARLINK ]` `[ 💧 PURE BOREHOLE ]` `[ 🛡️ 99.5% UPTIME SLA ]`.
2. **Master Figma Mobile Artboard Alignment (`mobile/App.js`):**
   - Exact replication of `figma_mobile_ui.jpg`:
     - Frame 1: `FlexLiving` header with gold badge pill, `Explore Premium Stays` search bar, and verified tenant card.
     - Frame 2: `Unit 3B Access` with the `Unlock Door (Hold to Unlock)` button, `Starlink Ping Meter` analog gauge (`98ms - Very Good • Status: Active`), `Victron Solar ATS` analog gauge (`Solar Active - 94% • Mains Offline`), and `MoMo Flex-Advance Monthly Rent Limit` card (`GHS 25,000 limit`).

### ✅ Phase 11: Ingested High-Density Data Rollout (18+ Verified Stays across 14 Neighborhoods)
1. **Unified Ingested Dataset (`prototype/src/data/ingestedProperties.js` & `mobile/App.js`):**
   - 18 luxury verified residences sourced from PostGIS database and stress-test pipelines:
     - **Accra:** Cantonments, Airport Residential, Labone, Osu Oxford Street, East Legon, Dzorwulu.
     - **Lagos:** Ikoyi, Banana Island, Victoria Island, Lekki Phase 1, Eko Atlantic, Ikeja GRA.
     - **Nairobi:** Gigiri, Westlands, Karen, Kilimani, Lavington, Riverside Drive.
   - **Rich Ingested Metadata:**
     - What3Words micro-location addresses on every card (e.g. `///cantonments.flex.obsidian`, `///bananaisland.flex.jetty`, `///gigiri.flex.mirage`).
     - Field Scout attribution (e.g. `Ama Mensah (Lead Field Scout)`, `Chinedu Okafor (Lagos Lead Scout)`, `Njeri Mwangi (Nairobi Lead Scout)`).
     - Live IoT telemetry metrics: Solar Battery % (`98%`), Starlink latency (`24 ms`), Pure borehole TDS (`62 PPM`), and Escrow vault protection status.
     - Metro quick filter pills (`All Metros`, `Accra`, `Lagos`, `Nairobi`).
     - Ingested repository status bar showing active PostGIS catalog sync.

### ✅ Phase 12: Smart Key Ergonomic & UI Relocation (Zero Clutter on Header)
1. **Pristine Top Navigation:**
   - Removed `🔐 Smart Key` from the center navigation links so that it no longer mars the clean, luxury Figma design aesthetic.
2. **Ergonomic Access Locations:**
   - **Inside Profile Dropdown Menu:** Clicking the user profile avatar reveals a dedicated, elegant stay card:  
     `🔑 My Stay & Smart Key • The Obsidian Villa • Unit 3B • Unlock →`.
   - **Subtle Floating Pill in Bottom-Right Corner:** A non-intrusive dark glass capsule with an active emerald dot `[ 🔑 My Stay Key ]` floats at the bottom right for instantaneous 1-click access without interrupting layout or grid alignment.

---

## 🚀 Active Runtime Daemons & Service Ports
| Service | Technology | Port | Local URL | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Web Dev Server** | Vite + React | 5173 | `http://localhost:5173/` | 🟢 Active |
| **Mobile Expo Metro** | React Native (Expo) | 8081 | `http://localhost:8081/` / `exp://10.10.1.125:8081` | 🟢 Active |
| **API Gateway** | Node.js Express | 3004 | `http://localhost:3004/` | 🟢 Active |
| **Listing Service** | Python FastAPI / PostGIS | 8000 | `http://localhost:8000/` | 🟢 Active |
| **Field Scout Service** | Node.js / AI Scanner | 3001 | `http://localhost:3001/` | 🟢 Active |
| **IoT Telemetry Service** | Node.js / SLA Watchdog | 3002 | `http://localhost:3002/` | 🟢 Active |
| **Hybrid SLA Service** | Node.js / Escrow Reserve | 3003 | `http://localhost:3003/` | 🟢 Active |
| **Dynamic Pricing Service** | Node.js / Detty Dec Surge | 3005 | `http://localhost:3005/` | 🟢 Active |
| **Communication Service** | Node.js / WhatsApp & SMS | 3006 | `http://localhost:3006/` | 🟢 Active |
| **Identity & Auth Service** | Node.js / Ghana Card KYC | 3000 | `http://localhost:3000/` | 🟢 Active |
| **PostgreSQL Database** | PostGIS 15 Docker | 5432 | `localhost:5432/flexliving` | 🟢 Active |

---

## 🚀 Next Steps Upon Resumption
1. **End-to-End Booking & Checkout Verification:** Test full Mobile Money (MoMo/M-Pesa) reservation flow for all newly ingested residences.
2. **Field Scout Audit Deep-Dive:** Submit live 200-point audits for recently added units in Nairobi and Lagos.
3. **Docker Compose Unified Orchestration:** Bundle all 6 microservices, gateway, database, and redis into a single production compose profile for staging deployment.

---

## 🔁 Git & Deployment Protocol
1. All changes must be developed and tested on `dev`.
2. QA Agent executes automated test suites (`qa_test.js`, `qa_phase2_test.js`, `qa_phase3_test.js`).
3. Upon QA sign-off:
   ```bash
   git checkout main
   git merge dev
   git push origin main
   git checkout dev

   git push origin dev
   ```
