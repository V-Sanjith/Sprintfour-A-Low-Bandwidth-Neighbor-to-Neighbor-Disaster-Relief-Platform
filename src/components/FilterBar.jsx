import React from 'react';

const CATEGORIES = ['All', 'Food', 'Water', 'Medical', 'Shelter', 'Power', 'Transport', 'Other'];
const TYPES = ['All', 'Needs', 'Offers'];

export default function FilterBar({
    activeCategory,
    onCategoryChange,
    searchTerm,
    onSearchChange,
    activeType,
    onTypeChange
}) {
    return (
        <div style={{ marginBottom: 'var(--space-m)' }}>
            {/* Search */}
            <input
                type="text"
                placeholder="🔍 Search items, locations..."
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                style={{ width: '100%', marginBottom: 'var(--space-s)' }}
            />

            {/* Type Toggle (Needs / Offers / All) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-xs)',
                marginBottom: 'var(--space-s)'
            }}>
                {TYPES.map(type => (
                    <button
                        key={type}
                        onClick={() => onTypeChange(type)}
                        style={{
                            padding: '8px',
                            borderRadius: 'var(--radius-s)',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            background: activeType === type
                                ? (type === 'Needs' ? 'var(--color-urgent)' : type === 'Offers' ? 'var(--color-offer)' : 'var(--color-text-main)')
                                : 'var(--color-surface)',
                            color: activeType === type
                                ? (type === 'Offers' || type === 'All' ? 'var(--color-bg)' : 'white')
                                : 'var(--color-text-main)',
                            border: activeType === type ? 'none' : '1px solid var(--color-border)'
                        }}
                    >
                        {type === 'Needs' ? '🔴 ' : type === 'Offers' ? '🟢 ' : ''}{type}
                    </button>
                ))}
            </div>

            {/* Category Pills */}
            <div style={{
                display: 'flex',
                gap: 'var(--space-xs)',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'none'
            }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        style={{
                            whiteSpace: 'nowrap',
                            padding: '4px 12px',
                            borderRadius: '100px',
                            fontSize: '0.85rem',
                            background: activeCategory === cat ? 'var(--color-text-main)' : 'var(--color-surface)',
                            color: activeCategory === cat ? 'var(--color-bg)' : 'var(--color-text-muted)',
                            border: activeCategory === cat ? 'none' : '1px solid var(--color-border)'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
