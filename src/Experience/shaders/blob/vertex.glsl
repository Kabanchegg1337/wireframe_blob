varying vec2 vUv;
varying float PS;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uPerlinStrength;

#pragma glslify: perlin3d = require('../partials/perlin3d.glsl')

void main(){
    vUv = uv;

    float noice = perlin3d(0.6 * vec3(
        position.x + uTime, 
        position.y + 0.012*cos(2. * 3.1415 * uTime), 
        position.z + 0.012*sin(2. * 3.1415 * uTime)
    )) * 2.;

    noice *= uPerlinStrength;

    vec3 np = position + (noice * normal);

    

    vec4 mvPosition = modelViewMatrix * vec4(np, 1.);

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 0.0002;


    PS = noice;
    vNormal = normal;
    vPosition = np;
}