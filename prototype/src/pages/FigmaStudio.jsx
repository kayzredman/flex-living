import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  ZapIcon,
  WifiIcon,
  DropletsIcon,
  LockIcon,
  KeyIcon,
  SearchIcon,
  SlidersIcon,
  MapPinIcon,
  CompassIcon,
  CheckCircleIcon,
  StarIcon,
  TrendingUpIcon,
  BellIcon,
  CreditCardIcon,
  ChevronRightIcon,
  SparklesIcon,
  LayersIcon
} from '../components/Icons';

export default function FigmaStudio({ onBack }) {
  const [activeTab, setActiveTab] = useState('FIGMA_BOARDS'); // 'FIGMA_BOARDS', 'INTERACTIVE_DESKTOP', 'INTERACTIVE_MOBILE', 'DESIGN_TOKENS'
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedElement, setSelectedElement] = useState('PropertyCard');
  const [currency, setCurrency] = useState('GHS');
  const [activeCity, setActiveCity] = useState('Accra');

  const formatPrice = (ghs) => {
    if (currency === 'USD') return `$${Math.round(ghs / 15).toLocaleString()}`;
    if (currency === 'NGN') return `₦${(ghs * 105).toLocaleString()}`;
    return `GHS ${ghs.toLocaleString()}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      background: '#1E1E1E',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Top Figma Workspace Toolbar */}
      <div style={{
        height: '48px',
        background: '#2C2C2C',
        borderBottom: '1px solid #383838',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 100
      }}>
        {/* Left: Back + File Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{
              background: '#383838',
              border: 'none',
              color: '#E0E0E0',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Exit to App
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="26" viewBox="0 0 38 57" fill="none">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
            </svg>
            <span style={{ fontWeight: 600, fontSize: '13px', color: '#F5F5F5' }}>
              FlexLiving African Luxury OS • Figma Design System & Artboards
            </span>
            <span style={{ fontSize: '11px', background: '#383838', color: '#0ACF83', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              v2.4 High-Fi
            </span>
          </div>
        </div>

        {/* Center: Artboard Selector Tabs */}
        <div style={{ display: 'flex', background: '#1E1E1E', padding: '3px', borderRadius: '8px' }}>
          {[
            { key: 'FIGMA_BOARDS', label: '🖼️ Master Figma Canvas', count: '4K' },
            { key: 'INTERACTIVE_DESKTOP', label: '🖥️ Desktop Web (1440px)', count: 'Live' },
            { key: 'INTERACTIVE_MOBILE', label: '📱 iPhone 16 Pro (393px)', count: 'Live' },
            { key: 'DESIGN_TOKENS', label: '🎨 Tokens & Components', count: '24' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? '#0C8CE9' : 'transparent',
                color: activeTab === tab.key ? '#FFFFFF' : '#A0A0A0',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '10px',
                background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#2C2C2C',
                padding: '1px 5px',
                borderRadius: '4px'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Zoom & Share */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#1E1E1E', borderRadius: '6px', padding: '2px 8px', fontSize: '12px', color: '#A0A0A0' }}>
            <span style={{ cursor: 'pointer', padding: '2px 6px' }} onClick={() => setZoomLevel(Math.max(50, zoomLevel - 15))}>−</span>
            <span style={{ padding: '0 6px', fontWeight: 600, color: '#FFF' }}>{zoomLevel}%</span>
            <span style={{ cursor: 'pointer', padding: '2px 6px' }} onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}>+</span>
          </div>

          <button
            style={{
              background: '#0C8CE9',
              color: '#FFF',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>▶ Present</span>
          </button>
        </div>
      </div>

      {/* Main Figma Workspace Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Layers & Pages Sidebar */}
        <div style={{
          width: '240px',
          background: '#242424',
          borderRight: '1px solid #333333',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '12px'
        }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #333', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Layers & Frames
          </div>
          
          <div style={{ padding: '8px', overflowY: 'auto', flex: 1 }}>
            <div style={{ color: '#0C8CE9', fontWeight: 700, padding: '6px 8px', borderRadius: '4px', background: 'rgba(12,140,233,0.1)', marginBottom: '4px' }}>
              # FlexLiving Master OS
            </div>
            
            {[
              { id: 'FIGMA_BOARDS', name: '❖ Figma Master Canvas (Hi-Fi)', icon: '🖼️' },
              { id: 'INTERACTIVE_DESKTOP', name: '↳ Frame: Desktop Web 1440px', icon: '🖥️' },
              { id: 'INTERACTIVE_MOBILE', name: '↳ Frame: Mobile iOS 393px', icon: '📱' },
              { id: 'DESIGN_TOKENS', name: '❖ Design Tokens & Colors', icon: '🎨' }
            ].map(layer => (
              <div
                key={layer.id}
                onClick={() => setActiveTab(layer.id)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: activeTab === layer.id ? '#FFF' : '#AAA',
                  background: activeTab === layer.id ? '#333' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '2px'
                }}
              >
                <span>{layer.icon}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{layer.name}</span>
              </div>
            ))}

            <div style={{ marginTop: '16px', padding: '6px 8px', color: '#666', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>
              Components Catalog
            </div>
            {['PropertyCard.Luxury', 'HeroBanner.AfricanObsidian', 'VectorBadge.SolarATS', 'VectorBadge.Starlink', 'LockController.TTLockBLE', 'EscrowGuarantor.MoMo'].map(comp => (
              <div
                key={comp}
                onClick={() => setSelectedElement(comp)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  color: selectedElement === comp ? '#0ACF83' : '#888',
                  background: selectedElement === comp ? 'rgba(10,207,131,0.1)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                ◇ {comp}
              </div>
            ))}
          </div>
        </div>

        {/* Center Canvas Area (Infinite Pan / Zoom Canvas) */}
        <div style={{
          flex: 1,
          background: '#181818',
          overflow: 'auto',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* TAB 1: MASTER FIGMA CONCEPT BOARDS (4K HIGH-FI RENDERS) */}
          {activeTab === 'FIGMA_BOARDS' && (
            <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}>
              {/* Artboard 1: Desktop Web */}
              <div style={{ marginBottom: '50px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>Frame: Desktop Web — 1440 × 900</span>
                  <span style={{ fontSize: '10px', background: '#2C2C2C', color: '#E9A319', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    Master Artboard 01
                  </span>
                </div>
                <div style={{
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #383838'
                }}>
                  <img
                    src="/figma_desktop_ui.jpg"
                    alt="Figma Desktop Web Design"
                    style={{ width: '1100px', display: 'block' }}
                  />
                </div>
              </div>

              {/* Artboard 2: Mobile Handset Artboard */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>Frame: Mobile iOS — 393 × 852 (iPhone 16 Pro)</span>
                  <span style={{ fontSize: '10px', background: '#2C2C2C', color: '#0ACF83', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    Master Artboard 02
                  </span>
                </div>
                <div style={{
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #383838'
                }}>
                  <img
                    src="/figma_mobile_ui.jpg"
                    alt="Figma Mobile iOS Design"
                    style={{ width: '1100px', display: 'block' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE DESKTOP WEB ARTBOARD */}
          {activeTab === 'INTERACTIVE_DESKTOP' && (
            <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', width: '1180px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>Frame: Live Interactive Desktop Prototype (1180px Viewport)</span>
                <span style={{ fontSize: '10px', background: '#0C8CE9', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  Interactive Live DOM
                </span>
              </div>

              {/* Interactive Web UI Container */}
              <div style={{
                background: '#071520',
                borderRadius: '16px',
                border: '1px solid #2A3B4C',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                overflow: 'hidden'
              }}>
                {/* Simulated Web Nav */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 28px',
                  background: 'rgba(7,21,32,0.95)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#E9A319', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#071520', fontSize: '16px' }}>
                      FL
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF' }}>FlexLiving</div>
                      <div style={{ fontSize: '10px', color: '#E9A319', fontWeight: 700, letterSpacing: '0.5px' }}>AFRICAN LUXURY STAYS</div>
                    </div>
                  </div>

                  {/* Search Lens */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '24px',
                    padding: '8px 18px',
                    width: '380px'
                  }}>
                    <SearchIcon size={16} color="#E9A319" />
                    <span style={{ color: '#94A3B8', fontSize: '13px' }}>Search Accra, Lagos, Nairobi (Solar, Starlink, Borehole)...</span>
                  </div>

                  {/* Right Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2px' }}>
                      {['GHS', 'USD', 'NGN'].map(c => (
                        <button
                          key={c}
                          onClick={() => setCurrency(c)}
                          style={{
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '14px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: currency === c ? '#E9A319' : 'transparent',
                            color: currency === c ? '#071520' : '#A0A0A0'
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', padding: '5px 12px', borderRadius: '20px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '11px', background: '#0C8CE9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                        KM
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>Kofi Mensah</span>
                    </div>
                  </div>
                </div>

                {/* Hero Showcase */}
                <div style={{ padding: '36px 32px 24px 32px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(233,163,25,0.15)', border: '1px solid #E9A319', padding: '6px 14px', borderRadius: '20px', marginBottom: '14px' }}>
                    <ShieldCheckIcon size={16} color="#E9A319" />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#FDE68A' }}>99.5% INFRASTRUCTURE UPTIME SLA ESCROW</span>
                    <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: '#10B981' }} />
                  </div>

                  <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#FFF', margin: '0 0 10px 0', letterSpacing: '-0.03em' }}>
                    Discover Exquisite Living in <span style={{ color: '#E9A319' }}>Africa's Vibrant Capitals</span>
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 24px 0', maxWidth: '680px' }}>
                    Physical 200-point inspection by Field Scouts. Instant automatic compensation for power or water outages backed by bank escrow.
                  </p>

                  {/* City Selector */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
                    {['Accra', 'Lagos', 'Nairobi'].map(city => (
                      <button
                        key={city}
                        onClick={() => setActiveCity(city)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 16px',
                          borderRadius: '16px',
                          border: activeCity === city ? '1.5px solid #E9A319' : '1px solid rgba(255,255,255,0.12)',
                          background: activeCity === city ? '#E9A319' : 'rgba(255,255,255,0.06)',
                          color: activeCity === city ? '#071520' : '#FFF',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <MapPinIcon size={14} color={activeCity === city ? '#071520' : '#E9A319'} />
                        {city}
                      </button>
                    ))}
                  </div>

                  {/* Property Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    {/* Card 1 */}
                    <div style={{
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '18px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ position: 'relative', height: '220px' }}>
                        <img src="/accra.jpg" alt="Accra" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(7,21,32,0.85)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <CheckCircleIcon size={13} color="#10B981" />
                          <span style={{ fontSize: '11px', fontWeight: 800 }}>SCOUT AUDITED</span>
                        </div>
                      </div>

                      <div style={{ padding: '20px' }}>
                        <div style={{ fontSize: '11px', color: '#E9A319', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                          CANTONMENTS, ACCRA
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>
                          The Glasshouse Serviced Apartment #4B
                        </div>

                        {/* Vector Telemetry Pills */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                          <span style={{ background: 'rgba(233,163,25,0.12)', border: '1px solid rgba(233,163,25,0.3)', color: '#FDE68A', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ZapIcon size={13} color="#E9A319" fill="#E9A319" />
                            24/7 Solar ATS &lt; 6.2s
                          </span>
                          <span style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#A5F3FC', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <WifiIcon size={13} color="#06B6D4" />
                            Starlink 185 Mbps
                          </span>
                          <span style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#A7F3D0', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LockIcon size={13} color="#10B981" />
                            Keyless Door Pass
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <div>
                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#E9A319' }}>{formatPrice(4500)}</span>
                            <span style={{ fontSize: '12px', color: '#94A3B8' }}> / month</span>
                          </div>
                          <button style={{ background: '#E9A319', color: '#071520', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div style={{
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '18px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ position: 'relative', height: '220px' }}>
                        <img src="/lagos.jpg" alt="Lagos" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(7,21,32,0.85)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <CheckCircleIcon size={13} color="#10B981" />
                          <span style={{ fontSize: '11px', fontWeight: 800 }}>SCOUT AUDITED</span>
                        </div>
                      </div>

                      <div style={{ padding: '20px' }}>
                        <div style={{ fontSize: '11px', color: '#E9A319', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                          LEKKI PHASE 1, LAGOS
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>
                          The Palms Minimalist Work Studio
                        </div>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                          <span style={{ background: 'rgba(233,163,25,0.12)', border: '1px solid rgba(233,163,25,0.3)', color: '#FDE68A', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ZapIcon size={13} color="#E9A319" fill="#E9A319" />
                            15kVA Solar Inverter
                          </span>
                          <span style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#A5F3FC', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <WifiIcon size={13} color="#06B6D4" />
                            Dedicated Fibre 50 Mbps
                          </span>
                          <span style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#A7F3D0', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ShieldCheckIcon size={13} color="#10B981" />
                            Gated Security Patrol
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <div>
                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#E9A319' }}>{formatPrice(6500)}</span>
                            <span style={{ fontSize: '12px', color: '#94A3B8' }}> / month</span>
                          </div>
                          <button style={{ background: '#E9A319', color: '#071520', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE MOBILE iOS HANDSET */}
          {activeTab === 'INTERACTIVE_MOBILE' && (
            <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>Frame: iPhone 16 Pro (393 × 852 Viewport)</span>
                <span style={{ fontSize: '10px', background: '#0ACF83', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  iOS Simulator
                </span>
              </div>

              {/* iPhone Mockup Frame */}
              <div style={{
                width: '380px',
                height: '760px',
                background: '#071520',
                borderRadius: '50px',
                border: '12px solid #1E293B',
                boxShadow: '0 30px 80px rgba(0,0,0,0.9), inset 0 0 4px rgba(255,255,255,0.2)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {/* Dynamic Island */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '110px',
                  height: '28px',
                  background: '#000',
                  borderRadius: '16px',
                  zIndex: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 10px'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#10B981' }} />
                  <span style={{ fontSize: '9px', color: '#E9A319', fontWeight: 700 }}>SLA 99.5%</span>
                </div>

                {/* iOS Header */}
                <div style={{ padding: '48px 18px 12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF' }}>FlexLiving</div>
                    <div style={{ fontSize: '10px', color: '#E9A319', fontWeight: 700 }}>ACCREDITED RESIDENCES</div>
                  </div>
                  <div style={{ background: 'rgba(233,163,25,0.15)', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', color: '#FDE68A', fontWeight: 800 }}>
                    Tier 2 Verified
                  </div>
                </div>

                {/* Handset Scrollable Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                  {/* Digital Smart Key Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(233,163,25,0.15), rgba(7,21,32,0.9))',
                    border: '1px solid rgba(233,163,25,0.3)',
                    borderRadius: '20px',
                    padding: '18px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '10px', color: '#E9A319', fontWeight: 800 }}>ACTIVE RESIDENCE KEY</span>
                      <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>● BLE Connected</span>
                    </div>

                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', marginBottom: '2px' }}>
                      Cantonments Glasshouse #4B
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '16px' }}>
                      TTLock Master Pass • Valid until Dec 31
                    </div>

                    <button style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #E9A319, #D97706)',
                      color: '#071520',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '14px',
                      fontWeight: 900,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 16px rgba(233,163,25,0.3)'
                    }}>
                      <LockIcon size={16} color="#071520" />
                      Hold to Unlock Deadbolt
                    </button>
                  </div>

                  {/* Telemetry Gauges */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <WifiIcon size={14} color="#06B6D4" />
                        <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>STARLINK PING</span>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF' }}>24 ms</div>
                      <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>185 Mbps Downlink</div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <ZapIcon size={14} color="#E9A319" fill="#E9A319" />
                        <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>SOLAR ATS</span>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF' }}>98% Battery</div>
                      <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>Inverter Online</div>
                    </div>
                  </div>

                  {/* MoMo Flex-Advance Credit Facility */}
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px' }}>
                    <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Flex-Advance Rental Liquidity
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#E9A319', marginBottom: '2px' }}>
                      GHS 24,000 Limit
                    </div>
                    <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                      40% Max Debt-to-Income Facility
                    </div>
                  </div>
                </div>

                {/* Native iOS Bottom Tab Bar */}
                <div style={{
                  height: '60px',
                  background: 'rgba(7,21,32,0.95)',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  paddingBottom: '8px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <span style={{ fontSize: '16px' }}>🏠</span>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#E9A319' }}>Explore</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <KeyIcon size={16} color="#94A3B8" />
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8' }}>Smart Key</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheckIcon size={16} color="#94A3B8" />
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8' }}>SLA Ops</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <span style={{ fontSize: '16px' }}>👤</span>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8' }}>Profile</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DESIGN TOKENS & COMPONENTS */}
          {activeTab === 'DESIGN_TOKENS' && (
            <div style={{ width: '900px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>
                🎨 FlexLiving African Luxury Design Tokens (Figma Spec)
              </h2>

              {/* Color Swatches */}
              <div style={{ background: '#242424', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #333' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#888', marginBottom: '14px' }}>
                  CORE PALETTE (HSL & HEX SPEC)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                  {[
                    { name: 'Obsidian Black', hex: '#071520', desc: 'Background & Hero Base' },
                    { name: 'African Ochre Gold', hex: '#E9A319', desc: 'Primary Brand Accent' },
                    { name: 'SLA Emerald Live', hex: '#10B981', desc: '99.5% Uptime Indicator' },
                    { name: 'Starlink Cyan', hex: '#06B6D4', desc: 'Broadband Telemetry' }
                  ].map(c => (
                    <div key={c.hex} style={{ background: '#1E1E1E', borderRadius: '8px', overflow: 'hidden', border: '1px solid #383838' }}>
                      <div style={{ height: '60px', background: c.hex }} />
                      <div style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 800, fontSize: '12px', color: '#FFF' }}>{c.name}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#E9A319' }}>{c.hex}</div>
                        <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vector Icon Library Preview */}
              <div style={{ background: '#242424', borderRadius: '12px', padding: '20px', border: '1px solid #333' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#888', marginBottom: '14px' }}>
                  PRECISION VECTOR SYSTEM (Zero Emojis)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
                  {[
                    { name: 'ShieldCheck', icon: <ShieldCheckIcon size={24} color="#E9A319" /> },
                    { name: 'VictronZap', icon: <ZapIcon size={24} color="#E9A319" fill="#E9A319" /> },
                    { name: 'StarlinkWifi', icon: <WifiIcon size={24} color="#06B6D4" /> },
                    { name: 'PureBorehole', icon: <DropletsIcon size={24} color="#3B82F6" /> },
                    { name: 'SmartLock', icon: <LockIcon size={24} color="#10B981" /> },
                    { name: 'FieldCompass', icon: <CompassIcon size={24} color="#E9A319" /> }
                  ].map(item => (
                    <div key={item.name} style={{ background: '#1E1E1E', borderRadius: '8px', padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '1px solid #383838' }}>
                      {item.icon}
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#CCC' }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Figma Properties & CSS Inspector Sidebar */}
        <div style={{
          width: '280px',
          background: '#242424',
          borderLeft: '1px solid #333333',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '12px'
        }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CSS Inspector</span>
            <span style={{ color: '#0C8CE9', fontWeight: 700, fontSize: '11px' }}>Figma Spec</span>
          </div>

          <div style={{ padding: '14px', overflowY: 'auto', flex: 1 }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ color: '#888', fontSize: '11px', marginBottom: '4px' }}>Selected Layer</div>
              <div style={{ color: '#FFF', fontWeight: 700, fontSize: '13px' }}>{selectedElement}</div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ color: '#888', fontSize: '11px', marginBottom: '6px' }}>Typography</div>
              <div style={{ background: '#1E1E1E', padding: '8px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', color: '#CCC' }}>
                font-family: 'Plus Jakarta Sans', -apple-system;<br />
                font-weight: 800;<br />
                letter-spacing: -0.02em;
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ color: '#888', fontSize: '11px', marginBottom: '6px' }}>Surface & Blur</div>
              <div style={{ background: '#1E1E1E', padding: '8px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', color: '#CCC' }}>
                background: rgba(7, 21, 32, 0.95);<br />
                backdrop-filter: blur(16px);<br />
                border: 1px solid rgba(255,255,255,0.08);<br />
                border-radius: 18px;
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ color: '#888', fontSize: '11px', marginBottom: '6px' }}>Box Shadow</div>
              <div style={{ background: '#1E1E1E', padding: '8px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', color: '#CCC' }}>
                box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.7);
              </div>
            </div>

            <div style={{ borderTop: '1px solid #333', paddingTop: '12px' }}>
              <div style={{ color: '#10B981', fontWeight: 700, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✓</span> Production Ready Component
              </div>
              <div style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>
                Zero runtime dependencies. Pure CSS & vector paths.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
