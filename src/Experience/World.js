import * as THREE from 'three'
import Blob from './Blob.js'
import Experience from './Experience.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setBlob()
            }
        })
    }

    setDummy()
    {
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ map: this.resources.items.lennaTexture })
        )
        this.scene.add(cube)        
    }

    setBlob(){
        this.blob = new Blob();
        this.scene.add(this.blob);
    }

    resize()
    {
    }

    update()
    {
        if (this.blob){
            this.blob.update();
        }
    }

    destroy()
    {
    }
}