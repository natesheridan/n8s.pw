import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './ProjectCard.css';

const ProjectCard = ({ project, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        const rotateX = (mouseY / (rect.height / 2)) * 15;
        const rotateY = -(mouseX / (rect.width / 2)) * 15;
        
        setRotation({ x: rotateX, y: rotateY });
    };

    const resetRotation = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={cardRef}
            className={`project-card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                resetRotation();
            }}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
                opacity: 1, 
                y: 0,
                rotateX: rotation.x,
                rotateY: rotation.y,
                z: isHovered ? 50 : 0
            }}
            transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
            }}
            style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
                '--project-color': project.color || '#6b73ff'
            }}
        >
            <div className="card-content" style={{ transform: `translateZ(${isHovered ? 20 : 0}px)` }}>
                <div className="card-image">
                    <img src={project.thumbnail} alt={project.title} />
                    {project.featured && <span className="featured-badge">Featured</span>}
                </div>
                <div className="card-info">
                    <h3>
                        {project.icon && <span className="project-icon">{project.icon}</span>}
                        {project.title}
                    </h3>
                    <p className="subtitle">{project.subtitle}</p>
                    <div className="tags">
                        {project.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                        ))}
                    </div>
                    <p className="description">{project.description}</p>
                    <div className="metrics">
                        {Object.entries(project.metrics).map(([key, value], index) => (
                            <div key={index} className="metric">
                                <span className="metric-value">{value}</span>
                                <span className="metric-label">{key}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card-actions">
                    {Object.entries(project.links).map(([key, url], index) => (
                        <a 
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`action-button ${key}`}
                        >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard; 