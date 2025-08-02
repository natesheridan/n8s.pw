import React from 'react';
import { motion } from 'framer-motion';
import ServerRack from '../ServerRack/ServerRack';
import './ServerStack.css';

const stackVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const serverVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const ServerStack = () => {
  return (
    <motion.div
      className="server-stack-container"
      variants={stackVariants}
      initial="hidden"
      animate="visible"
    >
      {[...Array(3)].map((_, i) => (
        <motion.div key={i} variants={serverVariants}>
          <ServerRack />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ServerStack;
