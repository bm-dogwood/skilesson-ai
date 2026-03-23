"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      isAdminLogin: true,
    });

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    if (session?.user?.role !== "admin") {
      setError("You are not authorized as an administrator.");
      setIsLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        :root {
          --navy:   #0f172a;
          --snow:   #f8fafc;
          --ice:    #38bdf8;
          --powder: #7dd3fc;
          --slate:  #475569;
          --gold:   #f59e0b;
          --rose:   #f43f5e;
          --emerald:#10b981;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .root {
          min-height: 100vh;
          background: var(--navy);
          display: flex;
          align-items: stretch;
          font-family: 'Sora', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Ambient glows */
        .root::before {
          content: '';
          position: fixed;
          top: -15%;
          right: -8%;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 65%);
          pointer-events: none;
        }
        .root::after {
          content: '';
          position: fixed;
          bottom: -10%;
          left: -5%;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 65%);
          pointer-events: none;
        }

        /* ── LEFT PANEL ── */
        .panel-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem 3.5rem;
          border-right: 1px solid rgba(71,85,105,0.25);
          position: relative;
        }

        .brand { display: flex; align-items: center; gap: 0.75rem; }
        .brand-shield {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--rose), #c2185b);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .brand-shield svg { width: 16px; height: 16px; fill: white; }
        .brand-name {
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--slate);
        }

        .left-body {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; padding: 2rem 0;
        }

        .left-tag {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(244,63,94,0.08);
          border: 1px solid rgba(244,63,94,0.2);
          border-radius: 100px; padding: 0.3rem 0.85rem;
          margin-bottom: 2rem; width: fit-content;
        }
        .left-tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--rose);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.75); }
        }
        .left-tag-text {
          font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--rose);
        }

        .left-headline {
          font-family: 'Lora', serif;
          font-size: clamp(2rem, 3vw, 2.75rem);
          font-weight: 400; line-height: 1.2;
          color: var(--snow); margin-bottom: 1.25rem;
        }
        .left-headline em { font-style: italic; color: var(--rose); }

        .left-desc {
          font-size: 0.875rem; font-weight: 300; color: var(--slate);
          line-height: 1.75; max-width: 340px; margin-bottom: 3rem;
        }

        /* Access level cards */
        .access-list { display: flex; flex-direction: column; gap: 0.6rem; }

        .access-card {
          display: flex; align-items: center; gap: 0.85rem;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(71,85,105,0.2);
          border-radius: 10px;
          transition: border-color 0.2s;
        }
        .access-card:hover { border-color: rgba(71,85,105,0.4); }

        .access-icon {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .access-icon svg { width: 14px; height: 14px; }

        .access-icon.red    { background: rgba(244,63,94,0.1);  }
        .access-icon.red svg    { stroke: var(--rose);    fill: none; stroke-width: 1.75; }
        .access-icon.gold   { background: rgba(245,158,11,0.1); }
        .access-icon.gold svg   { stroke: var(--gold);   fill: none; stroke-width: 1.75; }
        .access-icon.green  { background: rgba(16,185,129,0.1); }
        .access-icon.green svg  { stroke: var(--emerald); fill: none; stroke-width: 1.75; }

        .access-info { flex: 1; }
        .access-label { font-size: 0.78rem; font-weight: 500; color: var(--snow); opacity: 0.8; }
        .access-desc  { font-size: 0.68rem; color: var(--slate); margin-top: 0.1rem; }
        .access-badge {
          font-size: 0.62rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 0.2rem 0.55rem; border-radius: 5px;
        }
        .access-badge.full     { background: rgba(244,63,94,0.12);  color: var(--rose);    }
        .access-badge.limited  { background: rgba(245,158,11,0.12); color: var(--gold);   }
        .access-badge.readonly { background: rgba(16,185,129,0.12); color: var(--emerald); }

        /* Stats */
        .stats-row {
          display: flex; gap: 2rem; padding-top: 2.5rem;
          border-top: 1px solid rgba(71,85,105,0.15);
        }
        .stat { display: flex; flex-direction: column; gap: 0.2rem; }
        .stat-val {
          font-family: 'Lora', serif; font-size: 1.6rem;
          color: var(--snow); font-weight: 400;
        }
        .stat-lbl {
          font-size: 0.68rem; color: var(--slate);
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        /* ── RIGHT PANEL ── */
        .panel-right {
          width: 480px; display: flex;
          align-items: center; justify-content: center;
          padding: 3rem 3.5rem; flex-shrink: 0;
        }

        .form-card {
          width: 100%;
          animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .form-header { margin-bottom: 2.5rem; }
        .form-eyebrow {
          font-size: 0.68rem; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--rose); margin-bottom: 0.6rem;
        }
        .form-title {
          font-family: 'Lora', serif; font-size: 2rem;
          font-weight: 400; color: var(--snow); margin-bottom: 0.4rem;
        }
        .form-sub { font-size: 0.83rem; color: var(--slate); font-weight: 300; }

        /* Warning banner */
        .warn-banner {
          display: flex; align-items: flex-start; gap: 0.65rem;
          background: rgba(245,158,11,0.07);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 10px; padding: 0.8rem 1rem;
          margin-bottom: 1.75rem;
        }
        .warn-banner svg {
          width: 15px; height: 15px; stroke: var(--gold);
          fill: none; stroke-width: 2; flex-shrink: 0; margin-top: 1px;
        }
        .warn-banner p {
          font-size: 0.75rem; color: var(--gold);
          font-weight: 400; line-height: 1.55;
          opacity: 0.9;
        }

        .field { margin-bottom: 1.1rem; }
        .field-label {
          display: block; font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--slate); margin-bottom: 0.5rem;
        }
        .field-wrap { position: relative; }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(71,85,105,0.3);
          border-radius: 10px;
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          color: var(--snow);
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem; font-weight: 300;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .field-input::placeholder { color: rgba(71,85,105,0.6); }
        .field-input:focus {
          border-color: var(--rose);
          background: rgba(244,63,94,0.04);
          box-shadow: 0 0 0 3px rgba(244,63,94,0.1);
        }
        .field-icon {
          position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
          width: 15px; height: 15px; stroke: var(--slate); fill: none;
          stroke-width: 1.75; pointer-events: none; transition: stroke 0.2s;
        }
        .field-wrap:focus-within .field-icon { stroke: var(--rose); }

        /* Error */
        .error-msg {
          display: flex; align-items: center; gap: 0.55rem;
          background: rgba(244,63,94,0.08);
          border: 1px solid rgba(244,63,94,0.25);
          border-radius: 10px; padding: 0.75rem 1rem;
          margin-bottom: 1.1rem;
          animation: shake 0.3s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%,75%  { transform: translateX(-4px); }
          50%      { transform: translateX(4px); }
        }
        .error-msg svg { width: 14px; height: 14px; stroke: var(--rose); fill: none; stroke-width: 2; flex-shrink: 0; }
        .error-msg span { font-size: 0.8rem; color: var(--rose); font-weight: 400; }

        /* Divider */
        .sep { display: flex; align-items: center; gap: 1rem; margin: 1.75rem 0; }
        .sep-line { flex: 1; height: 1px; background: rgba(71,85,105,0.2); }
        .sep-text {
          font-size: 0.68rem; color: var(--slate);
          letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;
        }

        /* CTA */
        .cta-btn {
          width: 100%; display: flex; align-items: center;
          justify-content: center; gap: 0.6rem;
          background: linear-gradient(135deg, var(--rose), #c2185b);
          border: none; border-radius: 10px; padding: 0.95rem;
          color: white; font-family: 'Sora', sans-serif;
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          position: relative; overflow: hidden;
        }
        .cta-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1));
          pointer-events: none;
        }
        .cta-btn:hover:not(:disabled) {
          opacity: 0.9; transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(244,63,94,0.3);
        }
        .cta-btn:active:not(:disabled) { transform: translateY(0); }
        .cta-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .form-footer {
          margin-top: 1.75rem; text-align: center;
          font-size: 0.72rem; color: rgba(71,85,105,0.5); line-height: 1.6;
        }
        .form-footer strong { color: var(--slate); font-weight: 500; }

        @media (max-width: 900px) {
          .panel-left  { display: none; }
          .panel-right { width: 100%; padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="root">
        {/* ── Left panel ── */}
        <div className="panel-left">
          <div className="brand">
            <div className="brand-shield">
              <svg viewBox="0 0 24 24">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
              </svg>
            </div>
            <span className="brand-name">Admin Portal</span>
          </div>

          <div className="left-body">
            <div className="left-tag">
              <span className="left-tag-dot" />
              <span className="left-tag-text">Restricted access</span>
            </div>

            <h2 className="left-headline">
              Full control,
              <br />
              full <em>responsibility</em>
            </h2>

            <p className="left-desc">
              Manage users, content, pricing, and platform settings. Every
              action is logged and audited.
            </p>

            <div className="access-list">
              <div className="access-card">
                <div className="access-icon red">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2L2 9l10 13L22 9z" />
                  </svg>
                </div>
                <div className="access-info">
                  <div className="access-label">Super Admin</div>
                  <div className="access-desc">
                    Platform-wide control, billing, roles
                  </div>
                </div>
                <span className="access-badge full">Full</span>
              </div>

              <div className="access-card">
                <div className="access-icon gold">
                  <svg viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="access-info">
                  <div className="access-label">User Manager</div>
                  <div className="access-desc">
                    Manage accounts, roles, subscriptions
                  </div>
                </div>
                <span className="access-badge limited">Limited</span>
              </div>

              <div className="access-card">
                <div className="access-icon green">
                  <svg viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <div className="access-info">
                  <div className="access-label">Content Reviewer</div>
                  <div className="access-desc">
                    View and moderate lessons only
                  </div>
                </div>
                <span className="access-badge readonly">Read-only</span>
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat">
              <span className="stat-val">12k+</span>
              <span className="stat-lbl">Users</span>
            </div>
            <div className="stat">
              <span className="stat-val">296</span>
              <span className="stat-lbl">Lessons</span>
            </div>
            <div className="stat">
              <span className="stat-val">$48k</span>
              <span className="stat-lbl">MRR</span>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="panel-right">
          <div className="form-card">
            <div className="form-header">
              <p className="form-eyebrow">Administrator access</p>
              <h1 className="form-title">Sign in</h1>
              <p className="form-sub">Authorized personnel only</p>
            </div>

            <div className="warn-banner">
              <svg viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p>
                This portal is for administrators only. Unauthorized access
                attempts are logged and reported.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="field">
                <label className="field-label" htmlFor="email">
                  Email address
                </label>
                <div className="field-wrap">
                  <input
                    id="email"
                    className="field-input"
                    type="email"
                    placeholder="admin@platform.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <svg className="field-icon" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 8l10 6 10-6" />
                  </svg>
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <div className="field-wrap">
                  <input
                    id="password"
                    className="field-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <svg className="field-icon" viewBox="0 0 24 24">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 1 1 8 0v4" />
                  </svg>
                </div>
              </div>

              <div className="sep">
                <span className="sep-line" />
                <span className="sep-text">secure · encrypted</span>
                <span className="sep-line" />
              </div>

              {error && (
                <div className="error-msg">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button className="cta-btn" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner" /> Authenticating…
                  </>
                ) : (
                  "Access admin panel"
                )}
              </button>
            </form>

            <p className="form-footer">
              <strong>Admin access only</strong> · All sessions are audited
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
