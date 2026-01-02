// 3D World Setup - Bruno Simon Style
let scene, camera, renderer, world;
let car, carBody, wheels = [];
let floor, obstacles = [];
let keys = {};
let isLoaded = false;

// Physics world setup
const setupPhysics = () => {
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
};

// Scene setup
const setupScene = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 50, 200);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('webgl'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
};

// Lighting
const setupLights = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
};

// Create floor
const createFloor = () => {
    const floorGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x90EE90,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // Add some terrain variation
    const vertices = floorGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 2] = Math.sin(vertices[i] * 0.1) * Math.cos(vertices[i + 1] * 0.1) * 0.5;
    }
    floorGeometry.attributes.position.needsUpdate = true;
    floorGeometry.computeVertexNormals();
    
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Physics floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({ mass: 0 });
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(floorBody);
};

// Create car
const createCar = () => {
    const carGroup = new THREE.Group();
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x667eea,
        metalness: 0.7,
        roughness: 0.3
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 1;
    bodyMesh.castShadow = true;
    carGroup.add(bodyMesh);
    
    // Car roof
    const roofGeometry = new THREE.BoxGeometry(2.5, 1, 1.8);
    const roofMesh = new THREE.Mesh(roofGeometry, bodyMaterial);
    roofMesh.position.set(-0.3, 2, 0);
    roofMesh.castShadow = true;
    carGroup.add(roofMesh);
    
    // Windows
    const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.5
    });
    const windowGeometry = new THREE.BoxGeometry(2.4, 0.9, 1.7);
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
    windowMesh.position.set(-0.3, 2, 0);
    carGroup.add(windowMesh);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.9
    });
    
    const wheelPositions = [
        [-1.5, 0.5, 1.2],
        [-1.5, 0.5, -1.2],
        [1.5, 0.5, 1.2],
        [1.5, 0.5, -1.2]
    ];
    
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        wheel.castShadow = true;
        carGroup.add(wheel);
        wheels.push(wheel);
    });
    
    car = carGroup;
    scene.add(car);
    
    // Physics body
    const carShape = new CANNON.Box(new CANNON.Vec3(2, 0.75, 1));
    carBody = new CANNON.Body({ mass: 500 });
    carBody.addShape(carShape);
    carBody.position.set(0, 3, 0);
    carBody.linearDamping = 0.3;
    carBody.angularDamping = 0.3;
    world.addBody(carBody);
};

// Create obstacles and interactive elements
const createWorld = () => {
    // Project blocks
    const projects = [
        { name: 'Snake Game', pos: [15, 2, 10], color: 0xff6b6b },
        { name: 'Web App', pos: [-15, 2, 15], color: 0x4ecdc4 },
        { name: 'Portfolio', pos: [20, 2, -10], color: 0xffe66d }
    ];
    
    projects.forEach(project => {
        const geometry = new THREE.BoxGeometry(4, 4, 4);
        const material = new THREE.MeshStandardMaterial({
            color: project.color,
            metalness: 0.5,
            roughness: 0.5
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...project.pos);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        
        // Add text
        const textSprite = createTextSprite(project.name);
        textSprite.position.set(project.pos[0], project.pos[1] + 3, project.pos[2]);
        scene.add(textSprite);
        
        // Physics
        const shape = new CANNON.Box(new CANNON.Vec3(2, 2, 2));
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(...project.pos);
        world.addBody(body);
        obstacles.push({ mesh, body });
    });
    
    // Trees
    for (let i = 0; i < 20; i++) {
        const x = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        if (Math.abs(x) < 10 && Math.abs(z) < 10) continue;
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 4, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 2, z);
        trunk.castShadow = true;
        scene.add(trunk);
        
        // Leaves
        const leavesGeometry = new THREE.SphereGeometry(2, 8, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(x, 5, z);
        leaves.castShadow = true;
        scene.add(leaves);
    }
    
    // Clouds
    for (let i = 0; i < 15; i++) {
        const cloudGroup = new THREE.Group();
        const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        for (let j = 0; j < 3; j++) {
            const cloudGeometry = new THREE.SphereGeometry(2 + Math.random() * 2, 8, 8);
            const cloudPart = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloudPart.position.set(Math.random() * 4 - 2, Math.random() * 2, Math.random() * 4 - 2);
            cloudGroup.add(cloudPart);
        }
        
        cloudGroup.position.set(
            (Math.random() - 0.5) * 150,
            20 + Math.random() * 10,
            (Math.random() - 0.5) * 150
        );
        scene.add(cloudGroup);
    }
};

// Create text sprite
const createTextSprite = (text) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'Bold 48px Arial';
    context.fillStyle = '#667eea';
    context.textAlign = 'center';
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 16);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(8, 2, 1);
    
    return sprite;
};

// Car controls
const updateCar = () => {
    if (!carBody) return;
    
    const force = 150;
    const torque = 20;
    
    if (keys['w'] || keys['ArrowUp']) {
        const impulse = new CANNON.Vec3(
            -Math.sin(carBody.quaternion.y) * force,
            0,
            -Math.cos(carBody.quaternion.y) * force
        );
        carBody.applyLocalForce(impulse, new CANNON.Vec3(0, 0, 0));
        
        // Rotate wheels
        wheels.forEach(wheel => {
            wheel.rotation.x += 0.2;
        });
    }
    
    if (keys['s'] || keys['ArrowDown']) {
        const impulse = new CANNON.Vec3(
            Math.sin(carBody.quaternion.y) * force * 0.7,
            0,
            Math.cos(carBody.quaternion.y) * force * 0.7
        );
        carBody.applyLocalForce(impulse, new CANNON.Vec3(0, 0, 0));
        
        wheels.forEach(wheel => {
            wheel.rotation.x -= 0.15;
        });
    }
    
    if (keys['a'] || keys['ArrowLeft']) {
        carBody.angularVelocity.y = 2;
    }
    
    if (keys['d'] || keys['ArrowRight']) {
        carBody.angularVelocity.y = -2;
    }
    
    // Update car mesh position
    car.position.copy(carBody.position);
    car.quaternion.copy(carBody.quaternion);
    
    // Camera follow
    const cameraOffset = new THREE.Vector3(0, 8, 15);
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(car.position);
    cameraPosition.add(cameraOffset.applyQuaternion(car.quaternion));
    
    camera.position.lerp(cameraPosition, 0.1);
    camera.lookAt(car.position);
};

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    
    if (world && carBody) {
        world.step(1 / 60);
        updateCar();
    }
    
    renderer.render(scene, camera);
};

// Event listeners
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse controls for camera
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

window.addEventListener('mousedown', (e) => {
    isDragging = true;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('mousemove', (e) => {
    if (isDragging && car) {
        const deltaX = e.clientX - previousMousePosition.x;
        const cameraOffset = camera.position.clone().sub(car.position);
        const angle = deltaX * 0.01;
        
        const rotationMatrix = new THREE.Matrix4().makeRotationY(angle);
        cameraOffset.applyMatrix4(rotationMatrix);
        
        camera.position.copy(car.position.clone().add(cameraOffset));
    }
    
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

// Initialize
const init = () => {
    setupPhysics();
    setupScene();
    setupLights();
    createFloor();
    createCar();
    createWorld();
    animate();
    
    // Hide loading screen
    setTimeout(() => {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 2000);
};

// Start when page loads
window.addEventListener('load', init);
