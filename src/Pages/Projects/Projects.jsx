import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaThLarge, FaBars } from 'react-icons/fa';
import './Projects.css';

// How much of a project's text shows at rest before hover reveals the rest.
const PREVIEW_LENGTH = 150;
// Characters revealed per typing tick — chunked so long descriptions don't
// take forever to finish typing out.
const CHARS_PER_TICK = 3;
const TICK_MS = 16;

const ProjectTile = ({ project, hasLink, accent, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [typedExtra, setTypedExtra] = useState('');
    const intervalRef = useRef(null);

    const needsReveal = project.text.length > PREVIEW_LENGTH;
    const preview = needsReveal
        ? project.text.slice(0, PREVIEW_LENGTH).replace(/\s+\S*$/, '')
        : project.text;
    const remainder = needsReveal ? project.text.slice(preview.length) : '';

    const clearTyping = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleEnter = () => {
        setIsHovered(true);
        if (!needsReveal) return;
        clearTyping();
        intervalRef.current = setInterval(() => {
            setTypedExtra((current) => {
                if (current.length >= remainder.length) {
                    clearTyping();
                    return current;
                }
                return remainder.slice(0, current.length + CHARS_PER_TICK);
            });
        }, TICK_MS);
    };

    const handleLeave = () => {
        setIsHovered(false);
        clearTyping();
        setTypedExtra('');
    };

    useEffect(() => () => clearTyping(), []);

    const isTyping = isHovered && needsReveal && typedExtra.length < remainder.length;
    const displayText = isHovered
        ? preview + typedExtra
        : preview + (needsReveal ? '…' : '');

    const textBlock = (
        <p className="project-text">
            {displayText}
            {isTyping && <span className="typing-cursor" />}
        </p>
    );

    return (
        <motion.div
            layout
            className={`project-tile ${hasLink ? 'has-link' : 'no-link'}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
            whileHover={hasLink ? { y: -6 } : undefined}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            onClick={() => {
                if (hasLink) {
                    window.open(project.link, '_blank', 'noopener,noreferrer');
                }
            }}
            style={{ '--accent': accent }}
        >
            <span className="project-icon-watermark" aria-hidden="true">{project.icon}</span>
            <h3 className="project-title">{project.header}</h3>
            {textBlock}
            {!hasLink && <span className="project-no-link">No link yet</span>}
        </motion.div>
    );
};

// API endpoint for projects
const AUTOFOCUS_API_URL = 'https://www.autofoc.us/api/nate/projects';

// Subtle accent tint per project (used as a thin edge + icon glow, not a full
// background wash — keeps each card feeling distinct without breaking the
// site's dark theme).
const colorMap = {
    yellow: '#f2c94c',
    blue: '#6b9fff',
    green: '#6ee7a0',
    pink: '#f6a6c1',
    purple: '#b39ddb',
    orange: '#f2994a',
    red: '#f16a6a'
};

const sortOptions = ['Latest', 'Most Popular', 'Alphabetical'];

const pageVariants = {
    initial: { opacity: 0, y: '-100vh' },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: '100vh' }
};

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 1.2
};

const Projects = () => {
    const [selectedSort, setSelectedSort] = useState('Latest');
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isGridView, setIsGridView] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(AUTOFOCUS_API_URL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`API response not ok: ${response.status}`);
            }

            const data = await response.json();

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
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (projects.length === 0) {
            setFilteredProjects([]);
            return;
        }

        let filtered = [...projects];

        if (searchQuery) {
            filtered = filtered.filter(project =>
                project.header.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.text.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

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
                    <h2>Loading projects…</h2>
                    <p>Pulling the latest from autofoc.us</p>
                </div>
            </motion.section>
        );
    }

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
                    <h2>Couldn't load projects</h2>
                    <p>{error}</p>
                    <button onClick={fetchProjects} className="projects-retry-button">
                        Try again
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
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <p className="projects-kicker">~/projects</p>
                <h1>Things I've built</h1>
                <p className="projects-subhead">Side projects, experiments, and things that mostly work.</p>

                <div className="projects-controls">
                    <div className="search-bar">
                        <FaSearch className="search-icon" aria-hidden="true" />
                        <input
                            type="text"
                            placeholder="Search projects…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="controls-right">
                        <div className="sort-pills" role="tablist" aria-label="Sort projects">
                            {sortOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    role="tab"
                                    aria-selected={selectedSort === option}
                                    className={`sort-pill ${selectedSort === option ? 'active' : ''}`}
                                    onClick={() => setSelectedSort(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <div className="view-toggle" role="group" aria-label="Layout">
                            <button
                                type="button"
                                aria-label="Grid view"
                                aria-pressed={isGridView}
                                className={isGridView ? 'active' : ''}
                                onClick={() => setIsGridView(true)}
                            >
                                <FaThLarge />
                            </button>
                            <button
                                type="button"
                                aria-label="List view"
                                aria-pressed={!isGridView}
                                className={!isGridView ? 'active' : ''}
                                onClick={() => setIsGridView(false)}
                            >
                                <FaBars />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                <motion.div
                    className={`projects-container ${isGridView ? 'grid-view' : 'list-view'}`}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
                    }}
                >
                    {filteredProjects.length === 0 ? (
                        <div className="projects-empty">
                            <p>No projects found</p>
                            <p className="projects-empty-sub">
                                {searchQuery ? 'Try adjusting your search' : 'Projects will appear here once loaded'}
                            </p>
                        </div>
                    ) : (
                        filteredProjects.map((project, index) => {
                            const hasLink = project.link && project.link.trim() !== '';
                            const accent = colorMap[project.color] || colorMap.yellow;

                            return (
                                <ProjectTile
                                    key={project.id}
                                    project={project}
                                    hasLink={hasLink}
                                    accent={accent}
                                    index={index}
                                />
                            );
                        })
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.section>
    );
};

export default Projects;
