import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax';
import './StorySection.css';

const componentMap = {
  Terminal: lazy(() => import('../Terminal/Terminal')),
  CarSvg: lazy(() => import('../CarSvg/CarSvg')),
  SkillsChart: lazy(() => import('../SkillsChart/SkillsChart')),
};

const CustomComponent = ({ component }) => {
  const Component = component ? componentMap[component.name] : null;
  return Component ? (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="component-container">
        <Component {...component.props} />
      </div>
    </Suspense>
  ) : null;
};

const StorySection = ({ section }) => {
  const { ref, y } = useParallax();

  const renderLayout = () => {
    switch (section.layout) {
      case 'left':
        return (
            <div className="layout-split">
                <div className="layout-text">
                <h1>{section.header}</h1>
                <p>{section.content}</p>
                </div>
                <div className="layout-visual">
                {section.image && <img src={section.image.url} alt={section.header} className="side-image" />}
                </div>
            </div>
        );
      case 'right':
        return (
            <div className="layout-split reversed">
                <div className="layout-visual"></div>
                <div className="layout-text">
                <h1>{section.header}</h1>
                <p>{section.content}</p>
                </div>
            </div>
        );
      case 'center-fullscreen':
        return (
          <div className="layout-center fullscreen">
            <h1>{section.header}</h1>
            <h2>{section.subheader}</h2>
            <CustomComponent component={section.component} />
          </div>
        );
      case 'split':
        return (
          <div className="layout-split-content">
            <div className="split-left">
              <h2>{section.left.header}</h2>
              <p>{section.left.content}</p>
              <CustomComponent component={section.left.component} />
            </div>
            <div className="split-right">
                <h2>{section.right.header}</h2>
              <p>{section.right.content}</p>
            </div>
          </div>
        );
      default: // center
        return (
          <div className="layout-center">
            {section.image && (
                <div className="profile-image-container">
                    <img 
                    src={section.image.url} 
                    alt={section.header} 
                    className={`profile-image ${section.image.imgStyle}`} 
                    />
                </div>
            )}
            <h1>{section.header}</h1>
            <h2>{section.subheader}</h2>
            {section.link && (
              <a href={section.link.url} className="resume-button" target="_blank" rel="noopener noreferrer">
                {section.link.title}
              </a>
            )}
          </div>
        );
    }
  };

  return (
    <section ref={ref} className={`story-section ${section.layout}`} style={{background: 'transparent'}}>
      {section.background ? (
        <motion.div className="background-image" style={{ backgroundImage: `url(${section.background.url})`, y }} />
      ) : null}
      {renderLayout()}
    </section>
  );
};

export default StorySection; 