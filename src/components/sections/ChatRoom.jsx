import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  limitToLast,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../../lib/firebase";

gsap.registerPlugin(ScrollTrigger);

const FAKE_CHATS = [
  {
    id: "fake-0",
    senderName: "Rakha FR",
    senderPhoto: "https://i.pinimg.com/736x/bd/6d/f7/bd6df73658dc4fffa2022b47a66eb61f.jpg",
    messageText: "kalian bisa chat disini teman teman!",
    timeLabel: "30 menit lalu",
  },
  {
    id: "fake-1",
    senderName: "Rakha Fr",
    senderPhoto: "https://rakhafr.github.io/RFR_PORTOFOLIO/img/hero.jpeg",
    messageText: "akun ke 2 testing!!",
    timeLabel: "15 menit lalu",
  },
  {
    id: "fake-2",
    senderName: "Xzea",
    senderPhoto: "https://i.pinimg.com/1200x/97/f6/eb/97f6ebf655cfbaeeff728a10d310a96b.jpg",
    messageText: "MANTAP NGABB!!!",
    timeLabel: "5 menit lalu",
  },
];

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])
  );
}

function ChatBubble({ id, senderName, senderPhoto, messageText, timeLabel, isMine, isPreview }) {
  return (
    <div
      id={`msg-${id}`}
      className={`chat-bubble${isMine ? " mine" : ""}${isPreview ? " preview-chat" : ""}`}
    >
      <img
        src={senderPhoto || "https://api.dicebear.com/7.x/adventurer/svg?seed=guest"}
        alt={senderName}
        className="bubble-avatar"
        referrerPolicy="no-referrer"
      />
      <div className="bubble-content">
        <div className="bubble-meta">
          <span className="bubble-sender">{escapeHTML(senderName)}</span>
          <span className="bubble-time">{timeLabel}</span>
        </div>
        <div className="bubble-text-box">
          <p>{escapeHTML(messageText)}</p>
        </div>
      </div>
    </div>
  );
}

