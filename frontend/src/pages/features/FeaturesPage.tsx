import { CompassOutlined, FireOutlined, HeartOutlined, MessageOutlined, RadarChartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { Dictionary } from "../../i18n";
import { useNotifications } from "../../features/notifications/hooks/useNotifications";
import { useRitualState } from "../../features/rituals/hooks/useRituals";
import { useSession } from "../../features/auth/hooks/useSession";

export function FeaturesPage({ t }: { t: Dictionary }) {
  const { currentUser } = useSession();
  const ritualState = useRitualState();
  const notifications = useNotifications(Boolean(currentUser));
  const unreadCount = notifications.data?.unreadCount ?? 0;
  const longingCount = ritualState.data?.longingCount ?? 0;
  const zenHits = ritualState.data?.zenHits ?? 0;

  return (
    <section className="page page--features">
      <div className="page-header glass-panel glass-panel--strong">
        <div>
          <p className="eyebrow">{t.featuresEyebrow}</p>
          <h1>{t.featuresTitle}</h1>
        </div>
        <p className="status-text">{t.featuresBody}</p>
      </div>

      <section className="feature-overview">
        <article className="feature-overview__panel glass-panel glass-panel--strong">
          <div className="feature-overview__head">
            <span className="feature-overview__badge">{t.featureHubLabel}</span>
            <h2>{t.featureShortcutTitle}</h2>
            <p>{t.featureShortcutBody}</p>
          </div>
          <div className="feature-overview__actions">
            <Link className="app-link-button" to="/ritual/longing">
              <HeartOutlined />
              <span>{t.featureLongingLabel}</span>
            </Link>
            <Link className="app-link-button app-link-button--primary" to="/ritual/zen">
              <FireOutlined />
              <span>{t.featureZenLabel}</span>
            </Link>
          </div>
        </article>
        <article className="feature-overview__panel feature-overview__panel--pulse glass-panel">
          <div className="feature-overview__head">
            <span className="feature-overview__badge">{t.featurePulseTitle}</span>
            <h2>{t.featurePulseTitle}</h2>
          </div>
          <div className="feature-pulse">
            <div className="feature-pulse__item">
              <HeartOutlined />
              <span>{t.featurePulseLonging}</span>
              <strong>{longingCount}</strong>
            </div>
            <div className="feature-pulse__item">
              <FireOutlined />
              <span>{t.featurePulseZen}</span>
              <strong>{zenHits}</strong>
            </div>
            <div className="feature-pulse__item">
              <MessageOutlined />
              <span>{t.featurePulseNotifications}</span>
              <strong>{unreadCount}</strong>
            </div>
          </div>
        </article>
      </section>

      <div className="feature-grid">
        <article className="feature-card glass-panel glass-panel--strong">
          <div className="feature-card__icon">
            <RadarChartOutlined />
          </div>
          <div className="feature-card__body">
            <h2>{t.featureRitualsTitle}</h2>
            <p>{t.featureRitualsBody}</p>
          </div>
          <div className="feature-card__actions">
            <Link className="app-link-button" to="/ritual/longing">
              <HeartOutlined />
              <span>{t.featureLongingLabel}</span>
            </Link>
            <Link className="app-link-button app-link-button--primary" to="/ritual/zen">
              <FireOutlined />
              <span>{t.featureZenLabel}</span>
            </Link>
          </div>
        </article>

        <article className="feature-card feature-card--placeholder glass-panel">
          <div className="feature-card__icon">
            <CompassOutlined />
          </div>
          <div className="feature-card__body">
            <span className="feature-card__tag">{t.featurePlaceholderTag}</span>
            <h2>{t.featureExploreTitle}</h2>
            <p>{t.featureExploreBody}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
