import { useState } from "react";
import {
  FiShoppingBag, FiX, FiPlus, FiMinus, FiChevronRight, FiCheck,
  FiTruck, FiPackage, FiArrowLeft,
} from "react-icons/fi";

/* ─── Types (mirror from parent file) ──────────────────────────────────────── */
type OrderItem  = { id: string; name: string; desc: string; price: number; category: string };
type CartEntry  = { item: OrderItem; qty: number };

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const ORDER_MENU: OrderItem[] = [
  { id:"s1", category:"Starters", name:"Caviar & Crème Fraîche",    price:48,  desc:"Oscietra caviar, blinis, chive crème fraîche, lemon zest" },
  { id:"s2", category:"Starters", name:"Foie Gras Terrine",          price:38,  desc:"Duck foie gras, brioche mouillette, fig preserve, Sauternes gelée" },
  { id:"s3", category:"Starters", name:"Scallop Crudo",              price:32,  desc:"Hokkaido scallop, yuzu kosho, cucumber water, dill oil, trout roe" },
  { id:"m1", category:"Mains",    name:"Wagyu Beef Tenderloin",      price:145, desc:"A5 Miyazaki beef, black truffle jus, pomme soufflé, bordelaise" },
  { id:"m2", category:"Mains",    name:"Turbot en Croûte",           price:98,  desc:"Line-caught turbot, lobster mousseline, sauce nantaise" },
  { id:"m3", category:"Mains",    name:"Rack of Lamb Provençal",     price:88,  desc:"Herb-crusted lamb, tapenade, ratatouille, lavender jus" },
  { id:"d1", category:"Desserts", name:"Valrhona Chocolate Sphere",  price:22,  desc:"Dark chocolate, salted caramel, passion fruit, vanilla Chantilly" },
  { id:"d2", category:"Desserts", name:"Tarte Tatin",                price:18,  desc:"Caramelised Granny Smith, Calvados cream, buckwheat feuilletine" },
  { id:"d3", category:"Desserts", name:"Artisan Cheese Trolley",     price:34,  desc:"Twelve European cheeses, house preserves, candied walnuts" },
  { id:"w1", category:"Drinks",   name:"Sommelier Wine Pairing",     price:95,  desc:"Five curated pours selected to complement your meal" },
  { id:"w2", category:"Drinks",   name:"Artisan Cocktail",           price:22,  desc:"Chef's signature seasonal creation, crafted tableside" },
  { id:"w3", category:"Drinks",   name:"Non-Alcoholic Pairing",      price:45,  desc:"House-pressed juices and botanical infusions" },
];

/* ─── Ornament ──────────────────────────────────────────────────────────────── */
const Ornament = ({ width = 80, opacity = 0.4 }: { width?: number; opacity?: number }) => (
  <svg width={width} viewBox="0 0 200 20" fill="none" style={{ opacity, display:"block", margin:"0 auto" }}>
    <line x1="0"   y1="10" x2="80"  y2="10" stroke="#C9A84C" strokeWidth="0.5"/>
    <circle cx="90"  cy="10" r="3"  stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
    <circle cx="100" cy="10" r="5"  stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
    <circle cx="110" cy="10" r="3"  stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
    <line x1="120" y1="10" x2="200" y2="10" stroke="#C9A84C" strokeWidth="0.5"/>
  </svg>
);

