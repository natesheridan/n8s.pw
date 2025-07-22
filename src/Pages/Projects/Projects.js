import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../../Components/ProjectCard/ProjectCard';
import { projects, categories, filters } from './ProjectsData';
import './Projects.css';

const Projects = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSort, setSelectedSort] = useState('Latest');
    const [selectedTimeframe, setSelectedTimeframe] = useState('All Time');
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [searchQuery, setSearchQuery] = useState('');
    const [isGridView, setIsGridView] = useState(true);

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
        <section className="projects-section">
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
                        margin: "0"
                    }}>
                        🚧 This page is a work in progress! I'm currently updating it to integrate with <a 
                            href="https://autofoc.us"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#6B73FF",
                                fontWeight: "600",
                                textDecoration: "underline"
                            }}
                        >autofoc.us</a>, my main side project. Check it out - you'll find my projects there too! 🚀
                    </p>
                </div>
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
                    {filteredProjects.map((project, index) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project}
                            index={index}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </section>
    );
};

export default Projects;
