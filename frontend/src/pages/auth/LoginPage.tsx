import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Dictionary } from "../../i18n";
import { useLogin } from "../../features/auth/hooks/useSession";
import { Button } from "../../shared/components/Button";
import { StatusText } from "../../shared/components/StatusText";

export function LoginPage({ t }: { t: Dictionary }) {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      await login.mutateAsync({ email, password });
      navigate("/");
    } catch {
      // handled in UI
    }
  };

  return (
    <section className="page page--auth">
      <div className="auth-card glass-panel glass-panel--strong">
        <p className="eyebrow">{t.loginEyebrow}</p>
        <h1>{t.loginTitle}</h1>
        <p>{t.loginHint}</p>
        <div className="form-grid">
          <label className="field">
            <span>{t.email}</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field">
            <span>{t.password}</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <div className="form-actions">
            <StatusText>{login.isError ? t.loginFailed : ""}</StatusText>
            <Button variant="primary" onClick={() => void handleSubmit()} disabled={login.isPending || !email || !password}>
              {login.isPending ? t.signingIn : t.loginButton}
            </Button>
          </div>
        </div>
        <p className="auth-card__switch">
          <Link to="/register">{t.join}</Link>
        </p>
      </div>
    </section>
  );
}
