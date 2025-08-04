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

// API endpoint for sticky notes
const AUTOFOCUS_API_URL = 'https://www.autofoc.us/api/nate/projects';

// Generate random position with reasonable collision detection
const generateRandomPosition = (viewportWidth = window.innerWidth, viewportHeight = window.innerHeight, existingPositions = [], noteWidth = 220, noteHeight = 180) => {
    const margin = 200; // Reasonable margin
    const minDistance = Math.max(280, Math.max(noteWidth, noteHeight) * 1.3); // More reasonable minimum distance
    
    // Create a reasonable spread area
    const spreadWidth = Math.max(viewportWidth * 1.8, 1400);
    const spreadHeight = Math.max(viewportHeight * 1.3, 900);
    
    let attempts = 0;
    const maxAttempts = 50; // Reasonable attempts
    
    console.log(`📍 Generating position for ${noteWidth}x${noteHeight} note, minDistance: ${minDistance}`);
    
    while (attempts < maxAttempts) {
        const position = {
            x: (Math.random() - 0.5) * (spreadWidth - margin * 2 - noteWidth),
            y: (Math.random() - 0.5) * (spreadHeight - margin * 2 - noteHeight)
        };
        
        // Check for collision with existing notes
        let collision = false;
        for (const existingPos of existingPositions) {
            const distance = Math.sqrt(
                Math.pow(position.x - existingPos.x, 2) + 
                Math.pow(position.y - existingPos.y, 2)
            );
            
            if (distance < minDistance) {
                collision = true;
                break;
            }
        }
        
        if (!collision) {
            console.log(`✅ Non-overlapping position found after ${attempts + 1} attempts`);
            return position;
        }
        
        attempts++;
    }
    
    console.log(`⚠️ Using offset placement after ${maxAttempts} attempts`);
    // Simple offset placement as fallback
    const offsetDistance = minDistance * 1.2;
    const angle = (existingPositions.length * 0.8) % (Math.PI * 2);
    return {
        x: Math.cos(angle) * offsetDistance,
        y: Math.sin(angle) * offsetDistance
    };
};

// Transform API response to sticky note format with enhanced collision detection
const transformApiDataToStickyNotes = (apiData, existingPositions = {}) => {
    const usedPositions = Object.values(existingPositions);
    
    return apiData.map((item, index) => {
        // Calculate note dimensions first for collision detection
        const textLength = (item.content.text || '').length;
        const headerLength = (item.content.header || 'Note').length;
        const baseWidth = 220;
        const baseHeight = 180;
        const contentFactor = Math.min(2.0, Math.max(1.0, (textLength + headerLength) / 80));
        const noteWidth = baseWidth * contentFactor;
        const noteHeight = baseHeight * contentFactor;
        
        // Generate position with collision detection using actual note dimensions
        let position;
        if (existingPositions[item.id]) {
            position = existingPositions[item.id];
        } else {
            position = generateRandomPosition(
                window.innerWidth, 
                window.innerHeight, 
                usedPositions, 
                noteWidth, 
                noteHeight
            );
            usedPositions.push(position); // Add to used positions for next iteration
        }
        
        const transformedNote = {
            id: item.id,
            type: "sticky-note",
            content: {
                header: item.content.header || "Note",
                description: item.content.text || "",
                icon: item.content.icon || "📝",
                link: item.content.link || null,
                color: item.content.color || "yellow",
                image: item.content.image || null
            },
            position: position,
            dimensions: { width: noteWidth, height: noteHeight }, // Store for reference
            cornerFold: Math.random() > 0.5 ? 'left' : 'right',
            rotation: (Math.random() - 0.5) * 10 + 5,
            order_index: item.order_index || 0,
            created_at: item.created_at,
            updated_at: item.updated_at
        };
        
        console.log('🎨 Transformed sticky note:', {
            id: transformedNote.id,
            color: transformedNote.content.color,
            header: transformedNote.content.header,
            position: transformedNote.position,
            dimensions: `${noteWidth.toFixed(0)}x${noteHeight.toFixed(0)}`
        });
        
        return transformedNote;
    });
};

