(() => {
  const LOG = (...a) => console.log("[DBD NEON]", ...a);

  const now = () => Date.now();
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function hasPermission(tags, mode) {
    const isBroad = tags?.badges?.some(b => b.type === "broadcaster");
    const isMod = tags?.badges?.some(b => b.type === "moderator");
    const isVip = tags?.badges?.some(b => b.type === "vip");
    const isSub = tags?.badges?.some(b => b.type === "subscriber");

    switch (mode) {
      case "broadcaster": return isBroad;
      case "mods": return isBroad || isMod;
      case "vips": return isBroad || isMod || isVip;
      case "subs": return isBroad || isMod || isVip || isSub;
      default: return true;
    }
  }

  const STATE = {
    mode: "survivor",
    killer: { hooks: 0, sac: 0, k4k: 0, mori: 0 },
    survivor: { escapes: 0, deaths: 0, mori: 0, hatch: 0 },
    cooldown: new Map()
  };

  function neonStyle(killerAccent, survivorAccent, bg) {
    const css = `
    :root {
      --killer: ${killerAccent || "#f41a1e"};
      --survivor: ${survivorAccent || "#28b4ff"};
      --bg: ${bg || "rgba(0,0,0,.45)"};
      --glow: 0 0 14px var(--survivor), 0 0 24px var(--survivor);
    }

    #dbd-root { font-family: Saira, system-ui; padding:12px; color:#E8EAED; }

    .panel {
      backdrop-filter: blur(10px);
      border-radius:14px;
      border:1px solid rgba(255,255,255,.2);
      background: var(--bg);
      padding:14px;
    }

    .header {
      display:flex; justify-content:space-between;
      text-transform:uppercase; font-weight:600; margin-bottom:8px;
    }

    .mode { padding:4px 10px; border-radius:10px; border:1px solid rgba(255,255,255,.25); }

    .mode.killer { color:var(--killer); text-shadow:0 0 8px var(--killer); }
    .mode.survivor { color:var(--survivor); text-shadow:var(--glow); }

    .grid { display:grid; gap:8px; grid-template-columns:repeat(4,minmax(0,1fr)); }

    .tile {
      display:flex; flex-direction:column; align-items:center;
      background:rgba(8,12,16,.4); border-radius:12px; padding:12px;
      border:1px solid rgba(255,255,255,.1);
      transition:0.25s;
    }

    .tile:hover { transform:translateY(-2px) scale(1.04); filter:brightness(1.35); }

    .label { font-size:12px; opacity:.9; }
    .value { font-size:22px; font-weight:700; margin-top:4px; }

    .killer .value { color:var(--killer); text-shadow:0 0 8px var(--killer); }
    .survivor .value { color:var(--survivor); text-shadow:var(--glow); }
    `;
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
  }

  function mount() {
    document.body.innerHTML = `
    <div id="dbd-root">
      <div class="panel">
        <div class="header">
          <div>DBD COUNTER</div>
          <div id="mode" class="mode">...</div>
        </div>
        <div id="grid" class="grid"></div>
      </div>
    </div>`;
  }

  function paint(fd) {
    const m = document.getElementById("mode");
    const g = document.getElementById("grid");

    if (STATE.mode === "killer") {
      m.textContent = "KILLER";
      m.className = "mode killer";
      g.innerHTML = `
        ${tile(fd.killerHookLabel || "Hooks", STATE.killer.hooks, "killer")}
        ${tile(fd.killerSacLabel || "Sacs", STATE.killer.sac, "killer")}
        ${tile(fd.killer4kLabel || "4K", STATE.killer.k4k, "killer")}
        ${tile(fd.killerMoriLabel || "Moris", STATE.killer.mori, "killer")}
      `;
    } else {
      m.textContent = "SURVIVOR";
      m.className = "mode survivor";
      g.innerHTML = `
        ${tile(fd.survivorEscapesLabel || "Escapes", STATE.survivor.escapes, "survivor")}
        ${tile(fd.survivorDeathLabel || "Deaths", STATE.survivor.deaths, "survivor")}
        ${tile(fd.survivorMoriLabel || "Moris", STATE.survivor.mori, "survivor")}
        ${tile(fd.survivorHatchLabel || "Hatches", STATE.survivor.hatch, "survivor")}
      `;
    }
  }

  function tile(label, value, cls) {
    return `<div class="tile ${cls}"><div class="label">${label}</div><div class="value">${value}</div></div>`;
  }

  function command(fd, tags, text) {
    const perm = fd.whoCanUseChatCommands;
    const cd = fd.chatCommandCooldownSec;

    const cmds = {
      killer: fd.setKillerModeCommand,
      survivor: fd.setSurvivorModeCommand,
      resetAll: fd.resetAllCommand,
      khook: fd.killerHookCommand,
      ksac: fd.killerSacCommand,
      k4k: fd.killer4kCommand,
      kmori: fd.killerMoriCommand,
      sesc: fd.survivorEscapesCommand,
      sdeath: fd.survivorDeathCommand,
      smori: fd.survivorMoriCommand,
      shatch: fd.survivorHatchCommand,
      resetK: fd.resetKillerStatsCommand,
      resetS: fd.resetSurvivorStatsCommand
    };

    const match = Object.entries(cmds).find(([,v]) => text.startsWith(v));
    if (!match) return;
    if (!hasPermission(tags, perm)) return;
    if (!cooldown(match[1], cd)) return;

    switch (match[0]) {
      case "killer": STATE.mode="killer"; break;
      case "survivor": STATE.mode="survivor"; break;
      case "resetAll": STATE.killer={hooks:0,sac:0,k4k:0,mori:0}; STATE.survivor={escapes:0,deaths:0,mori:0,hatch:0}; break;
      case "khook": STATE.killer.hooks++; break;
      case "ksac": STATE.killer.sac++; break;
      case "k4k": STATE.killer.k4k++; break;
      case "kmori": STATE.killer.mori++; break;
      case "sesc": STATE.survivor.escapes++; break;
      case "sdeath": STATE.survivor.deaths++; break;
      case "smori": STATE.survivor.mori++; break;
      case "shatch": STATE.survivor.hatch++; break;
      case "resetK": STATE.killer={hooks:0,sac:0,k4k:0,mori:0}; break;
      case "resetS": STATE.survivor={escapes:0,deaths:0,mori:0,hatch:0}; break;
    }
  }

  function cooldown(cmd, sec) {
    if (!sec) return true;
    const until = STATE.cooldown.get(cmd) || 0;
    if (now() < until) return false;
    STATE.cooldown.set(cmd, now() + sec*1000);
    return true;
  }

  async function init(detail) {
    const fd = window.SE_BRIDGE.fieldData;
    neonStyle(fd.killerAccentColor, fd.survivorAccentColor, fd.backgroundColor);
    mount();
    paint(fd);

    const onEv = (e)=>{
      const d=e.detail;
      if (d.listener==="message") {
        const t=d.event.data.text.trim();
        command(fd,d.event.data.tags,t);
        paint(fd);
      }
    };

    window.addEventListener("onEventReceived", onEv);
  }

  window.DBD_REMOTE = { initWith:init };
})();
