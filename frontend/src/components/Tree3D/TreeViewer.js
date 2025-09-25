// src/components/Tree3D/TreeViewer.js
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './TreeViewer.css';

const TreeViewer = ({ 
  modelUrl = '/tree.glb', // Path către modelul BlenderKit în public/
  enableControls = true,
  fallbackToProcedural = true 
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const treeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelType, setModelType] = useState('loading'); // 'loading', 'blenderkit', 'procedural'

  // Procedural Tree Generator - fallback când nu avem model
  const createProceduralTree = () => {
    const group = new THREE.Group();

    // Trunchi mai detaliat
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x8B4513,
      roughness: 0.8 
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    // Coroana - mai multe straturi pentru un look natural
    const createFoliage = (radius, y, segments = 8, color = 0x2D5016) => {
      const foliageGeometry = new THREE.SphereGeometry(radius, segments, segments);
      const foliageMaterial = new THREE.MeshLambertMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.9
      });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.y = y;
      foliage.castShadow = true;
      foliage.receiveShadow = true;
      return foliage;
    };

    // Straturi multiple pentru coroana cu variații de culoare
    group.add(createFoliage(2.2, 5.5, 10, 0x2D5016));
    group.add(createFoliage(1.8, 6.8, 8, 0x4A7C59));
    group.add(createFoliage(1.4, 7.8, 8, 0x228B22));

    // Ramuri mici
    for (let i = 0; i < 8; i++) {
      const branchGeometry = new THREE.CylinderGeometry(0.03, 0.06, 0.8, 4);
      const branchMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
      const branch = new THREE.Mesh(branchGeometry, branchMaterial);
      
      const angle = (i / 8) * Math.PI * 2;
      const radius = 1.0 + Math.random() * 0.5;
      branch.position.x = Math.cos(angle) * radius;
      branch.position.z = Math.sin(angle) * radius;
      branch.position.y = 3.5 + Math.random() * 1.5;
      branch.rotation.z = Math.sin(angle) * 0.4;
      branch.rotation.y = angle;
      branch.castShadow = true;
      
      group.add(branch);

      // Frunze pe ramuri
      const leafGeometry = new THREE.SphereGeometry(0.4, 6, 6);
      const leafMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x4A7C59,
        transparent: true,
        opacity: 0.8
      });
      const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
      leaves.position.copy(branch.position);
      leaves.position.y += 0.5;
      leaves.castShadow = true;
      group.add(leaves);
    }

    console.log('Created procedural tree as fallback');
    return group;
  };

  // Setup Three.js scene îmbunătățit
  const setupScene = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5F5DC); // Background crem

    // Camera centrată pe copac
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 8); // Centrată pe (0,0,0) unde va fi copacul

    // Renderer îmbunătățit
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Controls fără axe
    let controls = null;
    if (enableControls) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2.1;
      controls.minDistance = 4;
      controls.maxDistance = 20;
      controls.autoRotate = false;
      controls.autoRotateSpeed = 0.5;
      controls.target.set(0, 3, 0); // Focalizează pe centrul copacului
    }

    // Lighting îmbunătățit pentru BlenderKit models
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(12, 15, 8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15;
    scene.add(directionalLight);

    // Fill light pentru umbre mai soft
    const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
    fillLight.position.set(-8, 10, -8);
    scene.add(fillLight);

    // Nu mai adăugăm ground plane sau iarbă

    mountRef.current.appendChild(renderer.domElement);

    return { scene, camera, renderer, controls };
  };

  // Load BlenderKit GLTF model
  const loadBlenderKitModel = async (url) => {
    if (!url) return null;

    setLoading(true);
    setError(null);
    console.log('Attempting to load BlenderKit model:', url);

    try {
      const loader = new GLTFLoader();
      return new Promise((resolve, reject) => {
        loader.load(
          url,
          (gltf) => {
            console.log('BlenderKit model loaded successfully:', gltf);
            setLoading(false);
            
            const model = gltf.scene;
            
            // Procesează modelul pentru optimizare
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Optimizează materialul
                if (child.material) {
                  child.material.needsUpdate = true;
                  // Asigură-te că materialele sunt compatibile cu Three.js
                  if (child.material.map) {
                    child.material.map.colorSpace = THREE.SRGBColorSpace;
                  }
                }
              }
            });

            // Centrează modelul perfect în origine (0,0,0)
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxSize = Math.max(size.x, size.y, size.z);
            
            // Scalează pentru o înălțime țintă de ~6 unități
            const targetHeight = 6;
            const scale = targetHeight / maxSize;
            model.scale.setScalar(scale);

            // Centrează perfect modelul în origine
            model.position.x = -center.x * scale;
            model.position.z = -center.z * scale;
            model.position.y = -center.y * scale; // Centrează și pe Y

            console.log(`Model scaled by ${scale.toFixed(2)}, positioned at:`, model.position);

            setModelType('blenderkit');
            resolve(model);
          },
          (progress) => {
            const percentComplete = (progress.loaded / progress.total) * 100;
            console.log(`Loading progress: ${percentComplete.toFixed(1)}%`);
          },
          (error) => {
            console.error('Error loading BlenderKit model:', error);
            setLoading(false);
            setError(`Failed to load model: ${error.message}`);
            reject(error);
          }
        );
      });
    } catch (err) {
      setLoading(false);
      setError('Network error loading model');
      console.error('Load error:', err);
      return null;
    }
  };

  // Animation loop îmbunătățit
  const animate = (scene, camera, renderer, controls) => {
    const animateFrame = () => {
      frameRef.current = requestAnimationFrame(animateFrame);

      if (controls) {
        controls.update();
      }

      // Animații cu rotație continuă pentru ambele tipuri de modele
      if (treeRef.current) {
        if (modelType === 'procedural') {
          // Rotație constantă pentru copacul procedural
          treeRef.current.rotation.y += 0.005;
          treeRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.02;
        } else if (modelType === 'blenderkit') {
          // Rotație constantă pentru modelul BlenderKit
          treeRef.current.rotation.y += 0.005;
          treeRef.current.rotation.z = Math.sin(Date.now() * 0.0008) * 0.01;
        }
      }

      renderer.render(scene, camera);
    };
    animateFrame();
  };

  // Handle window resize
  const handleResize = (camera, renderer) => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const { scene, camera, renderer, controls } = setupScene();
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Load model or create procedural tree
    const initTree = async () => {
      let tree = null;

      // Încearcă să încarce modelul BlenderKit
      if (modelUrl && modelUrl !== null) {
        try {
          tree = await loadBlenderKitModel(modelUrl);
        } catch (error) {
          console.warn('Failed to load BlenderKit model:', error);
          if (fallbackToProcedural) {
            console.log('Using procedural tree as fallback');
          }
        }
      }

      // Fallback la copacul procedural
      if (!tree && fallbackToProcedural) {
        tree = createProceduralTree();
        setModelType('procedural');
      }

      if (tree) {
        treeRef.current = tree;
        scene.add(tree);
        console.log(`Tree added to scene. Type: ${modelType}`);
      }

      // Start animation
      animate(scene, camera, renderer, controls);
    };

    initTree();

    // Window resize handler
    const resizeHandler = () => handleResize(camera, renderer);
    window.addEventListener('resize', resizeHandler);

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', resizeHandler);
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl, fallbackToProcedural]);

  return (
    <div className="tree-viewer-container">
      <div className="tree-viewer" ref={mountRef} tabIndex={0}>
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading BlenderKit Tree Model...</p>
            <small>Asset: 87ce9717-6a05-4097-9583-30b4279c401c</small>
          </div>
        )}
        {error && (
          <div className="error-overlay">
            <p>⚠️ {error}</p>
            {fallbackToProcedural && <small>Using procedural tree backup</small>}
          </div>
        )}
      </div>
      <div className="viewer-controls">
        <small>
          {modelType === 'blenderkit' && '🎨 BlenderKit Professional Model'}
          {modelType === 'procedural' && '🌳 Procedural Generated Tree'}
          {modelType === 'loading' && '⏳ Loading...'}
          {enableControls && ' • 🖱️ Drag to rotate • Scroll to zoom'}
        </small>
      </div>
    </div>
  );
};

export default TreeViewer;