// Fetch sticky notes from API
const fetchStickyNotesFromAPI = async () => {
    try {
        console.log('🌐 Fetching sticky notes from autofoc.us API...');
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
        console.log('📥 Received sticky notes from API:', data.length, 'notes');
        return data;
    } catch (error) {
        console.error('❌ Error fetching sticky notes from API:', error);
        // Return fallback data on error
        return [{
            id: "fallback-note",
            type: "sticky-note",
            content: {
                icon: "⚠️",
                text: "Failed to load notes from API. Check connection.",
                color: "red",
                header: "API Error"
            },
            order_index: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }];
    }
};

const WhiteboardExperience = ({ onClose }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const drawingGroupRef = useRef(null);
    const stickyNotesGroupRef = useRef(null);
    
    const [currentTool, setCurrentTool] = useState(TOOLS.PAN);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentStroke, setCurrentStroke] = useState([]);
    const [drawings, setDrawings] = useState([]);
    const [stickyNotes, setStickyNotes] = useState([]);
    const [websocket, setWebsocket] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState(0);
    const [isPanning, setIsPanning] = useState(false);
    const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });
    
    // Touch interaction state
    const [isTouching, setIsTouching] = useState(false);
    const [touchStartPosition, setTouchStartPosition] = useState({ x: 0, y: 0 });

    // Camera position and zoom (start zoomed in for intro animation)
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 1.5 });
    const [zoom, setZoom] = useState(0.8);
    const [introAnimationComplete, setIntroAnimationComplete] = useState(false);

    // Refs to access current state in event handlers (avoid closure issues)
    const currentToolRef = useRef(currentTool);
    const isDrawingRef = useRef(isDrawing);
    const isPanningRef = useRef(isPanning);
    const lastPanPositionRef = useRef(lastPanPosition);
    const currentStrokeRef = useRef(currentStroke);
    const cameraPositionRef = useRef(cameraPosition);
    
    // Touch state refs
    const isTouchingRef = useRef(isTouching);
    const touchStartPositionRef = useRef(touchStartPosition);

    // Update refs when state changes
    useEffect(() => { currentToolRef.current = currentTool; }, [currentTool]);
    useEffect(() => { isDrawingRef.current = isDrawing; }, [isDrawing]);
    useEffect(() => { isPanningRef.current = isPanning; }, [isPanning]);
    useEffect(() => { lastPanPositionRef.current = lastPanPosition; }, [lastPanPosition]);
    useEffect(() => { currentStrokeRef.current = currentStroke; }, [currentStroke]);
    useEffect(() => { cameraPositionRef.current = cameraPosition; }, [cameraPosition]);
    useEffect(() => { isTouchingRef.current = isTouching; }, [isTouching]);
    useEffect(() => { touchStartPositionRef.current = touchStartPosition; }, [touchStartPosition]);

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
        
        // Enhanced lighting for better sticky note visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(200, 200, 100);
        directionalLight.castShadow = false; // Disable shadows for performance
        scene.add(directionalLight);
        
        // Add a subtle fill light to reduce harsh shadows
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-100, -100, 50);
        scene.add(fillLight);

        // Initial render
        renderer.render(scene, camera);

        // Handle window resize
        const handleResize = () => {
            const zoom = cameraPositionRef.current.z;
            camera.left = (-window.innerWidth / 2) * zoom;
            camera.right = (window.innerWidth / 2) * zoom;
            camera.top = (window.innerHeight / 2) * zoom;
            camera.bottom = (-window.innerHeight / 2) * zoom;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.render(scene, camera);
        };

        // Handle zoom with mouse wheel and trackpad
        const handleWheel = (event) => {
            event.preventDefault();
            
            const zoomSpeed = 0.1;
            const minZoom = 0.1;
            const maxZoom = 5.0;
            
            // Get current zoom from camera position z
            const currentZoom = cameraPositionRef.current.z;
            let newZoom;
            
            // Handle different wheel event types (mouse vs trackpad)
            if (event.deltaY) {
                // Standard mouse wheel or trackpad
                newZoom = currentZoom + (event.deltaY > 0 ? zoomSpeed : -zoomSpeed);
            } else {
                newZoom = currentZoom;
            }
            
            // Clamp zoom to limits
            newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
            
            // Update camera position and projection
            const newCameraPos = { ...cameraPositionRef.current, z: newZoom };
            cameraPositionRef.current = newCameraPos;
            setCameraPosition(newCameraPos);
            
            // Update camera frustum based on zoom
            camera.left = (-window.innerWidth / 2) * newZoom;
            camera.right = (window.innerWidth / 2) * newZoom;
            camera.top = (window.innerHeight / 2) * newZoom;
            camera.bottom = (-window.innerHeight / 2) * newZoom;
            camera.updateProjectionMatrix();
            
            console.log('🔍 Zoom changed:', { 
                oldZoom: currentZoom.toFixed(2), 
                newZoom: newZoom.toFixed(2),
                delta: event.deltaY 
            });
            
            // Re-render scene
            renderer.render(scene, camera);
        };

        // Handle touch gestures for zoom (pinch)
        let initialPinchDistance = 0;
        let initialZoom = 1;
        
        const handleTouchStart = (event) => {
            console.log('👆 Touch start:', event.touches.length, 'fingers');
            
            if (event.touches.length === 1) {
                // Single finger - start drawing or panning
                const touch = event.touches[0];
                const tool = currentToolRef.current;
                
                console.log('👆 Single finger touch start - tool:', tool);
                
                if (tool === TOOLS.PEN) {
                    // Start drawing - convert touch coordinates to world coordinates
                    const rect = renderer.domElement.getBoundingClientRect();
                    const x = touch.clientX - rect.left - rect.width / 2;
                    const y = -(touch.clientY - rect.top - rect.height / 2);
                    const worldPos = { 
                        x: x + cameraPositionRef.current.x, 
                        y: y + cameraPositionRef.current.y 
                    };
                    console.log('🎨 Starting touch stroke at:', worldPos);
                    
                    setIsDrawing(true);
                    setCurrentStroke([worldPos]);
                    setIsTouching(true);
                    setTouchStartPosition({ x: touch.clientX, y: touch.clientY });
                    
                    // Send drawing start to websocket
                    if (websocket) {
                        websocket.send(JSON.stringify({
                            type: 'drawing-start',
                            sessionId: SESSION_ID,
                            point: worldPos
                        }));
                    }
                } else if (tool === TOOLS.PAN) {
                    // Start panning
                    console.log('🖐️ Starting touch pan');
                    
                    setIsPanning(true);
                    setIsTouching(true);
                    setLastPanPosition({ x: touch.clientX, y: touch.clientY });
                    setTouchStartPosition({ x: touch.clientX, y: touch.clientY });
                }
                
                event.preventDefault();
                
            } else if (event.touches.length === 2) {
                // Two fingers - start zoom (pinch)
                console.log('🤏 Pinch zoom start');
                
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                initialPinchDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) + 
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                initialZoom = cameraPositionRef.current.z;
                
                // Stop any single finger interactions
                setIsDrawing(false);
                setIsPanning(false);
                setIsTouching(false);
                
                event.preventDefault();
            }
        };
        
        const handleTouchMove = (event) => {
            if (event.touches.length === 1 && isTouchingRef.current) {
                // Single finger - continue drawing or panning
                const touch = event.touches[0];
                const tool = currentToolRef.current;
                const drawing = isDrawingRef.current;
                const panning = isPanningRef.current;
                
                if (tool === TOOLS.PEN && drawing) {
                    // Continue drawing - convert touch coordinates to world coordinates
                    const rect = renderer.domElement.getBoundingClientRect();
                    const x = touch.clientX - rect.left - rect.width / 2;
                    const y = -(touch.clientY - rect.top - rect.height / 2);
                    const worldPos = { 
                        x: x + cameraPositionRef.current.x, 
                        y: y + cameraPositionRef.current.y 
                    };
                    
                    setCurrentStroke(prev => {
                        const newStroke = [...prev, worldPos];
                        
                        // Send live drawing data to websocket
                        if (websocket) {
                            websocket.send(JSON.stringify({
                                type: 'cursor-position',
                                sessionId: SESSION_ID,
                                point: worldPos,
                                drawing: true
                            }));
                        }
                        
                        return newStroke;
                    });
                    
                } else if (tool === TOOLS.PAN && panning) {
                    // Continue panning
                    const deltaX = (touch.clientX - lastPanPositionRef.current.x) * 0.5;
                    const deltaY = (touch.clientY - lastPanPositionRef.current.y) * 0.5;
                    
                    setCameraPosition(prev => ({
                        ...prev,
                        x: prev.x - deltaX,
                        y: prev.y + deltaY
                    }));
                    
                    setLastPanPosition({ x: touch.clientX, y: touch.clientY });
                }
                
                event.preventDefault();
                
            } else if (event.touches.length === 2) {
                // Two fingers - continue zoom (pinch)
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                const currentPinchDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) + 
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                // Calculate zoom based on pinch
                const pinchRatio = currentPinchDistance / initialPinchDistance;
                let newZoom = initialZoom / pinchRatio; // Invert for natural feel
                
                // Clamp zoom
                const minZoom = 0.1;
                const maxZoom = 5.0;
                newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
                
                // Update camera
                const newCameraPos = { ...cameraPositionRef.current, z: newZoom };
                cameraPositionRef.current = newCameraPos;
                setCameraPosition(newCameraPos);
                setZoom(newZoom);
                
                camera.left = (-window.innerWidth / 2) * newZoom;
                camera.right = (window.innerWidth / 2) * newZoom;
                camera.top = (window.innerHeight / 2) * newZoom;
                camera.bottom = (-window.innerHeight / 2) * newZoom;
                camera.updateProjectionMatrix();
                
                renderer.render(scene, camera);
                event.preventDefault();
            }
        };
        
        const handleTouchEnd = (event) => {
            console.log('👆 Touch end:', event.touches.length, 'remaining fingers');
            
            if (event.touches.length === 0) {
                // All fingers lifted
                const tool = currentToolRef.current;
                const drawing = isDrawingRef.current;
                const stroke = currentStrokeRef.current;
                
                if (tool === TOOLS.PEN && drawing && stroke.length > 1) {
                    // Complete drawing stroke - create proper drawing object like mouse handler
                    const newDrawing = {
                        id: `${SESSION_ID}-${Date.now()}`,
                        points: [...stroke],
                        timestamp: Date.now(),
                        color: '#000000',
                        author: SESSION_ID
                    };
                    
                    console.log('🎨 Completing touch stroke with', stroke.length, 'points');
                    console.log('💾 Saving touch drawing:', newDrawing);
                    
                    setDrawings(prev => {
                        const updated = [...prev, newDrawing];
                        console.log('📊 Total drawings after touch save:', updated.length);
                        return updated;
                    });
                    
                    // Send completed drawing to websocket with same format as mouse
                    if (websocket) {
                        websocket.send(JSON.stringify({
                            type: 'drawing',
                            data: newDrawing
                        }));
                        
                        // Send drawing end to websocket
                        websocket.send(JSON.stringify({
                            type: 'drawing-end',
                            data: { sessionId: SESSION_ID }
                        }));
                    }
                }
                
                // Reset all interaction states
                setIsDrawing(false);
                setIsPanning(false);
                setIsTouching(false);
                setCurrentStroke([]);
                
                event.preventDefault();
                
            } else if (event.touches.length === 1) {
                // One finger remaining (switched from multi-touch to single touch)
                console.log('👆 Switched to single finger');
                event.preventDefault();
            }
        };

        // Add event listeners
        window.addEventListener('resize', handleResize);
        renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
        renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
        renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
        renderer.domElement.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('wheel', handleWheel);
            renderer.domElement.removeEventListener('touchstart', handleTouchStart);
            renderer.domElement.removeEventListener('touchmove', handleTouchMove);
            renderer.domElement.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    // Add uniform dot grid background - all dots same appearance
    const addGridBackground = (scene) => {
        const gridSize = 50;
        const gridExtent = 3000;
        
        // Create uniform dot grid using points
        const dotGeometry = new THREE.BufferGeometry();
        const dotMaterial = new THREE.PointsMaterial({ 
            color: 0xc0c0c0, 
            size: 3, 
            opacity: 0.6, 
            transparent: true 
        });

        const dotPositions = [];
        
        // Create grid of dots - all uniform, including center (0,0)
        for (let x = -gridExtent; x <= gridExtent; x += gridSize) {
            for (let y = -gridExtent; y <= gridExtent; y += gridSize) {
                dotPositions.push(x, y, -0.1); // Behind sticky notes at negative z
            }
        }

        dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
        const dotGrid = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(dotGrid);
    };

    // Clear old sticky note positions (for fresh start)
    const clearStickyNotePositions = useCallback(() => {
        console.log('🧹 Clearing old sticky note positions from localStorage');
        localStorage.removeItem('whiteboard-sticky-positions');
    }, []);

    // Intro animation - focus on first note then zoom out to show all
    const performIntroAnimation = useCallback((notes) => {
        if (!cameraRef.current || introAnimationComplete || notes.length === 0) return;
        
        console.log('🎬 Starting intro animation...');
        const firstNote = notes[0];
        
        // Start focused on the first note
        setCameraPosition({ x: firstNote.position.x, y: firstNote.position.y, z: 1.5 });
        setZoom(0.8);
        
        // After 2 seconds, zoom out to show all notes
        setTimeout(() => {
            console.log('🔍 Zooming out to show all notes...');
            setCameraPosition({ x: 0, y: 0, z: 2.5 });
            setZoom(2.5);
            setIntroAnimationComplete(true);
        }, 2000);
    }, [introAnimationComplete]);

    // Load sticky notes from API with fresh positioning
    const loadStickyNotesFromAPI = useCallback(async () => {
        try {
            console.log('🎯 Loading sticky notes from autofoc.us API...');
            
            // Clear old positions for fresh start
            clearStickyNotePositions();
            
            // Fetch fresh data from API
            const apiData = await fetchStickyNotesFromAPI();
            
            // Transform API data with no saved positions (fresh layout)
            const transformedNotes = transformApiDataToStickyNotes(apiData, {});
            
            // Update state
            setStickyNotes(transformedNotes);
            console.log('✅ Loaded', transformedNotes.length, 'sticky notes from API');
            
            // Save new positions
            const newPositions = {};
            transformedNotes.forEach(note => {
                newPositions[note.id] = note.position;
            });
            localStorage.setItem('whiteboard-sticky-positions', JSON.stringify(newPositions));
            
            // Start intro animation
            performIntroAnimation(transformedNotes);
            
        } catch (error) {
            console.error('❌ Error loading sticky notes:', error);
        }
    }, [clearStickyNotePositions, performIntroAnimation]);

    // Create realistic sticky note mesh with dynamic sizing
    const createStickyNoteMesh = useCallback((note) => {
        const noteGroup = new THREE.Group();
        
        // Calculate dynamic dimensions based on content length
        const textLength = (note.content.description || note.content.text || '').length;
        const headerLength = (note.content.header || 'Note').length;
        
        // Base dimensions with dynamic scaling
        const baseWidth = 220;
        const baseHeight = 180;
        
        // Scale based on content (more content = larger note)
        const contentFactor = Math.min(2.0, Math.max(1.0, (textLength + headerLength) / 80));
        const width = baseWidth * contentFactor;
        const height = baseHeight * contentFactor;
        
        console.log(`📏 Dynamic sizing for note ${note.id}:`, {
            textLength,
            headerLength,
            contentFactor: contentFactor.toFixed(2),
            dimensions: `${width.toFixed(0)}x${height.toFixed(0)}`
        });
        
        // Solid sticky note colors (no transparency)
        const colorMap = {
            'yellow': '#ffff33',    // Classic post-it yellow
            'pink': '#ffb6c1',      // Light pink
            'blue': '#add8e6',      // Light blue
            'green': '#90ee90',     // Light green
            'orange': '#ffa500',    // Light orange
            'purple': '#dda0dd',    // Light purple
            'red': '#ffb6c1',       // Light red/pink
            'white': '#ffffff',     // Pure white
            'cyan': '#e0ffff',      // Light cyan
            'lime': '#f0fff0'       // Light lime
        };
        
        const color = colorMap[note.content.color] || '#ffff33';
        
        console.log('🎨 Creating realistic sticky note:', {
            id: note.id,
            requestedColor: note.content.color,
            mappedColor: color
        });
        
        // Create dynamic sticky note with responsive text sizing
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Higher resolution canvas based on note size
        const canvasSize = Math.max(512, Math.ceil(width * 2.5));
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        
        // Clear canvas
        context.clearRect(0, 0, canvasSize, canvasSize);
        
        // Calculate sizes relative to canvas
        const canvasWidth = canvasSize - 40;
        const canvasHeight = canvasSize - 40;
        
        // Draw shadow first (like box-shadow in CSS)
        context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        context.fillRect(15, 15, canvasWidth, canvasHeight); // Shadow offset
        
        // Draw main sticky note background
        context.fillStyle = color;
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw corner fold effect (mimicking CSS :before and :after)
        const foldSize = Math.max(40, canvasSize * 0.08);
        const cornerX = canvasWidth - foldSize;
        const cornerY = 0;
        
        // White triangle (like CSS :before)
        context.fillStyle = '#ffffff';
        context.beginPath();
        context.moveTo(cornerX, cornerY);
        context.lineTo(canvasWidth, cornerY);
        context.lineTo(canvasWidth, foldSize);
        context.closePath();
        context.fill();
        
        // Darker colored triangle (like CSS :after)
        let darkerColor;
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
            const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
            const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
            darkerColor = `rgb(${r}, ${g}, ${b})`;
        } else {
            darkerColor = '#cccc22';
        }
        context.fillStyle = darkerColor;
        context.beginPath();
        context.moveTo(cornerX, cornerY);
        context.lineTo(cornerX, foldSize);
        context.lineTo(canvasWidth, foldSize);
        context.closePath();
        context.fill();
        
        // Add subtle border
        context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        context.lineWidth = 3;
        context.strokeRect(0, 0, canvasWidth, canvasHeight);
        
        // Text rendering with much larger, responsive fonts
        context.textBaseline = 'top';
        context.textAlign = 'left';
        
        // Calculate font sizes based on note size (much larger)
        const iconSize = Math.max(80, canvasSize * 0.15);
        const headerSize = Math.max(48, canvasSize * 0.1);
        const bodySize = Math.max(32, canvasSize * 0.065);
        
        console.log(`🔤 Large font sizes for note ${note.id}:`, {
            icon: iconSize,
            header: headerSize,
            body: bodySize,
            canvasSize
        });
        
        // Large emoji icon with responsive size
        context.font = `${iconSize}px "Just Another Hand", "Comic Sans MS", "Comic Sans", cursive`;
        context.fillStyle = '#000000';
        context.fillText(note.content.icon || '📝', 30, 30);
        
        // Header text with responsive size
        context.font = `bold ${headerSize}px "Just Another Hand", "Comic Sans MS", "Comic Sans", cursive`;
        context.fillStyle = '#000000';
        const headerText = note.content.header || 'Note';
        const headerX = iconSize + 45;
        context.fillText(headerText, headerX, 45);
        
        // Body text with responsive Just Another Hand (much larger)
        context.font = `${bodySize}px "Just Another Hand", "Comic Sans MS", "Comic Sans", cursive`;
        context.fillStyle = '#000000';
        
        const words = (note.content.description || note.content.text || '').split(' ');
        let line = '';
        let y = iconSize + 80;
        const lineHeight = bodySize * 1.4;
        const maxWidth = canvasWidth - 70; // Leave margin for folded corner and padding
        const availableHeight = canvasHeight - y - 40;
        const maxLines = Math.floor(availableHeight / lineHeight);
        let lineCount = 0;
        
        for (let i = 0; i < words.length && lineCount < maxLines; i++) {
            const testLine = line + words[i] + ' ';
            const testWidth = context.measureText(testLine).width;
            if (testWidth > maxWidth && line !== '') {
                context.fillText(line.trim(), 30, y);
                line = words[i] + ' ';
                y += lineHeight;
                lineCount++;
            } else {
                line = testLine;
            }
        }
        
        // Draw the last line
        if (line.trim() && lineCount < maxLines) {
            context.fillText(line.trim(), 30, y);
        }
        
        // Add truncation if needed
        if (lineCount >= maxLines && words.length > 8) {
            context.font = `${bodySize * 0.8}px "Just Another Hand", "Comic Sans MS", cursive`;
            context.fillStyle = '#666666';
            context.fillText('...', 30, y + lineHeight);
        }
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        // Single plane with the complete sticky note rendered on canvas
        const noteGeometry = new THREE.PlaneGeometry(width, height);
        const noteMaterial = new THREE.MeshLambertMaterial({ 
            map: texture,
            transparent: true,
            alphaTest: 0.1
        });
        const noteMesh = new THREE.Mesh(noteGeometry, noteMaterial);
        noteGroup.add(noteMesh);
        
        // Apply position and rotation
        noteGroup.position.set(note.position.x, note.position.y, 0);
        noteGroup.rotation.z = (note.rotation || 0) * Math.PI / 180; // Convert degrees to radians
        
        // Store note ID for interaction and hover functionality
        noteGroup.userData = { 
            type: 'sticky-note',
            id: note.id,
            noteData: note,
            originalZ: 0
        };
        
        // Store original Z position for hover functionality
        noteGroup.userData.originalZ = 0;
        
        return noteGroup;
    }, []);

    // Render all sticky notes in the scene
    const renderStickyNotes = useCallback(() => {
        if (!stickyNotesGroupRef.current) return;
        
        console.log('🎨 Rendering sticky notes:', stickyNotes.length);
        
        // Clear existing sticky notes
        while (stickyNotesGroupRef.current.children.length > 0) {
            const child = stickyNotesGroupRef.current.children[0];
            stickyNotesGroupRef.current.remove(child);
            // Dispose geometries and materials
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
        
        // Add new sticky notes
        stickyNotes.forEach(note => {
            const noteMesh = createStickyNoteMesh(note);
            stickyNotesGroupRef.current.add(noteMesh);
        });
        
        console.log('✅ Rendered', stickyNotes.length, 'sticky notes');
    }, [stickyNotes, createStickyNoteMesh]);

    // Update sticky notes when data changes
    useEffect(() => {
        if (stickyNotes.length > 0) {
            renderStickyNotes();
        }
    }, [stickyNotes, renderStickyNotes]);

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

        // Enhanced WebSocket with comprehensive message handling
        const mockSocket = {
            send: (data) => {
                try {
                    const message = JSON.parse(data);
                    console.log('📤 WebSocket send:', message.type);
                    
                    const broadcastMessage = {
                        type: message.type,
                        data: message.data,
                        timestamp: Date.now(),
                        from: SESSION_ID
                    };
                    
                    switch (message.type) {
                        case 'drawing':
                            // Store completed drawing
                            const existingDrawings = JSON.parse(localStorage.getItem('whiteboard-drawings') || '[]');
                            existingDrawings.push(message.data);
                            localStorage.setItem('whiteboard-drawings', JSON.stringify(existingDrawings));
                            broadcastMessage.type = 'stroke-complete';
                            broadcastMessage.drawing = message.data;
                            break;
                            
                        case 'cursor-position':
                        case 'drawing-start':
                        case 'drawing-end':
                            // Live events - don't store, just broadcast
                            break;
                            
                        case 'clear-canvas':
                            // Clear storage
                            localStorage.removeItem('whiteboard-drawings');
                            break;
                            
                        case 'sticky-positions':
                            // Sync sticky note positions
                            const positions = JSON.parse(localStorage.getItem('whiteboard-sticky-positions') || '{}');
                            Object.assign(positions, message.data.positions);
                            localStorage.setItem('whiteboard-sticky-positions', JSON.stringify(positions));
                            break;
                    }
                    
                    // Broadcast to other tabs
                    localStorage.setItem('whiteboard-broadcast', JSON.stringify(broadcastMessage));
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
                        console.log('📥 WebSocket receive:', message.type, message);
                        
                        switch (message.type) {
                            case 'stroke-complete':
                                // Add completed drawing from another tab
                                setDrawings(prev => {
                                    const exists = prev.some(d => d.id === message.drawing.id);
                                    if (!exists) {
                                        console.log('✅ Adding new drawing from other user:', message.drawing.id);
                                        return [...prev, message.drawing];
                                    }
                                    return prev;
                                });
                                break;
                                
                            case 'cursor-position':
                                console.log('👻 Live cursor from other user:', message.data.sessionId, message.data.position);
                                // Could implement ghost cursor rendering here
                                break;
                                
                            case 'drawing-start':
                                console.log('🎨 Other user started drawing:', message.data.sessionId);
                                break;
                                
                            case 'drawing-end':
                                console.log('🏁 Other user finished drawing:', message.data.sessionId);
                                break;
                                
                            case 'clear-canvas':
                                console.log('🧹 Canvas cleared by other user');
                                setDrawings([]);
                                break;
                                
                            case 'sticky-positions':
                                console.log('📌 Sticky note positions updated by other user');
                                // Reload sticky notes with new positions
                                const updatedPositions = JSON.parse(localStorage.getItem('whiteboard-sticky-positions') || '{}');
                                setStickyNotes(prev => 
                                    prev.map(note => ({
                                        ...note,
                                        position: updatedPositions[note.id] || note.position
                                    }))
                                );
                                break;
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
        
        // Load sticky notes from API and apply saved positions
        loadStickyNotesFromAPI();

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

    // Simple hover detection without raycasting (to avoid visibility issues)
    const checkStickyNoteHover = useCallback((event) => {
        // Simplified hover - just for future use, not affecting visibility for now
        // console.log('Hover detected at:', event.clientX, event.clientY);
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
            
            // Send drawing start event via WebSocket
            if (websocket) {
                websocket.send(JSON.stringify({
                    type: 'drawing-start',
                    data: { 
                        sessionId: SESSION_ID,
                        position: worldPos
                    }
                }));
            }
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
                id: `${SESSION_ID}-${Date.now()}`,
                points: [...stroke],
                timestamp: Date.now(),
                color: '#000000',
                author: SESSION_ID
            };
            
            console.log('💾 Saving drawing (refs):', newDrawing);
            setDrawings(prev => {
                const updated = [...prev, newDrawing];
                console.log('📊 Total drawings after save:', updated.length);
                return updated;
            });
            
            // Send completed stroke via WebSocket
            if (websocket) {
                websocket.send(JSON.stringify({
                    type: 'drawing',
                    data: newDrawing
                }));
                
                // Send drawing end event
                websocket.send(JSON.stringify({
                    type: 'drawing-end',
                    data: { sessionId: SESSION_ID }
                }));
            }
        }
        
        // Reset states
        setIsDrawing(false);
        setIsPanning(false);
        setCurrentStroke([]);
    }, [websocket]);

    // Update camera position for intro animation and zoom
    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
            cameraRef.current.updateProjectionMatrix();
            console.log('📷 Camera position updated:', cameraPosition);
        }
    }, [cameraPosition]);

    // Update camera zoom separately to ensure sync
    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.position.z = zoom;
            cameraRef.current.updateProjectionMatrix();
            console.log('🔍 Camera zoom updated:', zoom);
        }
    }, [zoom]);

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
                        
                        // Send live cursor position via WebSocket
                        if (websocket) {
                            websocket.send(JSON.stringify({
                                type: 'cursor-position',
                                data: {
                                    sessionId: SESSION_ID,
                                    position: worldPos,
                                    isDrawing: true
                                }
                            }));
                        }
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
                        // Check for sticky note hover when not drawing/panning
                        checkStickyNoteHover(event);
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
        setCurrentStroke([]);
        
        // Send clear canvas via WebSocket
        if (websocket) {
            websocket.send(JSON.stringify({
                type: 'clear-canvas',
                data: { sessionId: SESSION_ID }
            }));
        }
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
                        className={`tool-button ${currentTool === TOOLS.PAN ? 'active' : ''}`}
                        onClick={() => setCurrentTool(TOOLS.PAN)}
                        title="Pan Tool"
                    >
                        ✋
                    </button>
                    <button
                        className={`tool-button ${currentTool === TOOLS.PEN ? 'active' : ''}`}
                        onClick={() => setCurrentTool(TOOLS.PEN)}
                        title="Pen Tool"
                    >
                        ✏️
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
                    className="whiteboard-close-button"
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