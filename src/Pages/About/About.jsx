import React from 'react';
import StorySection from '../../Components/StorySection/StorySection';
import AboutData from './AboutData';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {AboutData.map((section) => (
        <StorySection key={section.id} section={section} />
      ))}
    </div>
  );
};

export default About;
