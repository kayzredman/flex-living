import React, { useState, useEffect } from 'react';
import {
  ShieldCheckIcon,
  ZapIcon,
  WifiIcon,
  DropletsIcon,
  LockIcon,
  UnlockIcon,
  KeyIcon,
  StarIcon,
  CheckCircleIcon
} from '../components/Icons';

export default function StayManagement({ property, onBack, currency = 'GHS', flags = {} }) {
  const [outageState, setOutageState] = useState('IDLE'); // IDLE, DIAGNOSING, DIAGNOSED, RELOCATING
  const [cureTimer, setCureTimer] = useState(7200); // 2 hours in seconds

  // Smart Lock State
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [lockStatus, setLockStatus] = useState('LOCKED'); // LOCKED, UNLOCKING, UNLOCKED
  const [masterPin, setMasterPin] = useState('849 201');
  const [guestPins, setGuestPins] = useState([
    { id: 1, label: 'Cleaner (Weekly)', pin: '312 904', validity: 'Active today (2h left)', type: 'CLEANER' }
  ]);
  const [isGeneratingPin, setIsGeneratingPin] = useState(false);
  const [copiedPin, setCopiedPin] = useState(null);

  // WhatsApp Caretaker Bot Simulator
  const [caretakerChat, setCaretakerChat] = useState([
    {
      sender: 'BOT',
      text: `Flex-Living Bot: Morning Pulse Check for ${property.title}. Please verify grid power, battery reserve, and water tank levels.`,
      time: '07:00 AM'
    }
  ]);
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    let interval = null;
    if (outageState === 'DIAGNOSED' && cureTimer > 0) {
      interval = setInterval(() => {
        setCureTimer(prev => prev - 1);
      }, 1000);
    } else if (cureTimer === 0 && outageState === 'DIAGNOSED') {
      setOutageState('RELOCATING');
    }
    return () => clearInterval(interval);
  }, [outageState, cureTimer]);

  const reportOutage = () => {
    setOutageState('DIAGNOSING');
    setTimeout(() => {
      setOutageState('DIAGNOSED');
    }, 2000);
  };

  const fastForward = () => {
    setCureTimer(0);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Trigger BLE Deadbolt Actuator
  const handleUnlockDoor = () => {
    setLockStatus('UNLOCKING');
    setTimeout(() => {
      setLockStatus('UNLOCKED');
      setTimeout(() => {
        setLockStatus('LOCKED');
      }, 7000); // Auto-locks after 7 seconds
    }, 1200);
  };

  // Generate TTLock Temporary Guest PIN
  const handleGenerateGuestPin = (typeLabel, duration) => {
    setIsGeneratingPin(true);
    setTimeout(() => {
      const randomPin = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
      const newPin = {
        id: Date.now(),
        label: typeLabel,
        pin: randomPin,
        validity: `Expires in ${duration}`,
        type: typeLabel.toUpperCase()
      };
      setGuestPins(prev => [newPin, ...prev]);
      setIsGeneratingPin(false);
    }, 600);
  };

  // WhatsApp Caretaker 1-Tap Quick-Reply
  const handleCaretakerQuickReply = (text, statusImpact) => {
    setIsReplying(true);
    const caretakerMsg = {
      sender: 'CARETAKER',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCaretakerChat(prev => [...prev, caretakerMsg]);

    setTimeout(() => {
      let botResponse = '';
      if (statusImpact === 'OK') {
        botResponse = 'Flex-Living Bot: ✅ Telemetry verified and logged into Escrow Ledger. 99.5% Uptime SLA Guaranteed for today.';
      } else if (statusImpact === 'INVERTER') {
        botResponse = 'Flex-Living Bot: ⚡ ECG grid failure noted. Inverter battery healthy at 88%. Tenant notified of zero interruption.';
      } else {
        botResponse = 'Flex-Living Bot: 🚨 Low diesel alert logged! Automated dispatch notification sent to StarOil Ghana fuel truck.';
      }

      setCaretakerChat(prev => [...prev, {
        sender: 'BOT',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsReplying(false);
    }, 800);
  };

  return (
    <div className="screen-container" style={{ padding: '1.5rem 2rem', maxWidth: '880px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
        <button 
          onClick={onBack}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ←
        </button>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E9A319', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ACTIVE RESIDENCE • {flags.FLAG_SLA_2HR_CURE_TIMER !== false ? '99.5% SLA ESCROW PROTECTED' : 'STAY COMMAND'}
          </span>
          <h2 style={{ fontSize: '1.75rem', margin: 0, color: '#FFFFFF', fontWeight: 900 }}>
            Stay Command & Smart Access Hub
          </h2>
        </div>
      </div>

      {/* Residence Summary Banner */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <img src={property.image} alt={property.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px 0' }}>{property.title}</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>
              Check-in: Confirmed • {flags.FLAG_HOST_ESCROW_VAULT !== false && '15% Escrow Reserve Active'}
            </p>
          </div>
          {flags.FLAG_SLA_2HR_CURE_TIMER !== false && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '6px 14px', borderRadius: '16px' }}>
              <ShieldCheckIcon size={14} color="#10B981" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981' }}>99.5% UPTIME ACTIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* FIGMA SMART DEADBOLT CONTROLLER */}
      {flags.FLAG_TTLOCK_MASTER_PIN !== false && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(233,163,25,0.12), rgba(7,21,32,0.95))',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(233,163,25,0.3)',
          marginBottom: '1.5rem',
          boxShadow: '0 15px 40px rgba(0,0,0,0.6)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(233,163,25,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KeyIcon size={18} color="#E9A319" />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 900 }}>
                  Smart Deadbolt Keyway (TTLock Cloud Pass)
                </h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>
                  AES-256 encrypted Bluetooth pass synced with physical deadbolt
                </p>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', padding: '4px 10px', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: '#10B981', display: 'inline-block' }} />
              BLE Connected (94% Batt)
            </span>
          </div>

          {/* Interactive Unlock Button (Matching iPhone 16 Pro Artboard) */}
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleUnlockDoor}
              disabled={lockStatus === 'UNLOCKING'}
              style={{
                width: '100%',
                background: lockStatus === 'UNLOCKED' 
                  ? '#10B981' 
                  : lockStatus === 'UNLOCKING'
                  ? '#06B6D4'
                  : 'linear-gradient(135deg, #E9A319, #D97706)',
                color: '#071520',
                border: 'none',
                padding: '16px',
                borderRadius: '16px',
                fontWeight: 900,
                fontSize: '1.05rem',
                cursor: lockStatus === 'UNLOCKING' ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(233,163,25,0.3)',
                transition: 'all 0.25s ease'
              }}
            >
              {lockStatus === 'UNLOCKED' ? (
                <>
                  <UnlockIcon size={20} color="#071520" />
                  <span>Door Unlocked! (Auto-Locks in 7s)</span>
                </>
              ) : lockStatus === 'UNLOCKING' ? (
                <>
                  <span style={{ animation: 'spin 1s infinite linear' }}>⏳</span>
                  <span>Connecting to BLE Actuator...</span>
                </>
              ) : (
                <>
                  <LockIcon size={20} color="#071520" />
                  <span>Hold to Unlock Deadbolt</span>
                </>
              )}
            </button>
          </div>

          {/* Master PIN Box */}
          <div style={{
            background: 'rgba(7,21,32,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '16px 20px',
            borderRadius: '16px',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>
                Master Keypad PIN (Active for Stay)
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#E9A319', letterSpacing: '6px', marginTop: '2px' }}>
                {masterPin}
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(masterPin.replace(' ', ''));
                setCopiedPin('MASTER');
                setTimeout(() => setCopiedPin(null), 2000);
              }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {copiedPin === 'MASTER' ? '✓ Copied' : '📋 Copy PIN'}
            </button>
          </div>

          {/* Generate Visitor / Cleaner PIN Passes */}
          {flags.FLAG_TTLOCK_GUEST_PASSES !== false && (
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>Generate Guest Pass:</span>
                <button
                  onClick={() => handleGenerateGuestPin('Cleaner Pass', '2 Hours')}
                  disabled={isGeneratingPin}
                  style={{ background: 'rgba(233,163,25,0.15)', border: '1px solid #E9A319', color: '#FDE68A', padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  🧹 Cleaner (2h)
                </button>
                <button
                  onClick={() => handleGenerateGuestPin('Food & Delivery', '45 Mins')}
                  disabled={isGeneratingPin}
                  style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid #06B6D4', color: '#A5F3FC', padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  🛵 Delivery (45m)
                </button>
                <button
                  onClick={() => handleGenerateGuestPin('Visitor / Friend', '24 Hours')}
                  disabled={isGeneratingPin}
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', color: '#A7F3D0', padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  👥 Guest (24h)
                </button>
              </div>

              {guestPins.map(gp => (
                <div key={gp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: '12px', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>{gp.label}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginLeft: '10px' }}>
                      PIN: <strong style={{ color: '#E9A319' }}>{gp.pin}</strong>
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>{gp.validity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* WHATSAPP CARETAKER BOT SIMULATOR */}
      {flags.FLAG_CARETAKER_WHATSAPP_BOT !== false && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
              💬
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800 }}>
                Caretaker Autonomous WhatsApp Pulse
              </h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>
                Daily morning protocol verifying generator diesel & borehole levels
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{ background: '#071520', borderRadius: '16px', padding: '16px', maxHeight: '200px', overflowY: 'auto', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {caretakerChat.map((msg, idx) => (
              <div key={idx} style={{
                marginBottom: '10px',
                textAlign: msg.sender === 'CARETAKER' ? 'right' : 'left'
              }}>
                <div style={{
                  display: 'inline-block',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: msg.sender === 'CARETAKER' ? '#0F3460' : 'rgba(255,255,255,0.08)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  textAlign: 'left',
                  border: msg.sender === 'CARETAKER' ? '1px solid #1E4F8A' : '1px solid rgba(255,255,255,0.08)'
                }}>
                  {msg.text}
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '4px', textAlign: 'right' }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick-Reply Actions */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleCaretakerQuickReply('Everything OK: Grid power active, water 90%, battery 100%.', 'OK')}
              disabled={isReplying}
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', color: '#A7F3D0', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              ✅ Send "All OK & Verified"
            </button>
            <button
              onClick={() => handleCaretakerQuickReply('ECG power is out, inverter switched over automatically. Battery 88%.', 'INVERTER')}
              disabled={isReplying}
              style={{ background: 'rgba(233,163,25,0.15)', border: '1px solid #E9A319', color: '#FDE68A', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              ⚡ Report "Grid Outage / Inverter Active"
            </button>
          </div>
        </div>
      )}

      {/* OUTAGE DIAGNOSTICS & SLA 2-HOUR CURE ENGINE */}
      {flags.FLAG_SLA_REPORT_OUTAGE !== false && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheckIcon size={18} color="#10B981" />
              SLA Outage Diagnostic & 2-Hour Cure Clock
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Automated Escrow Protocol</span>
          </div>

          {outageState === 'IDLE' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.85rem' }}>
                All systems reporting nominal telemetry. If an unresolvable outage occurs, trigger the diagnostic below.
              </p>
              <button
                onClick={reportOutage}
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid #EF4444',
                  color: '#FCA5A5',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                🚨 Report Outage
              </button>
            </div>
          )}

          {outageState === 'DIAGNOSING' && (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📡</div>
              <div style={{ fontWeight: 800, color: '#E9A319' }}>Pinging IoT Smart Meters & Inverter...</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Cross-referencing grid sensors and caretaker logs</div>
            </div>
          )}

          {outageState === 'DIAGNOSED' && (
            <div>
              <div style={{ background: '#2A1515', border: '1px solid #EF4444', borderRadius: '14px', padding: '16px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: '#FCA5A5', fontSize: '0.9rem' }}>Outage Confirmed: Generator Relay Failure</strong>
                  <span style={{ color: '#E9A319', fontWeight: 900, fontSize: '1.2rem' }}>{formatTime(cureTimer)}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                  Host and Caretaker dispatched. If not resolved within 2 hours, $35/hr outage credit and relocation voucher are automatically transferred.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={fastForward}
                  style={{
                    background: 'rgba(233,163,25,0.15)',
                    border: '1px solid #E9A319',
                    color: '#FDE68A',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  ⏩ Fast-Forward (Simulate 2-Hour Expiry)
                </button>
                <button
                  onClick={() => setOutageState('IDLE')}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Clear Outage
                </button>
              </div>
            </div>
          )}

          {outageState === 'RELOCATING' && (
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <CheckCircleIcon size={20} color="#10B981" />
                <strong style={{ color: '#A7F3D0', fontSize: '1rem' }}>2-Hour Cure Clock Expired: Escrow Claim Approved!</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#FFFFFF', lineHeight: 1.5 }}>
                $70.00 MoMo compensation credit transferred to your wallet. Uber voucher and partner co-working day pass dispatched via SMS.
              </p>
              <button
                onClick={() => setOutageState('IDLE')}
                style={{
                  marginTop: '12px',
                  background: '#10B981',
                  color: '#071520',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Dismiss Protocol
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
