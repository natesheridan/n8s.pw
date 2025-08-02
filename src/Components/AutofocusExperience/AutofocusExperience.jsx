import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AutofocusExperience.css';

// Interactive block component with CSS 3D transforms
const InteractiveBlock = ({ block, position, onInteract, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const blockRef = useRef();

    const getBlockColor = (type) => {
        switch (type) {
            case 'image': return { bg: '#ff6b6b', shadow: '#ff6b6b' };
            case 'markdown': return { bg: '#4ecdc4', shadow: '#4ecdc4' };
            case 'link': return { bg: '#45b7d1', shadow: '#45b7d1' };
            case 'code': return { bg: '#96ceb4', shadow: '#96ceb4' };
            case 'kanban': return { bg: '#feca57', shadow: '#feca57' };
            case 'checklist': return { bg: '#ff9ff3', shadow: '#ff9ff3' };
            case 'audio': return { bg: '#a55eea', shadow: '#a55eea' };
            case 'menu': return { bg: '#26de81', shadow: '#26de81' };
            case 'stl-viewer': return { bg: '#fd79a8', shadow: '#fd79a8' };
            case 'location': return { bg: '#fdcb6e', shadow: '#fdcb6e' };
            default: return { bg: '#6c5ce7', shadow: '#6c5ce7' };
        }
    };

    const getBlockShape = (type) => {
        switch (type) {
            case 'image': return 'image-block';
            case 'markdown': return 'markdown-block';
            case 'link': return 'link-block';
            default: return 'default-block';
        }
    };

    const getPreviewText = (block) => {
        switch (block.type) {
            case 'markdown':
                const content = block.content.content || '';
                return content.substring(0, 80) + (content.length > 80 ? '...' : '');
            case 'link':
                return block.content.title || 'Link';
            case 'image':
                return block.content.caption || 'Image';
            default:
                return block.type.charAt(0).toUpperCase() + block.type.slice(1);
        }
    };

    const colors = getBlockColor(block.type);

    return (
        <motion.div
            ref={blockRef}
            className={`interactive-block ${getBlockShape(block.type)}`}
            style={{
                '--block-color': colors.bg,
                '--shadow-color': colors.shadow,
                left: `${position.x}%`,
                top: `${position.y}%`,
                zIndex: isHovered ? 100 : 10,
            }}
            initial={{ 
                opacity: 0, 
                scale: 0,
                rotateY: Math.random() * 360,
                rotateX: Math.random() * 20 - 10
            }}
            animate={{ 
                opacity: 1, 
                scale: isHovered ? 1.2 : 1,
                rotateY: isHovered ? 0 : Math.sin(Date.now() * 0.001 + index) * 10,
                rotateX: isHovered ? 0 : Math.cos(Date.now() * 0.0008 + index) * 5,
                y: Math.sin(Date.now() * 0.002 + index) * 10
            }}
            transition={{ 
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 10
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onInteract(block)}
            whileHover={{ 
                scale: 1.3,
                rotateY: 0,
                rotateX: 0,
                boxShadow: `0 20px 60px rgba(${colors.shadow}66, 0.4)`
            }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="block-content">
                <div className="block-icon">
                    {block.type === 'image' && '🖼️'}
                    {block.type === 'markdown' && '📝'}
                    {block.type === 'link' && '🔗'}
                    {block.type === 'code' && '💻'}
                    {block.type === 'kanban' && '📋'}
                    {block.type === 'checklist' && '✅'}
                    {block.type === 'audio' && '🎵'}
                    {block.type === 'menu' && '🍽️'}
                    {block.type === 'stl-viewer' && '🎯'}
                    {block.type === 'location' && '📍'}
                </div>
                <div className="block-preview-text">
                    {getPreviewText(block)}
                </div>
                <div className="block-type-label">
                    {block.type}
                </div>
            </div>
            
            {isHovered && (
                <motion.div 
                    className="block-tooltip"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                >
                    Click to explore
                </motion.div>
            )}
        </motion.div>
    );
};

// Expanded content overlay
const ExpandedContentOverlay = ({ block, onClose }) => {
    const renderBlockContent = () => {
        switch (block.type) {
            case 'image':
                return (
                    <div className="expanded-image">
                        <img 
                            src={block.content.src} 
                            alt={block.content.alt}
                        />
                        {block.content.caption && (
                            <p className="image-caption">{block.content.caption}</p>
                        )}
                    </div>
                );
            
            case 'markdown':
                return (
                    <div className="expanded-markdown">
                        <div 
                            className="markdown-content"
                            dangerouslySetInnerHTML={{ 
                                __html: block.content.content.replace(/\n/g, '<br/>') 
                            }}
                        />
                    </div>
                );
            
            case 'link':
                window.open(block.content.url, '_blank');
                onClose();
                return null;
            
            default:
                return (
                    <div className="expanded-default">
                        <h3>{block.type}</h3>
                        <pre>{JSON.stringify(block.content, null, 2)}</pre>
                    </div>
                );
        }
    };

    return (
        <motion.div 
            className="expanded-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div 
                className="expanded-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="close-button" onClick={onClose}>×</button>
                {renderBlockContent()}
            </motion.div>
        </motion.div>
    );
};

// Main experience component
const AutofocusExperience = () => {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedBlock, setExpandedBlock] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Generate positions for blocks
    const generateBlockPositions = (blocksArray) => {
        return blocksArray.map((_, index) => ({
            x: Math.random() * 80 + 10, // 10% to 90% of container width
            y: Math.random() * 70 + 15, // 15% to 85% of container height
        }));
    };

    // Fetch blocks from Autofocus API
    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://www.autofoc.us/autofocus/all-blocks?api=1');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Filter for supported block types
                const supportedTypes = ['image', 'markdown', 'link', 'code', 'kanban', 'checklist', 'audio', 'menu', 'stl-viewer', 'location'];
                const filteredBlocks = data.filter(block => supportedTypes.includes(block.type));
                
                setBlocks(filteredBlocks);
                setError(null);
            } catch (err) {
                console.error('Error fetching blocks:', err);
                setError(err.message);
                // Use mock data for development
                setBlocks([
                    {
                        id: '1',
                        type: 'image',
                        content: { src: 'https://picsum.photos/600/400', alt: 'Sample image', caption: 'This is a sample image' }
                    },
                    {
                        id: '2',
                        type: 'markdown',
                        content: { content: '# Welcome to Interactive Space\n\nThis is a **markdown** block in a beautiful interactive experience!\n\n- Hover over blocks\n- Click to explore\n- Amazing animations' }
                    },
                    {
                        id: '3',
                        type: 'link',
                        content: { url: 'https://autofoc.us', title: 'Autofoc.us - CMS Platform', description: 'Visit our main platform' }
                    },
                    {
                        id: '4',
                        type: 'code',
                        content: { code: 'console.log("Hello from the future!");', language: 'javascript' }
                    },
                    {
                        id: '5',
                        type: 'kanban',
                        content: { title: 'Project Board', cards: [] }
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlocks();
    }, []);

    // Mouse tracking for parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleBlockInteract = (block) => {
        if (block.type === 'link') {
            window.open(block.content.url, '_blank');
        } else {
            setExpandedBlock(block);
        }
    };

    const blockPositions = generateBlockPositions(blocks);

    if (loading) {
        return (
            <div className="autofocus-loading">
                <motion.div 
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Loading your interactive space...
                </motion.p>
            </div>
        );
    }

    return (
        <div className="autofocus-experience-container">
            <div 
                className="interactive-space"
                style={{
                    transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`
                }}
            >
                <div className="space-background">
                    <div className="stars"></div>
                    <div className="cosmic-dust"></div>
                </div>
                
                <div className="instructions">
                    <p>🌟 Hover over blocks to see them come alive</p>
                    <p>👆 Click to explore content</p>
                </div>

                {blocks.map((block, index) => (
                    <InteractiveBlock
                        key={block.id}
                        block={block}
                        position={blockPositions[index]}
                        onInteract={handleBlockInteract}
                        index={index}
                    />
                ))}
            </div>

            <AnimatePresence>
                {expandedBlock && (
                    <ExpandedContentOverlay 
                        block={expandedBlock} 
                        onClose={() => setExpandedBlock(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AutofocusExperience;