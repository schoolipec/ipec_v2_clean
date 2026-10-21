'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '../_components/AdminShell';
import { useAdminLang } from '../_components/AdminLangContext';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  mustChangePassword: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'TREASURER', 'USHER'] as const;

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: '#7c3aed',
  ADMIN: '#1565C0',
  TREASURER: '#2E7D32',
  USHER: '#b45309',
};

const PAGE_SIZE = 10;

// ─── Traducciones ──────────────────────────────────────────────────
const LABELS = {
  es: {
    loading: 'Cargando usuarios…',
    registeredUsers: (n: number) => `${n} usuario${n !== 1 ? 's' : ''} registrado${n !== 1 ? 's' : ''}`,
    sendInvitation: 'Enviar invitación',
    columns: { user: 'Usuario', role: 'Rol', status: 'Estado', lastAccess: 'Último acceso', actions: 'Acciones' },
    status: { active: 'Activo', passwordPending: 'Pendiente cambio clave' },
    never: 'Nunca',
    editRole: 'Editar rol',
    deleteTooltip: 'Eliminar usuario',
    noUsers: 'No hay usuarios registrados. Envía una invitación para comenzar.',
    pagination: { prev: 'Anterior', next: 'Siguiente', page: (c: number, t: number) => `Página ${c} de ${t}` },
    invite: {
      title: 'Invitar nuevo usuario',
      description: 'El usuario recibirá un enlace de invitación en su correo. No se establece contraseña hasta que acepte la invitación.',
      email: 'Correo electrónico', emailPlaceholder: 'correo@ejemplo.com',
      role: 'Rol', cancel: 'Cancelar', send: 'Enviar invitación', sending: 'Enviando…',
    },
    editRoleModal: { title: 'Cambiar rol', userLabel: 'Usuario:', newRole: 'Nuevo rol', cancel: 'Cancelar', save: 'Guardar', saving: 'Guardando…' },
    deleteModal: {
      title: '¿Eliminar usuario?',
      description: 'Esta acción eliminará al usuario y todas sus sesiones activas. No se puede deshacer.',
      cancel: 'Cancelar', confirm: 'Eliminar',
    },
    flash: {
      roleUpdated: 'Rol actualizado correctamente.',
      userDeleted: 'Usuario eliminado.',
      error: 'Ocurrió un error. Intenta de nuevo.',
      connectionError: 'Error de conexión.',
    },
    roles: { SUPER_ADMIN: 'Super Admin', ADMIN: 'Administrador', TREASURER: 'Tesorero', USHER: 'Ujier' },
  },
  en: {
    loading: 'Loading users…',
    registeredUsers: (n: number) => `${n} registered user${n !== 1 ? 's' : ''}`,
    sendInvitation: 'Send invitation',
    columns: { user: 'User', role: 'Role', status: 'Status', lastAccess: 'Last Access', actions: 'Actions' },
    status: { active: 'Active', passwordPending: 'Password change pending' },
    never: 'Never',
    editRole: 'Edit role',
    deleteTooltip: 'Delete user',
    noUsers: 'No users registered. Send an invitation to get started.',
    pagination: { prev: 'Previous', next: 'Next', page: (c: number, t: number) => `Page ${c} of ${t}` },
    invite: {
      title: 'Invite new user',
      description: 'The user will receive an invitation link by email. No password is set until they accept the invitation.',
      email: 'Email address', emailPlaceholder: 'email@example.com',
      role: 'Role', cancel: 'Cancel', send: 'Send invitation', sending: 'Sending…',
    },
    editRoleModal: { title: 'Change role', userLabel: 'User:', newRole: 'New role', cancel: 'Cancel', save: 'Save', saving: 'Saving…' },
    deleteModal: {
      title: 'Delete user?',
      description: 'This action will delete the user and all their active sessions. This cannot be undone.',
      cancel: 'Cancel', confirm: 'Delete',
    },
    flash: {
      roleUpdated: 'Role updated successfully.',
      userDeleted: 'User deleted.',
      error: 'An error occurred. Please try again.',
      connectionError: 'Connection error.',
    },
    roles: { SUPER_ADMIN: 'Super Admin', ADMIN: 'Administrator', TREASURER: 'Treasurer', USHER: 'Usher' },
  },
} as const;

