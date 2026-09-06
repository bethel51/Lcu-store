import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProductImage, getCategoryFallback } from '../utils/imageUrl';

const ProductCard = React.memo(function ProductCard({ product }) {
  const {
    _id,
    name,
    price,
    originalPrice,
    images,
    category,
    hostelLocation,
    seller,
    status,
    productStatus,
    isBoosted,
    condition,
  } = product;

  const { user } = useAuth();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const navigate = useNavigate();

  const isSameHostel =
    user?.hostel &&
    hostelLocation &&
    user.hostel.toLowerCase().trim() === hostelLocation.toLowerCase().trim();

  const inCart = isInCart(_id);
  const pStatus = productStatus || status || 'Available';
  const isSold = pStatus === 'Sold';
  const isReserved = pStatus === 'Reserved';

  const getCategoryEmoji = (cat) => {
    switch (cat) {
      case 'Hostel Items':         return '🏠';
      case 'Gadgets':              return '💻';
      case 'Clothing & Fashion':   return '👗';
      case 'Textbooks & Handouts': return '📚';
      case 'Services':             return '🛠️';
      case 'Others':               return '📦';
      default:                     return '🏷️';
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    navigate(`/product/${_id}`);
  };

  // Calculate discount
  const showDiscount = originalPrice && originalPrice > price;
  const discountPct = showDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const displayImage = getProductImage(product, true);
  const fallbackImage = getCategoryFallback(category, name);
  const [currentImg, setCurrentImg] = React.useState(displayImage || fallbackImage);
  const [hasError, setHasError] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  React.useEffect(() => {
    setCurrentImg(displayImage || fallbackImage);
    setHasError(false);
    setImgLoaded(false);
  }, [displayImage, fallbackImage]);

  const handleImgError = () => {
    if (currentImg !== fallbackImage) {
      setCurrentImg(fallbackImage);
      setImgLoaded(false);
    } else {
      setHasError(true);
    }
  };

  const photoCount = product.photoCount || (images && images.length > 0 ? images.length : (currentImg ? 1 : 0));

  // Condition styling helper
  const getConditionColor = (c) => {
    switch (c?.toLowerCase()) {
      case 'brand new': return { bg: 'rgba(16, 185, 129, 0.14)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' };
      case 'like new':  return { bg: 'rgba(6, 182, 212, 0.14)', text: '#06b6d4', border: 'rgba(6, 182, 212, 0.3)' };
      case 'good':      return { bg: 'rgba(59, 130, 246, 0.14)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
      case 'fair':      return { bg: 'rgba(245, 158, 11, 0.14)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      default:          return { bg: 'rgba(148, 163, 184, 0.12)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.25)' };
    }
  };

  const condStyle = condition ? getConditionColor(condition) : null;

  return (
    <div
      className={`premium-card animate-fade-in${isBoosted ? ' boosted-card' : ''}`}
      onClick={handleCardClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* ── Top Left Floating Badges ── */}
      <div style={styles.topLeftBadges}>
        <span style={styles.categoryPill}>
          {getCategoryEmoji(category)} {category}
        </span>
        {isSameHostel && (
          <span style={styles.hostelPill} title="Seller is in your hostel!">
            <span style={styles.pulseDot} />
            My Hostel
          </span>
        )}
      </div>

      {/* ── Top Right Floating Indicators ── */}
      <div style={styles.topRightBadges}>
        {seller?.isPro && (
          <span style={styles.proPill} title="LCU Verified Pro Seller">
            ⭐ PRO
          </span>
        )}
        {isBoosted && (
          <span style={styles.boostPill} title="Boosted Listing">
            🔥
          </span>
        )}
        {photoCount > 1 && (
          <span style={styles.photoCountPill} title={`${photoCount} photos available`}>
            📷 {photoCount}
          </span>
        )}
      </div>

      {/* ── Image Container with Zoom and Status Overlays ── */}
      <div className="premium-card-img-container">
        {/* Shimmer placeholder while image downloads */}
        {!imgLoaded && !hasError && currentImg && (
          <div style={styles.shimmerPlaceholder}>
            <span style={{ fontSize: '1.8rem', opacity: 0.35, filter: 'grayscale(0.4)' }}>
              {getCategoryEmoji(category)}
            </span>
          </div>
        )}

        {currentImg && !hasError ? (
          <>
            <img
              src={currentImg}
              alt={name}
              className="premium-card-img"
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={handleImgError}
              style={{
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.25s ease-in-out',
              }}
            />
            <div className="premium-card-img-overlay" />
          </>
        ) : (
          <div style={styles.placeholderImg}>
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ fontSize: '0.78rem', marginTop: '6px', fontWeight: '600' }}>
              No Photo
            </span>
          </div>
        )}

        {/* Status Scrim (Sold / Reserved) */}
        {(isSold || isReserved) && (
          <div style={styles.statusScrim}>
            <span style={isSold ? styles.soldTag : styles.reservedTag}>
              {isSold ? 'SOLD' : 'RESERVED'}
            </span>
          </div>
        )}
      </div>

      {/* ── Card Body / Info ── */}
      <div className="premium-card-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '14px 16px' }}>
        
        {/* Price & Discount Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span className="premium-card-price" style={{ fontSize: '1.28rem', fontWeight: '800' }}>
              ₦{price.toLocaleString()}
            </span>
            {showDiscount && (
              <>
                <span className="premium-card-original-strike" style={{ fontSize: '0.85rem' }}>
                  ₦{originalPrice.toLocaleString()}
                </span>
                <span style={styles.discountBadge}>
                  -{discountPct}%
                </span>
              </>
            )}
          </div>

          {/* Condition Tag */}
          {condStyle && (
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                letterSpacing: '0.02em',
                padding: '3px 8px',
                borderRadius: '6px',
                background: condStyle.bg,
                color: condStyle.text,
                border: `1px solid ${condStyle.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {condition}
            </span>
          )}
        </div>

        {/* Product Title (2-Line Clamp) */}
        <h3
          className="premium-card-title"
          title={name}
          style={{
            fontSize: '0.98rem',
            fontWeight: '600',
            lineHeight: '1.38',
            marginBottom: '8px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            height: '2.76em',
          }}
        >
          {name}
        </h3>

        {/* Location and Verification Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            marginTop: 'auto',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '65%',
            }}
            title={hostelLocation}
          >
            <span style={{ fontSize: '0.9rem' }}>📍</span> {hostelLocation || 'Campus'}
          </span>

          {seller?.isVerifiedStudent && <VerifiedBadge size="sm" />}
        </div>

        {/* Actions Row */}
        <div className="premium-card-footer" style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '0' }}>
          <button
            onClick={() => navigate(`/product/${_id}`)}
            className="btn-secondary premium-card-btn"
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              borderRadius: '10px',
            }}
          >
            View
          </button>

          {!isSold && (!user || user.role === 'Buyer') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (inCart) {
                  removeFromCart(_id);
                } else {
                  addToCart(product);
                }
              }}
              className="premium-card-btn"
              style={{
                flex: 1.4,
                padding: '8px 12px',
                fontSize: '0.82rem',
                borderRadius: '10px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                background: inCart
                  ? 'rgba(239, 68, 68, 0.12)'
                  : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: inCart ? 'var(--error)' : '#ffffff',
                border: inCart
                  ? '1px solid rgba(239, 68, 68, 0.35)'
                  : 'none',
                boxShadow: inCart
                  ? 'none'
                  : '0 2px 10px rgba(245, 158, 11, 0.3)',
              }}
              title={inCart ? 'Remove item from Bag' : 'Add item to Bag'}
            >
              {inCart ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>In Bag</span>
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          )}

          {isSold && (
            <button
              disabled
              style={{
                flex: 1.4,
                padding: '8px 12px',
                fontSize: '0.82rem',
                borderRadius: '10px',
                fontWeight: '600',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-color)',
                cursor: 'not-allowed',
              }}
            >
              Sold Out
            </button>
          )}
        </div>

      </div>
    </div>
  );
});

export default ProductCard;

/* ── Premium LCU Verified Student Badge ─────────────────────────────── */
export function VerifiedBadge({ size = 'sm' }) {
  const isLg = size === 'lg';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isLg ? '5px' : '3px',
        padding: isLg ? '4px 10px' : '2px 6px',
        borderRadius: '6px',
        background: 'rgba(59, 130, 246, 0.12)',
        border: '1px solid rgba(59, 130, 246, 0.28)',
        fontSize: isLg ? '0.75rem' : '0.65rem',
        fontWeight: '700',
        color: '#60a5fa',
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
      title="Verified Lead City Student"
    >
      <svg
        width={isLg ? 12 : 9}
        height={isLg ? 12 : 9}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Verified
    </span>
  );
}

const styles = {
  topLeftBadges: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'flex-start',
  },
  topRightBadges: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 2,
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
  },
  categoryPill: {
    background: 'rgba(15, 23, 42, 0.82)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#e2e8f0',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    fontSize: '0.70rem',
    fontWeight: '600',
    padding: '3px 9px',
    borderRadius: '999px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
  },
  hostelPill: {
    background: 'rgba(16, 185, 129, 0.88)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    fontSize: '0.67rem',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '999px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  },
  pulseDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#ffffff',
    display: 'inline-block',
  },
  photoCountPill: {
    background: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#f1f5f9',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    fontSize: '0.67rem',
    fontWeight: '700',
    padding: '3px 7px',
    borderRadius: '999px',
  },
  proPill: {
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95))',
    color: '#ffffff',
    fontSize: '0.66rem',
    fontWeight: '800',
    padding: '3px 7px',
    borderRadius: '999px',
    letterSpacing: '0.04em',
    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
  },
  boostPill: {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))',
    color: '#ffffff',
    fontSize: '0.68rem',
    fontWeight: '800',
    padding: '3px 6px',
    borderRadius: '999px',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
  },
  statusScrim: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  soldTag: {
    background: '#ef4444',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '900',
    letterSpacing: '0.08em',
    padding: '6px 16px',
    borderRadius: '999px',
    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.5)',
  },
  reservedTag: {
    background: '#f59e0b',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '900',
    letterSpacing: '0.08em',
    padding: '6px 16px',
    borderRadius: '999px',
    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.5)',
  },
  discountBadge: {
    fontSize: '0.68rem',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '5px',
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  placeholderImg: {
    color: 'var(--text-muted)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  shimmerPlaceholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(110deg, rgba(30, 41, 59, 0.4) 8%, rgba(51, 65, 85, 0.6) 18%, rgba(30, 41, 59, 0.4) 33%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s linear infinite',
    zIndex: 0,
  },
};
