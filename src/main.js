import * as THREE from 'three';

const canvas = document.querySelector('#world');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x91b9c9);
scene.fog = new THREE.Fog(0x91b9c9, 34, 115);
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 250);
camera.position.set(0, 5, 9);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

scene.add(new THREE.HemisphereLight(0xd7efff, 0x76604a, 2.0));
const sun = new THREE.DirectionalLight(0xffe0ad, 3.0);
sun.position.set(-18, 28, 12); sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left=-35; sun.shadow.camera.right=35; sun.shadow.camera.top=35; sun.shadow.camera.bottom=-35;
scene.add(sun);

const mats = {
  road: new THREE.MeshStandardMaterial({color:0x343b3d,roughness:.95}),
  sidewalk: new THREE.MeshStandardMaterial({color:0xb9aa8e,roughness:1}),
  grass: new THREE.MeshStandardMaterial({color:0x637a4c,roughness:1}),
  white: new THREE.MeshStandardMaterial({color:0xe8ddc7,roughness:.9}),
  cream: new THREE.MeshStandardMaterial({color:0xd8bd8e,roughness:.9}),
  peach: new THREE.MeshStandardMaterial({color:0xc98160,roughness:.9}),
  blue: new THREE.MeshStandardMaterial({color:0x729da7,roughness:.9}),
  teal: new THREE.MeshStandardMaterial({color:0x4d7772,roughness:.9}),
  roof: new THREE.MeshStandardMaterial({color:0x65594c,roughness:1}),
  dark: new THREE.MeshStandardMaterial({color:0x293438,roughness:.85}),
  yellow: new THREE.MeshStandardMaterial({color:0xe6ad48,roughness:.8}),
  leaf: new THREE.MeshStandardMaterial({color:0x39704a,roughness:1}),
  trunk: new THREE.MeshStandardMaterial({color:0x735139,roughness:1})
};
function box(w,h,d,mat,x,y,z,shadow=true){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;scene.add(m);return m;}
function ground(w,d,mat,x,z){return box(w,.18,d,mat,x,-.13,z,false);}
ground(220,220,mats.grass,0,0);
ground(12,150,mats.road,0,0);
ground(150,12,mats.road,0,0);
ground(5,150,mats.sidewalk,-8.5,0); ground(5,150,mats.sidewalk,8.5,0);
ground(150,5,mats.sidewalk,0,-8.5); ground(150,5,mats.sidewalk,0,8.5);
// Road markings
const stripeMat = new THREE.MeshStandardMaterial({color:0xf3e6bd,emissive:0x222015});
for(let z=-68;z<70;z+=8) box(.13,.025,3,stripeMat,0,.01,z,false);
for(let x=-68;x<70;x+=8) box(3,.025,.13,stripeMat,x,.01,0,false);

// Ghanaian-inspired neighbourhood: painted low-rise shops and homes, verandas, signs and kiosks.
const buildingMats=[mats.white,mats.cream,mats.peach,mats.blue,mats.teal];
function building(x,z,w,d,h,mat,front='south'){
  box(w,h,d,mat,x,h/2,z);
  box(w+.18,.18,d+.18,mats.roof,x,h+.06,z);
  const faceZ = front==='south' ? z+d/2+.015 : z-d/2-.015;
  const faceX = front==='west' ? x-w/2-.015 : x+w/2+.015;
  const horizontal = front==='south'||front==='north';
  const n=Math.max(2,Math.floor(w/1.7));
  for(let i=0;i<n;i++){
    const px=x-w/2+(i+.5)*w/n;
    const winMat=new THREE.MeshStandardMaterial({color:0x243a43,metalness:.25,roughness:.25});
    if(horizontal){
      box(.62,1.0,.06,winMat,px,h*.57,faceZ,false);
      box(.7,.09,.12,mats.white,px,h*.57+.52,faceZ,false);
    }
  }
  // Shopfront awning and a colourful signboard facing the main street.
  if(front==='south'){
    box(w*.82,.12,.75,mats.yellow,x,.95,z+d/2+.37);
    box(w*.86,.42,.09,mats.dark,x,1.65,z+d/2+.04,false);
  }
}
for(let i=0;i<7;i++){
  const z=-25+i*8.5;
  building(-15,z,7,6,3.2,buildingMats[i%buildingMats.length],'east');
  building(15,z,7,6,3.5,buildingMats[(i+2)%buildingMats.length],'west');
}
building(-20,-8,9,8,4.2,mats.peach,'south');
building(21,10,10,8,4.8,mats.blue,'south');
building(-22,13,8,8,3.8,mats.cream,'south');
building(22,-18,9,8,3.6,mats.teal,'south');

