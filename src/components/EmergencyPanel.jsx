import React from 'react';

const EMERGENCY_NUMBERS = [
    { name: 'Police', number: '100', icon: '🚔', color: '#007aff' },
    { name: 'Ambulance', number: '108', icon: '🚑', color: '#ff3b30' },
    { name: 'Fire', number: '101', icon: '🚒', color: '#ff9500' },
    { name: 'Disaster', number: '1078', icon: '🆘', color: '#ff2d55' },
    { name: 'Women', number: '1091', icon: '👩', color: '#af52de' },
];

export default function EmergencyPanel() {
    const handleCall = (number, name) => {
        navigator.clipboard.writeText(number);
        alert(`📞 ${name} Helpline: ${number}\n\nNumber copied to clipboard!\nOn mobile, this would dial directly.`);
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: 'var(--radius-m)',
            padding: 'var(--space-m)',
            marginBottom: 'var(--space-l)',
            border: '1px solid var(--color-border)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: 'var(--space-s)',
                color: 'var(--color-urgent)'
            }}>
                <span style={{ fontSize: '1.2rem' }}>🆘</span>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>EMERGENCY HELPLINES</span>
            </div>

            <div style={{
                display: 'flex',
                gap: 'var(--space-s)',
                overflowX: 'auto',
                paddingBottom: '4px'
            }}>
                {EMERGENCY_NUMBERS.map(item => (
                    <button
                        key={item.number}
                        onClick={() => handleCall(item.number, item.name)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '8px 12px',
                            background: 'var(--color-surface)',
                            border: `1px solid ${item.color}40`,
                            borderRadius: 'var(--radius-s)',
                            minWidth: '60px',
                            cursor: 'pointer'
                        }}
                    >
                        <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{item.name}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: item.color }}>{item.number}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
