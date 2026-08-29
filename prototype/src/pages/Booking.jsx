import React, { useState } from 'react';

export default function Booking({ property, onBack, onComplete }) {
  const [paymentOption, setPaymentOption] = useState('flex'); // 'flex' or 'upfront'
  
  const annualAdvance = property.price * 24; // Standard 2-year advance

  return (
    <div className="screen-container">
      <div className="d-flex align-center gap-3 mb-4">
        <button 
          onClick={onBack}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'var(--bg-primary)', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ←
        </button>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Checkout</h2>
      </div>

      <div className="glass mb-4" style={{ borderRadius: '12px', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <img src={property.image} alt={property.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{property.title}</h3>
          <p className="text-sm text-secondary">{property.city}</p>
        </div>
      </div>

      <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Choose Payment Option</h3>

      {/* Flex-Advance Option */}
      <div 
        onClick={() => setPaymentOption('flex')}
        className={`mb-3 ${paymentOption === 'flex' ? 'glass-dark' : 'glass'}`}
        style={{ borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', border: paymentOption === 'flex' ? '2px solid var(--coral)' : '1px solid var(--border)' }}
      >
        <div className="d-flex justify-between align-center mb-2">
          <h4 style={{ color: paymentOption === 'flex' ? 'white' : 'var(--teal)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span role="img" aria-label="rocket">🚀</span> Flex-Advance
          </h4>
          <input type="radio" checked={paymentOption === 'flex'} readOnly />
        </div>
        <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Pay monthly instead of a 2-year advance.</p>
        <div className="font-bold" style={{ fontSize: '1.25rem' }}>
          {property.currency} {property.price.toLocaleString()} <span style={{ fontSize: '0.875rem', fontWeight: 'normal', opacity: 0.8 }}>/ month</span>
        </div>
        {paymentOption === 'flex' && (
          <div className="mt-3" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--success)' }}>✓</span> Employer payroll deduction verified.
          </div>
        )}
      </div>

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

      <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
        <h4 style={{ color: 'var(--teal)', marginBottom: '0.5rem', fontSize: '1rem' }}>Escrow Protection</h4>
        <p className="text-sm text-secondary">
          Your payment is held safely in escrow. It will only be released to the host 24 hours after your successful move-in.
        </p>
      </div>

      <button className="btn btn-primary w-100" onClick={onComplete}>
        Confirm & Pay {property.currency} {paymentOption === 'flex' ? property.price.toLocaleString() : annualAdvance.toLocaleString()}
      </button>
    </div>
  );
}
