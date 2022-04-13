import * as THREE from 'three';
import Experience from './Experience';
import fragmentShader from './shaders/blob/fragment.glsl'
import vertexShader from './shaders/blob/vertex.glsl'


export default class Blob{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.config = this.experience.config;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        this.title = document.querySelector('h1');

        if (this.debug){
            this.debugFolder = this.debug.addFolder({
                title: "Blob"
            })
        }
        this.lastElapsedTime = 0;

        this.parallax = {
            multiplier: {
                target: {
                    x: 0,
                    y: 0,
                },
                eased: {
                    x: 0,
                    y: 0,
                    multiplier: 0.0045,
                }
            }
        };


        this.setGeometry();
        this.setMaterial();
        this.setMesh();
        this.setMouseEvents();


    }
    setMouseEvents() {
        document.addEventListener('mousemove', (e) => {
            const rotationCoefX = (e.clientX / this.config.width) - 0.5;
            const rotationCoefY = (e.clientY / this.config.height) - 0.5;
            this.parallax.multiplier.target.x = rotationCoefX * 0.075;
            this.parallax.multiplier.target.y = rotationCoefY * 0.075;
        })
    }


    setGeometry(){
        this.geometry = new THREE.OctahedronGeometry(3.5, 90);
    }
    setMaterial(){
        this.color = {};
        //red wireframe #a32f2f
        //Purple #3630a4
        this.color.hex = "#3630a4";
        this.color.instance = new THREE.Color(this.color.hex);
        this.color2 = {};
        //red wireframe #51004f
        //purple #51004f
        this.color2.hex = "#51004f";
        this.color2.instance = new THREE.Color(this.color2.hex);

        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            wireframe: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: {value: 0},
                uPerlinStrength: {value: 1.478},
                uColor: {value: this.color.instance},
                uColor2: {value: this.color2.instance}
            }
        })

        if(this.debug){
            this.debugFolder.addInput(
                this.material.uniforms.uPerlinStrength,
                'value',
                {min: 0, max: 4, step: 0.001}
            )
            this.debugFolder.addInput(
                this.color,
                'hex',
                {picker: "inline"}
            ).on('change', () => {
                this.color.instance.set(this.color.hex);
            })
            this.debugFolder.addInput(
                this.color2,
                'hex',
                {picker: "inline"}
            ).on('change', () => {
                this.color2.instance.set(this.color2.hex);
            })
        }
    }
    setMesh(){
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotateX(0.4)
        this.mesh.scale.set(1, 1, 1);
        this.scene.add(this.mesh);

        /* this.mesh = new THREE.Points(this.geometry, this.material);
        this.mesh.rotateX(0.4)
        this.mesh.scale.set(0.8, 0.8, 0.8);
        this.scene.add(this.mesh); */
    }

    easeInOutSine(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
    easeOutQuad(x) {
        return 1 - (1 - x) * (1 - x);
    }

    easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        }
    normalize(val, max, min) { return (val - min) / (max - min); }
    update(){
        const deltaTime = this.time.elapsed - this.lastElapsedTime; 
        this.lastElapsedTime = this.time.elapsed;

        this.parallax.multiplier.eased.x += (this.parallax.multiplier.target.x - this.parallax.multiplier.eased.x) * deltaTime * this.parallax.multiplier.eased.multiplier;
        
        this.parallax.multiplier.eased.y += (this.parallax.multiplier.target.y - this.parallax.multiplier.eased.y) * deltaTime * this.parallax.multiplier.eased.multiplier;

        //2.24
        this.mesh.material.uniforms.uPerlinStrength.value = this.parallax.multiplier.eased.x * 30;

        this.title.style.transform = `translateX(${this.parallax.multiplier.eased.x * 1500}px) translateY(${this.parallax.multiplier.eased.y * 1500}px)`
        this.mesh.material.uniforms.uTime.value = this.time.elapsed * 0.0001 + this.parallax.multiplier.eased.x * 60;
        this.mesh.rotation.y = this.parallax.multiplier.eased.x * 10;
        this.mesh.rotation.x = this.parallax.multiplier.eased.y * 5;
    }
}