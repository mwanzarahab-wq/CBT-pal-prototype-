/* ---------------------------------------------------------------------- */
/* Tokens & Content (unchanged copy/logic from the original)              */
/* ---------------------------------------------------------------------- */
const COLORS = {
  teal: "#12A594",
  tealDark: "#0B3D39",
  tealPastel: "#DFF4EF",
  coral: "#FDE6DE",
  coralText: "#C4553F",
  sand: "#FCEFD8",
  goldText: "#B8791A",
  cream: "#FAF8F4",
  ink: "#1C1B19",
  inkSoft: "#6B6560",
  line: "rgba(11,61,57,0.10)",
  danger: "#C4553F",
  dangerBg: "#FBEAE6",
};

const SYMPTOMS = [
  { id: "chest", label: "Chest tightness or pain" },
  { id: "heart", label: "Racing or pounding heart" },
  { id: "sleep", label: "Trouble falling or staying asleep" },
  { id: "worry", label: "Persistent worry that won't switch off" },
  { id: "focus", label: "Difficulty concentrating" },
  { id: "stomach", label: "Stomach problems or nausea" },
  { id: "fatigue", label: "Fatigue with no clear cause" },
  { id: "headache", label: "Headaches" },
  { id: "onedge", label: "Irritability or feeling on edge" },
  { id: "avoid", label: "Avoiding classes or social situations" },
];
const ROW_TINTS = [COLORS.coral, COLORS.sand, COLORS.tealPastel, "#EDE7F6", "#FCE4EC"];

const RESOURCES = [
  { name: "Lifeline Zambia", number: "933", detail: "Free, toll-free, 24/7. Counselling for adults on mental health, stress, and crisis support." },
  { name: "Childline Zambia", number: "116", detail: "Free, toll-free, 24/7. For callers under 18." },
  { name: "UNICEF Zambia Youth Mental Health", number: "+260 977 770 774", detail: "Monday-Friday, 9am-5pm. Mental health awareness and support for young people." },
];

const NAVIGATOR_SYSTEM_PROMPT = `You are "The Navigator" inside CBT Pal, a wellness app built for Zambian university students who suspect their physical symptoms might be anxiety.
Rules you must always follow:
- You are not a therapist, counsellor, or doctor. Never diagnose a condition. Never suggest medication, dosages, or supplements.
- Speak in plain, warm, everyday language a Zambian university student would use and understand. Avoid clinical jargon.
- Keep every reply short: 3 to 5 sentences, no bullet-point essays.
- Always close by pointing to one concrete next step: the in-app symptom check-in, UNZA Student Counselling Centre, or a helpline in the Support tab.
- Never run an open-ended therapy session or give a multi-step treatment plan. You listen, explain anxiety in plain terms when relevant, and point onward.
- If the student describes physical symptoms, you may gently note that anxiety often shows up in the body, without confirming any diagnosis.`;

const CRISIS_PATTERNS = [
  "suicide", "kill myself", "end my life", "ending my life", "want to die",
  "wish i was dead", "wish i were dead", "not want to be alive", "hurt myself",
  "hurting myself", "self harm", "self-harm", "no reason to live",
  "can't go on", "cant go on", "take my life", "better off dead",
];

function hasCrisisLanguage(text) {
  const t = text.toLowerCase();
  return CRISIS_PATTERNS.some((p) => t.includes(p));
}

/* ---------------------------------------------------------------------- */
/* Tiny DOM-builder helper (replaces React.createElement)                 */
/* ---------------------------------------------------------------------- */
function h(tag, props, ...children) {
  const el = document.createElement(tag);
  if (props) {
    Object.keys(props).forEach((key) => {
      const val = props[key];
      if (val === undefined || val === null || val === false) return;
      if (key === "style" && typeof val === "object") {
        Object.assign(el.style, val);
      } else if (key === "id") {
        el.id = val;
      } else if (key.indexOf("on") === 0 && typeof val === "function") {
        el.addEventListener(key.slice(2).toLowerCase(), val);
      } else {
        el.setAttribute(key, val);
      }
    });
  }
  const append = (child) => {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(append); return; }
    el.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  };
  children.forEach(append);
  return el;
}

