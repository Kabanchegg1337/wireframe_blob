varying vec2 vUv;
varying float PS;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor;
uniform vec3 uColor2;
uniform float uTime;

#pragma glslify: perlin3d = require('../partials/perlin3d.glsl');


void main(){

    vec3 light = vec3(0.);

    vec3 lightDirection = normalize(vec3(0., 3., 5.5));
    light += dot(lightDirection, vNormal);

    vec3 black = vec3(0.);

    float colorPerlin = perlin3d(vPosition + uTime);

    vec3 colorMix = mix(uColor, uColor2, colorPerlin);

    //vec3 finalColor = mix(black, colorMix, PS * 0.6 + 0.5);

    vec3 finalColor = mix(uColor, uColor2, vUv.y - .5);
    finalColor = mix(black, finalColor, PS * 0.6 + 0.5);

    gl_FragColor = vec4(finalColor, light + 0.5);
}