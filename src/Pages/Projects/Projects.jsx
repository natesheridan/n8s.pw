import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../../Components/ProjectCard/ProjectCard';
import AutofocusExperience from '../../Components/AutofocusExperience/AutofocusExperience';
import AutofocusGameExperience from '../../Components/AutofocusGameExperience/AutofocusGameExperience';
import { projects, categories, filters } from './ProjectsData';
import './Projects.css';

const pageVariants = {
    initial: {
        opacity: 0,
        y: "-100vh"
    },
    in: {
        opacity: 1,
        y: 0
    },
    out: {
        opacity: 0,
        y: "100vh"
    }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 1.2
};

const Projects = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSort, setSelectedSort] = useState('Latest');
    const [selectedTimeframe, setSelectedTimeframe] = useState('All Time');
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [searchQuery, setSearchQuery] = useState('');
    const [isGridView, setIsGridView] = useState(true);
    const [is3DView, setIs3DView] = useState(false);
    const [experienceMode, setExperienceMode] = useState('normal'); // 'normal', 'interactive', 'game'

    const filterProjects = useCallback(() => {
        let filtered = [...projects];

        // Category filter
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(project => project.category === selectedCategory);
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Sort
        switch (selectedSort) {
            case 'Latest':
                filtered.sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate));
                break;
            case 'Most Popular':
                filtered.sort((a, b) => {
                    const aMetrics = Object.values(a.metrics)[0];
                    const bMetrics = Object.values(b.metrics)[0];
                    return parseInt(bMetrics) - parseInt(aMetrics);
                });
                break;
            case 'Featured':
                filtered.sort((a, b) => b.featured - a.featured);
                break;
            default:
                break;
        }

        setFilteredProjects(filtered);
    }, [selectedCategory, selectedSort, searchQuery]);

    useEffect(() => {
        filterProjects();
    }, [filterProjects]);

    return (
        <motion.section 
            className="projects-section"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <motion.div 
                className="projects-header"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>My Projects</h1>
                <div className="projects-notice" style={{
                    padding: "20px",
                    margin: "0 0 30px 0",
                    background: "var(--glass-bg)",
                    borderRadius: "12px",
                    border: "1px solid var(--glass-border)",
                    backdropFilter: "blur(var(--blur-strength))"
                }}>
                    <p style={{
                        fontSize: "1.1em",
                        lineHeight: "1.6",
                        color: "var(--text-secondary)",
                        margin: "0 0 15px 0"
                    }}>
                        ✨ <strong>NEW!</strong> Experience my projects in multiple interactive modes powered by <a 
                            href="https://autofoc.us"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#6B73FF",
                                fontWeight: "600",
                                textDecoration: "underline"
                            }}
                        >autofoc.us</a> - my custom CMS! 🚀
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button 
                            onClick={() => {
                                setExperienceMode('interactive');
                                setIs3DView(true);
                            }}
                            style={{
                                background: experienceMode === 'interactive' && is3DView ? "linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)" : "transparent",
                                border: "2px solid #4ECDC4",
                                color: experienceMode === 'interactive' && is3DView ? "white" : "#4ECDC4",
                                padding: "10px 15px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "0.9em",
                                transition: "all 0.3s ease",
                                transform: experienceMode === 'interactive' && is3DView ? "scale(1.05)" : "scale(1)"
                            }}
                        >
                            🌟 Interactive Space
                        </button>
                        <button 
                            onClick={() => {
                                setExperienceMode('game');
                                setIs3DView(true);
                            }}
                            style={{
                                background: experienceMode === 'game' && is3DView ? "linear-gradient(135deg, #6B73FF 0%, #FF6B6B 100%)" : "transparent",
                                border: "2px solid #6B73FF",
                                color: experienceMode === 'game' && is3DView ? "white" : "#6B73FF",
                                padding: "10px 15px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "0.9em",
                                transition: "all 0.3s ease",
                                transform: experienceMode === 'game' && is3DView ? "scale(1.05)" : "scale(1)"
                            }}
                        >
                            🎮 Game Mode
                        </button>
                        {is3DView && (
                            <button 
                                onClick={() => setIs3DView(false)}
                                style={{
                                    background: "rgba(255, 107, 107, 0.2)",
                                    border: "2px solid #FF6B6B",
                                    color: "#FF6B6B",
                                    padding: "10px 15px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    fontSize: "0.9em",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                ✕ Exit Experience
                            </button>
                        )}
                    </div>
                </div>
                {!is3DView && (
                    <>
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filters">
                            <select 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="All">All Categories</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                            <select 
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                            >
                                {filters.sort.map((sort, index) => (
                                    <option key={index} value={sort}>{sort}</option>
                                ))}
                            </select>
                            <select
                                value={selectedTimeframe}
                                onChange={(e) => setSelectedTimeframe(e.target.value)}
                            >
                                {filters.timeframe.map((time, index) => (
                                    <option key={index} value={time}>{time}</option>
                                ))}
                            </select>
                            <button 
                                className="view-toggle"
                                onClick={() => setIsGridView(!isGridView)}
                            >
                                {isGridView ? 'List View' : 'Grid View'}
                            </button>
                        </div>
                    </>
                )}
            </motion.div>

            {is3DView ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000 }}
                >
                    {experienceMode === 'interactive' ? (
                        <AutofocusExperience />
                    ) : experienceMode === 'game' ? (
                        <AutofocusGameExperience />
                    ) : null}
                </motion.div>
            ) : (
                <AnimatePresence>
                    <motion.div 
                        className={`projects-container ${isGridView ? 'grid-view' : 'list-view'}`}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                    >
                        {filteredProjects.map((project, index) => (
                            <ProjectCard 
                                key={project.id} 
                                project={project}
                                index={index}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}
        </motion.section>
    );
};

export default Projects;
