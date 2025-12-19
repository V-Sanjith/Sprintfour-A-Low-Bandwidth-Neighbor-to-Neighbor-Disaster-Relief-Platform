import React, { useState } from 'react';
import { getIcon } from '../utils/icons';
import { timeAgo } from '../utils/time';
import { getDeviceId } from '../utils/device';

export default function Card({ post, onAction, onReport, onReopen, onConfirmHelp }) {
    const isNeed = post.type === 'NEED';
    const isUrgent = post.urgency === 'URGENT';
    const isFulfilled = post.status === 'FULFILLED';
    const isInProgress = post.status === 'IN_PROGRESS';
    const isPendingConfirmation = post.status === 'PENDING_CONFIRMATION';

    // Check if this device created the post
    const isMyPost = post.device_id === getDeviceId();

    const [showContact, setShowContact] = useState(false);
    const [reported, setReported] = useState(false);

    const handleActionClick = () => {
        if (isInProgress) {
            if (window.confirm('Mark as done?\n\nThe requester will be asked to confirm they received help.')) {
                onAction(post.id, 'PENDING');
            }
        } else {
            onAction(post.id, 'CLAIM');
            setShowContact(true);
        }
    };

    const handleConfirmYes = () => {
        if (onConfirmHelp) onConfirmHelp(post.id, true);
    };

    const handleConfirmNo = () => {
        if (onConfirmHelp) onConfirmHelp(post.id, false);
    };

    const handleReport = () => {
        if (window.confirm('🚨 Report this post as spam/fake?')) {
            setReported(true);
            if (onReport) onReport(post.id);
            alert('✓ Reported. Thank you.');
        }
    };

    const handleCall = () => {
        navigator.clipboard.writeText(post.contact);
        alert(`📞 Number copied: ${post.contact}`);
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent(`Hi! Regarding "${post.item}" on LocalLink. Location: ${post.location}`);
        window.open(`https://wa.me/${post.contact.replace(/\D/g, '')}?text=${message}`, '_blank');
    };

    const handleShare = () => {
        const text = `🆘 ${isNeed ? 'HELP NEEDED' : 'OFFERING'}: ${post.item} at ${post.location}`;
        if (navigator.share) {
            navigator.share({ title: 'LocalLink', text });
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        }
    };

    return (
        <div className="card" style={{
            borderLeft: isPendingConfirmation ? '6px solid #ff9500' : isUrgent ? '6px solid var(--color-urgent)' : `4px solid ${isNeed ? 'var(--color-urgent-bg)' : 'var(--color-offer-bg)'}`,
            background: isPendingConfirmation ? 'rgba(255, 149, 0, 0.05)' : isUrgent ? 'rgba(255, 59, 48, 0.03)' : 'var(--color-surface)',
            position: 'relative',
            opacity: isFulfilled ? 0.6 : 1
        }}>
            {/* My Post Badge */}
            {isMyPost && !isFulfilled && (
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--color-accent)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>
                    MY POST
                </div>
            )}

            {/* Urgent Badge */}
            {isUrgent && !isPendingConfirmation && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--color-urgent)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>
                    URGENT
                </div>
            )}

            {/* Pending Confirmation Badge */}
            {isPendingConfirmation && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff9500', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    ⏳ AWAITING
                </div>
            )}

            {/* Report Button */}
            {!isFulfilled && !isPendingConfirmation && !reported && !isMyPost && (
                <button onClick={handleReport} style={{ position: 'absolute', top: isUrgent ? '35px' : '10px', right: '10px', background: 'transparent', border: 'none', fontSize: '1rem', cursor: 'pointer', opacity: 0.5 }} title="Report spam">
                    🚩
                </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-s)', marginTop: isMyPost ? '20px' : '0' }}>
                <span style={{ fontSize: '1.5rem' }}>{getIcon(post.category)}</span>
                <div>
                    <span className={isNeed ? 'tag tag-urgent' : 'tag tag-offer'} style={{ fontSize: '0.7rem' }}>
                        {isNeed ? 'NEED' : 'OFFER'}
                    </span>
                    <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {timeAgo(new Date(post.created_at).getTime())}
                    </span>
                </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)', lineHeight: 1.3 }}>
                {post.quantity && <span style={{ opacity: 0.8 }}>{post.quantity} x </span>}
                {post.item}
            </h3>

            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-m)', fontSize: '0.95rem' }}>
                {post.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-m)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                <span>📍</span> <strong>{post.location}</strong>
            </div>

            {/* PENDING CONFIRMATION - Only original poster can confirm */}
            {isPendingConfirmation && (
                <div style={{ background: 'rgba(255, 149, 0, 0.15)', padding: 'var(--space-m)', borderRadius: 'var(--radius-m)', marginBottom: 'var(--space-m)', border: '2px solid #ff9500', textAlign: 'center' }}>
                    {(isMyPost || !post.device_id) ? (
                        <>
                            <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '8px', color: '#ff9500' }}>
                                📣 Did you receive help?
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                                Someone claims to have helped. Please confirm:
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-s)' }}>
                                <button onClick={handleConfirmYes} style={{ flex: 1, padding: '12px', background: 'var(--color-offer)', color: 'black', border: 'none', borderRadius: 'var(--radius-m)', fontWeight: 'bold', cursor: 'pointer' }}>
                                    ✓ Yes, I got help!
                                </button>
                                <button onClick={handleConfirmNo} style={{ flex: 1, padding: '12px', background: 'var(--color-urgent)', color: 'white', border: 'none', borderRadius: 'var(--radius-m)', fontWeight: 'bold', cursor: 'pointer' }}>
                                    ✗ No, didn't receive
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ color: '#ff9500', fontSize: '0.9rem' }}>
                            ⏳ Waiting for the original poster to confirm they received help
                        </div>
                    )}
                </div>
            )}

            {/* Contact Section */}
            {(showContact || isInProgress) && !isPendingConfirmation && (
                <div style={{ background: 'var(--color-surface-highlight)', padding: 'var(--space-s)', borderRadius: 'var(--radius-s)', marginBottom: 'var(--space-m)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>CONTACT</div>
                    <div style={{ display: 'flex', gap: 'var(--space-s)' }}>
                        <button onClick={handleCall} style={{ flex: 1, padding: '10px', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: 'var(--radius-s)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            📞 Call
                        </button>
                        <button onClick={handleWhatsApp} style={{ flex: 1, padding: '10px', background: '#25D366', color: 'white', border: 'none', borderRadius: 'var(--radius-s)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            💬 WhatsApp
                        </button>
                    </div>
                    <div style={{ fontSize: '0.85rem', marginTop: '8px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        {post.contact}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {!isFulfilled && !isPendingConfirmation && (
                <div style={{ display: 'flex', gap: 'var(--space-s)' }}>
                    {!isMyPost && (
                        <button onClick={handleActionClick} className={isNeed ? 'btn-primary btn-urgent' : 'btn-primary btn-offer'} style={{ flex: 1 }}>
                            {isInProgress ? '✓ Mark Done' : (isNeed ? 'I Can Help' : 'Claim Offer')}
                        </button>
                    )}
                    {isMyPost && !isInProgress && (
                        <div style={{ flex: 1, padding: '12px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            Waiting for someone to help...
                        </div>
                    )}
                    <button onClick={handleShare} style={{ padding: 'var(--space-s)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-m)', fontSize: '1.1rem' }} title="Share">
                        🔗
                    </button>
                </div>
            )}

            {/* Fulfilled State */}
            {isFulfilled && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', color: 'var(--color-offer)', fontWeight: 'bold' }}>
                        ✓ VERIFIED COMPLETE
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        {isMyPost ? 'You confirmed help was received' : 'Requester confirmed help was received'}
                    </div>
                </div>
            )}
        </div>
    );
}
