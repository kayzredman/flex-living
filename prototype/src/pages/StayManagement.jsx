import React, { useState, useEffect } from 'react';

export default function StayManagement({ property, onBack }) {
  const [outageState, setOutageState] = useState('IDLE'); // IDLE, DIAGNOSING, DIAGNOSED, RELOCATING
  const [cureTimer, setCureTimer] = useState(7200); // 2 hours in seconds

  // Pillar 4: TTLock / Tuya Hardware Smart Lock Time-Bound PIN Engine
  const [masterPin, setMasterPin] = useState('849 201');
  const [guestPins, setGuestPins] = useState([
    { id: 1, label: 'Cleaner (Weekly)', pin: '312 904', validity: 'Active today (2h left)', type: 'CLEANER' }
  ]);
  const [isGeneratingPin, setIsGeneratingPin] = useState(false);
  const [copiedPin, setCopiedPin] = useState(null);

  // Pillar 3: Interactive WhatsApp Caretaker Bot Simulator
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
    // Add Caretaker message
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
    <div className="screen-container">
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div className="d-flex align-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="btn glass"
            style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--teal)' }}
          >
            ←
          </button>
          <div>
            <span className="text-secondary text-xs">Active Stay Management • 99.5% SLA Guarantee</span>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--teal)' }}>Active Stay Command Hub</h2>
          </div>
        </div>

        <div className="property-card" style={{ marginBottom: '1.5rem' }}>
          <img src={property.image} alt={property.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{property.title}</h3>
              <span className="badge badge-verified">✓ 99.5% Uptime SLA Protected</span>
            </div>
            <p className="text-sm text-secondary">Check-in: Confirmed • Escrow Protected</p>
          </div>
        </div>

        {/* PILLAR 4: TTLock / Tuya Hardware Smart Lock Time-Bound PIN Engine */}
        <div className="glass mb-4" style={{ borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🔐</span>
              <div>
                <h4 style={{ margin: 0, color: 'var(--teal)', fontSize: '1.1rem' }}>Smart Lock Keypad Pass (TTLock Engine)</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  AES-256 encrypted time-bound PIN codes synced with physical deadbolt
                </p>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
              ● Bluetooth & Gateway Online (94% Batt)
            </span>
          </div>

          <div style={{ background: '#0F2537', padding: '1.25rem', borderRadius: '14px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 800 }}>
                Master Tenant Keypad PIN (Active for Stay)
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '4px', marginTop: '2px' }}>
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
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '8px 14px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {copiedPin === 'MASTER' ? '✓ Copied' : '📋 Copy PIN'}
            </button>
          </div>

          {/* Quick-Generate Visitor / Cleaner PIN Buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Generate Self-Expiring Code:</span>
            <button
              onClick={() => handleGenerateGuestPin('Cleaner Pass', '2 Hours')}
              disabled={isGeneratingPin}
              style={{ background: 'rgba(233,163,25,0.15)', border: '1px solid var(--gold)', color: 'var(--gold-light)', padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🧹 Cleaner (2h Pass)
            </button>
            <button
              onClick={() => handleGenerateGuestPin('Food & Delivery', '45 Mins')}
              disabled={isGeneratingPin}
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--success)', color: 'var(--success)', padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🛵 Delivery (45m Pass)
            </button>
            <button
              onClick={() => handleGenerateGuestPin('Guest / Friend', '24 Hours')}
              disabled={isGeneratingPin}
              style={{ background: 'rgba(233,69,96,0.15)', border: '1px solid var(--coral)', color: 'var(--coral)', padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              👥 Guest (24h Pass)
            </button>
          </div>

          {/* Active Guest Pass Cards */}
          {guestPins.map(gp => (
            <div key={gp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '10px', marginBottom: '6px' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'white' }}>{gp.label}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>PIN: <strong style={{ color: 'var(--gold-light)' }}>{gp.pin}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 'bold' }}>{gp.validity}</span>
                <button
                  onClick={() => alert(`Sharing PIN ${gp.pin} for ${gp.label} via WhatsApp...`)}
                  style={{ background: '#25D366', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  📲 Share WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PILLAR 3: Interactive WhatsApp Caretaker Bot Simulator */}
        <div className="glass mb-4" style={{ borderRadius: '16px', padding: '1.5rem', border: '1px solid #25D366' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>💬</span>
              <div>
                <h4 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>Caretaker WhatsApp Daily Pulse</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Meta Cloud API webhook with 1-tap quick reply buttons for on-ground caretakers
                </p>
              </div>
            </div>
            <span style={{ background: '#25D366', color: '#0B1B26', padding: '3px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900 }}>
              WHATSAPP LIVE
            </span>
          </div>

          {/* WhatsApp Chat Log Box */}
          <div style={{ background: '#0B141B', borderRadius: '12px', padding: '12px', minHeight: '130px', maxHeight: '200px', overflowY: 'auto', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {caretakerChat.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.sender === 'CARETAKER' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.sender === 'CARETAKER' ? '#005C4B' : '#202C33',
                color: '#E9EDEF',
                padding: '8px 12px',
                borderRadius: msg.sender === 'CARETAKER' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                fontSize: '0.8rem',
                lineHeight: 1.4
              }}>
                <div>{msg.text}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.6, textAlign: 'right', marginTop: '2px' }}>{msg.time}</div>
              </div>
            ))}
            {isReplying && (
              <div style={{ fontSize: '0.75rem', color: '#25D366', fontStyle: 'italic' }}>
                Caretaker is typing via WhatsApp...
              </div>
            )}
          </div>

          {/* 1-Tap Quick-Reply Buttons (Meta Cloud API Simulator) */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '100%' }}>
              Simulate Caretaker 1-Tap WhatsApp Response:
            </span>
            <button
              onClick={() => handleCaretakerQuickReply('🟢 Grid is Normal, water tank 100% full, all systems green.', 'OK')}
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--success)', color: 'var(--success)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🟢 1: Grid Normal & Water Full
            </button>
            <button
              onClick={() => handleCaretakerQuickReply('⚡ ECG Blackout in Cantonments. Inverter running smooth, 88% battery left.', 'INVERTER')}
              style={{ background: 'rgba(233,163,25,0.15)', border: '1px solid var(--gold)', color: 'var(--gold-light)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ⚡ 2: ECG Outage - Inverter Active
            </button>
            <button
              onClick={() => handleCaretakerQuickReply('🚨 Generator diesel at 18%. Refill requested from StarOil.', 'DIESEL')}
              style={{ background: 'rgba(233,69,96,0.15)', border: '1px solid var(--coral)', color: 'var(--coral)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🚨 3: Diesel Below 20%
            </button>
          </div>
        </div>

        {/* SLA Outage Resolution Flow */}
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>SLA Outage Diagnostic & Resolution</h3>

        {outageState === 'IDLE' && (
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔌</div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--teal)' }}>Experiencing an Issue?</h4>
            <p className="text-sm text-secondary mb-4">Power or internet down? Tap below to run automated diagnostics.</p>
            <button className="btn btn-primary w-100" onClick={reportOutage}>
              Report Outage & Trigger SLA Check
            </button>
          </div>
        )}

        {outageState === 'DIAGNOSING' && (
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
            <div className="mb-4" style={{ animation: 'pulse 1.5s infinite' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--coral)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
                📡
              </div>
            </div>
            <h4 style={{ color: 'var(--teal)', marginBottom: '0.5rem' }}>Running Diagnostics...</h4>
            <p className="text-sm text-secondary">Pinging IoT Smart Plug and Edge Router.</p>
          </div>
        )}

        {outageState === 'DIAGNOSED' && (
          <div className="glass-dark" style={{ padding: '1.5rem', borderRadius: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--error)' }}>⚠️</span>
              <h4 style={{ color: 'white', margin: 0 }}>Critical Outage Confirmed</h4>
            </div>
            <p className="text-sm mb-4" style={{ opacity: 0.9 }}>
              Grid power lost. Generator switchover failed. Host has been notified.
            </p>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1rem' }}>
              <div className="text-xs mb-1" style={{ opacity: 0.8 }}>Host Cure Timer</div>
              <div className="font-display font-bold" style={{ fontSize: '2rem', color: 'var(--coral)' }}>
                {formatTime(cureTimer)}
              </div>
            </div>

            <p className="text-xs mb-4" style={{ opacity: 0.8, textAlign: 'center' }}>
              If the issue is not resolved when the timer expires, you will receive an automatic refund from host escrow and free relocation.
            </p>

            <button className="btn btn-outline w-100" style={{ borderColor: 'white', color: 'white' }} onClick={fastForward}>
              Fast-Forward Timer (Demo)
            </button>
          </div>
        )}

        {outageState === 'RELOCATING' && (
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', border: '2px solid var(--coral)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>🚀</div>
            <h4 style={{ color: 'var(--coral)', textAlign: 'center', marginBottom: '0.5rem' }}>SLA Breach Triggered</h4>
            <p className="text-sm text-center text-secondary mb-4">
              The host failed to cure the outage within 2 hours. Your escrow compensation has been disbursed.
            </p>
            <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div className="d-flex justify-between mb-2">
                <span className="text-sm font-bold text-teal">Escrow Refund Credited:</span>
                <span className="text-sm font-bold text-teal">GHS 3,500 via MTN MoMo</span>
              </div>
              <div className="d-flex justify-between">
                <span className="text-sm text-secondary">Host Status:</span>
                <span className="text-sm text-secondary">SLA Penalty Applied</span>
              </div>
            </div>
            <button className="btn btn-primary w-100" onClick={() => onBack()}>
              Return to Live Feed &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

