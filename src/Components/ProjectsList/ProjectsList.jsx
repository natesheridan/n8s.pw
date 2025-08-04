import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ProjectsList.css';

// API endpoint for projects
const AUTOFOCUS_API_URL = 'https://www.autofoc.us/api/nate/projects';

// Color mapping for project cards
const colorMap = {
    yellow: '#f7dc6f',
    blue: '#85c1e9',
    green: '#82e5aa',
    pink: '#f8c2c0',
    purple: '#d2b4de',
    orange: '#f4d03f',
    red: '#ec7063'
};

const ProjectsList = ({ maxItems = 6 }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch projects from API
    const fetchProjects = async () => {
        try {
            console.log('🌐 Fetching projects from autofoc.us API...');
            const response = await fetch(AUTOFOCUS_API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`API response not ok: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📥 Received projects from API:', data.length, 'projects');
            
            // Transform API data to project format
            const transformedProjects = data.slice(0, maxItems).map(item => ({
                id: item.id,
                title: item.content.header || 'Project',
                description: item.content.text || item.content.description || 'No description available',
                icon: item.content.icon || '📝',
                color: colorMap[item.content.color] || colorMap.yellow,
                link: item.content.link || null,
                timestamp: new Date(item.created_at).toLocaleDateString()
            }));
            
            setProjects(transformedProjects);
            setLoading(false);
            
        } catch (error) {
            console.error('❌ Error fetching projects from API:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [maxItems]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 20,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        }
    };

    if (loading) {
        return (
            <div className="projects-list loading">
                <div className="loading-spinner"></div>
                <p>Loading projects...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="projects-list error">
                <div className="error-icon">⚠️</div>
                <p>Failed to load projects: {error}</p>
                <button onClick={fetchProjects} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <motion.div 
            className="projects-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="projects-header">
                <h3>Current Projects</h3>
                <p>Live from autofoc.us - the same data powering the whiteboard experience</p>
            </div>
            
            <div className="projects-grid">
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        className="project-card"
                        variants={itemVariants}
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }}
                        style={{
                            '--project-color': project.color
                        }}
                    >
                        <div className="project-icon">{project.icon}</div>
                        <div className="project-content">
                            <h4 className="project-title">{project.title}</h4>
                            <p className="project-description">{project.description}</p>
                            <div className="project-meta">
                                <span className="project-date">{project.timestamp}</span>
                                {project.link && (
                                    <a 
                                        href={project.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="project-link"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View →
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <div className="projects-footer">
                <p>
                    See these projects in action on the{' '}
                    <strong>collaborative whiteboard</strong> - 
                    they appear as interactive sticky notes!
                </p>
            </div>
        </motion.div>
    );
};

export default ProjectsList;