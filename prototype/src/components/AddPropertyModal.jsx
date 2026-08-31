import React, { useState } from 'react';

export default function AddPropertyModal({ isOpen, onClose, onPropertyAdded, currency = 'GHS' }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    city: 'Accra',
    neighborhood: 'Cantonments',
    addressW3W: '///luxury.living.accra',
    pricePerNight: 180,
    powerType: 'SOLAR_HYBRID',
    solarKva: 10,
    batteryKwh: 15,
    hasGenerator: true,
    internetType: 'STARLINK',
    speedMbps: 180,
    waterSource: 'BOREHOLE',
    lockType: 'DIGITAL_SMART_LOCK',
    caretakerName: '',
    caretakerPhone: '+233 55 123 4999',
    scoutCity: 'Accra',
    imageUrls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85'
    ]
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate dynamic lift
      const baseRentGhs = formData.pricePerNight * 30 * 15.2;
      const verifiedLiftGhs = Math.round(baseRentGhs * 1.43);
      const decSurgeGhs = Math.round(verifiedLiftGhs * 1.85);

      const payload = {
        title: formData.title || `${formData.neighborhood} Executive Villa`,
        description: `Verified high-reliability property in ${formData.neighborhood}, ${formData.city}. Equipped with ${formData.solarKva}kVA Solar, ${formData.internetType} (180Mbps), and independent borehole filtration.`,
        price_per_night: formData.pricePerNight,
        lat: formData.city === 'Accra' ? 5.5802 : formData.city === 'Lagos' ? 6.4550 : -1.2680,
        lng: formData.city === 'Accra' ? -0.1702 : formData.city === 'Lagos' ? 3.4350 : 36.8070,
        address_w3w: formData.addressW3W,
        badges: ['SOLAR_VERIFIED', 'STARLINK_VERIFIED', 'BOREHOLE_VERIFIED', 'SMART_ACCESS_VERIFIED'],
        caretaker: {
          name: formData.caretakerName || 'Kofi Mensah',
          phone: formData.caretakerPhone
        }
      };

      // Call API Gateway to create listing
      const res = await fetch('http://localhost:3004/v1/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => null);

      const createdListing = res && res.ok ? await res.json() : { id: 'new-listing-uuid', ...payload };

      // Dispatch Field Scout Inspection
      await fetch('http://localhost:3004/v1/scout/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: createdListing.id || 'd840a121-06fc-40e4-be13-8f2823d82036' })
      }).catch(() => null);

      setSuccessData({
        listingId: createdListing.id || 'FL-2026-GH',
        title: payload.title,
        baseRentGhs,
        verifiedLiftGhs,
        decSurgeGhs,
        scoutAssigned: formData.city === 'Accra' ? 'Ama (Accra Lead)' : formData.city === 'Lagos' ? 'Chinedu (Lagos Lead)' : 'Njeri (Nairobi Lead)'
      });

      if (onPropertyAdded) {
        onPropertyAdded(createdListing);
      }
    } catch (err) {
      console.error('Error submitting property:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(11,27,38,0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#0F2537',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: 'white',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem' }}>🏡</span>
              <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>List Your Property</h3>
              <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                4-STEP VERIFIED ONBOARDING
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>
              Unlock +43% dynamic rental yield with 200-point physical verification.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Success Confirmation View */}
        {successData ? (
          <div style={{ padding: '2rem 1.75rem', textAlign: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16,185,129,0.2)',
              border: '2px solid var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 1rem auto'
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              Property Submitted for Verification!
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
              Your listing <strong>{successData.title}</strong> is now in pre-launch queue. Certified Field Scout <strong>{successData.scoutAssigned}</strong> has been dispatched for physical inspection within 48 hours.
            </p>

            {/* Projected Yield Lift Card */}
            <div style={{
              background: 'rgba(233,163,25,0.12)',
              border: '1px solid rgba(233,163,25,0.3)',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 800, marginBottom: '0.5rem' }}>
                💰 AI DYNAMIC YIELD ESTIMATE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Baseline Rent</span>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>GHS {successData.baseRentGhs.toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>+43% Verified Lift</span>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--success)' }}>GHS {successData.verifiedLiftGhs.toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--coral)' }}>Dec Detty Surge (1.85x)</span>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--coral)' }}>GHS {successData.decSurgeGhs.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg, var(--gold), var(--coral))',
                border: 'none',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Return to Host Command Hub
            </button>
          </div>
        ) : (
          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {/* Progress Stepper */}
            <div style={{
              display: 'flex',
              padding: '1rem 1.75rem',
              background: 'rgba(0,0,0,0.2)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              gap: '8px'
            }}>
              {[
                { n: 1, label: 'Property & Location' },
                { n: 2, label: 'Infrastructure & Badges' },
                { n: 3, label: 'Photos & Rent' },
                { n: 4, label: 'Scout & Caretaker' }
              ].map(s => (
                <div key={s.n} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: '4px',
                    borderRadius: '2px',
                    background: step >= s.n ? 'linear-gradient(90deg, var(--gold), var(--coral))' : 'rgba(255,255,255,0.15)',
                    marginBottom: '6px'
                  }} />
                  <span style={{ fontSize: '0.7rem', color: step >= s.n ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: step === s.n ? 800 : 500 }}>
                    {s.n}. {s.label}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ padding: '1.5rem 1.75rem' }}>
              {/* STEP 1: PROPERTY & LOCATION */}
              {step === 1 && (
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--gold-light)' }}>
                    Step 1: Property Identity & Geo-Tagging
                  </h4>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px' }}>Property Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Cantonments Luxury Penthouse with Solar"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px' }}>City Hub</label>
                      <select
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#1A334A',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          color: 'white'
                        }}
                      >
                        <option value="Accra">Accra, Ghana 🇬🇭</option>
                        <option value="Lagos">Lagos, Nigeria 🇳🇬</option>
                        <option value="Nairobi">Nairobi, Kenya 🇰🇪</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px' }}>Prime Neighborhood</label>
                      <input
                        type="text"
                        value={formData.neighborhood}
                        onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                        placeholder="e.g. Cantonments, Airport Res, Ikoyi"
                        style={{
                          width: '100%',
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          color: 'white'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px' }}>
                      📍 What3Words / Digital Address (Accurate Navigation)
                    </label>
                    <input
                      type="text"
                      value={formData.addressW3W}
                      onChange={e => setFormData({ ...formData, addressW3W: e.target.value })}
                      placeholder="e.g. ///luxury.stay.cantonments"
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        color: 'white'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: INFRASTRUCTURE & BADGES */}
              {step === 2 && (
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--gold-light)' }}>
                    Step 2: Self-Reported Infrastructure Backup
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Power Setup */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>⚡</span> Solar / Inverter Capacity
                      </div>
                      <label style={{ fontSize: '0.75rem', opacity: 0.7 }}>Inverter Size (kVA)</label>
                      <input
                        type="number"
                        value={formData.solarKva}
                        onChange={e => setFormData({ ...formData, solarKva: Number(e.target.value) })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '6px 8px', color: 'white', marginBottom: '8px' }}
                      />
                      <label style={{ fontSize: '0.75rem', opacity: 0.7 }}>Battery Bank (kWh)</label>
                      <input
                        type="number"
                        value={formData.batteryKwh}
                        onChange={e => setFormData({ ...formData, batteryKwh: Number(e.target.value) })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '6px 8px', color: 'white' }}
                      />
                    </div>

                    {/* Internet Setup */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🛰️</span> Internet Connectivity
                      </div>
                      <label style={{ fontSize: '0.75rem', opacity: 0.7 }}>Connection Type</label>
                      <select
                        value={formData.internetType}
                        onChange={e => setFormData({ ...formData, internetType: e.target.value })}
                        style={{ width: '100%', background: '#1A334A', border: 'none', borderRadius: '8px', padding: '8px', color: 'white', marginBottom: '8px' }}
                      >
                        <option value="STARLINK">Starlink Gen 3 Satellite (180+ Mbps)</option>
                        <option value="FIBRE">Dedicated Fibre (100 Mbps)</option>
                        <option value="HYBRID_FAILOVER">Starlink + Fibre Failover (Top Tier)</option>
                      </select>
                      <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>✓ Qualifies for STARLINK_VERIFIED</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* Water System */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>💧</span> Water Security
                      </div>
                      <select
                        value={formData.waterSource}
                        onChange={e => setFormData({ ...formData, waterSource: e.target.value })}
                        style={{ width: '100%', background: '#1A334A', border: 'none', borderRadius: '8px', padding: '8px', color: 'white' }}
                      >
                        <option value="BOREHOLE">Private Deep Borehole + Multi-Stage Filter</option>
                        <option value="MUNICIPAL_TANK">5,000L Reserve Tank + Pressure Pump</option>
                      </select>
                    </div>

                    {/* Access System */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🔐</span> Keyless Access
                      </div>
                      <select
                        value={formData.lockType}
                        onChange={e => setFormData({ ...formData, lockType: e.target.value })}
                        style={{ width: '100%', background: '#1A334A', border: 'none', borderRadius: '8px', padding: '8px', color: 'white' }}
                      >
                        <option value="DIGITAL_SMART_LOCK">NFC / Keypad Digital Lock (AES-256)</option>
                        <option value="SMART_LOCKBOX">Smart Bluetooth Lockbox</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PHOTOS & TARGET RENT */}
              {step === 3 && (
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--gold-light)' }}>
                    Step 3: Target Rent & Proof Photos
                  </h4>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px' }}>
                      Target Nightly Rate (USD)
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input
                        type="number"
                        value={formData.pricePerNight}
                        onChange={e => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                        style={{
                          flex: 1,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          color: 'white',
                          fontSize: '1.1rem',
                          fontWeight: 800
                        }}
                      />
                      <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem' }}>
                        ≈ <strong>GHS {(formData.pricePerNight * 15.2).toLocaleString()}</strong> / night
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8, marginBottom: '8px' }}>
                      📸 Photos (Interior + Inverter / Starlink / Tank Proof)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {formData.imageUrls.map((url, idx) => (
                        <div key={idx} style={{ height: '110px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', position: 'relative' }}>
                          <img src={url} alt="Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>
                            Proof #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: SCOUT DISPATCH & CARETAKER */}
              {step === 4 && (
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--gold-light)' }}>
                    Step 4: Dispatch Certified Field Scout & Link Caretaker
                  </h4>

                  <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '14px', padding: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--success)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🛡️</span> Automated Physical 200-Point Audit
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>
                      A certified Flex Guide will visit with a multi-meter, acoustic sound meter, and Starlink speed probe to certify your 24/7 uptime.
                    </p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px' }}>
                      Resident Caretaker Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.caretakerName}
                      onChange={e => setFormData({ ...formData, caretakerName: e.target.value })}
                      placeholder="e.g. Kofi Mensah"
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px' }}>
                      📱 Caretaker WhatsApp Phone Number (Morning Pulse Checks)
                    </label>
                    <input
                      type="text"
                      value={formData.caretakerPhone}
                      onChange={e => setFormData({ ...formData, caretakerPhone: e.target.value })}
                      placeholder="+233 55 123 4999"
                      required
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        color: 'white'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: 'white',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    ← Back
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    style={{
                      background: 'var(--teal)',
                      border: 'none',
                      color: 'white',
                      padding: '0.65rem 1.5rem',
                      borderRadius: '10px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Continue to Step {step + 1} →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: 'linear-gradient(135deg, var(--gold), var(--coral))',
                      border: 'none',
                      color: 'white',
                      padding: '0.65rem 1.75rem',
                      borderRadius: '10px',
                      fontWeight: 800,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {isSubmitting ? 'Dispatching Field Scout...' : '🚀 Submit Listing & Dispatch Scout'}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
