/* =========================================================
   مملكة الزمكان - نظام الصوت العام
   موسيقى خلفية + مؤثرات أزرار + أصوات نجاح/خطأ/مطابقة
   يعمل بدون أي مكتبات خارجية.
========================================================= */
(() => {
  "use strict";

  const KEY = "kingdom_settings";
  let ctx = null;
  let master = null;
  let musicGain = null;
  let musicTimer = null;
  let musicStep = 0;
  let musicStarted = false;
  let lastUiSound = 0;

  const defaults = {
    soundEffects: true,
    backgroundMusic: true,
    volume: 75,
    language: "ar"
  };

  function settings() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "{}");
      return { ...defaults, ...s };
    } catch {
      return { ...defaults };
    }
  }

  function ensureContext() {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    if (!ctx) {
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = Math.max(0, Math.min(1, settings().volume / 100));
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function env(gainNode, peak, attack, release, duration) {
    const now = ctx.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);
  }

  function tone(freq, duration = 0.12, type = "sine", peak = 0.07, delay = 0) {
    if (!ensureContext()) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    env(g, peak, 0.015, 0.04, duration);
    osc.connect(g).connect(master);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.08);
  }

  function chord(notes, duration = 0.5, peak = 0.025) {
    notes.forEach((n, i) => tone(n, duration, "sine", peak, i * 0.015));
  }

  function effect(type) {
    const s = settings();
    if (!s.soundEffects) return;
    ensureContext();
    if (!ctx) return;

    switch (type) {
      case "click":
        tone(520, 0.06, "sine", 0.045);
        break;
      case "navigate":
        tone(440, 0.07, "triangle", 0.04);
        tone(660, 0.11, "triangle", 0.035, 0.045);
        break;
      case "select":
        tone(610, 0.07, "sine", 0.04);
        break;
      case "match":
        tone(520, 0.10, "triangle", 0.055);
        tone(690, 0.12, "triangle", 0.045, 0.07);
        break;
      case "correct":
        tone(660, 0.10, "triangle", 0.055);
        tone(880, 0.18, "triangle", 0.06, 0.08);
        break;
      case "wrong":
        tone(220, 0.18, "sawtooth", 0.045);
        tone(165, 0.22, "sawtooth", 0.035, 0.08);
        break;
      case "goalComplete":
        chord([523, 659, 784], 0.35, 0.025);
        break;
      case "booster":
        tone(700, 0.09, "triangle", 0.05);
        tone(980, 0.15, "triangle", 0.05, 0.07);
        tone(1220, 0.18, "sine", 0.035, 0.14);
        break;
      case "win":
        [523, 659, 784, 1047].forEach((n, i) => tone(n, 0.22, "triangle", 0.055, i * 0.10));
        break;
      case "lose":
        tone(330, 0.20, "sine", 0.045);
        tone(247, 0.28, "sine", 0.04, 0.13);
        break;
      case "shuffle":
        tone(300, 0.07, "sine", 0.035);
        tone(430, 0.07, "sine", 0.035, 0.06);
        tone(560, 0.10, "sine", 0.035, 0.12);
        break;
      case "open":
        tone(392, 0.10, "triangle", 0.04);
        tone(523, 0.14, "triangle", 0.045, 0.08);
        tone(784, 0.22, "triangle", 0.04, 0.16);
        break;
      default:
        tone(520, 0.07, "sine", 0.04);
    }
  }

  // Royal/Arabesque-style ambient loop made with Web Audio.
  const melody = [
    261.63, 329.63, 392.00, 329.63,
    293.66, 369.99, 440.00, 369.99,
    261.63, 329.63, 392.00, 493.88,
    293.66, 369.99, 440.00, 329.63
  ];
  const bass = [130.81, 146.83, 130.81, 110.00];

  function musicTick() {
    if (!musicStarted || !ctx) return;
    const s = settings();
    if (!s.backgroundMusic) return;

    const m = melody[musicStep % melody.length];
    const b = bass[Math.floor(musicStep / 4) % bass.length];

    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(m, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.018, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
    o.connect(g).connect(musicGain);
    o.start(now);
    o.stop(now + 0.55);

    if (musicStep % 4 === 0) {
      const ob = ctx.createOscillator();
      const gb = ctx.createGain();
      ob.type = "triangle";
      ob.frequency.setValueAtTime(b, now);
      gb.gain.setValueAtTime(0.0001, now);
      gb.gain.exponentialRampToValueAtTime(0.012, now + 0.05);
      gb.gain.exponentialRampToValueAtTime(0.0001, now + 1.7);
      ob.connect(gb).connect(musicGain);
      ob.start(now);
      ob.stop(now + 1.8);
    }
    musicStep++;
  }

  function startMusic() {
    const s = settings();
    if (!s.backgroundMusic || musicStarted) return;
    if (!ensureContext()) return;

    if (!musicGain) {
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.38;
      musicGain.connect(master);
    }
    musicStarted = true;
    musicTick();
    musicTimer = setInterval(musicTick, 500);
  }

  function stopMusic() {
    musicStarted = false;
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
    musicStep = 0;
  }

  function refresh() {
    const s = settings();
    if (master && ctx) master.gain.setTargetAtTime(Math.max(0, Math.min(1, s.volume / 100)), ctx.currentTime, 0.03);
    if (s.backgroundMusic) startMusic();
    else stopMusic();
  }

  function play(type = "click") {
    effect(type);
  }

  function unlock() {
    ensureContext();
    refresh();
  }

  // Browsers block autoplay until the player interacts once.
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });

  // Sound for UI controls that do not already have a game-specific sound.
  document.addEventListener("click", e => {
    const el = e.target.closest("button, a, input[type='checkbox'], input[type='range']");
    if (!el) return;
    if (el.closest(".gem,.answer-option,[data-silent-audio]")) return;
    if (el.id && /Booster$/i.test(el.id)) return;
    const now = Date.now();
    if (now - lastUiSound < 70) return;
    lastUiSound = now;
    const isNav = el.tagName === "A" || el.classList.contains("gold-btn") || el.classList.contains("nav-btn") || el.classList.contains("royal-level");
    play(isNav ? "navigate" : "click");
  }, true);

  window.KingdomAudio = { play, startMusic, stopMusic, refresh, unlock };

  // Try immediately; if the browser blocks it, the first user interaction starts it.
  window.addEventListener("load", () => {
    setTimeout(refresh, 80);
  });
})();