// ─── Componente ────────────────────────────────────────────────────
// El wrapper solo monta AdminShell; el contenido real vive dentro
// para poder consumir AdminLangContext (que el Provider crea en AdminShell).
export default function AdminUsers() {
  return (
    <AdminShell>
      <UsersContent />
    </AdminShell>
  );
}

function UsersContent() {
  const lang = useAdminLang();
  const t = LABELS[lang];

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<User | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('ADMIN');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  function flash(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(''), 3500);
  }

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => {
        if (r.status === 401) { router.replace('/admin/sign-in'); return null; }
        if (r.status === 403) { router.replace('/admin'); return null; }
        return r.json();
      })
      .then(data => { if (data) setUsers(data); setLoading(false); });
  }, [router]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteError(''); setInviteMsg('');
    setInviteLoading(true);
    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteMsg(lang === 'es' ? `Invitación enviada a ${inviteEmail}` : `Invitation sent to ${inviteEmail}`);
        setInviteEmail('');
        setTimeout(() => { setShowInviteModal(false); setInviteMsg(''); }, 2500);
      } else {
        setInviteError(data.error || t.flash.error);
      }
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleEditRole(userId: string) {
    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: editRole }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: editRole } : u));
        setShowEditModal(null);
        flash(t.flash.roleUpdated);
      } else {
        const d = await res.json();
        flash(d.error || t.flash.error);
      }
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(userId: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setDeleteConfirm(null);
        flash(t.flash.userDeleted);
        const newTotal = users.length - 1;
        const totalPages = Math.max(1, Math.ceil(newTotal / PAGE_SIZE));
        if (page > totalPages) setPage(totalPages);
      } else {
        const d = await res.json();
        flash(d.error || t.flash.error);
        setDeleteConfirm(null);
      }
    } catch {
      flash(t.flash.connectionError);
      setDeleteConfirm(null);
    }
  }

  // Paginación
  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const pagedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '24px',
  };
  const modalStyle: React.CSSProperties = {
    background: '#1e293b', borderRadius: '16px', padding: '32px',
    border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '440px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', background: '#0f172a',
    border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        {t.loading}
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: '28px' }}>
        {/* Barra de acciones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            {t.registeredUsers(users.length)}
          </p>
          <button
            onClick={() => { setShowInviteModal(true); setInviteError(''); setInviteMsg(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
              border: 'none', borderRadius: '8px', color: 'white',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="10" y1="11" x2="14" y2="11"/>
            </svg>
            {t.sendInvitation}
          </button>
        </div>

        {/* Flash message */}
        {msg && (
          <div style={{
            marginBottom: '16px', padding: '11px 16px', borderRadius: '8px',
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
            color: '#22c55e', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {msg}
          </div>
        )}

        {/* Tabla de usuarios */}
        <div style={{
          background: '#1e293b', borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {[t.columns.user, t.columns.role, t.columns.status, t.columns.lastAccess, t.columns.actions].map(h => (
                  <th key={h} style={{
                    padding: '11px 16px', textAlign: 'left',
                    fontSize: '11px', fontWeight: 700, color: '#475569',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: idx < pagedUsers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  {/* Usuario */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: `${ROLE_COLORS[user.role] || '#475569'}22`,
                        color: ROLE_COLORS[user.role] || '#94a3b8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 700, flexShrink: 0,
                      }}>
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', margin: 0 }}>{user.name}</p>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Rol */}
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                      background: `${ROLE_COLORS[user.role] || '#475569'}20`,
                      color: ROLE_COLORS[user.role] || '#94a3b8',
                      border: `1px solid ${ROLE_COLORS[user.role] || '#475569'}40`,
                    }}>
                      {t.roles[user.role as keyof typeof t.roles] || user.role}
                    </span>
                  </td>

                  {/* Estado */}
                  <td style={{ padding: '13px 16px' }}>
                    {user.mustChangePassword ? (
                      <span style={{ fontSize: '12px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {t.status.passwordPending}
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {t.status.active}
                      </span>
                    )}
                  </td>

                  {/* Último acceso */}
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: '#64748b' }}>
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString(lang === 'es' ? 'es' : 'en', { day: '2-digit', month: 'short', year: 'numeric' })
                      : t.never}
                  </td>

                  {/* Acciones */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => { setShowEditModal(user); setEditRole(user.role); }}
                        title={t.editRole}
                        style={{
                          padding: '5px 11px', background: 'rgba(21,101,192,0.12)',
                          border: '1px solid rgba(21,101,192,0.25)', borderRadius: '6px',
                          color: '#60a5fa', fontSize: '12px', cursor: 'pointer', fontWeight: 600,
                        }}
                      >
                        {t.editRole}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user.id)}
                        title={t.deleteTooltip}
                        style={{
                          padding: '5px 9px', background: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.18)', borderRadius: '6px',
                          color: '#ef4444', fontSize: '12px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
              {t.noUsers}
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '7px 16px', borderRadius: '7px',
                background: page === 1 ? 'transparent' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: page === 1 ? '#334155' : '#94a3b8',
                fontSize: '13px', cursor: page === 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              {t.pagination.prev}
            </button>

            <span style={{ fontSize: '13px', color: '#64748b' }}>
              {t.pagination.page(page, totalPages)}
            </span>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '7px 16px', borderRadius: '7px',
                background: page === totalPages ? 'transparent' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: page === totalPages ? '#334155' : '#94a3b8',
                fontSize: '13px', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {t.pagination.next}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ── Modal: Invitar usuario ── */}
      {showInviteModal && (
        <div style={overlayStyle} onClick={() => setShowInviteModal(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 10px' }}>
              {t.invite.title}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
              {t.invite.description}
            </p>
            <form onSubmit={handleInvite}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  {t.invite.email}
                </label>
                <input
                  type="email" style={inputStyle}
                  value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                  placeholder={t.invite.emailPlaceholder} required autoFocus
                  onFocus={e => { e.target.style.borderColor = '#1565C0'; }}
                  onBlur={e => { e.target.style.borderColor = '#334155'; }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  {t.invite.role}
                </label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                >
                  {ROLES.filter(r => r !== 'SUPER_ADMIN').map(r => (
                    <option key={r} value={r}>{t.roles[r as keyof typeof t.roles]}</option>
                  ))}
                </select>
              </div>
              {inviteError && <p style={{ fontSize: '13px', color: '#ef4444', marginBottom: '12px' }}>{inviteError}</p>}
              {inviteMsg && <p style={{ fontSize: '13px', color: '#22c55e', marginBottom: '12px' }}>{inviteMsg}</p>}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowInviteModal(false)}
                  style={{ padding: '9px 18px', background: 'transparent', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>
                  {t.invite.cancel}
                </button>
                <button type="submit" disabled={inviteLoading}
                  style={{ padding: '9px 18px', background: inviteLoading ? '#334155' : 'linear-gradient(135deg,#1565C0 0%,#2E7D32 100%)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: 600, cursor: inviteLoading ? 'not-allowed' : 'pointer' }}>
                  {inviteLoading ? t.invite.sending : t.invite.send}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Editar rol ── */}
      {showEditModal && (
        <div style={overlayStyle} onClick={() => setShowEditModal(null)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>
              {t.editRoleModal.title}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px' }}>
              {t.editRoleModal.userLabel} <strong style={{ color: '#f1f5f9' }}>{showEditModal.email}</strong>
            </p>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                {t.editRoleModal.newRole}
              </label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={editRole} onChange={e => setEditRole(e.target.value)}>
                {ROLES.map(r => (
                  <option key={r} value={r}>{t.roles[r as keyof typeof t.roles]}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowEditModal(null)}
                style={{ padding: '9px 18px', background: 'transparent', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>
                {t.editRoleModal.cancel}
              </button>
              <button onClick={() => handleEditRole(showEditModal.id)} disabled={editLoading}
                style={{ padding: '9px 18px', background: editLoading ? '#334155' : '#1565C0', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: 600, cursor: editLoading ? 'not-allowed' : 'pointer' }}>
                {editLoading ? t.editRoleModal.saving : t.editRoleModal.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Confirmar eliminación ── */}
      {deleteConfirm && (
        <div style={overlayStyle} onClick={() => setDeleteConfirm(null)}>
          <div style={{ ...modalStyle, maxWidth: '380px' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(239,68,68,0.12)', color: '#ef4444',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>
                {t.deleteModal.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                {t.deleteModal.description}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '11px', background: 'transparent', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>
                {t.deleteModal.cancel}
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                style={{ flex: 1, padding: '11px', background: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                {t.deleteModal.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </>
  );
}
