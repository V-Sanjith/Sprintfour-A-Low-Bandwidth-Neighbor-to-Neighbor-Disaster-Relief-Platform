import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icons
const createIcon = (emoji, bg, size = 30, urgent = false) => new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="
    background: ${bg}; 
    width: ${size}px; 
    height: ${size}px; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    border: 3px solid white; 
    box-shadow: 0 2px 10px rgba(0,0,0,0.4); 
    font-size: ${size * 0.5}px;
    ${urgent ? 'animation: pulse 1s infinite;' : ''}
  ">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
});

const needIcon = createIcon('🆘', '#ff3b30');
const offerIcon = createIcon('✅', '#32d74b');
const urgentIcon = createIcon('🚨', '#ff3b30', 40, true);

// Known city coordinates for demo
const CITY_COORDS = {
    'hyderabad': [17.385, 78.4867],
    'chennai': [13.0827, 80.2707],
    'bangalore': [12.9716, 77.5946],
    'mumbai': [19.076, 72.8777],
    'delhi': [28.6139, 77.209],
    'kolkata': [22.5726, 88.3639],
    'pune': [18.5204, 73.8567],
    'vizag': [17.6868, 83.2185],
    'visakhapatnam': [17.6868, 83.2185],
    'vijayawada': [16.5062, 80.648],
    'nellore': [14.4426, 79.9865],
    'guntur': [16.3067, 80.4365],
    'kurnool': [15.8281, 78.0373],
    'tirupati': [13.6288, 79.4192],
    'coimbatore': [11.0168, 76.9558],
    'madurai': [9.9252, 78.1198],
    'cochin': [9.9312, 76.2673],
    'trivandrum': [8.5241, 76.9366],
};

// Get coordinates from location text
const getCoords = (post) => {
    // If post has real coordinates, use them
    if (post.latitude && post.longitude) {
        return [post.latitude, post.longitude];
    }

    // Try to match location text with known cities
    const locationLower = (post.location || '').toLowerCase();
    for (const [city, coords] of Object.entries(CITY_COORDS)) {
        if (locationLower.includes(city)) {
            // Add small random offset so markers don't stack
            return [
                coords[0] + (Math.random() - 0.5) * 0.05,
                coords[1] + (Math.random() - 0.5) * 0.05
            ];
        }
    }

    // Default: random location in Andhra Pradesh/Telangana area
    return [
        16.5 + (Math.random() - 0.5) * 3,
        79.5 + (Math.random() - 0.5) * 3
    ];
};

function FitBounds({ markers }) {
    const map = useMap();

    useEffect(() => {
        if (markers.length > 0) {
            const bounds = markers.map(m => m.coords);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
        }
    }, [markers, map]);

    return null;
}

export default function MapView({ posts, onSelectPost }) {
    const defaultCenter = [17.385, 78.4867]; // Hyderabad

    // Filter open posts and add coordinates
    const markers = posts
        .filter(p => p.status !== 'FULFILLED')
        .map(p => ({
            ...p,
            coords: getCoords(p)
        }));

    return (
        <div style={{ marginBottom: 'var(--space-m)' }}>
            <div style={{
                height: '350px',
                borderRadius: 'var(--radius-m)',
                overflow: 'hidden',
                border: '2px solid var(--color-border)'
            }}>
                <MapContainer
                    center={defaultCenter}
                    zoom={6}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; OSM'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {markers.length > 0 && <FitBounds markers={markers} />}

                    {markers.map(post => (
                        <Marker
                            key={post.id}
                            position={post.coords}
                            icon={post.urgency === 'URGENT' ? urgentIcon : (post.type === 'NEED' ? needIcon : offerIcon)}
                        >
                            <Popup>
                                <div style={{ minWidth: '180px', fontFamily: 'system-ui' }}>
                                    <div style={{
                                        fontWeight: 'bold',
                                        color: post.type === 'NEED' ? '#ff3b30' : '#32d74b',
                                        marginBottom: '4px',
                                        fontSize: '12px'
                                    }}>
                                        {post.urgency === 'URGENT' && '🚨 '}
                                        {post.type === 'NEED' ? 'NEED HELP' : 'OFFERING HELP'}
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                                        {post.quantity && `${post.quantity} × `}{post.item}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                                        📍 {post.location}
                                    </div>
                                    <button
                                        onClick={() => onSelectPost(post)}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            background: post.type === 'NEED' ? '#ff3b30' : '#32d74b',
                                            color: post.type === 'NEED' ? 'white' : 'black',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {post.type === 'NEED' ? '🤝 I Can Help' : '📦 Claim This'}
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-m)',
                marginTop: 'var(--space-s)',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)'
            }}>
                <span>🆘 Need Help</span>
                <span>✅ Offering Help</span>
                <span>🚨 Urgent</span>
            </div>

            {markers.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: 'var(--space-m)',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.9rem'
                }}>
                    No active posts to show on map. Post a Need or Offer to see pins!
                </div>
            )}
        </div>
    );
}
