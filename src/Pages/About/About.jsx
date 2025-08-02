import React from 'react';
import { motion } from 'framer-motion';
import StorySection from '../../Components/StorySection/StorySection';
// import AboutData from './AboutData';
import AboutData from './AboutData2';
import './About.css';

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 1.2
};

const About = () => {
  return (
    <motion.div 
      className="about-page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {AboutData.map((section) => (
        <StorySection key={section.id} section={section} />
      ))}
    </motion.div>
  );
};

export default About;
