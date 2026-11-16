import React from 'react';
import { motion, useTransform } from 'framer-motion';

const HUB = { x: 200, y: 150 };
const TILES = [
  { label: 'Scheduling', x: 70, y: 52 },
  { label: 'Messaging', x: 330, y: 52 },
  { label: 'Parking map', x: 36, y: 150 },
  { label: 'Contracts', x: 364, y: 150 },
  { label: 'Inventory', x: 70, y: 248 },
  { label: 'Docs', x: 330, y: 248 },
];

const Spoke = ({ progress, tile, i }) => {
  const a = 0.18 + i * 0.07;
  const b = a + 0.1;
  const line = useTransform(progress, [a, b], [0, 1]);
  const pop = useTransform(progress, [a + 0.04, b + 0.04], [0, 1]);
  const dotT = useTransform(progress, [0.7 + i * 0.03, 0.86 + i * 0.02], [0, 1]);
  const dx = useTransform(dotT, [0, 1], [HUB.x, tile.x]);
  const dy = useTransform(dotT, [0, 1], [HUB.y, tile.y]);
  const dotO = useTransform(dotT, [0, 0.05, 0.92, 1], [0, 1, 1, 0]);
  return (
    <g>
      <motion.line x1={HUB.x} y1={HUB.y} x2={tile.x} y2={tile.y} stroke="var(--scene-accent)" strokeOpacity="0.55" strokeWidth="2" style={{ pathLength: line }} />
      <motion.g style={{ opacity: pop, scale: pop, transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x={tile.x - 40} y={tile.y - 17} width="80" height="34" rx="9" fill="#101a33" stroke="var(--scene-accent)" strokeOpacity="0.7" />
        <text x={tile.x} y={tile.y + 4} textAnchor="middle" className="sc-label">{tile.label}</text>
      </motion.g>
      <motion.circle r="5" fill="#fff" style={{ cx: dx, cy: dy, opacity: dotO }} />
    </g>
  );
};

// One sign-in at the hub fans out to every app in the suite.
const StaffLaunchScene = ({ progress }) => {
  const hubO = useTransform(progress, [0.02, 0.14], [0, 1]);
  const hubS = useTransform(progress, [0.02, 0.14], [0.6, 1]);
  const pulse = useTransform(progress, [0.14, 0.7, 0.95], [1, 1.12, 1]);
  const youO = useTransform(progress, [0.08, 0.2], [0, 1]);
  return (
    <div className="sc-fill">
      <svg className="sc-svg" viewBox="0 0 400 300" role="img" aria-label="One sign-in hub connected to six apps">
        {TILES.map((t, i) => <Spoke key={t.label} progress={progress} tile={t} i={i} />)}
        <motion.g style={{ opacity: hubO, scale: hubS, transformBox: 'fill-box', transformOrigin: 'center' }}>
          <motion.circle cx={HUB.x} cy={HUB.y} r="38" fill="#0e1a3a" stroke="var(--scene-accent)" strokeWidth="3" style={{ scale: pulse, transformBox: 'fill-box', transformOrigin: 'center' }} />
          <text x={HUB.x} y={HUB.y - 2} textAnchor="middle" className="sc-label" fontSize="12">Staff</text>
          <text x={HUB.x} y={HUB.y + 12} textAnchor="middle" className="sc-label" fontSize="12">Launch</text>
        </motion.g>
        <motion.g style={{ opacity: youO }}>
          <rect x="150" y="0" width="100" height="22" rx="11" fill="#fff" fillOpacity="0.12" stroke="#fff" strokeOpacity="0.4" />
          <text x="200" y="15" textAnchor="middle" className="sc-label">you · one sign-in</text>
        </motion.g>
      </svg>
    </div>
  );
};

export default StaffLaunchScene;
