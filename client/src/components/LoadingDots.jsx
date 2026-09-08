import React from 'react';

/**
 * Universal 3 smooth bouncing dots loading state.
 * Fits naturally anywhere across the app: full page, cards, modals, or inline.
 *
 * Props:
 *  - message: optional text (e.g. "Loading store...", "Loading your dashboard...")
 *  - size: 'sm' | 'md' | 'lg' (default 'md')
 *  - color: 'blue' | 'gold' | 'white' (default 'blue')
 *  - minHeight: optional height (default '50vh' for pages, 'auto' for inline)
 *  - inline: boolean (if true, renders inline without page margins)
 */
export default function LoadingDots({
  message = '',
  size = 'md',
  color = 'blue',
  minHeight = '50vh',
  inline = false,
  style = {},
}) {
  const dotSizes = {
    sm: { w: '7px', h: '7px', gap: '5px' },
    md: { w: '11px', h: '11px', gap: '8px' },
    lg: { w: '15px', h: '15px', gap: '10px' },
  };

  const { w, h, gap } = dotSizes[size] || dotSizes.md;

  const colorStyles = {
    blue: {
      bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      shadow: '0 3px 10px rgba(59, 130, 246, 0.5)',
    },
    gold: {
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      shadow: '0 3px 10px rgba(245, 158, 11, 0.5)',
    },
    white: {
      bg: '#ffffff',
      shadow: '0 2px 8px rgba(255, 255, 255, 0.6)',
    },
  };

  const { bg, shadow } = colorStyles[color] || colorStyles.blue;

  const containerStyle = inline
    ? {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        verticalAlign: 'middle',
        ...style,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: minHeight,
        width: '100%',
        padding: '32px 16px',
        animation: 'fadeIn 0.2s ease',
        ...style,
      };

  return (
    <div className="loading-dots-container" style={containerStyle}>
      <style>{`
        @keyframes smoothDotBounce {
          0%, 80%, 100% {
            transform: scale(0.65) translateY(0);
            opacity: 0.35;
          }
          40% {
            transform: scale(1.15) translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>
      <div
        className="loading-dots-wave"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap,
        }}
        aria-label="Loading..."
        role="status"
      >
        <span
          className="bouncing-dot"
          style={{
            width: w,
            height: h,
            borderRadius: '50%',
            background: bg,
            boxShadow: shadow,
            display: 'inline-block',
            animation: 'smoothDotBounce 1.1s infinite cubic-bezier(0.4, 0, 0.2, 1) both',
            animationDelay: '-0.32s',
          }}
        />
        <span
          className="bouncing-dot"
          style={{
            width: w,
            height: h,
            borderRadius: '50%',
            background: bg,
            boxShadow: shadow,
            display: 'inline-block',
            animation: 'smoothDotBounce 1.1s infinite cubic-bezier(0.4, 0, 0.2, 1) both',
            animationDelay: '-0.16s',
          }}
        />
        <span
          className="bouncing-dot"
          style={{
            width: w,
            height: h,
            borderRadius: '50%',
            background: bg,
            boxShadow: shadow,
            display: 'inline-block',
            animation: 'smoothDotBounce 1.1s infinite cubic-bezier(0.4, 0, 0.2, 1) both',
            animationDelay: '0s',
          }}
        />
      </div>

      {message && (
        <p
          style={{
            marginTop: '16px',
            fontSize: size === 'sm' ? '0.8rem' : '0.88rem',
            fontWeight: '600',
            color: 'var(--text-secondary, #94a3b8)',
            letterSpacing: '0.01em',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
