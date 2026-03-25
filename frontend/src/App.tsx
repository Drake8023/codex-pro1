import { useEffect, useState } from "react";

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

const modeCards = [
  {
    mode: "longing" as const,
    name: "Longing Mode",
    description: "Track how many times the feeling comes back.",
  },
  {
    mode: "zen" as const,
    name: "Zen Mode",
    description: "Tap the mokugyo and let the pain slip away.",
  },
];

export default function App() {
  const [currentMode, setCurrentMode] = useState<ModeName>("longing");
  const [health, setHealth] = useState<HealthState>({
    status: "loading",
    message: "Connecting to the backend...",
  });
  const [counts, setCounts] = useState<ModeCounts>({ longingCount: 0, zenHits: 0 });
  const [longingState, setLongingState] = useState<RequestState>("loading");
  const [zenState, setZenState] = useState<RequestState>("loading");
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    let active = true;

    const loadHealth = async () => {
      try {
        const response = await fetch("/api/health");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: { status?: string } = await response.json();
        if (!active) {
          return;
        }

        setHealth({
          status: "success",
          message: `Backend status: ${data.status ?? "unknown"}`,
        });
      } catch (error) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : "Unknown error";
        setHealth({
          status: "error",
          message: `Backend request failed: ${message}`,
        });
      }
    };

    const loadCounts = async () => {
      try {
        const response = await fetch("/api/modes/state");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: Partial<ModeCounts> = await response.json();
        if (!active) {
          return;
        }

        setCounts({
          longingCount: data.longingCount ?? 0,
          zenHits: data.zenHits ?? 0,
        });
        setLongingState("success");
        setZenState("success");
      } catch {
        if (!active) {
          return;
        }

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

  const addBurst = (label: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const x = `${12 + Math.random() * 72}%`;
    const y = `${18 + Math.random() * 42}%`;
    setBursts((current) => [...current, { id, label, x, y }]);
    window.setTimeout(() => {
      setBursts((current) => current.filter((item) => item.id !== id));
    }, 1100);
  };

  const handleLongingTap = async () => {
    setLongingState("loading");
    try {
      const response = await fetch("/api/modes/longing", { method: "POST" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: { longingCount?: number } = await response.json();
      setCounts((current) => ({
        ...current,
        longingCount: data.longingCount ?? current.longingCount,
      }));
      setLongingState("success");
      addBurst("Recorded");
    } catch {
      setLongingState("error");
    }
  };

  const handleZenTap = async () => {
    setZenState("loading");
    try {
      const response = await fetch("/api/modes/zen", { method: "POST" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: { zenHits?: number } = await response.json();
      setCounts((current) => ({
        ...current,
        zenHits: data.zenHits ?? current.zenHits,
      }));
      setZenState("success");
      addBurst("Pain -1");
    } catch {
      setZenState("error");
    }
  };

  return (
    <main className={`app-shell app-shell--${currentMode}`}>
      <div className="backdrop backdrop--a" aria-hidden="true" />
      <div className="backdrop backdrop--b" aria-hidden="true" />
      <div className="backdrop backdrop--c" aria-hidden="true" />

      <section className="page">
        <header className="masthead">
          <p className="eyebrow">codex-pro1 / ritual interface</p>
          <h1>Two modes, one quiet little habit.</h1>
          <p className="lede">
            Open in Longing Mode by default, or flip to Zen Mode and tap the mokugyo in the center.
          </p>
          <div className="health-pill" data-state={health.status}>
            <span className="health-pill__dot" />
            <span>{health.message}</span>
          </div>
        </header>

        <nav className="mode-switcher" aria-label="Mode switcher">
          {modeCards.map((item) => (
            <button
              key={item.mode}
              type="button"
              className={`mode-chip ${currentMode === item.mode ? "is-active" : ""}`}
              onClick={() => setCurrentMode(item.mode)}
            >
              <strong>{item.name}</strong>
              <span>{item.description}</span>
            </button>
          ))}
        </nav>

        <section className={`stage stage--${currentMode}`}>
          {currentMode === "longing" ? (
            <div className="mode-view mode-view--longing">
              <div className="mode-copy">
                <p className="mode-tag">Main Mode</p>
                <h2>Longing Mode</h2>
                <p>
                  Count every return of the feeling. The number stays with you and the record stays
                  with the app.
                </p>
              </div>

              <div className="count-panel count-panel--longing">
                <span>Longing Count</span>
                <strong>{counts.longingCount}</strong>
                <small data-state={longingState}>
                  {longingState === "error" ? "Sync failed" : "Stored in the database"}
                </small>
              </div>

              <button
                type="button"
                className="action-button action-button--longing"
                onClick={handleLongingTap}
              >
                <span className="action-button__spark" />
                <span>Count One More Thought</span>
              </button>
            </div>
          ) : (
            <div className="mode-view mode-view--zen">
              <div className="mode-copy mode-copy--zen">
                <p className="mode-tag">Meditation Mode</p>
                <h2>Strike the Mokugyo</h2>
                <p>Tap the drum in the middle. Each hit lets the pain fall by one.</p>
              </div>

              <div className="zen-stage">
                <button type="button" className="mokugyo" onClick={handleZenTap} aria-label="Tap mokugyo">
                  <span className="mokugyo__ring" aria-hidden="true" />
                  <span className="mokugyo__drum" aria-hidden="true" />
                  <span className="mokugyo__mallet" aria-hidden="true" />
                  <span className="mokugyo__glow" aria-hidden="true" />
                </button>

                <div className="zen-readout">
                  <span>Pain Reduced</span>
                  <strong>{counts.zenHits}</strong>
                  <small data-state={zenState}>{zenState === "error" ? "Try again" : "Each strike is saved"}</small>
                </div>

                <div className="burst-layer" aria-hidden="true">
                  {bursts.map((item) => (
                    <span key={item.id} className="burst" style={{ left: item.x, top: item.y }}>
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
