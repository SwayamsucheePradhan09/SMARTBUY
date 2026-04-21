import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./Components/SearchBar";
import ProductCard from "./Components/ProductCard";
import Loader from "./Components/Loader";
import CategoryNav from "./Components/CategoryNav";
import { FiTrendingUp, FiZap, FiGithub, FiMessageSquare, FiShield } from "react-icons/fi";

interface Product {
  platform: string;
  price: number;
  name?: string;
  image?: string;
  url?: string;
  rating?: string;
  is_global?: boolean;
  trend?: number[];
}

const App = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateSmartScore = (price: number) => {
    if (products.length === 0) return 0;
    const items = products.map(p => p.price);
    const minPrice = Math.min(...items);
    if (price === minPrice) return 98;
    const score = 100 - ((price - minPrice) / minPrice) * 100;
    return Math.max(Math.round(score), 45);
  };

  const cheapestPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;

  const searchProduct = async (cat = selectedCategory) => {
    if (!query) return;
    setLoading(true);
    setAdvice(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, category: cat }),
      });
      const data = await response.json();
      setProducts(data.results);
      setAdvice(data.advice);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleCategorySelect = (name: string) => {
    setSelectedCategory(name);
    if (query) searchProduct(name);
  };

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setProducts([]);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setQuery(data.detected_product);
      setProducts(data.results);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d0d24 40%, #0a0a1a 100%)',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: '#f1f5f9',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ══ Ambient Glow Orbs ══ */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', top: '-15%', left: '-5%',
            width: '50%', height: '50%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', bottom: '-10%', right: '-5%',
            width: '45%', height: '45%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', top: '30%', right: '15%',
            width: '25%', height: '25%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* ══ Navbar ══ */}
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          padding: '16px 24px',
          background: 'rgba(10,10,26,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                padding: '10px', borderRadius: '14px',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <FiTrendingUp style={{ color: '#fff', width: 20, height: 20 }} />
            </div>
            <span
              style={{
                fontSize: '22px', fontWeight: 900, letterSpacing: '-0.04em',
                fontFamily: "'Outfit', system-ui, sans-serif",
                color: '#fff',
              }}
            >
              SMARTBUY<span style={{ color: '#6366f1' }}>.</span>
            </span>
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Status Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.12em', color: '#10b981',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#10b981',
                  boxShadow: '0 0 8px rgba(16,185,129,0.5)',
                  display: 'inline-block',
                  animation: 'pulse-soft 2s ease-in-out infinite',
                }} />
                15 Platforms Live
              </span>
              <span style={{
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.12em', color: '#64748b',
              }}>
                Global Hub
              </span>
            </div>

            {/* Get Extension Button */}
            <button
              style={{
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                color: '#fff', padding: '10px 24px', borderRadius: '12px',
                fontWeight: 800, fontSize: '12px', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                transition: 'all 0.3s ease',
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.3)'; }}
            >
              Get Extension
            </button>
          </div>
        </div>
      </nav>

      {/* ══ Hero ══ */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px', paddingTop: '32px', paddingBottom: '100px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <CategoryNav selectedCategory={selectedCategory} onSelect={handleCategorySelect} />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontWeight: 900, letterSpacing: '-0.03em',
              lineHeight: 0.95, marginBottom: '36px',
              fontSize: 'clamp(48px, 8vw, 96px)',
            }}
          >
            <span style={{ color: '#fff' }}>Universal</span>
            <br />
            <span className="gradient-text" style={{ fontStyle: 'italic' }}>Price Sniper.</span>
          </motion.h1>

          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={() => searchProduct()}
            onImageUpload={handleImageUpload}
            isLoading={loading}
          />
        </div>

        {/* ══ Results ══ */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader"><Loader /></motion.div>
          ) : products.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: '1100px', margin: '0 auto' }}
            >
              {/* AI Advice */}
              {advice && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginBottom: '40px', padding: '24px', borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))',
                    border: '1px solid rgba(99,102,241,0.2)',
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div style={{
                    padding: '12px', background: 'rgba(99,102,241,0.2)', borderRadius: '14px',
                    flexShrink: 0,
                  }}>
                    <FiMessageSquare style={{ width: 20, height: 20, color: '#a78bfa' }} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                      letterSpacing: '0.2em', marginBottom: '6px', color: '#8b5cf6',
                    }}>
                      Shopping Advisor AI
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.6, color: '#cbd5e1' }}>
                      {advice}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Results Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '28px', padding: '0 4px',
              }}>
                <div>
                  <h2 style={{
                    fontSize: '24px', fontWeight: 900,
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    color: '#fff',
                  }}>
                    Found {products.length} Best Matches
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#10b981', display: 'inline-block',
                      boxShadow: '0 0 8px rgba(16,185,129,0.5)',
                    }} />
                    <span style={{
                      fontSize: '10px', fontWeight: 700, color: '#64748b',
                      textTransform: 'uppercase', letterSpacing: '0.15em',
                    }}>
                      Live Scan Complete
                    </span>
                  </div>
                </div>
                <div style={{
                  padding: '10px', background: 'rgba(99,102,241,0.1)',
                  borderRadius: '12px', border: '1px solid rgba(99,102,241,0.15)',
                }}>
                  <FiZap style={{ color: '#6366f1', width: 18, height: 18 }} />
                </div>
              </div>

              {/* Product Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px',
              }}>
                {products.map((p, idx) => (
                  <ProductCard
                    key={`${p.platform}-${idx}`}
                    product={p}
                    cheapestPrice={cheapestPrice}
                    smartScore={calculateSmartScore(p.price)}
                    index={idx}
                  />
                ))}
              </div>

              {/* Savings Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  marginTop: '60px', padding: '40px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(22,22,51,0.8), rgba(30,30,60,0.6))',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                  display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px',
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 800, color: '#6366f1',
                    textTransform: 'uppercase', letterSpacing: '0.25em',
                    display: 'block', marginBottom: '12px',
                  }}>
                    Savings Dashboard
                  </span>
                  <h3 style={{
                    fontSize: '32px', fontWeight: 900, marginBottom: '12px',
                    fontFamily: "'Outfit', system-ui, sans-serif", color: '#fff',
                  }}>
                    You just saved{' '}
                    <span className="gradient-text">
                      ₹{(products[products.length - 1].price - cheapestPrice).toLocaleString()}
                    </span>
                  </h3>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#64748b', maxWidth: '380px', lineHeight: 1.7 }}>
                    Our sniping engine scanned across Global and Premium markets in 1.4 seconds.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                    <div style={{
                      padding: '16px 24px', borderRadius: '16px', textAlign: 'center',
                      background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)',
                      flex: 1,
                    }}>
                      <div className="gradient-text" style={{ fontSize: '22px', fontWeight: 900 }}>98.4%</div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Success Rate</div>
                    </div>
                    <div style={{
                      padding: '16px 24px', borderRadius: '16px', textAlign: 'center',
                      background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.12)',
                      flex: 1,
                    }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: '#10b981' }}>15</div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Stores</div>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                      color: '#fff', padding: '18px 40px', borderRadius: '16px',
                      fontSize: '14px', fontWeight: 800, border: 'none', cursor: 'pointer',
                      boxShadow: '0 8px 30px rgba(99,102,241,0.3)',
                      transition: 'all 0.3s ease',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.3)'; }}
                  >
                    <FiShield style={{ width: 18, height: 18 }} />
                    Create Price Alert
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                maxWidth: '800px', margin: '0 auto',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '80px 0',
              }}
            >
              <div className="float">
                <FiTrendingUp style={{ width: 120, height: 120, color: 'rgba(99,102,241,0.15)', marginBottom: '24px' }} />
              </div>
              <p style={{
                fontWeight: 900, fontSize: '22px', color: 'rgba(255,255,255,0.15)',
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}>
                Start Sniping Prices Now.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ══ Footer ══ */}
      <footer style={{
        position: 'relative', zIndex: 10, padding: '48px 32px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          alignItems: 'center', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.3 }}>
            <FiTrendingUp style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: '12px', fontWeight: 900, fontFamily: "'Outfit', system-ui, sans-serif" }}>SMARTBUY.</span>
          </div>
          <span style={{
            fontSize: '10px', fontWeight: 700, color: '#334155',
            textTransform: 'uppercase', letterSpacing: '0.3em',
          }}>
            Propelling Smart Commerce into 2026
          </span>
          <FiGithub
            style={{ width: 20, height: 20, color: '#334155', cursor: 'pointer', transition: 'color 0.3s' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#6366f1'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = '#334155'; }}
          />
        </div>
      </footer>
    </div>
  );
};

export default App;