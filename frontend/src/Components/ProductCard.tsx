import { useState } from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiStar, FiGlobe, FiImage } from "react-icons/fi";

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

interface Props {
  product: Product;
  cheapestPrice: number;
  smartScore: number;
  index: number;
}

// Platform brand colors and initials
const platformBrands: Record<string, { color: string; bg: string; initial: string }> = {
  amazon: { color: '#FF9900', bg: 'rgba(255,153,0,0.15)', initial: 'A' },
  flipkart: { color: '#2874F0', bg: 'rgba(40,116,240,0.15)', initial: 'FK' },
  meesho: { color: '#E91E63', bg: 'rgba(233,30,99,0.15)', initial: 'M' },
  snapdeal: { color: '#E40046', bg: 'rgba(228,0,70,0.15)', initial: 'SD' },
  myntra: { color: '#FF3F6C', bg: 'rgba(255,63,108,0.15)', initial: 'MY' },
  ajio: { color: '#3D405B', bg: 'rgba(61,64,91,0.2)', initial: 'AJ' },
  temu: { color: '#FB6238', bg: 'rgba(251,98,56,0.15)', initial: 'T' },
  croma: { color: '#00BFA5', bg: 'rgba(0,191,165,0.15)', initial: 'CR' },
  reliance: { color: '#003DA5', bg: 'rgba(0,61,165,0.15)', initial: 'RD' },
  'tata cliq': { color: '#E52B50', bg: 'rgba(229,43,80,0.15)', initial: 'TQ' },
};

