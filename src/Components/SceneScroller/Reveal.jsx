import React from 'react';
import { motion, useTransform } from 'framer-motion';

// Scroll-scrubbed reveal: fades/slides/scales children in between progress a and b.
// `out` (optional [c, d]) fades them back out between c and d.
const Reveal = ({ progress, at, from = {}, out, className, style, children }) => {
  const [a, b] = at;
  const opacity = out
    ? useTransform(progress, [a, b, out[0], out[1]], [0, 1, 1, 0])
    : useTransform(progress, [a, b], [0, 1]);
  const x = useTransform(progress, [a, b], [from.x ?? 0, 0]);
  const y = useTransform(progress, [a, b], [from.y ?? 0, 0]);
  const scale = useTransform(progress, [a, b], [from.scale ?? 1, 1]);
  return (
    <motion.div className={className} style={{ opacity, x, y, scale, ...style }}>
      {children}
    </motion.div>
  );
};

export default Reveal;
