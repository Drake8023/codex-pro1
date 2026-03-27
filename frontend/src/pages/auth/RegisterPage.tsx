import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Dictionary } from "../../i18n";
import { useRegister } from "../../features/auth/hooks/useSession";
import { Button } from "../../shared/components/Button";
import { StatusText } from "../../shared/components/StatusText";

export function RegisterPage({ t }: { t: Dictionary }) {
  const navigate = useNavigate();
  const register = useRegister();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      await register.mutateAsync({ displayName, email, password });
      navigate("/");
    } catch {
      // handled in UI
    }
  };

  return (
    <section className="page page--auth">
      <div className="auth-card glass-panel glass-panel--strong">
        <p className="eyebrow">{t.registerEyebrow}</p>
        <h1>{t.registerTitle}</h1>
        <p>{t.registerHint}</p>
        <div className="form-grid">
          <label className="field">
            <span>{t.displayName}</span>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </label>
          <label className="field">
            <span>{t.email}</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field">
            <span>{t.password}</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <div className="form-actions">
            <StatusText>{register.isError ? t.registerFailed : ""}</StatusText>
            <Button variant="primary" onClick={() => void handleSubmit()} disabled={register.isPending || !displayName || !email || !password}>
              {register.isPending ? t.creatingAccount : t.createAccount}
            </Button>
          </div>
        </div>
        <p className="auth-card__switch">
          <Link to="/login">{t.login}</Link>
        </p>
      </div>
    </section>
  );
}
