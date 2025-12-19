import React from 'react';

const QUICK_TEMPLATES = [
    { label: '💧 Water', item: 'Drinking Water', category: 'Water' },
    { label: '🍞 Food', item: 'Food/Meals', category: 'Food' },
    { label: '💊 Medicine', item: 'Medicine', category: 'Medical' },
    { label: '🔋 Power', item: 'Power Bank / Charger', category: 'Power' },
    { label: '⛺ Shelter', item: 'Temporary Shelter', category: 'Shelter' },
];

export default function QuickTemplates({ onSelect }) {
    return (
        <div style={{ marginBottom: 'var(--space-m)' }}>
            <div style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-xs)'
            }}>
                ⚡ QUICK POST (1-TAP):
            </div>
            <div style={{
                display: 'flex',
                gap: 'var(--space-xs)',
                overflowX: 'auto',
                paddingBottom: '4px'
            }}>
                {QUICK_TEMPLATES.map(template => (
                    <button
                        key={template.label}
                        onClick={() => onSelect(template)}
                        style={{
                            whiteSpace: 'nowrap',
                            padding: '8px 12px',
                            background: 'var(--color-surface)',
                            color: 'var(--color-text-main)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-m)',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {template.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