/* ---------------------------------------------------------------------- */
/* Original line-art icons (no CDN required)                              */
/* ---------------------------------------------------------------------- */
const ICON_SVGS = {
  today: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"></rect><line x1="3" y1="10" x2="21" y2="10"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="16" y1="2" x2="16" y2="6"></line></svg>',
  checklist: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l2 2 4-4"></path><rect x="3" y="3" width="18" height="18" rx="4"></rect></svg>',
  compass: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polygon points="15.5 8.5 13.2 13.2 8.5 15.5 10.8 10.8 15.5 8.5"></polygon></svg>',
  phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
  send: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  sun: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"></circle><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"></path></svg>',
  chat: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
  heart: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path></svg>',
};
function Icon(name, size) {
  const wrap = document.createElement("div");
  wrap.innerHTML = ICON_SVGS[name] || "";
  wrap.style.display = "flex";
  wrap.style.lineHeight = "0";
  if (size) { wrap.style.width = size + "px"; wrap.style.height = size + "px"; }
  return wrap;
}

/* ---------------------------------------------------------------------- */
/* App state                                                              */
/* ---------------------------------------------------------------------- */
const state = {
  screen: "home",
  checkinSelected: [],
  checkinResult: false,
  messages: [
    { role: "assistant", text: "Hi, I'm the Navigator. I'm not a doctor or counsellor, but I'm here to listen and help you figure out a next step. What's been going on?" }
  ],
  input: "",
  loading: false,
  sample: null,
  samplePending: true,
};

function go(screen) {
  if (screen === "checkin") { state.checkinSelected = []; state.checkinResult = false; }
  state.screen = screen;
  render();
}

function initSample() {
  if (window.claude && window.claude.use) {
    let settled = false;
    window.claude.use("sample").then((s) => {
      if (settled) return;
      settled = true;
      state.sample = s;
      state.samplePending = false;
      render();
    }).catch(() => {
      if (settled) return;
      settled = true;
      state.samplePending = false;
      render();
    });
    setTimeout(() => {
      if (settled) return;
      settled = true;
      state.samplePending = false;
      render();
    }, 10000);
  } else {
    state.samplePending = false;
  }
}

/* ---------------------------------------------------------------------- */
/* Shared pieces                                                          */
/* ---------------------------------------------------------------------- */
const NAV_ITEMS = [
  { id: "home", label: "Today", icon: "today" },
  { id: "checkin", label: "Check-in", icon: "checklist" },
  { id: "navigator", label: "Navigator", icon: "compass" },
  { id: "support", label: "Support", icon: "phone" },
];

function BottomNav() {
  const bar = h("div", { style: {
    position: "fixed", left: "50%", bottom: "0", transform: "translateX(-50%)",
    width: "100%", maxWidth: "480px", background: "#fff", borderTop: "1px solid " + COLORS.line,
    display: "flex", padding: "8px 6px calc(8px + env(safe-area-inset-bottom))",
  }});
  NAV_ITEMS.forEach((item) => {
    const active = state.screen === item.id;
    const btn = h("button", { style: {
      flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
      background: "transparent", border: "none", cursor: "pointer", padding: "6px 2px",
      color: active ? COLORS.teal : "#A9A29A",
    }}, Icon(item.icon), h("span", { style: { fontSize: "11px", fontWeight: active ? "700" : "500", fontFamily: "'Plus Jakarta Sans', sans-serif" } }, item.label));
    btn.addEventListener("click", () => go(item.id));
    bar.appendChild(btn);
  });
  return bar;
}

function PrimaryButton({ onClick, disabled, style, text }) {
  const btn = h("button", {
    style: Object.assign({
      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%",
      padding: "15px 16px", borderRadius: "14px", border: "none",
      background: disabled ? "#CFE9E4" : COLORS.teal,
      color: disabled ? "#7FAFA6" : "#fff", fontWeight: "700", fontSize: "15px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      cursor: disabled ? "not-allowed" : "pointer",
    }, style || {}),
  });
  btn.disabled = !!disabled;
  btn.appendChild(document.createTextNode(text));
  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}