export default function ChatRoom() {
  const [user,         setUser]         = useState(null);
  const [messages,     setMessages]     = useState([]);
  const [inputText,    setInputText]    = useState("");
  const [loading,      setLoading]      = useState(true);
  const [sending,      setSending]      = useState(false);

  const messagesRef   = useRef(null);
  const headingRef    = useRef(null);
  const containerRef  = useRef(null);
  const lastSentRef   = useRef(0);
  const unsubRef      = useRef(null);

  const COOLDOWN_MS = 2000;

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
      );
      gsap.fromTo(containerRef.current,
        { y: 60, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
      );
    });
    return () => ctx.revert();
  }, []);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setMessages([]);
    });
    return () => unsub();
  }, []);

  // Firestore listener when logged in
  useEffect(() => {
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    if (!user) { setLoading(false); return; }

    setLoading(true);
    const q = query(collection(db, "chats"), orderBy("timestamp", "asc"), limitToLast(50));
    unsubRef.current = onSnapshot(
      q,
      (snap) => {
        setLoading(false);
        const msgs = snap.docs.map((doc) => {
          const d = doc.data();
          const date = d.timestamp?.toDate?.();
          return {
            id: doc.id,
            senderName:  d.senderName,
            senderPhoto: d.senderPhoto,
            messageText: d.messageText,
            timeLabel: date
              ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Baru saja",
          };
        });
        setMessages(msgs);
        setTimeout(scrollToBottom, 50);
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      }
    );
    return () => { if (unsubRef.current) unsubRef.current(); };
  }, [user]);

  const scrollToBottom = () => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); }
    catch (e) { console.error("Login failed:", e); alert("Gagal login. Coba lagi."); }
  };

  const handleLogout = async () => {
    try { await signOut(auth); }
    catch (e) { console.error("Logout failed:", e); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!user) { alert("Login dulu!"); return; }
    const text = inputText.trim();
    if (!text || text.length > 200) return;

    const now = Date.now();
    if (now - lastSentRef.current < COOLDOWN_MS) {
      const rem = Math.ceil((COOLDOWN_MS - (now - lastSentRef.current)) / 1000);
      alert(`Tunggu ${rem} detik lagi.`);
      return;
    }

    setSending(true);
    try {
      await addDoc(collection(db, "chats"), {
        senderName:  user.displayName || "User Google",
        senderPhoto: user.photoURL    || "",
        messageText: text,
        timestamp:   serverTimestamp(),
      });
      setInputText("");
      lastSentRef.current = Date.now();
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Send failed:", err);
      alert("Gagal kirim pesan.");
    } finally {
      setSending(false);
    }
  };

  const charCount = inputText.length;
  const nearLimit = charCount >= 180;

  return (
    <section className="chat full" id="chat">
      <h2 className="heading" ref={headingRef}>
        Public <span>Chat Room</span>
      </h2>

      <div className="chat-container glass" ref={containerRef}>
        <div className="chat-wrapper">
          <div id="chat-panel" className="chat-state-panel">

            {/* Header */}
            <div className="chat-header-user">
              {user ? (
                <div className="user-info" id="chat-header-user-info">
                  <img src={user.photoURL} alt="Avatar" className="user-avatar-img" referrerPolicy="no-referrer" />
                  <div className="user-details">
                    <span className="user-name-txt">{user.displayName || "User"}</span>
                    <span className="user-status-txt">
                      <span className="status-dot" />Online
                    </span>
                  </div>
                </div>
              ) : (
                <div className="user-info" id="chat-header-guest-info">
                  <div className="user-avatar-placeholder">
                    <i className="bx bx-group" />
                  </div>
                  <div className="user-details">
                    <span className="user-name-txt">Public Chat Room</span>
                    <span className="user-status-txt">
                      <span className="status-dot" />Guest Mode
                    </span>
                  </div>
                </div>
              )}

              <div className="chat-header-actions">
                {user ? (
                  <button className="btn-logout-clean" onClick={handleLogout}>
                    <i className="bx bx-log-out" /> Sign Out
                  </button>
                ) : (
                  <button className="btn-google-header" onClick={handleLogin}>
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>

            {/* Messages area */}
            <div id="chat-messages" className="chat-messages-area" ref={messagesRef}>
              {loading && (
                <div className="chat-loader">
                  <div className="spinner" />
                  <p>Memuat pesan...</p>
                </div>
              )}

              {!loading && user && messages.length === 0 && (
                <div className="chat-empty">
                  <i className="bx bx-message-rounded-x" />
                  <p>Belum ada pesan. Jadilah yang pertama mengirim pesan!</p>
                </div>
              )}

              {!loading && user && messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  {...msg}
                  isMine={user?.displayName === msg.senderName}
                  isPreview={false}
                />
              ))}

              {!user && FAKE_CHATS.map((msg) => (
                <ChatBubble key={msg.id} {...msg} isMine={false} isPreview={true} />
              ))}
            </div>

            {/* Input form */}
            <form id="chat-form" className="chat-input-form" onSubmit={handleSend}>
              {user ? (
                <div className="chat-input-inner-wrapper">
                  <input
                    type="text"
                    id="chat-input-text"
                    placeholder="Tulis pesan Anda di sini..."
                    maxLength={200}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={sending}
                    autoComplete="off"
                    required
                  />
                  <div className="chat-input-actions">
                    <span className={`char-counter${nearLimit ? " limit-warn" : ""}`}>
                      {charCount} / 200
                    </span>
                    <button type="submit" className="btn-send" disabled={sending}>
                      <i className="bx bxs-paper-plane" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="chat-input-blocked-msg">
                  <p>Silakan login dengan Google untuk ikut bergabung dalam obrolan...</p>
                </div>
              )}
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}
