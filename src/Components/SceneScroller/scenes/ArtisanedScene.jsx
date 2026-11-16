import React from 'react';
import { motion, useTransform } from 'framer-motion';
import Reveal from '../Reveal';

const Ring = ({ progress, r, at, label }) => {
  const draw = useTransform(progress, at, [0, 1]);
  const o = useTransform(progress, [at[0], at[0] + 0.05], [0, 1]);
  return (
    <g>
      <g transform="rotate(-90 200 150)">
        <motion.circle cx="200" cy="150" r={r} fill="none" stroke="var(--scene-accent)" strokeWidth="2" pathLength="1" strokeDasharray="1" style={{ pathLength: draw, opacity: o }} />
      </g>
      <motion.text x="200" y={150 - r - 6} textAnchor="middle" className="sc-label" style={{ opacity: o }}>{label}</motion.text>
    </g>
  );
};

// A viewfinder that "understands" an object in three escalating rings. Concept only.
const ArtisanedScene = ({ progress }) => {
  const obj = useTransform(progress, [0.05, 0.3], [0, 1]);
  const objFill = useTransform(progress, [0.3, 0.45], [0, 0.18]);
  const brk = useTransform(progress, [0.02, 0.14], [1.35, 1]);
  const brkO = useTransform(progress, [0.02, 0.12], [0, 1]);
  return (
    <div className="sc-fill">
      <svg className="sc-svg" viewBox="0 0 400 300" role="img" aria-label="Concept: an AR viewfinder with three escalating phases">
        <motion.g style={{ scale: brk, opacity: brkO, transformBox: 'fill-box', transformOrigin: 'center' }} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M20 50 V20 H50" /><path d="M350 20 H380 V50" /><path d="M20 250 V280 H50" /><path d="M350 280 H380 V250" />
        </motion.g>
        <motion.path
          d="M175 100 C165 120 160 150 172 185 C178 205 190 215 200 215 C210 215 222 205 228 185 C240 150 235 120 225 100 Z"
          fill="var(--scene-accent)" stroke="#fff" strokeWidth="2.5" style={{ pathLength: obj, fillOpacity: objFill }}
        />
        <Ring progress={progress} r={62} at={[0.3, 0.5]} label="Phase 1" />
        <Ring progress={progress} r={98} at={[0.5, 0.7]} label="Phase 2" />
        <Ring progress={progress} r={134} at={[0.7, 0.9]} label="Phase 3" />
      </svg>
      <Reveal progress={progress} at={[0.05, 0.15]} from={{ scale: 1.6 }} className="ar-stamp">CONCEPT</Reveal>
    </div>
  );
};

export default ArtisanedScene;
