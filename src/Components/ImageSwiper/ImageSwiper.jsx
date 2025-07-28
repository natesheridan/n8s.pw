import React from 'react';
import './ImageSwiper.css';

const images = [
  'https://images.unsplash.com/photo-1516832682008-32c02de1ca46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1514316454348-772a0a2caf3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
];

const ImageSwiper = () => {
  return (
    <div className="image-swiper">
      <div className="swiper-track">
        {images.map((image, index) => (
          <div className="swiper-slide" key={index}>
            <img src={image} alt={`slide-${index}`} />
          </div>
        ))}
        {images.map((image, index) => (
          <div className="swiper-slide" key={`clone-${index}`}>
            <img src={image} alt={`slide-${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSwiper;