// Kiosks and roadside stalls
function kiosk(x,z,colour){
 const c=new THREE.MeshStandardMaterial({color:colour,roughness:.85});
 box(2.5,1.8,2.1,c,x,.9,z);
 box(2.9,.16,2.5,mats.yellow,x,1.95,z);
 box(2.1,.75,.08,mats.dark,x,.95,z+1.08,false);
}
kiosk(-10,-3,0xb85b42); kiosk(10,4,0x4f8a78); kiosk(-11,17,0xd4a44b); kiosk(11,-17,0x7a6ca0);

// Palms and shade trees, assembled from simple geometry.
function tree(x,z,scale=1){
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.18*scale,.28*scale,2.5*scale,7),mats.trunk);
 trunk.position.set(x,1.2*scale,z); trunk.castShadow=true;scene.add(trunk);
 for(let i=0;i<5;i++){
  const crown=new THREE.Mesh(new THREE.ConeGeometry(1.15*scale,2.0*scale,7),mats.leaf);
  crown.position.set(x+(Math.sin(i*2.4)*.35*scale),2.7*scale,z+(Math.cos(i*2.4)*.35*scale));crown.castShadow=true;scene.add(crown);
 }
}
[[-10,-14],[10,14],[-11,27],[11,-28],[-25,0],[25,0],[-30,20],[30,-15]].forEach(([x,z],i)=>tree(x,z,.8+(i%3)*.15));

// Street lamps
for(let z=-24;z<=24;z+=16){
 for(const x of [-7.4,7.4]){
  box(.12,3.2,.12,mats.dark,x,1.5,z,false);
  box(.65,.12,.3,mats.yellow,x,3.1,z,false);
 }
}

// Player: stylized original citizen model with a bright shirt.
const player=new THREE.Group(); scene.add(player);
const skin=new THREE.MeshStandardMaterial({color:0x754a32,roughness:.85});
const shirt=new THREE.MeshStandardMaterial({color:0xe5a943,roughness:.8});
const trousers=new THREE.MeshStandardMaterial({color:0x293b4a,roughness:.9});
function playerPart(geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;player.add(m);return m;}
playerPart(new THREE.CapsuleGeometry(.34,.7,4,8),shirt,0,1.25,0);
playerPart(new THREE.SphereGeometry(.27,16,12),skin,0,1.95,0);
const hair=new THREE.MeshStandardMaterial({color:0x171a1a,roughness:1});
playerPart(new THREE.SphereGeometry(.275,12,8,0,Math.PI*2,0,Math.PI*.55),hair,0,2.08,0);
const legL=playerPart(new THREE.BoxGeometry(.19,.62,.22),trousers,-.16,.48,0);
const legR=playerPart(new THREE.BoxGeometry(.19,.62,.22),trousers,.16,.48,0);
const armL=playerPart(new THREE.CapsuleGeometry(.09,.48,3,6),skin,-.42,1.35,0);
const armR=playerPart(new THREE.CapsuleGeometry(.09,.48,3,6),skin,.42,1.35,0);
player.position.set(0,0,4);

