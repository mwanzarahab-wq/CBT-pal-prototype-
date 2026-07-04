// Global extraction since we are loading via CDN scripts
const { useState, useEffect, useRef, useCallback, useMemo } = React;
// Icon extraction from the globally loaded lucide script
const { 
  Home, ListChecks, MessageCircle, NotebookPen, CalendarCheck2, BookOpenText,
  LifeBuoy, Send, Loader2, AlertTriangle, ChevronDown, ChevronRight, Plus, X,
  Sunrise, Phone, Clock, CheckCircle2, Circle, Sparkles, MapPin 
} = LucideReact;

/* ---------------------------------------------------------------------- */
/* Tokens                                                                 */
/* ---------------------------------------------------------------------- */

const COLORS = {
  night: "#232F4B",
  nightDeep: "#161E33",
  dawn: "#E98C73",
  dawnLight: "#F2A98F",
  gold: "#F0B860",
  sage: "#7FA08C",
  sageLight: "#E4ECE6",
  cream: "#F7F3EC",
  ink: "#2A2622",
  inkSoft: "#6B6356",
  line: "rgba(35,47,75,0.10)",
};

/* ---------------------------------------------------------------------- */
/* Storage helpers                                                        */
/* ---------------------------------------------------------------------- */

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

/* ---------------------------------------------------------------------- */
/* Crisis detection                                                       */
/* ---------------------------------------------------------------------- */

const CRISIS_PATTERNS = [
  /kill myself/i, /suicid/i, /end my life/i, /ending it all/i,
  /want to die/i, /don'?t want to (be alive|live)/i, /hurt myself/i,
  /self[\s-]?harm/i, /no reason to live/i, /better off dead/i,
  /can'?t go on/i, /can'?t take (this|it) anymore/i,
];

function isCrisisText(text) {
  return CRISIS_PATTERNS.some((p) => p.test(text));
}

/* ---------------------------------------------------------------------- */
/* Shared content                                                         */
/* ---------------------------------------------------------------------- */

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

const LIBRARY_ARTICLES = [
  {
    title: "Why anxiety can feel physical",
    body: "Anxiety isn't only a feeling in your head — it's a whole-body response. When your nervous system reads a threat, real or not, it floods your body with stress hormones that speed up your heart, tighten your chest, and unsettle your stomach. That's why so many students end up at a clinic for chest pain or headaches with no physical cause: the body is reporting something real, even when the trigger is stress rather than illness. Recognising this link is often the first step toward getting the right kind of help.",
  },
  {
    title: "Anxiety isn't weakness",
    body: "It's common to read anxiety as personal failure — falling behind, snapping at friends, dreading class. None of that is a character flaw. Anxiety is a treatable medical condition with a clinical name and evidence-based care, not a measure of how strong or capable you are. Naming it accurately is what makes it possible to act on it instead of carrying it alone.",
  },
  {
    title: "What actually happens at a counselling appointment",
    body: "Most campus counselling centres start the same way: a conversation. A counsellor asks what's been going on, listens without judgement, and helps you make sense of it — there's no test you can fail and nothing is decided in one visit. Sessions are typically confidential. If you've never been, expect it to feel more like a structured conversation than a medical exam.",
  },
  {
    title: "Simple things that help day to day",
    body: "Small, repeatable habits make a real difference alongside professional support: a consistent sleep and wake time, short breaks between study blocks, eating at regular intervals, and a few minutes of slow breathing or a short walk when things feel like too much. The 5-4-3-2-1 grounding technique — naming 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste — can help bring a racing mind back to the present moment.",
  },
];

const RESOURCES = [
  {
    name: "Lifeline Zambia",
    number: "933",
    detail: "Free, toll-free, 24/7. Counselling for adults on mental health, stress, and crisis support.",
  },
  {
    name: "Childline Zambia",
    number: "116",
    detail: "Free, toll-free, 24/7. For callers under 18.",
  },
  {
    name: "UNICEF Zambia Youth Mental Health & Helpline",
    number: "+260 977 770 774",
    detail: "Monday–Friday, 9am–5pm. Mental health awareness and support for young people.",
  },
];

/* ---------------------------------------------------------------------- */
/* Small UI atoms                                                         */
/* ---------------------------------------------------------------------- */

function DawnBar() {
  return React.createElement("div", {
    style: {
      height: 5,
      width: "100%",
      background: "linear-gradient(90deg,#161E33,#232F4B 25%,#6B5A8E 50%,#E98C73 78%,#F0B860 100%)",
      backgroundSize: "200% 100%",
    }
  });
}

