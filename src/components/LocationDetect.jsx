import React, { useState } from 'react';

export default function LocationDetect({ onLocation }) {
    const [loading, setLoading] = useState(false);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation not supported');
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Try to get address from coordinates
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await response.json();

                    const address = data.address;
                    const locationText = [
                        address.road || address.neighbourhood || address.suburb,
                        address.city || address.town || address.village,
                    ].filter(Boolean).join(', ');

                    onLocation(locationText || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                } catch (e) {
                    onLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                }

                setLoading(false);
            },
            (err) => {
                setLoading(false);
                alert('Location access denied. Please allow location or type manually.');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <button
            type="button"
            onClick={detectLocation}
            disabled={loading}
            style={{
                padding: '8px 12px',
                background: 'var(--color-surface-highlight)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-s)',
                color: 'var(--color-text-main)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            }}
            title="Detect my location"
        >
            {loading ? '⏳' : '📍'} {loading ? 'Getting...' : 'Auto-detect'}
        </button>
    );
}
