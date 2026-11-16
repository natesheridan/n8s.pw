import React from 'react';
import Reveal from '../Reveal';

// Blocks stack into a profile page while platform links converge into one URL.
const AutofocusScene = ({ progress }) => (
  <div className="sc-fill">
    <Reveal progress={progress} at={[0.02, 0.14]} from={{ scale: 0.85, y: 30 }} className="af-phone-wrap">
      <div className="af-phone">
        <Reveal progress={progress} at={[0.1, 0.2]} from={{ x: -70 }}>
          <div className="af-block">
            <div className="af-avatar" />
            <div className="af-col"><div className="af-line m" /><div className="af-line s" /></div>
          </div>
        </Reveal>
        <Reveal progress={progress} at={[0.2, 0.32]} from={{ x: 70 }}>
          <div className="af-block"><div className="af-col"><div className="af-line l" /><div className="af-line l" /><div className="af-line m" /></div></div>
        </Reveal>
        <Reveal progress={progress} at={[0.32, 0.44]} from={{ x: -70 }}>
          <div className="af-shop"><div className="af-prod" /><div className="af-prod" /></div>
        </Reveal>
        <Reveal progress={progress} at={[0.44, 0.56]} from={{ x: 70 }}>
          <div className="af-photo" />
        </Reveal>
        <Reveal progress={progress} at={[0.56, 0.68]} from={{ x: -70 }}>
          <div className="af-kanban">
            {[2, 1, 1].map((n, i) => (
              <div className="af-kcol" key={i}>{Array.from({ length: n }).map((_, j) => <div className="af-kcard" key={j} />)}</div>
            ))}
          </div>
        </Reveal>
        <Reveal progress={progress} at={[0.68, 0.76]} from={{ y: 20 }}>
          <div className="af-block af-lock">🔒 optional per-page password</div>
        </Reveal>
      </div>
    </Reveal>

    <Reveal progress={progress} at={[0.5, 0.74]} from={{ x: -160, y: -40 }} className="af-chip" style={{ left: '2%', top: '14%' }}>Instagram</Reveal>
    <Reveal progress={progress} at={[0.54, 0.78]} from={{ x: 160, y: -30 }} className="af-chip" style={{ right: '2%', top: '24%' }}>YouTube</Reveal>
    <Reveal progress={progress} at={[0.58, 0.82]} from={{ x: -150, y: 30 }} className="af-chip" style={{ left: '4%', bottom: '28%' }}>GitHub</Reveal>
    <Reveal progress={progress} at={[0.62, 0.86]} from={{ x: 150, y: 40 }} className="af-chip" style={{ right: '4%', bottom: '34%' }}>My shop</Reveal>
    <Reveal progress={progress} at={[0.84, 0.94]} from={{ y: 16, scale: 0.9 }} className="af-url">autofoc.us/you</Reveal>
  </div>
);

export default AutofocusScene;
