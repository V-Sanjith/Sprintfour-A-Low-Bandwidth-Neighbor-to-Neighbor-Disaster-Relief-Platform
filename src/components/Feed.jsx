import React from 'react';
import Card from './Card';
import MatchSuggestion from './MatchSuggestion';

export default function Feed({ posts, allPosts, onAction, onReport, onReopen, onConfirmHelp }) {
    if (posts.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-m)' }}>📭</div>
                <p style={{ fontSize: '1.1rem' }}>No posts found</p>
                <p style={{ fontSize: '0.9rem', marginTop: 'var(--space-s)' }}>
                    Be the first to post a Need or Offer!
                </p>
            </div>
        );
    }

    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>
                    <Card post={post} onAction={onAction} onReport={onReport} onReopen={onReopen} onConfirmHelp={onConfirmHelp} />
                    {allPosts && <MatchSuggestion posts={allPosts} currentPost={post} />}
                </div>
            ))}
        </div>
    );
}