// First enterable location: a small provision shop interior.
const shopInterior = new THREE.Group();
scene.add(shopInterior);
const shopMat = (color, roughness=.85) => new THREE.MeshStandardMaterial({color, roughness});
const shopFloor = shopMat(0xbda783), shopWall = shopMat(0xe6d7b7), shopTrim = shopMat(0x4d7772);
const shelfMat = shopMat(0x805a3c), productMats = [shopMat(0xe6ad48),shopMat(0x4f8a78),shopMat(0xc98160),shopMat(0x729da7)];
function shopBox(w,h,d,mat,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;shopInterior.add(o);return o;}
shopBox(12,.2,12,shopFloor,0,-.12,0);
shopBox(12,4,.2,shopWall,0,1.9,-6);
shopBox(.2,4,12,shopWall,-6,1.9,0);
shopBox(.2,4,12,shopWall,6,1.9,0);
// Front wall is split to leave an open doorway.
shopBox(3.5,4,.2,shopWall,-4.25,1.9,6);
shopBox(3.5,4,.2,shopWall,4.25,1.9,6);
shopBox(5,.25,.25,shopTrim,0,3.8,5.9);
for(const z of [-3,0,3]){
 shopBox(2.7,.18,.7,shelfMat,-3.8,1.1,z);
 shopBox(2.7,.18,.7,shelfMat,-3.8,2.1,z);
 for(let i=0;i<4;i++){
  shopBox(.38,.48,.38,productMats[(i+Math.abs(z))%productMats.length],-4.7+i*.6,1.42,z);
  shopBox(.38,.48,.38,productMats[(i+1+Math.abs(z))%productMats.length],-4.7+i*.6,2.42,z);
 }
}
shopBox(3,.95,1.1,shelfMat,2.5,.48,-2);
shopBox(2.7,.12,.9,shopTrim,2.5,1.02,-2);
shopBox(1.7,.9,.5,shelfMat,2.5,.48,2);
shopBox(1.2,.08,.4,shopMat(0xf3e6bd),2.5,.97,2);
const shopSign = shopBox(3,.65,.12,shopTrim,0,3.2,-5.82);
const exteriorObjects = scene.children.filter(o => o !== player && o !== shopInterior && !o.isLight);
const enterButton = document.querySelector('#enter-button');
let insideShop = false;
function setShopInterior(enter){
 insideShop=enter;
 exteriorObjects.forEach(o=>o.visible=!enter);
 shopInterior.visible=enter;
 player.visible=true;
 if(enter){
  player.position.set(0,0,3.5); yaw=0; camera.position.set(0,4,10);
  enterButton.textContent='Exit shop';
  showToast('Welcome! Explore the shop, then tap Exit shop.');
 }else{
  player.position.set(5.1,0,4); yaw=Math.PI;
  enterButton.textContent='Enter shop';
  showToast('You stepped back out onto the street.');
 }
}
shopInterior.visible=false;
enterButton.addEventListener('click',()=>setShopInterior(!insideShop));
addEventListener('keydown',e=>{
 if(e.key.toLowerCase()==='e' && !e.repeat){
  if(insideShop) setShopInterior(false);
  else if(Math.hypot(player.position.x-5.1,player.position.z-4)<2.8) setShopInterior(true);
 }
});

const keys=new Set();
addEventListener('keydown',e=>{keys.add(e.key.toLowerCase());if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase()))e.preventDefault();});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
addEventListener('blur',()=>keys.clear());
let yaw=0, pitch=-.12, moving=0, cash=250, toastTimer;
const toast=document.querySelector('#toast');
function showToast(message){toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2500);}
let stickX=0,stickY=0;
const stick=document.querySelector('#stick'), knob=document.querySelector('#stick-knob');
if(stick){
 const moveStick=e=>{const r=stick.getBoundingClientRect();const p=e.touches?e.touches[0]:e;let dx=p.clientX-(r.left+r.width/2),dy=p.clientY-(r.top+r.height/2);const max=29,len=Math.hypot(dx,dy);if(len>max){dx=dx/len*max;dy=dy/len*max}stickX=dx/max;stickY=dy/max;knob.style.transform=`translate(${dx}px,${dy}px)`;};
 const release=()=>{stickX=0;stickY=0;knob.style.transform='translate(0,0)'};
 stick.addEventListener('pointerdown',e=>{stick.setPointerCapture(e.pointerId);moveStick(e)});
 stick.addEventListener('pointermove',e=>{if(e.buttons)moveStick(e)});
 stick.addEventListener('pointerup',release);stick.addEventListener('pointercancel',release);
}
document.querySelector('#look-left').addEventListener('click',()=>yaw+=.28);
document.querySelector('#look-right').addEventListener('click',()=>yaw-=.28);
const overlay=document.querySelector('#map-overlay');
document.querySelector('#map-button').addEventListener('click',()=>overlay.classList.add('open'));
document.querySelector('#close-map').addEventListener('click',()=>overlay.classList.remove('open'));
overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open')});

