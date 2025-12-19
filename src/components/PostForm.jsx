import React, { useState, useEffect } from 'react';
import { CATEGORY_ICONS } from '../utils/icons';
import VoiceInput from './VoiceInput';
import LocationDetect from './LocationDetect';

const CATEGORIES = Object.keys(CATEGORY_ICONS);

export default function PostForm({ onPost, prefill }) {
    const [type, setType] = useState('NEED');
    const [isUrgent, setIsUrgent] = useState(false);

    const [formData, setFormData] = useState({
        item: prefill?.item || '',
        quantity: '',
        category: prefill?.category || 'Food',
        description: '',
        location: '',
        contact: ''
    });

    // Smart Default: Auto-detect urgency
    useEffect(() => {
        const urgentKeywords = ['medical', 'blood', 'injured', 'life', 'emergency', 'trapped', 'dying', 'critical'];
        const descLower = (formData.description + ' ' + formData.item).toLowerCase();
        if (urgentKeywords.some(w => descLower.includes(w))) {
            setIsUrgent(true);
        }
    }, [formData.description, formData.item]);

    // Update form when prefill changes
    useEffect(() => {
        if (prefill) {
            setFormData(prev => ({
                ...prev,
                item: prefill.item || prev.item,
                category: prefill.category || prev.category
            }));
        }
    }, [prefill]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onPost({ ...formData, type, urgency: isUrgent ? 'URGENT' : 'NORMAL' });
        setFormData({ item: '', quantity: '', category: 'Food', description: '', location: '', contact: '' });
        setIsUrgent(false);
    };

    return (
        <div style={{ marginBottom: 'var(--space-l)' }}>
            {/* Type Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-s)', marginBottom: 'var(--space-m)' }}>
                <button
                    type="button"
                    onClick={() => setType('NEED')}
                    style={{
                        padding: 'var(--space-s)',
                        background: type === 'NEED' ? 'var(--color-urgent)' : 'var(--color-surface)',
                        color: type === 'NEED' ? 'white' : 'var(--color-text-main)',
                        fontWeight: 'bold',
                        borderRadius: 'var(--radius-s)',
                    }}
                >
                    🔴 I NEED HELP
                </button>
                <button
                    type="button"
                    onClick={() => setType('OFFER')}
                    style={{
                        padding: 'var(--space-s)',
                        background: type === 'OFFER' ? 'var(--color-offer)' : 'var(--color-surface)',
                        color: type === 'OFFER' ? 'black' : 'var(--color-text-main)',
                        fontWeight: 'bold',
                        borderRadius: 'var(--radius-s)',
                    }}
                >
                    🟢 I CAN HELP
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }}>

                {/* Urgency Toggle */}
                {type === 'NEED' && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: isUrgent ? 'var(--color-urgent-bg)' : 'var(--color-surface)', padding: '10px', borderRadius: '6px', border: isUrgent ? '1px solid var(--color-urgent)' : '1px solid var(--color-border)' }}>
                        <input
                            type="checkbox"
                            checked={isUrgent}
                            onChange={e => setIsUrgent(e.target.checked)}
                            style={{ width: '20px', height: '20px', accentColor: 'var(--color-urgent)' }}
                        />
                        <span style={{ color: isUrgent ? 'var(--color-urgent)' : 'var(--color-text-muted)', fontWeight: 'bold' }}>
                            🆘 LIFE-THREATENING / URGENT
                        </span>
                    </label>
                )}

                {/* Item with Voice Input */}
                <div style={{ position: 'relative' }}>
                    <input
                        placeholder={type === 'NEED' ? "What do you need? (tap 🎤 to speak)" : "What are you offering?"}
                        value={formData.item}
                        onChange={e => setFormData({ ...formData, item: e.target.value })}
                        style={{ width: '100%', paddingRight: '50px' }}
                        required
                    />
                    <VoiceInput onResult={(text) => setFormData({ ...formData, item: text })} />
                </div>

                {/* Category & Quantity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-s)' }}>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input placeholder="Qty (e.g. 2, 5L)" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                </div>

                {/* Location with Auto-detect */}
                <div style={{ display: 'flex', gap: 'var(--space-s)' }}>
                    <input placeholder="Location (Landmark)" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ flex: 1 }} required />
                    <LocationDetect onLocation={(loc) => setFormData({ ...formData, location: loc })} />
                </div>

                {/* Description with Voice */}
                <div style={{ position: 'relative' }}>
                    <textarea placeholder="Details... (tap 🎤 to speak)" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', paddingRight: '50px' }} />
                    <VoiceInput onResult={(text) => setFormData({ ...formData, description: text })} />
                </div>

                {/* Contact */}
                <input placeholder="📱 Contact (Phone/WhatsApp)" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} required />

                <button type="submit" className={type === 'NEED' ? 'btn-primary btn-urgent' : 'btn-primary btn-offer'} style={{ marginTop: 'var(--space-xs)', fontSize: '1rem' }}>
                    {type === 'NEED' ? '🆘 POST EMERGENCY REQUEST' : '✅ POST OFFER'}
                </button>
            </form>
        </div>
    );
}
