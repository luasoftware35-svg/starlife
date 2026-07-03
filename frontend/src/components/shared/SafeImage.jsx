import React, { useState } from 'react';
import { DEFAULT_PROJECT_IMAGE } from '../../lib/fallbackImages';

export default function SafeImage({ src, alt, className = '', fallback = DEFAULT_PROJECT_IMAGE, ...props }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  return (
    <img
      {...props}
      src={currentSrc || fallback}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallback) setCurrentSrc(fallback);
      }}
    />
  );
}
