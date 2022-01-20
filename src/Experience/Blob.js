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
        this.geometry = new THREE.SphereBufferGeometry(3.5, 150, 150);
    }
    setMaterial(){
        this.color = {};
        //Gold wireframe #ff7c00
        //Gradient colors: 4b39f8
        this.color.hex = "#4b39f8";
        this.color.instance = new THREE.Color(this.color.hex);
        this.color2 = {};
        //Gold wireframe #927602
        //Gradient colors: 840192
        this.color2.hex = "#840192";
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
        this.mesh.scale.set(0.8, 0.8, 0.8);
        this.scene.add(this.mesh);

        /* this.mesh = new THREE.Points(this.geometry, this.material);
        this.mesh.rotateX(0.4)
        this.mesh.scale.set(0.8, 0.8, 0.8);
        this.scene.add(this.mesh); */
    }

    update(){
        //this.mesh.rotation.x = this.time.elapsed * 0.0001;
        //this.mesh.rotation.z = this.time.elapsed * 0.0002;

        const deltaTime = this.time.elapsed - this.lastElapsedTime; 
        this.lastElapsedTime = this.time.elapsed;

        this.parallax.multiplier.eased.x += (this.parallax.multiplier.target.x - this.parallax.multiplier.eased.x) * deltaTime * this.parallax.multiplier.eased.multiplier;
        this.parallax.multiplier.eased.y += (this.parallax.multiplier.target.y - this.parallax.multiplier.eased.y) * deltaTime * this.parallax.multiplier.eased.multiplier;

        this.mesh.material.uniforms.uPerlinStrength.value = this.parallax.multiplier.eased.x * 60;


        this.mesh.material.uniforms.uTime.value = this.time.elapsed * 0.0001 + this.parallax.multiplier.eased.x * 60;
        this.mesh.rotation.y = this.parallax.multiplier.eased.x * 10;
        this.mesh.rotation.x = this.parallax.multiplier.eased.y * 5;
    }
}