import React, { useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './SceneScroller.css';

const scenes = {
  AutofocusScene: lazy(() => import('./scenes/AutofocusScene')),
  StaffLaunchScene: lazy(() => import('./scenes/StaffLaunchScene')),
  HomeGridScene: lazy(() => import('./scenes/HomeGridScene')),
  ZipcodeScene: lazy(() => import('./scenes/ZipcodeScene')),
  ArtisanedScene: lazy(() => import('./scenes/ArtisanedScene')),
};

const Beat = ({ text, index, count, progress }) => {
  const a = index / count;
  const b = (index + 1) / count;
  const fade = (b - a) * 0.22;
  const last = index === count - 1;
  const opacity = useTransform(
    progress,
    [a, a + fade, b - fade, b],
    [index === 0 ? 1 : 0, 1, 1, last ? 1 : 0]
  );
  const y = useTransform(progress, [a, a + fade, b - fade, b], [index === 0 ? 0 : 18, 0, 0, last ? 0 : -18]);
  return (
    <motion.p className="scene-beat" style={{ opacity, y }}>
      {text}
    </motion.p>
  );
};

// A "scene story": one sticky stage whose custom scene is scrubbed by scroll position,
// with short text beats that cross-fade underneath.
const SceneScroller = ({ scene, beats, tag, accent, link }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const Scene = scenes[scene];
  const linkOpacity = useTransform(scrollYProgress, [0.82, 0.94], [0, 1]);
  const linkEvents = useTransform(linkOpacity, (v) => (v > 0.5 ? 'auto' : 'none'));

  return (
    <div
      ref={ref}
      className="scene-scroller"
      style={{ height: `${beats.length * 90 + 40}vh`, '--scene-accent': accent || '#6ea8ff' }}
    >
      <div className="scene-sticky">
        {tag && <div className="scene-tag">{tag}</div>}
        <div className="scene-stage">
          <Suspense fallback={<div />}>{Scene && <Scene progress={scrollYProgress} />}</Suspense>
        </div>
        <div className="scene-captions">
          {beats.map((text, i) => (
            <Beat key={i} text={text} index={i} count={beats.length} progress={scrollYProgress} />
          ))}
          {link && (
            <motion.a
              className="section-button scene-link"
              style={{ opacity: linkOpacity, pointerEvents: linkEvents }}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.title}
            </motion.a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SceneScroller;
