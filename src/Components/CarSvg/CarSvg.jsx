import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import './CarSvg.css';

const CarSvg = () => {
  const carRef = useRef(null);

  useEffect(() => {
    const car = carRef.current;
    if (car) {
      anime({
        targets: car,
        translateX: [
          { value: -20, duration: 500, easing: 'easeOutSine' },
          { value: 20, duration: 1000, easing: 'easeInOutQuad' },
          { value: 0, duration: 500, easing: 'easeInSine' }
        ],
        translateY: [
          { value: -5, duration: 250, easing: 'easeOutSine' },
          { value: 0, duration: 250, easing: 'easeInSine' }
        ],
        loop: true,
        direction: 'alternate',
        duration: 2000
      });
    }
  }, []);

  return (
    <div className="car-container">
      <svg ref={carRef} className="car-svg" viewBox="0 0 100 40">
        {/* Car Body */}
        <path d="M5 25 a 5 5 0 0 1 5 -5 H 25 L 35 10 H 65 L 75 20 H 90 a 5 5 0 0 1 5 5 V 30 H 5 Z" fill="#FFC107" />
        {/* Car Roof */}
        <path d="M30 20 H 70 L 65 10 H 35 Z" fill="#FF9800" />
        {/* Wheels */}
        <circle cx="20" cy="30" r="5" fill="#333" />
        <circle cx="80" cy="30" r="5" fill="#333" />
      </svg>
      <div className="road"></div>
    </div>
  );
};

export default CarSvg; 