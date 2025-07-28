import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const useParallax = (offset = ["start end", "end start"]) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-25%', '25%']);
  return { ref, y };
}; 