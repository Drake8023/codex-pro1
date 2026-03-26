import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

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

type User = {
  id: number;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

type PostImage = {
  id: number;
  url: string;
  sortOrder: number;
};

type PostItem = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  images: PostImage[];
};

type UploadedImage = {
  name: string;
  url: string;
};

type AuthPayload = {
  email: string;
  password: string;
};

type RegisterPayload = AuthPayload & {
  displayName: string;
};

async function apiRequest<T>(input: string, init: RequestInit = {}): Promise<T> {
  const isFormData = init.body instanceof FormData;
  const response = await fetch(input, {
    credentials: "include",
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};

  if (!response.ok) {
    const message = typeof data.message === "string" ? data.message : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [health, setHealth] = useState<HealthState>({ status: "loading", message: "Connecting" });
  const [counts, setCounts] = useState<ModeCounts>({ longingCount: 0, zenHits: 0 });
  const [longingState, setLongingState] = useState<RequestState>("loading");
  const [zenState, setZenState] = useState<RequestState>("loading");
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [feedState, setFeedState] = useState<RequestState>("loading");

  const activeMode = location.pathname.includes("/ritual/zen")
    ? "zen"
    : location.pathname.includes("/ritual/longing")
      ? "longing"
      : null;

  async function refreshHealth() {
    try {
      const data = await apiRequest<{ status?: string }>("/api/health");
      setHealth({ status: "success", message: `API ${data.status ?? "ok"}` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unavailable";
      setHealth({ status: "error", message: `API ${message}` });
    }
  }

  async function refreshSession() {
    try {
      const data = await apiRequest<{ user: User | null }>("/api/auth/me");
      setCurrentUser(data.user);
    } catch {
      setCurrentUser(null);
    }
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
    try {
      const data = await apiRequest<{ posts: PostItem[] }>("/api/posts");
      setPosts(data.posts);
      setFeedState("success");
    } catch {
      setFeedState("error");
    }
  }

  useEffect(() => {
    void refreshHealth();
    void refreshSession();
    void refreshCounts();
    void refreshPosts();
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
      const data = await apiRequest<{ longingCount?: number }>("/api/modes/longing", { method: "POST" });
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
      const data = await apiRequest<{ zenHits?: number }>("/api/modes/zen", { method: "POST" });
      setCounts((current) => ({ ...current, zenHits: data.zenHits ?? current.zenHits }));
      setZenState("success");
      addBurst("Pain -1");
    } catch {
      setZenState("error");
    }
  };

  const handleRegister = async (payload: RegisterPayload) => {
    const data = await apiRequest<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setCurrentUser(data.user);
    await refreshPosts();
  };

  const handleLogin = async (payload: AuthPayload) => {
    const data = await apiRequest<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setCurrentUser(data.user);
    await refreshPosts();
  };

  const handleLogout = async () => {
    await apiRequest<{ message: string }>("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    navigate("/");
  };

  const handleUploadImages = async (files: FileList | File[]) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
    const data = await apiRequest<{ images: UploadedImage[] }>("/api/uploads/images", {
      method: "POST",
      body: formData,
    });
    return data.images;
  };

  const handleCreatePost = async (content: string, imageUrls: string[]) => {
    const data = await apiRequest<{ post: PostItem }>("/api/posts", {
      method: "POST",
      body: JSON.stringify({ content, imageUrls }),
    });
    setPosts((current) => [data.post, ...current]);
    navigate("/");
  };

  const ownPosts = currentUser ? posts.filter((post) => post.author.id === currentUser.id) : [];

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
          <NavLink className={({ isActive }) => `top-link ${isActive ? "is-active" : ""}`} to="/" end>
            Feed
          </NavLink>
          <NavLink className={({ isActive }) => `top-link ${isActive ? "is-active" : ""}`} to="/create">
            Create
          </NavLink>
          {currentUser ? (
            <NavLink className={({ isActive }) => `top-link ${isActive ? "is-active" : ""}`} to="/profile">
              Profile
            </NavLink>
          ) : null}
        </nav>

        <div className="top-actions">
          <div className="api-chip" data-state={health.status}>
            <span className="api-chip__dot" />
            <span>{health.message}</span>
          </div>

          {currentUser ? (
            <div className="session-cluster">
              <Link className="session-pill" to="/profile">
                <span className="avatar-orb">{getInitials(currentUser.displayName)}</span>
                <span>{currentUser.displayName}</span>
              </Link>
              <button className="ghost-button" type="button" onClick={() => void handleLogout()}>
                Log out
              </button>
            </div>
          ) : (
            <div className="session-cluster">
              <Link className="ghost-link" to="/login">
                Log in
              </Link>
              <Link className="solid-link" to="/register">
                Join
              </Link>
            </div>
          )}
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <FeedPage
              currentUser={currentUser}
              posts={posts}
              state={feedState}
              onRefresh={() => void refreshPosts()}
            />
          }
        />
        <Route path="/login" element={<LoginPage currentUser={currentUser} onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage currentUser={currentUser} onRegister={handleRegister} />} />
        <Route
          path="/create"
          element={
            <CreatePage
              currentUser={currentUser}
              onUpload={handleUploadImages}
              onPublish={handleCreatePost}
            />
          }
        />
        <Route path="/profile" element={<ProfilePage currentUser={currentUser} posts={ownPosts} />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
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

type FeedPageProps = {
  currentUser: User | null;
  posts: PostItem[];
  state: RequestState;
  onRefresh: () => void;
};

function FeedPage({ currentUser, posts, state, onRefresh }: FeedPageProps) {
  return (
    <section className="feed-page">
      <div className="feed-hero">
        <div>
          <p className="eyebrow">Private archive</p>
          <h1>Feed the gallery with text, images, and small rituals.</h1>
        </div>
        <div className="feed-hero__meta">
          <p>{currentUser ? `Signed in as ${currentUser.displayName}` : "Join to publish and build your own archive."}</p>
          <button className="ghost-button" type="button" onClick={onRefresh}>
            Refresh
          </button>
        </div>
      </div>

      {state === "loading" ? <p className="status-copy">Loading posts...</p> : null}
      {state === "error" ? <p className="status-copy">Feed is unavailable right now.</p> : null}
      {state === "success" && posts.length === 0 ? (
        <div className="empty-state">
          <p className="eyebrow">No posts yet</p>
          <h2>Start the archive with the first note.</h2>
          <p>Use Create to publish a thought, a scene, or a set of images.</p>
        </div>
      ) : null}

      <div className="feed-list">
        {posts.map((post) => (
          <article className="post-row" key={post.id}>
            <div className="post-row__meta">
              {post.author.avatarUrl ? (
                <img className="avatar-orb avatar-orb--image" src={post.author.avatarUrl} alt={post.author.displayName} />
              ) : (
                <span className="avatar-orb">{getInitials(post.author.displayName)}</span>
              )}
              <div>
                <strong>{post.author.displayName}</strong>
                <p>{formatTimestamp(post.createdAt)}</p>
              </div>
            </div>
            {post.content ? <p className="post-row__content">{post.content}</p> : null}
            {post.images.length > 0 ? (
              <div className={`post-row__images post-row__images--${post.images.length > 1 ? "grid" : "single"}`}>
                {post.images.map((image) => (
                  <img key={image.id} src={image.url} alt="Post media" loading="lazy" />
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

type LoginPageProps = {
  currentUser: User | null;
  onLogin: (payload: AuthPayload) => Promise<void>;
};

function LoginPage({ currentUser, onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<RequestState>("idle");
  const [message, setMessage] = useState("Use your account to keep posting from any session.");

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setMessage("Signing in...");
    try {
      await onLogin({ email, password });
      setState("success");
      navigate("/");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not sign in");
    }
  };

  return (
    <section className="auth-page">
      <div className="form-shell">
        <p className="eyebrow">Login</p>
        <h1>Return to your archive.</h1>
        <p className="status-copy">{message}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label>
            <span>Password</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </label>
          <button className="solid-link solid-link--button" type="submit" disabled={state === "loading"}>
            {state === "loading" ? "Working" : "Log in"}
          </button>
        </form>
      </div>
    </section>
  );
}

type RegisterPageProps = {
  currentUser: User | null;
  onRegister: (payload: RegisterPayload) => Promise<void>;
};

function RegisterPage({ currentUser, onRegister }: RegisterPageProps) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<RequestState>("idle");
  const [message, setMessage] = useState("Create a profile before you begin publishing.");

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setMessage("Creating your account...");
    try {
      await onRegister({ displayName, email, password });
      setState("success");
      navigate("/");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not register");
    }
  };

  return (
    <section className="auth-page">
      <div className="form-shell">
        <p className="eyebrow">Join</p>
        <h1>Open a quiet publishing account.</h1>
        <p className="status-copy">{message}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Display name</span>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} type="text" required />
          </label>
          <label>
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label>
            <span>Password</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={6} required />
          </label>
          <button className="solid-link solid-link--button" type="submit" disabled={state === "loading"}>
            {state === "loading" ? "Working" : "Create account"}
          </button>
        </form>
      </div>
    </section>
  );
}

type CreatePageProps = {
  currentUser: User | null;
  onUpload: (files: FileList | File[]) => Promise<UploadedImage[]>;
  onPublish: (content: string, imageUrls: string[]) => Promise<void>;
};

function CreatePage({ currentUser, onUpload, onPublish }: CreatePageProps) {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadState, setUploadState] = useState<RequestState>("idle");
  const [publishState, setPublishState] = useState<RequestState>("idle");
  const [message, setMessage] = useState("Write a short note, add a few images, then publish.");

  const handleSelectImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setUploadState("loading");
    setMessage("Uploading images...");
    try {
      const uploaded = await onUpload(files);
      setImages((current) => [...current, ...uploaded]);
      setUploadState("success");
      setMessage("Images are ready.");
      event.target.value = "";
    } catch (error) {
      setUploadState("error");
      setMessage(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPublishState("loading");
    setMessage("Publishing...");
    try {
      await onPublish(content, images.map((image) => image.url));
      setPublishState("success");
    } catch (error) {
      setPublishState("error");
      setMessage(error instanceof Error ? error.message : "Could not publish");
    }
  };

  if (!currentUser) {
    return (
      <section className="auth-page">
        <div className="form-shell">
          <p className="eyebrow">Create</p>
          <h1>Sign in before you publish.</h1>
          <p className="status-copy">This first version keeps publishing attached to a logged-in account.</p>
          <div className="hero-actions">
            <button className="solid-link solid-link--button" type="button" onClick={() => navigate("/login")}>
              Go to login
            </button>
            <button className="ghost-button" type="button" onClick={() => navigate("/register")}>
              Create account
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="create-page">
      <div className="create-head">
        <div>
          <p className="eyebrow">Create</p>
          <h1>Publish a new note.</h1>
        </div>
        <p className="status-copy">{message}</p>
      </div>

      <form className="compose-shell" onSubmit={handleSubmit}>
        <label className="compose-shell__field">
          <span>Text</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={8}
            placeholder="Write something brief, personal, or visual."
          />
        </label>

        <div className="compose-shell__row">
          <label className="upload-field">
            <span>Add images</span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={handleSelectImages} />
          </label>
          <button className="solid-link solid-link--button" type="submit" disabled={publishState === "loading" || uploadState === "loading"}>
            {publishState === "loading" ? "Publishing" : "Publish"}
          </button>
        </div>

        {images.length > 0 ? (
          <div className="upload-grid">
            {images.map((image) => (
              <figure className="upload-grid__item" key={image.url}>
                <img src={image.url} alt="Uploaded preview" />
                <button type="button" className="ghost-button" onClick={() => setImages((current) => current.filter((item) => item.url !== image.url))}>
                  Remove
                </button>
              </figure>
            ))}
          </div>
        ) : null}
      </form>
    </section>
  );
}

type ProfilePageProps = {
  currentUser: User | null;
  posts: PostItem[];
};

function ProfilePage({ currentUser, posts }: ProfilePageProps) {
  if (!currentUser) {
    return (
      <section className="auth-page">
        <div className="form-shell">
          <p className="eyebrow">Profile</p>
          <h1>No active session.</h1>
          <p className="status-copy">Log in to see your profile and your published notes.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-head">
        <span className="avatar-orb avatar-orb--large">{getInitials(currentUser.displayName)}</span>
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{currentUser.displayName}</h1>
          <p className="status-copy">{currentUser.email}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div>
          <span>Posts</span>
          <strong>{posts.length}</strong>
        </div>
        <div>
          <span>Joined</span>
          <strong>{new Date(currentUser.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong>
        </div>
      </div>

      <div className="feed-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p className="eyebrow">No posts yet</p>
            <h2>Your archive is still empty.</h2>
            <p>Start with a text note or a group of images.</p>
          </div>
        ) : (
          posts.map((post) => (
            <article className="post-row" key={post.id}>
              <div className="post-row__meta">
                <span className="avatar-orb">{getInitials(post.author.displayName)}</span>
                <div>
                  <strong>{post.author.displayName}</strong>
                  <p>{formatTimestamp(post.createdAt)}</p>
                </div>
              </div>
              {post.content ? <p className="post-row__content">{post.content}</p> : null}
              {post.images.length > 0 ? (
                <div className={`post-row__images post-row__images--${post.images.length > 1 ? "grid" : "single"}`}>
                  {post.images.map((image) => (
                    <img key={image.id} src={image.url} alt="Post media" loading="lazy" />
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
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
        <button className={`ritual-links__item ${isLonging ? "is-active" : ""}`} type="button" onClick={() => onSwitch("longing")}>
          Longing
        </button>
        <button className={`ritual-links__item ${!isLonging ? "is-active" : ""}`} type="button" onClick={() => onSwitch("zen")}>
          Zen
        </button>
      </div>
    </section>
  );
}

export default function App() {
  return <AppShell />;
}
