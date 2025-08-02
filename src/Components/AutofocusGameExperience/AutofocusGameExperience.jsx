import { useState, useRef, useEffect } from 'preact/hooks';
import * as THREE from 'three';
import './AutofocusGameExperience.css';

// Hidden objects data
const HIDDEN_OBJECTS = [
    { id: 1, name: 'Red Cube', color: '#ff4444', type: 'box', found: false },
    { id: 2, name: 'Blue Sphere', color: '#4444ff', type: 'sphere', found: false },
    { id: 3, name: 'Green Pyramid', color: '#44ff44', type: 'cone', found: false },
    { id: 4, name: 'Yellow Cylinder', color: '#ffff44', type: 'cylinder', found: false },
    { id: 5, name: 'Purple Torus', color: '#ff44ff', type: 'torus', found: false },
];

const AutofocusGameExperience = () => {
    const canvasRef = useRef();
    const sceneRef = useRef();
    const rendererRef = useRef();
    const cameraRef = useRef();
    const objectsRef = useRef([]);
    const raycasterRef = useRef();
    const mouseRef = useRef(new THREE.Vector2());
    const animationIdRef = useRef();
    
    const [gameObjects, setGameObjects] = useState(HIDDEN_OBJECTS);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [objectPositions] = useState(() => {
        return HIDDEN_OBJECTS.map(() => ({
            x: (Math.random() - 0.5) * 20,
            y: Math.random() * 4 + 0.5,
            z: (Math.random() - 0.5) * 20
        }));
    });

    // Initialize Three.js scene
    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            60,
            canvasRef.current.clientWidth / canvasRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 5, 10);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        canvasRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Raycaster for object selection
        raycasterRef.current = new THREE.Raycaster();

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(40, 40);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x90EE90 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        scene.add(ground);

        // Decorative objects
        for (let i = 0; i < 15; i++) {
            const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(
                (Math.random() - 0.5) * 30,
                Math.random() * 3 - 1,
                (Math.random() - 0.5) * 30
            );
            scene.add(box);
        }

        // Mouse controls
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const handleMouseDown = (event) => {
            isDragging = true;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const handleMouseMove = (event) => {
            if (isDragging) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                const spherical = new THREE.Spherical();
                spherical.setFromVector3(camera.position);
                spherical.theta -= deltaMove.x * 0.01;
                spherical.phi += deltaMove.y * 0.01;
                spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

                camera.position.setFromSpherical(spherical);
                camera.lookAt(0, 0, 0);

                previousMousePosition = { x: event.clientX, y: event.clientY };
            }

            // Update mouse position for raycasting
            const rect = renderer.domElement.getBoundingClientRect();
            mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const handleMouseUp = () => {
            isDragging = false;
        };

        const handleWheel = (event) => {
            const distance = camera.position.length();
            const newDistance = Math.max(3, Math.min(25, distance + event.deltaY * 0.01));
            camera.position.normalize().multiplyScalar(newDistance);
        };

        const handleClick = () => {
            if (!gameStarted) return;

            raycasterRef.current.setFromCamera(mouseRef.current, camera);
            const intersects = raycasterRef.current.intersectObjects(objectsRef.current);

            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                const objectId = clickedObject.userData.objectId;
                if (objectId && !clickedObject.userData.found) {
                    handleObjectFound(objectId);
                }
            }
        };

        renderer.domElement.addEventListener('mousedown', handleMouseDown);
        renderer.domElement.addEventListener('mousemove', handleMouseMove);
        renderer.domElement.addEventListener('mouseup', handleMouseUp);
        renderer.domElement.addEventListener('wheel', handleWheel);
        renderer.domElement.addEventListener('click', handleClick);

        // Animation loop
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);

            // Animate objects
            objectsRef.current.forEach((obj, index) => {
                if (!obj.userData.found) {
                    obj.rotation.y += 0.01;
                    obj.position.y = objectPositions[index].y + Math.sin(Date.now() * 0.002 + index) * 0.1;
                }
            });

            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            renderer.domElement.removeEventListener('mousedown', handleMouseDown);
            renderer.domElement.removeEventListener('mousemove', handleMouseMove);
            renderer.domElement.removeEventListener('mouseup', handleMouseUp);
            renderer.domElement.removeEventListener('wheel', handleWheel);
            renderer.domElement.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
            if (canvasRef.current && renderer.domElement) {
                canvasRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    // Create game objects when game starts
    useEffect(() => {
        if (!gameStarted || !sceneRef.current) return;

        // Clear existing objects
        objectsRef.current.forEach(obj => {
            sceneRef.current.remove(obj);
        });
        objectsRef.current = [];

        // Create new objects
        gameObjects.forEach((obj, index) => {
            let geometry, material;
            
            switch (obj.type) {
                case 'box':
                    geometry = new THREE.BoxGeometry(1, 1, 1);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(0.5, 16, 16);
                    break;
                case 'cone':
                    geometry = new THREE.ConeGeometry(0.5, 1, 8);
                    break;
                case 'cylinder':
                    geometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(0.4, 0.2, 8, 16);
                    break;
                default:
                    geometry = new THREE.BoxGeometry(1, 1, 1);
            }

            material = new THREE.MeshStandardMaterial({ 
                color: obj.color,
                transparent: true,
                opacity: obj.found ? 0 : 1
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                objectPositions[index].x,
                objectPositions[index].y,
                objectPositions[index].z
            );
            mesh.userData = { objectId: obj.id, found: obj.found };
            mesh.visible = !obj.found;

            sceneRef.current.add(mesh);
            objectsRef.current.push(mesh);
        });
    }, [gameStarted, gameObjects]);

    const handleObjectFound = (objectId) => {
        setGameObjects(prev => {
            const updated = prev.map(obj => 
                obj.id === objectId ? { ...obj, found: true } : obj
            );
            
            // Update the 3D object
            const mesh = objectsRef.current.find(obj => obj.userData.objectId === objectId);
            if (mesh) {
                mesh.userData.found = true;
                mesh.visible = false;
            }
            
            // Check if all objects are found
            if (updated.every(obj => obj.found)) {
                setGameWon(true);
            }
            
            return updated;
        });
    };

    const startGame = () => {
        setGameStarted(true);
        setGameWon(false);
        setGameObjects(HIDDEN_OBJECTS.map(obj => ({ ...obj, found: false })));
    };

    const foundCount = gameObjects.filter(obj => obj.found).length;
    const totalCount = gameObjects.length;

    return (
        <div className="game-container">
            <div ref={canvasRef} className="three-canvas" />

            {/* Game UI */}
            <div className="game-ui">
                {!gameStarted ? (
                    <div className="start-screen">
                        <h2>Hidden Object Game</h2>
                        <p>Find all the hidden objects in the 3D world!</p>
                        <button onClick={startGame} className="start-button">
                            Start Game
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="game-info">
                            <h3>Find the Objects</h3>
                            <p>Progress: {foundCount}/{totalCount}</p>
                            <div className="objects-list">
                                {gameObjects.map(obj => (
                                    <div 
                                        key={obj.id} 
                                        className={`object-item ${obj.found ? 'found' : ''}`}
                                    >
                                        <span style={{ color: obj.color }}>●</span>
                                        {obj.name}
                                        {obj.found && ' ✓'}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="controls-info">
                            <p><strong>Controls:</strong></p>
                            <p>• Drag: Look around</p>
                            <p>• Click: Select objects</p>
                            <p>• Scroll: Zoom in/out</p>
                        </div>
                        
                        {gameWon && (
                            <div className="win-screen">
                                <h2>🎉 YOU WON! 🎉</h2>
                                <button onClick={startGame} className="restart-button">
                                    Play Again
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AutofocusGameExperience;