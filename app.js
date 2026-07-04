const { useState, useEffect, useRef, useCallback, useMemo } = React;

/* ---------------------------------------------------------------------- */
/* Tokens & Styles                                                       */
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

const RESOURCES = [
  { name: "Lifeline Zambia", number: "933", detail: "Free, toll-free, 24/7. Counselling for adults on mental health, stress, and crisis support." },
  { name: "Childline Zambia", number: "116", detail: "Free, toll-free, 24/7. For callers under 18." },
  { name: "UNICEF Zambia Youth Mental Health", number: "+260 977 770 774", detail: "Monday–Friday, 9am–5pm. Mental health awareness and support for young people." },
];

/* ---------------------------------------------------------------------- */
/* Inline SVG Components (No CDNs Required)                              */
/* ---------------------------------------------------------------------- */
function IconHome() {
  return React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
    React.createElement("polyline", { points: "9 22 9 12 15 12 15 22" })
  );
}

function IconChevronRight() {
  return React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("polyline", { points: "9 18 15 12 9 6" })
  );
}

function IconSunrise() {
  return React.createElement("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M18 22H6" }),
    React.createElement("path", { d: "m22 18-3.42-3.42" }),
    React.createElement("path", { d: "M12 18V2" }),
    React.createElement("path", { d: "M2 18h3.42" }),
    React.createElement("path", { d: "M12 10a4 4 0 0 1 4 4v4H8v-4a4 4 0 0 1 4-4z" })
  );
}

/* ---------------------------------------------------------------------- */
/* Layout Parts                                                           */
/* ---------------------------------------------------------------------- */
function DawnBar() {
  return React.createElement("div", {
    style: {
      height: 5, width: "100%",
      background: "linear-gradient(90deg,#161E33,#232F4B 25%,#6B5A8E 50%,#E98C73 78%,#F0B860 100%)",
    }
  });
}

function ScreenHeader({ title, sub }) {
  return React.createElement("div", { style: { padding: "22px 20px 16px" } },
    React.createElement("div", { style: { fontFamily: "monospace", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.dawn, fontWeight: 500 } }, "✦ Navigator App"),
    React.createElement("h1", { style: { fontWeight: 700, fontSize: 26, margin: "4px 0 2px", color: COLORS.night } }, title),
    sub && React.createElement("p", { style: { margin: 0, color: COLORS.inkSoft, fontSize: 13.5, lineHeight: 1.5 } }, sub)
  );
}

function Card({ children, style }) {
  return React.createElement("div", {
    style: Object.assign({ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: 16, boxShadow: "0 1px 2px rgba(35,47,75,0.04)" }, style)
  }, children);
}

function PrimaryButton({ children, onClick, disabled, style, showHomeIcon }) {
  return React.createElement("button", {
    onClick: onClick, disabled: disabled,
    style: Object.assign({ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "13px 16px", borderRadius: 12, border: "none", background: disabled ? "#D8CFC2" : "linear-gradient(120deg,#E98C73,#F0B860)", color: disabled ? "#A39C8E" : COLORS.nightDeep, fontWeight: 700, fontSize: 14.5, cursor: disabled ? "not-allowed" : "pointer" }, style)
  }, 
    showHomeIcon && React.createElement(IconHome, null),
    children
  );
}

