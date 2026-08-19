import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Namaste! I am Krishi AI, your agricultural assistant. Ask me about crop rotation, organic pest control, or app features!' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let reply = "Thank you for reaching out! For optimal crop yield, ensure balanced organic composting and regular soil moisture checks.";
      const lower = userMsg.toLowerCase();

      if (lower.includes('spinach') || lower.includes('veggie')) {
        reply = "Leafy greens like spinach harvest best during early morning hours to preserve crisp freshness!";
      } else if (lower.includes('price') || lower.includes('mandi')) {
        reply = "Farmers can use our AI Price Trend Recommender in the Farmer Dashboard to set fair prices without middlemen.";
      } else if (lower.includes('order') || lower.includes('delivery')) {
        reply = "You can track your active orders with our real-time visual delivery map under the Track Orders tab!";
      } else if (lower.includes('organic') || lower.includes('pest')) {
        reply = "Use neem leaf extract solution (5ml/L water) for a natural, chemical-free pesticide for tomatoes and okra.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '54px',
          height: '54px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          zIndex: 999,
          transition: 'var(--transition)'
        }}
        title="Krishi AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
      </button>

      {isOpen && (
        <div className="card fade-in" style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '340px',
          height: '440px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          padding: 0,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-dark)' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Krishi AI Assistant</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>Agricultural & Market Advisor</div>
            </div>
          </div>

          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'var(--bg-tertiary)' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: m.sender === 'user' ? 'var(--primary)' : 'var(--bg-secondary)',
                color: m.sender === 'user' ? 'white' : 'var(--text-primary)',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                maxWidth: '85%',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', padding: '10px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            <input
              type="text"
              placeholder="Ask Krishi AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                backgroundColor: 'transparent',
                outline: 'none',
                fontSize: '0.85rem',
                color: 'var(--text-primary)'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '6px 10px', borderRadius: '50%' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
