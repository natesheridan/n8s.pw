import React from 'react';
import Reveal from '../Reveal';

const Tile = ({ progress, at, title, children }) => (
  <Reveal progress={progress} at={at} from={{ y: 40, scale: 0.9 }} className="hg-tile">
    <h4>{title}</h4>
    {children}
  </Reveal>
);

// Widgets fill a wall tablet; a small box at home feeds it.
const HomeGridScene = ({ progress }) => (
  <div className="hg-wrap">
    <Reveal progress={progress} at={[0.62, 0.76]} from={{ y: -20 }} className="hg-ask">“What’s due this week?”</Reveal>
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Reveal progress={progress} at={[0.02, 0.12]} from={{ scale: 0.88 }} className="hg-tablet" style={{ display: 'grid' }}>
        <Tile progress={progress} at={[0.12, 0.24]} title="Today"><div className="hg-big">9:41</div><div className="hg-row"><div className="hg-bar" /></div></Tile>
        <Tile progress={progress} at={[0.2, 0.32]} title="To-do">
          {[true, true, false].map((on, i) => <div className="hg-row" key={i}><div className={`hg-box ${on ? 'on' : ''}`} /><div className="hg-bar" /></div>)}
        </Tile>
        <Tile progress={progress} at={[0.28, 0.4]} title="Vehicles"><div className="hg-row"><div className="hg-bar" /></div><div className="hg-row"><div className="hg-bar s" /></div></Tile>
        <Tile progress={progress} at={[0.36, 0.48]} title="Plants"><div className="hg-leaf" /><div className="hg-row"><div className="hg-bar s" /></div></Tile>
        <Tile progress={progress} at={[0.44, 0.56]} title="Now playing"><div className="hg-row"><div className="hg-bar" /></div><div className="hg-row"><div className="hg-bar s" /></div></Tile>
        <Tile progress={progress} at={[0.52, 0.64]} title="Photos"><div className="hg-photo" /></Tile>
      </Reveal>
    </div>
    <Reveal progress={progress} at={[0.76, 0.9]} from={{ x: -30 }} className="hg-box-home"><span className="hg-led" />runs on a box at home</Reveal>
  </div>
);

export default HomeGridScene;