// Pointer drag lets desktop players look around without locking the pointer.
let dragging=false,lastX=0;
canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)}});
canvas.addEventListener('pointermove',e=>{if(dragging){yaw-=(e.clientX-lastX)*.004;lastX=e.clientX}});
canvas.addEventListener('pointerup',()=>dragging=false);
canvas.addEventListener('pointercancel',()=>dragging=false);

const clockEl=document.querySelector('#clock');
let gameTime=8*60;
const clockTick=()=>{gameTime=(gameTime+.035)%(24*60);const hh=String(Math.floor(gameTime/60)).padStart(2,'0'),mm=String(Math.floor(gameTime%60)).padStart(2,'0');clockEl.textContent=hh+':'+mm};
const clockTimer=setInterval(clockTick,1000);

const forward=new THREE.Vector3(), right=new THREE.Vector3(), move=new THREE.Vector3(), camOffset=new THREE.Vector3();
const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),.04);
 let f=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0)-stickY;
 let r=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0)+stickX;
 const len=Math.hypot(f,r);moving=Math.min(1,len);
 if(len>1){f/=len;r/=len}
 forward.set(-Math.sin(yaw),0,-Math.cos(yaw));right.set(Math.cos(yaw),0,-Math.sin(yaw));
 move.copy(forward).multiplyScalar(f).addScaledVector(right,r);
 if(move.lengthSq()>.001){
  player.position.addScaledVector(move,dt*5.1);
  player.rotation.y=Math.atan2(move.x,move.z);
  legL.rotation.x=Math.sin(performance.now()*.012)*.55*moving;
  legR.rotation.x=-legL.rotation.x;armL.rotation.x=-legL.rotation.x*.65;armR.rotation.x=-legR.rotation.x*.65;
 }else{legL.rotation.x=THREE.MathUtils.damp(legL.rotation.x,0,9,dt);legR.rotation.x=THREE.MathUtils.damp(legR.rotation.x,0,9,dt);armL.rotation.x=0;armR.rotation.x=0}
 player.position.x=THREE.MathUtils.clamp(player.position.x,insideShop?-5.1:-6.2,insideShop?5.1:6.2);
 player.position.z=THREE.MathUtils.clamp(player.position.z,insideShop?-5.1:-70,insideShop?5.1:70);
 const behind=new THREE.Vector3(Math.sin(yaw)*7,4.1,Math.cos(yaw)*7);
 camera.position.lerp(player.position.clone().add(behind),1-Math.exp(-4*dt));
 camera.lookAt(player.position.x,player.position.y+1.35,player.position.z);
 document.querySelector('#district').textContent=insideShop?'OSU PROVISION SHOP':Math.abs(player.position.z)<18?'OSU DISTRICT':player.position.z<0?'OXFORD STREET':'CANTONMENTS ROAD';
 const nearShop=!insideShop && Math.hypot(player.position.x-5.1,player.position.z-4)<2.8;
 enterButton.hidden=!insideShop&&!nearShop;
 if(!insideShop && nearShop) enterButton.textContent='Enter shop';
 renderer.render(scene,camera);
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight)});
showToast('Welcome to AccraVerse — use WASD or the joystick to explore!');