function ScreenHeader({ icon: IconComponent, eyebrow, title, sub }) {
  return React.createElement("div", { style: { padding: "22px 20px 16px" } },
    React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "monospace",
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: COLORS.dawn,
        fontWeight: 500,
      }
    },
      IconComponent && React.createElement(IconComponent, { size: 13 }),
      eyebrow
    ),
    React.createElement("h1", {
      style: {
        fontWeight: 700,
        fontSize: 26,
        margin: "4px 0 2px",
        color: COLORS.night,
        letterSpacing: "-0.01em",
      }
    }, title),
    sub && React.createElement("p", { style: { margin: 0, color: COLORS.inkSoft, fontSize: 13.5, lineHeight: 1.5 } }, sub)
  );
}

function Card({ children, style }) {
  return React.createElement("div", {
    style: Object.assign({
      background: "#fff",
      border: `1px solid ${COLORS.line}`,
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 1px 2px rgba(35,47,75,0.04)",
    }, style)
  }, children);
}

function PrimaryButton({ children, onClick, disabled, style, icon: IconComponent }) {
  return React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    style: Object.assign({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      width: "100%",
      padding: "13px 16px",
      borderRadius: 12,
      border: "none",
      background: disabled ? "#D8CFC2" : "linear-gradient(120deg,#E98C73,#F0B860)",
      color: disabled ? "#A39C8E" : COLORS.nightDeep,
      fontWeight: 700,
      fontSize: 14.5,
      cursor: disabled ? "not-allowed" : "pointer",
    }, style)
  }, 
    IconComponent && React.createElement(IconComponent, { size: 16 }),
    children
  );
}

/* ---------------------------------------------------------------------- */
/* Screens                                                                */
/* ---------------------------------------------------------------------- */

function HomeScreen({ go, stats }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return React.createElement("div", null,
    React.createElement("div", {
      style: {
        margin: "0 20px 18px",
        borderRadius: 18,
        padding: "20px 18px",
        background: "linear-gradient(135deg,#232F4B,#4A4173 55%,#E98C73)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }
    },
      React.createElement(Sunrise, { size: 16, color: COLORS.gold, style: { marginBottom: 8 } }),
      React.createElement("div", { style: { fontWeight: 700, fontSize: 20 } }, greeting + "."),
      React.createElement("div", { style: { fontSize: 13, color: "#E7E2D8", marginTop: 4, lineHeight: 1.5, maxWidth: 240 } },
        "One small check-in today is enough. You don't have to have it figured out."
      )
    ),

    React.createElement("div", { style: { display: "flex", gap: 10, padding: "0 20px 18px" } },
      React.createElement(Card, { style: { flex: 1, textAlign: "center" } },
        React.createElement("div", { style: { fontSize: 22, fontWeight: 600, color: COLORS.night } }, stats.journalCount),
        React.createElement("div", { style: { fontSize: 11, color: COLORS.inkSoft } }, "journal entries")
      ),
      React.createElement(Card, { style: { flex: 1, textAlign: "center" } },
        React.createElement("div", { style: { fontSize: 22, fontWeight: 600, color: COLORS.night } }, stats.plannerStreak),
        React.createElement("div", { style: { fontSize: 11, color: COLORS.inkSoft } }, "day streak")
      ),
      React.createElement(Card, { style: { flex: 1, textAlign: "center" } },
        React.createElement("div", { style: { fontSize: 22, fontWeight: 600, color: COLORS.night } }, stats.checkinCount),
        React.createElement("div", { style: { fontSize: 11, color: COLORS.inkSoft } }, "check-ins")
      )
    ),

    React.createElement("div", { style: { padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 } },
      [
        { id: "checkin", icon: ListChecks, title: "Symptom check-in", sub: "See if what you're feeling lines up with anxiety" },
        { id: "navigator", icon: MessageCircle, title: "Talk to the Navigator", sub: "Describe how you're feeling, in your own words" },
        { id: "support", icon: LifeBuoy, title: "Helplines & Support", sub: "Find direct crisis numbers and support options" },
      ].map((item) => React.createElement("button", {
        key: item.id,
        onClick: () => go(item.id),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          textAlign: "left",
          background: "#fff",
          border: `1px solid ${COLORS.line}`,
          borderRadius: 14,
          padding: "13px 14px",
          cursor: "pointer",
          width: "100%"
        }
      },
        React.createElement("div", {
          style: {
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: COLORS.sageLight, display: "flex", alignItems: "center", justifyContent: "center",
          }
        }, React.createElement(item.icon, { size: 18, color: COLORS.night })),
        React.createElement("div", { style: { flex: 1 } },
          React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: COLORS.ink } }, item.title),
          React.createElement("div", { style: { fontSize: 12, color: COLORS.inkSoft } }, item.sub)
        ),
        React.createElement(ChevronRight, { size: 16, color: COLORS.inkSoft })
      ))
    )
  );
}

