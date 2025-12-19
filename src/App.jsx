import React, { useState, useEffect, Suspense, lazy } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import EmergencyPanel from './components/EmergencyPanel';
import ImpactCounter from './components/ImpactCounter';
import QuickTemplates from './components/QuickTemplates';
import PostForm from './components/PostForm';
import FilterBar from './components/FilterBar';
import Feed from './components/Feed';
import OfflineIndicator from './components/OfflineIndicator';
import ShareDrawer from './components/ShareDrawer';

const MapView = lazy(() => import('./components/MapView'));

// Rate limiting: max 5 posts per hour
const RATE_LIMIT_KEY = 'locallink_post_times';
const MAX_POSTS_PER_HOUR = 5;

const checkRateLimit = () => {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const postTimes = stored ? JSON.parse(stored) : [];
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  const recentPosts = postTimes.filter(t => t > oneHourAgo);
  return recentPosts.length < MAX_POSTS_PER_HOUR;
};

const recordPost = () => {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const postTimes = stored ? JSON.parse(stored) : [];
  postTimes.push(Date.now());
  // Keep only last hour's posts
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  const recentPosts = postTimes.filter(t => t > oneHourAgo);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentPosts));
};

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [postType, setPostType] = useState('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [prefill, setPrefill] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [viewMode, setViewMode] = useState('feed');

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError('Failed to load posts.');
    } else {
      setPosts(data || []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPosts(prev => [payload.new, ...prev]);
          if (payload.new.urgency === 'URGENT') {
            try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZF').play().catch(() => { }); } catch (e) { }
          }
        } else if (payload.eventType === 'UPDATE') {
          setPosts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
        } else if (payload.eventType === 'DELETE') {
          setPosts(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleQuickTemplate = (template) => {
    setPrefill(template);
    setShowForm(true);
  };

  const handlePost = async (newPost) => {
    // Rate limit check
    if (!checkRateLimit()) {
      alert('⚠️ Slow down! You can only post 5 times per hour.\n\nThis prevents spam and keeps the platform useful for everyone.');
      return;
    }

    const { error } = await supabase.from('posts').insert([{
      type: newPost.type,
      urgency: newPost.urgency,
      category: newPost.category,
      item: newPost.item,
      quantity: newPost.quantity || null,
      description: newPost.description || null,
      location: newPost.location,
      contact: newPost.contact,
      status: 'OPEN'
    }]);

    if (error) {
      alert('Failed to post.');
    } else {
      recordPost(); // Track this post for rate limiting
      setShowForm(false);
      setPrefill(null);
    }
  };

  const handleAction = async (id, actionType) => {
    let newStatus;
    if (actionType === 'CLAIM') {
      newStatus = 'IN_PROGRESS';
    } else if (actionType === 'PENDING') {
      newStatus = 'PENDING_CONFIRMATION';
    } else {
      newStatus = 'FULFILLED';
    }
    await supabase.from('posts').update({ status: newStatus }).eq('id', id);
  };

  const handleConfirmHelp = async (id, confirmed) => {
    if (confirmed) {
      // Requester confirms help was received
      await supabase.from('posts').update({ status: 'FULFILLED' }).eq('id', id);
    } else {
      // Help was not received - reopen the post
      await supabase.from('posts').update({ status: 'OPEN' }).eq('id', id);
      alert('📢 Post reopened. Someone else can now help.');
    }
  };

  const handleReport = async (id) => {
    console.log('Post reported:', id);
  };

  const handleReopen = async (id) => {
    await supabase.from('posts').update({ status: 'OPEN' }).eq('id', id);
  };

  const handleMapSelectPost = (post) => {
    handleAction(post.id, 'CLAIM');
  };

  const getSortedPosts = (list) => {
    return [...list].sort((a, b) => {
      if (a.urgency === 'URGENT' && b.urgency !== 'URGENT' && a.status === 'OPEN') return -1;
      if (b.urgency === 'URGENT' && a.urgency !== 'URGENT' && b.status === 'OPEN') return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  const filteredPosts = posts.filter(p => {
    if (postType === 'Needs' && p.type !== 'NEED') return false;
    if (postType === 'Offers' && p.type !== 'OFFER') return false;
    const matchesCategory = category === 'All' || p.category === category;
    const searchLower = search.toLowerCase();
    return matchesCategory && (
      p.item?.toLowerCase().includes(searchLower) ||
      p.location?.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower)
    );
  });

  const finalPosts = getSortedPosts(filteredPosts);
  const needsCount = posts.filter(p => p.type === 'NEED' && p.status === 'OPEN').length;
  const offersCount = posts.filter(p => p.type === 'OFFER' && p.status === 'OPEN').length;

  return (
    <>
      <OfflineIndicator />
      <ShareDrawer isOpen={showShare} onClose={() => setShowShare(false)} />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-m)' }}>
          <Header />
          <button onClick={() => setShowShare(true)} style={{ padding: '8px 12px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-m)', fontSize: '1.1rem', cursor: 'pointer' }} title="Share">
            📤
          </button>
        </div>

        <EmergencyPanel />
        <ImpactCounter />

        {/* Quick Stats */}
        <div style={{ display: 'flex', gap: 'var(--space-s)', marginBottom: 'var(--space-m)', fontSize: '0.85rem' }}>
          <div style={{ flex: 1, padding: 'var(--space-s)', background: 'var(--color-urgent-bg)', borderRadius: 'var(--radius-s)', textAlign: 'center', border: '1px solid var(--color-urgent)' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--color-urgent)' }}>{needsCount}</span> Needs
          </div>
          <div style={{ flex: 1, padding: 'var(--space-s)', background: 'var(--color-offer-bg)', borderRadius: 'var(--radius-s)', textAlign: 'center', border: '1px solid var(--color-offer)' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--color-offer)' }}>{offersCount}</span> Offers
          </div>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-s)', marginBottom: 'var(--space-m)' }}>
          <button onClick={() => setViewMode('feed')} style={{ padding: 'var(--space-s)', background: viewMode === 'feed' ? 'var(--color-text-main)' : 'var(--color-surface)', color: viewMode === 'feed' ? 'var(--color-bg)' : 'var(--color-text-main)', border: viewMode === 'feed' ? 'none' : '1px solid var(--color-border)', borderRadius: 'var(--radius-s)', fontWeight: 'bold', cursor: 'pointer' }}>
            📋 Feed View
          </button>
          <button onClick={() => setViewMode('map')} style={{ padding: 'var(--space-s)', background: viewMode === 'map' ? 'var(--color-text-main)' : 'var(--color-surface)', color: viewMode === 'map' ? 'var(--color-bg)' : 'var(--color-text-main)', border: viewMode === 'map' ? 'none' : '1px solid var(--color-border)', borderRadius: 'var(--radius-s)', fontWeight: 'bold', cursor: 'pointer' }}>
            🗺️ Map View
          </button>
        </div>

        {!showForm && <QuickTemplates onSelect={handleQuickTemplate} />}

        <button
          onClick={() => { setShowForm(!showForm); setPrefill(null); }}
          style={{
            width: '100%',
            padding: 'var(--space-m)',
            background: showForm ? 'var(--color-surface)' : 'linear-gradient(135deg, var(--color-urgent) 0%, #ff6b6b 100%)',
            color: showForm ? 'var(--color-text-muted)' : 'white',
            border: showForm ? '1px solid var(--color-border)' : 'none',
            borderRadius: 'var(--radius-m)',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: 'var(--space-m)',
            cursor: 'pointer'
          }}
        >
          {showForm ? '✕ CLOSE' : '+ POST NEED / OFFER'}
        </button>

        {showForm && <PostForm onPost={handlePost} prefill={prefill} />}

        <div style={{ borderTop: '1px solid var(--color-border)', margin: 'var(--space-m) 0' }} />

        <FilterBar
          activeCategory={category}
          onCategoryChange={setCategory}
          activeType={postType}
          onTypeChange={setPostType}
          searchTerm={search}
          onSearchChange={setSearch}
        />

        {loading && <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>⏳ Loading...</div>}

        {error && (
          <div style={{ textAlign: 'center', padding: 'var(--space-m)', background: 'var(--color-urgent-bg)', color: 'var(--color-urgent)', borderRadius: 'var(--radius-s)', marginBottom: 'var(--space-m)' }}>
            {error}
            <button onClick={fetchPosts} style={{ display: 'block', margin: '8px auto 0', padding: '8px 16px', background: 'var(--color-urgent)', color: 'white', border: 'none', borderRadius: 'var(--radius-s)', cursor: 'pointer' }}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {viewMode === 'map' && (
              <Suspense fallback={<div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>Loading map...</div>}>
                <MapView posts={finalPosts} onSelectPost={handleMapSelectPost} />
              </Suspense>
            )}
            {viewMode === 'feed' && <Feed posts={finalPosts} allPosts={posts} onAction={handleAction} onReport={handleReport} onReopen={handleReopen} onConfirmHelp={handleConfirmHelp} />}
          </>
        )}

        <div style={{ textAlign: 'center', padding: 'var(--space-l)', color: 'var(--color-text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-l)' }}>
          <strong>LocalLink</strong> • Disaster Relief Bridge<br />
          <span style={{ fontSize: '0.7rem' }}>🎤 Voice • 📍 GPS • 🗺️ Map • 🚩 Anti-Spam • 📲 PWA</span>
        </div>
      </div>
    </>
  );
}
