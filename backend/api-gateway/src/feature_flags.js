const fs = require('fs');
const path = require('path');

const FLAGS_FILE = path.join(__dirname, 'flags.json');

// The 20 Granular Feature Flags
const DEFAULT_FLAGS = {
  // Domain 1: Search, Discovery & Badges
  FLAG_VERIFIED_BADGES: true,
  FLAG_200_POINT_TELEMETRY: true,
  FLAG_CURRENCY_SWITCHER: true,

  // Domain 2: Payments & FinTech Rails
  FLAG_FLEX_ADVANCE_MONTHLY: true,
  FLAG_MOMO_USSD_PUSH: true,
  FLAG_HOST_ESCROW_VAULT: true,
  FLAG_SAVINGS_SIMULATOR: true,

  // Domain 3: Identity & Underwriting (KYC)
  FLAG_SMILEID_BIOMETRICS: true,
  FLAG_PAYROLL_DEDUCTION: true,

  // Domain 4: Smart Access & Hardware
  FLAG_DIGITAL_DOOR_UNLOCK: true,
  FLAG_TTLOCK_MASTER_PIN: true,
  FLAG_TTLOCK_GUEST_PASSES: true,
  FLAG_WHATSAPP_PIN_SHARE: true,
  FLAG_STARLINK_WIFI_CARD: true,

  // Domain 5: SLA Outage & Caretaker Engine
  FLAG_SLA_REPORT_OUTAGE: true,
  FLAG_SLA_2HR_CURE_TIMER: true,
  FLAG_SLA_MOMO_REFUND: true,
  FLAG_CARETAKER_WHATSAPP_BOT: true,

  // Domain 6: Field Scout Fleet Operations
  FLAG_SCOUT_HEADER_MODE: true,
  FLAG_SCOUT_OFFLINE_MODE: true,
  FLAG_SCOUT_AI_VISION: true,
  FLAG_SCOUT_FLEET_GOVERNANCE: true,

  // Domain 7: Host Hub & Yield Engine
  FLAG_HOST_LIST_PROPERTY: true,
  FLAG_AI_SURGE_PRICING: true,
  FLAG_GRA_TAX_REMITTANCE: true
};

