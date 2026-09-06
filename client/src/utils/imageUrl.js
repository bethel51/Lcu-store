import { API_URL, getBaseApiUrl } from '../config';

/**
 * Resolves a product image URL so it always points to a working, reachable URL
 * across all environments and devices (Desktop, Mobile, Android, Production, Dev).
 */
export function resolveImageUrl(url) {
  if (!url) return '';

  // If url is an object (e.g. { preview: '...', url: '...' })
  if (typeof url === 'object' && url !== null) {
    url = url.preview || url.url || url.src || url.path || '';
  }

  // If url is a JSON array string e.g. '["/uploads/img.jpg"]'
  if (typeof url === 'string' && url.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(url);
      if (Array.isArray(parsed) && parsed.length > 0) {
        url = parsed[0];
      }
    } catch {
      // ignore parse error
    }
  }

  if (typeof url !== 'string' || !url.trim()) return '';
  url = url.trim().replace(/\\/g, '/'); // Normalize all Windows backslashes

  // Return blob or data URLs directly (used for local uploads/previews)
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  const baseUrl = getBaseApiUrl();

  // If the URL references server uploads (uploads/... or /uploads/...)
  if (url.includes('uploads/')) {
    const uploadIndex = url.indexOf('uploads/');
    const uploadPath = '/' + url.substring(uploadIndex);
    return `${baseUrl}${uploadPath}`;
  }

  // If it's an external absolute URL (e.g. Cloudinary, Unsplash, HTTPS images)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If external URL points to localhost on a non-localhost client (e.g. Android phone), rewrite hostname
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      if (url.includes('localhost:5000') || url.includes('127.0.0.1:5000')) {
        const uploadPath = url.substring(url.indexOf(':5000') + 5);
        return `${baseUrl}${uploadPath}`;
      }
    }
    return url;
  }

  // If it's a bare filename (e.g. 178912389-photo.jpg)
  if (!url.includes('/') && !url.includes(':') && /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(url)) {
    return `${baseUrl}/uploads/${url}`;
  }

  // Fallback for relative paths starting with '/'
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }

  return `${baseUrl}/${url}`;
}

export const CATEGORY_FALLBACKS = {
  'Gadgets': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=70',
  'Hostel Items': 'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=400&auto=format&fit=crop&q=70',
  'Clothing & Fashion': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=70',
  'Textbooks & Handouts': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=70',
  'Services': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=70',
  'Others': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=70',
};

/**
 * Optimizes an image URL for thumbnails (e.g. Unsplash CDN images)
 * Requests responsive 400px WebP images instead of massive 800px+ images.
 */
export function getThumbnailUrl(url, targetWidth = 400) {
  if (!url || typeof url !== 'string') return url || '';
  if (url.includes('images.unsplash.com')) {
    try {
      const u = new URL(url);
      u.searchParams.set('w', String(targetWidth));
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      u.searchParams.set('q', '70');
      return u.toString();
    } catch {
      return url.replace(/w=\d+/, `w=${targetWidth}`).replace(/q=\d+/, 'q=70');
    }
  }
  return url;
}

/**
 * Returns a vivid, fast fallback image based on product name and category.
 * Used when a product has no image or its image 404s on the server.
 */
export function getCategoryFallback(category, name = '') {
  const n = (name || '').toLowerCase();
  if (n.includes('water') || n.includes('bottle')) {
    return 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=70';
  }
  if (n.includes('earpiece') || n.includes('earphone') || n.includes('headphone') || n.includes('sound') || n.includes('audio')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=70';
  }
  if (n.includes('cooler') || n.includes('kettle') || n.includes('lamp') || n.includes('mattress') || n.includes('fan')) {
    return 'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=400&auto=format&fit=crop&q=70';
  }
  if (n.includes('snooker') || n.includes('game') || n.includes('table') || n.includes('billiard')) {
    return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&auto=format&fit=crop&q=70';
  }
  if (n.includes('calculator') || n.includes('laptop') || n.includes('hp') || n.includes('phone') || n.includes('macbook')) {
    return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=70';
  }
  if (n.includes('book') || n.includes('calculus') || n.includes('handout') || n.includes('block') || n.includes('cement')) {
    return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=70';
  }
  if (n.includes('money') || n.includes('cash') || n.includes('wallet')) {
    return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=70';
  }
  if (n.includes('toothpick') || n.includes('can') || n.includes('cup') || n.includes('plate')) {
    return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=70';
  }
  if (n.includes('cloth') || n.includes('bag') || n.includes('shoe') || n.includes('backpack') || n.includes('shirt') || n.includes('trouser')) {
    return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=70';
  }
  return CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS['Others'];
}

/**
 * Returns the resolved display image URL for a product object.
 * Checks `images[0]` first, then `image`.
 * If isThumbnail is true (default for cards), optimizes CDN URLs.
 * If neither exists, returns a matching category fallback image.
 */
export function getProductImage(product, isThumbnail = true) {
  if (!product) return '';
  let raw = '';
  if (Array.isArray(product.images) && product.images.length > 0) {
    raw = product.images[0];
  } else if (product.image) {
    raw = product.image;
  }
  const resolved = resolveImageUrl(raw) || getCategoryFallback(product.category, product.name);
  return isThumbnail ? getThumbnailUrl(resolved, 400) : resolved;
}
