import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Landmark, ThumbsUp, MessageSquare, PlusCircle, Award, Send } from 'lucide-react';

const CommunitySupport = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('schemes');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [commentText, setCommentText] = useState({});

  const fetchItems = async () => {
    try {
      setLoading(true);
      const url = `/api/community?type=${activeTab === 'schemes' ? 'scheme' : 'forum'}`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setItems(result.data);
      }
    } catch (err) {
      console.error('Error fetching community items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleLike = async (itemId) => {
    if (!user) {
      alert('Please sign in to like this post.');
      return;
    }
    try {
      const response = await fetch(`/api/community/${itemId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setItems(prev => prev.map(i => i._id === itemId ? result.data : i));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCommentSubmit = async (itemId, e) => {
    e.preventDefault();
    const text = commentText[itemId];
    if (!text || !text.trim() || !user) return;

    try {
      const response = await fetch(`/api/community/${itemId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      const result = await response.json();
      if (result.success) {
        setCommentText(prev => ({ ...prev, [itemId]: '' }));
        setItems(prev => prev.map(i => i._id === itemId ? result.data : i));
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: user?.role === 'admin' ? 'scheme' : 'forum',
          title,
          content,
          category
        })
      });
      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        setTitle('');
        setContent('');
        fetchItems();
      }
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 0 80px 0' }}>
      {/* HERO BANNER */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', color: 'white', padding: '40px', marginBottom: '30px', border: 'none' }}>
        <span className="badge" style={{ backgroundColor: 'var(--accent)', color: '#1b4332', fontWeight: 'bold', marginBottom: '10px' }}>Rural Co-operative Ecosystem</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800 }}>Krishi Support & Welfare Forums</h1>
        <p style={{ fontSize: '0.95rem', opacity: 0.9, marginTop: '8px' }}>
          Connecting farmers with agronomic scholars, scientific advisers, and government assistance schemes.
        </p>

        {user && (
          <button onClick={() => setShowModal(true)} className="btn btn-secondary" style={{ marginTop: '20px' }}>
            <PlusCircle size={18} /> {user.role === 'admin' ? 'Publish Welfare Scheme' : 'Share Farm Discussion'}
          </button>
        )}
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button 
          onClick={() => setActiveTab('schemes')}
          className="btn"
          style={{ backgroundColor: activeTab === 'schemes' ? 'var(--primary)' : 'var(--bg-secondary)', color: activeTab === 'schemes' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)' }}
        >
          <Landmark size={16} /> Gov Schemes & Subsidies
        </button>

        <button 
          onClick={() => setActiveTab('forum')}
          className="btn"
          style={{ backgroundColor: activeTab === 'forum' ? 'var(--primary)' : 'var(--bg-secondary)', color: activeTab === 'forum' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)' }}
        >
          <Users size={16} /> Discussion Board
        </button>
      </div>

      {/* ITEMS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {loading ? (
          <p>Loading community posts...</p>
        ) : items.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No resources found in this category.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Award size={16} /> {item.author}
                </span>
                <span className="badge badge-organic">{item.category}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>{item.content}</p>

              <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <button onClick={() => handleLike(item._id)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ThumbsUp size={14} /> Like ({item.likes?.length || 0})
                </button>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={14} /> Comments ({item.comments?.length || 0})
                </span>
              </div>

              {/* COMMENTS LIST */}
              {item.comments && item.comments.length > 0 && (
                <div style={{ marginTop: '12px', backgroundColor: 'var(--bg-tertiary)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                  {item.comments.map((c, idx) => (
                    <div key={idx} style={{ marginBottom: '6px' }}>
                      <strong style={{ color: 'var(--primary)' }}>{c.authorName}:</strong> {c.text}
                    </div>
                  ))}
                </div>
              )}

              {/* COMMENT INPUT */}
              {user && (
                <form onSubmit={(e) => handleCommentSubmit(item._id, e)} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <input type="text" placeholder="Write a comment..." value={commentText[item._id] || ''} onChange={(e) => setCommentText(prev => ({ ...prev, [item._id]: e.target.value }))} style={{ flex: 1, padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.8rem' }} />
                  <button type="submit" className="btn btn-primary" style={{ padding: '6px 10px' }}><Send size={12} /></button>
                </form>
              )}
            </div>
          ))
        )}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '16px' }}>Share Insight / Post</h3>
            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" required placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }} />
              <textarea required placeholder="Detailed Writeup..." value={content} onChange={(e) => setContent(e.target.value)} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', rows: 4 }} />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitySupport;
