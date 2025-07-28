import React from 'react';
import { motion } from 'framer-motion';
import './SkillsChart.css';

const SkillsChart = ({ skills }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="skills-chart"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {skills.map((skill, index) => (
        <div className="skill-item" key={index}>
          <div className="skill-name">{skill.name}</div>
          <div className="skill-bar-container">
            <motion.div
              className="skill-bar"
              style={{ width: `${skill.level}%` }}
              variants={itemVariants}
            ></motion.div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default SkillsChart; 