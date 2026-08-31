import React, { useState, useEffect } from 'react';

export default function AdminFlags({ onBack }) {
  const [flags, setFlags] = useState({});
  const [metadata, setMetadata] = useState({});
  const [activePreset, setActivePreset] = useState('FULL_FLEX');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

  // Fetch flags from Gateway or local fallback
  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const res = await fetch('http://localhost:3004/v1/config/flags');
      if (res.ok) {
        const data = await res.json();
        setFlags(data.flags || {});
        setMetadata(data.metadata || {});
        setActivePreset(data.activePreset || 'FULL_FLEX');
      }
    } catch (e) {
      console.warn('Gateway flags fetch failed, using local cache', e.message);
    }
  };

  const handleToggleFlag = async (key) => {
    const updated = { ...flags, [key]: !flags[key] };
    setFlags(updated);
    setActivePreset('CUSTOM');
    await syncFlagsToServer({ flags: { [key]: !flags[key] } });
  };

  const handleApplyPreset = async (presetKey) => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:3004/v1/config/flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset: presetKey })
      });
      if (res.ok) {
        const data = await res.json();
        setFlags(data.flags);
        setActivePreset(data.activePreset);
        showToast(`✓ Applied preset: ${presetKey.replace('_', ' ')}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const syncFlagsToServer = async (payload) => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:3004/v1/config/flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setFlags(data.flags);
        setActivePreset(data.activePreset);
        showToast('✓ Feature flag updated in real-time');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:3004/v1/config/flags/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setFlags(data.flags);
        setActivePreset(data.activePreset);
        showToast('✓ Reset all 20 flags to Full Flex');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  // Grouping and Filtering
  const domains = ['ALL', 'Discovery', 'FinTech', 'KYC & Identity', 'Smart Access', 'SLA & Uptime', 'Scout Fleet', 'Host Operations'];

  const flagEntries = Object.entries(flags).filter(([k]) => {
    const meta = metadata[k] || {};
    const matchesDomain = selectedDomain === 'ALL' || meta.domain === selectedDomain;
    const matchesSearch = k.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (meta.label && meta.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (meta.description && meta.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  const totalOnCount = Object.values(flags).filter(Boolean).length;
  const totalCount = Object.keys(flags).length || 20;

  return (
    <div className="screen-container">
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={onBack}
              className="btn glass"
              style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--teal)' }}
            >
              ←
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>🎛️</span>
                <h2 style={{ fontSize: '1.6rem', margin: 0, color: 'var(--teal)' }}>Feature Flag Command Center</h2>
                <span style={{
                  background: activePreset === 'FULL_FLEX' ? 'rgba(16,185,129,0.2)' : activePreset === 'MARKET_BASELINE' ? 'rgba(233,163,25,0.2)' : 'rgba(233,69,96,0.2)',
                  border: `1px solid ${activePreset === 'FULL_FLEX' ? 'var(--success)' : activePreset === 'MARKET_BASELINE' ? 'var(--gold)' : 'var(--coral)'}`,
                  color: activePreset === 'FULL_FLEX' ? 'var(--success)' : activePreset === 'MARKET_BASELINE' ? 'var(--gold-light)' : 'var(--coral)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 900
                }}>
                  {activePreset} ({totalOnCount}/{totalCount} ACTIVE)
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Granular feature toggles with real-time sync across Web and Expo Mobile App.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleResetDefaults}
              disabled={isSaving}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Real-time Toast */}
        {saveSuccessMsg && (
          <div style={{
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            fontWeight: 800,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚡</span> {saveSuccessMsg}
          </div>
        )}

        {/* MASTER PRESETS BAR */}
        <div className="glass mb-4" style={{ borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--teal)', fontSize: '0.95rem' }}>1-Click Market Presets</div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Instantly adjust app complexity to match market expectations or test feature demand
              </p>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>
              ⚡ Syncs immediately to mobile handsets
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
            {/* Preset 1: Market Baseline */}
            <div
              onClick={() => handleApplyPreset('MARKET_BASELINE')}
              style={{
                background: activePreset === 'MARKET_BASELINE' ? 'rgba(233,163,25,0.18)' : 'rgba(255,255,255,0.03)',
                border: activePreset === 'MARKET_BASELINE' ? '2px solid var(--gold)' : '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ color: activePreset === 'MARKET_BASELINE' ? 'var(--gold-light)' : 'white', fontSize: '0.9rem' }}>
                  🔘 Market Baseline Peg
                </strong>
                <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '6px' }}>
                  Airbnb / Meqasa Match
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Clean, low cognitive load. Standard listings, photo browse & upfront pricing. Disables complex SLA penalties and 3D liveness.
              </p>
            </div>

            {/* Preset 2: FinTech & Escrow Pilot */}
            <div
              onClick={() => handleApplyPreset('FINTECH_ESCROW')}
              style={{
                background: activePreset === 'FINTECH_ESCROW' ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.03)',
                border: activePreset === 'FINTECH_ESCROW' ? '2px solid var(--success)' : '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ color: activePreset === 'FINTECH_ESCROW' ? 'var(--success)' : 'white', fontSize: '0.9rem' }}>
                  🚀 FinTech & Escrow Pilot
                </strong>
                <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '6px' }}>
                  Rental Liquidity
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Activates Flex-Advance monthly rent, MoMo STK Push, 15% Escrow Vault, and SmileID KYC. Kept SLA timers hidden.
              </p>
            </div>

            {/* Preset 3: Full Flex Autonomous */}
            <div
              onClick={() => handleApplyPreset('FULL_FLEX')}
              style={{
                background: activePreset === 'FULL_FLEX' ? 'rgba(233,69,96,0.18)' : 'rgba(255,255,255,0.03)',
                border: activePreset === 'FULL_FLEX' ? '2px solid var(--coral)' : '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ color: activePreset === 'FULL_FLEX' ? 'var(--coral)' : 'white', fontSize: '0.9rem' }}>
                  ⚡ Full Flex Autonomous
                </strong>
                <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '6px' }}>
                  All 20 Superpowers
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Every strategic superpower enabled: 2-hr cure timers, WhatsApp bots, TTLock PINs, AI Vision, and Detty December pricing.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                style={{
                  background: selectedDomain === d ? 'var(--teal)' : 'rgba(255,255,255,0.05)',
                  color: selectedDomain === d ? 'white' : 'var(--text-secondary)',
                  border: selectedDomain === d ? 'none' : '1px solid var(--border)',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {d}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search 20 feature switches..."
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '6px 14px',
              color: 'white',
              fontSize: '0.8rem',
              width: '220px'
            }}
          />
        </div>

        {/* Granular Switches Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '12px' }}>
          {flagEntries.map(([key, isEnabled]) => {
            const meta = metadata[key] || { label: key, description: '', domain: 'General' };
            return (
              <div
                key={key}
                className="glass"
                style={{
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  border: isEnabled ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  background: isEnabled ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      background: 'rgba(255,255,255,0.08)',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      color: 'var(--gold-light)'
                    }}>
                      {meta.domain}
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: isEnabled ? 'white' : 'var(--text-secondary)' }}>
                      {meta.label}
                    </strong>
                  </div>
                  <p style={{ margin: '0 0 6px 0', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {meta.description}
                  </p>
                  <code style={{ fontSize: '0.65rem', color: '#64748B', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                    {key}
                  </code>
                </div>

                {/* Animated iOS-style Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggleFlag(key)}
                  style={{
                    width: '56px',
                    height: '30px',
                    borderRadius: '15px',
                    background: isEnabled ? 'var(--success)' : '#334155',
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.25s ease',
                    flexShrink: 0,
                    padding: 0
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '3px',
                    left: isEnabled ? '29px' : '3px',
                    transition: 'left 0.25s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px'
                  }}>
                    {isEnabled ? '✓' : ''}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
