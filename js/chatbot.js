/* ── EA AI Chat Widget ─────────────────────────────────────────────
   Backend-ready: swap the `API_ENDPOINT` constant to your real URL
   when you connect a backend. Everything else stays the same.
──────────────────────────────────────────────────────────────────── */

const API_ENDPOINT = 'https://ea-agency-backend.onrender.com/api/chat';

const AGENT_NAME   = 'EA Assistant';
const AGENT_AVATAR = '🤖';

const AUTO_REPLIES = [
  { match: ['service', 'offer', 'do you', 'what can'],
    reply: "We offer AI Workflow Automation, custom AI Agents, Website Development, Data Intelligence, and AI Strategy Consulting. Want details on any of these?" },
  { match: ['price', 'cost', 'how much', 'pricing', 'rate'],
    reply: "Every project is custom-scoped. The best next step is a free 30-min discovery call — we'll give you a clear proposal based on your exact needs." },
  { match: ['contact', 'reach', 'email', 'talk', 'speak', 'call'],
    reply: "You can reach us at eaenterprises2026@gmail.com, or fill out the contact form and we'll get back to you within 24 hours." },
  { match: ['automat', 'workflow', 'n8n', 'make'],
    reply: "We design and build end-to-end automation workflows using n8n, Make, and custom AI — eliminating repetitive tasks so your team can focus on what matters." },
  { match: ['website', 'web', 'site', 'landing'],
    reply: "We build fast, modern websites with built-in AI features — chatbots, lead capture, and integrations. Every site is backend-ready from day one." },
  { match: ['agent', 'ai agent', 'chatbot', 'bot'],
    reply: "We build custom AI agents that run 24/7 — handling customer support, research, outreach, and multi-step tasks autonomously." },
  { match: ['about', 'who are', 'company', 'team'],
    reply: "EA Enterprises is an AI agency founded to make cutting-edge AI accessible to businesses of every size. We design, build, and deploy AI systems that deliver real ROI." },
  { match: ['start', 'begin', 'get started', 'how do i'],
    reply: "Getting started is easy — book a free discovery call and we'll map out exactly how AI can help your business. Head to the Contact page to schedule yours!" },
  { match: ['hello', 'hi', 'hey', 'howdy', 'sup'],
    reply: "Hey there! 👋 I'm the EA Assistant. Ask me anything about our services, pricing, or how we can help your business with AI." },
  { match: ['thank', 'thanks', 'appreciate'],
    reply: "You're welcome! Is there anything else I can help you with?" },
  { match: ['bye', 'goodbye', 'see you', 'later'],
    reply: "Talk soon! Feel free to come back anytime. 👋" },
];

const FALLBACK = "Great question! For the most accurate answer, I'd recommend reaching out directly at eaenterprises2026@gmail.com or booking a free discovery call. We'd love to chat!";

// ── Build widget HTML ──────────────────────────────────────────────

const style = document.createElement('style');
style.textContent = `
  #ea-chat-wrap {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    font-family: 'Inter', system-ui, sans-serif;
  }

  #ea-chat-toggle {
    width: 58px; height: 58px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00aaff, #8b5cf6);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 4px 24px rgba(0,170,255,0.45);
    transition: transform 0.25s, box-shadow 0.25s;
    position: relative;
    margin-left: auto;
  }

  #ea-chat-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 32px rgba(0,170,255,0.6);
  }

  #ea-chat-toggle .pulse {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #00aaff, #8b5cf6);
    animation: chat-pulse 2.5s ease-out infinite;
    z-index: -1;
  }

  @keyframes chat-pulse {
    0%   { transform: scale(1);   opacity: 0.6; }
    70%  { transform: scale(1.5); opacity: 0; }
    100% { transform: scale(1.5); opacity: 0; }
  }

  #ea-chat-panel {
    width: 340px;
    max-height: 480px;
    background: #0d1626;
    border: 1px solid rgba(0,170,255,0.2);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,170,255,0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: 12px;
    transform-origin: bottom right;
    animation: chat-open 0.25s ease;
  }

  @keyframes chat-open {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }

  .ea-chat-hidden { display: none !important; }

  #ea-chat-header {
    background: linear-gradient(135deg, rgba(0,170,255,0.15), rgba(139,92,246,0.15));
    border-bottom: 1px solid rgba(0,170,255,0.15);
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ea-agent-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00aaff, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .ea-agent-info { flex: 1; }
  .ea-agent-name { font-size: 0.9rem; font-weight: 700; color: #e2e8f0; }
  .ea-agent-status { font-size: 0.72rem; color: #00aaff; display: flex; align-items: center; gap: 4px; }
  .ea-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #00aaff; animation: blink 1.5s infinite; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

  #ea-chat-close {
    background: none; border: none; color: #8892a4; font-size: 1.3rem;
    cursor: pointer; padding: 0 4px; line-height: 1; transition: color 0.2s;
  }
  #ea-chat-close:hover { color: #e2e8f0; }

  #ea-chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 320px;
    scrollbar-width: thin;
    scrollbar-color: rgba(0,170,255,0.2) transparent;
  }

  .ea-msg {
    max-width: 82%;
    font-size: 0.845rem;
    line-height: 1.55;
    padding: 10px 13px;
    border-radius: 14px;
    animation: msg-in 0.2s ease;
  }

  @keyframes msg-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ea-msg.bot {
    background: rgba(0,170,255,0.1);
    border: 1px solid rgba(0,170,255,0.18);
    color: #e2e8f0;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }

  .ea-msg.user {
    background: linear-gradient(135deg, #00aaff, #8b5cf6);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }

  .ea-typing {
    display: flex; gap: 4px; align-items: center;
    padding: 10px 13px;
    background: rgba(0,170,255,0.08);
    border: 1px solid rgba(0,170,255,0.15);
    border-radius: 14px;
    border-bottom-left-radius: 4px;
    align-self: flex-start;
    width: 52px;
  }

  .ea-typing span {
    width: 6px; height: 6px; border-radius: 50%;
    background: #00aaff; opacity: 0.5;
    animation: typing 1.2s infinite;
  }
  .ea-typing span:nth-child(2) { animation-delay: 0.2s; }
  .ea-typing span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typing {
    0%,60%,100% { transform: translateY(0); opacity: 0.5; }
    30%          { transform: translateY(-5px); opacity: 1; }
  }

  #ea-chat-input-row {
    padding: 12px;
    border-top: 1px solid rgba(0,170,255,0.12);
    display: flex;
    gap: 8px;
    background: #0a1220;
  }

  #ea-chat-input {
    flex: 1;
    background: rgba(5,10,20,0.8);
    border: 1px solid rgba(0,170,255,0.2);
    border-radius: 10px;
    padding: 9px 13px;
    color: #e2e8f0;
    font-size: 0.85rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
  }

  #ea-chat-input:focus { border-color: #00aaff; }
  #ea-chat-input::placeholder { color: #8892a4; }

  #ea-chat-send {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #00aaff, #8b5cf6);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;
    flex-shrink: 0;
  }

  #ea-chat-send:hover { transform: scale(1.08); box-shadow: 0 4px 16px rgba(0,170,255,0.4); }

  @media (max-width: 420px) {
    #ea-chat-panel { width: calc(100vw - 32px); }
    #ea-chat-wrap  { right: 16px; bottom: 16px; }
  }
`;
document.head.appendChild(style);