const FLAG_METADATA = {
  FLAG_VERIFIED_BADGES: {
    domain: 'Discovery',
    label: 'Verified Infrastructure Badges',
    description: 'Display 24/7 Solar, Starlink, Borehole, and Smart Lock trust badges on property cards.'
  },
  FLAG_200_POINT_TELEMETRY: {
    domain: 'Discovery',
    label: '200-Point Audit Telemetry',
    description: 'Show technical audit readings: generator noise dB, ATS switchover seconds, borehole water TDS PPM.'
  },
  FLAG_CURRENCY_SWITCHER: {
    domain: 'Discovery',
    label: 'Multi-Currency Switcher',
    description: 'Allow live toggle between Ghanaian Cedi (GHS), US Dollar (USD), and Nigerian Naira (NGN).'
  },
  FLAG_FLEX_ADVANCE_MONTHLY: {
    domain: 'FinTech',
    label: 'Flex-Advance Monthly Rent',
    description: 'Allow tenants to split 2-year upfront advances into verified monthly payroll payments.'
  },
  FLAG_MOMO_USSD_PUSH: {
    domain: 'FinTech',
    label: 'MoMo & M-Pesa USSD STK Push',
    description: 'Trigger authentic telco USSD prompt on tenant handset with 4-digit PIN escrow approval.'
  },
  FLAG_HOST_ESCROW_VAULT: {
    domain: 'FinTech',
    label: '15% Host Escrow Holdback',
    description: 'Display 15% escrow protection guarantees on booking and stay cards.'
  },
  FLAG_SAVINGS_SIMULATOR: {
    domain: 'FinTech',
    label: 'Upfront Savings Calculator',
    description: 'Display "Keep GHS 92,000 Upfront Cash Retained" financial comparison card.'
  },
  FLAG_SMILEID_BIOMETRICS: {
    domain: 'KYC & Identity',
    label: 'SmileID 3D Biometric Liveness',
    description: 'Enable interactive 3D selfie liveness check and cross-border Ghana Card/NIN database vetting.'
  },
  FLAG_PAYROLL_DEDUCTION: {
    domain: 'KYC & Identity',
    label: 'Corporate Payroll Deduction',
    description: 'Display employer corporate salary deduction verification tags.'
  },
  FLAG_DIGITAL_DOOR_UNLOCK: {
    domain: 'Smart Access',
    label: 'Tap-to-Unlock Deadbolt',
    description: 'Display NFC / BLE mobile deadbolt unlock button with auto-relock timer.'
  },
  FLAG_TTLOCK_MASTER_PIN: {
    domain: 'Smart Access',
    label: 'TTLock Master Keypad PIN',
    description: 'Show active 6-digit deadbolt PIN code for confirmed tenants.'
  },
  FLAG_TTLOCK_GUEST_PASSES: {
    domain: 'Smart Access',
    label: 'Self-Expiring Guest Passes',
    description: 'Allow tenants to generate Cleaner (2h), Delivery (45m), and Visitor (24h) time-bound PINs.'
  },
  FLAG_WHATSAPP_PIN_SHARE: {
    domain: 'Smart Access',
    label: 'Share PIN via WhatsApp',
    description: 'Enable 1-tap WhatsApp sharing of generated guest codes.'
  },
  FLAG_STARLINK_WIFI_CARD: {
    domain: 'Smart Access',
    label: 'Starlink WiFi Card',
    description: 'Display network SSID and pre-shared password in Stay Management.'
  },
  FLAG_SLA_REPORT_OUTAGE: {
    domain: 'SLA & Uptime',
    label: 'Report Outage Diagnostic',
    description: 'Enable tenant button to trigger automated edge router and smart plug diagnostic.'
  },
  FLAG_SLA_2HR_CURE_TIMER: {
    domain: 'SLA & Uptime',
    label: '2-Hour Host Cure Countdown',
    description: 'Enforce strict 2-hour cure timer before escrow penalty deductions kick in.'
  },
  FLAG_SLA_MOMO_REFUND: {
    domain: 'SLA & Uptime',
    label: 'Instant MoMo Outage Compensation',
    description: 'Allow 1-tap instant GHS 420 escrow compensation disbursement to tenant mobile wallet.'
  },
  FLAG_CARETAKER_WHATSAPP_BOT: {
    domain: 'SLA & Uptime',
    label: 'WhatsApp Caretaker Pulse Simulator',
    description: 'Show simulated 07:00 AM Meta Cloud API caretaker check-in with 1-tap telemetry buttons.'
  },
  FLAG_SCOUT_HEADER_MODE: {
    domain: 'Scout Fleet',
    label: 'Scout Mode Header Entry',
    description: 'Show "🧭 Scout Mode" pill in the main top navigation bar.'
  },
  FLAG_SCOUT_OFFLINE_MODE: {
    domain: 'Scout Fleet',
    label: 'Basement 0-Bars Offline Mode',
    description: 'Enable toggleable signal simulation and local cache queue for underground audits.'
  },
  FLAG_SCOUT_AI_VISION: {
    domain: 'Scout Fleet',
    label: 'AI Vision Property Scanner',
    description: 'Enable computer vision heuristics for automatic solar inverter and Starlink detection.'
  },
  FLAG_SCOUT_FLEET_GOVERNANCE: {
    domain: 'Scout Fleet',
    label: 'Scout Fleet Roster & Yanking',
    description: 'Enable fleet roster table, credential revocation (yanking), and onboarding.'
  },
  FLAG_HOST_LIST_PROPERTY: {
    domain: 'Host Operations',
    label: '+ List Property Wizard',
    description: 'Show "🏡 + List Property" 4-step onboarding wizard in header.'
  },
  FLAG_AI_SURGE_PRICING: {
    domain: 'Host Operations',
    label: 'Detty December AI Surge Optimizer',
    description: 'Display 12-month dynamic yield projection curve with peak 1.85x diaspora multiplier.'
  },
  FLAG_GRA_TAX_REMITTANCE: {
    domain: 'Host Operations',
    label: 'Ghana Revenue Authority Tax Remittance',
    description: 'Calculate and display statutory 8% rent withholding tax certificates.'
  }
};

