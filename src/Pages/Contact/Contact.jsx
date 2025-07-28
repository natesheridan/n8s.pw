import React, { useState } from 'react';
import StorySection from '../../Components/StorySection/StorySection';
import ContactData from './ContactData';
import './Contact.css';

const Contact = () => {
  const [isResumeVisible, setIsResumeVisible] = useState(false);

  const showResume = () => setIsResumeVisible(true);
  const hideResume = () => setIsResumeVisible(false);

  return (
    <div className="contact-page">
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
    </div>
  );
};

export default Contact;
