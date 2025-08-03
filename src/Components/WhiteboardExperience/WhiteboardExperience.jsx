import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import './WhiteboardExperience.css';

const TOOLS = {
    PEN: 'pen',
    PAN: 'pan'
};

// Generate unique session ID for this tab
const SESSION_ID = `session-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;

// Default project data as sticky notes
const defaultProjects = [
    {
        "id": "46adc848-8e3f-4672-a328-ad5013748812",
        "type": "sticky-note",
        "content": {
            "header": "About Autofoc.us",
            "description": "A storyteller's playground and creator's integral handshake interaction",
            "icon": "🚀",
            "link": "https://autofoc.us",
            "github": null,
            "autofocus_link": "https://autofoc.us/about"
        },
        "position": { x: 200, y: 150 }
    },
    {
        "id": "project-portfolio-1",
        "type": "sticky-note", 
        "content": {
            "header": "Portfolio Website",
            "description": "React-based portfolio with interactive elements and smooth animations",
            "icon": "💼",
            "link": "https://n8s.pw",
            "github": "https://github.com/user/portfolio",
            "autofocus_link": null
        },
        "position": { x: 450, y: 300 }
    },
    {
        "id": "project-whiteboard-1",
        "type": "sticky-note",
        "content": {
            "header": "Collaborative Whiteboard",
            "description": "Real-time collaborative drawing with Three.js and WebSockets",
            "icon": "🎨",
            "link": null,
            "github": "https://github.com/user/whiteboard",
            "autofocus_link": null
        },
        "position": { x: 100, y: 400 }
    }
];

const WhiteboardExperience = ({ onClose }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const drawingGroupRef = useRef(null);
    const stickyNotesGroupRef = useRef(null);
    
    const [currentTool, setCurrentTool] = useState(TOOLS.PEN);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentStroke, setCurrentStroke] = useState([]);
    const [drawings, setDrawings] = useState([]);
    const [stickyNotes, setStickyNotes] = useState(defaultProjects);
    const [websocket, setWebsocket] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState(0);
    const [isPanning, setIsPanning] = useState(false);
    const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });

    // Camera position and zoom
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 5 });
    const [zoom, setZoom] = useState(1);

    // Refs to access current state in event handlers (avoid closure issues)
    const currentToolRef = useRef(currentTool);
    const isDrawingRef = useRef(isDrawing);
    const isPanningRef = useRef(isPanning);
    const lastPanPositionRef = useRef(lastPanPosition);
    const currentStrokeRef = useRef(currentStroke);
    const cameraPositionRef = useRef(cameraPosition);

    // Update refs when state changes
    useEffect(() => { currentToolRef.current = currentTool; }, [currentTool]);
    useEffect(() => { isDrawingRef.current = isDrawing; }, [isDrawing]);
    useEffect(() => { isPanningRef.current = isPanning; }, [isPanning]);
    useEffect(() => { lastPanPositionRef.current = lastPanPosition; }, [lastPanPosition]);
    useEffect(() => { currentStrokeRef.current = currentStroke; }, [currentStroke]);
    useEffect(() => { cameraPositionRef.current = cameraPosition; }, [cameraPosition]);

    // Initialize Three.js scene (memoized to prevent recreation)
    const initializeScene = useCallback(() => {
        if (!mountRef.current) {
            console.log('Mount ref not available');
            return;
        }

        console.log('Setting up Three.js scene...');

        // Get actual container dimensions
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        
        console.log('Container dimensions:', containerWidth, 'x', containerHeight);

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.OrthographicCamera(
            -containerWidth / 2, containerWidth / 2,
            containerHeight / 2, -containerHeight / 2,
            0.1, 1000
        );
        camera.position.set(0, 0, 5);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: true
        });
        
        // Set explicit size
        renderer.setSize(containerWidth, containerHeight, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';
        
        console.log('Renderer created with size:', containerWidth, 'x', containerHeight);
        console.log('Canvas actual size:', renderer.domElement.width, 'x', renderer.domElement.height);
        
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create drawing group
        const drawingGroup = new THREE.Group();
        scene.add(drawingGroup);
        drawingGroupRef.current = drawingGroup;

        // Create sticky notes group
        const stickyNotesGroup = new THREE.Group();
        scene.add(stickyNotesGroup);
        stickyNotesGroupRef.current = stickyNotesGroup;

        // Add grid background
        addGridBackground(scene);

        // Initial render
        renderer.render(scene, camera);

        // Handle window resize
        const handleResize = () => {
            camera.left = -window.innerWidth / 2;
            camera.right = window.innerWidth / 2;
            camera.top = window.innerHeight / 2;
            camera.bottom = -window.innerHeight / 2;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.render(scene, camera);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Add grid background - much more visible now
    const addGridBackground = (scene) => {
        const gridSize = 50;
        const gridExtent = 3000;
        
        // Main grid
        const gridGeometry = new THREE.BufferGeometry();
        const gridMaterial = new THREE.LineBasicMaterial({ 
            color: 0xd1d5db, 
            opacity: 0.8, 
            transparent: true 
        });

        const points = [];
        
        // Vertical lines
        for (let i = -gridExtent; i <= gridExtent; i += gridSize) {
            points.push(i, -gridExtent, 0);
            points.push(i, gridExtent, 0);
        }
        
        // Horizontal lines
        for (let i = -gridExtent; i <= gridExtent; i += gridSize) {
            points.push(-gridExtent, i, 0);
            points.push(gridExtent, i, 0);
        }

        gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
        scene.add(grid);

        // Add center axes (more visible)
        const axisGeometry = new THREE.BufferGeometry();
        const axisMaterial = new THREE.LineBasicMaterial({ 
            color: 0x6b7280, 
            opacity: 1.0 
        });

        const axisPoints = [
            // X-axis
            -gridExtent, 0, 0,
            gridExtent, 0, 0,
            // Y-axis  
            0, -gridExtent, 0,
            0, gridExtent, 0
        ];

        axisGeometry.setAttribute('position', new THREE.Float32BufferAttribute(axisPoints, 3));
        const axes = new THREE.LineSegments(axisGeometry, axisMaterial);
        scene.add(axes);

        // Add origin marker
        const originGeometry = new THREE.CircleGeometry(10, 8);
        const originMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xef4444, 
            transparent: true, 
            opacity: 0.7 
        });
        const origin = new THREE.Mesh(originGeometry, originMaterial);
        origin.position.set(0, 0, 0.1);
        scene.add(origin);
    };

    // Initialize WebSocket connection (multi-tab simulation)
    const initializeWebSocket = useCallback(() => {
        // Register this session
        const activeSessions = JSON.parse(localStorage.getItem('whiteboard-sessions') || '{}');
        activeSessions[SESSION_ID] = {
            timestamp: Date.now(),
            active: true
        };
        localStorage.setItem('whiteboard-sessions', JSON.stringify(activeSessions));

        // Update user count
        const updateUserCount = () => {
            const sessions = JSON.parse(localStorage.getItem('whiteboard-sessions') || '{}');
            const now = Date.now();
            const activeSessions = Object.keys(sessions).filter(id => 
                sessions[id].active && (now - sessions[id].timestamp) < 10000 // 10 second timeout
            );
            setConnectedUsers(activeSessions.length);
        };

        updateUserCount();

        // Mock WebSocket with localStorage events for cross-tab communication
        const mockSocket = {
            send: (data) => {
                try {
                    const message = JSON.parse(data);
                    if (message.type === 'drawing') {
                        // Store drawing and broadcast to other tabs
                        const existingDrawings = JSON.parse(localStorage.getItem('whiteboard-drawings') || '[]');
                        existingDrawings.push(message.data);
                        localStorage.setItem('whiteboard-drawings', JSON.stringify(existingDrawings));
                        
                        // Trigger storage event for other tabs
                        localStorage.setItem('whiteboard-broadcast', JSON.stringify({
                            type: 'new-drawing',
                            drawing: message.data,
                            timestamp: Date.now(),
                            from: SESSION_ID
                        }));
                    }
                } catch (error) {
                    console.error('WebSocket send error:', error);
                }
            },
            close: () => {
                // Mark session as inactive
                const sessions = JSON.parse(localStorage.getItem('whiteboard-sessions') || '{}');
                if (sessions[SESSION_ID]) {
                    sessions[SESSION_ID].active = false;
                    localStorage.setItem('whiteboard-sessions', JSON.stringify(sessions));
                }
            }
        };

        // Listen for localStorage changes (cross-tab communication)
        const handleStorageChange = (e) => {
            if (e.key === 'whiteboard-broadcast') {
                try {
                    const message = JSON.parse(e.newValue);
                    if (message.from !== SESSION_ID) {
                        if (message.type === 'new-drawing') {
                            // Add the new drawing from another tab
                            setDrawings(prev => {
                                const exists = prev.some(d => d.id === message.drawing.id);
                                if (!exists) {
                                    return [...prev, message.drawing];
                                }
                                return prev;
                            });
                        } else if (message.type === 'clear-canvas') {
                            // Clear canvas from another tab
                            setDrawings([]);
                        }
                    }
                } catch (error) {
                    console.error('Storage event error:', error);
                }
            } else if (e.key === 'whiteboard-sessions') {
                updateUserCount();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Heartbeat to keep session alive
        const heartbeat = setInterval(() => {
            const sessions = JSON.parse(localStorage.getItem('whiteboard-sessions') || '{}');
            if (sessions[SESSION_ID]) {
                sessions[SESSION_ID].timestamp = Date.now();
                localStorage.setItem('whiteboard-sessions', JSON.stringify(sessions));
            }
            updateUserCount();
        }, 5000);

        setWebsocket(mockSocket);

        // Load existing drawings from localStorage
        const existingDrawings = JSON.parse(localStorage.getItem('whiteboard-drawings') || '[]');
        setDrawings(existingDrawings);

        // Cleanup function
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(heartbeat);
            mockSocket.close();
        };
    }, []);

    // Convert screen coordinates to world coordinates (simplified and debugged)
    const screenToWorld = useCallback((clientX, clientY) => {
        if (!rendererRef.current) return { x: 0, y: 0 };
        
        const rect = rendererRef.current.domElement.getBoundingClientRect();
        
        // Simple pixel coordinates relative to canvas center
        const x = clientX - rect.left - rect.width / 2;
        const y = -(clientY - rect.top - rect.height / 2); // Flip Y axis
        
        // Add camera offset
        const worldX = x + cameraPosition.x;
        const worldY = y + cameraPosition.y;
        
        console.log('Mouse:', { clientX, clientY, worldX, worldY, cameraPosition });
        
        return { x: worldX, y: worldY };
    }, [cameraPosition]);

    // Test click handler
    const handleTestClick = useCallback((event) => {
        console.log('🎯 CLICK DETECTED! Canvas is receiving events:', {
            clientX: event.clientX,
            clientY: event.clientY,
            target: event.target,
            currentTarget: event.currentTarget
        });
    }, []);

    // Handle mouse down - use refs for tool state
    const handleMouseDown = useCallback((event) => {
        const tool = currentToolRef.current;
        console.log('🔴 Mouse down (refs):', { tool, button: event.button, clientX: event.clientX, clientY: event.clientY });
        
        event.preventDefault();
        event.stopPropagation();
        
        if (event.button !== 0) return; // Only left mouse button
        
        if (tool === TOOLS.PEN) {
            const worldPos = screenToWorld(event.clientX, event.clientY);
            console.log('🎨 Starting stroke at (refs):', worldPos);
            setIsDrawing(true);
            setCurrentStroke([worldPos]);
        } else if (tool === TOOLS.PAN) {
            console.log('✋ Starting pan (refs)');
            setIsPanning(true);
            setLastPanPosition({ x: event.clientX, y: event.clientY });
        }
    }, [screenToWorld]);

    // Handle mouse move (with refs to avoid dependency issues)
    const handleMouseMove = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('🐁 Mouse move detected:', { 
            tool: currentTool, 
            isDrawing, 
            isPanning,
            clientX: event.clientX, 
            clientY: event.clientY 
        });
        
        if (currentTool === TOOLS.PEN && isDrawing) {
            const worldPos = screenToWorld(event.clientX, event.clientY);
            console.log('🖊️ Adding point to stroke:', worldPos);
            setCurrentStroke(prev => {
                const newStroke = [...prev, worldPos];
                console.log('📏 Current stroke length:', newStroke.length);
                return newStroke;
            });
        } else if (currentTool === TOOLS.PAN && isPanning) {
            const deltaX = event.clientX - lastPanPosition.x;
            const deltaY = event.clientY - lastPanPosition.y;
            
            console.log('🤏 Panning with deltas:', { deltaX, deltaY });
            setCameraPosition(prev => ({
                ...prev,
                x: prev.x - deltaX,
                y: prev.y + deltaY
            }));
            
            setLastPanPosition({ x: event.clientX, y: event.clientY });
        } else {
            console.log('👀 Mouse move ignored - tool:', currentTool, 'drawing:', isDrawing, 'panning:', isPanning);
        }
    }, [currentTool, isDrawing, isPanning, lastPanPosition, screenToWorld]);

    // Handle mouse up - use refs to avoid closure issues
    const handleMouseUp = useCallback((event) => {
        const tool = currentToolRef.current;
        const drawing = isDrawingRef.current;
        const stroke = currentStrokeRef.current;
        
        console.log('🔵 Mouse up (refs):', { tool, drawing, strokeLength: stroke.length });
        
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (tool === TOOLS.PEN && drawing && stroke.length > 1) {
            const newDrawing = {
                id: Date.now().toString(),
                points: [...stroke], // Clone the array
                timestamp: Date.now(),
                color: '#000000' // Black color as requested
            };
            
            console.log('💾 Saving drawing (refs):', newDrawing);
            setDrawings(prev => {
                const updated = [...prev, newDrawing];
                console.log('📊 Total drawings after save:', updated.length);
                return updated;
            });
            
            // Send to WebSocket
            if (websocket) {
                websocket.send(JSON.stringify({
                    type: 'drawing',
                    data: newDrawing
                }));
            }
        }
        
        // Reset states
        setIsDrawing(false);
        setIsPanning(false);
        setCurrentStroke([]);
    }, [websocket]);

    // Update camera position
    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.position.x = cameraPosition.x;
            cameraRef.current.position.y = cameraPosition.y;
            cameraRef.current.updateProjectionMatrix();
        }
    }, [cameraPosition]);

    // Render scene continuously 
    const renderScene = useCallback(() => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
    }, []);

    // Render drawings with debug logging
    useEffect(() => {
        console.log('Rendering drawings:', { 
            drawingsCount: drawings.length, 
            currentStrokeLength: currentStroke.length,
            hasDrawingGroup: !!drawingGroupRef.current,
            hasScene: !!sceneRef.current 
        });

        if (!drawingGroupRef.current || !sceneRef.current) {
            console.log('Missing refs, skipping render');
            return;
        }

        // Clear existing drawings
        while (drawingGroupRef.current.children.length > 0) {
            const child = drawingGroupRef.current.children[0];
            drawingGroupRef.current.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        }

        // Add all persisted drawings
        drawings.forEach((drawing, index) => {
            if (drawing.points && drawing.points.length > 1) {
                console.log(`Rendering drawing ${index}:`, drawing.points.length, 'points');
                const points = drawing.points.flatMap(p => [p.x, p.y, 0.1]);
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
                
                const material = new THREE.LineBasicMaterial({ 
                    color: new THREE.Color(drawing.color || '#000000'), // Default to black if no color
                    linewidth: 8  // Make thicker to see better
                });
                
                const line = new THREE.Line(geometry, material);
                drawingGroupRef.current.add(line);
                console.log('Added line to scene (black)');
            }
        });

        // Add current stroke being drawn (black)
        if (currentStroke.length > 1) {
            console.log('Rendering current stroke:', currentStroke.length, 'points');
            const points = currentStroke.flatMap(p => [p.x, p.y, 0.2]);
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            
            const material = new THREE.LineBasicMaterial({ 
                color: new THREE.Color('#000000'), // Black color for current stroke
                linewidth: 8  // Make thicker to see better
            });
            
            const line = new THREE.Line(geometry, material);
            drawingGroupRef.current.add(line);
            console.log('Added current stroke to scene (black)');
        }

        console.log('Total children in drawing group:', drawingGroupRef.current.children.length);
        renderScene();
    }, [drawings, currentStroke, renderScene]);

    // Animation loop for smooth rendering
    useEffect(() => {
        let animationId;
        
        const animate = () => {
            renderScene();
            animationId = requestAnimationFrame(animate);
        };
        
        animate();
        
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [renderScene]);

    // Initialize everything ONCE when component mounts
    useEffect(() => {
        console.log('🚀 Initializing whiteboard (mount only)...');
        
        let mounted = true;
        let eventCleanup = null;
        
        const setup = async () => {
            if (!mounted) return;
            
            // Step 1: Initialize Three.js scene
            console.log('📋 Step 1: Setting up Three.js...');
            initializeScene();
            
            if (!mounted) return;
            
            // Step 2: Initialize WebSockets
            console.log('📋 Step 2: Setting up WebSockets...');
            initializeWebSocket();
            
            if (!mounted) return;
            
            // Step 3: Setup event listeners after Three.js is ready
            console.log('📋 Step 3: Setting up event listeners...');
            setTimeout(() => {
                if (!mounted) return;
                
                const canvas = rendererRef.current?.domElement;
                if (!canvas) {
                    console.log('❌ No canvas found for event listeners');
                    return;
                }

                console.log('✅ Adding event listeners to canvas', canvas);
                console.log('Canvas dimensions:', canvas.offsetWidth, 'x', canvas.offsetHeight);
                console.log('Canvas position:', canvas.getBoundingClientRect());

                // Add event listeners with options using refs to avoid dependency issues
                const options = { passive: false };
                
                // Create stable event handlers that access current state via refs
                const stableMouseMove = (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    const tool = currentToolRef.current;
                    const drawing = isDrawingRef.current;
                    const panning = isPanningRef.current;
                    
                    console.log('🐁 Mouse move detected (stable):', { 
                        tool,
                        drawing,
                        panning,
                        clientX: event.clientX, 
                        clientY: event.clientY 
                    });
                    
                    if (tool === TOOLS.PEN && drawing) {
                        const rect = rendererRef.current.domElement.getBoundingClientRect();
                        const x = event.clientX - rect.left - rect.width / 2;
                        const y = -(event.clientY - rect.top - rect.height / 2);
                        const camPos = cameraPositionRef.current;
                        const worldX = x + camPos.x;
                        const worldY = y + camPos.y;
                        const worldPos = { x: worldX, y: worldY };
                        
                        console.log('🖊️ Adding point to stroke (refs):', worldPos);
                        setCurrentStroke(prev => {
                            const newStroke = [...prev, worldPos];
                            console.log('📏 Current stroke length (refs):', newStroke.length);
                            return newStroke;
                        });
                    } else if (tool === TOOLS.PAN && panning) {
                        const lastPos = lastPanPositionRef.current;
                        const deltaX = event.clientX - lastPos.x;
                        const deltaY = event.clientY - lastPos.y;
                        
                        console.log('🤏 Panning with deltas (refs):', { deltaX, deltaY });
                        setCameraPosition(prev => ({
                            ...prev,
                            x: prev.x - deltaX,
                            y: prev.y + deltaY
                        }));
                        
                        setLastPanPosition({ x: event.clientX, y: event.clientY });
                    } else {
                        console.log('👀 Mouse move ignored (refs) - tool:', tool, 'drawing:', drawing, 'panning:', panning);
                    }
                };
                
                canvas.addEventListener('click', handleTestClick, options);
                canvas.addEventListener('mousedown', handleMouseDown, options);
                canvas.addEventListener('mousemove', stableMouseMove, options);
                canvas.addEventListener('mouseup', handleMouseUp, options);
                canvas.addEventListener('mouseleave', handleMouseUp, options);
                
                console.log('🎯 Event listeners attached successfully');
                
                // Store cleanup function
                eventCleanup = () => {
                    console.log('🧹 Removing event listeners from canvas');
                    canvas.removeEventListener('click', handleTestClick);
                    canvas.removeEventListener('mousedown', handleMouseDown);
                    canvas.removeEventListener('mousemove', stableMouseMove);
                    canvas.removeEventListener('mouseup', handleMouseUp);
                    canvas.removeEventListener('mouseleave', handleMouseUp);
                };
                
                // Final initialization check
                console.log('✅ Final initialization check:', {
                    hasRenderer: !!rendererRef.current,
                    hasScene: !!sceneRef.current,
                    hasCamera: !!cameraRef.current,
                    hasDrawingGroup: !!drawingGroupRef.current,
                    hasMount: !!mountRef.current,
                    hasCanvas: !!canvas,
                    canvasDimensions: `${canvas.offsetWidth}x${canvas.offsetHeight}`
                });
            }, 300); // Give Three.js time to fully initialize
        };
        
        setup();
        
        return () => {
            console.log('🛑 Component unmounting...');
            mounted = false;
            
            // Clean up event listeners
            if (eventCleanup) {
                eventCleanup();
            }
            
            // Clean up Three.js resources
            if (websocket && websocket.close) {
                websocket.close();
            }
            
            if (rendererRef.current) {
                // Clean up geometry and materials first
                if (drawingGroupRef.current) {
                    while (drawingGroupRef.current.children.length > 0) {
                        const child = drawingGroupRef.current.children[0];
                        drawingGroupRef.current.remove(child);
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) child.material.dispose();
                    }
                }
                
                // Remove canvas from DOM safely
                if (mountRef.current && rendererRef.current.domElement) {
                    try {
                        if (mountRef.current.contains(rendererRef.current.domElement)) {
                            mountRef.current.removeChild(rendererRef.current.domElement);
                        }
                    } catch (error) {
                        console.log('Canvas cleanup error (safe to ignore):', error);
                    }
                }
                
                // Dispose renderer
                rendererRef.current.dispose();
                rendererRef.current = null;
            }
            
            // Clear refs
            sceneRef.current = null;
            cameraRef.current = null;
            drawingGroupRef.current = null;
            stickyNotesGroupRef.current = null;
        };
    }, []); // EMPTY DEPS - only run on mount/unmount



    const clearCanvas = () => {
        setDrawings([]);
        localStorage.removeItem('whiteboard-drawings');
        
        // Broadcast clear event to other tabs
        localStorage.setItem('whiteboard-broadcast', JSON.stringify({
            type: 'clear-canvas',
            timestamp: Date.now(),
            from: SESSION_ID
        }));
    };

    return (
        <div className="whiteboard-container">
            {/* Toolbar */}
            <motion.div 
                className="whiteboard-toolbar"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="tool-group">
                    <button
                        className={`tool-button ${currentTool === TOOLS.PEN ? 'active' : ''}`}
                        onClick={() => setCurrentTool(TOOLS.PEN)}
                        title="Pen Tool"
                    >
                        ✏️
                    </button>
                    <button
                        className={`tool-button ${currentTool === TOOLS.PAN ? 'active' : ''}`}
                        onClick={() => setCurrentTool(TOOLS.PAN)}
                        title="Pan Tool"
                    >
                        ✋
                    </button>
                </div>
                
                <div className="tool-group">
                    <button
                        className="tool-button"
                        onClick={clearCanvas}
                        title="Clear Canvas"
                    >
                        🗑️
                    </button>
                </div>

                <div className="status-group">
                    <span className="connection-status">
                        🟢 {connectedUsers} user{connectedUsers !== 1 ? 's' : ''} online
                    </span>
                </div>

                <button
                    className="close-button"
                    onClick={onClose}
                    title="Exit Whiteboard"
                >
                    ✕
                </button>
            </motion.div>

            {/* Canvas */}
            <div 
                ref={mountRef} 
                className="whiteboard-canvas"
                style={{ cursor: currentTool === TOOLS.PEN ? 'crosshair' : 'grab' }}
            />

            {/* Instructions & Debug */}
            <motion.div 
                className="whiteboard-instructions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <p>
                    {currentTool === TOOLS.PEN ? '✏️ Click and drag to draw' : '✋ Click and drag to pan'}
                </p>
                <p>🎯 Canvas starts at (0,0) and extends infinitely</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                    Debug: Tool={currentTool} | Drawing={isDrawing ? 'YES' : 'NO'} | 
                    Stroke={currentStroke.length} | Saved={drawings.length} | 
                    Camera=({Math.round(cameraPosition.x)}, {Math.round(cameraPosition.y)})
                </p>
            </motion.div>
        </div>
    );
};

export default WhiteboardExperience;