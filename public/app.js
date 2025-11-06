// ====== DBD COUNTER - NEON SURVIVOR & NEON KILLER ======

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
      display: flex;
      gap: 22px;
      font-family: "Segoe UI", sans-serif;
      user-select: none;
    }

    .dbd-block {
      padding: 14px 20px;
      border-radius: 14px;
      backdrop-filter: blur(6px);
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 120px;
      transition: 0.25s;
    }

    .survivor .dbd-block {
      background: rgba(0, 40, 80, 0.55);
      border: 1px solid rgba(0, 200, 255, 0.6);
      color: #9ce9ff;
      text-shadow: 0 0 12px rgba(0,200,255,0.75);
    }

    .killer .dbd-block {
      background: rgba(60, 0, 0, 0.55);
      border: 1px solid rgba(255, 20, 20, 0.6);
      color: #ff8b8b;
      text-shadow: 0 0 12px rgba(255,0,0,0.6);
    }

    .dbd-label {
      font-size: 14px;
      opacity: .85;
      margin-bottom: 5px;
    }

    .dbd-value {
      font-size: 34px;
      font-weight: 700;
    }
  `;
  document.head.appendChild(style);
}

function mount() {
  const root = document.createElement("div");
  root.id = "dbd-root";

  root.innerHTML = `
    <div class="dbd-panel survivor" id="svPanel">
      <div class="dbd-block"><div class="dbd-label">Escapes</div><div class="dbd-value" id="svEscapes">0</div></div>
      <div class="dbd-block"><div class="dbd-label">Deaths</div><div class="dbd-value" id="svDeaths">0</div></div>
      <div class="dbd-block"><div class="dbd-label">Moris</div><div class="dbd-value" id="svMori">0</div></div>
      <div class="dbd-block"><div class="dbd-label">Hatches</div><div class="dbd-value" id="svHatch">0</div></div>
    </div>

    <div class="dbd-panel killer" id="kPanel" style="display:none">
      <div class="dbd-block"><div class="dbd-label">Hooks</div><div class="dbd-value" id="kHooks">0</div></div>
      <div class="dbd-block"><div class="dbd-label">Sacrifices</div><div class="dbd-value" id="kSac">0</div></div>
      <div class="dbd-block"><div class="dbd-label">4K</div><div class="dbd-value" id="k4k">0</div></div>
      <div class="dbd-block"><div class="dbd-label">Moris</div><div class="dbd-value" id="kMori">0</div></div>
    </div>
  `;

  document.body.appendChild(root);
}

function paint() {
  const sv = STATE.survivor;
  const k = STATE.killer;

  document.getElementById("svPanel").style.display = STATE.mode === "survivor" ? "flex" : "none";
  document.getElementById("kPanel").style.display = STATE.mode === "killer" ? "flex" : "none";

  document.getElementById("svEscapes").textContent = sv.escapes;
  document.getElementById("svDeaths").textContent = sv.deaths;
  document.getElementById("svMori").textContent = sv.mori;
  document.getElementById("svHatch").textContent = sv.hatch;

  document.getElementById("kHooks").textContent = k.hooks;
  document.getElementById("kSac").textContent = k.sac;
  document.getElementById("k4k").textContent = k.k4k;
  document.getElementById("kMori").textContent = k.mori;
}

function listenChat() {
  window.addEventListener("onEventReceived", (ev) => {
    const text = ev?.detail?.event?.data?.text?.trim()?.toLowerCase();
    if (!text) return;

    console.log("[CHAT] =>", text);

    if (text === "!survivor") STATE.mode = "survivor";
    if (text === "!sescapes") STATE.survivor.escapes++;
    if (text === "!sdeath