function CheckinScreen({ go }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);

  const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  if (result) {
    return React.createElement("div", { style: { padding: "0 20px" } },
      React.createElement(Card, { style: { marginBottom: 14 } },
        React.createElement(Sparkles, { size: 18, color: COLORS.dawn, style: { marginBottom: 8 } }),
        React.createElement("p", { style: { fontSize: 14, lineHeight: 1.6, color: COLORS.ink, margin: 0 } },
          "Your selections have been flagged. Looking at symptoms together can help you map patterns over time."
        )
      ),
      React.createElement(PrimaryButton, { onClick: () => go("home"), icon: Home }, "Back to Dashboard")
    );
  }

  return React.createElement("div", { style: { padding: "0 20px" } },
    React.createElement("p", { style: { fontSize: 13, color: COLORS.inkSoft, marginTop: 0, lineHeight: 1.5 } },
      "Tap anything you've noticed over the last two weeks. There's no wrong answer."
    ),
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 } },
      SYMPTOMS.map((s) => React.createElement("button", {
        key: s.id,
        onClick: () => toggle(s.id),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: 12,
          borderRadius: 10,
          border: `1px solid ${selected.includes(s.id) ? COLORS.dawn : COLORS.line}`,
          background: selected.includes(s.id) ? COLORS.sageLight : "#fff",
          textAlign: "left",
          cursor: "pointer"
        }
      },
        React.createElement(selected.includes(s.id) ? CheckCircle2 : Circle, { size: 16, color: selected.includes(s.id) ? COLORS.dawn : COLORS.inkSoft }),
        React.createElement("span", { style: { fontSize: 13.5, color: COLORS.ink } }, s.label)
      ))
    ),
    React.createElement(PrimaryButton, { onClick: () => setResult(true), disabled: selected.length === 0 }, "Submit Check-in")
  );
}

function SupportScreen() {
  return React.createElement("div", { style: { padding: "0 20px" } },
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
      RESOURCES.map((r) => React.createElement(Card, { key: r.name },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } },
          React.createElement(Phone, { size: 16, color: COLORS.dawn }),
          React.createElement("span", { style: { fontWeight: 700, color: COLORS.night } }, r.name)
        ),
        React.createElement("div", { style: { fontSize: 15, fontWeight: "bold", color: COLORS.dawn, marginBottom: 4 } }, r.number),
        React.createElement("div", { style: { fontSize: 12.5, color: COLORS.inkSoft, lineHeight: 1.4 } }, r.detail)
      ))
    )
  );
}

/* ---------------------------------------------------------------------- */
/* Core App Component                                                     */
/* ---------------------------------------------------------------------- */

function CBTPal() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const stats = { journalCount: 3, plannerStreak: 5, checkinCount: 12 };

  return React.createElement("div", { style: { background: COLORS.cream, minHeight: "100vh", color: COLORS.ink, fontFamily: "sans-serif" } },
    React.createElement("div", { style: { maxWidth: 480, margin: "0 auto", background: "#FAF8F5", minHeight: "100vh", paddingBottom: 80, borderLeft: `1px solid ${COLORS.line}`, borderRight: `1px solid ${COLORS.line}` } },
      React.createElement(DawnBar, null),
      React.createElement(ScreenHeader, {
        eyebrow: currentScreen === "home" ? "Dashboard" : currentScreen,
        title: "CBT Pal",
        sub: currentScreen === "home" ? "Your clinical mental health navigation companion." : "Supporting your mental wellness journey."
      }),
      currentScreen === "home" && React.createElement(HomeScreen, { go: setCurrentScreen, stats: stats }),
      currentScreen === "checkin" && React.createElement(CheckinScreen, { go: setCurrentScreen }),
      currentScreen === "support" && React.createElement(SupportScreen, null),
      
      // Dynamic navigation footer
      currentScreen !== "home" && React.createElement("div", { style: { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 440, padding: "0 20px" } },
        React.createElement(PrimaryButton, { onClick: () => setCurrentScreen("home"), icon: Home, style: { background: COLORS.night, color: "#fff" } }, "Return Home")
      )
    )
  );
}

// ---------- DOM Render Hook ----------
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(CBTPal));
