import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function Eth() {
    const canvasRef = useRef(null);
    const objectRef = useRef(null); // Créer un ref pour l'objet 3D
    const [isObjectLoaded, setIsObjectLoaded] = useState(false); // État pour suivre le chargement
    const cameraRef = useRef(null); // Créer un ref pour la caméra

    function createCircleTexture() {
        const size = 64; // Taille de la texture
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');

        // Dessiner un cercle blanc sur un fond transparent
        context.beginPath();
        context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();

        return new THREE.CanvasTexture(canvas);
    }

    useEffect(() => {
        window.scrollTo(0, 0);

        gsap.registerPlugin(ScrollTrigger);

        // Créer une nouvelle scène
        const scene = new THREE.Scene();

        // Créer une caméra perspective
        const camera = new THREE.PerspectiveCamera(
            75, // Champ de vision
            window.innerWidth / window.innerHeight, // Ratio d'aspect
            0.1, // Plan proche
            5000, // Plan éloigné
        );
        cameraRef.current = camera; // Stocker la caméra dans le ref

        // Créer un renderer WebGL
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            canvas: canvasRef.current,
        });
        renderer.setSize(window.innerWidth, window.innerHeight); // Définir la taille du renderer
        renderer.shadowMap.enabled = true; // Activer les ombres
        renderer.setClearColor(0x000000, 0); // Définir la couleur de fond à transparente

        // Add Tailwind CSS class to the canvas
        renderer.domElement.className =
            'fixed top-0 left-0 w-full h-full z-[-1]'; // Replace 'your-tailwind-class' with the actual class name

        document.body.appendChild(renderer.domElement); // Ajouter le canvas du renderer au corps du document

        // Positionner la caméra
        camera.position.set(0, 0, 2000);

        // Créer une lumière ambiante
        const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Couleur et intensité
        scene.add(ambientLight); // Ajouter la lumière ambiante à la scène

        // Ajouter une lumière directionnelle
        const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // Couleur et intensité
        directionalLight.position.set(0, 0, 1000); // Positionner la lumière

        // Orienter la lumière vers un point (par exemple, l'origine de la scène)
        directionalLight.target.position.set(0, 0, 0); // Point vers lequel la lumière est orientée
        scene.add(directionalLight.target); // Ajouter la cible à la scène

        directionalLight.castShadow = true; // Activer les ombres pour la lumière directionnelle

        scene.add(directionalLight); // Ajouter la lumière à la scène

        // Charger le modèle GLTF
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader(); // Créer un chargeur de texture

        let isFloatingPaused = false; // Drapeau pour contrôler l'animation de flottement

        loader.load(
            '/assets/scene.gltf',
            (gltf) => {
                const object = gltf.scene;

                // Charger la texture
                const texture = textureLoader.load('/assets/ethTextures.png'); // Remplacez par le chemin de votre texture

                // Créer un groupe pour centrer l'objet
                const group = new THREE.Group();
                group.add(object);

                // Centrer l'objet dans le groupe
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center);

                objectRef.current = group; // Stocker le groupe dans le ref
                group.scale.set(1, 1, 1); // Ajustez les valeurs selon vos besoins
                group.position.set(0, 500, 0); // Ajustez les valeurs selon vos besoins

                // Ajouter un matériau avec la texture
                const newMaterial = new THREE.MeshStandardMaterial({
                    map: texture, // Appliquer la texture
                    color: 0x7289da, // Ajouter la couleur du logo Discord
                    roughness: 0.5, // Propriété de rugosité
                    metalness: 0.0, // Supprimer l'effet métallique
                });

                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = newMaterial; // Appliquer le nouveau matériau à chaque maillage
                    }
                });

                scene.add(group); // Ajouter le groupe à la scène

                // Configuration des animations
                const heroElement = document.getElementById('hero');
                const introElement = document.getElementById('intro');
                ScrollTrigger.create({
                    trigger: heroElement,
                    start: 'bottom bottom',
                    endTrigger: introElement,
                    end: 'bottom bottom',
                    scrub: true,
                    animation: gsap
                        .timeline()
                        .to(
                            objectRef.current.position,
                            {
                                x: window.innerWidth * 0.5 + 20,
                                y: -50,
                                z: +500,
                                ease: 'power2.out',
                            },
                            0,
                        )
                        .to(
                            objectRef.current.rotation,
                            {
                                x: -Math.PI / 1 / 4, // Rotation de 90 degrés sur l'axe X
                                y: -Math.PI / 1 / 6, // Rotation de 90 degrés sur l'axe Y
                                ease: 'power2.out',
                            },
                            0,
                        ),
                });

                ScrollTrigger.create({
                    trigger: introElement,
                    start: 'bottom bottom',
                    end: 'bottom top',
                    scrub: true,
                    animation: gsap
                        .timeline()
                        .fromTo(
                            objectRef.current.position,
                            {
                                x: window.innerWidth * 0.5 + 20, // Position de départ égale à la position finale de la première animation
                                y: -50,
                                z: +500,
                            },
                            {
                                x: -window.innerWidth * 0.5, // Déplacement vers la gauche
                                y: -50,
                                z: +500,
                                ease: 'power2.out',
                            },
                            0,
                        )
                        .fromTo(
                            objectRef.current.rotation,
                            {
                                x: -Math.PI / 1 / 4, // Rotation de départ égale à la rotation finale de la première animation
                                y: -Math.PI / 1 / 6,
                            },
                            {
                                x: Math.PI / 1 / 6, // Rotation de 90 degrés sur l'axe X
                                y: Math.PI / 1 / 4, // Rotation de 90 degrés sur l'axe Y
                                ease: 'power2.out',
                            },
                            0,
                        ),
                });

                // Réinitialiser la position et la rotation après la configuration des animations
                gsap.set(objectRef.current.position, { x: 0, y: 500, z: 0 });
                gsap.set(objectRef.current.rotation, { x: 0, y: 0, z: 0 });

                setIsObjectLoaded(true); // Mettre à jour l'état pour indiquer que l'objet est chargé
            },

            undefined,
            (error) => {
                console.error(
                    'Erreur lors du chargement du modèle GLTF:',
                    error,
                ); // Gestion des erreurs
            },
        );

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isAnimating = false; // Drapeau pour suivre l'état de l'animation

        // Fonction pour mettre à jour la position de la souris
        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            checkIntersection(); // Vérifier l'intersection à chaque mouvement de souris
        };

        // Fonction pour faire tourner l'objet
        const rotateObject = () => {
            if (objectRef.current && !isAnimating) {
                isAnimating = true; // Définir le drapeau pour éviter de redémarrer l'animation
                const targetRotation =
                    objectRef.current.rotation.y + Math.PI * 2; // Deux tours complets
                const initialRotation = objectRef.current.rotation.y;
                const duration = 800; // Durée de l'animation en millisecondes
                const startTime = Date.now();

                const easeOut = (t) => 1 - Math.pow(1 - t, 3); // Fonction d'interpolation ease-out

                const animateRotation = () => {
                    const elapsedTime = Date.now() - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    const easedProgress = easeOut(progress);
                    objectRef.current.rotation.y =
                        initialRotation +
                        (targetRotation - initialRotation) * easedProgress;

                    if (progress < 1) {
                        requestAnimationFrame(animateRotation);
                    } else {
                        isAnimating = false; // Réinitialiser le drapeau après l'animation
                    }
                };

                animateRotation();
            }
        };

        // Fonction pour vérifier l'intersection
        const checkIntersection = () => {
            if (objectRef.current) {
                // Ensure the object is loaded
                raycaster.setFromCamera(mouse, cameraRef.current);
                const intersects = raycaster.intersectObject(
                    objectRef.current,
                    true,
                );

                if (intersects.length > 0) {
                    rotateObject();
                }
            }
        };

        // Ajouter un écouteur d'événements pour la souris
        window.addEventListener('mousemove', onMouseMove);

        // Créer un système de particules
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = Math.random() * 4000 - 2000; // Étendre la largeur
            particlePositions[i * 3 + 1] = Math.random() * 3000 - 200; // Augmenter la hauteur
            particlePositions[i * 3 + 2] = Math.random() * 2000 - 1000; // Profondeur inchangée
        }

        particles.setAttribute(
            'position',
            new THREE.BufferAttribute(particlePositions, 3),
        );

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xdddddd,
            size: 10, // Ajustez la taille selon vos besoins
            map: createCircleTexture(), // Utilisez la texture circulaire générée
            transparent: true,
            opacity: 0.7,
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        // Animation des particules avec ScrollTrigger
        gsap.to(particleSystem.position, {
            y: 3000,
            ease: 'none',
            scrollTrigger: {
                trigger: canvasRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        });

        // Fonction d'animation
        const animate = function () {
            requestAnimationFrame(animate);
            if (cameraRef.current) {
                // Flottement de la caméra sur l'axe des ordonnées (Y)
                cameraRef.current.position.y =
                    Math.sin(Date.now() * 0.0015) * 30;
            }

            // Flottement des particules
            const positions = particles.attributes.position.array;
            const time = Date.now() * 0.001; // Utiliser le temps pour animer

            for (let i = 0; i < particleCount; i++) {
                const index = i * 3;
                const randomOffset = Math.random() * 0.5; // Décalage aléatoire pour chaque particule
                positions[index + 1] += Math.sin(time + i + randomOffset) * 0.5; // Flottement sur l'axe Y
                positions[index + 2] += Math.sin(time + i + randomOffset) * 0.5; // Flottement sur l'axe Z
                positions[index + 0] += Math.sin(time + i + randomOffset) * 0.5; // Flottement sur l'axe X
            }
            particles.attributes.position.needsUpdate = true; // Indiquer que les positions ont changé

            renderer.render(scene, cameraRef.current);
        };

        animate(); // Démarrer l'animation

        // Fonction pour gérer le redimensionnement de la fenêtre
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight; // Mettre à jour le ratio d'aspect
            camera.updateProjectionMatrix(); // Mettre à jour la matrice de projection de la caméra
            renderer.setSize(window.innerWidth, window.innerHeight); // Mettre à jour la taille du renderer
        };

        window.addEventListener('resize', handleResize); // Ajouter l'écouteur d'événements pour le redimensionnement

        // Nettoyer lors du démontage du composant
        return () => {
            window.removeEventListener('resize', handleResize); // Retirer l'écouteur d'événements
            document.body.removeChild(renderer.domElement); // Retirer le canvas du document
            window.removeEventListener('mousemove', onMouseMove);
            document.body.removeChild(textElement); // Retirer l'élément texte du document
        };
    }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une fois lors du montage

    return (
        <>
            <canvas ref={canvasRef} />
            <div className="fixed w-1/2 flex justify-center right-0 top-1/4">
                <p
                    id="moving-text"
                    className="text-white text-6xl opacity-0 font-bold w-full  text-center">
                    Current Prices
                </p>
            </div>
            <div className="fixed w-1/2 flex justify-center left-0 top-1/4">
                <p
                    id="moving-text2"
                    className="text-white text-6xl opacity-0 font-bold w-full  text-center">
                    Your NFTs
                </p>
            </div>
        </>
    );
}
