import React from 'react';
import Car from './race-car.svg';
import { motion } from 'framer-motion';
import './CarSvg.css';

const CarSvg = ({ animate }) => {
  const variants = {
    initial: { x: '-100vw' },
    animate: { x: '100vw', transition: { duration: 5, ease: 'linear' } },
  };

  return (
    <motion.div
      className="car-container"
      variants={animate ? variants : {}}
      initial="initial"
      animate="animate"
    >
      <img src={Car} alt="Racing car" />
    </motion.div>
  );
};

export default CarSvg;