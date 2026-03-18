'use client';
import { useEffect, useRef, useState, useCallback } from "react";
import {
  FiShoppingBag, FiX, FiPlus, FiMinus, FiChevronRight, FiCheck,
  FiMapPin, FiPhone, FiMail, FiClock, FiTruck, FiPackage,
} from "react-icons/fi";
import {
  FaInstagram, FaFacebookF, FaTwitter,
} from "react-icons/fa";
import { MdOutlineTableRestaurant } from "react-icons/md";

/* ═══════════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Tenor+Sans&family=Cormorant:ital,wght@1,300;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:        #0C0A08;
      --obsidian:   #111008;
      --surface:    #181510;
      --card:       #1E1A14;
      --border:     #2E2920;
      --gold:       #C9A84C;
      --gold-light: #E2C97E;
      --gold-dim:   #7A6330;
      --crimson:    #6B1A1A;
      --cream:      #F2EDE3;
      --warm:       #D4C9B0;
      --muted:      #7A7060;
      --px:         clamp(20px, 5vw, 60px);
      --max-w:      1200px;
    }

    html { scroll-behavior: smooth; }
    body {
      background: var(--ink); color: var(--cream);
      font-family: 'Tenor Sans', sans-serif;
      overflow-x: hidden; cursor: none;
      -webkit-font-smoothing: antialiased;
    }
    body.modal-open { overflow: hidden; }

    /* Grain */
    body::after {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 200;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      opacity: 0.45;
    }

    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-track { background: var(--ink); }
    ::-webkit-scrollbar-thumb { background: var(--gold-dim); }

    /* Cursors */
    .cursor-dot {
      position: fixed; pointer-events: none; z-index: 9999;
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--gold); transform: translate(-50%,-50%);
      mix-blend-mode: screen; transition: width .2s, height .2s;
    }
    .cursor-ring {
      position: fixed; pointer-events: none; z-index: 9998;
      width: 32px; height: 32px; border-radius: 50%;
      border: 1px solid rgba(201,168,76,0.4);
      transform: translate(-50%,-50%);
      transition: left .13s ease-out, top .13s ease-out, width .3s, height .3s, border-color .3s;
    }
    .cursor-ring.expand { width: 52px; height: 52px; border-color: rgba(201,168,76,0.65); }

    /* Typography */
    .font-display { font-family: 'Cormorant Garamond', serif; }
    .font-italic  { font-family: 'Cormorant', serif; font-style: italic; }

    /* Container */
    .container {
      max-width: var(--max-w);
      margin: 0 auto;
      padding: 0 var(--px);
      width: 100%;
    }

    /* Section padding */
    .section-pad { padding: clamp(72px, 10vw, 140px) 0; }

    /* Nav helpers */
    .nav-hidden-mobile { display: flex; }
    .nav-show-mobile   { display: none; }
    @media (max-width: 768px) {
      .nav-hidden-mobile { display: none !important; }
      .nav-show-mobile   { display: flex !important; }
    }

    /* Reservation form grid */
    .reserve-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px 48px;
    }
    @media (max-width: 600px) {
      .reserve-grid { grid-template-columns: 1fr; gap: 28px; }
      .reserve-grid .span2 { grid-column: span 1 !important; }
    }

    /* Ambience grid */
    .ambience-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: var(--border);
    }
    @media (max-width: 768px) {
      .ambience-grid { grid-template-columns: 1fr; }
    }

    /* Footer grid */
    .footer-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1fr;
      gap: 48px;
      margin-bottom: 64px;
    }
    @media (max-width: 900px) {
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
    }
    @media (max-width: 480px) {
      .footer-grid { grid-template-columns: 1fr; }
    }

    /* Nav links */
    .nav-link {
      font-family: 'Tenor Sans', sans-serif;
      font-size: 11px; letter-spacing: .22em; text-transform: uppercase;
      color: var(--warm); text-decoration: none; transition: color .3s; position: relative;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: -3px; left: 0;
      width: 0; height: 1px; background: var(--gold); transition: width .35s ease;
    }
    .nav-link:hover { color: var(--gold-light); }
    .nav-link:hover::after { width: 100%; }

    /* Menu item hover line */
    .menu-item-line { position: relative; overflow: hidden; }
    .menu-item-line::before {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 0; height: 1px;
      background: linear-gradient(to right, transparent, var(--gold-dim), transparent);
      transition: width .6s ease;
    }
    .menu-item-line:hover::before { width: 100%; }

    /* Form fields */
    input, textarea, select {
      background: transparent; border: none;
      border-bottom: 1px solid var(--border);
      color: var(--cream); font-family: 'Tenor Sans', sans-serif;
      font-size: 14px; letter-spacing: .08em;
      padding: 12px 4px; width: 100%; outline: none;
      transition: border-color .3s; appearance: none;
    }
    input::placeholder, textarea::placeholder { color: var(--muted); }
    input:focus, textarea:focus, select:focus { border-bottom-color: var(--gold); }
    select option { background: var(--surface); }
    label {
      display: block; font-size: 10px; letter-spacing: .25em;
      text-transform: uppercase; color: var(--gold-dim); margin-bottom: 6px;
    }

    /* Keyframes */
    @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes flicker  { 0%,100%{opacity:1;} 92%{opacity:1;} 93%{opacity:.85;} 94%{opacity:1;} 96%{opacity:.9;} 97%{opacity:1;} }
    @keyframes goldPulse{ 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0);} 50%{box-shadow:0 0 24px 4px rgba(201,168,76,.12);} }
    @keyframes drift    { from{transform:translateX(0);} to{transform:translateX(-50%);} }
    @keyframes scaleIn  { from{opacity:0;transform:scale(.95);} to{opacity:1;transform:scale(1);} }
    @keyframes slideUp  { from{opacity:0;transform:translateY(40px);} to{opacity:1;transform:translateY(0);} }
    @keyframes checkDraw{ from{stroke-dashoffset:50;} to{stroke-dashoffset:0;} }
    @keyframes spin     { to{transform:rotate(360deg);} }

    /* Order modal */
    .order-modal-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(8,6,4,.88);
      backdrop-filter: blur(8px);
      display: flex; align-items: stretch; justify-content: flex-end;
      animation: fadeIn .3s ease both;
    }
    .order-modal-panel {
      width: 100%; max-width: 580px;
      background: var(--surface);
      border-left: 1px solid var(--border);
      display: flex; flex-direction: column;
      overflow: hidden;
      animation: slideUp .4s ease both;
    }
    @media (max-width: 600px) {
      .order-modal-overlay { align-items: flex-end; }
      .order-modal-panel { max-width: 100%; border-left: none; border-top: 1px solid var(--border); max-height: 94vh; border-radius: 16px 16px 0 0; }
    }
    .order-modal-header {
      padding: 24px 32px;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0;
    }
    .order-modal-body { flex: 1; overflow-y: auto; padding: 32px; }
    .order-modal-body::-webkit-scrollbar { width: 2px; }
    .order-modal-body::-webkit-scrollbar-thumb { background: var(--gold-dim); }
    .order-modal-footer {
      padding: 24px 32px;
      border-top: 1px solid var(--border);
      flex-shrink: 0;
      background: var(--card);
    }

    /* Step indicator */
    .step-bar {
      display: flex; align-items: center; gap: 0;
      margin-bottom: 32px;
    }
    .step-item {
      display: flex; align-items: center; gap: 8px;
      font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
      color: var(--muted); white-space: nowrap;
    }
    .step-item.active { color: var(--gold-light); }
    .step-item.done   { color: var(--gold-dim); }
    .step-num {
      width: 22px; height: 22px; border-radius: 50%; border: 1px solid currentColor;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; flex-shrink: 0;
    }
    .step-divider { flex: 1; height: 1px; background: var(--border); margin: 0 8px; min-width: 16px; }

    /* Order item card */
    .order-item-card {
      border: 1px solid var(--border);
      padding: 20px;
      margin-bottom: 12px;
      transition: border-color .3s;
      cursor: none;
    }
    .order-item-card:hover { border-color: var(--gold-dim); }
    .order-item-card.selected { border-color: var(--gold); background: rgba(201,168,76,.04); }

    /* Qty control */
    .qty-control {
      display: flex; align-items: center; gap: 12px;
    }
    .qty-btn {
      width: 28px; height: 28px; border: 1px solid var(--border);
      background: none; color: var(--cream); cursor: none;
      display: flex; align-items: center; justify-content: center;
      transition: border-color .2s, color .2s; flex-shrink: 0;
    }
    .qty-btn:hover { border-color: var(--gold); color: var(--gold); }

    /* Fulfillment toggle */
    .fulfill-toggle {
      display: flex; border: 1px solid var(--border); overflow: hidden; margin-bottom: 28px;
    }
    .fulfill-btn {
      flex: 1; padding: 12px; background: none; border: none;
      font-family: 'Tenor Sans', sans-serif; font-size: 11px;
      letter-spacing: .18em; text-transform: uppercase;
      color: var(--muted); cursor: none; transition: background .3s, color .3s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .fulfill-btn.active { background: var(--gold); color: var(--ink); }

    /* Gold button */
    .btn-gold {
      background: var(--gold); color: var(--ink);
      font-family: 'Tenor Sans', sans-serif; font-size: 11px;
      letter-spacing: .25em; text-transform: uppercase;
      padding: 16px 32px; border: none; cursor: none;
      width: 100%; transition: background .3s, transform .2s;
    }
    .btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); }
    .btn-gold:disabled { opacity: .4; pointer-events: none; }

    /* Ghost button */
    .btn-ghost {
      background: transparent; color: var(--warm);
      font-family: 'Tenor Sans', sans-serif; font-size: 11px;
      letter-spacing: .2em; text-transform: uppercase;
      padding: 14px 28px; border: 1px solid var(--border); cursor: none;
      transition: border-color .3s, color .3s;
    }
    .btn-ghost:hover { border-color: var(--gold-dim); color: var(--gold-light); }

    /* Confirmation check */
    .confirm-check svg .check-path {
      stroke-dasharray: 50;
      stroke-dashoffset: 50;
      animation: checkDraw .5s ease .3s forwards;
    }

    /* Category tab */
    .cat-tab {
      background: none; border: none; cursor: none;
      font-family: 'Tenor Sans', sans-serif; font-size: 10px;
      letter-spacing: .2em; text-transform: uppercase;
      padding: 8px 16px; color: var(--muted);
      border-bottom: 1px solid transparent;
      transition: color .3s, border-color .3s;
      white-space: nowrap;
    }
    .cat-tab.active { color: var(--gold-light); border-bottom-color: var(--gold); }

    /* Cart badge */
    .cart-badge {
      position: absolute; top: -6px; right: -8px;
      width: 18px; height: 18px; border-radius: 50%;
      background: var(--gold); color: var(--ink);
      font-size: 10px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }

    /* Divider text */
    .divider-text {
      display: flex; align-items: center; gap: 16px;
      margin: 24px 0; color: var(--muted); font-size: 11px; letter-spacing: .15em;
    }
    .divider-text::before, .divider-text::after {
      content: ''; flex: 1; height: 1px; background: var(--border);
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════════════════════════════ */
const Cursor = () => {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      if (dot.current)  { dot.current.style.left = e.clientX+"px"; dot.current.style.top = e.clientY+"px"; }
      rx = e.clientX; ry = e.clientY;
    };
    const tick = () => {
      if (ring.current) { ring.current.style.left = rx+"px"; ring.current.style.top = ry+"px"; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const add = () => ring.current?.classList.add("expand");
    const rem = () => ring.current?.classList.remove("expand");
    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a,button,input,select,textarea,[data-h]").forEach(el => {
      el.addEventListener("mouseenter", add);
      el.addEventListener("mouseleave", rem);
    });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <>
      <div ref={dot}  className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ORNAMENT
═══════════════════════════════════════════════════════════════════ */
const Ornament = ({ width = 120, opacity = 0.5 }: { width?: number; opacity?: number }) => (
  <svg width={width} viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
    <line x1="0" y1="10" x2="80" y2="10" stroke="#C9A84C" strokeWidth="0.5"/>
    <circle cx="90"  cy="10" r="3" stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
    <circle cx="100" cy="10" r="5" stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
    <circle cx="110" cy="10" r="3" stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
    <line x1="120" y1="10" x2="200" y2="10" stroke="#C9A84C" strokeWidth="0.5"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   ORDER DATA
═══════════════════════════════════════════════════════════════════ */
type OrderItem = { id: string; name: string; desc: string; price: number; category: string; };

const ORDER_MENU: OrderItem[] = [
  // Starters
  { id:"s1", category:"Starters", name:"Caviar & Crème Fraîche",   price:48, desc:"Oscietra caviar, blinis, chive crème fraîche, lemon zest" },
  { id:"s2", category:"Starters", name:"Foie Gras Terrine",         price:38, desc:"Duck foie gras, brioche mouillette, fig preserve, Sauternes gelée" },
  { id:"s3", category:"Starters", name:"Scallop Crudo",             price:32, desc:"Hokkaido scallop, yuzu kosho, cucumber water, dill oil, trout roe" },
  // Mains
  { id:"m1", category:"Mains",    name:"Wagyu Beef Tenderloin",     price:145, desc:"A5 Miyazaki beef, black truffle jus, pomme soufflé, bordelaise" },
  { id:"m2", category:"Mains",    name:"Turbot en Croûte",          price:98,  desc:"Line-caught turbot, lobster mousseline, sauce nantaise" },
  { id:"m3", category:"Mains",    name:"Rack of Lamb Provençal",    price:88,  desc:"Herb-crusted lamb, tapenade, ratatouille, lavender jus" },
  // Desserts
  { id:"d1", category:"Desserts", name:"Valrhona Chocolate Sphere", price:22, desc:"Dark chocolate, salted caramel, passion fruit, vanilla Chantilly" },
  { id:"d2", category:"Desserts", name:"Tarte Tatin",               price:18, desc:"Caramelised Granny Smith, Calvados cream, buckwheat feuilletine" },
  { id:"d3", category:"Desserts", name:"Artisan Cheese Trolley",    price:34, desc:"Twelve European cheeses, house preserves, candied walnuts" },
  // Drinks
  { id:"w1", category:"Drinks",   name:"Sommelier Wine Pairing",    price:95, desc:"Five curated pours selected to complement your meal" },
  { id:"w2", category:"Drinks",   name:"Artisan Cocktail",          price:22, desc:"Chef's signature seasonal creation, crafted tableside" },
  { id:"w3", category:"Drinks",   name:"Non-Alcoholic Pairing",     price:45, desc:"House-pressed juices and botanical infusions" },
];

/* ═══════════════════════════════════════════════════════════════════
   ORDER MODAL
═══════════════════════════════════════════════════════════════════ */
type CartEntry = { item: OrderItem; qty: number };

const OrderModal = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep]         = useState<1|2|3|4>(1);
  const [cart, setCart]         = useState<CartEntry[]>([]);
  const [category, setCategory] = useState("Starters");
  const [fulfill, setFulfill]   = useState<"delivery"|"pickup">("delivery");
  const [form, setForm]         = useState({ name:"", email:"", phone:"", address:"", note:"" });
  const [placing, setPlacing]   = useState(false);

  const categories = ["Starters","Mains","Desserts","Drinks"];
  const filtered   = ORDER_MENU.filter(i => i.category === category);

  const cartTotal  = cart.reduce((sum, e) => sum + e.item.price * e.qty, 0);
  const cartCount  = cart.reduce((sum, e) => sum + e.qty, 0);
  const delivery   = fulfill === "delivery" ? 8 : 0;
  const orderTotal = cartTotal + delivery;

  const addItem = (item: OrderItem) => {
    setCart(c => {
      const found = c.find(e => e.item.id === item.id);
      return found ? c.map(e => e.item.id === item.id ? {...e, qty: e.qty+1} : e) : [...c, {item, qty:1}];
    });
  };
  const removeItem = (id: string) => {
    setCart(c => {
      const found = c.find(e => e.item.id === id);
      if (!found) return c;
      return found.qty <= 1 ? c.filter(e => e.item.id !== id) : c.map(e => e.item.id === id ? {...e, qty: e.qty-1} : e);
    });
  };
  const qtyOf = (id: string) => cart.find(e => e.item.id === id)?.qty ?? 0;

  const placeOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    setPlacing(false);
    setStep(4);
  };

  const SectionHeader = ({ title, sub }: { title: string; sub: string }) => (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontSize:10, letterSpacing:".3em", textTransform:"uppercase", color:"var(--gold-dim)", marginBottom:8 }}>{sub}</p>
      <h3 className="font-display" style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight:300, letterSpacing:".08em", color:"var(--cream)", lineHeight:1 }}>{title}</h3>
    </div>
  );

  const StepBar = () => (
    <div className="step-bar">
      {(["Menu","Cart","Details","Done"] as const).map((label, i) => {
        const num = (i+1) as 1|2|3|4;
        const state = step > num ? "done" : step === num ? "active" : "";
        return (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:0, flex: i < 3 ? 1 : "none" }}>
            <div className={`step-item ${state}`}>
              <div className="step-num">
                {step > num ? <FiCheck size={10}/> : num}
              </div>
              <span className="nav-hidden-mobile">{label}</span>
            </div>
            {i < 3 && <div className="step-divider" />}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="order-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="order-modal-panel">

        {/* Header */}
        <div className="order-modal-header">
          <div>
            <div className="font-display" style={{ fontSize:20, letterSpacing:".15em", color:"var(--gold-light)", textTransform:"uppercase" }}>
              Order Online
            </div>
            <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".15em", marginTop:2 }}>
              Vesper Fine Dining · Est. 2018
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            {cartCount > 0 && step === 1 && (
              <button onClick={() => setStep(2)} style={{
                background:"none", border:"1px solid var(--gold-dim)", cursor:"none",
                color:"var(--gold)", fontFamily:"Tenor Sans", fontSize:10,
                letterSpacing:".2em", textTransform:"uppercase", padding:"8px 18px",
                display:"flex", alignItems:"center", gap:8,
                transition:"background .3s, color .3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="var(--gold)"; (e.currentTarget as HTMLElement).style.color="var(--ink)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="none"; (e.currentTarget as HTMLElement).style.color="var(--gold)"; }}
              >
                <FiShoppingBag size={12}/> Cart ({cartCount})
              </button>
            )}
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"none", color:"var(--muted)", transition:"color .3s", padding:4 }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color="var(--cream)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color="var(--muted)"}
            >
              <FiX size={20}/>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="order-modal-body">

          {/* ── STEP 1: MENU ── */}
          {step === 1 && (
            <div style={{ animation:"slideUp .4s ease both" }}>
              <StepBar />
              <SectionHeader title="Select Your Dishes" sub="— Curated Menu" />

              {/* Category tabs */}
              <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:24, gap:0, overflowX:"auto" }}>
                {categories.map(cat => (
                  <button key={cat} className={`cat-tab ${category===cat?"active":""}`} onClick={() => setCategory(cat)}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Items */}
              <div>
                {filtered.map(item => {
                  const qty = qtyOf(item.id);
                  return (
                    <div key={item.id} className={`order-item-card ${qty>0?"selected":""}`}
                      style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"center" }}
                    >
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                          <h4 className="font-display" style={{ fontSize:18, fontWeight:400, color:"var(--cream)", letterSpacing:".03em" }}>{item.name}</h4>
                          {qty > 0 && <span style={{ fontSize:10, background:"var(--gold)", color:"var(--ink)", padding:"2px 8px", letterSpacing:".1em" }}>{qty}</span>}
                        </div>
                        <p style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6, marginBottom:8 }}>{item.desc}</p>
                        <span className="font-display" style={{ fontSize:16, color:"var(--gold)", letterSpacing:".05em" }}>${item.price}</span>
                      </div>
                      <div>
                        {qty === 0 ? (
                          <button onClick={() => addItem(item)} style={{
                            background:"none", border:"1px solid var(--gold-dim)", cursor:"none",
                            color:"var(--gold)", width:36, height:36,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            transition:"background .3s, color .3s",
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="var(--gold)"; (e.currentTarget as HTMLElement).style.color="var(--ink)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="none"; (e.currentTarget as HTMLElement).style.color="var(--gold)"; }}
                          >
                            <FiPlus size={14}/>
                          </button>
                        ) : (
                          <div className="qty-control">
                            <button className="qty-btn" onClick={() => removeItem(item.id)}><FiMinus size={12}/></button>
                            <span style={{ fontSize:14, color:"var(--cream)", minWidth:16, textAlign:"center" }}>{qty}</span>
                            <button className="qty-btn" onClick={() => addItem(item)}><FiPlus size={12}/></button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {cart.length === 0 && (
                <p style={{ fontSize:13, color:"var(--muted)", textAlign:"center", marginTop:16, fontStyle:"italic" }}>
                  Add dishes to begin your order
                </p>
              )}
            </div>
          )}

          {/* ── STEP 2: CART ── */}
          {step === 2 && (
            <div style={{ animation:"slideUp .4s ease both" }}>
              <StepBar />
              <SectionHeader title="Your Order" sub="— Review & Adjust" />

              {/* Fulfillment toggle */}
              <div className="fulfill-toggle">
                <button className={`fulfill-btn ${fulfill==="delivery"?"active":""}`} onClick={() => setFulfill("delivery")}>
                  <FiTruck size={13}/> Delivery
                </button>
                <button className={`fulfill-btn ${fulfill==="pickup"?"active":""}`} onClick={() => setFulfill("pickup")}>
                  <FiPackage size={13}/> Pick Up
                </button>
              </div>

              {/* Cart items */}
              {cart.length === 0 ? (
                <div style={{ textAlign:"center", padding:"48px 0" }}>
                  <FiShoppingBag size={32} style={{ color:"var(--muted)", marginBottom:16 }}/>
                  <p style={{ color:"var(--muted)", fontSize:13 }}>Your cart is empty</p>
                  <button onClick={() => setStep(1)} className="btn-ghost" style={{ marginTop:20 }}>Browse Menu</button>
                </div>
              ) : (
                <>
                  {cart.map(({item, qty}) => (
                    <div key={item.id} style={{
                      display:"grid", gridTemplateColumns:"1fr auto",
                      gap:16, alignItems:"center",
                      padding:"16px 0", borderBottom:"1px solid var(--border)",
                    }}>
                      <div>
                        <div style={{ fontSize:15, color:"var(--cream)", marginBottom:2 }}>{item.name}</div>
                        <div style={{ fontSize:12, color:"var(--muted)" }}>${item.price} each</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => removeItem(item.id)}><FiMinus size={11}/></button>
                          <span style={{ fontSize:14, color:"var(--cream)", minWidth:16, textAlign:"center" }}>{qty}</span>
                          <button className="qty-btn" onClick={() => addItem(item)}><FiPlus size={11}/></button>
                        </div>
                        <span className="font-display" style={{ fontSize:16, color:"var(--gold)", minWidth:48, textAlign:"right" }}>
                          ${item.price * qty}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Summary */}
                  <div style={{ marginTop:24, padding:"20px 0" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:13, color:"var(--muted)" }}>
                      <span>Subtotal</span><span>${cartTotal}</span>
                    </div>
                    {fulfill==="delivery" && (
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:13, color:"var(--muted)" }}>
                        <span>Delivery</span><span>${delivery}</span>
                      </div>
                    )}
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:16, paddingTop:16, borderTop:"1px solid var(--border)" }}>
                      <span className="font-display" style={{ fontSize:20, color:"var(--cream)", letterSpacing:".05em" }}>Total</span>
                      <span className="font-display" style={{ fontSize:20, color:"var(--gold)", letterSpacing:".05em" }}>${orderTotal}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── STEP 3: DETAILS ── */}
          {step === 3 && (
            <div style={{ animation:"slideUp .4s ease both" }}>
              <StepBar />
              <SectionHeader title={fulfill==="delivery" ? "Delivery Details" : "Pick-Up Details"} sub="— Almost There" />

              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                <div>
                  <label>Full Name</label>
                  <input type="text" placeholder="Your name" value={form.name}
                    onChange={e => setForm(f => ({...f, name:e.target.value}))} />
                </div>
                <div>
                  <label>Email Address</label>
                  <input type="email" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm(f => ({...f, email:e.target.value}))} />
                </div>
                <div>
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+1 (212) 555-0000" value={form.phone}
                    onChange={e => setForm(f => ({...f, phone:e.target.value}))} />
                </div>
                {fulfill === "delivery" && (
                  <div>
                    <label>Delivery Address</label>
                    <input type="text" placeholder="Street, City, ZIP" value={form.address}
                      onChange={e => setForm(f => ({...f, address:e.target.value}))} />
                  </div>
                )}
                <div>
                  <label>Special Instructions</label>
                  <textarea rows={3} placeholder="Allergies, preferences, occasion notes…" value={form.note}
                    onChange={e => setForm(f => ({...f, note:e.target.value}))}
                    style={{ resize:"none" }} />
                </div>
              </div>

              {/* Order summary pill */}
              <div style={{ marginTop:28, background:"var(--card)", border:"1px solid var(--border)", padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:11, color:"var(--muted)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:4 }}>{cartCount} items · {fulfill}</div>
                  <div className="font-display" style={{ fontSize:22, color:"var(--gold)", letterSpacing:".05em" }}>Total: ${orderTotal}</div>
                </div>
                <FiShoppingBag size={22} style={{ color:"var(--gold-dim)" }}/>
              </div>
            </div>
          )}

          {/* ── STEP 4: CONFIRMATION ── */}
          {step === 4 && (
            <div style={{ animation:"slideUp .4s ease both", textAlign:"center", paddingTop:24 }}>
              <StepBar />

              {/* Animated check */}
              <div className="confirm-check" style={{ margin:"32px auto", width:72, height:72 }}>
                <svg viewBox="0 0 72 72" fill="none">
                  <circle cx="36" cy="36" r="34" stroke="var(--gold)" strokeWidth="1" opacity=".4"/>
                  <circle cx="36" cy="36" r="34" stroke="var(--gold)" strokeWidth="1"
                    strokeDasharray="214" strokeDashoffset="214"
                    style={{ animation:"checkDraw .8s ease .1s forwards" }}/>
                  <path className="check-path" d="M22 36l10 10 18-20"
                    stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="50" strokeDashoffset="50"
                    style={{ animation:"checkDraw .5s ease .5s forwards" }}/>
                </svg>
              </div>

              <div style={{ marginBottom:8 }}>
                <Ornament width={80} opacity={0.4}/>
              </div>

              <h3 className="font-display" style={{ fontSize:36, fontWeight:300, color:"var(--gold-light)", letterSpacing:".1em", marginBottom:12 }}>
                Order Confirmed
              </h3>
              <p className="font-italic" style={{ fontSize:17, color:"var(--muted)", marginBottom:8, letterSpacing:".04em" }}>
                Thank you, {form.name || "valued guest"}.
              </p>
              <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.7, maxWidth:360, margin:"0 auto 32px" }}>
                Your order has been received. A confirmation will be sent to{" "}
                <span style={{ color:"var(--warm)" }}>{form.email || "your email"}</span>.{" "}
                {fulfill === "delivery" ? "Expected delivery: 45–60 minutes." : "Ready for pick-up in 30 minutes."}
              </p>

              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <button onClick={onClose} className="btn-gold">Back to Vesper</button>
                <button onClick={() => { setStep(1); setCart([]); setForm({name:"",email:"",phone:"",address:"",note:""}); }}
                  className="btn-ghost">Start a New Order</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {step !== 4 && (
          <div className="order-modal-footer">
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>

              {step > 1 && (
                <button className="btn-ghost" style={{ flexShrink:0, padding:"16px 20px" }}
                  onClick={() => setStep((step - 1) as 1|2|3|4)}>
                  ← Back
                </button>
              )}

              {step === 1 && (
                <button className="btn-gold"
                  disabled={cart.length === 0}
                  onClick={() => setStep(2)}
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}
                >
                  Review Order ({cartCount}) <FiChevronRight size={14}/>
                </button>
              )}

              {step === 2 && (
                <button className="btn-gold"
                  disabled={cart.length === 0}
                  onClick={() => setStep(3)}
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}
                >
                  Proceed to Details <FiChevronRight size={14}/>
                </button>
              )}

              {step === 3 && (
                <button className="btn-gold"
                  disabled={!form.name || !form.email || placing}
                  onClick={placeOrder}
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}
                >
                  {placing ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation:"spin .8s linear infinite" }}>
                        <circle cx="8" cy="8" r="6" stroke="var(--ink)" strokeWidth="2" fill="none" opacity=".3"/>
                        <path d="M8 2 A6 6 0 0 1 14 8" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      </svg>
                      Placing Order…
                    </>
                  ) : (
                    <>Place Order · ${orderTotal} <FiChevronRight size={14}/></>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════════ */
const Navbar = ({ onOrder }: { onOrder: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:50,
      padding: scrolled ? "14px 0" : "26px 0",
      background: scrolled ? "rgba(12,10,8,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "none",
      transition:"all .5s ease",
      animation:"fadeIn 1.2s ease both",
    }}>
      <div className="container" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>

        {/* Logo */}
        <a href="#" style={{ textDecoration:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <span className="font-display" style={{ fontSize:22, fontWeight:300, letterSpacing:".35em", color:"var(--gold-light)", textTransform:"uppercase" }}>Vesper</span>
          <span style={{ fontSize:8, letterSpacing:".4em", textTransform:"uppercase", color:"var(--gold-dim)", fontFamily:"Tenor Sans" }}>Fine Dining</span>
        </a>

        {/* Desktop links */}
        <div className="nav-hidden-mobile" style={{ alignItems:"center", gap:44 }}>
          {[["#menu","Menu"],["#about","Our Story"],["#reserve","Reserve"]].map(([href,label]) => (
            <a key={label} href={href} className="nav-link">{label}</a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="nav-hidden-mobile" style={{ alignItems:"center", gap:12 }}>
          <button onClick={onOrder} style={{
            background:"none", border:"1px solid rgba(201,168,76,.3)", cursor:"none",
            color:"var(--gold-dim)", fontFamily:"Tenor Sans", fontSize:10, letterSpacing:".22em",
            textTransform:"uppercase", padding:"9px 18px",
            display:"flex", alignItems:"center", gap:8,
            transition:"border-color .3s, color .3s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="var(--gold)"; (e.currentTarget as HTMLElement).style.color="var(--gold-light)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(201,168,76,.3)"; (e.currentTarget as HTMLElement).style.color="var(--gold-dim)"; }}
          >
            <FiShoppingBag size={12}/> Order Online
          </button>
          <a href="#reserve" style={{
            border:"1px solid var(--gold-dim)", color:"var(--gold-light)",
            fontFamily:"Tenor Sans", fontSize:10, letterSpacing:".25em",
            textTransform:"uppercase", padding:"10px 22px", textDecoration:"none",
            transition:"background .3s, color .3s", whiteSpace:"nowrap",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="var(--gold)"; (e.currentTarget as HTMLElement).style.color="#0C0A08"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.color="var(--gold-light)"; }}
          >
            Reserve a Table
          </a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="nav-show-mobile"
          style={{ background:"none", border:"none", cursor:"none", flexDirection:"column", gap:5, padding:4 }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display:"block", width:22, height:1, background:"var(--gold)",
              transition:"transform .3s, opacity .3s",
              transform: menuOpen
                ? i===0 ? "rotate(45deg) translate(3px,5px)"
                : i===2 ? "rotate(-45deg) translate(3px,-5px)" : "scaleX(0)"
                : "none",
              opacity: menuOpen && i===1 ? 0 : 1,
            }}/>
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      <div style={{
        maxHeight: menuOpen ? 300 : 0, overflow:"hidden",
        transition:"max-height .4s ease",
        background:"rgba(12,10,8,0.99)",
        borderTop: menuOpen ? "1px solid var(--border)" : "none",
      }}>
        <div style={{ padding:"24px var(--px)", display:"flex", flexDirection:"column", gap:20 }}>
          {[["#menu","Menu"],["#about","Our Story"],["#reserve","Reserve a Table"]].map(([href,label]) => (
            <a key={label} href={href} className="nav-link" style={{ fontSize:14 }} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <button onClick={() => { setMenuOpen(false); onOrder(); }} style={{
            background:"none", border:"1px solid rgba(201,168,76,.3)", cursor:"none",
            color:"var(--gold)", fontFamily:"Tenor Sans", fontSize:12, letterSpacing:".18em",
            textTransform:"uppercase", padding:"12px 20px", marginTop:4,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>
            <FiShoppingBag size={13}/> Order Online
          </button>
        </div>
      </div>
    </nav>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════ */
const Hero = ({ onOrder }: { onOrder: () => void }) => {
  const bgRef   = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (bgRef.current)   bgRef.current.style.transform   = `translateY(${y*.44}px)`;
      if (textRef.current) textRef.current.style.transform = `translateY(${y*.14}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section style={{ position:"relative", height:"100vh", minHeight:680, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
      {/* Bg */}
      <div ref={bgRef} style={{ position:"absolute", inset:"-20%", zIndex:0, background:`
        radial-gradient(ellipse 60% 70% at 50% 40%, rgba(201,168,76,.07) 0%, transparent 55%),
        radial-gradient(ellipse 40% 40% at 20% 70%, rgba(107,26,26,.15) 0%, transparent 50%),
        radial-gradient(ellipse 30% 50% at 80% 30%, rgba(107,26,26,.08) 0%, transparent 50%),
        linear-gradient(180deg, #0C0A08 0%, #111008 40%, #0e0b07 100%)
      `}}>
        {[{top:"20%",left:"15%",size:180,color:"rgba(201,168,76,.04)"},{top:"60%",left:"75%",size:240,color:"rgba(107,26,26,.08)"},{top:"40%",left:"50%",size:400,color:"rgba(201,168,76,.035)"}].map((o,i) => (
          <div key={i} style={{ position:"absolute", top:o.top, left:o.left, width:o.size, height:o.size, borderRadius:"50%", background:`radial-gradient(circle, ${o.color}, transparent 70%)`, transform:"translate(-50%,-50%)", animation:`flicker ${3+i}s ease-in-out infinite` }}/>
        ))}
        {[25,50,75].map(pct => (
          <div key={pct} style={{ position:"absolute", top:`${pct}%`, left:"5%", right:"5%", height:1, background:"linear-gradient(to right, transparent, rgba(201,168,76,.06), transparent)" }}/>
        ))}
      </div>

      {/* Content */}
      <div ref={textRef} style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 clamp(20px,5vw,60px)", maxWidth:900, width:"100%" }}>
        <div style={{ fontFamily:"Tenor Sans", fontSize:10, letterSpacing:".4em", textTransform:"uppercase", color:"var(--gold-dim)", marginBottom:28, animation:"fadeIn 1.6s ease .3s both" }}>
          Est. 2018 &nbsp;·&nbsp; New York City
        </div>
        <h1 className="font-display" style={{ fontSize:"clamp(68px,12vw,156px)", fontWeight:300, letterSpacing:".18em", lineHeight:.88, color:"var(--cream)", animation:"fadeUp 1.4s ease .5s both", textTransform:"uppercase" }}>
          Vesper
        </h1>
        <div style={{ display:"flex", justifyContent:"center", margin:"24px 0", animation:"fadeIn 1.4s ease .9s both" }}>
          <Ornament width={160} opacity={.6}/>
        </div>
        <p className="font-italic" style={{ fontSize:"clamp(17px,3vw,26px)", fontWeight:300, letterSpacing:".06em", color:"var(--warm)", opacity:.8, marginBottom:44, animation:"fadeUp 1.4s ease 1.1s both" }}>
          Where every evening becomes a memory.
        </p>

        {/* CTAs */}
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", animation:"fadeUp 1.4s ease 1.4s both" }}>
          <a href="#reserve" style={{
            background:"var(--gold)", color:"var(--ink)",
            fontFamily:"Tenor Sans", fontSize:11, letterSpacing:".25em",
            textTransform:"uppercase", padding:"16px 40px", textDecoration:"none",
            transition:"background .3s, transform .3s",
            animation:"goldPulse 3s ease-in-out infinite 2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="var(--gold-light)"; (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="var(--gold)"; (e.currentTarget as HTMLElement).style.transform="translateY(0)"; }}
          >
            Reserve Your Evening
          </a>
          <a href="#menu" style={{
            border:"1px solid rgba(201,168,76,.3)", color:"var(--warm)",
            fontFamily:"Tenor Sans", fontSize:11, letterSpacing:".25em",
            textTransform:"uppercase", padding:"16px 36px", textDecoration:"none",
            transition:"border-color .3s, color .3s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="var(--gold)"; (e.currentTarget as HTMLElement).style.color="var(--gold-light)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(201,168,76,.3)"; (e.currentTarget as HTMLElement).style.color="var(--warm)"; }}
          >
            View Menu
          </a>
          <button onClick={onOrder} style={{
            background:"none", border:"1px solid rgba(201,168,76,.2)", cursor:"none",
            color:"var(--muted)", fontFamily:"Tenor Sans", fontSize:11, letterSpacing:".22em",
            textTransform:"uppercase", padding:"16px 32px",
            display:"flex", alignItems:"center", gap:8,
            transition:"border-color .3s, color .3s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(201,168,76,.5)"; (e.currentTarget as HTMLElement).style.color="var(--warm)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(201,168,76,.2)"; (e.currentTarget as HTMLElement).style.color="var(--muted)"; }}
          >
            <FiShoppingBag size={14}/> Order Online
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:10, animation:"fadeIn 1.4s ease 2s both" }}>
        <span style={{ fontFamily:"Tenor Sans", fontSize:9, letterSpacing:".3em", textTransform:"uppercase", color:"var(--muted)" }}>Scroll</span>
        <div style={{ width:1, height:48, background:"linear-gradient(to bottom, var(--gold-dim), transparent)" }}/>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   DRIFT BANNER
═══════════════════════════════════════════════════════════════════ */
const DriftBanner = () => (
  <div style={{ overflow:"hidden", padding:"20px 0", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", background:"var(--obsidian)" }}>
    <div style={{ display:"flex", gap:80, animation:"drift 28s linear infinite", whiteSpace:"nowrap" }}>
      {[...Array(4)].map((_,i) => (
        <span key={i} style={{ display:"flex", gap:80, flexShrink:0 }}>
          {["Tasting Menu","·","Sommelier Selection","·","Private Dining","·","Seasonal Ingredients","·","Artisanal Cocktails","·"].map((t,j) => (
            <span key={j} className="font-display" style={{
              fontSize: t==="·" ? 18 : 13,
              fontStyle: t==="·" ? "normal" : "italic",
              letterSpacing: t==="·" ? 0 : ".12em",
              color: t==="·" ? "var(--gold-dim)" : "var(--muted)",
              fontWeight:300,
            }}>{t}</span>
          ))}
        </span>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MENU SECTION
═══════════════════════════════════════════════════════════════════ */
const menuData = [
  { course:"To Begin", items:[
    { name:"Caviar & Crème Fraîche", desc:"Oscietra caviar, blinis, chive-infused crème fraîche, lemon zest", price:"48" },
    { name:"Foie Gras Terrine",      desc:"Torchon of duck foie gras, brioche mouillette, fig preserve, Sauternes gelée", price:"38" },
    { name:"Scallop Crudo",          desc:"Hokkaido scallop, yuzu kosho, cucumber water, dill oil, trout roe", price:"32" },
  ]},
  { course:"The Main", items:[
    { name:"Wagyu Beef Tenderloin", desc:"A5 Miyazaki beef, black truffle jus, pomme soufflé, haricot verts, bordelaise", price:"145" },
    { name:"Turbot en Croûte",      desc:"Line-caught turbot, lobster mousseline, sauce nantaise, micro garden herbs", price:"98" },
    { name:"Rack of Lamb Provençal",desc:"Herb-crusted lamb, tapenade, ratatouille, lavender jus, crispy polenta", price:"88" },
  ]},
  { course:"To Finish", items:[
    { name:"Valrhona Chocolate Sphere", desc:"Dark chocolate, salted caramel, passion fruit, vanilla Chantilly", price:"22" },
    { name:"Tarte Tatin",               desc:"Caramelised Granny Smith apple, Calvados cream, buckwheat feuilletine", price:"18" },
    { name:"Artisan Cheese Trolley",    desc:"Selection of twelve European cheeses, house-made preserves, candied walnuts", price:"34" },
  ]},
];

const useVisible = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible: v };
};

const MenuSection = ({ onOrder }: { onOrder: () => void }) => {
  const { ref, visible } = useVisible(0.05);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="menu" ref={ref} className="section-pad" style={{ background:"var(--ink)" }}>
      <div className="container" style={{ maxWidth:940 }}>

        <div style={{ textAlign:"center", marginBottom:64, opacity:visible?1:0, transform:visible?"none":"translateY(30px)", transition:"opacity 1s, transform 1s" }}>
          <p style={{ fontFamily:"Tenor Sans", fontSize:10, letterSpacing:".35em", textTransform:"uppercase", color:"var(--gold-dim)", marginBottom:20 }}>— Curated Selections —</p>
          <h2 className="font-display" style={{ fontSize:"clamp(40px,7vw,78px)", fontWeight:300, letterSpacing:".12em", color:"var(--cream)", lineHeight:1, textTransform:"uppercase", marginBottom:24 }}>
            The Menu
          </h2>
          <Ornament width={140} opacity={.45}/>
          <p className="font-italic" style={{ marginTop:22, fontSize:15, color:"var(--muted)", letterSpacing:".04em" }}>
            Seasonal, ingredient-led cuisine. Menus change with the harvest.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", justifyContent:"center", borderBottom:"1px solid var(--border)", marginBottom:52, opacity:visible?1:0, transition:"opacity 1s ease .2s", overflowX:"auto" }}>
          {menuData.map((c,i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              background:"none", border:"none", cursor:"none",
              fontFamily:"Tenor Sans", fontSize:11, letterSpacing:".2em",
              textTransform:"uppercase", padding:"13px 28px",
              color: activeTab===i ? "var(--gold-light)" : "var(--muted)",
              borderBottom:`1px solid ${activeTab===i ? "var(--gold)" : "transparent"}`,
              transform:"translateY(1px)", transition:"color .3s, border-color .3s",
              whiteSpace:"nowrap",
            }}>
              {c.course}
            </button>
          ))}
        </div>

        {/* Items */}
        <div key={activeTab} style={{ animation:"fadeUp .5s ease both" }}>
          {menuData[activeTab].items.map((item,i) => (
            <div key={item.name} className="menu-item-line" style={{
              display:"grid", gridTemplateColumns:"1fr auto",
              gap:24, alignItems:"start",
              padding:"28px 0", borderBottom:"1px solid var(--border)",
              opacity:visible?1:0, transition:`opacity .7s ease ${i*.12}s`,
            }}>
              <div>
                <h3 className="font-display" style={{ fontSize:"clamp(20px,3vw,28px)", fontWeight:400, letterSpacing:".04em", color:"var(--cream)", marginBottom:8 }}>
                  {item.name}
                </h3>
                <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.7, letterSpacing:".03em", maxWidth:480 }}>{item.desc}</p>
              </div>
              <div style={{ textAlign:"right", paddingTop:4 }}>
                <span className="font-display" style={{ fontSize:20, color:"var(--gold)", letterSpacing:".06em" }}>${item.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tasting + Order CTA */}
        <div style={{ marginTop:60, textAlign:"center", opacity:visible?1:0, transition:"opacity 1s ease .6s" }}>
          <p className="font-italic" style={{ fontSize:16, color:"var(--muted)", marginBottom:28, letterSpacing:".04em" }}>
            Seven-course tasting menu available nightly — $220 per person
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="#reserve" style={{
              border:"1px solid var(--gold-dim)", color:"var(--gold)",
              fontFamily:"Tenor Sans", fontSize:10, letterSpacing:".25em",
              textTransform:"uppercase", padding:"14px 36px", textDecoration:"none",
              display:"inline-block", transition:"all .3s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="var(--gold)"; (e.currentTarget as HTMLElement).style.color="var(--ink)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.color="var(--gold)"; }}
            >
              Book the Tasting Experience
            </a>
            <button onClick={onOrder} style={{
              background:"var(--card)", border:"1px solid var(--border)", cursor:"none",
              color:"var(--warm)", fontFamily:"Tenor Sans", fontSize:10, letterSpacing:".22em",
              textTransform:"uppercase", padding:"14px 32px",
              display:"inline-flex", alignItems:"center", gap:8,
              transition:"border-color .3s, color .3s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="var(--gold-dim)"; (e.currentTarget as HTMLElement).style.color="var(--gold-light)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="var(--border)"; (e.currentTarget as HTMLElement).style.color="var(--warm)"; }}
            >
              <FiShoppingBag size={12}/> Order à la Carte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   AMBIENCE STRIP
═══════════════════════════════════════════════════════════════════ */
const AmbienceStrip = () => {
  const { ref, visible } = useVisible(0.2);
  const panels = [
    { label:"The Dining Room", sub:"Seats 42 guests",     detail:"Intimate candlelit tables beneath vaulted ceilings and original art." },
    { label:"Private Salon",   sub:"Up to 14 guests",     detail:"A dedicated sommelier and bespoke menus for your exclusive gatherings." },
    { label:"The Bar",         sub:"Open until midnight", detail:"A curated list of rare spirits, vintage Champagne, and artisan cocktails." },
  ];
  return (
    <section id="about" ref={ref} style={{ background:"var(--obsidian)", padding:"clamp(64px,8vw,100px) 0", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
      <div className="container">
        <div className="ambience-grid">
          {panels.map((p,i) => (
            <div key={i} style={{
              background:"var(--obsidian)", padding:"clamp(32px,5vw,56px) clamp(24px,4vw,48px)",
              opacity:visible?1:0, transform:visible?"none":"translateY(30px)",
              transition:`opacity .9s ease ${i*.18}s, transform .9s ease ${i*.18}s`,
            }}>
              <div style={{ width:28, height:1, background:"var(--gold-dim)", marginBottom:28 }}/>
              <h3 className="font-display" style={{ fontSize:"clamp(20px,2.5vw,26px)", fontWeight:400, color:"var(--cream)", letterSpacing:".06em", marginBottom:8 }}>{p.label}</h3>
              <p style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:"var(--gold-dim)", marginBottom:18 }}>{p.sub}</p>
              <p style={{ fontSize:14, color:"var(--muted)", lineHeight:1.75 }}>{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   RESERVATIONS
═══════════════════════════════════════════════════════════════════ */
const Reservations = () => {
  const { ref, visible } = useVisible(0.1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", date:"", time:"", guests:"", note:"" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    setForm(f => ({...f, [e.target.name]: e.target.value}));
  };

  return (
    <section id="reserve" ref={ref} className="section-pad" style={{ background:"var(--surface)", position:"relative", overflow:"hidden" }}>
      {/* Ghost text */}
      <div className="font-display" style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        fontSize:"clamp(140px,22vw,380px)",
        color:"transparent", WebkitTextStroke:"1px rgba(201,168,76,.035)",
        letterSpacing:".2em", whiteSpace:"nowrap",
        pointerEvents:"none", userSelect:"none", lineHeight:1, textTransform:"uppercase",
      }}>Reserve</div>

      <div className="container" style={{ maxWidth:800, position:"relative", zIndex:2 }}>
        <div style={{ textAlign:"center", marginBottom:64, opacity:visible?1:0, transform:visible?"none":"translateY(30px)", transition:"opacity 1s, transform 1s" }}>
          <p style={{ fontFamily:"Tenor Sans", fontSize:10, letterSpacing:".35em", textTransform:"uppercase", color:"var(--gold-dim)", marginBottom:20 }}>— Reservations —</p>
          <h2 className="font-display" style={{ fontSize:"clamp(40px,7vw,78px)", fontWeight:300, letterSpacing:".12em", color:"var(--cream)", textTransform:"uppercase", lineHeight:1, marginBottom:20 }}>
            Join Us
          </h2>
          <Ornament width={120} opacity={.4}/>
          <p className="font-italic" style={{ marginTop:20, fontSize:15, color:"var(--muted)" }}>
            We accept reservations up to 60 days in advance. Parties larger than 8, please contact us directly.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign:"center", padding:"64px 32px", border:"1px solid var(--border)", animation:"scaleIn .6s ease both" }}>
            <div style={{ marginBottom:24 }}><Ornament width={100} opacity={.5}/></div>
            <h3 className="font-display" style={{ fontSize:34, fontWeight:300, color:"var(--gold-light)", letterSpacing:".1em", marginBottom:14 }}>Your Table Awaits</h3>
            <p className="font-italic" style={{ fontSize:17, color:"var(--muted)" }}>
              A confirmation has been sent to {form.email}.<br/>We look forward to welcoming you.
            </p>
          </div>
        ) : (
          <div style={{ opacity:visible?1:0, transition:"opacity 1s ease .25s" }}>
            <div className="reserve-grid">
              <div className="span2" style={{ gridColumn:"span 2" }}>
                <label htmlFor="res-name">Full Name</label>
                <input id="res-name" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange}/>
              </div>
              <div className="span2" style={{ gridColumn:"span 2" }}>
                <label htmlFor="res-email">Email Address</label>
                <input id="res-email" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange}/>
              </div>
              <div>
                <label htmlFor="res-date">Preferred Date</label>
                <input id="res-date" name="date" type="date" value={form.date} onChange={handleChange} style={{ colorScheme:"dark" }}/>
              </div>
              <div>
                <label htmlFor="res-time">Preferred Time</label>
                <select id="res-time" name="time" value={form.time} onChange={handleChange}>
                  <option value="" disabled>Select a time</option>
                  {["6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="span2" style={{ gridColumn:"span 2" }}>
                <label htmlFor="res-guests">Number of Guests</label>
                <select id="res-guests" name="guests" value={form.guests} onChange={handleChange}>
                  <option value="" disabled>Select party size</option>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n}>{n} {n===1?"Guest":"Guests"}</option>)}
                </select>
              </div>
              <div className="span2" style={{ gridColumn:"span 2" }}>
                <label htmlFor="res-note">Special Requests</label>
                <textarea id="res-note" name="note" rows={3} placeholder="Dietary requirements, celebrations, allergies…" value={form.note} onChange={handleChange as any} style={{ resize:"none" }}/>
              </div>
            </div>

            <div style={{ textAlign:"center", marginTop:48 }}>
              <button onClick={() => { if(form.name && form.email && form.date) setSubmitted(true); }} style={{
                background:"var(--gold)", color:"var(--ink)",
                fontFamily:"Tenor Sans", fontSize:11, letterSpacing:".28em",
                textTransform:"uppercase", padding:"18px 56px",
                border:"none", cursor:"none", transition:"background .3s, transform .3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="var(--gold-light)"; (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="var(--gold)"; (e.currentTarget as HTMLElement).style.transform="translateY(0)"; }}
              >
                Request Reservation
              </button>
              <p style={{ marginTop:18, fontSize:12, color:"var(--muted)", letterSpacing:".05em" }}>
                Confirmed within 2 hours by email or phone.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════════ */
const Footer = ({ onOrder }: { onOrder: () => void }) => (
  <footer style={{ background:"var(--obsidian)", borderTop:"1px solid var(--border)", padding:"clamp(48px,7vw,72px) 0 36px" }}>
    <div className="container">
      <div className="footer-grid">

        {/* Brand */}
        <div>
          <div className="font-display" style={{ fontSize:24, fontWeight:300, letterSpacing:".35em", color:"var(--gold-light)", textTransform:"uppercase", marginBottom:6 }}>Vesper</div>
          <div style={{ fontSize:9, letterSpacing:".35em", textTransform:"uppercase", color:"var(--gold-dim)", marginBottom:20 }}>Fine Dining, New York</div>
          <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.8, marginBottom:24 }}>
            Crafted with intention.<br/>Served with grace.<br/>Remembered forever.
          </p>
          {/* Social icons */}
          <div style={{ display:"flex", gap:10 }}>
            {([
              [FaInstagram,   "Instagram"],
              [FaFacebookF,   "Facebook"],
              [FaTwitter,     "Twitter"],
              [MdOutlineTableRestaurant,   "OpenTable"],
            ] as const).map(([Icon, label]) => (
              <a key={label as string} href="#" aria-label={label as string} style={{
                width:32, height:32, border:"1px solid var(--border)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"var(--muted)", textDecoration:"none",
                transition:"border-color .3s, color .3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color="var(--gold-light)"; (e.currentTarget as HTMLElement).style.borderColor="var(--gold-dim)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color="var(--muted)"; (e.currentTarget as HTMLElement).style.borderColor="var(--border)"; }}
              >
                <Icon size={12}/>
              </a>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div>
          <p style={{ fontSize:10, letterSpacing:".25em", textTransform:"uppercase", color:"var(--gold-dim)", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
            <FiClock size={11}/> Hours
          </p>
          {[["Tue – Thu","6pm – 10pm"],["Fri – Sat","5pm – 11pm"],["Sunday","5pm – 9pm"],["Monday","Closed"]].map(([day,time]) => (
            <div key={day} style={{ display:"flex", justifyContent:"space-between", gap:12, marginBottom:10, fontSize:13 }}>
              <span style={{ color:"var(--muted)" }}>{day}</span>
              <span style={{ color:"var(--warm)" }}>{time}</span>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p style={{ fontSize:10, letterSpacing:".25em", textTransform:"uppercase", color:"var(--gold-dim)", marginBottom:18 }}>Contact</p>
          {[
            [FiMapPin, "18 West 29th Street, New York, NY 10001"],
            [FiPhone,  "+1 (212) 555-0182"],
            [FiMail,   "reserve@vespernyc.com"],
          ].map(([Icon, val]) => (
            <div key={val as string} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:14 }}>
              <Icon size={12} style={{ color:"var(--gold-dim)", marginTop:2, flexShrink:0 }}/>
              <span style={{ fontSize:13, color:"var(--warm)", lineHeight:1.6 }}>{val as string}</span>
            </div>
          ))}
        </div>

        {/* Order online CTA */}
        <div>
          <p style={{ fontSize:10, letterSpacing:".25em", textTransform:"uppercase", color:"var(--gold-dim)", marginBottom:18 }}>Dine With Us</p>
          <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.75, marginBottom:20 }}>
            Reserve a table or order your favourite dishes to enjoy at home.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <a href="#reserve" style={{
              border:"1px solid var(--gold-dim)", color:"var(--gold)",
              fontFamily:"Tenor Sans", fontSize:10, letterSpacing:".2em",
              textTransform:"uppercase", padding:"11px 20px", textDecoration:"none",
              textAlign:"center", transition:"background .3s, color .3s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="var(--gold)"; (e.currentTarget as HTMLElement).style.color="var(--ink)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.color="var(--gold)"; }}
            >
              Reserve a Table
            </a>
            <button onClick={onOrder} style={{
              background:"var(--card)", border:"1px solid var(--border)", cursor:"none",
              color:"var(--warm)", fontFamily:"Tenor Sans", fontSize:10, letterSpacing:".2em",
              textTransform:"uppercase", padding:"11px 20px",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              transition:"border-color .3s, color .3s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="var(--gold-dim)"; (e.currentTarget as HTMLElement).style.color="var(--gold-light)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="var(--border)"; (e.currentTarget as HTMLElement).style.color="var(--warm)"; }}
            >
              <FiShoppingBag size={11}/> Order Online
            </button>
          </div>
        </div>
      </div>

      <div style={{ borderTop:"1px solid var(--border)", paddingTop:28, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:12 }}>
        <p style={{ fontSize:11, color:"var(--muted)", letterSpacing:".08em" }}>© 2025 Vesper Fine Dining. All rights reserved.</p>
        <p className="font-italic" style={{ fontSize:13, color:"var(--gold-dim)" }}>The art of the table.</p>
      </div>
    </div>
  </footer>
);

/* ═══════════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════════ */
export default function RestaurantLanding() {
  const [orderOpen, setOrderOpen] = useState(false);

  const openOrder  = useCallback(() => { setOrderOpen(true);  document.body.classList.add("modal-open"); }, []);
  const closeOrder = useCallback(() => { setOrderOpen(false); document.body.classList.remove("modal-open"); }, []);

  return (
    <>
      <GlobalStyles />
      <Cursor />
      <Navbar onOrder={openOrder} />
      <main>
        <Hero onOrder={openOrder} />
        <DriftBanner />
        <MenuSection onOrder={openOrder} />
        <AmbienceStrip />
        <Reservations />
      </main>
      <Footer onOrder={openOrder} />
      {orderOpen && <OrderModal onClose={closeOrder} />}
    </>
  );
}