import React, { useRef, useState, useCallback } from 'react';
import './ImageSwiper.css';

// Native scroll-snap carousel — real touch/trackpad swiping on mobile,
// arrow buttons on desktop. No animation library needed.
const ImageSwiper = ({ images = [] }) => {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    track.children[clamped]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [images.length]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, clientWidth } = track;
    const index = Math.round(scrollLeft / clientWidth);
    setActive(index);
  };

  if (!images.length) return null;

  return (
    <div className="image-swiper">
      <div className="swiper-track" ref={trackRef} onScroll={handleScroll}>
        {images.map((image, index) => (
          <div className="swiper-slide" key={index}>
            <img src={image.src} alt={image.alt || ''} loading="lazy" decoding="async" />
            {image.caption && <p className="swiper-caption">{image.caption}</p>}
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="swiper-arrow prev"
            aria-label="Previous photo"
            onClick={() => scrollToIndex(active - 1)}
            disabled={active === 0}
          >
            ‹
          </button>
          <button
            type="button"
            className="swiper-arrow next"
            aria-label="Next photo"
            onClick={() => scrollToIndex(active + 1)}
            disabled={active === images.length - 1}
          >
            ›
          </button>
          <div className="swiper-dots" role="tablist" aria-label="Photo navigation">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Go to photo ${index + 1}`}
                className={`swiper-dot ${index === active ? 'active' : ''}`}
                onClick={() => scrollToIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSwiper;
