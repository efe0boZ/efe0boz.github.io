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

// Scene setup - Optimized
const setupScene = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 30, 100);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('webgl'),
        antialias: false,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = false;
};

// Lighting - Optimized
const setupLights = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(20, 20, 20);
    scene.add(directionalLight);
};

// Create floor - Optimized
const createFloor = () => {
    const floorGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
    const floorMaterial = new THREE.MeshBasicMaterial({
        color: 0x90EE90,
        side: THREE.DoubleSide
    });
    
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    
    // Physics floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({ mass: 0 });
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(floorBody);
};

// Create car - Optimized
const createCar = () => {
    const carGroup = new THREE.Group();
    
    // Car body - simplified
    const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x667eea });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 1;
    carGroup.add(bodyMesh);
    
    // Car roof - simplified
    const roofGeometry = new THREE.BoxGeometry(2.5, 1, 1.8);
    const roofMesh = new THREE.Mesh(roofGeometry, bodyMaterial);
    roofMesh.position.set(-0.3, 2, 0);
    carGroup.add(roofMesh);
    
    // Wheels - low poly
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 8);
    const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    
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

// Create obstacles and interactive elements - Optimized
const createWorld = () => {
    // Project blocks - simplified
    const projects = [
        { name: 'Snake Game', pos: [15, 2, 10], color: 0xff6b6b },
        { name: 'Web App', pos: [-15, 2, 15], color: 0x4ecdc4 },
        { name: 'Portfolio', pos: [20, 2, -10], color: 0xffe66d }
    ];
    
    projects.forEach(project => {
        const geometry = new THREE.BoxGeometry(4, 4, 4);
        const material = new THREE.MeshBasicMaterial({ color: project.color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...project.pos);
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
    
    // Trees - reduced count, low poly
    for (let i = 0; i < 8; i++) {
        const x = (Math.random() - 0.5) * 60;
        const z = (Math.random() - 0.5) * 60;
        if (Math.abs(x) < 10 && Math.abs(z) < 10) continue;
        
        // Trunk - low poly
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 4, 6);
        const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 2, z);
        scene.add(trunk);
        
        // Leaves - low poly
        const leavesGeometry = new THREE.SphereGeometry(2, 6, 6);
        const leavesMaterial = new THREE.MeshBasicMaterial({ color: 0x228b22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(x, 5, z);
        scene.add(leaves);
    }
    
    // Clouds - reduced count
    for (let i = 0; i < 5; i++) {
        const cloudGeometry = new THREE.SphereGeometry(3, 6, 6);
        const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        
        cloud.position.set(
            (Math.random() - 0.5) * 80,
            15 + Math.random() * 10,
            (Math.random() - 0.5) * 80
        );
        scene.add(cloud);
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
    }, 1000);
};

// Start when page loads
window.addEventListener('load', init);
