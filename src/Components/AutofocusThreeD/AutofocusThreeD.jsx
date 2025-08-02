import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
    OrbitControls, 
    Text, 
    Box, 
    Sphere, 
    Plane,
    Html,
    Environment,
    Stars
} from '@react-three/drei';
import { 
    EffectComposer,
    Bloom,
    Noise,
    Vignette
} from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import './AutofocusThreeD.css';

// Block component that represents a 3D interactive block
const Block3D = ({ block, position, onInteract, isExpanded }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    
    // Animate the block rotation and hover effects
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
            
            if (hovered) {
                meshRef.current.scale.setScalar(1.2);
            } else {
                meshRef.current.scale.setScalar(1);
            }
        }
    });

    const getBlockColor = (type) => {
        switch (type) {
            case 'image': return '#ff6b6b';
            case 'markdown': return '#4ecdc4';
            case 'link': return '#45b7d1';
            case 'code': return '#96ceb4';
            case 'kanban': return '#feca57';
            case 'checklist': return '#ff9ff3';
            case 'audio': return '#a55eea';
            case 'menu': return '#26de81';
            case 'stl-viewer': return '#fd79a8';
            case 'location': return '#fdcb6e';
            default: return '#6c5ce7';
        }
    };

    const getBlockShape = (type) => {
        switch (type) {
            case 'image':
                return <Box args={[2, 1.5, 0.2]} />;
            case 'markdown':
                return <Box args={[1.5, 2, 0.3]} />;
            case 'link':
                return <Sphere args={[0.8, 16, 16]} />;
            default:
                return <Box args={[1, 1, 1]} />;
        }
    };

    const getPreviewText = (block) => {
        switch (block.type) {
            case 'markdown':
                const content = block.content.content || '';
                return content.substring(0, 100) + (content.length > 100 ? '...' : '');
            case 'link':
                return block.content.title || 'Link';
            case 'image':
                return block.content.caption || 'Image';
            default:
                return block.type.charAt(0).toUpperCase() + block.type.slice(1);
        }
    };

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => onInteract(block)}
            >
                {getBlockShape(block.type)}
                <meshStandardMaterial 
                    color={getBlockColor(block.type)}
                    emissive={hovered ? getBlockColor(block.type) : '#000000'}
                    emissiveIntensity={hovered ? 0.2 : 0}
                    transparent
                    opacity={0.8}
                />
            </mesh>
            
            <Text
                position={[0, -1.5, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={4}
                textAlign="center"
            >
                {getPreviewText(block)}
            </Text>
            
            {hovered && (
                <Html center>
                    <div className="block-tooltip">
                        <p>{block.type}</p>
                        <small>Click to explore</small>
                    </div>
                </Html>
            )}
        </group>
    );
};

// Expanded block overlay component
const ExpandedBlockOverlay = ({ block, onClose }) => {
    const renderBlockContent = () => {
        switch (block.type) {
            case 'image':
                return (
                    <div className="expanded-image">
                        <img 
                            src={block.content.src} 
                            alt={block.content.alt}
                            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
        >
            <div className="expanded-content">
                <button className="close-button" onClick={onClose}>×</button>
                {renderBlockContent()}
            </div>
        </motion.div>
    );
};

// Camera controller for smooth movement
const CameraController = () => {
    const { camera } = useThree();
    const controlsRef = useRef();
    
    useFrame(() => {
        if (controlsRef.current) {
            controlsRef.current.update();
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.4}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI * 0.75}
            minPolarAngle={Math.PI * 0.25}
        />
    );
};

// Main 3D Scene component
const AutofocusScene = ({ blocks, onBlockInteract }) => {
    // Generate positions for blocks in a 3D grid with some randomization
    const generateBlockPositions = (blocksArray) => {
        const positions = [];
        const gridSize = Math.ceil(Math.sqrt(blocksArray.length));
        const spacing = 6;
        
        blocksArray.forEach((block, index) => {
            const x = (index % gridSize - gridSize / 2) * spacing + (Math.random() - 0.5) * 2;
            const y = Math.random() * 10 - 5;
            const z = (Math.floor(index / gridSize) - gridSize / 2) * spacing + (Math.random() - 0.5) * 2;
            positions.push([x, y, z]);
        });
        
        return positions;
    };

    const blockPositions = generateBlockPositions(blocks);

    return (
        <>
            <CameraController />
            
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ecdc4" />
            <spotLight position={[0, 20, 0]} intensity={0.8} penumbra={1} />
            
            {/* Background environment */}
            <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} />
            <Environment preset="night" />
            
            {/* Render all blocks */}
            {blocks.map((block, index) => (
                <Block3D
                    key={block.id}
                    block={block}
                    position={blockPositions[index]}
                    onInteract={onBlockInteract}
                />
            ))}
            
            {/* Ground plane with grid */}
            <Plane args={[200, 200]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
                <meshStandardMaterial 
                    color="#1a1a2e" 
                    transparent 
                    opacity={0.3}
                    wireframe
                />
            </Plane>
            
            {/* Post-processing effects */}
            <EffectComposer>
                <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
                <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0.1} darkness={0.5} />
            </EffectComposer>
        </>
    );
};

// Main component
const AutofocusThreeD = () => {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedBlock, setExpandedBlock] = useState(null);

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
                        content: { content: '# Welcome to 3D Space\n\nThis is a **markdown** block rendered in 3D!\n\n- Interactive\n- Immersive\n- Amazing' }
                    },
                    {
                        id: '3',
                        type: 'link',
                        content: { url: 'https://autofoc.us', title: 'Autofoc.us - CMS Platform', description: 'Visit our main platform' }
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlocks();
    }, []);

    const handleBlockInteract = (block) => {
        if (block.type === 'link') {
            window.open(block.content.url, '_blank');
        } else {
            setExpandedBlock(block);
        }
    };

    if (loading) {
        return (
            <div className="autofocus-loading">
                <div className="loading-spinner"></div>
                <p>Loading your 3D projects...</p>
            </div>
        );
    }

    if (error) {
        console.warn('API Error, using mock data:', error);
    }

    return (
        <div className="autofocus-threed-container">
            <div className="threed-instructions">
                <p>🎮 Navigate: Drag to rotate • Scroll to zoom • Right-click drag to pan</p>
                <p>👆 Click on any block to explore!</p>
            </div>
            
            <Canvas
                camera={{ position: [10, 10, 10], fov: 75 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)' }}
            >
                <Suspense fallback={null}>
                    <AutofocusScene 
                        blocks={blocks} 
                        onBlockInteract={handleBlockInteract}
                    />
                </Suspense>
            </Canvas>
            
            {expandedBlock && (
                <ExpandedBlockOverlay 
                    block={expandedBlock} 
                    onClose={() => setExpandedBlock(null)}
                />
            )}
        </div>
    );
};

export default AutofocusThreeD;