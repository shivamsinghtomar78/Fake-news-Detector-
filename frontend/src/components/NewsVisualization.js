import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NewsVisualization = ({ result, probability }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Create sphere
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: result === 'Fake' ? '#ff4444' : '#44ff44',
      transparent: true,
      opacity: 0.9,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add lights
    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(2, 2, 2);
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0x404040);
    scene.add(light2);

    camera.position.z = 3;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      
      // Pulse effect based on probability
      const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
      sphere.scale.set(scale, scale, scale);
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [result, probability]);

  return <div ref={mountRef} className="visualization" />;
};

export default NewsVisualization;