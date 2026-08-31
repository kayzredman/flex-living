import React, { useState } from 'react';

export default function Booking({ property, onBack, onComplete, currency = 'GHS', flags = {} }) {
  const isFlexAdvanceEnabled = flags.FLAG_FLEX_ADVANCE_MONTHLY !== false;
  const isMoMoUssdEnabled = flags.FLAG_MOMO_USSD_PUSH !== false;

  const [paymentOption, setPaymentOption] = useState(isFlexAdvanceEnabled ? 'flex' : 'upfront'); // 'flex' or 'upfront'
  const [paymentMethod, setPaymentMethod] = useState(isMoMoUssdEnabled ? 'MTN_MOMO' : 'CARD'); // MTN_MOMO, TELECEL, MPESA, CARD
  const [momoPhone, setMomoPhone] = useState('+233 24 555 1234');
  const [isUssdOpen, setIsUssdOpen] = useState(false);
  const [momoPin, setMomoPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const annualAdvance = property.price * 24; // Standard 2-year advance
  const totalAmount = paymentOption === 'flex' ? property.price : annualAdvance;

  const handleTriggerPayment = () => {
    if (!isMoMoUssdEnabled || paymentMethod === 'CARD') {
      alert(`✓ Payment of ${property.currency} ${totalAmount.toLocaleString()} authorized via Standard Bank Card.`);
      onComplete();
      return;
    }
    setIsUssdOpen(true);
    setPaymentSuccess(false);
    setMomoPin('');
  };

  const handleAuthorizeUssd = () => {
    if (!momoPin || momoPin.length < 4) {
      alert('Please enter your 4-digit Mobile Money PIN to authorize the payment.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setIsUssdOpen(false);
        onComplete();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="screen-container">
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div className="d-flex align-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="btn glass"
            style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--teal)' }}
          >
            ←
          </button>
          <div>
            <span className="text-secondary text-xs">Secure Checkout • {isFlexAdvanceEnabled ? 'Flex-Advance' : 'Verified Stay'}</span>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--teal)' }}>Payment Structure</h2>
          </div>
        </div>

        <div className="glass mb-4" style={{ borderRadius: '12px', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img src={property.image} alt={property.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{property.title}</h3>
            <p className="text-sm text-secondary">{property.city} {flags.FLAG_SLA_2HR_CURE_TIMER !== false && '• 99.5% Uptime SLA Protection'}</p>
          </div>
        </div>

        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>1. Choose Payment Option</h3>

        {/* Flex-Advance Option (Controllable by FLAG_FLEX_ADVANCE_MONTHLY) */}
        {isFlexAdvanceEnabled && (
          <div 
            onClick={() => setPaymentOption('flex')}
            className={`mb-3 ${paymentOption === 'flex' ? 'glass-dark' : 'glass'}`}
            style={{ borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', border: paymentOption === 'flex' ? '2px solid var(--coral)' : '1px solid var(--border)' }}
          >
            <div className="d-flex justify-between align-center mb-2">
              <h4 style={{ color: paymentOption === 'flex' ? 'white' : 'var(--teal)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span role="img" aria-label="rocket">🚀</span> Flex-Advance (Monthly Rent)
              </h4>
              <input type="radio" checked={paymentOption === 'flex'} readOnly />
            </div>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Pay monthly instead of a 2-year advance.</p>
            <div className="font-bold" style={{ fontSize: '1.25rem' }}>
              {property.currency} {property.price.toLocaleString()} <span style={{ fontSize: '0.875rem', fontWeight: 'normal', opacity: 0.8 }}>/ month</span>
            </div>
            {paymentOption === 'flex' && (
              <div className="mt-3" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--success)' }}>✓</span> Employer payroll deduction & Escrow guarantee active.
              </div>
            )}
          </div>
        )}

        {/* Traditional Option */}
        <div 
          onClick={() => setPaymentOption('upfront')}
          className={`mb-4 ${paymentOption === 'upfront' ? 'glass' : ''}`}
          style={{ borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', border: paymentOption === 'upfront' ? '2px solid var(--teal)' : '1px solid var(--border)', background: paymentOption === 'upfront' ? 'white' : 'transparent' }}
        >
          <div className="d-flex justify-between align-center mb-2">
            <h4 style={{ color: 'var(--teal)', margin: 0 }}>Traditional 2-Year Advance</h4>
            <input type="radio" checked={paymentOption === 'upfront'} readOnly />
          </div>
          <p className="text-sm text-secondary mb-2">Standard West African rental requirement.</p>
          <div className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            {property.currency} {annualAdvance.toLocaleString()} <span className="text-sm text-secondary font-normal">due today</span>
          </div>
        </div>

        {/* Payment Rails: Direct Mobile Money STK Push (Controllable by FLAG_MOMO_USSD_PUSH) */}
        {isMoMoUssdEnabled ? (
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>2. Mobile Money & Payment Method</h3>
            <div className="glass mb-4" style={{ borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '1rem' }}>
                {[
                  { id: 'MTN_MOMO', label: '🟡 MTN MoMo', country: 'Ghana / Nigeria' },
                  { id: 'TELECEL', label: '🔴 Telecel Cash', country: 'Ghana' },
                  { id: 'MPESA', label: '🟢 M-Pesa', country: 'Kenya' },
                  { id: 'CARD', label: '💳 Visa / Card', country: 'Pan-African' }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      background: paymentMethod === m.id ? 'var(--teal)' : 'rgba(255,255,255,0.05)',
                      color: paymentMethod === m.id ? 'white' : 'var(--text-secondary)',
                      border: paymentMethod === m.id ? '1px solid var(--teal)' : '1px solid var(--border)',
                      padding: '8px 6px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div>{m.label}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.8, marginTop: '2px' }}>{m.country}</div>
                  </button>
                ))}
              </div>

              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Mobile Money Number for Instant STK Push Prompt
              </label>
              <input
                type="text"
                value={momoPhone}
                onChange={e => setMomoPhone(e.target.value)}
                placeholder="+233 24 000 0000"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>
                📲 A live USSD authorization prompt will be pushed directly to your handset.
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>2. Standard Market Payment</h3>
            <div className="glass mb-4" style={{ borderRadius: '14px', padding: '1.25rem' }}>
              <p className="text-sm text-secondary mb-2">Pay via Bank Card (Visa / Mastercard) or Direct Wire Transfer.</p>
              <input
                type="text"
                placeholder="Card Number: 4111 2222 3333 4444"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.08)', color: 'white', marginBottom: '8px' }}
              />
            </div>
          </div>
        )}

        {/* Escrow Protection (Controllable by FLAG_HOST_ESCROW_VAULT) */}
        {flags.FLAG_HOST_ESCROW_VAULT !== false && (
          <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
            <h4 style={{ color: 'var(--teal)', marginBottom: '0.5rem', fontSize: '1rem' }}>🛡️ 15% Host Escrow Protection</h4>
            <p className="text-sm text-secondary">
              Your payment is held safely in escrow. It will only be released to the host after verified power, starlink uptime, and smart lock check-in.
            </p>
          </div>
        )}

        <button className="btn btn-primary w-100" onClick={handleTriggerPayment} style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 800 }}>
          {isMoMoUssdEnabled 
            ? `Pay ${property.currency} ${totalAmount.toLocaleString()} via Mobile Money STK Push →`
            : `Pay ${property.currency} ${totalAmount.toLocaleString()} with Card / Bank →`}
        </button>
      </div>

      {/* Realistic Simulated USSD Prompt Overlay (Pillar 1) */}
      {isUssdOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#1A1A1A',
            border: '2px solid #E9A319',
            borderRadius: '24px',
            padding: '2rem',
            width: '100%',
            maxWidth: '380px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            textAlign: 'center',
            color: '#FFFFFF'
          }}>
            {paymentSuccess ? (
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
                <h3 style={{ color: '#10B981', margin: 0, fontSize: '1.3rem' }}>Payment Authorized!</h3>
                <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '6px' }}>
                  {property.currency} {totalAmount.toLocaleString()} received into Flex-Living Escrow.
                </p>
                <div style={{ background: 'rgba(16,185,129,0.15)', padding: '8px', borderRadius: '10px', fontSize: '0.75rem', color: '#10B981', margin: '14px 0' }}>
                  TXN: MOMO-GH-{Date.now().toString().slice(-6)} • Digital Smart Key Unlocked
                </div>
              </div>
            ) : isProcessing ? (
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px', animation: 'spin 1s infinite linear' }}>⏳</div>
                <h3 style={{ color: '#E9A319', margin: 0, fontSize: '1.2rem' }}>Processing USSD Handshake...</h3>
                <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '6px' }}>
                  Communicating with {paymentMethod.replace('_', ' ')} network core...
                </p>
              </div>
            ) : (
              <div>
                <div style={{
                  display: 'inline-block',
                  background: '#E9A319',
                  color: '#0B1B26',
                  fontWeight: 900,
                  fontSize: '0.7rem',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  marginBottom: '10px'
                }}>
                  MOBILE MONEY USSD PUSH
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#FFFFFF' }}>
                  Authorize Flex-Living Stay
                </h3>

                <div style={{
                  background: '#262626',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  marginBottom: '16px',
                  color: '#E2E8F0',
                  border: '1px solid #333333'
                }}>
                  <div><strong>Merchant:</strong> Flex-Living Escrow</div>
                  <div><strong>Amount:</strong> {property.currency} {totalAmount.toLocaleString()}</div>
                  <div><strong>Ref:</strong> FL-{property.title.slice(0, 14)}</div>
                  <div><strong>Account:</strong> {momoPhone}</div>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '10px' }}>
                  Enter your 4-digit Mobile Money PIN to approve:
                </p>

                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={momoPin}
                  onChange={e => setMomoPin(e.target.value)}
                  placeholder="••••"
                  style={{
                    width: '140px',
                    padding: '0.6rem',
                    borderRadius: '12px',
                    border: '2px solid #E9A319',
                    background: '#0F0F0F',
                    color: '#FFFFFF',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    letterSpacing: '8px',
                    marginBottom: '20px'
                  }}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsUssdOpen(false)}
                    style={{
                      flex: 1,
                      background: '#333333',
                      color: '#E2E8F0',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel (2)
                  </button>
                  <button
                    type="button"
                    onClick={handleAuthorizeUssd}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, var(--gold), var(--coral))',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Approve (1)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

