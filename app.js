<!-- =============================
PART 4 — assets/js/app.js
============================= -->
const themes = JSON.parse(document.getElementById("themesJSON")?.textContent || '{}');


const themeSelect = document.getElementById("theme");
for(const t in themes){ let o=document.createElement("option"); o.value=t;o.textContent=t; themeSelect.appendChild(o);}


const box=document.getElementById("box");


function update(){
const mode=document.getElementById("mode").value;
const speed=document.getElementById("speed").value;
box.style.setProperty('--speed', speed+'s');


if(mode==="themes"){
const th=themes[themeSelect.value];
box.style.setProperty('--c1',th[0]);
box.style.setProperty('--c2',th[1]);
box.style.setProperty('--c3',th[2]);
box.style.setProperty('--c4',th[3]);
box.style.setProperty('--glow',th[2]);
}


if(mode==="manual"){
box.style.setProperty('--c1',c1.value);
box.style.setProperty('--c2',c2.value);
box.style.setProperty('--c3',c3.value);
box.style.setProperty('--c4',c4.value);
box.style.setProperty('--glow',c3.value);
}


if(mode==="hue"){
const shift=hueShift.value;
const base=["#ffb3c6","#bde0fe","#c9f8ff","#ffe6d1"];
const rot=base.map(c=>rotateHue(c,shift));
box.style.setProperty('--c1',rot[0]);
box.style.setProperty('--c2',rot[1]);
box.style.setProperty('--c3',rot[2]);
box.style.setProperty('--c4',rot[3]);
box.style.setProperty('--glow',rot[2]);
}
}


function rotateHue(hex,deg){
let c=document.createElement('canvas').getContext('2d');
c.fillStyle=hex;
let col=c.fillStyle;
let r=parseInt(col.substr(1,2),16);
let g=parseInt(col.substr(3,2),16);
let b=parseInt(col.substr(5,2),16);
let hsv=rgbToHsv(r,g,b);
hsv.h=(hsv.h*360+parseInt(deg))%360;
return hsvToRgb(hsv.h/360,hsv.s,hsv.v);
