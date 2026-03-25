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
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<ModeName>("longing");
  const [health, setHealth] = useState<HealthState>({
    status: "loading",
    message: "Connecting...",
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
        if (!active) return;

        setHealth({
          status: "success",
          message: `API ${data.status ?? "unknown"}`,
        });
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Unknown error";
        setHealth({ status: "error", message: `API ${message}` });
      }
    };

    const loadCounts = async () => {
      try {
        const response = await fetch("/api/modes/state");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: Partial<ModeCounts> = await response.json();
        if (!active) return;

        setCounts({
          longingCount: data.longingCount ?? 0,
          zenHits: data.zenHits ?? 0,
        });
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

  const addBurst = (label: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setBursts((current) => [...current, { id, label }]);
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
      setCounts((current) => ({
        ...current,
        longingCount: data.longingCount ?? current.longingCount,
      }));
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

  const isLonging = currentMode === "longing";
  const value = isLonging ? counts.longingCount : counts.zenHits;
  const actionState = isLonging ? longingState : zenState;

  return (
    <main className={`app-shell app-shell--${currentMode}`}>
      <div className="halo halo--one" aria-hidden="true" />
      <div className="halo halo--two" aria-hidden="true" />

      <section className="ritual-surface">
        <header className="topbar">
          <div className="switch" role="tablist" aria-label="Mode switch">
            <button
              type="button"
              className={`switch__item ${isLonging ? "is-active" : ""}`}
              onClick={() => setCurrentMode("longing")}
            >
              Longing
            </button>
            <button
              type="button"
              className={`switch__item ${!isLonging ? "is-active" : ""}`}
              onClick={() => setCurrentMode("zen")}
            >
              Zen
            </button>
          </div>

          <div className="status" data-state={health.status}>
            <span className="status__dot" />
            <span>{health.message}</span>
          </div>
        </header>

        <div className="stage">
          {isLonging ? (
            <>
              <p className="label">Longing Count</p>
              <strong className="value">{value}</strong>
              <button className="tap-button tap-button--longing" type="button" onClick={handleLongingTap}>
                Count
              </button>
            </>
          ) : (
            <>
              <p className="label">Pain Reduced</p>
              <strong className="value">{value}</strong>
              <button className="mokugyo" type="button" onClick={handleZenTap} aria-label="Strike mokugyo">
                <span className="mokugyo__ring" aria-hidden="true" />
                <span className="mokugyo__drum" aria-hidden="true" />
                <span className="mokugyo__mallet" aria-hidden="true" />
              </button>
            </>
          )}

          <small className="hint" data-state={actionState}>
            {actionState === "error" ? "Try again" : isLonging ? "Stored" : "Saved"}
          </small>

          <div className="burst-layer" aria-hidden="true">
            {bursts.map((item) => (
              <span className="burst" key={item.id}>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}