const getPlatformBrand = (platform: string) => {
  const key = platform.toLowerCase();
  for (const [k, v] of Object.entries(platformBrands)) {
    if (key.includes(k)) return v;
  }
  return { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', initial: platform.charAt(0).toUpperCase() };
};

const ProductCard = ({ product, cheapestPrice, smartScore, index }: Props) => {
  const [imgError, setImgError] = useState(false);
  const isCheapest = product.price === cheapestPrice;
  const priceDifference = product.price - cheapestPrice;
  const brand = getPlatformBrand(product.platform);

  const parseRating = (rating?: string): number => {
    if (!rating) return 0;
    const num = parseFloat(rating);
    return isNaN(num) ? 0 : Math.min(num, 5);
  };

  const ratingValue = parseRating(product.rating);

  const renderStars = (rating: number) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.3;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(<FiStar key={i} style={{ width: 13, height: 13, fill: '#f59e0b', color: '#f59e0b' }} />);
      } else if (i === full && hasHalf) {
        stars.push(<FiStar key={i} style={{ width: 13, height: 13, fill: '#f59e0b', color: '#f59e0b', opacity: 0.4 }} />);
      } else {
        stars.push(<FiStar key={i} style={{ width: 13, height: 13, color: '#334155' }} />);
      }
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="card-shine"
      style={{
        display: 'flex', flexDirection: 'column',
        borderRadius: '20px',
        background: isCheapest
          ? 'linear-gradient(160deg, rgba(99,102,241,0.12) 0%, rgba(22,22,51,0.95) 40%)'
          : 'linear-gradient(160deg, rgba(30,30,60,0.95) 0%, rgba(22,22,51,0.98) 100%)',
        border: isCheapest
          ? '1.5px solid rgba(99,102,241,0.35)'
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isCheapest
          ? '0 8px 40px rgba(99,102,241,0.12), 0 0 60px rgba(99,102,241,0.05)'
          : '0 4px 24px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* ── Platform Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Platform colored initial badge */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: brand.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 900, color: brand.color,
            border: `1px solid ${brand.color}22`,
            letterSpacing: '-0.02em',
          }}>
            {brand.initial}
          </div>
          <span style={{
            fontSize: '13px', fontWeight: 800, color: '#e2e8f0',
            letterSpacing: '0.01em',
          }}>
            {product.platform}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {product.is_global && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '3px',
              fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px',
              background: 'rgba(16,185,129,0.12)', color: '#34d399',
              border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <FiGlobe style={{ width: 10, height: 10 }} /> Global
            </div>
          )}
          <div style={{
            fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px',
            background: smartScore >= 90 ? 'rgba(16,185,129,0.15)' : smartScore >= 70 ? 'rgba(99,102,241,0.12)' : 'rgba(100,116,139,0.1)',
            color: smartScore >= 90 ? '#34d399' : smartScore >= 70 ? '#a78bfa' : '#94a3b8',
          }}>
            {smartScore}%
          </div>
        </div>
      </div>

      {/* ── Best Price Badge ── */}
      {isCheapest && (
        <div style={{
          padding: '6px 16px',
          background: 'linear-gradient(90deg, rgba(99,102,241,0.15), transparent)',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{
            fontSize: '9px', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.12em', color: '#818cf8',
          }}>
            ⚡ Best Price Available
          </span>
        </div>
      )}

      {/* ── Product Image ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 20px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        minHeight: '190px',
      }}>
        {!imgError && product.image ? (
          <motion.img
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.3 }}
            src={product.image}
            alt={product.name || "Product"}
            onError={() => setImgError(true)}
            style={{
              maxHeight: '150px', maxWidth: '100%', objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))',
            }}
          />
        ) : (
          <div style={{
            width: '120px', height: '120px', borderRadius: '20px',
            background: brand.bg, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <FiImage style={{ width: 32, height: 32, color: brand.color, opacity: 0.5 }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>
              View on site
            </span>
          </div>
        )}
      </div>

      {/* ── Product Details ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', flex: 1,
        padding: '16px 16px 12px', gap: '8px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        {/* Name */}
        <h3
          className="line-clamp-2"
          style={{
            fontSize: '13px', fontWeight: 700, lineHeight: 1.5,
            color: '#e2e8f0', minHeight: '2.6em',
            fontFamily: "'Inter', system-ui, sans-serif",
            margin: 0,
          }}
        >
          {product.name || `${product.platform} Product`}
        </h3>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '1px' }}>
            {renderStars(ratingValue)}
          </div>
          {product.rating && (
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
              {product.rating}
            </span>
          )}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
          <span style={{
            fontSize: '26px', fontWeight: 900, letterSpacing: '-0.03em',
            fontFamily: "'Outfit', system-ui, sans-serif",
            color: isCheapest ? '#818cf8' : '#f1f5f9',
          }}>
            ₹{product.price.toLocaleString()}
          </span>
          {!isCheapest && priceDifference > 0 && (
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 8px',
              borderRadius: '6px', background: 'rgba(239,68,68,0.12)',
              color: '#f87171',
            }}>
              +₹{priceDifference.toLocaleString()}
            </span>
          )}
        </div>
        {isCheapest && (
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#34d399' }}>
            Lowest price across all platforms
          </span>
        )}
      </div>

      {/* ── Order Now Button ── */}
      <div style={{ padding: '0 16px 16px' }}>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '13px',
            borderRadius: '12px',
            fontSize: '13px', fontWeight: 800, textDecoration: 'none',
            letterSpacing: '0.02em',
            background: isCheapest
              ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
              : 'rgba(255,255,255,0.06)',
            color: isCheapest ? '#fff' : '#cbd5e1',
            border: isCheapest ? 'none' : '1px solid rgba(255,255,255,0.08)',
            boxShadow: isCheapest ? '0 6px 24px rgba(99,102,241,0.3)' : 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            if (isCheapest) {
              e.currentTarget.style.boxShadow = '0 10px 36px rgba(99,102,241,0.4)';
            } else {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            if (isCheapest) {
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,0.3)';
            } else {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }
          }}
        >
          Order Now <FiExternalLink style={{ width: 14, height: 14 }} />
        </a>
      </div>
    </motion.div>
  );
};

export default ProductCard;