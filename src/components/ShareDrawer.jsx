import React, { useState, useEffect } from 'react';
import QRCode from './QRCode';

export default function ShareDrawer({ isOpen, onClose }) {
    const [canInstall, setCanInstall] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setCanInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
            setCanInstall(false);
        }
        setDeferredPrompt(null);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareWhatsApp = () => {
        const text = encodeURIComponent('🆘 LocalLink - Disaster Relief Bridge\n\nConnect with neighbors during emergencies!\n\n' + window.location.href);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-l) var(--radius-l) 0 0',
                    padding: 'var(--space-l)',
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '80vh',
                    overflow: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-l)'
                }}>
                    <h2 style={{ fontSize: '1.2rem' }}>📤 Share LocalLink</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            fontSize: '1.5rem',
                            color: 'var(--color-text-muted)'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* QR Code */}
                <div style={{ marginBottom: 'var(--space-l)' }}>
                    <QRCode url={window.location.href} size={180} />
                </div>

                {/* Share Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }}>

                    {/* Install PWA */}
                    {canInstall && (
                        <button
                            onClick={handleInstall}
                            style={{
                                padding: 'var(--space-m)',
                                background: 'linear-gradient(135deg, var(--color-accent) 0%, #5856d6 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-m)',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            📲 Install as App
                        </button>
                    )}

                    {/* Copy Link */}
                    <button
                        onClick={handleCopyLink}
                        style={{
                            padding: 'var(--space-m)',
                            background: 'var(--color-surface-highlight)',
                            color: 'var(--color-text-main)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-m)',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        {copied ? '✓ Copied!' : '🔗 Copy Link'}
                    </button>

                    {/* WhatsApp */}
                    <button
                        onClick={handleShareWhatsApp}
                        style={{
                            padding: 'var(--space-m)',
                            background: '#25D366',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-m)',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        💬 Share via WhatsApp
                    </button>
                </div>

                <div style={{
                    marginTop: 'var(--space-l)',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)'
                }}>
                    Share with your community to help more people!
                </div>
            </div>
        </div>
    );
}
