import React from 'react';

export default function Header() {
  return (
    <div style={{ flex: 1 }}>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 800,
        letterSpacing: '-0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '1.3rem' }}>🆘</span>
        LOCAL<span style={{ color: 'var(--color-urgent)' }}>LINK</span>
      </h1>
      <p style={{
        color: 'var(--color-text-muted)',
        fontSize: '0.8rem',
        marginTop: '2px'
      }}>
        Disaster Relief Bridge
      </p>
    </div>
  );
}
