import React from 'react';
import { motion, useTransform } from 'framer-motion';

const COLS = 10;
const ROWS = 6;
const TEAMS = ['rgba(255,95,150,0.75)', 'rgba(80,220,255,0.75)', 'rgba(255,200,70,0.75)'];

// Deterministic pseudo-random so the board looks the same every render.
const hash = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Cell = ({ progress, i }) => {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  const dist = Math.hypot(c - (COLS - 1) / 2, (r - (ROWS - 1) / 2) * 1.4) / 6.2;
  const start = 0.1 + dist * 0.5 + hash(i) * 0.12;
  const color = TEAMS[Math.floor(hash(i + 50) * 3)];
  const bg = useTransform(progress, [start, start + 0.07], ['rgba(255,255,255,0.04)', color]);
  const label = hash(i + 9) > 0.8 ? `80${Math.floor(hash(i + 3) * 900 + 100)}` : '';
  return <motion.div className="zc-cell" style={{ background: bg }}>{label}</motion.div>;
};

const TIERS = ['Block', 'Street', 'Hood', 'City'];
const Tier = ({ progress, i }) => {
  const a = 0.1 + i * 0.2;
  const o = useTransform(progress, [a, a + 0.06, a + 0.19, a + 0.24], [0.35, 1, 1, i === 3 ? 1 : 0.35]);
  const bg = useTransform(o, [0.35, 1], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.18)']);
  return <motion.span className="zc-tier" style={{ opacity: o, background: bg }}>{TIERS[i]}</motion.span>;
};

const Racer = ({ progress, from, to, at }) => {
  const x = useTransform(progress, at, [from[0], to[0]]);
  const y = useTransform(progress, at, [from[1], to[1]]);
  const o = useTransform(progress, [at[0], at[0] + 0.04, at[1] - 0.04, at[1]], [0, 1, 1, 0]);
  return <motion.div className="zc-dot" style={{ left: x, top: y, opacity: o }} />;
};

// A real-world zip code board that fills with territory, then zooms out through four tiers.
const ZipcodeScene = ({ progress }) => {
  const scale = useTransform(progress, [0, 0.9], [1.1, 1]);
  const o = useTransform(progress, [0, 0.08], [0, 1]);
  return (
    <div className="zc-wrap">
      <div className="zc-tiers">{TIERS.map((_, i) => <Tier key={i} progress={progress} i={i} />)}</div>
      <motion.div className="zc-grid" style={{ scale, opacity: o }}>
        {Array.from({ length: COLS * ROWS }).map((_, i) => <Cell key={i} progress={progress} i={i} />)}
        <Racer progress={progress} from={['5%', '70%']} to={['90%', '20%']} at={[0.45, 0.7]} />
        <Racer progress={progress} from={['92%', '80%']} to={['10%', '30%']} at={[0.55, 0.8]} />
        <Racer progress={progress} from={['40%', '8%']} to={['60%', '88%']} at={[0.62, 0.88]} />
      </motion.div>
    </div>
  );
};

export default ZipcodeScene;
