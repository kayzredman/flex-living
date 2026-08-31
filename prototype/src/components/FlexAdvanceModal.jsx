import React, { useState } from 'react';

export default function FlexAdvanceModal({ property, isOpen, onClose, onApply, currency = 'GHS' }) {
  if (!isOpen) return null;

  const [tenure, setTenure] = useState(6);
  const monthlyRent = property.price;
  const traditional2YearAdvance = monthlyRent * 24;
  
  const totalFinanced = monthlyRent * tenure;
  const financingFeeRate = 0.015; // 1.5% prime rate
  const monthlyInterest = totalFinanced * financingFeeRate;
  const totalRepayment = totalFinanced + (monthlyInterest * tenure);
  const monthlyPayment = Math.round(totalRepayment / tenure);
  const cashSavedUpfront = traditional2YearAdvance - monthlyPayment;

  const formatPrice = (priceGhs) => {
    if (currency === 'USD') return `$${Math.round(priceGhs / 15).toLocaleString()}`;
    if (currency === 'NGN') return `₦${(priceGhs * 105).toLocaleString()}`;
    return `GHS ${priceGhs.toLocaleString()}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2100,
        background: 'rgba(10, 15, 30, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      <div
        className="glass-dark"
        style={{
          width: '100%',
          maxWidth: '560px',
          borderRadius: '24px',
          padding: '2rem',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontWeight: 800
          }}
        >
          ✕
        </button>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(233,69,96,0.2)', padding: '4px 12px', borderRadius: '16px', color: 'var(--coral-light)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <span>🚀</span> FLEX-ADVANCE FINANCING SIMULATOR
        </div>

        <h3 style={{ fontSize: '1.6rem', color: 'white', margin: '0 0 0.5rem 0' }}>
          Stop Paying 2 Years Upfront
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Flex-Living pays your landlord 1–2 years in advance. You pay us monthly via automated payroll deduction or Mobile Money.
        </p>

        {/* Tenure Slider */}
        <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
          <div className="d-flex justify-between align-center mb-2">
            <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Financing Tenure:</span>
            <span style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.1rem' }}>{tenure} Months</span>
          </div>
          <input
            type="range"
            min="3"
            max="24"
            step="3"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--coral)', cursor: 'pointer', height: '6px' }}
          />
          <div className="d-flex justify-between text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '8px' }}>
            <span>3 mo</span>
            <span>6 mo</span>
            <span>12 mo</span>
            <span>24 mo</span>
          </div>
        </div>

        {/* Financial Comparison Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '14px' }}>
            <div className="text-xs" style={{ color: '#fca5a5' }}>Traditional Market</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginTop: '4px' }}>
              {formatPrice(traditional2YearAdvance)}
            </div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>100% due today</div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1rem', borderRadius: '14px' }}>
            <div className="text-xs" style={{ color: 'var(--success)' }}>With Flex-Advance</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold-light)', marginTop: '4px' }}>
              {formatPrice(monthlyPayment)}
            </div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>due monthly (1.5%/mo)</div>
          </div>
        </div>

        {/* Upfront Cash Retained Highlight */}
        <div style={{ background: 'rgba(233,163,25,0.15)', border: '1px solid rgba(233,163,25,0.35)', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>💰</span>
          <div>
            <div style={{ color: 'var(--gold-light)', fontWeight: 800, fontSize: '0.95rem' }}>
              Keep {formatPrice(cashSavedUpfront)} in your account!
            </div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Reinvest in your business or savings instead of locking capital into a landlord's pocket.
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary w-100"
          style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 800, borderRadius: '12px' }}
          onClick={() => { onClose(); onApply(); }}
        >
          Apply with 1-Minute Credit Check →
        </button>
      </div>
    </div>
  );
}
