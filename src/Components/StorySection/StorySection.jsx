import React, { lazy, Suspense, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as FontAwesome from 'react-icons/fa';
import './StorySection.css';

const StoryScroller = lazy(() => import('../StoryScroller/StoryScroller'));

const componentMap = {
  Terminal: lazy(() => import('../Terminal/Terminal')),
  CarSvg: lazy(() => import('../CarSvg/CarSvg')),
  SkillsChart: lazy(() => import('../SkillsChart/SkillsChart')),
  ImageSwiper: lazy(() => import('../ImageSwiper/ImageSwiper')),
  ServerRack: lazy(() => import('../ServerRack/ServerRack')),
  BuildBreakAnimation: lazy(() => import('../BuildBreakAnimation/BuildBreakAnimation')),
  ServerStack: lazy(() => import('../ServerStack/ServerStack')),
  ProjectsList: lazy(() => import('../ProjectsList/ProjectsList')),
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  if (section.layout === 'fullscreen') {
    return (
      <Suspense fallback={<div>Loading Story...</div>}>
        <StoryScroller story={section.story} />
      </Suspense>
    );
  }

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
                <div className="layout-visual">
                  <CustomComponent component={section.component} />
                </div>
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
            {section.header && <h1>{section.header}</h1>}
            {section.subheader && <h2>{section.subheader}</h2>}
            {section.component && <CustomComponent component={section.component} />}
            {section.content && <p className="section-content">{section.content}</p>}
            {section.buttons && (
              <div className="contact-buttons">
                {section.buttons.map((button, index) => {
                  const Icon = FontAwesome[button.icon];
                  return (
                    <a
                      key={index}
                      href={button.link}
                      className="contact-button"
                      target={button.link.startsWith('http') ? '_blank' : undefined}
                      rel={button.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {Icon && <Icon />}
                      {button.label}
                    </a>
                  );
                })}
              </div>
            )}
            {section.link && (
              <a href={section.link.url} className="section-button" target="_blank" rel="noopener noreferrer">
                {section.link.title}
              </a>
            )}
          </div>
        );
    }
  };

  return (
    <motion.section 
      ref={ref} 
      className={`story-section ${section.layout}`}
      style={{
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
      }}
    >
      {section.background && (
        <motion.div 
          className="background-image" 
          style={{ 
            backgroundImage: `url(${section.background.url})`, 
          }} 
        />
      )}
      {renderLayout()}
    </motion.section>
  );
};

export default StorySection; 