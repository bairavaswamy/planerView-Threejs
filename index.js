import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import  gsap from "gsap";

const reycaster = new THREE.Raycaster();
const gui = new dat.GUI();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(devicePixelRatio);

document.body.appendChild(renderer.domElement);

const customvals = {
    plane:{
        width:50,
        height:50,
        widthSegment:50,
        heightSegment:50
    }
}

const renderFun = ()=>{
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(customvals.plane.width,
                    customvals.plane.height,customvals.plane.widthSegment,
                    customvals.plane.heightSegment);
    const {array} = mesh.geometry.attributes.position
    for (let i=0;i<array.length;i+=3){
        const x = array[i]
        const y = array[i+1]
        const z = array[i+2]
        array[i+2] = z + Math.random();
    }
    for(let i=0;i<num;i++){
        cols.push(0,1,0)
    }
    
    mesh.geometry.setAttribute("color",new THREE.BufferAttribute(new Float32Array(cols),3));
    
    
}

gui.add(customvals.plane,"width",10,500).onChange(renderFun);
gui.add(customvals.plane,"height",10,500).onChange(renderFun);
gui.add(customvals.plane,"widthSegment",20,100).onChange(renderFun);
gui.add(customvals.plane,"heightSegment",20,100).onChange(renderFun);


const geometry = new THREE.PlaneGeometry(5,5,10,10);
const material = new THREE.MeshPhongMaterial({side:THREE.DoubleSide,flatShading:true,vertexColors:true})
const mesh = new THREE.Mesh(geometry,material);

scene.add(mesh);

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(0,0,1);
scene.add(light);

const backlight = new THREE.DirectionalLight(0xffffff,1);
backlight.position.set(0,0,-1);
scene.add(backlight);

camera.position.z = 5;
new OrbitControls(camera,renderer.domElement)

const {array} = mesh.geometry.attributes.position
for (let i=0;i<array.length;i+=3){
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]
    array[i+2] = z + Math.random();
}

const num = mesh.geometry.attributes.position.count;

const cols = []
for(let i=0;i<num;i++){
    cols.push(0,1,0)
}

mesh.geometry.setAttribute("color",new THREE.BufferAttribute(new Float32Array(cols),3));


const mouseCoords = {
    x:undefined,
    y:undefined
}

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
    reycaster.setFromCamera(mouseCoords,camera);
    const intresect = reycaster.intersectObject(mesh)
    if(intresect.length >0){
        const {color} = intresect[0].object.geometry.attributes
        color.setX(intresect[0].face.a,1.5);
        color.setY(intresect[0].face.a,1);
        color.setZ(intresect[0].face.a,0);

        color.setX(intresect[0].face.b,1.5);
        color.setY(intresect[0].face.b,1);
        color.setZ(intresect[0].face.b,0);

        color.setX(intresect[0].face.c,1.5);
        color.setY(intresect[0].face.c,1);
        color.setZ(intresect[0].face.c,0);

        color.needsUpdate = true;

        const intial = {
            r:0,
            g:1,
            b:0
        }
        const hover = {
            r:1.5,
            g:1,
            b:0
        }
        gsap.to(hover,{
            r:intial.r,
            g:intial.g,
            b:intial.b,
            onUpdate : () =>{
                color.setX(intresect[0].face.a,hover.r);
                color.setY(intresect[0].face.a,hover.g);
                color.setZ(intresect[0].face.a,hover.b);

                color.setX(intresect[0].face.b,hover.r);
                color.setY(intresect[0].face.b,hover.g);
                color.setZ(intresect[0].face.b,hover.b);

                color.setX(intresect[0].face.c,hover.r);
                color.setY(intresect[0].face.c,hover.g);
                color.setZ(intresect[0].face.c,hover.b);

            }
        })
    }
}

animate();


addEventListener("mousemove",(event)=>{
    mouseCoords.x = Math.max(-1, Math.min(1, (event.clientX / innerWidth) * 2 - 1));
    mouseCoords.y = Math.max(-1, Math.min(1, -(event.clientY / innerHeight) * 2 + 1));
})