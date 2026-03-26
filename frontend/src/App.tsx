import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { dictionaries, formatShortDate, formatTimestamp, getInitialLanguage, type Dictionary, type Language } from "./i18n";

type HealthState = { status: "idle" | "loading" | "success" | "error"; message: string };
type ModeCounts = { longingCount: number; zenHits: number };
type RequestState = "idle" | "loading" | "success" | "error";
type ModeName = "longing" | "zen";
type Burst = { id: number; label: string; x: string; y: string };
type User = { id: number; email: string; displayName: string; avatarUrl: string | null; bio: string | null; createdAt: string; updatedAt: string };
type PostImage = { id: number; url: string; sortOrder: number };
type PostItem = { id: number; content: string; createdAt: string; updatedAt: string; author: User; images: PostImage[] };
type UploadedImage = { name: string; url: string };
type AuthPayload = { email: string; password: string };
type RegisterPayload = AuthPayload & { displayName: string };

async function apiRequest<T>(input: string, init: RequestInit = {}): Promise<T> {
  const isFormData = init.body instanceof FormData;
  const response = await fetch(input, { credentials: "include", ...init, headers: { ...(isFormData ? {} : { "Content-Type": "application/json" }), ...(init.headers ?? {}) } });
  const text = await response.text();
  const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  if (!response.ok) throw new Error(typeof data.message === "string" ? data.message : `HTTP ${response.status}`);
  return data as T;
}

function getInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());
  const [health, setHealth] = useState<HealthState>({ status: "loading", message: "API" });
  const [counts, setCounts] = useState<ModeCounts>({ longingCount: 0, zenHits: 0 });
  const [longingState, setLongingState] = useState<RequestState>("loading");
  const [zenState, setZenState] = useState<RequestState>("loading");
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [feedState, setFeedState] = useState<RequestState>("loading");
  const t = dictionaries[language];
  const activeMode = location.pathname.includes("/ritual/zen") ? "zen" : location.pathname.includes("/ritual/longing") ? "longing" : null;

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("curator-language", language);
  }, [language]);

  async function refreshHealth() {
    try {
      const data = await apiRequest<{ status?: string }>("/api/health");
      setHealth({ status: "success", message: `API ${data.status ?? "ok"}` });
    } catch {
      setHealth({ status: "error", message: t.apiUnavailable });
    }
  }
  async function refreshSession() {
    try { setCurrentUser((await apiRequest<{ user: User | null }>("/api/auth/me")).user); } catch { setCurrentUser(null); }
  }
  async function refreshCounts() {
    try {
      const data = await apiRequest<Partial<ModeCounts>>("/api/modes/state");
      setCounts({ longingCount: data.longingCount ?? 0, zenHits: data.zenHits ?? 0 });
      setLongingState("success");
      setZenState("success");
    } catch {
      setLongingState("error");
      setZenState("error");
    }
  }
  async function refreshPosts() {
    setFeedState("loading");
    try { setPosts((await apiRequest<{ posts: PostItem[] }>("/api/posts")).posts); setFeedState("success"); } catch { setFeedState("error"); }
  }

  useEffect(() => { void refreshHealth(); void refreshSession(); void refreshCounts(); void refreshPosts(); }, []);
  useEffect(() => { void refreshHealth(); }, [language]);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const addBurst = (label: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const x = `${36 + Math.random() * 28}%`;
    const y = `${28 + Math.random() * 22}%`;
    setBursts((current) => [...current, { id, label, x, y }]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => item.id !== id)), 1000);
  };
  const handleLongingTap = async () => {
    setLongingState("loading");
    try { const data = await apiRequest<{ longingCount?: number }>("/api/modes/longing", { method: "POST" }); setCounts((c) => ({ ...c, longingCount: data.longingCount ?? c.longingCount })); setLongingState("success"); addBurst("+1"); } catch { setLongingState("error"); }
  };
  const handleZenTap = async () => {
    setZenState("loading");
    try { const data = await apiRequest<{ zenHits?: number }>("/api/modes/zen", { method: "POST" }); setCounts((c) => ({ ...c, zenHits: data.zenHits ?? c.zenHits })); setZenState("success"); addBurst(t.painMinusOne); } catch { setZenState("error"); }
  };
  const handleRegister = async (payload: RegisterPayload) => { setCurrentUser((await apiRequest<{ user: User }>("/api/auth/register", { method: "POST", body: JSON.stringify(payload) })).user); await refreshPosts(); };
  const handleLogin = async (payload: AuthPayload) => { setCurrentUser((await apiRequest<{ user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify(payload) })).user); await refreshPosts(); };
  const handleLogout = async () => { await apiRequest<{ message: string }>("/api/auth/logout", { method: "POST" }); setCurrentUser(null); navigate("/"); };
  const handleUploadImages = async (files: FileList | File[]) => { const formData = new FormData(); Array.from(files).forEach((file) => formData.append("images", file)); return (await apiRequest<{ images: UploadedImage[] }>("/api/uploads/images", { method: "POST", body: formData })).images; };
  const handleCreatePost = async (content: string, imageUrls: string[]) => { const data = await apiRequest<{ post: PostItem }>("/api/posts", { method: "POST", body: JSON.stringify({ content, imageUrls }) }); setPosts((current) => [data.post, ...current]); navigate("/"); };
  const ownPosts = currentUser ? posts.filter((post) => post.author.id === currentUser.id) : [];

  return (
    <main className={`app-shell language-${language}`}>
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />
      <div className="ambient ambient--three" aria-hidden="true" />
      <header className="top-nav">
        <Link className="brand" to="/">Curator</Link>
        <nav className="top-links">
          <NavLink className={({ isActive }) => `top-link ${isActive ? "is-active" : ""}`} to="/" end>{t.navFeed}</NavLink>
          <NavLink className={({ isActive }) => `top-link ${isActive ? "is-active" : ""}`} to="/create">{t.navCreate}</NavLink>
          {currentUser ? <NavLink className={({ isActive }) => `top-link ${isActive ? "is-active" : ""}`} to="/profile">{t.navProfile}</NavLink> : null}
        </nav>
        <div className="top-actions">
          <div className="api-chip" data-state={health.status}><span className="api-chip__dot" /><span>{health.message}</span></div>
          <div className="language-switch" role="group" aria-label={t.language}>
            <button className={`language-switch__item ${language === "en" ? "is-active" : ""}`} type="button" onClick={() => setLanguage("en")}>EN</button>
            <button className={`language-switch__item ${language === "zh" ? "is-active" : ""}`} type="button" onClick={() => setLanguage("zh")}>{t.languageZhLabel}</button>
          </div>
          {currentUser ? <div className="session-cluster"><Link className="session-pill" to="/profile"><span className="avatar-orb">{getInitials(currentUser.displayName)}</span><span className="session-pill__name">{currentUser.displayName}</span></Link><button className="ghost-button" type="button" onClick={() => void handleLogout()}>{t.logout}</button></div> : <div className="session-cluster"><Link className="ghost-link" to="/login">{t.login}</Link><Link className="solid-link" to="/register">{t.join}</Link></div>}
        </div>
      </header>
      <Routes>
        <Route path="/" element={<FeedPage currentUser={currentUser} posts={posts} state={feedState} language={language} t={t} onRefresh={() => void refreshPosts()} />} />
        <Route path="/login" element={<LoginPage currentUser={currentUser} onLogin={handleLogin} t={t} />} />
        <Route path="/register" element={<RegisterPage currentUser={currentUser} onRegister={handleRegister} t={t} />} />
        <Route path="/create" element={<CreatePage currentUser={currentUser} onUpload={handleUploadImages} onPublish={handleCreatePost} t={t} />} />
        <Route path="/profile" element={<ProfilePage currentUser={currentUser} posts={ownPosts} language={language} t={t} />} />
        <Route path="/ritual/longing" element={<RitualPage mode="longing" count={counts.longingCount} state={longingState} bursts={bursts} onTap={handleLongingTap} onSwitch={(mode) => navigate(`/ritual/${mode}`)} t={t} />} />
        <Route path="/ritual/zen" element={<RitualPage mode="zen" count={counts.zenHits} state={zenState} bursts={bursts} onTap={handleZenTap} onSwitch={(mode) => navigate(`/ritual/${mode}`)} t={t} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <div className={`floating-menu ${menuOpen ? "is-open" : ""}`}>
        <button className="floating-menu__trigger" type="button" onClick={() => setMenuOpen((current) => !current)}><span>{menuOpen ? t.close : t.rituals}</span></button>
        <div className="floating-menu__panel">
          <button className="floating-menu__item" type="button" onClick={() => navigate("/ritual/longing")}><strong>{t.longing}</strong><span>{counts.longingCount}</span></button>
          <button className="floating-menu__item" type="button" onClick={() => navigate("/ritual/zen")}><strong>{t.zen}</strong><span>{counts.zenHits}</span></button>
        </div>
      </div>
      {activeMode ? <div className="bottom-switch" role="tablist" aria-label="Mode switch"><button type="button" className={`bottom-switch__item ${activeMode === "longing" ? "is-active" : ""}`} onClick={() => navigate("/ritual/longing")}>{t.longing}</button><button type="button" className={`bottom-switch__item ${activeMode === "zen" ? "is-active" : ""}`} onClick={() => navigate("/ritual/zen")}>{t.zen}</button></div> : null}
    </main>
  );
}
type FeedPageProps = { currentUser: User | null; posts: PostItem[]; state: RequestState; language: Language; t: Dictionary; onRefresh: () => void };
function FeedPage({ currentUser, posts, state, language, t, onRefresh }: FeedPageProps) {
  return <section className="feed-page"><div className="feed-hero"><div><p className="eyebrow">{t.feedEyebrow}</p><h1>{t.feedTitle}</h1></div><div className="feed-hero__meta"><p>{currentUser ? t.signedInAs(currentUser.displayName) : t.joinPrompt}</p><button className="ghost-button" type="button" onClick={onRefresh}>{t.refresh}</button></div></div>{state === "loading" ? <p className="status-copy status-copy--section">{t.loadingPosts}</p> : null}{state === "error" ? <p className="status-copy status-copy--section">{t.feedUnavailable}</p> : null}{state === "success" && posts.length === 0 ? <div className="empty-state"><p className="eyebrow">{t.noPostsEyebrow}</p><h2>{t.noPostsTitle}</h2><p>{t.noPostsBody}</p></div> : null}<div className="feed-list">{posts.map((post) => <article className="post-row" key={post.id}><div className="post-row__meta">{post.author.avatarUrl ? <img className="avatar-orb avatar-orb--image" src={post.author.avatarUrl} alt={post.author.displayName} /> : <span className="avatar-orb">{getInitials(post.author.displayName)}</span>}<div className="post-row__author"><strong>{post.author.displayName}</strong><p>{formatTimestamp(post.createdAt, language)}</p></div></div>{post.content ? <p className="post-row__content">{post.content}</p> : null}{post.images.length > 0 ? <div className={`post-row__images post-row__images--${post.images.length > 1 ? "grid" : "single"}`}>{post.images.map((image) => <img key={image.id} src={image.url} alt={t.postMediaAlt} loading="lazy" />)}</div> : null}</article>)}</div></section>;
}

