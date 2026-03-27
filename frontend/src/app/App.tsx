import { useState, type ReactNode } from "react";
import { CloudServerOutlined, GlobalOutlined, MenuOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Badge, Popover, Segmented } from "antd";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { FeedPage } from "../pages/feed/FeedPage";
import { CreatePage } from "../pages/create/CreatePage";
import { ProfilePage } from "../pages/profile/ProfilePage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { RitualPage } from "../pages/ritual/RitualPage";
import { dictionaries } from "../i18n";
import { Avatar } from "../shared/components/Avatar";
import { Button } from "../shared/components/Button";
import { useTheme } from "./providers/ThemeProvider";
import { useSession, useLogout } from "../features/auth/hooks/useSession";
import { useHealth } from "../shared/hooks/useHealth";

function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useSession();
  const health = useHealth();
  const t = dictionaries[language];

  const content = (
    <div className="settings-panel">
      <div className="settings-group">
        <span className="settings-label">{t.appearance}</span>
        <Button variant="ghost" className="settings-option" onClick={() => { toggleTheme(); setIsOpen(false); }} icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}>
          {theme === "dark" ? t.themeLight : t.themeDark}
        </Button>
      </div>
      <div className="settings-group">
        <span className="settings-label">{t.language}</span>
        <Segmented
          className="settings-segmented"
          value={language}
          onChange={(value) => setLanguage(value as "en" | "zh")}
          options={[
            { label: <span className="settings-segmented__label"><GlobalOutlined /> EN</span>, value: "en" },
            { label: <span className="settings-segmented__label"><GlobalOutlined /> {t.languageZhLabel}</span>, value: "zh" },
          ]}
        />
      </div>
      <div className="settings-group">
        <span className="settings-label">{t.apiStatus}</span>
        <span className={`settings-status ${health.status}`}>
          <CloudServerOutlined />
          {health.message}
        </span>
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={isOpen} onOpenChange={setIsOpen} placement="bottomRight" overlayClassName="settings-popover">
      <Button variant="ghost" className="settings-trigger" icon={<MenuOutlined />}>{t.settings}</Button>
    </Popover>
  );
}

function AppChrome({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, language } = useSession();
  const logout = useLogout();
  const t = dictionaries[language];
  const isRitual = location.pathname.startsWith("/ritual/");

  return (
    <main className="app-shell">
      <div className="app-shell__ambient app-shell__ambient--one" aria-hidden="true" />
      <div className="app-shell__ambient app-shell__ambient--two" aria-hidden="true" />
      <header className="app-topbar glass-panel glass-panel--strong">
        <Link className="app-brand" to="/">Curator</Link>
        <nav className="app-nav" aria-label="Primary navigation">
          <NavLink className={({ isActive }) => `app-nav__link ${isActive ? "is-active" : ""}`} to="/" end>{t.navFeed}</NavLink>
          <NavLink className={({ isActive }) => `app-nav__link ${isActive ? "is-active" : ""}`} to="/create">{t.navCreate}</NavLink>
          {currentUser ? <NavLink className={({ isActive }) => `app-nav__link ${isActive ? "is-active" : ""}`} to="/profile">{t.navProfile}</NavLink> : null}
        </nav>
        <div className="app-topbar__actions">
          <SettingsMenu />
          {currentUser ? (
            <div className="app-topbar__session">
              <Link className="session-link glass-pill" to="/profile">
                <Avatar user={currentUser} size="sm" />
                <span>{currentUser.displayName}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout.mutate(undefined, { onSuccess: () => navigate("/") })}>{t.logout}</Button>
            </div>
          ) : (
            <div className="app-topbar__session">
              <Link className="glass-pill app-link-button" to="/login">{t.login}</Link>
              <Link className="app-link-button app-link-button--primary" to="/register">{t.join}</Link>
            </div>
          )}
        </div>
      </header>
      <div className={`app-content ${isRitual ? "app-content--ritual" : ""}`}>{children}</div>
    </main>
  );
}

export default function App() {
  const { language } = useSession();
  const t = dictionaries[language];

  return (
    <AppChrome>
      <Routes>
        <Route path="/" element={<FeedPage t={t} language={language} />} />
        <Route path="/create" element={<CreatePage t={t} />} />
        <Route path="/profile" element={<ProfilePage t={t} language={language} />} />
        <Route path="/login" element={<LoginPage t={t} />} />
        <Route path="/register" element={<RegisterPage t={t} />} />
        <Route path="/ritual/:mode" element={<RitualPage t={t} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppChrome>
  );
}
