import React, { useState } from 'react';
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
  const [isResumeVisible, setIsResumeVisible] = useState(false);

  const showResume = () => setIsResumeVisible(true);
  const hideResume = () => setIsResumeVisible(false);

  return (
    <motion.div 
        className="contact-page"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
    >
      {ContactData.map((section) => {
        if (section.id === 'contact-options') {
          return <StorySection key={section.id} section={{ ...section, onShowResume: showResume }} />;
        }
        return <StorySection key={section.id} section={section} />;
      })}

      {isResumeVisible && (
        <div className="resume-popup-overlay" onClick={hideResume}>
          <div className="resume-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={hideResume}>
              &times;
            </button>
            <iframe src="/assets/ResumeNoPhone.pdf" title="Resume" width="100%" height="100%"></iframe>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Contact;
