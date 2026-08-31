import React, { useState, useEffect } from 'react';

export default function ScoutPortal() {
  const [activeTab, setActiveTab] = useState('TASKS'); // TASKS, WORKBENCH, AI_SCAN, WALLET
  const [selectedScout, setSelectedScout] = useState('Ama Mensah (Accra Lead)');
  const [scoutWalletGhs, setScoutWalletGhs] = useState(4200);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(null);

  // Simulated Audit Workbench Form
  const [auditForm, setAuditForm] = useState({
    atsSwitchoverSeconds: 6.2,
    generatorNoiseDb: 38,
    solarInverterKva: 10,
    starlinkMbps: 185,
    starlinkLatencyMs: 26,
    boreholeTdsPpm: 65,
    waterTankLiters: 5000,
    smartLockBattery: 94,
    notes: 'Victron MultiPlus-II installed with 15kWh LiFePO4 batteries. Starlink Gen 3 antenna unobstructed. Water TDS clean at 65 ppm.'
  });

  // AI Vision Scanner State
  const [aiScanRunning, setAiScanRunning] = useState(false);
  const [aiScanReport, setAiScanReport] = useState(null);

  // Scout Fleet Roster State & Management
  const [roster, setRoster] = useState([
    {
      id: 'scout-accra-01',
      name: 'Ama Mensah',
      phone: '+233 24 111 2233',
      city: 'Accra, Ghana',
      zones: 'Cantonments, Airport Residential, East Legon',
      nationalId: 'GHA-712839120-1',
      rating: 4.96,
      completedAudits: 28,
      status: 'ACTIVE',
      toolkit: 'Multimeter • Sound Meter • Starlink Probe • TDS Tester'
    },
    {
      id: 'scout-lagos-01',
      name: 'Chinedu Okafor',
      phone: '+234 80 222 3344',
      city: 'Lagos, Nigeria',
      zones: 'Ikoyi, Victoria Island, Lekki Phase 1',
      nationalId: 'NIN-89302194812',
      rating: 4.92,
      completedAudits: 34,
      status: 'ACTIVE',
      toolkit: 'Multimeter • Sound Meter • Starlink Probe • TDS Tester'
    },
    {
      id: 'scout-nairobi-01',
      name: 'Njeri Kamau',
      phone: '+254 71 333 4455',
      city: 'Nairobi, Kenya',
      zones: 'Kilimani, Westlands, Lavington',
      nationalId: 'KEN-48192031',
      rating: 4.98,
      completedAudits: 22,
      status: 'ACTIVE',
      toolkit: 'Multimeter • Sound Meter • Starlink Probe • TDS Tester'
    }
  ]);

  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [newScoutForm, setNewScoutForm] = useState({
    name: '',
    phone: '+233 55 ',
    city: 'Accra, Ghana',
    zones: 'Cantonments & Osu',
    nationalId: 'GHA-',
    momoNetwork: 'MTN Mobile Money'
  });

  const handleYankScout = (scoutId, scoutName) => {
    if (window.confirm(`⚠️ Are you sure you want to YANK scout "${scoutName}"? Their audit dispatch credentials will be revoked immediately.`)) {
      setRoster(prev => prev.map(s => s.id === scoutId ? { ...s, status: 'YANKED' } : s));
    }
  };

  const handleReinstateScout = (scoutId) => {
    setRoster(prev => prev.map(s => s.id === scoutId ? { ...s, status: 'ACTIVE' } : s));
  };

  const handleOnboardScoutSubmit = (e) => {
    e.preventDefault();
    if (!newScoutForm.name || !newScoutForm.phone || !newScoutForm.nationalId) {
      alert('Please fill out all required fields.');
      return;
    }
    const created = {
      id: `scout-${Date.now().toString().slice(-4)}`,
      name: newScoutForm.name,
      phone: newScoutForm.phone,
      city: newScoutForm.city,
      zones: newScoutForm.zones,
      nationalId: newScoutForm.nationalId,
      rating: 5.00,
      completedAudits: 0,
      status: 'ACTIVE',
      toolkit: 'Multimeter • Sound Meter • Starlink Probe • TDS Tester'
    };
    setRoster(prev => [created, ...prev]);
    setIsOnboardModalOpen(false);
    setNewScoutForm({
      name: '',
      phone: '+233 55 ',
      city: 'Accra, Ghana',
      zones: 'Cantonments & Osu',
      nationalId: 'GHA-',
      momoNetwork: 'MTN Mobile Money'
    });
  };

  const [tasks, setTasks] = useState([
    {
      id: 'task-gh-01',
      propertyId: 'prop-accra-01',
      title: 'Luxury Cantonments Penthouse',
      city: 'Accra, Ghana',
      neighborhood: 'Cantonments',
      addressW3W: '///luxury.stay.cantonments',
      hostName: 'Kwesi Appiah',
      hostPhone: '+233 24 555 1212',
      status: 'PENDING_INSPECTION',
      bountyGhs: 750,
      submittedDate: 'Today, 10:30 AM',
      requestedBadges: ['SOLAR', 'STARLINK', 'BOREHOLE', 'SMART_LOCK']
    },
    {
      id: 'task-gh-02',
      propertyId: 'prop-accra-02',
      title: 'Airport Residential Executive Villa',
      city: 'Accra, Ghana',
      neighborhood: 'Airport Residential',
      addressW3W: '///airport.executive.villa',
      hostName: 'Adwoa Boateng',
      hostPhone: '+233 50 888 3434',
      status: 'IN_PROGRESS',
      bountyGhs: 750,
      submittedDate: 'Yesterday, 4:15 PM',
      requestedBadges: ['SOLAR', 'BOREHOLE', 'SMART_LOCK']
    },
    {
      id: 'task-ng-01',
      propertyId: 'prop-lagos-01',
      title: 'Banana Island Waterfront Villa',
      city: 'Lagos, Nigeria',
      neighborhood: 'Ikoyi (Banana Island)',
      addressW3W: '///banana.waterfront.haven',
      hostName: 'Emeka Nwosu',
      hostPhone: '+234 80 123 4567',
      status: 'CERTIFIED',
      bountyGhs: 750,
      submittedDate: '2 Days Ago',
      requestedBadges: ['SOLAR', 'STARLINK', 'BOREHOLE', 'SMART_LOCK']
    }
  ]);

  const handleOpenWorkbench = (task) => {
    setSelectedTask(task);
    setActiveTab('WORKBENCH');
    setAuditSuccess(null);
  };

  const handleCertifyAudit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Calculate badges
      const awarded = [];
      if (auditForm.solarInverterKva >= 3.0 && auditForm.atsSwitchoverSeconds < 8.0) awarded.push('SOLAR_VERIFIED (+18%)');
      if (auditForm.starlinkMbps >= 50) awarded.push('STARLINK_VERIFIED (+12%)');
      if (auditForm.boreholeTdsPpm < 150) awarded.push('BOREHOLE_VERIFIED (+8%)');
      if (auditForm.smartLockBattery >= 50) awarded.push('SMART_ACCESS_VERIFIED (+5%)');

      // Update Task in state
      setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'CERTIFIED' } : t));
      setScoutWalletGhs(prev => prev + 750);
      setAuditSuccess({
        taskTitle: selectedTask.title,
        qualityScore: 96,
        awardedBadges: awarded,
        bountyEarned: 750,
        dynamicLift: '+43% Verified Lift',
        timestamp: new Date().toLocaleTimeString()
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleTriggerAiScan = () => {
    setAiScanRunning(true);
    setAiScanReport(null);

    setTimeout(() => {
      setAiScanReport({
        overallConfidenceScore: 95,
        instantPreCertified: true,
        verificationTier: 'AI_CERTIFIED_GOLD',
        dynamicYieldLiftPct: '+43%',
        scanDurationSec: 2.8,
        awardedBadges: ['SOLAR_VERIFIED', 'STARLINK_VERIFIED', 'BOREHOLE_VERIFIED', 'SMART_ACCESS_VERIFIED'],
        detectedEquipment: [
          { category: 'POWER', label: 'Victron MultiPlus-II (10kVA) + LiFePO4', confidence: 0.96, switchover: '0.008s' },
          { category: 'INTERNET', label: 'Starlink Gen 3 Satellite (185 Mbps, 26ms)', confidence: 0.94, status: 'Active' },
          { category: 'WATER', label: 'Deep Borehole & 5,000L Sintex Tank (TDS 65)', confidence: 0.92, status: 'Pure' },
          { category: 'ACCESS', label: 'NFC/Digital Keypad Deadbolt (AES-256)', confidence: 0.97, battery: '94%' }
        ]
      });
      setAiScanRunning(false);
    }, 1800);
  };

  return (
    <div className="screen-container">
      {/* Top Header */}
      <div className="d-flex justify-between align-center mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🧭</span>
            <h2 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--teal)' }}>Field Scout Operations Portal</h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Physical 200-point audits, verification proof uploads & AI Vision property inspections.
          </p>
        </div>

        {/* Scout Profile & Wallet Card */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedScout}
            onChange={e => setSelectedScout(e.target.value)}
            style={{
              background: '#0F2537',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '0.45rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}
          >
            <option>Ama Mensah (Accra Lead)</option>
            <option>Chinedu Okafor (Lagos Lead)</option>
            <option>Njeri Kamau (Nairobi Lead)</option>
          </select>

          <div style={{
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '20px',
            padding: '0.4rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scout Wallet:</span>
            <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.9rem' }}>
              GHS {scoutWalletGhs.toLocaleString()}
            </span>
            <button
              onClick={() => alert(`Initiating MTN Mobile Money disbursement of GHS ${scoutWalletGhs.toLocaleString()} to ${selectedScout}...`)}
              style={{
                background: 'var(--success)',
                border: 'none',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginLeft: '4px'
              }}
            >
              MoMo Cashout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'TASKS', label: '📋 Assigned Inspection Queue' },
          { id: 'WORKBENCH', label: selectedTask ? `🛠️ Audit Workbench: ${selectedTask.title}` : '🛠️ 200-Point Audit Workbench' },
          { id: 'AI_SCAN', label: '🤖 AI Vision Property Scanner' },
          { id: 'ROSTER', label: '👥 Scout Fleet & Offboarding (Yank)' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: activeTab === t.id ? 'var(--teal)' : 'transparent',
              color: activeTab === t.id ? 'white' : 'var(--text-secondary)',
              border: activeTab === t.id ? 'none' : '1px solid var(--border)',
              padding: '0.5rem 1.25rem',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ASSIGNED INSPECTION TASKS QUEUE */}
      {activeTab === 'TASKS' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing properties awaiting physical load-tests and verification proof:
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'PENDING_INSPECTION', 'IN_PROGRESS', 'CERTIFIED'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    background: filterStatus === s ? 'rgba(233,163,25,0.15)' : 'transparent',
                    color: filterStatus === s ? 'var(--gold-light)' : 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: filterStatus === s ? 'bold' : 'normal'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {tasks
              .filter(t => filterStatus === 'ALL' || t.status === filterStatus)
              .map(task => (
                <div key={task.id} className="glass" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                        {task.city}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {task.addressW3W}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: task.status === 'CERTIFIED' ? 'rgba(16,185,129,0.15)' : 'rgba(233,163,25,0.15)',
                        color: task.status === 'CERTIFIED' ? 'var(--success)' : 'var(--gold-light)'
                      }}>
                        ● {task.status}
                      </span>
                    </div>

                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--teal)' }}>
                      {task.title}
                    </h3>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Host: <strong>{task.hostName}</strong> ({task.hostPhone})</span>
                      <span>Dispatched: {task.submittedDate}</span>
                      <span>Bounty: <strong style={{ color: 'var(--success)' }}>GHS {task.bountyGhs}</strong></span>
                    </div>
                  </div>

                  <div>
                    {task.status === 'CERTIFIED' ? (
                      <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        ✓ Audit Certified (+43% Lift)
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenWorkbench(task)}
                        style={{
                          background: 'linear-gradient(135deg, var(--gold), var(--coral))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1.25rem',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>Conduct 200-Point Audit →</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 2: 200-POINT AUDIT WORKBENCH */}
      {activeTab === 'WORKBENCH' && (
        <div>
          {selectedTask ? (
            <div>
              {/* Task Banner */}
              <div style={{ background: 'rgba(233,163,25,0.1)', border: '1px solid rgba(233,163,25,0.3)', borderRadius: '16px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-light)', fontWeight: 800 }}>ACTIVE INSPECTION TICKET</span>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', color: 'white' }}>{selectedTask.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                    📍 {selectedTask.neighborhood}, {selectedTask.city} ({selectedTask.addressW3W}) • Host: {selectedTask.hostName}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Inspector Bounty</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>GHS {selectedTask.bountyGhs}</div>
                </div>
              </div>

              {auditSuccess ? (
                <div className="glass" style={{ padding: '2rem', borderRadius: '20px', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '32px', background: 'rgba(16,185,129,0.2)', border: '2px solid var(--success)', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>
                    ✓
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Property Successfully Certified!</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
                    The 200-point physical telemetry was validated. <strong>{selectedTask.title}</strong> has been granted the Gold Flex-Verified Shield and is now live on the PostGIS guest feed.
                  </p>

                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '1rem', maxWidth: '480px', margin: '0 auto 1.5rem auto', textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--gold-light)', marginBottom: '0.5rem' }}>
                      🏆 OFFICIAL BADGES ISSUED:
                    </div>
                    {auditSuccess.awardedBadges.map((b, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold', marginBottom: '2px' }}>
                        ✓ {b}
                      </div>
                    ))}
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span>Scout Bounty Paid to Wallet:</span>
                      <strong style={{ color: 'var(--success)' }}>+GHS {auditSuccess.bountyEarned}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('TASKS')}
                    style={{
                      background: 'var(--teal)',
                      border: 'none',
                      color: 'white',
                      padding: '0.75rem 2rem',
                      borderRadius: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Return to Inspection Queue
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {/* Section A: Power & Switchover */}
                  <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--teal)', fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>⚡</span> Section A: Power & Load Switchover Test
                    </div>

                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Automatic Switchover Time (Must be &lt; 8.0s)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                      <input
                        type="number"
                        step="0.1"
                        value={auditForm.atsSwitchoverSeconds}
                        onChange={e => setAuditForm({ ...auditForm, atsSwitchoverSeconds: parseFloat(e.target.value) })}
                        style={{ width: '100px', padding: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: auditForm.atsSwitchoverSeconds < 8 ? 'var(--success)' : 'var(--coral)' }}>
                        {auditForm.atsSwitchoverSeconds < 8 ? '✓ PASSED (< 8s)' : '❌ FAILED (> 8s)'}
                      </span>
                    </div>

                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Inverter Rating (kVA)
                    </label>
                    <input
                      type="number"
                      value={auditForm.solarInverterKva}
                      onChange={e => setAuditForm({ ...auditForm, solarInverterKva: parseFloat(e.target.value) })}
                      style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                    />

                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Generator Acoustic Sound Level (dB at 5m)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="number"
                        value={auditForm.generatorNoiseDb}
                        onChange={e => setAuditForm({ ...auditForm, generatorNoiseDb: parseInt(e.target.value) })}
                        style={{ width: '100px', padding: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: auditForm.generatorNoiseDb <= 45 ? 'var(--success)' : 'var(--coral)' }}>
                        {auditForm.generatorNoiseDb <= 45 ? '✓ Ultra-Quiet (< 45 dB)' : '⚠️ Warning (> 45 dB)'}
                      </span>
                    </div>
                  </div>

                  {/* Section B: Connectivity & Speedtest */}
                  <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--teal)', fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🌐</span> Section B: Satellite Internet & Latency Probe
                    </div>

                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Starlink Measured Download Throughput (Mbps)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                      <input
                        type="number"
                        value={auditForm.starlinkMbps}
                        onChange={e => setAuditForm({ ...auditForm, starlinkMbps: parseInt(e.target.value) })}
                        style={{ width: '100px', padding: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: auditForm.starlinkMbps >= 50 ? 'var(--success)' : 'var(--coral)' }}>
                        {auditForm.starlinkMbps >= 50 ? '✓ High Speed (> 50 Mbps)' : '❌ Slow'}
                      </span>
                    </div>

                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Starlink Ping Latency (ms)
                    </label>
                    <input
                      type="number"
                      value={auditForm.starlinkLatencyMs}
                      onChange={e => setAuditForm({ ...auditForm, starlinkLatencyMs: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' }}
                    />
                  </div>

                  {/* Section C: Water Security & Purity */}
                  <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--teal)', fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>💧</span> Section C: Borehole Filtration & Reserve
                    </div>

                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Borehole Water Purity (TDS Meter reading in PPM)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                      <input
                        type="number"
                        value={auditForm.boreholeTdsPpm}
                        onChange={e => setAuditForm({ ...auditForm, boreholeTdsPpm: parseInt(e.target.value) })}
                        style={{ width: '100px', padding: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: auditForm.boreholeTdsPpm < 150 ? 'var(--success)' : 'var(--coral)' }}>
                        {auditForm.boreholeTdsPpm < 150 ? '✓ Pure Drinking Standard' : '❌ Needs Filter Change'}
                      </span>
                    </div>

                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Total Overhead Water Reserve (Liters)
                    </label>
                    <input
                      type="number"
                      value={auditForm.waterTankLiters}
                      onChange={e => setAuditForm({ ...auditForm, waterTankLiters: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' }}
                    />
                  </div>

                  {/* Section D: Smart Lock & Photos */}
                  <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--teal)', fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🔐</span> Section D: Smart Lock & Geotagged Proof
                    </div>

                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Smart Lock Battery Level (%):
                    </label>
                    <input
                      type="number"
                      value={auditForm.smartLockBattery}
                      onChange={e => setAuditForm({ ...auditForm, smartLockBattery: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                    />

                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>📷 4 Geotagged Proof Photos Uploaded</span>
                    </div>
                  </div>

                  {/* Certify Button Full Row */}
                  <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
                    <button
                      onClick={handleCertifyAudit}
                      disabled={isSubmitting}
                      style={{
                        background: 'linear-gradient(135deg, var(--gold), var(--coral))',
                        border: 'none',
                        color: 'white',
                        padding: '0.85rem 2rem',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSubmitting ? 'Validating Telemetry...' : '🏆 Certify Audit & Issue Verified Badges (+43% Lift)'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Select a task from the inspection queue to start the 200-point audit.</p>
              <button
                onClick={() => setActiveTab('TASKS')}
                style={{ background: 'var(--teal)', border: 'none', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Go to Queue
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AI VISION PROPERTY SCANNER */}
      {activeTab === 'AI_SCAN' && (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>🤖</span>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--teal)' }}>
                  AI Vision Property Scanner (Instant Pre-Certification)
                </h3>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Uses computer vision OCR to detect inverter brands, Starlink antennas, and borehole equipment in 5 seconds.
              </p>
            </div>

            <button
              onClick={handleTriggerAiScan}
              disabled={aiScanRunning}
              style={{
                background: 'linear-gradient(135deg, var(--gold), var(--coral))',
                border: 'none',
                color: 'white',
                padding: '0.65rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: aiScanRunning ? 'not-allowed' : 'pointer'
              }}
            >
              {aiScanRunning ? 'Running AI Model...' : '📸 Run Live AI Equipment Scan'}
            </button>
          </div>

          {/* Simulated Camera Viewfinder Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: '⚡ Victron Inverter & LiFePO4', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80', tag: 'Victron MultiPlus-II' },
              { label: '🛰️ Starlink Gen 3 Satellite', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80', tag: 'Azimuth 42.8°' },
              { label: '💧 5,000L Sintex Reserve Tank', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', tag: 'TDS: 65 PPM' },
              { label: '🔐 NFC/Digital Keypad Deadbolt', url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', tag: 'AES-256 Cloud' }
            ].map((feed, idx) => (
              <div key={idx} style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.15)',
                position: 'relative'
              }}>
                <div style={{ height: '120px', position: 'relative' }}>
                  <img src={feed.url} alt={feed.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {aiScanReport && (
                    <div style={{
                      position: 'absolute',
                      inset: '10px',
                      border: '2px solid var(--success)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      padding: '4px'
                    }}>
                      <span style={{ background: 'var(--success)', color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '2px 4px', borderRadius: '4px' }}>
                        96% CONFIDENCE
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '8px', background: 'rgba(0,0,0,0.3)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {feed.label}
                  <div style={{ fontSize: '0.65rem', color: 'var(--gold-light)' }}>{feed.tag}</div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Scan Report Card */}
          {aiScanReport && (
            <div style={{
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '16px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.25rem' }}>🏆</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--success)' }}>
                    AI Pre-Certification Approved (Score: {aiScanReport.overallConfidenceScore}%)
                  </strong>
                  <span className="badge badge-verified">5-MINUTE FAST TRACK</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gold-light)', fontWeight: 'bold' }}>
                  Projected Lift: {aiScanReport.dynamicYieldLiftPct}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {aiScanReport.detectedEquipment.map((eq, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.65rem', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{eq.category}</span>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'white', marginTop: '2px' }}>{eq.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '2px' }}>✓ Verified ({(eq.confidence * 100).toFixed(0)}%)</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SCOUT FLEET MANAGEMENT & ROSTER (ONBOARD / YANK) */}
      {activeTab === 'ROSTER' && (
        <div>
          {/* Header & Onboard Trigger */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--teal)' }}>
                Certified Field Scout Operations Fleet
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Vetted engineering scouts across Accra, Lagos, and Nairobi. Manage dispatch privileges, onboard new agents, or yank credentials.
              </p>
            </div>

            <button
              onClick={() => setIsOnboardModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, var(--gold), var(--coral))',
                border: 'none',
                color: 'white',
                padding: '0.65rem 1.4rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>+</span> Onboard New Field Scout
            </button>
          </div>

          {/* Scout Fleet Table */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {roster.map(scout => (
              <div
                key={scout.id}
                className="glass"
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: scout.status === 'YANKED' ? '1px solid rgba(233,69,96,0.5)' : '1px solid var(--border)',
                  background: scout.status === 'YANKED' ? 'rgba(233,69,96,0.06)' : 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '24px',
                    background: scout.status === 'YANKED' ? 'rgba(233,69,96,0.3)' : 'var(--teal)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    border: scout.status === 'YANKED' ? '2px solid var(--coral)' : '2px solid var(--gold)'
                  }}>
                    {scout.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <h4 style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        color: scout.status === 'YANKED' ? 'var(--coral)' : 'white',
                        textDecoration: scout.status === 'YANKED' ? 'line-through' : 'none'
                      }}>
                        {scout.name}
                      </h4>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: scout.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(233,69,96,0.2)',
                        color: scout.status === 'ACTIVE' ? 'var(--success)' : 'var(--coral)'
                      }}>
                        ● {scout.status === 'ACTIVE' ? 'CERTIFIED & ACTIVE' : 'YANKED / PRIVILEGES REVOKED'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      📍 {scout.city} • Zones: {scout.zones} • ID: {scout.nationalId}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)', marginTop: '4px' }}>
                      🧰 Toolkit: {scout.toolkit}
                    </div>
                  </div>
                </div>

                {/* Right Stats & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Track Record</div>
                    <div style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>
                      ⭐ {scout.rating} ({scout.completedAudits} audits)
                    </div>
                  </div>

                  <div>
                    {scout.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleYankScout(scout.id, scout.name)}
                        style={{
                          background: 'rgba(233,69,96,0.15)',
                          border: '1px solid var(--coral)',
                          color: 'var(--coral)',
                          padding: '0.5rem 1rem',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        ⚠️ Yank Scout
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReinstateScout(scout.id)}
                        style={{
                          background: 'rgba(16,185,129,0.15)',
                          border: '1px solid var(--success)',
                          color: 'var(--success)',
                          padding: '0.5rem 1rem',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✓ Reinstate Scout
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Onboard New Scout Modal */}
          {isOnboardModalOpen && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem'
            }}>
              <div className="glass" style={{
                background: '#0B1B26',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '2rem',
                width: '100%',
                maxWidth: '520px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🧭</span>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--teal)' }}>
                      Onboard New Field Scout
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOnboardModalOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleOnboardScoutSubmit}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Osei Tutu"
                    value={newScoutForm.name}
                    onChange={e => setNewScoutForm({ ...newScoutForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Operating Metro
                      </label>
                      <select
                        value={newScoutForm.city}
                        onChange={e => setNewScoutForm({ ...newScoutForm, city: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem', background: '#0F2537', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' }}
                      >
                        <option>Accra, Ghana</option>
                        <option>Lagos, Nigeria</option>
                        <option>Nairobi, Kenya</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        WhatsApp Mobile
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+233 55 123 4567"
                        value={newScoutForm.phone}
                        onChange={e => setNewScoutForm({ ...newScoutForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' }}
                      />
                    </div>
                  </div>

                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    National ID / Ghana Card / NIN (KYC Verification)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GHA-908219481-4"
                    value={newScoutForm.nationalId}
                    onChange={e => setNewScoutForm({ ...newScoutForm, nationalId: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                  />

                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Assigned Neighborhood Zones
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cantonments, Airport Residential, Osu"
                    value={newScoutForm.zones}
                    onChange={e => setNewScoutForm({ ...newScoutForm, zones: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', marginBottom: '14px' }}
                  />

                  <div style={{ background: 'rgba(233,163,25,0.1)', padding: '0.75rem', borderRadius: '10px', marginBottom: '14px', fontSize: '0.75rem', color: 'var(--gold-light)' }}>
                    ✓ Mandatory toolkit issued: True-RMS Multi-meter, Decibel Sound Meter, Starlink Ethernet speed probe, and TDS water purity tester.
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setIsOnboardModalOpen(false)}
                      style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '10px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ background: 'linear-gradient(135deg, var(--gold), var(--coral))', border: 'none', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Certify & Onboard Scout
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
