import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HeroAnimation.css';

const messages = [
  {
    id: 1,
    text: "I break cool things.",
    isCorrection: false,
  },
  {
    id: 2,
    text: "I build cool things.",
    isCorrection: true,
    note: "My PR team said advertising I break things isn't good."
  }
];

const HeroAnimation = () => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIndex(1);
    }, 2000); // Time before switching from "break" to "build"

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hero-animation-container">
      <AnimatePresence>
        <motion.div
          key={messages[index].id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="hero-text"
        >
          {messages[index].text}
          {messages[index].isCorrection && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="pr-note"
            >
              {messages[index].note}
            </motion.span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroAnimation;
