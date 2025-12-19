import React from 'react';
import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'var(--color-urgent)',
            color: 'white',
            padding: 'var(--space-s)',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            zIndex: 1000
        }}>
            ⚠️ You are offline. Some features may not work.
        </div>
    );
}
