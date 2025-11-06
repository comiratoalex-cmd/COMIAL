// ====== DBD COUNTER - NEON SURVIVOR THEME ======
// Feito para funcionar em StreamElements + OBS sem configuração extra

const STATE = {
  mode: "survivor",
  killer: { hooks: 0, sac: 0, k4k: 0, mori: 0 },
  survivor: { escapes: 0, deaths: 0, mori: 0, hatch: 0 }
};

function neonStyle() {
  const style = document.createElement("style");
  style.innerHTML = `
    #dbd-root {
      position: absolute;
      top: 20px;
      left: 20px;
      font-family: "Segoe UI", sans-serif;
      color: #fff;
      user-select: none;
      display: flex;
      gap: 22px;
      font-weight: 600;
      text-shadow: 0 0 12px rgba(0,200,255,0.75);
    }
    .dbd-block {
      padding: 14px 20px;
      border-radius: 12px;
      background: rgba(0,15,30,0.55);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(0,200,255,0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 120px;
    }
    .dbd-label {
      font-size: 14px;
      opacity: .9;
      margin-bottom: 6px;
    }
    .dbd-value {
      font-size: 32px;
      font-weight: 700;
    }
  `;
  document.head.appendChild(style);
}

function mount() {
  const root = document.createElement("div");
  root.id = "dbd-root";
  root.innerHTML = `
    <div class="dbd-block"><div class="dbd-label">Escapes</div><div class="dbd-value" id="svEscapes">0</div></div>
    <div class="dbd-block"><div class="dbd-label">Deaths</div><div class="dbd-value" id="svDeaths">0</div></div>
    <div class="dbd-block"><div class="dbd-label">Moris</div><div class="dbd-value" id="svMori">0</div></div>
    <div class="dbd-block"><div class="dbd-label">Hatches</div><div class="dbd-value" id="svHatch">0</div></div>
  `;
  document.body.appendChild(root);
}

function paint() {
  document.getElementById("svEscapes").textContent = STATE.survivor.escapes;
  document.getElementById("svDeaths").textContent = STATE.survivor.deaths;
  document.getElementById("svMori").textContent = STATE.survivor.mori;
  document.getElementById("svHatch").textContent = STATE.survivor.hatch;
}

function listenChat() {
  window.addEventListener("onEventReceived", (ev) => {
    const d = ev?.detail;
    if (!d || d.listener !== "message") return;
    const msg = d.event.data.text.trim().toLowerCase();
    console.log("[CHAT] =>", msg);

    if (msg === "!survivor") STATE.mode = "survivor";
    if (msg === "!sescapes") STATE.survivor.escapes++;
    if (msg === "!sdeath") STATE.survivor.deaths++;
    if (msg === "!smori") STATE.survivor.mori++;
    if (msg === "!shatch") STATE.survivor.hatch++;

    if (msg === "!killer") STATE.mode = "killer";
    if (msg === "!khook") STATE.killer.hooks++;
    if (msg === "!ksac") STATE.killer.sac++;
    if (msg === "!k4k") STATE.killer.k4k++;
    if (msg === "!kmori") STATE.killer.mori++;

    if (msg === "!resetall") {
      STATE.killer = { hooks: 0, sac: 0, k4k: 0, mori: 0 };
      STATE.survivor = { escapes: 0, deaths: 0, mori: 0, hatch: 0 };
    }

    paint();
  });
}

function init() {
  neonStyle();
  mount();
  paint();
  listenChat();
  console.log("✅ DBD NEON SURVIVOR ATIVO");
}

// Carrega quando widget iniciar
window.addEventListener("onWidgetLoad", init);
