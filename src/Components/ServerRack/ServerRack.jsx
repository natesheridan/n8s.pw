import React from 'react';
import { motion } from 'framer-motion';
import './ServerRack.css';

const rackVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const serverVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const ledVariants = {
  blink: {
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    }
  }
};

const ServerRack = () => {
  return (
    <motion.div 
      className="server-rack-container"
      variants={rackVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="rack-frame">
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} className="server-unit" variants={serverVariants}>
            <div className="server-face">
              <div className="leds">
                <motion.div className="led green" variants={ledVariants} animate="blink" style={{ animationDelay: `${i * 0.5}s` }} />
                <motion.div className="led red" variants={ledVariants} animate="blink" style={{ animationDelay: `${i * 0.7}s` }}/>
              </div>
              <div className="vents">
                {[...Array(8)].map((_, j) => <div key={j} className="vent-slot" />)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServerRack;
