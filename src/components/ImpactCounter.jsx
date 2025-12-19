import React from 'react';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

export default function ImpactCounter() {
    const [stats, setStats] = useState({ total: 0, fulfilled: 0, inProgress: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await supabase
                .from('posts')
                .select('status');

            if (data) {
                setStats({
                    total: data.length,
                    fulfilled: data.filter(p => p.status === 'FULFILLED').length,
                    inProgress: data.filter(p => p.status === 'IN_PROGRESS').length
                });
            }
        };

        fetchStats();

        // Subscribe to changes
        const channel = supabase
            .channel('stats-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
                fetchStats();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-s)',
            marginBottom: 'var(--space-l)',
            textAlign: 'center'
        }}>
            <div style={{
                background: 'var(--color-surface)',
                padding: 'var(--space-m)',
                borderRadius: 'var(--radius-m)',
                border: '1px solid var(--color-border)'
            }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>
                    {stats.total}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>TOTAL POSTS</div>
            </div>

            <div style={{
                background: 'var(--color-surface)',
                padding: 'var(--space-m)',
                borderRadius: 'var(--radius-m)',
                border: '1px solid var(--color-accent)'
            }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                    {stats.inProgress}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>HELP COMING</div>
            </div>

            <div style={{
                background: 'var(--color-offer-bg)',
                padding: 'var(--space-m)',
                borderRadius: 'var(--radius-m)',
                border: '1px solid var(--color-offer)'
            }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-offer)' }}>
                    {stats.fulfilled}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>PEOPLE HELPED</div>
            </div>
        </div>
    );
}