type LoginPageProps = { currentUser: User | null; onLogin: (payload: AuthPayload) => Promise<void>; t: Dictionary };
function LoginPage({ currentUser, onLogin, t }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<RequestState>("idle");
  const [message, setMessage] = useState(t.loginHint);
  useEffect(() => { if (state === "idle") setMessage(t.loginHint); }, [t.loginHint, state]);
  if (currentUser) return <Navigate to="/" replace />;
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setMessage(t.signingIn);
    try { await onLogin({ email, password }); setState("success"); navigate("/"); } catch (error) { setState("error"); setMessage(error instanceof Error ? error.message : t.loginFailed); }
  };
  return <section className="auth-page"><div className="form-shell"><p className="eyebrow">{t.loginEyebrow}</p><h1>{t.loginTitle}</h1><p className="status-copy">{message}</p><form className="auth-form" onSubmit={handleSubmit}><label><span>{t.email}</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required /></label><label><span>{t.password}</span><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required /></label><button className="solid-link solid-link--button" type="submit" disabled={state === "loading"}>{state === "loading" ? t.working : t.loginButton}</button></form></div></section>;
}

type RegisterPageProps = { currentUser: User | null; onRegister: (payload: RegisterPayload) => Promise<void>; t: Dictionary };
function RegisterPage({ currentUser, onRegister, t }: RegisterPageProps) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<RequestState>("idle");
  const [message, setMessage] = useState(t.registerHint);
  useEffect(() => { if (state === "idle") setMessage(t.registerHint); }, [t.registerHint, state]);
  if (currentUser) return <Navigate to="/" replace />;
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setMessage(t.creatingAccount);
    try { await onRegister({ displayName, email, password }); setState("success"); navigate("/"); } catch (error) { setState("error"); setMessage(error instanceof Error ? error.message : t.registerFailed); }
  };
  return <section className="auth-page"><div className="form-shell"><p className="eyebrow">{t.registerEyebrow}</p><h1>{t.registerTitle}</h1><p className="status-copy">{message}</p><form className="auth-form" onSubmit={handleSubmit}><label><span>{t.displayName}</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} type="text" required /></label><label><span>{t.email}</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required /></label><label><span>{t.password}</span><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={6} required /></label><button className="solid-link solid-link--button" type="submit" disabled={state === "loading"}>{state === "loading" ? t.working : t.createAccount}</button></form></div></section>;
}

