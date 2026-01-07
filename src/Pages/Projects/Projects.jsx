import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Projects.css';

// API endpoint for projects
const AUTOFOCUS_API_URL = 'https://www.autofoc.us/api/nate/projects';

// Color mapping for sticky note colors
const colorMap = {
    yellow: '#f7dc6f',
    blue: '#85c1e9', 
    green: '#82e5aa',
    pink: '#f8c2c0',
    purple: '#d2b4de',
    orange: '#f4d03f',
    red: '#ec7063'
};

const filters = {
    sort: ["Latest", "Most Popular", "Alphabetical"],
    timeframe: ["All Time", "This Year", "This Month"]
};

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
    const [selectedSort, setSelectedSort] = useState('Latest');
    const [selectedTimeframe, setSelectedTimeframe] = useState('All Time');
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isGridView, setIsGridView] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch projects from API
    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
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
            
            // Use API data directly - minimal transformation
            const transformedProjects = data.map((item) => ({
                id: item.id,
                header: item.content.header || 'Untitled',
                text: item.content.text || '',
                icon: item.content.icon || '📝',
                color: item.content.color || 'yellow',
                link: item.content.link || '',
                image: item.content.image || '',
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                viewCount: item.view_count || 0,
                interactionCount: item.interaction_count || 0,
                orderIndex: item.order_index || 0
            }));
            
            setProjects(transformedProjects);
            setLoading(false);
            
        } catch (error) {
            console.error('❌ Error fetching projects from API:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    // Load projects on component mount
    useEffect(() => {
        fetchProjects();
    }, []);

    // Filter and sort projects
    useEffect(() => {
        if (projects.length === 0) {
            setFilteredProjects([]);
            return;
        }

        let filtered = [...projects];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(project => 
                project.header.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.text.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        switch (selectedSort) {
            case 'Latest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'Most Popular':
                filtered.sort((a, b) => {
                    const aTotal = (a.viewCount || 0) + (a.interactionCount || 0);
                    const bTotal = (b.viewCount || 0) + (b.interactionCount || 0);
                    return bTotal - aTotal;
                });
                break;
            case 'Alphabetical':
                filtered.sort((a, b) => a.header.localeCompare(b.header));
                break;
            default:
                break;
        }

        setFilteredProjects(filtered);
    }, [projects, selectedSort, searchQuery]);

    // Loading state
    if (loading) {
        return (
            <motion.section 
                className="projects-section"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                <div className="projects-loading">
                    <div className="loading-spinner"></div>
                    <h2>Loading Projects...</h2>
                    <p>Fetching latest data from autofoc.us</p>
                </div>
            </motion.section>
        );
    }

    // Error state
    if (error) {
        return (
            <motion.section 
                className="projects-section"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                <div className="projects-error">
                    <div className="error-icon">⚠️</div>
                    <h2>Failed to Load Projects</h2>
                    <p>Error: {error}</p>
                    <button onClick={fetchProjects} className="retry-button">
                        Try Again
                    </button>
                </div>
            </motion.section>
        );
    }

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
                <h1>Projects</h1>
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
            </motion.div>

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
                    {filteredProjects.length === 0 ? (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: 'rgba(255,255,255,0.7)'
                        }}>
                            <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>No projects found</p>
                            <p style={{ fontSize: '0.9em' }}>
                                {searchQuery ? 'Try adjusting your search' : 'Projects will appear here once loaded'}
                            </p>
                        </div>
                    ) : (
                        filteredProjects.map((project, index) => {
                            const hasLink = project.link && project.link.trim() !== '';
                            const cardColor = colorMap[project.color] || colorMap.yellow;
                            
                            return (
                                <motion.div
                                    key={project.id}
                                    className={`sticky-note-card ${hasLink ? 'has-link' : 'no-link'}`}
                                    initial={{ opacity: 0, y: 50, rotate: -2 }}
                                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                                    transition={{ 
                                        duration: 0.5,
                                        delay: index * 0.1,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{ 
                                        scale: 1.05,
                                        rotate: hasLink ? 2 : 0,
                                        zIndex: 10
                                    }}
                                    onClick={() => {
                                        if (hasLink) {
                                            window.open(project.link, '_blank', 'noopener,noreferrer');
                                        }
                                    }}
                                    style={{
                                        '--card-color': cardColor,
                                        cursor: hasLink ? 'pointer' : 'default'
                                    }}
                                >
                                    <div className="sticky-note-header">
                                        <span className="sticky-note-icon">{project.icon}</span>
                                        <h3 className="sticky-note-title">{project.header}</h3>
                                    </div>
                                    <div className="sticky-note-content">
                                        <p>{project.text}</p>
                                    </div>
                                    {hasLink && (
                                        <div className="sticky-note-link-indicator">
                                            <span>Click to visit →</span>
                                        </div>
                                    )}
                                    {!hasLink && (
                                        <div className="sticky-note-no-link-indicator">
                                            <span>No link available</span>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.section>
    );
};

export default Projects;