const PRESETS = {
  // Preset 1: MARKET_BASELINE (Meqasa / Airbnb Match)
  // Familiar, frictionless, zero intimidating penalties
  MARKET_BASELINE: {
    FLAG_VERIFIED_BADGES: true,
    FLAG_200_POINT_TELEMETRY: false,
    FLAG_CURRENCY_SWITCHER: true,
    FLAG_FLEX_ADVANCE_MONTHLY: false,
    FLAG_MOMO_USSD_PUSH: false,
    FLAG_HOST_ESCROW_VAULT: false,
    FLAG_SAVINGS_SIMULATOR: false,
    FLAG_SMILEID_BIOMETRICS: false,
    FLAG_PAYROLL_DEDUCTION: false,
    FLAG_DIGITAL_DOOR_UNLOCK: true,
    FLAG_TTLOCK_MASTER_PIN: true,
    FLAG_TTLOCK_GUEST_PASSES: false,
    FLAG_WHATSAPP_PIN_SHARE: false,
    FLAG_STARLINK_WIFI_CARD: true,
    FLAG_SLA_REPORT_OUTAGE: false,
    FLAG_SLA_2HR_CURE_TIMER: false,
    FLAG_SLA_MOMO_REFUND: false,
    FLAG_CARETAKER_WHATSAPP_BOT: false,
    FLAG_SCOUT_HEADER_MODE: false,
    FLAG_SCOUT_OFFLINE_MODE: false,
    FLAG_SCOUT_AI_VISION: false,
    FLAG_SCOUT_FLEET_GOVERNANCE: false,
    FLAG_HOST_LIST_PROPERTY: true,
    FLAG_AI_SURGE_PRICING: false,
    FLAG_GRA_TAX_REMITTANCE: false
  },

  // Preset 2: FINTECH_ESCROW (For market asking for rent liquidity & escrow)
  FINTECH_ESCROW: {
    FLAG_VERIFIED_BADGES: true,
    FLAG_200_POINT_TELEMETRY: false,
    FLAG_CURRENCY_SWITCHER: true,
    FLAG_FLEX_ADVANCE_MONTHLY: true,
    FLAG_MOMO_USSD_PUSH: true,
    FLAG_HOST_ESCROW_VAULT: true,
    FLAG_SAVINGS_SIMULATOR: true,
    FLAG_SMILEID_BIOMETRICS: true,
    FLAG_PAYROLL_DEDUCTION: true,
    FLAG_DIGITAL_DOOR_UNLOCK: true,
    FLAG_TTLOCK_MASTER_PIN: true,
    FLAG_TTLOCK_GUEST_PASSES: false,
    FLAG_WHATSAPP_PIN_SHARE: false,
    FLAG_STARLINK_WIFI_CARD: true,
    FLAG_SLA_REPORT_OUTAGE: false,
    FLAG_SLA_2HR_CURE_TIMER: false,
    FLAG_SLA_MOMO_REFUND: false,
    FLAG_CARETAKER_WHATSAPP_BOT: false,
    FLAG_SCOUT_HEADER_MODE: false,
    FLAG_SCOUT_OFFLINE_MODE: false,
    FLAG_SCOUT_AI_VISION: false,
    FLAG_SCOUT_FLEET_GOVERNANCE: false,
    FLAG_HOST_LIST_PROPERTY: true,
    FLAG_AI_SURGE_PRICING: false,
    FLAG_GRA_TAX_REMITTANCE: false
  },

  // Preset 3: FULL_FLEX (Autonomous Superhero Mode - All 20 ON)
  FULL_FLEX: {
    ...DEFAULT_FLAGS
  }
};

let currentFlags = { ...DEFAULT_FLAGS };
let activePreset = 'FULL_FLEX';

// Load from disk if exists
try {
  if (fs.existsSync(FLAGS_FILE)) {
    const saved = JSON.parse(fs.readFileSync(FLAGS_FILE, 'utf8'));
    if (saved && saved.flags) {
      currentFlags = { ...DEFAULT_FLAGS, ...saved.flags };
      activePreset = saved.activePreset || 'CUSTOM';
    }
  }
} catch (e) {
  console.warn('Could not load flags.json, using defaults', e.message);
}

function saveToDisk() {
  try {
    fs.writeFileSync(FLAGS_FILE, JSON.stringify({ activePreset, flags: currentFlags }, null, 2));
  } catch (e) {
    console.error('Failed to save flags to disk', e.message);
  }
}

function getFlags() {
  return {
    success: true,
    activePreset,
    flags: currentFlags,
    metadata: FLAG_METADATA,
    presets: Object.keys(PRESETS)
  };
}

function updateFlags(updates) {
  if (updates.preset && PRESETS[updates.preset]) {
    currentFlags = { ...PRESETS[updates.preset] };
    activePreset = updates.preset;
  } else if (updates.flags) {
    currentFlags = { ...currentFlags, ...updates.flags };
    activePreset = 'CUSTOM';
  }
  saveToDisk();
  return getFlags();
}

function resetFlags() {
  currentFlags = { ...DEFAULT_FLAGS };
  activePreset = 'FULL_FLEX';
  saveToDisk();
  return getFlags();
}

module.exports = {
  getFlags,
  updateFlags,
  resetFlags,
  PRESETS,
  DEFAULT_FLAGS,
  FLAG_METADATA
};