/* ---------------------------------------------------------------------- */
/* Home                                                                    */
/* ---------------------------------------------------------------------- */
function HomeScreen() {
  const wrap = h("div", { style: { padding: "20px 20px 0" } });

  wrap.appendChild(h("div", { style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", color: COLORS.inkSoft, marginBottom: "2px" } }, "CBT Pal"));
  wrap.appendChild(h("h1", { style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "800", fontSize: "26px", color: COLORS.ink, margin: "0 0 18px", lineHeight: "1.15" } }, "Take care of your mind today"));

  // Hero card
  const hero = h("div", { style: {
    borderRadius: "20px", padding: "20px", marginBottom: "18px",
    background: "linear-gradient(135deg," + COLORS.tealDark + "," + COLORS.teal + ")", color: "#fff",
    display: "flex", alignItems: "center", gap: "14px",
  }});
  hero.appendChild(Icon("sun", 30));
  const heroText = h("div", { style: { flex: "1" } },
    h("div", { style: { fontWeight: "700", fontSize: "16px", fontFamily: "'Plus Jakarta Sans', sans-serif" } }, "One check-in is enough for today"),
    h("div", { style: { fontSize: "12.5px", color: "rgba(255,255,255,0.85)", marginTop: "3px", lineHeight: "1.5" } }, "Anxiety often shows up in the body first. Two minutes to notice the pattern.")
  );
  hero.appendChild(heroText);
  wrap.appendChild(hero);
  const heroBtn = PrimaryButton({ onClick: () => go("checkin"), text: "Start check-in", style: { background: "#fff", color: COLORS.tealDark, marginBottom: "22px" } });
  wrap.appendChild(heroBtn);

  // Tile grid
  wrap.appendChild(h("div", { style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "700", fontSize: "15px", color: COLORS.ink, marginBottom: "10px" } }, "Explore"));
  const grid = h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" } });

  const tiles = [
    { id: "checkin", title: "Symptom check-in", sub: "Two minutes, no wrong answers", icon: "checklist", bg: COLORS.coral, fg: COLORS.coralText },
    { id: "navigator", title: "Talk to the Navigator", sub: "A private, listening chat", icon: "chat", bg: COLORS.tealPastel, fg: COLORS.tealDark },
  ];
  tiles.forEach((t) => {
    const tile = h("button", { style: {
      background: t.bg, border: "none", borderRadius: "18px", padding: "16px", textAlign: "left",
      cursor: "pointer", display: "flex", flexDirection: "column", gap: "26px", minHeight: "128px",
      color: t.fg,
    }});
    tile.appendChild(Icon(t.icon, 26));
    tile.appendChild(h("div", {},
      h("div", { style: { fontWeight: "700", fontSize: "13.5px", fontFamily: "'Plus Jakarta Sans', sans-serif", color: COLORS.ink } }, t.title),
      h("div", { style: { fontSize: "11.5px", color: COLORS.inkSoft, marginTop: "2px", lineHeight: "1.4" } }, t.sub)
    ));
    tile.addEventListener("click", () => go(t.id));
    grid.appendChild(tile);
  });
  wrap.appendChild(grid);

  const supportTile = h("button", { style: {
    width: "100%", background: COLORS.sand, border: "none", borderRadius: "18px", padding: "16px",
    display: "flex", alignItems: "center", gap: "14px", textAlign: "left", cursor: "pointer", marginBottom: "20px",
    color: COLORS.goldText,
  }});
  supportTile.appendChild(Icon("heart", 26));
  supportTile.appendChild(h("div", { style: { flex: "1" } },
    h("div", { style: { fontWeight: "700", fontSize: "13.5px", fontFamily: "'Plus Jakarta Sans', sans-serif", color: COLORS.ink } }, "Helplines & support"),
    h("div", { style: { fontSize: "11.5px", color: COLORS.inkSoft, marginTop: "2px" } }, "Free, confidential, reachable today")
  ));
  supportTile.addEventListener("click", () => go("support"));
  wrap.appendChild(supportTile);

  return wrap;
}

/* ---------------------------------------------------------------------- */
/* Check-in — full-bleed teal question style                              */
/* ---------------------------------------------------------------------- */
function CheckinScreen() {
  if (state.checkinResult) {
    const many = state.checkinSelected.length >= 3;
    return h("div", { style: { padding: "24px 20px 0" } },
      h("div", { style: { background: "#fff", border: "1px solid " + COLORS.line, borderRadius: "18px", padding: "18px", marginBottom: "16px" } },
        h("div", { style: { fontWeight: "800", marginBottom: "6px", color: COLORS.ink, fontSize: "16px", fontFamily: "'Plus Jakarta Sans', sans-serif" } }, "Check-in received"),
        h("p", { style: { fontSize: "14px", lineHeight: "1.6", color: COLORS.inkSoft, margin: "0" } },
          many
            ? "What you've described lines up closely with how anxiety often shows up physically. It's worth talking this through with the Navigator or a counsellor."
            : "Thanks for checking in. Even a few of these on their own are worth watching, especially if they stick around."
        )
      ),
      h("div", { style: { display: "flex", flexDirection: "column", gap: "10px" } },
        PrimaryButton({ onClick: () => go("navigator"), text: "Talk to the Navigator" }),
        PrimaryButton({ onClick: () => go("home"), text: "Back to Today", style: { background: "#fff", color: COLORS.ink, border: "1px solid " + COLORS.line } })
      )
    );
  }

  const wrap = h("div", { style: { padding: "24px 20px 0" } });
  wrap.appendChild(h("h2", { style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "800", fontSize: "21px", color: COLORS.ink, margin: "0 0 6px", lineHeight: "1.25" } }, "What have you noticed lately?"));
  wrap.appendChild(h("p", { style: { fontSize: "13px", color: COLORS.inkSoft, marginTop: "0", marginBottom: "16px", lineHeight: "1.5" } }, "Tap anything from the last two weeks."));

  const list = h("div", { style: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" } });
  SYMPTOMS.forEach((s, i) => {
    const selected = state.checkinSelected.indexOf(s.id) !== -1;
    const tint = ROW_TINTS[i % ROW_TINTS.length];
    const btn = h("button", { style: {
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px",
      padding: "15px 16px", borderRadius: "14px", border: "none", width: "100%", textAlign: "left", cursor: "pointer",
      background: selected ? COLORS.teal : tint,
      color: selected ? "#fff" : COLORS.ink,
    }},
      h("span", { style: { fontSize: "13.5px", fontWeight: "600" } }, s.label),
      h("span", { style: {
        width: "22px", height: "22px", borderRadius: "50%", flexShrink: "0",
        border: selected ? "none" : "1.5px solid rgba(28,27,25,0.25)",
        background: selected ? "rgba(255,255,255,0.25)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}, selected ? Icon("check") : null)
    );
    btn.addEventListener("click", () => {
      const idx = state.checkinSelected.indexOf(s.id);
      if (idx === -1) state.checkinSelected.push(s.id); else state.checkinSelected.splice(idx, 1);
      render();
    });
    list.appendChild(btn);
  });
  wrap.appendChild(list);
  wrap.appendChild(PrimaryButton({ onClick: () => { state.checkinResult = true; render(); }, text: "Submit check-in", disabled: state.checkinSelected.length === 0 }));
  return wrap;
}

/* ---------------------------------------------------------------------- */
/* Navigator                                                               */
/* ---------------------------------------------------------------------- */
function CrisisCard() {
  const wrap = h("div", { style: { background: COLORS.dangerBg, border: "1px solid " + COLORS.danger, borderRadius: "16px", padding: "14px", marginBottom: "4px" } });
  wrap.appendChild(h("div", { style: { fontWeight: "700", color: COLORS.danger, marginBottom: "6px", fontSize: "14px", fontFamily: "'Plus Jakarta Sans', sans-serif" } }, "That sounds like a lot to carry right now"));
  wrap.appendChild(h("p", { style: { fontSize: "13px", color: COLORS.ink, lineHeight: "1.5", margin: "0 0 10px" } }, "Please reach out to one of these right now. They're free, confidential, and someone can talk with you today. If you're in immediate danger, go to the nearest hospital or call emergency services."));
  const list = h("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } });
  RESOURCES.forEach((r) => {
    list.appendChild(h("div", { style: { background: "#fff", borderRadius: "12px", padding: "9px 11px" } },
      h("div", { style: { fontSize: "12.5px", fontWeight: "600", color: COLORS.ink } }, r.name),
      h("div", { style: { fontSize: "14px", fontWeight: "700", color: COLORS.danger } }, r.number)
    ));
  });
  wrap.appendChild(list);
  return wrap;
}

function focusInput() {
  const el = document.getElementById("nav-input");
  if (el) el.focus();
}

async function handleSend() {
  const inputEl = document.getElementById("nav-input");
  const text = (inputEl ? inputEl.value : state.input).trim();
  if (!text || state.loading) return;

  const priorMessages = state.messages.slice();
  state.messages.push({ role: "user", text });
  state.input = "";
  render();
  focusInput();

  if (hasCrisisLanguage(text)) {
    state.messages.push({ role: "crisis" });
    render();
    return;
  }

  if (!state.sample) {
    state.messages.push({ role: "assistant", text: "Live chat isn't connected in this build yet. The Support tab below has direct helpline numbers in the meantime." });
    render();
    return;
  }

  state.loading = true;
  render();
  try {
    const history = priorMessages.slice(-6).map((m) => (m.role === "user" ? "Student: " : "Navigator: ") + (m.text || "")).join("\n");
    const prompt = NAVIGATOR_SYSTEM_PROMPT + "\n\nConversation so far:\n" + history + "\nStudent: " + text + "\nNavigator:";
    const res = await state.sample(prompt, { modelTier: "default" });
    state.messages.push({ role: "assistant", text: (res.text || "").trim() });
  } catch (e) {
    state.messages.push({ role: "assistant", text: "I couldn't reach the Navigator just now. Please try again in a moment, or check the Support tab for direct helplines." });
  } finally {
    state.loading = false;
    render();
    focusInput();
  }
}

function NavigatorScreen() {
  const wrap = h("div", { style: { padding: "18px 20px 0", display: "flex", flexDirection: "column", height: "calc(100vh - 210px)" } });

  wrap.appendChild(h("h2", { style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "800", fontSize: "20px", color: COLORS.ink, margin: "0 0 12px" } }, "The Navigator"));

  if (!state.sample && !state.samplePending) {
    wrap.appendChild(h("div", { style: { fontSize: "12px", color: COLORS.inkSoft, background: COLORS.sand, borderRadius: "12px", padding: "9px 11px", marginBottom: "10px" } },
      "Live chat isn't connected in this build yet \u2014 wire up an AI backend to enable it."
    ));
  }

  const scrollBox = h("div", { id: "nav-scroll", style: { flex: "1", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "10px" } });
  state.messages.forEach((m) => {
    if (m.role === "crisis") { scrollBox.appendChild(CrisisCard()); return; }
    scrollBox.appendChild(h("div", {
      style: {
        alignSelf: m.role === "user" ? "flex-end" : "flex-start",
        maxWidth: "85%",
        background: m.role === "user" ? COLORS.teal : "#fff",
        color: m.role === "user" ? "#fff" : COLORS.ink,
        border: m.role === "user" ? "none" : "1px solid " + COLORS.line,
        borderRadius: "16px", padding: "10px 14px", fontSize: "13.5px", lineHeight: "1.5",
      }
    }, m.text));
  });
  if (state.loading) {
    scrollBox.appendChild(h("div", { style: { alignSelf: "flex-start", fontSize: "12.5px", color: COLORS.inkSoft, padding: "4px 4px" } }, "Navigator is typing\u2026"));
  }
  wrap.appendChild(scrollBox);

  const inputRow = h("div", { style: { display: "flex", gap: "8px", padding: "10px 0 18px", borderTop: "1px solid " + COLORS.line } });
  const inputEl = h("input", { id: "nav-input", placeholder: "Type how you're feeling\u2026", style: { flex: "1", border: "1px solid " + COLORS.line, borderRadius: "14px", padding: "12px 14px", fontSize: "13.5px", fontFamily: "inherit", outline: "none", background: COLORS.cream } });
  inputEl.value = state.input;

  const disabledNow = !state.input.trim() || state.loading;
  const sendBtn = h("button", { id: "nav-send", style: { width: "44px", height: "44px", borderRadius: "14px", border: "none", background: disabledNow ? "#CFE9E4" : COLORS.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: disabledNow ? "not-allowed" : "pointer", flexShrink: "0" } }, Icon("send"));
  sendBtn.disabled = disabledNow;

  inputEl.addEventListener("input", (e) => {
    state.input = e.target.value;
    const disabled = !state.input.trim() || state.loading;
    sendBtn.disabled = disabled;
    sendBtn.style.background = disabled ? "#CFE9E4" : COLORS.teal;
    sendBtn.style.cursor = disabled ? "not-allowed" : "pointer";
  });
  inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") handleSend(); });
  sendBtn.addEventListener("click", handleSend);

  inputRow.appendChild(inputEl);
  inputRow.appendChild(sendBtn);
  wrap.appendChild(inputRow);
  return wrap;
}

/* ---------------------------------------------------------------------- */
/* Support                                                                 */
/* ---------------------------------------------------------------------- */
function SupportScreen() {
  const wrap = h("div", { style: { padding: "24px 20px 0" } });
  wrap.appendChild(h("h2", { style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "800", fontSize: "21px", color: COLORS.ink, margin: "0 0 16px" } }, "Helplines & support"));
  const list = h("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } });
  RESOURCES.forEach((r, i) => {
    const tint = ROW_TINTS[i % ROW_TINTS.length];
    list.appendChild(h("div", { style: { background: tint, borderRadius: "18px", padding: "16px" } },
      h("div", { style: { fontWeight: "700", color: COLORS.ink, marginBottom: "2px", fontSize: "14px" } }, r.name),
      h("div", { style: { fontSize: "17px", fontWeight: "800", color: COLORS.tealDark, marginBottom: "4px", fontFamily: "'Plus Jakarta Sans', sans-serif" } }, r.number),
      h("div", { style: { fontSize: "12.5px", color: COLORS.inkSoft, lineHeight: "1.5" } }, r.detail)
    ));
  });
  list.appendChild(h("div", { style: { fontSize: "11.5px", color: COLORS.inkSoft, lineHeight: "1.5", padding: "6px 2px 0" } },
    "CBT Pal is a wellness navigation tool, not a medical device. It does not diagnose, prescribe, or provide clinical treatment."
  ));
  wrap.appendChild(list);
  return wrap;
}

/* ---------------------------------------------------------------------- */
/* Root render                                                            */
/* ---------------------------------------------------------------------- */
function render() {
  const root = document.getElementById("root");
  root.innerHTML = "";

  const container = h("div", { style: { maxWidth: "480px", margin: "0 auto", background: COLORS.cream, minHeight: "100vh", paddingBottom: "96px" } });

  if (state.screen === "home") container.appendChild(HomeScreen());
  if (state.screen === "checkin") container.appendChild(CheckinScreen());
  if (state.screen === "navigator") container.appendChild(NavigatorScreen());
  if (state.screen === "support") container.appendChild(SupportScreen());

  container.appendChild(BottomNav());

  root.appendChild(container);

  if (state.screen === "navigator") {
    const scrollEl = document.getElementById("nav-scroll");
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
  }
}

render();
initSample();
