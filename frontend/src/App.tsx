import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";

type HealthState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

type ModeCounts = {
  longingCount: number;
  zenHits: number;
};

type RequestState = "idle" | "loading" | "success" | "error";
type ModeName = "longing" | "zen";

type Burst = {
  id: number;
  label: string;
  x: string;
  y: string;
};

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [health, setHealth] = useState<HealthState>({ status: "loading", message: "Connecting..." });
  const [counts, setCounts] = useState<ModeCounts>({ longingCount: 0, zenHits: 0 });
  const [longingState, setLongingState] = useState<RequestState>("loading");
  const [zenState, setZenState] = useState<RequestState>("loading");
  const [bursts, setBursts] = useState<Burst[]>([]);

  const activeMode = useMemo<ModeName | null>(() => {
    if (location.pathname.includes("/ritual/zen")) return "zen";
    if (location.pathname.includes("/ritual/longing")) return "longing";
    return null;
  }, [location.pathname]);

  useEffect(() => {
    let active = true;

    const loadHealth = async () => {
      try {
        const response = await fetch("/api/health");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: { status?: string } = await response.json();
        if (!active) return;
        setHealth({ status: "success", message: `API ${data.status ?? "unknown"}` });
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unknown error";
        setHealth({ status: "error", message: `API ${message}` });
      }
    };

    const loadCounts = async () => {
      try {
        const response = await fetch("/api/modes/state");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: Partial<ModeCounts> = await response.json();
        if (!active) return;
        setCounts({ longingCount: data.longingCount ?? 0, zenHits: data.zenHits ?? 0 });
        setLongingState("success");
        setZenState("success");
      } catch {
        if (!active) return;
        setLongingState("error");
        setZenState("error");
      }
    };

    void loadHealth();
    void loadCounts();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const addBurst = (label: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const x = `${36 + Math.random() * 28}%`;
    const y = `${28 + Math.random() * 22}%`;
    setBursts((current) => [...current, { id, label, x, y }]);
    window.setTimeout(() => {
      setBursts((current) => current.filter((item) => item.id !== id));
    }, 1000);
  };

  const handleLongingTap = async () => {
    setLongingState("loading");
    try {
      const response = await fetch("/api/modes/longing", { method: "POST" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: { longingCount?: number } = await response.json();
      setCounts((current) => ({ ...current, longingCount: data.longingCount ?? current.longingCount }));
      setLongingState("success");
      addBurst("+1");
    } catch {
      setLongingState("error");
    }
  };

  const handleZenTap = async () => {
    setZenState("loading");
    try {
      const response = await fetch("/api/modes/zen", { method: "POST" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: { zenHits?: number } = await response.json();
      setCounts((current) => ({ ...current, zenHits: data.zenHits ?? current.zenHits }));
      setZenState("success");
      addBurst("Pain -1");
    } catch {
      setZenState("error");
    }
  };

  return (
    <main className="app-shell">
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />
      <div className="ambient ambient--three" aria-hidden="true" />

      <header className="top-nav">
        <Link className="brand" to="/">
          Curator
        </Link>
        <nav className="top-links">
          <NavLink className={({ isActive }) => `top-link ${isActive ? "is-active" : ""}`} to="/">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => `top-link ${isActive ? "is-active" : ""}`} to="/ritual/longing">
            Ritual
          </NavLink>
        </nav>
        <div className="api-chip" data-state={health.status}>
          <span className="api-chip__dot" />
          <span>{health.message}</span>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage counts={counts} onOpenMode={(mode) => navigate(`/ritual/${mode}`)} />} />
        <Route
          path="/ritual/longing"
          element={
            <RitualPage
              mode="longing"
              count={counts.longingCount}
              state={longingState}
              bursts={bursts}
              onTap={handleLongingTap}
              onSwitch={(mode) => navigate(`/ritual/${mode}`)}
            />
          }
        />
        <Route
          path="/ritual/zen"
          element={
            <RitualPage
              mode="zen"
              count={counts.zenHits}
              state={zenState}
              bursts={bursts}
              onTap={handleZenTap}
              onSwitch={(mode) => navigate(`/ritual/${mode}`)}
            />
          }
        />
      </Routes>

      <div className={`floating-menu ${menuOpen ? "is-open" : ""}`}>
        <button className="floating-menu__trigger" type="button" onClick={() => setMenuOpen((current) => !current)}>
          <span>{menuOpen ? "Close" : "Rituals"}</span>
        </button>
        <div className="floating-menu__panel">
          <button className="floating-menu__item" type="button" onClick={() => navigate("/ritual/longing")}>
            <strong>Longing</strong>
            <span>{counts.longingCount}</span>
          </button>
          <button className="floating-menu__item" type="button" onClick={() => navigate("/ritual/zen")}>
            <strong>Zen</strong>
            <span>{counts.zenHits}</span>
          </button>
        </div>
      </div>

      {activeMode ? (
        <div className="bottom-switch" role="tablist" aria-label="Mode switch">
          <button
            type="button"
            className={`bottom-switch__item ${activeMode === "longing" ? "is-active" : ""}`}
            onClick={() => navigate("/ritual/longing")}
          >
            Longing
          </button>
          <button
            type="button"
            className={`bottom-switch__item ${activeMode === "zen" ? "is-active" : ""}`}
            onClick={() => navigate("/ritual/zen")}
          >
            Zen
          </button>
        </div>
      ) : null}
    </main>
  );
}

type HomePageProps = {
  counts: ModeCounts;
  onOpenMode: (mode: ModeName) => void;
};

function HomePage({ counts, onOpenMode }: HomePageProps) {
  return (
    <section className="home-page">
      <div className="hero-block">
        <p className="eyebrow">Digital Ritual Archive</p>
        <h1>Quiet rituals in a curated shell.</h1>
        <p className="lede">
          A premium dark interface for small private actions. Choose a ritual from the floating bubble and open it on its own page.
        </p>
        <div className="hero-actions">
          <button className="hero-button hero-button--primary" type="button" onClick={() => onOpenMode("longing")}>Open Longing</button>
          <button className="hero-button hero-button--ghost" type="button" onClick={() => onOpenMode("zen")}>Open Zen</button>
        </div>
      </div>

      <div className="showcase-grid">
        <article className="showcase-card showcase-card--feature">
          <span className="showcase-card__tag">Longing</span>
          <strong>{counts.longingCount}</strong>
          <p>Thoughts recorded</p>
        </article>
        <article className="showcase-card">
          <span className="showcase-card__tag">Zen</span>
          <strong>{counts.zenHits}</strong>
          <p>Pain softened</p>
        </article>
        <article className="showcase-card showcase-card--copy">
          <span className="showcase-card__tag">Flow</span>
          <p>Use the bubble to pick a ritual, then continue in a focused page.</p>
        </article>
      </div>
    </section>
  );
}

type RitualPageProps = {
  mode: ModeName;
  count: number;
  state: RequestState;
  bursts: Burst[];
  onTap: () => void;
  onSwitch: (mode: ModeName) => void;
};

function RitualPage({ mode, count, state, bursts, onTap, onSwitch }: RitualPageProps) {
  const isLonging = mode === "longing";

  return (
    <section className={`ritual-page ritual-page--${mode}`}>
      <div className="ritual-copy">
        <p className="eyebrow">{isLonging ? "Longing Mode" : "Zen Mode"}</p>
        <h2>{isLonging ? "Count the feeling." : "Strike the mokugyo."}</h2>
      </div>

      <div className="ritual-surface">
        <span className="ritual-surface__label">{isLonging ? "Longing Count" : "Pain Reduced"}</span>
        <strong className="ritual-surface__value">{count}</strong>

        {isLonging ? (
          <button className="ritual-action ritual-action--longing" type="button" onClick={onTap}>
            Count
          </button>
        ) : (
          <button className="mokugyo" type="button" onClick={onTap} aria-label="Strike mokugyo">
            <span className="mokugyo__ring" aria-hidden="true" />
            <span className="mokugyo__drum" aria-hidden="true" />
            <span className="mokugyo__mallet" aria-hidden="true" />
          </button>
        )}

        <small className="ritual-surface__hint" data-state={state}>
          {state === "error" ? "Try again" : "Saved"}
        </small>

        <div className="burst-layer" aria-hidden="true">
          {bursts.map((item) => (
            <span className="burst" key={item.id} style={{ left: item.x, top: item.y }}>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="ritual-links">
        <button className={`ritual-links__item ${isLonging ? "is-active" : ""}`} type="button" onClick={() => onSwitch("longing")}>Longing</button>
        <button className={`ritual-links__item ${!isLonging ? "is-active" : ""}`} type="button" onClick={() => onSwitch("zen")}>Zen</button>
      </div>
    </section>
  );
}

export default function App() {
  return <AppShell />;
}