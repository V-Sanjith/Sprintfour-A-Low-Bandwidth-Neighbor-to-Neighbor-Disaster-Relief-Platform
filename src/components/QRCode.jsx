import React, { useEffect, useRef } from 'react';

export default function QRCode({ url, size = 150 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Simple QR Code generator using canvas (basic implementation)
        const generateQR = async () => {
            // Using QR Server API for simplicity
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=1a1a1a&color=f0f0f0`;

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, size, size);
                }
            };
            img.src = qrUrl;
        };

        generateQR();
    }, [url, size]);

    return (
        <div style={{ textAlign: 'center' }}>
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                style={{
                    borderRadius: 'var(--radius-m)',
                    border: '2px solid var(--color-border)'
                }}
            />
            <div style={{
                marginTop: 'var(--space-s)',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)'
            }}>
                Scan to access LocalLink
            </div>
        </div>
    );
}
