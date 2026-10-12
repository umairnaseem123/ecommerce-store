import { useState } from 'react';

// Shows a photo, and a friendly fallback if the image is missing or broken.
export default function SmartImage({ src, alt = '', fallback = null, className = '', style = {} }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={className}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width: '100%', objectFit: 'cover', display: 'block', ...style }}
    />
  );
}