/* ---------------------------------------------------------------------- */
/* Main UI Screens                                                        */
/* ---------------------------------------------------------------------- */
function HomeScreen({ go, stats }) {
  return React.createElement("div", null,
    React.createElement("div", { style: { margin: "0 20px 18px", borderRadius: 18, padding: "20px 18px", background: "linear-gradient(135deg,#232F4B,#4A4173 55%,#E98C73)", color: "#fff" } },
      React.createElement(IconSunrise, null),
      React.createElement("div", { style: { fontWeight: 700, fontSize: 20, marginTop: 6 } }, "Welcome to CBT Pal"),
      React.createElement("div", { style: { fontSize: 13, color: "#E7E2D8", marginTop: 4, lineHeight: 1.5 } }, "One small check-in today is enough. Take things one step at a time.")
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
        { id: "checkin", title: "Symptom check-in", sub: "See if what you're feeling lines up with anxiety" },
        { id: "support", title: "Helplines & Support", sub: "Find direct crisis numbers and support options" },
      ].map((item) => React.createElement("button", {
        key: item.id, onClick: () => go(item.id),
        style: { display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: "13px 14px", cursor: "pointer", width: "100%" }
      },
        React.createElement("div", { style: { flex: 1 } },
          React.createElement("div", { style: { fontWeight: 600, fontSize: 14, color: COLORS.ink } }, item.title),
          React.createElement("div", { style: { fontSize: 12, color: COLORS.inkSoft } }, item.sub)
        ),
        React.createElement(IconChevronRight, null)
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
        React.createElement("div", { style: { fontWeight: 'bold', marginBottom: 6, color: COLORS.night } }, "✦ Check-in Received"),
        React.createElement("p", { style: { fontSize: 14, lineHeight: 1.6, color: COLORS.ink, margin: 0 } },
          "Your selections have been logged. Tracking symptoms over time helps build mental health awareness."
        )
      ),
      React.createElement(PrimaryButton, { onClick: () => go("home"), showHomeIcon: true }, "Back to Dashboard")
    );
  }

  return React.createElement("div", { style: { padding: "0 20px" } },
    React.createElement("p", { style: { fontSize: 13, color: COLORS.inkSoft, marginTop: 0, marginBottom: 12, lineHeight: 1.5 } },
      "Tap anything you've noticed over the last two weeks:"
    ),
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 } },
      SYMPTOMS.map((s) => React.createElement("button", {
        key: s.id, onClick: () => toggle(s.id),
        style: { display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 10, border: `1px solid ${selected.includes(s.id) ? COLORS.dawn : COLORS.line}`, background: selected.includes(s.id) ? COLORS.sageLight : "#fff", textAlign: "left", cursor: "pointer", width: "100%" }
      },
        React.createElement("span", { style: { fontSize: 13.5, color: COLORS.ink, fontWeight: selected.includes(s.id) ? "600" : "400" } }, 
          selected.includes(s.id) ? "✓  " : "○  ", s.label
        )
      ))
    ),
    React.createElement(PrimaryButton, { onClick: () => setResult(true), disabled: selected.length === 0 }, "Submit Check-in")
  );
}

function SupportScreen() {
  return React.createElement("div", { style: { padding: "0 20px" } },
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
      RESOURCES.map((r) => React.createElement(Card, { key: r.name },
        React.createElement("div", { style: { fontWeight: 700, color: COLORS.night, marginBottom: 2 } }, r.name),
        React.createElement("div", { style: { fontSize: 15, fontWeight: "bold", color: COLORS.dawn, marginBottom: 4 } }, r.number),
        React.createElement("div", { style: { fontSize: 12.5, color: COLORS.inkSoft, lineHeight: 1.4 } }, r.detail)
      ))
    )
  );
}

/* ---------------------------------------------------------------------- */
/* Master Container                                                       */
/* ---------------------------------------------------------------------- */
function CBTPal() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const stats = { journalCount: 3, plannerStreak: 5, checkinCount: 12 };

  return React.createElement("div", { style: { background: COLORS.cream, minHeight: "100vh", color: COLORS.ink } },
    React.createElement("div", { style: { maxWidth: 480, margin: "0 auto", background: "#FAF8F5", minHeight: "100vh", paddingBottom: 80, borderLeft: `1px solid ${COLORS.line}`, borderRight: `1px solid ${COLORS.line}` } },
      React.createElement(DawnBar, null),
      React.createElement(ScreenHeader, {
        title: "CBT Pal",
        sub: currentScreen === "home" ? "Your mental health navigation companion." : "Supporting your mental wellness journey."
      }),
      currentScreen === "home" && React.createElement(HomeScreen, { go: setCurrentScreen, stats: stats }),
      currentScreen === "checkin" && React.createElement(CheckinScreen, { go: setCurrentScreen }),
      currentScreen === "support" && React.createElement(SupportScreen, null),
      
      currentScreen !== "home" && React.createElement("div", { style: { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 440, padding: "0 20px" } },
        React.createElement(PrimaryButton, { onClick: () => setCurrentScreen("home"), showHomeIcon: true, style: { background: COLORS.night, color: "#fff" } }, "Return Home")
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(CBTPal));
