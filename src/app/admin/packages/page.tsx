"use client";

import { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  TagIcon,
  CubeIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface Package {
  id: string;
  name: string;
  tier: string;
  priceMonthly: number;
  priceYearly: number;
  isActive: boolean;
}

const TIER_COLORS: Record<
  string,
  { bg: string; text: string; border: string; glow: string }
> = {
  explorer: {
    bg: "rgba(56,189,248,0.08)",
    text: "#38bdf8",
    border: "rgba(56,189,248,0.2)",
    glow: "rgba(56,189,248,0.15)",
  },
  summit: {
    bg: "rgba(245,158,11,0.08)",
    text: "#f59e0b",
    border: "rgba(245,158,11,0.2)",
    glow: "rgba(245,158,11,0.15)",
  },
  apex: {
    bg: "rgba(244,63,94,0.08)",
    text: "#f43f5e",
    border: "rgba(244,63,94,0.2)",
    glow: "rgba(244,63,94,0.15)",
  },
};

function getTierStyle(tier: string) {
  return (
    TIER_COLORS[tier?.toLowerCase()] ?? {
      bg: "rgba(71,85,105,0.15)",
      text: "#94a3b8",
      border: "rgba(71,85,105,0.3)",
      glow: "rgba(71,85,105,0.1)",
    }
  );
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Package | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    tier: "",
    priceMonthly: 0,
    priceYearly: 0,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  async function fetchPackages() {
    const res = await fetch("/api/admin/packages");
    const data = await res.json();
    setPackages(data.packages);
    setLoading(false);
  }

  function openAdd() {
    setForm({ name: "", tier: "", priceMonthly: 0, priceYearly: 0 });
    setSelected(null);
    setModal("add");
  }

  function openEdit(pkg: Package) {
    setSelected(pkg);
    setForm({
      name: pkg.name,
      tier: pkg.tier,
      priceMonthly: pkg.priceMonthly,
      priceYearly: pkg.priceYearly,
    });
    setModal("edit");
  }

  async function save() {
    setSaving(true);
    const method = modal === "edit" ? "PUT" : "POST";
    const url =
      modal === "edit"
        ? `/api/admin/packages/${selected?.id}`
        : "/api/admin/packages";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await fetchPackages();
      setModal(null);
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (confirm("Delete this package? This cannot be undone.")) {
      await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      fetchPackages();
    }
  }

  const STAT_CARDS = [
    {
      label: "Total Packages",
      value: packages.length,
      icon: CubeIcon,
      color: "#38bdf8",
    },
    {
      label: "Active Plans",
      value: packages.filter((p) => p.isActive).length,
      icon: CheckCircleIcon,
      color: "#34d399",
    },
    {
      label: "Avg Monthly Price",
      value: `$${
        packages.length
          ? (
              packages.reduce((s, p) => s + p.priceMonthly, 0) / packages.length
            ).toFixed(0)
          : "0"
      }`,
      icon: CurrencyDollarIcon,
      color: "#f59e0b",
    },
    {
      label: "Unique Tiers",
      value: new Set(packages.map((p) => p.tier)).size,
      icon: TagIcon,
      color: "#f43f5e",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        :root {
          --navy:   #0f172a;
          --surface:#141f35;
          --card:   #1a2744;
          --border: rgba(71,85,105,0.25);
          --snow:   #f8fafc;
          --muted:  #94a3b8;
          --slate:  #475569;
          --ice:    #38bdf8;
          --gold:   #f59e0b;
          --rose:   #f43f5e;
          --green:  #34d399;
        }

        .pkg-page * { box-sizing: border-box; font-family: 'Sora', sans-serif; }

        /* ── Stat cards ── */
        .pkg-stat-grid {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 0.9rem; margin-bottom: 2rem;
        }
        .pkg-stat {
          background: var(--card); border: 1px solid var(--border); border-radius: 14px;
          padding: 1.25rem 1.4rem; position: relative; overflow: hidden;
          transition: border-color 0.2s, transform 0.15s;
        }
        .pkg-stat:hover { transform: translateY(-2px); }
        .pkg-stat::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(56,189,248,0.03) 0%, transparent 60%);
          pointer-events:none;
        }
        .pkg-stat-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.8rem; }
        .pkg-stat-icon {
          width:32px; height:32px; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
        }
        .pkg-stat-icon svg { width:15px; height:15px; }
        .pkg-stat-val { font-family:'Lora',serif; font-size:1.7rem; font-weight:400; color:var(--snow); line-height:1; }
        .pkg-stat-lbl { font-size:0.67rem; color:var(--muted); font-weight:500; margin-top:0.25rem; letter-spacing:0.04em; }

        /* ── Table ── */
        .pkg-table-wrap {
          background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
        }
        .pkg-table-toolbar {
          display:flex; align-items:center; justify-content:space-between;
          padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border);
        }
        .pkg-table-title { font-size:0.7rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted); }

        .pkg-table { width:100%; border-collapse:collapse; }
        .pkg-table thead th {
          padding:0.75rem 1.5rem; text-align:left;
          font-size:0.62rem; letter-spacing:0.14em; text-transform:uppercase;
          color:var(--slate); border-bottom:1px solid var(--border); font-weight:600;
        }
        .pkg-table tbody tr { border-bottom: 1px solid rgba(71,85,105,0.12); transition: background 0.15s; }
        .pkg-table tbody tr:last-child { border-bottom:none; }
        .pkg-table tbody tr:hover { background: rgba(56,189,248,0.03); }
        .pkg-table tbody td { padding:1rem 1.5rem; font-size:0.8rem; color:var(--muted); vertical-align:middle; }

        /* Package name cell */
        .pkg-name-cell { display:flex; align-items:center; gap:0.75rem; }
        .pkg-avatar {
          width:36px; height:36px; border-radius:9px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          border:1px solid;
        }
        .pkg-avatar svg { width:15px; height:15px; }
        .pkg-name-text { color:var(--snow); font-weight:500; font-size:0.82rem; }

        /* Tier badge */
        .tier-badge {
          display:inline-flex; align-items:center;
          padding:0.22rem 0.65rem; border-radius:6px; border:1px solid;
          font-size:0.66rem; font-weight:600; letter-spacing:0.08em; text-transform:capitalize;
        }

        /* Status pill */
        .status-pill {
          display:inline-flex; align-items:center; gap:0.35rem;
          padding:0.22rem 0.65rem; border-radius:20px;
          font-size:0.66rem; font-weight:600; letter-spacing:0.06em;
        }
        .status-pill .dot { width:5px; height:5px; border-radius:50%; }
        .status-pill.active   { background:rgba(52,211,153,0.1); color:#34d399; }
        .status-pill.inactive { background:rgba(71,85,105,0.15); color:var(--slate); }

        /* Price cell */
        .price-main { color:var(--snow); font-weight:600; font-size:0.82rem; }
        .price-sub  { color:var(--slate); font-size:0.62rem; margin-top:0.1rem; }

        /* Action buttons */
        .pkg-actions { display:flex; align-items:center; gap:0.5rem; }
        .pkg-btn {
          display:inline-flex; align-items:center; gap:0.35rem;
          padding:0.38rem 0.75rem; border-radius:7px; font-size:0.7rem; font-weight:500;
          border:1px solid var(--border); background:rgba(255,255,255,0.04);
          color:var(--muted); cursor:pointer; transition:all 0.15s;
          font-family:'Sora',sans-serif;
        }
        .pkg-btn svg { width:12px; height:12px; }
        .pkg-btn:hover { border-color:var(--ice); color:var(--ice); background:rgba(56,189,248,0.06); }
        .pkg-btn.danger:hover { border-color:var(--rose); color:var(--rose); background:rgba(244,63,94,0.06); }

        /* Add button */
        .pkg-add-btn {
          display:inline-flex; align-items:center; gap:0.45rem;
          padding:0.6rem 1.1rem; border-radius:9px;
          background:var(--ice); color:var(--navy);
          font-family:'Sora',sans-serif; font-size:0.78rem; font-weight:600;
          border:none; cursor:pointer; transition:opacity 0.15s, transform 0.1s;
        }
        .pkg-add-btn:hover { opacity:0.9; transform:translateY(-1px); }
        .pkg-add-btn svg { width:14px; height:14px; }

        /* Loading */
        .pkg-loading {
          display:flex; align-items:center; justify-content:center;
          min-height:300px; color:var(--muted); font-size:0.82rem; gap:0.75rem;
        }
        .spinner {
          width:20px; height:20px; border:2px solid var(--border);
          border-top-color:var(--ice); border-radius:50%; animation:spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform:rotate(360deg); } }

        /* Empty state */
        .pkg-empty {
          text-align:center; padding:3.5rem 2rem;
          color:var(--muted); font-size:0.82rem;
        }
        .pkg-empty-icon {
          width:48px; height:48px; margin:0 auto 1rem;
          background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.15);
          border-radius:14px; display:flex; align-items:center; justify-content:center;
        }
        .pkg-empty-icon svg { width:22px; height:22px; stroke:var(--ice); }
        .pkg-empty h3 { color:var(--snow); font-size:0.95rem; font-weight:500; margin:0 0 0.35rem; }

        /* ── Modal ── */
        .modal-overlay {
          position:fixed; inset:0; background:rgba(0,0,0,0.65);
          display:flex; align-items:center; justify-content:center; z-index:50; padding:1rem;
          backdrop-filter:blur(4px);
          animation: fadein 0.15s ease;
        }
        @keyframes fadein { from { opacity:0; } to { opacity:1; } }

        .modal-box {
          background:var(--card); border:1px solid var(--border); border-radius:18px;
          max-width:440px; width:100%; overflow:hidden;
          animation: slidein 0.2s ease;
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
        }
        @keyframes slidein { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

        .modal-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:1.35rem 1.5rem; border-bottom:1px solid var(--border);
        }
        .modal-title { font-family:'Lora',serif; font-size:1.1rem; font-weight:400; color:var(--snow); }
        .modal-close {
          background:rgba(255,255,255,0.05); border:1px solid var(--border);
          border-radius:7px; padding:0.35rem; cursor:pointer; color:var(--muted);
          display:flex; align-items:center; transition:all 0.15s;
        }
        .modal-close:hover { border-color:var(--rose); color:var(--rose); }
        .modal-close svg { width:15px; height:15px; }

        .modal-body { padding:1.5rem; display:flex; flex-direction:column; gap:1.1rem; }

        .field-label {
          display:block; font-size:0.67rem; font-weight:600;
          letter-spacing:0.1em; text-transform:uppercase;
          color:var(--muted); margin-bottom:0.45rem;
        }
        .field-input {
          width:100%; padding:0.65rem 0.9rem;
          background:rgba(255,255,255,0.04); border:1px solid var(--border);
          border-radius:9px; color:var(--snow);
          font-family:'Sora',sans-serif; font-size:0.82rem;
          outline:none; transition:border-color 0.15s;
        }
        .field-input::placeholder { color:var(--slate); }
        .field-input:focus { border-color:var(--ice); }
        .field-input[type=number] { appearance:textfield; }

        .field-row { display:grid; grid-template-columns:1fr 1fr; gap:0.9rem; }

        .modal-footer {
          display:flex; gap:0.75rem;
          padding:1.25rem 1.5rem; border-top:1px solid var(--border);
          background:rgba(0,0,0,0.15);
        }
        .modal-save {
          flex:1; padding:0.7rem;
          background:var(--ice); color:var(--navy);
          font-family:'Sora',sans-serif; font-size:0.78rem; font-weight:600;
          border:none; border-radius:9px; cursor:pointer;
          transition:opacity 0.15s; display:flex; align-items:center; justify-content:center; gap:0.4rem;
        }
        .modal-save:hover { opacity:0.9; }
        .modal-save:disabled { opacity:0.5; cursor:not-allowed; }
        .modal-cancel {
          flex:1; padding:0.7rem;
          background:rgba(255,255,255,0.05); color:var(--muted);
          border:1px solid var(--border); border-radius:9px;
          font-family:'Sora',sans-serif; font-size:0.78rem; font-weight:500;
          cursor:pointer; transition:all 0.15s;
        }
        .modal-cancel:hover { border-color:var(--slate); color:var(--snow); }

        @media(max-width:900px) { .pkg-stat-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:600px) { .pkg-stat-grid { grid-template-columns:1fr 1fr; } }
      `}</style>

      <div className="pkg-page">
        {/* ── Header ── */}
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ice)",
            marginBottom: "0.35rem",
          }}
        >
          Configuration
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontFamily: "'Lora',serif",
              fontSize: "1.9rem",
              fontWeight: 400,
              color: "var(--snow)",
              margin: 0,
            }}
          >
            Package Manager
          </h1>
          <button className="pkg-add-btn" onClick={openAdd}>
            <PlusIcon style={{ width: 14, height: 14 }} />
            New Package
          </button>
        </div>

        {/* ── Stat cards ── */}
        <div className="pkg-stat-grid">
          {STAT_CARDS.map((s) => (
            <div
              className="pkg-stat"
              key={s.label}
              style={{ borderColor: `rgba(71,85,105,0.25)` }}
            >
              <div className="pkg-stat-top">
                <div
                  className="pkg-stat-icon"
                  style={{
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}30`,
                  }}
                >
                  <s.icon style={{ width: 15, height: 15, stroke: s.color }} />
                </div>
              </div>
              <div className="pkg-stat-val">{s.value}</div>
              <div className="pkg-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="pkg-table-wrap">
          <div className="pkg-table-toolbar">
            <span className="pkg-table-title">All Packages</span>
            <span style={{ fontSize: "0.7rem", color: "var(--slate)" }}>
              {packages.length} plan{packages.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="pkg-loading">
              <div className="spinner" />
              Loading packages…
            </div>
          ) : packages.length === 0 ? (
            <div className="pkg-empty">
              <div className="pkg-empty-icon">
                <CubeIcon />
              </div>
              <h3>No packages yet</h3>
              <p>Create your first subscription plan to get started.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="pkg-table">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>Tier</th>
                    <th>Monthly</th>
                    <th>Yearly</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((p) => {
                    const t = getTierStyle(p.tier);
                    return (
                      <tr key={p.id}>
                        {/* Name */}
                        <td>
                          <div className="pkg-name-cell">
                            <div
                              className="pkg-avatar"
                              style={{
                                background: t.bg,
                                borderColor: t.border,
                              }}
                            >
                              <SparklesIcon
                                style={{
                                  width: 15,
                                  height: 15,
                                  stroke: t.text,
                                }}
                              />
                            </div>
                            <span className="pkg-name-text">{p.name}</span>
                          </div>
                        </td>

                        {/* Tier */}
                        <td>
                          <span
                            className="tier-badge"
                            style={{
                              background: t.bg,
                              color: t.text,
                              borderColor: t.border,
                            }}
                          >
                            {p.tier || "—"}
                          </span>
                        </td>

                        {/* Monthly price */}
                        <td>
                          <div className="price-main">${p.priceMonthly}</div>
                          <div className="price-sub">/ month</div>
                        </td>

                        {/* Yearly price */}
                        <td>
                          <div className="price-main">${p.priceYearly}</div>
                          <div className="price-sub">/ year</div>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={`status-pill ${
                              p.isActive ? "active" : "inactive"
                            }`}
                          >
                            <span
                              className="dot"
                              style={{
                                background: p.isActive
                                  ? "#34d399"
                                  : "var(--slate)",
                              }}
                            />
                            {p.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="pkg-actions">
                            <button
                              className="pkg-btn"
                              onClick={() => openEdit(p)}
                            >
                              <PencilIcon style={{ width: 12, height: 12 }} />
                              Edit
                            </button>
                            <button
                              className="pkg-btn danger"
                              onClick={() => remove(p.id)}
                            >
                              <TrashIcon style={{ width: 12, height: 12 }} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="modal-box">
            <div className="modal-header">
              <span className="modal-title">
                {modal === "edit" ? "Edit Package" : "New Package"}
              </span>
              <button className="modal-close" onClick={() => setModal(null)}>
                <XMarkIcon style={{ width: 15, height: 15 }} />
              </button>
            </div>

            <div className="modal-body">
              <div>
                <label className="field-label">Package Name</label>
                <input
                  className="field-input"
                  placeholder="e.g., Explorer Plan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label">Tier</label>
                <input
                  className="field-input"
                  placeholder="explorer · summit · apex"
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                />
              </div>

              <div className="field-row">
                <div>
                  <label className="field-label">Monthly Price ($)</label>
                  <input
                    type="number"
                    className="field-input"
                    placeholder="0"
                    value={form.priceMonthly}
                    onChange={(e) =>
                      setForm({ ...form, priceMonthly: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="field-label">Yearly Price ($)</label>
                  <input
                    type="number"
                    className="field-input"
                    placeholder="0"
                    value={form.priceYearly}
                    onChange={(e) =>
                      setForm({ ...form, priceYearly: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-save" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save Package"}
              </button>
              <button className="modal-cancel" onClick={() => setModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
