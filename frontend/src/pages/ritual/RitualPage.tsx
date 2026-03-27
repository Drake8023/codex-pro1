import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Dictionary } from "../../i18n";
import { Button } from "../../shared/components/Button";
import { StatusText } from "../../shared/components/StatusText";
import { useRitualState, useTapLonging, useTapZen } from "../../features/rituals/hooks/useRituals";

export function RitualPage({ t }: { t: Dictionary }) {
  const { mode = "longing" } = useParams();
  const ritualState = useRitualState();
  const tapLonging = useTapLonging();
  const tapZen = useTapZen();
  const [savedMessage, setSavedMessage] = useState("");
  const isZen = mode === "zen";
  const count = isZen ? ritualState.data?.zenHits ?? 0 : ritualState.data?.longingCount ?? 0;

  useEffect(() => {
    if (!savedMessage) return undefined;
    const timeout = window.setTimeout(() => setSavedMessage(""), 1500);
    return () => window.clearTimeout(timeout);
  }, [savedMessage]);

  const handleTap = async () => {
    if (isZen) {
      await tapZen.mutateAsync();
    } else {
      await tapLonging.mutateAsync();
    }
    setSavedMessage(t.saved);
  };

  return (
    <section className="page page--ritual">
      <div className="ritual-header">
        <Link className={`glass-pill app-link-button ${isZen ? "" : "is-active"}`} to="/ritual/longing">{t.longingMode}</Link>
        <Link className={`glass-pill app-link-button ${isZen ? "is-active" : ""}`} to="/ritual/zen">{t.zenMode}</Link>
      </div>
      <div className="ritual-card glass-panel glass-panel--strong">
        <p className="eyebrow">{t.rituals}</p>
        <h1>{isZen ? t.zenTitle : t.longingTitle}</h1>
        <div className="ritual-card__count">
          <span>{isZen ? t.count : t.longingCount}</span>
          <strong>{count}</strong>
        </div>
        <Button variant="primary" onClick={() => void handleTap()} disabled={tapLonging.isPending || tapZen.isPending}>
          {isZen ? t.strikeMokugyo : t.count}
        </Button>
        <StatusText>
          {savedMessage || (ritualState.isError ? t.tryAgain : isZen ? t.painReduced : t.painMinusOne)}
        </StatusText>
      </div>
    </section>
  );
}