// ── Inject widget into DOM ─────────────────────────────────────────

const wrap = document.createElement('div');
wrap.id = 'ea-chat-wrap';
wrap.innerHTML = `
  <div id="ea-chat-panel" class="ea-chat-hidden">
    <div id="ea-chat-header">
      <div class="ea-agent-avatar">${AGENT_AVATAR}</div>
      <div class="ea-agent-info">
        <div class="ea-agent-name">${AGENT_NAME}</div>
        <div class="ea-agent-status"><span class="ea-status-dot"></span> Online — ask me anything</div>
      </div>
      <button id="ea-chat-close" aria-label="Close chat">×</button>
    </div>
    <div id="ea-chat-messages"></div>
    <div id="ea-chat-input-row">
      <input id="ea-chat-input" type="text" placeholder="Type a message…" autocomplete="off" maxlength="300" />
      <button id="ea-chat-send" aria-label="Send">➤</button>
    </div>
  </div>
  <button id="ea-chat-toggle" aria-label="Open chat">
    <div class="pulse"></div>
    💬
  </button>
`;
document.body.appendChild(wrap);

// ── References ─────────────────────────────────────────────────────

const panel    = document.getElementById('ea-chat-panel');
const toggle   = document.getElementById('ea-chat-toggle');
const closeBtn = document.getElementById('ea-chat-close');
const messages = document.getElementById('ea-chat-messages');
const input    = document.getElementById('ea-chat-input');
const sendBtn  = document.getElementById('ea-chat-send');

let isOpen = false;

// ── Open / Close ───────────────────────────────────────────────────

function openChat() {
  panel.classList.remove('ea-chat-hidden');
  toggle.innerHTML = '<div class="pulse"></div>✕';
  isOpen = true;
  if (messages.children.length === 0) {
    addBotMessage("Hi! 👋 I'm the EA Assistant. I can answer questions about our services, pricing, and how we can help your business. What's on your mind?");
  }
  setTimeout(() => input.focus(), 100);
}

function closeChat() {
  panel.classList.add('ea-chat-hidden');
  toggle.innerHTML = '<div class="pulse"></div>💬';
  isOpen = false;
}

toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
closeBtn.addEventListener('click', closeChat);

// ── Messages ───────────────────────────────────────────────────────

function addBotMessage(text) {
  const el = document.createElement('div');
  el.className = 'ea-msg bot';
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function addUserMessage(text) {
  const el = document.createElement('div');
  el.className = 'ea-msg user';
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'ea-typing';
  el.id = 'ea-typing-indicator';
  el.innerHTML = '<span></span><span></span><span></span>';
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
  return el;
}

function removeTyping() {
  const el = document.getElementById('ea-typing-indicator');
  if (el) el.remove();
}

// ── Reply logic ────────────────────────────────────────────────────

function getReply(text) {
  const lower = text.toLowerCase();
  for (const item of AUTO_REPLIES) {
    if (item.match.some(kw => lower.includes(kw))) return item.reply;
  }
  return FALLBACK;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = '';
  input.disabled = true;
  sendBtn.disabled = true;

  const typing = showTyping();

  try {
    if (API_ENDPOINT) {
      // ── Real backend call (active when API_ENDPOINT is set) ──
      // Generate or retrieve session ID
      if (!window._eaSessionId) {
        window._eaSessionId = localStorage.getItem('ea_session') ||
          'sess_' + Math.random().toString(36).slice(2) + Date.now();
        localStorage.setItem('ea_session', window._eaSessionId);
      }

      const res  = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_id: window._eaSessionId,
          page: window.location.pathname,
        }),
      });
      const data = await res.json();
      removeTyping();
      addBotMessage(data.reply || FALLBACK);
    } else {
      // ── Local keyword replies (pre-backend) ──
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
      removeTyping();
      addBotMessage(getReply(text));
    }
  } catch {
    removeTyping();
    addBotMessage("Something went wrong. Please reach out directly at eaenterprises2026@gmail.com.");
  }

  input.disabled = false;
  sendBtn.disabled = false;
  input.focus();
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
