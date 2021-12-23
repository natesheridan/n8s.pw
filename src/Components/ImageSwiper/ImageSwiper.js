import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import './ImageSwiper.css'


import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'


const ImageSwiper = ({linkArr, name}) => {
    const generateImgs = ()=> {
        return linkArr.map(link => {
            return(
                <SwiperSlide key={name}>
                    <img src={link}></img>
                </SwiperSlide>
            )
        })
    }
    return (
        <Swiper
        spaceBetween={50}
        slidesPerView={3}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        >
            {generateImgs()}
        </Swiper>
    )
}

export default ImageSwiper