type CreatePageProps = { currentUser: User | null; onUpload: (files: FileList | File[]) => Promise<UploadedImage[]>; onPublish: (content: string, imageUrls: string[]) => Promise<void>; t: Dictionary };
function CreatePage({ currentUser, onUpload, onPublish, t }: CreatePageProps) {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadState, setUploadState] = useState<RequestState>("idle");
  const [publishState, setPublishState] = useState<RequestState>("idle");
  const [message, setMessage] = useState(t.createHint);
  useEffect(() => { if (uploadState === "idle" && publishState === "idle") setMessage(t.createHint); }, [t.createHint, uploadState, publishState]);
  const handleSelectImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploadState("loading");
    setMessage(t.uploadInProgress);
    try { const uploaded = await onUpload(files); setImages((current) => [...current, ...uploaded]); setUploadState("success"); setMessage(t.uploadReady); event.target.value = ""; } catch (error) { setUploadState("error"); setMessage(error instanceof Error ? error.message : t.uploadFailed); }
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPublishState("loading");
    setMessage(t.publishing);
    try { await onPublish(content, images.map((image) => image.url)); setPublishState("success"); } catch (error) { setPublishState("error"); setMessage(error instanceof Error ? error.message : t.publishFailed); }
  };
  if (!currentUser) return <section className="auth-page"><div className="form-shell"><p className="eyebrow">{t.createEyebrow}</p><h1>{t.signInBeforePublish}</h1><p className="status-copy">{t.publishAuthHint}</p><div className="hero-actions"><button className="solid-link solid-link--button" type="button" onClick={() => navigate("/login")}>{t.goToLogin}</button><button className="ghost-button" type="button" onClick={() => navigate("/register")}>{t.createAccount}</button></div></div></section>;
  return <section className="create-page"><div className="create-head"><div><p className="eyebrow">{t.createEyebrow}</p><h1>{t.createTitle}</h1></div><p className="status-copy">{message}</p></div><form className="compose-shell" onSubmit={handleSubmit}><label className="compose-shell__field"><span>{t.text}</span><textarea value={content} onChange={(event) => setContent(event.target.value)} rows={8} placeholder={t.textPlaceholder} /></label><div className="compose-shell__row"><label className="upload-field"><span>{t.addImages}</span><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={handleSelectImages} /></label><button className="solid-link solid-link--button" type="submit" disabled={publishState === "loading" || uploadState === "loading"}>{publishState === "loading" ? t.publishing : t.publish}</button></div>{images.length > 0 ? <div className="upload-grid">{images.map((image) => <figure className="upload-grid__item" key={image.url}><img src={image.url} alt={t.uploadedPreviewAlt} /><button type="button" className="ghost-button" onClick={() => setImages((current) => current.filter((item) => item.url !== image.url))}>{t.remove}</button></figure>)}</div> : null}</form></section>;
}
type ProfilePageProps = { currentUser: User | null; posts: PostItem[]; language: Language; t: Dictionary };
function ProfilePage({ currentUser, posts, language, t }: ProfilePageProps) {
  if (!currentUser) return <section className="auth-page"><div className="form-shell"><p className="eyebrow">{t.profileEyebrow}</p><h1>{t.noSessionTitle}</h1><p className="status-copy">{t.noSessionHint}</p></div></section>;
  return <section className="profile-page"><div className="profile-head"><span className="avatar-orb avatar-orb--large">{getInitials(currentUser.displayName)}</span><div><p className="eyebrow">{t.profileEyebrow}</p><h1>{currentUser.displayName}</h1><p className="status-copy">{currentUser.email}</p></div></div><div className="profile-stats"><div><span>{t.posts}</span><strong>{posts.length}</strong></div><div><span>{t.joined}</span><strong>{formatShortDate(currentUser.createdAt, language)}</strong></div></div><div className="feed-list">{posts.length === 0 ? <div className="empty-state"><p className="eyebrow">{t.emptyArchiveEyebrow}</p><h2>{t.emptyArchiveTitle}</h2><p>{t.emptyArchiveBody}</p></div> : posts.map((post) => <article className="post-row" key={post.id}><div className="post-row__meta"><span className="avatar-orb">{getInitials(post.author.displayName)}</span><div className="post-row__author"><strong>{post.author.displayName}</strong><p>{formatTimestamp(post.createdAt, language)}</p></div></div>{post.content ? <p className="post-row__content">{post.content}</p> : null}{post.images.length > 0 ? <div className={`post-row__images post-row__images--${post.images.length > 1 ? "grid" : "single"}`}>{post.images.map((image) => <img key={image.id} src={image.url} alt={t.postMediaAlt} loading="lazy" />)}</div> : null}</article>)}</div></section>;
}

