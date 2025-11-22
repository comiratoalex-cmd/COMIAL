/* ============================================================
   Dynamic Border Generator – Barra PRO
   app.js — versão GitHub Pages (corrigida)
   Carrega themes.json EXTERNAMENTE via fetch()
============================================================ */

let themes = {};
let themesLoaded = false;

/* ===========================
   1. Carregar themes.json
=========================== */
fetch("assets/data/themes.json")
  .then(r => r.json())
  .then(json => {
    themes = json;
    themesLoaded = true;
    loadThemes();
    update(); // inicia a borda depois do carregamento
  })
  .catch(err => console.error("Erro carregando themes.json:", err));

/* ===========================
   2. Preencher <select> Temas
=========================== */
function loadThemes() {
  const themeSelect = document.getElementById("theme");
  themeSelect.innerHTML = "";

  for (const t in themes) {
    let o = document.createElement("option");
    o.value = t;
    o.textContent = t;
    themeSelect.appendChild(o);
  }
}

/* ===========================
   3. Referências
=========================== */
const box = document.getElementById("box");
const mode = document.getElementById("mode");
const speedInput = document.getElementById("speed");

const c1 = document.getElementById("c1");
const c2 = document.getElementById("c2");
const c3 = document.getElementById("c3");
const c4 = document.getElementById("c4");

const hueShift = document.getElementById("hueShift");

/* ===========================
   4. Atualizar borda
=========================== */
function update() {
  const selectedMode = mode.value;
  const speed = speedInput.value;

  box.style.setProperty("--speed", speed + "s");

  /* ------------------------
     MODO TEMAS (JSON)
  -------------------------*/
  if (selectedMode === "themes" && themesLoaded) {
    const th = themes[document.getElementById("theme").value];
    if (!th) return;

    box.style.setProperty("--c1", th[0]);
    box.style.setProperty("--c2", th[1]);
    box.style.setProperty("--c3", th[2]);
    box.style.setProperty("--c4", th[3]);
    box.style.setProperty("--glow", th[2]);
  }

  /* ------------------------
     MODO MANUAL (C1–C4)
  -------------------------*/
  if (selectedMode === "manual") {
    box.style.setProperty("--c1", c1.value);
    box.style.setProperty("--c2", c2.value);
    box.style.setProperty("--c3", c3.value);
    box.style.setProperty("--c4", c4.value);
    box.style.setProperty("--glow", c3.value);
  }

  /* ------------------------
     MODO HUE SHIFT (Pastel)
  -------------------------*/
  if (selectedMode === "hue") {
    const shift = hueShift.value;

    const base = [
      "#ffb3c6", // rosa pastel
      "#bde0fe", // azul claro
      "#c9f8ff", // aqua pastel
      "#ffe6d1"  // pêssego pastel
    ];

    const rotated = base.map(c => rotateHue(c, shift));

    box.style.setProperty("--c1", rotated[0]);
    box.style.setProperty("--c2", rotated[1]);
    box.style.setProperty("--c3", rotated[2]);
    box.style.setProperty("--c4", rotated[3]);
    box.style.setProperty("--glow", rotated[2]);
  }
}

/* ============================================================
   Utilidades — Conversão RGB/HSV + rotação de HUE
============================================================ */

function rotateHue(hex, deg) {
  let ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = hex;
  let col = ctx.fillStyle;

  let r = parseInt(col.substr(1,2),16);
  let g = parseInt(col.substr(3,2),16);
  let b = parseInt(col.substr(5,2),16);

  let hsv = rgbToHsv(r,g,b);
  hsv.h = (hsv.h * 360 + parseInt(deg)) % 360;

  return hsvToHex(hsv.h/360, hsv.s, hsv.v);
}

function rgbToHsv(r,g,b){
  r/=255; g/=255; b/=255;
  let max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h,s,v=max, d=max-min;

  s=max==0?0:d/max;

  if(max==min) h=0;
  else {
    switch(max){
      case r: h=(g-b)/d+(g<b?6:0); break;
      case g: h=(b-r)/d+2; break;
      case b: h=(r-g)/d+4; break;
    }
    h/=6;
  }
  return {h:h, s:s, v:v};
}

function hsvToHex(h,s,v){
  let r,g,b,i,f,p,q,t;
  i=Math.floor(h*6);
  f=h*6-i;
  p=v*(1-s);
  q=v*(1-f*s);
  t=v*(1-(1-f)*s);

  switch(i%6){
    case 0: r=v; g=t; b=p; break;
    case 1: r=q; g=v; b=p; break;
    case 2: r=p; g=v; b=t; break;
    case 3: r=p; g=q; b=v; break;
    case 4: r=t; g=p; b=v; break;
    case 5: r=v; g=p; b=q; break;
  }

  return "#" + 
    ((1<<24)+
    (Math.round(r*255)<<16)+
    (Math.round(g*255)<<8)+
    Math.round(b*255))
    .toString(16).slice(1);
}

/* ============================================================
   Eventos
============================================================ */

document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", update);
});
