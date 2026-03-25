import { useEffect, useState } from "react";

type HealthState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

type ClickState = {
  status: "idle" | "loading" | "success" | "error";
  count: number;
  message: string;
};

const focusItems = [
  {
    title: "Frontend",
    value: "React + Vite",
    detail: "A fast TypeScript client ready for routes, forms, and shared components.",
  },
  {
    title: "Backend",
    value: "Flask API",
    detail: "A small Flask service with a clean app factory and a simple health endpoint.",
  },
  {
    title: "Integration",
    value: "Shared repo",
    detail: "Frontend and backend can run together locally now and move into Docker together later.",
  },
];

const nextSteps = [
  "Add real business routes and shared layout components.",
  "Replace the in-memory demo endpoint with real feature APIs when the first workflow is ready.",
  "Harden the Docker setup for production deployment and CI.",
];

export default function App() {
  const [health, setHealth] = useState<HealthState>({
    status: "loading",
    message: "Checking backend connection...",
  });
  const [clickState, setClickState] = useState<ClickState>({
    status: "loading",
    count: 0,
    message: "Loading demo click counter...",
  });

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
          message: `Backend responded with status: ${data.status ?? "unknown"}`,
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

    const loadClickState = async () => {
      try {
        const response = await fetch("/api/demo-click");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: { count?: number; message?: string } = await response.json();
        if (!active) {
          return;
        }

        setClickState({
          status: "success",
          count: data.count ?? 0,
          message: data.message ?? "Ready for click test",
        });
      } catch (error) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : "Unknown error";
        setClickState({
          status: "error",
          count: 0,
          message: `Counter request failed: ${message}`,
        });
      }
    };

    void loadHealth();
    void loadClickState();

    return () => {
      active = false;
    };
  }, []);

  const handleClickTest = async () => {
    setClickState((current) => ({
      ...current,
      status: "loading",
      message: "Sending click to backend...",
    }));

    try {
      const response = await fetch("/api/demo-click", { method: "POST" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: { count?: number; message?: string } = await response.json();
      setClickState({
        status: "success",
        count: data.count ?? 0,
        message: data.message ?? "Click recorded",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setClickState((current) => ({
        ...current,
        status: "error",
        message: `Click request failed: ${message}`,
      }));
    }
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="workspace__header">
          <p className="eyebrow">codex-pro1 / integrated starter</p>
          <h1>One repo, one frontend, one backend.</h1>
          <p className="lede">
            This workspace now has a React frontend and a Flask backend wired together around a
            simple API contract. It is intentionally lean, but it is ready for feature work,
            local development, and the first round of Docker-based setup.
          </p>
        </div>

        <div className="workspace__grid">
          <section className="panel panel--hero">
            <div className="panel__topline">
              <span className="status-dot" aria-hidden="true" />
              Integration baseline is in place
            </div>
            <h2>Frontend to backend check</h2>
            <p>{health.message}</p>
            <div className="health-chip health-chip--status" data-state={health.status}>
              <span className="health-chip__label">API status</span>
              <strong>{health.status}</strong>
            </div>
            <div className="panel__actions">
              <a className="button button--primary" href="#click-test">
                Test interaction
              </a>
              <a className="button button--ghost" href="#focus">
                Inspect integration
              </a>
            </div>
          </section>

          <section className="panel" id="focus">
            <h2>Current foundation</h2>
            <div className="focus-list">
              {focusItems.map((item) => (
                <article className="focus-item" key={item.title}>
                  <p>{item.title}</p>
                  <strong>{item.value}</strong>
                  <span>{item.detail}</span>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="panel panel--wide" id="click-test">
          <h2>Clickable integration test</h2>
          <p>
            Use this button to confirm the React app can send a write request to Flask and render
            the latest response back in the UI.
          </p>
          <div className="demo-card">
            <div className="demo-card__metric">
              <span>Total clicks recorded</span>
              <strong>{clickState.count}</strong>
            </div>
            <div className="health-chip health-chip--status" data-state={clickState.status}>
              <span className="health-chip__label">Demo request</span>
              <strong>{clickState.status}</strong>
            </div>
            <p>{clickState.message}</p>
            <button className="button button--primary" type="button" onClick={handleClickTest}>
              Click and call backend
            </button>
          </div>
        </section>

        <section className="panel panel--wide" id="next-steps">
          <h2>Suggested next pass</h2>
          <ol className="step-list">
            {nextSteps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </section>
    </main>
  );
}