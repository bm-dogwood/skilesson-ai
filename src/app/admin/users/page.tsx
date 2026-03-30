"use client";

// app/admin/users/page.tsx

import { useState, useMemo, useEffect } from "react";
import { Badge, Icon, fmtDuration } from "../_components";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  password?: string;
  subscription?: {
    plan: string | null;
    status: string | null;
    startDate: string | null;
    endDate: string | null;
    package?: {
      name: string;
    } | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  plan: string | null;
  sport: string | null;
  level: string | null;
  createdAt: string;
}

type ModalMode = "edit" | "add" | "delete" | null;

const ROLES = ["all", "student", "instructor", "admin"];
const PLANS = ["all", "explorer", "summit", "apex", "free"];
const EMPTY_USER: Omit<UserRow, "id" | "createdAt"> & { password?: string } = {
  name: "",
  email: "",
  role: "student",
  plan: null,
  sport: null,
  level: null,
  password: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [draft, setDraft] = useState<
    Omit<UserRow, "id" | "createdAt"> & { password?: string }
  >(EMPTY_USER);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch users on mount ──
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch users");
      }

      // Transform API response to match our UserRow format
      const formattedUsers: UserRow[] = data.users.map((user: User) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.subscription?.package?.name || null,
        sport: null, // You'll need to add this to your schema if needed
        level: null, // You'll need to add this to your schema if needed
        createdAt: new Date(user.createdAt).toISOString().split("T")[0],
      }));

      setUsers(formattedUsers);
    } catch (err: any) {
      console.error("❌ Error fetching users:", err);
      setError(err.message);
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }

  // ── Filtered list
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchPlan =
        planFilter === "all" ||
        (planFilter === "free" ? !u.plan : u.plan === planFilter);
      return matchSearch && matchRole && matchPlan;
    });
  }, [users, search, roleFilter, planFilter]);

  // ── Toast helper
  function showToast(msg: string, type: "success" | "error" = "success") {
    setToastType(type);
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  // ── Open modals
  function openEdit(u: UserRow) {
    setSelected(u);
    setDraft({
      name: u.name,
      email: u.email,
      role: u.role,
      plan: u.plan,
      sport: u.sport,
      level: u.level,
      password: "",
    });
    setModal("edit");
  }

  function openAdd() {
    setSelected(null);
    setDraft(EMPTY_USER);
    setModal("add");
  }

  function openDelete(u: UserRow) {
    setSelected(u);
    setModal("delete");
  }

  // ── API Actions
  async function saveEdit() {
    if (!selected) return;

    try {
      const updateData: any = {
        name: draft.name,
        email: draft.email,
        role: draft.role,
      };

      // Only include password if it was provided
      if (draft.password && draft.password.trim() !== "") {
        updateData.password = draft.password;
      }

      const response = await fetch(`/api/admin/users/${selected.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update user");
      }

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selected.id
            ? {
                ...u,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
              }
            : u
        )
      );

      setModal(null);
      showToast("User updated successfully", "success");
    } catch (err: any) {
      console.error("❌ Error updating user:", err);
      showToast(err.message || "Failed to update user", "error");
    }
  }

  async function saveAdd() {
    try {
      if (!draft.email || !draft.password) {
        showToast("Email and password are required", "error");
        return;
      }

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: draft.name,
          email: draft.email,
          password: draft.password,
          role: draft.role,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create user");
      }

      const newUser: UserRow = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        plan: null,
        sport: null,
        level: null,
        createdAt: new Date(data.user.createdAt).toISOString().split("T")[0],
      };

      setUsers((prev) => [newUser, ...prev]);
      setModal(null);
      showToast("User added successfully", "success");
    } catch (err: any) {
      console.error("❌ Error creating user:", err);
      showToast(err.message || "Failed to create user", "error");
    }
  }

  async function confirmDelete() {
    if (!selected) return;

    try {
      const response = await fetch(`/api/admin/users/${selected.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u.id !== selected.id));
      setModal(null);
      showToast("User deleted successfully", "success");
    } catch (err: any) {
      console.error("❌ Error deleting user:", err);
      showToast(err.message || "Failed to delete user", "error");
    }
  }

  if (loading) {
    return (
      <>
        <p className="page-eyebrow">Management</p>
        <h1 className="page-title">Users</h1>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          Loading users...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <p className="page-eyebrow">Management</p>
        <h1 className="page-title">Users</h1>
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--rose)",
          }}
        >
          Error: {error}
          <button
            onClick={fetchUsers}
            style={{ display: "block", margin: "1rem auto" }}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        /* ── Filter bar ── */
        .filter-bar {
          display: flex; align-items: center; gap: 0.75rem;
          flex-wrap: wrap; margin-bottom: 1.5rem;
        }
        .filter-bar .search-wrap { flex: 1; min-width: 200px; max-width: 300px; }
        .filter-select {
          background: rgba(255,255,255,0.04); border: 1px solid var(--border);
          border-radius: 8px; padding: 0.55rem 0.85rem;
          color: var(--snow); font-family: 'Sora', sans-serif; font-size: 0.8rem;
          outline: none; cursor: pointer; appearance: none;
          padding-right: 2rem;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 0.6rem center;
        }
        .filter-select:focus { border-color: var(--ice); }
        option { background: #1a2744; }

        .results-count {
          margin-left: auto; font-size: 0.72rem; color: var(--slate);
          white-space: nowrap;
        }

        /* ── Table extras ── */
        .avatar-cell {
          display: flex; align-items: center; gap: 0.65rem;
        }
        .avatar {
          width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.68rem; font-weight: 700; color: white;
        }

        /* ── Modal overlay ── */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center;
          z-index: 200; padding: 1rem;
          animation: fade-in 0.15s ease;
        }
        @keyframes fade-in { from { opacity:0; } to { opacity:1; } }

        .modal {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; padding: 2rem; width: 100%; max-width: 480px;
          animation: rise 0.2s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes rise { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        .modal-header { margin-bottom: 1.75rem; }
        .modal-eyebrow {
          font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--ice); margin-bottom: 0.3rem;
        }
        .modal-title {
          font-family: 'Lora', serif; font-size: 1.45rem; font-weight: 400; color: var(--snow);
        }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 1.5rem; }
        .form-grid.single { grid-template-columns: 1fr; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group.span-2 { grid-column: 1 / -1; }

        .form-label {
          font-size: 0.65rem; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--slate);
        }
        .form-input, .form-select {
          background: rgba(255,255,255,0.04); border: 1px solid var(--border);
          border-radius: 8px; padding: 0.65rem 0.85rem; color: var(--snow);
          font-family: 'Sora', sans-serif; font-size: 0.83rem; outline: none;
          transition: border-color 0.2s; width: 100%;
        }
        .form-select {
          appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 0.75rem center;
          background-color: rgba(255,255,255,0.04); padding-right: 2.25rem;
        }
        .form-input:focus, .form-select:focus { border-color: var(--ice); }
        option { background: #1a2744; }

        .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }

        /* Delete modal */
        .delete-body { margin-bottom: 1.75rem; }
        .delete-body p { font-size: 0.85rem; color: var(--muted); line-height: 1.65; }
        .delete-body strong { color: var(--snow); }
        .btn-danger { background: rgba(244,63,94,0.15); color: var(--rose);
                      border: 1px solid rgba(244,63,94,0.3); }
        .btn-danger:hover { background: rgba(244,63,94,0.25) !important; }

        /* Toast */
        .toast {
          position: fixed; bottom: 2rem; right: 2rem;
          border-radius: 10px;
          padding: 0.75rem 1.25rem;
          font-size: 0.8rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: rise 0.3s ease both;
          z-index: 300;
        }
        .toast.success {
          background: #1a3a2a;
          border: 1px solid #34d399;
          color: #34d399;
        }
        .toast.error {
          background: #3a1a2a;
          border: 1px solid #f43f5e;
          color: #f43f5e;
        }
        .toast svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2.5; }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
          .form-group.span-2 { grid-column: 1; }
          .filter-bar { gap: 0.5rem; }
          .results-count { display: none; }
        }
      `}</style>

      {/* ── Header ── */}
      <p className="page-eyebrow">Management</p>
      <h1 className="page-title">Users</h1>

      {/* ── Filter bar ── */}
      <div className="filter-bar">
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <select
          className="filter-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r === "all"
                ? "All roles"
                : r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
        >
          {PLANS.map((p) => (
            <option key={p} value={p}>
              {p === "all"
                ? "All plans"
                : p === "free"
                ? "Free (no plan)"
                : p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>

        <span className="results-count">
          {filtered.length} of {users.length} users
        </span>

        <button className="btn btn-primary" onClick={openAdd}>
          <Icon.Plus /> Add user
        </button>
      </div>

      {/* ── Table ── */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Plan</th>
              <th>Sport</th>
              <th>Level</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: "2.5rem",
                    color: "var(--slate)",
                  }}
                >
                  No users found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const avatarColor =
                  u.role === "admin"
                    ? "#f43f5e"
                    : u.role === "instructor"
                    ? "#f59e0b"
                    : "#38bdf8";
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="avatar-cell">
                        <div
                          className="avatar"
                          style={{
                            background: avatarColor + "33",
                            color: avatarColor,
                          }}
                        >
                          {(u.name ?? u.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="td-name">{u.name ?? "—"}</div>
                          <div className="td-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge value={u.role} />
                    </td>
                    <td>
                      {u.plan ? (
                        <Badge value={u.plan} />
                      ) : (
                        <span
                          style={{ color: "var(--slate)", fontSize: "0.78rem" }}
                        >
                          Free
                        </span>
                      )}
                    </td>
                    <td>
                      {u.sport ?? (
                        <span style={{ color: "var(--slate)" }}>—</span>
                      )}
                    </td>
                    <td>
                      {u.level ? (
                        <Badge value={u.level} />
                      ) : (
                        <span style={{ color: "var(--slate)" }}>—</span>
                      )}
                    </td>
                    <td>{u.createdAt}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          className="icon-btn"
                          title="Edit"
                          onClick={() => openEdit(u)}
                        >
                          <Icon.Edit />
                        </button>
                        <button
                          className="icon-btn danger"
                          title="Delete"
                          onClick={() => openDelete(u)}
                        >
                          <Icon.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ══════════ EDIT / ADD MODAL ══════════ */}
      {(modal === "edit" || modal === "add") && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="modal">
            <div className="modal-header">
              <p className="modal-eyebrow">
                {modal === "edit" ? "Edit user" : "New user"}
              </p>
              <h2 className="modal-title">
                {modal === "edit" ? selected?.name ?? "Edit" : "Add a user"}
              </h2>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input
                  className="form-input"
                  placeholder="Jane Doe"
                  value={draft.name ?? ""}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="jane@example.com"
                  value={draft.email}
                  onChange={(e) =>
                    setDraft({ ...draft, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Password{" "}
                  {modal === "add" ? "*" : "(leave blank to keep current)"}
                </label>
                <input
                  className="form-input"
                  type="password"
                  placeholder={
                    modal === "add"
                      ? "Enter password"
                      : "New password (optional)"
                  }
                  value={draft.password}
                  onChange={(e) =>
                    setDraft({ ...draft, password: e.target.value })
                  }
                  required={modal === "add"}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Plan</label>
                <select
                  className="form-select"
                  value={draft.plan ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, plan: e.target.value || null })
                  }
                >
                  <option value="">Free (no plan)</option>
                  <option value="explorer">Explorer</option>
                  <option value="summit">Summit</option>
                  <option value="apex">Apex</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sport</label>
                <select
                  className="form-select"
                  value={draft.sport ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, sport: e.target.value || null })
                  }
                >
                  <option value="">None</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Soccer">Soccer</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Track">Track</option>
                  <option value="Swimming">Swimming</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Level</label>
                <select
                  className="form-select"
                  value={draft.level ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, level: e.target.value || null })
                  }
                >
                  <option value="">None</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={modal === "edit" ? saveEdit : saveAdd}
              >
                <Icon.Save />
                {modal === "edit" ? "Save changes" : "Add user"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ DELETE MODAL ══════════ */}
      {modal === "delete" && selected && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <p className="modal-eyebrow">Confirm action</p>
              <h2 className="modal-title">Delete user?</h2>
            </div>
            <div className="delete-body">
              <p>
                You're about to permanently delete{" "}
                <strong>{selected.name ?? selected.email}</strong>. This will
                remove their account, progress, and subscription data. This
                action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                <Icon.Trash /> Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toastType}`}>
          <svg viewBox="0 0 24 24">
            {toastType === "success" ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            )}
          </svg>
          {toast}
        </div>
      )}
    </>
  );
}
