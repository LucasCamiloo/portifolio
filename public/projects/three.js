  // Enhanced Three.js demo
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('three-demo');
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Clear container and add renderer
    while (container.firstChild) {
        if (container.lastChild.className === 'caption') break;
        container.removeChild(container.firstChild);
    }
    container.insertBefore(renderer.domElement, container.firstChild);
    
    // Create particles
    const particlesCount = 200;
    const particleSystem = new function() {
        // Geometry to hold particle vertices
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);
        
        // Material for particles
        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
        });
        
        // Create particles with positions and colors
        for (let i = 0; i < particlesCount * 3; i += 3) {
            // Position within a sphere
            const radius = 2.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
            
            // Color gradient from blue to cyan
            const h = 0.58 + Math.random() * 0.1; // Blue hue range
            const s = 0.8 + Math.random() * 0.2; // High saturation
            const l = 0.5 + Math.random() * 0.3; // Medium to high lightness
            
            const color = new THREE.Color().setHSL(h, s, l);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Create the particle system
        this.mesh = new THREE.Points(geometry, material);
        scene.add(this.mesh);
        
        // Store original positions for animation
        this.originalPositions = positions.slice();
        
        // Update function for animation
        this.update = function(time) {
            const positions = this.mesh.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Wave-like motion
                const x = this.originalPositions[i];
                const y = this.originalPositions[i + 1];
                const z = this.originalPositions[i + 2];
                
                positions[i] = x + Math.sin(time * 0.001 + i * 0.1) * 0.1;
                positions[i + 1] = y + Math.cos(time * 0.002 + i * 0.05) * 0.1;
                positions[i + 2] = z + Math.sin(time * 0.001 + i * 0.05) * 0.1;
            }
            
            this.mesh.geometry.attributes.position.needsUpdate = true;
            
            // Rotate the entire system
            this.mesh.rotation.y += 0.002;
            this.mesh.rotation.x += 0.001;
        };
    };
    
    // Create connecting lines between particles
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x0062ff,
        transparent: true,
        opacity: 0.2
    });
    
    const lineSystem = new function() {
        this.lines = [];
        
        this.update = function() {
            // Remove old lines
            this.lines.forEach(line => scene.remove(line));
            this.lines = [];
            
            // Get particle positions
            const positions = particleSystem.mesh.geometry.attributes.position.array;
            
            // Create new lines between close particles
            for (let i = 0; i < positions.length; i += 3) {
                const x1 = positions[i];
                const y1 = positions[i + 1];
                const z1 = positions[i + 2];
                
                // Check only a subset of particles for performance
                for (let j = i + 3; j < Math.min(i + 30, positions.length); j += 3) {
                    const x2 = positions[j];
                    const y2 = positions[j + 1];
                    const z2 = positions[j + 2];
                    
                    const distance = Math.sqrt(
                        Math.pow(x2 - x1, 2) + 
                        Math.pow(y2 - y1, 2) + 
                        Math.pow(z2 - z1, 2)
                    );
                    
                    if (distance < 0.7) {
                        const geometry = new THREE.BufferGeometry().setFromPoints([
                            new THREE.Vector3(x1, y1, z1),
                            new THREE.Vector3(x2, y2, z2)
                        ]);
                        
                        const line = new THREE.Line(geometry, lineMaterial);
                        scene.add(line);
                        this.lines.push(line);
                    }
                }
            }
        };
    };
    
    // Create a light atmosphere
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    
    const pointLight = new THREE.PointLight(0x0062ff, 1, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    
    // Animation loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        particleSystem.update(time);
        lineSystem.update();
        
        renderer.render(scene, camera);
    }
    
    animate(0);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Interactive mouse effect
    let mouseX = 0, mouseY = 0;
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
        
        // Tilt camera slightly based on mouse position
        camera.position.x = mouseX * 0.5;
        camera.position.y = mouseY * 0.5;
        camera.lookAt(scene.position);
    });
});