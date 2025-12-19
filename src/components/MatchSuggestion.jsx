import React from 'react';

export default function MatchSuggestion({ posts, currentPost }) {
    if (!currentPost || currentPost.status !== 'OPEN') return null;

    // Find potential matches
    const matches = posts.filter(p => {
        if (p.id === currentPost.id) return false;
        if (p.status !== 'OPEN') return false;

        // Need matches with Offers, and vice versa
        if (currentPost.type === 'NEED' && p.type !== 'OFFER') return false;
        if (currentPost.type === 'OFFER' && p.type !== 'NEED') return false;

        // Same category preferred
        if (p.category !== currentPost.category) return false;

        return true;
    });

    if (matches.length === 0) return null;

    return (
        <div style={{
            background: 'linear-gradient(135deg, var(--color-accent) 0%, #5856d6 100%)',
            padding: 'var(--space-s)',
            borderRadius: 'var(--radius-s)',
            marginTop: 'var(--space-s)',
            fontSize: '0.85rem',
            color: 'white'
        }}>
            <strong>✨ {matches.length} potential match{matches.length > 1 ? 'es' : ''} found!</strong>
            <div style={{ marginTop: '4px', opacity: 0.9 }}>
                {matches.slice(0, 2).map(m => (
                    <div key={m.id} style={{ fontSize: '0.8rem' }}>
                        • {m.item} at {m.location}
                    </div>
                ))}
                {matches.length > 2 && (
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        +{matches.length - 2} more
                    </div>
                )}
            </div>
        </div>
    );
}
