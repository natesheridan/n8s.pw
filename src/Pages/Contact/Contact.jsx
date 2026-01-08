import React from 'react';
import { motion } from 'framer-motion';
import StorySection from '../../Components/StorySection/StorySection';
import ContactData from './ContactData';
import './Contact.css';

const pageVariants = {
    initial: {
        opacity: 0,
        y: "-100vh"
    },
    in: {
        opacity: 1,
        y: 0
    },
    out: {
        opacity: 0,
        y: "100vh"
    }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 1.2
};

const Contact = () => {
  return (
    <motion.div 
        className="contact-page"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
    >
      {ContactData.map((section) => (
        <StorySection key={section.id} section={section} />
      ))}
    </motion.div>
  );
};

export default Contact;