type RitualPageProps = { mode: ModeName; count: number; state: RequestState; bursts: Burst[]; onTap: () => void; onSwitch: (mode: ModeName) => void; t: Dictionary };
function RitualPage({ mode, count, state, bursts, onTap, onSwitch, t }: RitualPageProps) {
  const isLonging = mode === "longing";
  return <section className={`ritual-page ritual-page--${mode}`}><div className="ritual-copy"><p className="eyebrow">{isLonging ? t.longingMode : t.zenMode}</p><h2>{isLonging ? t.longingTitle : t.zenTitle}</h2></div><div className="ritual-surface"><span className="ritual-surface__label">{isLonging ? t.longingCount : t.painReduced}</span><strong className="ritual-surface__value">{count}</strong>{isLonging ? <button className="ritual-action ritual-action--longing" type="button" onClick={onTap}>{t.count}</button> : <button className="mokugyo" type="button" onClick={onTap} aria-label={t.strikeMokugyo}><span className="mokugyo__ring" aria-hidden="true" /><span className="mokugyo__drum" aria-hidden="true" /><span className="mokugyo__mallet" aria-hidden="true" /></button>}<small className="ritual-surface__hint" data-state={state}>{state === "error" ? t.tryAgain : t.saved}</small><div className="burst-layer" aria-hidden="true">{bursts.map((item) => <span className="burst" key={item.id} style={{ left: item.x, top: item.y }}>{item.label}</span>)}</div></div><div className="ritual-links"><button className={`ritual-links__item ${isLonging ? "is-active" : ""}`} type="button" onClick={() => onSwitch("longing")}>{t.longing}</button><button className={`ritual-links__item ${!isLonging ? "is-active" : ""}`} type="button" onClick={() => onSwitch("zen")}>{t.zen}</button></div></section>;
}

export default function App() {
  return <AppShell />;
}