/* ─── Styles ─────────────────────────────────────────────────────────────────
   All rules are self-contained — no dependency on the parent file's stylesheet.
   Media queries handle mobile layout.
────────────────────────────────────────────────────────────────────────────── */
const ModalStyles = () => (
  <style>{`
    /* ── Reset inside modal ── */
    .om *, .om *::before, .om *::after { box-sizing: border-box; }

    /* ── Overlay ── */
    .om-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(8,6,4,.88);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: stretch;
      justify-content: flex-end;
      animation: om-fadeIn .3s ease both;
    }

    /* ── Panel ── */
    .om-panel {
      width: 100%;
      max-width: 540px;
      background: #181510;
      border-left: 1px solid #2E2920;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: om-slideIn .38s ease both;
    }

    /* ── Mobile: bottom sheet ── */
    @media (max-width: 600px) {
      .om-overlay  { align-items: flex-end; }
      .om-panel    {
        max-width: 100%;
        max-height: 92dvh;          /* dynamic viewport height avoids browser chrome */
        border-left: none;
        border-top: 1px solid #2E2920;
        border-radius: 16px 16px 0 0;
      }
    }

    /* ── Drag handle (mobile only) ── */
    .om-handle {
      display: none;
      width: 36px; height: 4px;
      background: #2E2920; border-radius: 2px;
      margin: 12px auto 0;
      flex-shrink: 0;
    }
    @media (max-width: 600px) { .om-handle { display: block; } }

    /* ── Header ── */
    .om-header {
      padding: 20px 20px 20px 24px;
      border-bottom: 1px solid #2E2920;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-shrink: 0;
      min-height: 0; /* prevent flex overflow */
    }
    .om-header-left  { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .om-header-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

    .om-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px; font-weight: 300;
      letter-spacing: .14em; color: #E2C97E;
      text-transform: uppercase;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .om-subtitle {
      font-family: 'Tenor Sans', sans-serif;
      font-size: 10px; letter-spacing: .14em; color: #7A7060;
      white-space: nowrap;
    }

    /* Cart pill in header */
    .om-cart-pill {
      background: none;
      border: 1px solid #7A6330;
      cursor: none;
      color: #C9A84C;
      font-family: 'Tenor Sans', sans-serif;
      font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
      padding: 7px 14px;
      display: flex; align-items: center; gap: 6px;
      white-space: nowrap;
      transition: background .3s, color .3s;
      /* minimum tap target */
      min-height: 36px;
    }
    .om-cart-pill:hover { background: #C9A84C; color: #0C0A08; }

    /* Close button — always clearly visible */
    .om-close {
      background: none; border: none; cursor: none;
      color: #7A7060;
      display: flex; align-items: center; justify-content: center;
      /* large enough tap target on mobile */
      width: 40px; height: 40px;
      border-radius: 0;
      flex-shrink: 0;
      transition: color .25s, background .25s;
    }
    .om-close:hover { color: #F2EDE3; background: rgba(255,255,255,.04); }

    /* ── Step bar ── */
    .om-stepbar {
      display: flex; align-items: center;
      margin-bottom: 28px;
      gap: 0;
    }
    .om-step {
      display: flex; align-items: center; gap: 7px;
      font-family: 'Tenor Sans', sans-serif;
      font-size: 10px; letter-spacing: .16em; text-transform: uppercase;
      color: #7A7060;
      white-space: nowrap;
    }
    .om-step.active { color: #E2C97E; }
    .om-step.done   { color: #7A6330; }
    .om-step-num {
      width: 22px; height: 22px; border-radius: 50%;
      border: 1px solid currentColor;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; flex-shrink: 0;
    }
    .om-step-label {
      /* hide labels on very small screens, show numbers only */
    }
    @media (max-width: 400px) { .om-step-label { display: none; } }
    .om-step-divider {
      flex: 1; height: 1px; background: #2E2920;
      margin: 0 6px; min-width: 8px;
    }

    /* ── Scrollable body ── */
    .om-body {
      flex: 1; overflow-y: auto;
      padding: 24px;
      /* momentum scrolling on iOS */
      -webkit-overflow-scrolling: touch;
    }
    .om-body::-webkit-scrollbar { width: 2px; }
    .om-body::-webkit-scrollbar-thumb { background: #7A6330; }

    @media (max-width: 600px) { .om-body { padding: 20px 16px; } }

    /* ── Section header ── */
    .om-sec-eyebrow {
      font-family: 'Tenor Sans', sans-serif;
      font-size: 10px; letter-spacing: .28em; text-transform: uppercase;
      color: #7A6330; margin-bottom: 6px;
    }
    .om-sec-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(22px, 5vw, 32px);
      font-weight: 300; letter-spacing: .07em; color: #F2EDE3;
      line-height: 1; margin-bottom: 24px;
    }

    /* ── Category tabs ── */
    .om-tabs {
      display: flex; border-bottom: 1px solid #2E2920;
      margin-bottom: 20px; overflow-x: auto;
      /* hide scrollbar */
      scrollbar-width: none;
    }
    .om-tabs::-webkit-scrollbar { display: none; }
    .om-tab {
      background: none; border: none; cursor: none;
      font-family: 'Tenor Sans', sans-serif;
      font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
      padding: 10px 16px; color: #7A7060;
      border-bottom: 1px solid transparent;
      transform: translateY(1px);
      transition: color .3s, border-color .3s;
      white-space: nowrap;
      flex-shrink: 0;
      /* tap target */
      min-height: 40px;
    }
    .om-tab.active { color: #E2C97E; border-bottom-color: #C9A84C; }

    /* ── Menu item card ── */
    .om-item-card {
      border: 1px solid #2E2920;
      padding: 16px;
      margin-bottom: 10px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: center;
      transition: border-color .3s;
      cursor: none;
    }
    .om-item-card.selected { border-color: #C9A84C; background: rgba(201,168,76,.04); }
    .om-item-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(15px, 3.5vw, 18px);
      font-weight: 400; color: #F2EDE3; letter-spacing: .03em;
    }
    .om-item-desc {
      font-size: 12px; color: #7A7060;
      line-height: 1.55; margin: 4px 0 6px;
    }
    .om-item-price {
      font-family: 'Cormorant Garamond', serif;
      font-size: 15px; color: #C9A84C; letter-spacing: .05em;
    }
    .om-qty-badge {
      font-size: 10px; background: #C9A84C; color: #0C0A08;
      padding: 2px 7px; letter-spacing: .1em; margin-left: 8px;
    }

    /* ── Add / qty controls ── */
    .om-add-btn {
      background: none; border: 1px solid #7A6330; cursor: none;
      color: #C9A84C; width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      transition: background .3s, color .3s;
      flex-shrink: 0;
    }
    .om-add-btn:hover { background: #C9A84C; color: #0C0A08; }
    .om-qty-row { display: flex; align-items: center; gap: 10px; }
    .om-qty-btn {
      width: 32px; height: 32px; border: 1px solid #2E2920;
      background: none; color: #F2EDE3; cursor: none;
      display: flex; align-items: center; justify-content: center;
      transition: border-color .2s, color .2s; flex-shrink: 0;
      /* touch */
      min-width: 32px;
    }
    .om-qty-btn:hover { border-color: #C9A84C; color: #C9A84C; }
    .om-qty-val { font-size: 14px; color: #F2EDE3; min-width: 18px; text-align: center; }

    /* ── Fulfillment toggle ── */
    .om-fulfill {
      display: flex; border: 1px solid #2E2920;
      margin-bottom: 24px; overflow: hidden;
    }
    .om-fulfill-btn {
      flex: 1; padding: 12px 8px;
      background: none; border: none; cursor: none;
      font-family: 'Tenor Sans', sans-serif;
      font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
      color: #7A7060;
      display: flex; align-items: center; justify-content: center; gap: 7px;
      transition: background .3s, color .3s;
      min-height: 44px;
    }
    .om-fulfill-btn.active { background: #C9A84C; color: #0C0A08; }

    /* ── Cart rows ── */
    .om-cart-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px; align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid #2E2920;
    }
    /* on very narrow screens, stack vertically */
    @media (max-width: 360px) {
      .om-cart-row { grid-template-columns: 1fr; gap: 8px; }
    }
    .om-cart-row-name   { font-size: 14px; color: #F2EDE3; margin-bottom: 2px; }
    .om-cart-row-price  { font-size: 12px; color: #7A7060; }
    .om-cart-row-right  { display: flex; align-items: center; gap: 10px; }
    .om-line-total {
      font-family: 'Cormorant Garamond', serif;
      font-size: 16px; color: #C9A84C; min-width: 44px; text-align: right;
    }

    /* ── Order summary ── */
    .om-summary { margin-top: 20px; padding: 18px 0; }
    .om-summary-row {
      display: flex; justify-content: space-between;
      font-size: 13px; color: #7A7060; margin-bottom: 8px;
    }
    .om-summary-total {
      display: flex; justify-content: space-between;
      margin-top: 14px; padding-top: 14px;
      border-top: 1px solid #2E2920;
    }
    .om-total-label { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #F2EDE3; letter-spacing: .05em; }
    .om-total-val   { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #C9A84C; letter-spacing: .05em; }

    /* ── Detail form ── */
    .om-form { display: flex; flex-direction: column; gap: 24px; }
    .om-label {
      display: block; font-size: 10px; letter-spacing: .24em;
      text-transform: uppercase; color: #7A6330; margin-bottom: 6px;
    }
    .om-input, .om-textarea {
      background: transparent; border: none;
      border-bottom: 1px solid #2E2920;
      color: #F2EDE3;
      font-family: 'Tenor Sans', sans-serif;
      font-size: 14px; letter-spacing: .07em;
      padding: 10px 4px; width: 100%; outline: none;
      transition: border-color .3s;
      /* prevent iOS zoom on focus (font-size ≥ 16px) */
      font-size: max(16px, 14px);
    }
    .om-input::placeholder, .om-textarea::placeholder { color: #7A7060; }
    .om-input:focus, .om-textarea:focus { border-bottom-color: #C9A84C; }
    .om-textarea { resize: none; }

    /* ── Order pill ── */
    .om-pill {
      margin-top: 24px; background: #1E1A14;
      border: 1px solid #2E2920; padding: 14px 18px;
      display: flex; justify-content: space-between; align-items: center;
      gap: 12px;
    }
    .om-pill-meta  { font-size: 11px; color: #7A7060; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 4px; }
    .om-pill-total { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #C9A84C; letter-spacing: .05em; }

    /* ── Confirmation ── */
    .om-confirm { text-align: center; padding-top: 16px; }
    .om-confirm-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(26px, 6vw, 34px);
      font-weight: 300; color: #E2C97E; letter-spacing: .1em; margin-bottom: 10px;
    }
    .om-confirm-sub {
      font-family: 'Cormorant', serif; font-style: italic;
      font-size: 16px; color: #7A7060; letter-spacing: .04em; margin-bottom: 8px;
    }
    .om-confirm-body {
      font-size: 13px; color: #7A7060; line-height: 1.75;
      max-width: 320px; margin: 0 auto 28px;
    }

    /* ── Empty cart state ── */
    .om-empty { text-align: center; padding: 44px 0; }
    .om-empty p { font-size: 13px; color: #7A7060; margin-top: 12px; }

    /* ── Buttons ── */
    .om-btn-gold {
      background: #C9A84C; color: #0C0A08;
      font-family: 'Tenor Sans', sans-serif;
      font-size: 11px; letter-spacing: .24em; text-transform: uppercase;
      padding: 15px 20px; border: none; cursor: none;
      width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: background .3s, transform .2s;
      min-height: 48px;
    }
    .om-btn-gold:hover  { background: #E2C97E; transform: translateY(-1px); }
    .om-btn-gold:disabled { opacity: .4; pointer-events: none; }

    .om-btn-ghost {
      background: transparent; color: #D4C9B0;
      font-family: 'Tenor Sans', sans-serif;
      font-size: 11px; letter-spacing: .2em; text-transform: uppercase;
      padding: 14px 20px; border: 1px solid #2E2920; cursor: none;
      transition: border-color .3s, color .3s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 48px;
    }
    .om-btn-ghost:hover { border-color: #7A6330; color: #E2C97E; }

    /* ── Footer bar ── */
    .om-footer {
      padding: 16px 20px;
      border-top: 1px solid #2E2920;
      flex-shrink: 0;
      background: #1E1A14;
    }
    .om-footer-row { display: flex; gap: 10px; align-items: stretch; }

    /* ── Animations ── */
    @keyframes om-fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes om-slideIn  { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
    @keyframes om-slideUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes om-spin     { to { transform: rotate(360deg); } }
    @keyframes om-checkCircle {
      from { stroke-dashoffset: 214; }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes om-checkMark {
      from { stroke-dashoffset: 50; }
      to   { stroke-dashoffset: 0; }
    }

    @media (max-width: 600px) {
      @keyframes om-slideIn { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
    }

    .om-anim { animation: om-slideUp .35s ease both; }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export const OrderModal = ({ onClose }: { onClose: () => void }) => {
  const [step,     setStep]     = useState<1|2|3|4>(1);
  const [cart,     setCart]     = useState<CartEntry[]>([]);
  const [category, setCat]      = useState("Starters");
  const [fulfill,  setFulfill]  = useState<"delivery"|"pickup">("delivery");
  const [form,     setForm]     = useState({ name:"", email:"", phone:"", address:"", note:"" });
  const [placing,  setPlacing]  = useState(false);

  const categories = ["Starters","Mains","Desserts","Drinks"];
  const filtered   = ORDER_MENU.filter(i => i.category === category);
  const cartTotal  = cart.reduce((s,e) => s + e.item.price * e.qty, 0);
  const cartCount  = cart.reduce((s,e) => s + e.qty, 0);
  const deliveryFee = fulfill === "delivery" ? 8 : 0;
  const orderTotal  = cartTotal + deliveryFee;

  const addItem = (item: OrderItem) =>
    setCart(c => {
      const found = c.find(e => e.item.id === item.id);
      return found
        ? c.map(e => e.item.id === item.id ? { ...e, qty: e.qty + 1 } : e)
        : [...c, { item, qty: 1 }];
    });

  const removeItem = (id: string) =>
    setCart(c => {
      const found = c.find(e => e.item.id === id);
      if (!found) return c;
      return found.qty <= 1
        ? c.filter(e => e.item.id !== id)
        : c.map(e => e.item.id === id ? { ...e, qty: e.qty - 1 } : e);
    });

  const qtyOf = (id: string) => cart.find(e => e.item.id === id)?.qty ?? 0;

  const placeOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    setPlacing(false);
    setStep(4);
  };

  /* ── Step bar ── */
  const StepBar = () => (
    <div className="om-stepbar">
      {(["Menu","Cart","Details","Done"] as const).map((label, i) => {
        const num   = (i + 1) as 1|2|3|4;
        const state = step > num ? "done" : step === num ? "active" : "";
        return (
          <div key={label} style={{ display:"flex", alignItems:"center", flex: i < 3 ? 1 : "none", minWidth:0 }}>
            <div className={`om-step ${state}`} style={{ minWidth:0 }}>
              <div className="om-step-num" aria-label={`Step ${num}`}>
                {step > num ? <FiCheck size={10}/> : num}
              </div>
              <span className="om-step-label">{label}</span>
            </div>
            {i < 3 && <div className="om-step-divider"/>}
          </div>
        );
      })}
    </div>
  );

  /* ── Section header ── */
  const SHeader = ({ title, sub }: { title: string; sub: string }) => (
    <div>
      <p className="om-sec-eyebrow">{sub}</p>
      <h3 className="om-sec-title">{title}</h3>
    </div>
  );

  return (
    <>
      <ModalStyles/>

      <div className="om om-overlay" onClick={e => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label="Online Order">

        <div className="om-panel">

          {/* Drag handle — mobile only */}
          <div className="om-handle" aria-hidden="true"/>

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="om-header">
            <div className="om-header-left">
              <div className="om-title">Order Online</div>
              <div className="om-subtitle">Vesper Fine Dining · Est. 2018</div>
            </div>

            <div className="om-header-right">
              {/* Cart pill: only on step 1 when cart has items */}
              {cartCount > 0 && step === 1 && (
                <button className="om-cart-pill" onClick={() => setStep(2)} aria-label={`View cart, ${cartCount} items`}>
                  <FiShoppingBag size={12}/> {cartCount}
                </button>
              )}

              {/* Close — always rightmost, always a generous tap target */}
              <button className="om-close" onClick={onClose} aria-label="Close order panel">
                <FiX size={20}/>
              </button>
            </div>
          </div>

          {/* ── Body ───────────────────────────────────────────────────── */}
          <div className="om-body">

            {/* ── STEP 1: MENU ── */}
            {step === 1 && (
              <div className="om-anim">
                <StepBar/>
                <SHeader title="Select Your Dishes" sub="— Curated Menu"/>

                {/* Category tabs */}
                <div className="om-tabs" role="tablist">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`om-tab ${category === cat ? "active" : ""}`}
                      onClick={() => setCat(cat)}
                      role="tab"
                      aria-selected={category === cat}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Items */}
                {filtered.map(item => {
                  const qty = qtyOf(item.id);
                  return (
                    <div key={item.id} className={`om-item-card ${qty > 0 ? "selected" : ""}`}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:4 }}>
                          <span className="om-item-name">{item.name}</span>
                          {qty > 0 && <span className="om-qty-badge">{qty}</span>}
                        </div>
                        <p className="om-item-desc">{item.desc}</p>
                        <span className="om-item-price">${item.price}</span>
                      </div>

                      <div style={{ flexShrink:0 }}>
                        {qty === 0 ? (
                          <button className="om-add-btn" onClick={() => addItem(item)} aria-label={`Add ${item.name}`}>
                            <FiPlus size={14}/>
                          </button>
                        ) : (
                          <div className="om-qty-row">
                            <button className="om-qty-btn" onClick={() => removeItem(item.id)} aria-label="Decrease quantity"><FiMinus size={11}/></button>
                            <span className="om-qty-val">{qty}</span>
                            <button className="om-qty-btn" onClick={() => addItem(item)} aria-label="Increase quantity"><FiPlus size={11}/></button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {cart.length === 0 && (
                  <p style={{ fontSize:13, color:"#7A7060", textAlign:"center", marginTop:20, fontStyle:"italic" }}>
                    Add dishes to begin your order
                  </p>
                )}
              </div>
            )}

            {/* ── STEP 2: CART ── */}
            {step === 2 && (
              <div className="om-anim">
                <StepBar/>
                <SHeader title="Your Order" sub="— Review & Adjust"/>

                {/* Fulfillment toggle */}
                <div className="om-fulfill" role="group" aria-label="Fulfilment method">
                  <button
                    className={`om-fulfill-btn ${fulfill === "delivery" ? "active" : ""}`}
                    onClick={() => setFulfill("delivery")}
                  >
                    <FiTruck size={13}/> Delivery
                  </button>
                  <button
                    className={`om-fulfill-btn ${fulfill === "pickup" ? "active" : ""}`}
                    onClick={() => setFulfill("pickup")}
                  >
                    <FiPackage size={13}/> Pick Up
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="om-empty">
                    <FiShoppingBag size={28} color="#7A7060"/>
                    <p>Your cart is empty</p>
                    <button className="om-btn-ghost" onClick={() => setStep(1)} style={{ marginTop:16, width:"auto", padding:"12px 28px" }}>
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <>
                    {cart.map(({ item, qty }) => (
                      <div key={item.id} className="om-cart-row">
                        <div>
                          <div className="om-cart-row-name">{item.name}</div>
                          <div className="om-cart-row-price">${item.price} each</div>
                        </div>
                        <div className="om-cart-row-right">
                          <div className="om-qty-row">
                            <button className="om-qty-btn" onClick={() => removeItem(item.id)} aria-label="Decrease"><FiMinus size={11}/></button>
                            <span className="om-qty-val">{qty}</span>
                            <button className="om-qty-btn" onClick={() => addItem(item)} aria-label="Increase"><FiPlus size={11}/></button>
                          </div>
                          <span className="om-line-total">${item.price * qty}</span>
                        </div>
                      </div>
                    ))}

                    <div className="om-summary">
                      <div className="om-summary-row"><span>Subtotal</span><span>${cartTotal}</span></div>
                      {fulfill === "delivery" && (
                        <div className="om-summary-row"><span>Delivery</span><span>${deliveryFee}</span></div>
                      )}
                      <div className="om-summary-total">
                        <span className="om-total-label">Total</span>
                        <span className="om-total-val">${orderTotal}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── STEP 3: DETAILS ── */}
            {step === 3 && (
              <div className="om-anim">
                <StepBar/>
                <SHeader
                  title={fulfill === "delivery" ? "Delivery Details" : "Pick-Up Details"}
                  sub="— Almost There"
                />

                <div className="om-form">
                  <div>
                    <label className="om-label">Full Name</label>
                    <input className="om-input" type="text" placeholder="Your name"
                      value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="om-label">Email Address</label>
                    <input className="om-input" type="email" placeholder="your@email.com"
                      value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                      autoComplete="email" inputMode="email"
                    />
                  </div>
                  <div>
                    <label className="om-label">Phone Number</label>
                    <input className="om-input" type="tel" placeholder="+1 (212) 555-0000"
                      value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                      autoComplete="tel" inputMode="tel"
                    />
                  </div>
                  {fulfill === "delivery" && (
                    <div>
                      <label className="om-label">Delivery Address</label>
                      <input className="om-input" type="text" placeholder="Street, City, ZIP"
                        value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))}
                        autoComplete="street-address"
                      />
                    </div>
                  )}
                  <div>
                    <label className="om-label">Special Instructions</label>
                    <textarea className="om-textarea" rows={3}
                      placeholder="Allergies, preferences, occasion notes…"
                      value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))}
                    />
                  </div>
                </div>

                {/* Order summary pill */}
                <div className="om-pill">
                  <div>
                    <div className="om-pill-meta">{cartCount} item{cartCount !== 1 ? "s" : ""} · {fulfill}</div>
                    <div className="om-pill-total">Total: ${orderTotal}</div>
                  </div>
                  <FiShoppingBag size={20} color="#7A6330"/>
                </div>
              </div>
            )}

            {/* ── STEP 4: CONFIRMATION ── */}
            {step === 4 && (
              <div className="om-anim om-confirm">
                <StepBar/>

                {/* Animated SVG checkmark */}
                <div style={{ margin:"28px auto 16px", width:68, height:68 }}>
                  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
                    <circle cx="36" cy="36" r="34" stroke="#C9A84C" strokeWidth="1" opacity=".3"/>
                    <circle cx="36" cy="36" r="34" stroke="#C9A84C" strokeWidth="1"
                      strokeDasharray="214" strokeDashoffset="214"
                      style={{ animation:"om-checkCircle .8s ease .1s forwards" }}
                    />
                    <path d="M22 36l10 10 18-20"
                      stroke="#C9A84C" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="50" strokeDashoffset="50"
                      style={{ animation:"om-checkMark .5s ease .6s forwards" }}
                    />
                  </svg>
                </div>

                <div style={{ marginBottom:16 }}><Ornament width={80} opacity={.4}/></div>

                <h3 className="om-confirm-title">Order Confirmed</h3>
                <p className="om-confirm-sub">Thank you, {form.name || "valued guest"}.</p>
                <p className="om-confirm-body">
                  Your order has been received. A confirmation will be sent to{" "}
                  <span style={{ color:"#D4C9B0" }}>{form.email || "your email"}</span>.{" "}
                  {fulfill === "delivery"
                    ? "Expected delivery in 45–60 minutes."
                    : "Ready for pick-up in approximately 30 minutes."}
                </p>

                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <button className="om-btn-gold" onClick={onClose}>Back to Vesper</button>
                  <button className="om-btn-ghost" onClick={() => {
                    setStep(1); setCart([]);
                    setForm({ name:"", email:"", phone:"", address:"", note:"" });
                  }}>
                    Start a New Order
                  </button>
                </div>
              </div>
            )}
          </div>{/* /om-body */}

          {/* ── Footer CTA ─────────────────────────────────────────────── */}
          {step !== 4 && (
            <div className="om-footer">
              <div className="om-footer-row">

                {/* Back button */}
                {step > 1 && (
                  <button
                    className="om-btn-ghost"
                    style={{ flexShrink:0, width:"auto", padding:"0 18px" }}
                    onClick={() => setStep((step - 1) as 1|2|3|4)}
                    aria-label="Go back"
                  >
                    <FiArrowLeft size={14}/>
                  </button>
                )}

                {step === 1 && (
                  <button className="om-btn-gold" disabled={cart.length === 0} onClick={() => setStep(2)}>
                    Review Order ({cartCount}) <FiChevronRight size={13}/>
                  </button>
                )}

                {step === 2 && (
                  <button className="om-btn-gold" disabled={cart.length === 0} onClick={() => setStep(3)}>
                    Proceed to Details <FiChevronRight size={13}/>
                  </button>
                )}

                {step === 3 && (
                  <button
                    className="om-btn-gold"
                    disabled={!form.name || !form.email || placing}
                    onClick={placeOrder}
                  >
                    {placing ? (
                      <>
                        <svg width="15" height="15" viewBox="0 0 16 16" style={{ animation:"om-spin .7s linear infinite", flexShrink:0 }}>
                          <circle cx="8" cy="8" r="6" stroke="#0C0A08" strokeWidth="2" fill="none" opacity=".3"/>
                          <path d="M8 2 A6 6 0 0 1 14 8" stroke="#0C0A08" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        </svg>
                        Placing Order…
                      </>
                    ) : (
                      <>Place Order · ${orderTotal} <FiChevronRight size={13}/></>
                    )}
                  </button>
                )}

              </div>
            </div>
          )}

        </div>{/* /om-panel */}
      </div>{/* /om-overlay */}
    </>
  );
};

export default OrderModal;