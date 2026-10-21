'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '../_components/AdminShell';
import { useAdminLang } from '../_components/AdminLangContext';

type PrayerRequest = {
  id: string;
  name: string;
  request: string;
  createdAt: string;
  readAt: string | null;
  prayedAt: string | null;
  source: string;
};

const LABELS = {
  es: {
    loading: 'Cargando peticiones…',
    btnUpdate: 'Actualizar',
    btnExport: 'Exportar CSV',
    btnPrint: 'Vista de impresión',
    searchPlaceholder: 'Buscar por nombre o petición…',
    statusAll: 'Todas',
    statusNew: 'Nueva',
    statusRead: 'Leída',
    statusPrayed: 'Orada',
    labelFrom: 'Desde (UTC)',
    labelTo: 'Hasta (UTC)',
    btnApplyFilters: 'Aplicar filtros',
    colName: 'Nombre',
    colRequest: 'Petición',
    colStatus: 'Estado',
    colDate: 'Fecha (UTC)',
    colActions: 'Acciones',
    badgeNew: 'NUEVA',
    badgeRead: 'LEÍDA',
    badgePrayed: 'ORADA',
    actionViewDetail: 'Ver detalle',
    actionMarkPresented: 'Marcar presentada',
    noRequests: 'No hay peticiones de oración.',
    noRequestsFilter: 'No hay peticiones con estos filtros.',
    prev: 'Anterior',
    next: 'Siguiente',
    pageOf: (current: number, total: number) => `Página ${current} de ${total}`,
    modalTitle: 'Detalle de petición',
    modalName: 'Nombre',
    modalDate: 'Fecha',
    modalStatus: 'Estado',
    modalRequest: 'Petición',
    btnMarkPrayed: 'Marcar orada',
    btnUnmark: 'Desmarcar',
    btnDelete: 'Eliminar',
    btnClose: 'Cerrar',
    deleteConfirmTitle: '¿Eliminar petición?',
    deleteConfirmDesc: 'Esta acción no se puede deshacer.',
    cancel: 'Cancelar',
    confirm: 'Eliminar',
    flashDeleted: 'Petición eliminada.',
    flashPrayed: 'Marcada como orada.',
    flashUnmarked: 'Desmarcada.',
    flashError: 'Ocurrió un error.',
  },
  en: {
    loading: 'Loading requests…',
    btnUpdate: 'Refresh',
    btnExport: 'Export CSV',
    btnPrint: 'Print View',
    searchPlaceholder: 'Search by name or request…',
    statusAll: 'All',
    statusNew: 'New',
    statusRead: 'Read',
    statusPrayed: 'Prayed',
    labelFrom: 'From (UTC)',
    labelTo: 'To (UTC)',
    btnApplyFilters: 'Apply filters',
    colName: 'Name',
    colRequest: 'Request',
    colStatus: 'Status',
    colDate: 'Date (UTC)',
    colActions: 'Actions',
    badgeNew: 'NEW',
    badgeRead: 'READ',
    badgePrayed: 'PRAYED',
    actionViewDetail: 'View detail',
    actionMarkPresented: 'Mark presented',
    noRequests: 'No prayer requests yet.',
    noRequestsFilter: 'No requests match these filters.',
    prev: 'Previous',
    next: 'Next',
    pageOf: (current: number, total: number) => `Page ${current} of ${total}`,
    modalTitle: 'Request detail',
    modalName: 'Name',
    modalDate: 'Date',
    modalStatus: 'Status',
    modalRequest: 'Request',
    btnMarkPrayed: 'Mark prayed',
    btnUnmark: 'Unmark',
    btnDelete: 'Delete',
    btnClose: 'Close',
    deleteConfirmTitle: 'Delete request?',
    deleteConfirmDesc: 'This action cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Delete',
    flashDeleted: 'Request deleted.',
    flashPrayed: 'Marked as prayed.',
    flashUnmarked: 'Unmarked.',
    flashError: 'An error occurred.',
  },
} as const;

const PAGE_SIZE = 15;

export default function AdminPrayerRequests() {
  return (
    <AdminShell>
      <PrayerContent />
    </AdminShell>
  );
}

function PrayerContent() {
  const lang = useAdminLang();
  const t = LABELS[lang];
  const router = useRouter();

  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Campos de filtro (pendientes de aplicar)
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'prayed'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filtros aplicados (los que realmente se usan en la tabla)
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedStatus, setAppliedStatus] = useState<'all' | 'new' | 'read' | 'prayed'>('all');
  const [appliedFrom, setAppliedFrom] = useState('');
  const [appliedTo, setAppliedTo] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Modales
  const [detailModal, setDetailModal] = useState<PrayerRequest | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function flash(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  }

  const loadRequests = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/prayer-requests')
      .then(r => {
        if (r.status === 401) { router.replace('/admin/sign-in'); return null; }
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) setRequests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  function applyFilters() {
    setAppliedSearch(search);
    setAppliedStatus(statusFilter);
    setAppliedFrom(dateFrom);
    setAppliedTo(dateTo);
    setCurrentPage(1);
  }

  // Calcular filas filtradas
  const filtered = requests.filter(r => {
    if (appliedStatus === 'new' && (r.readAt || r.prayedAt)) return false;
    if (appliedStatus === 'read' && (!r.readAt || r.prayedAt)) return false;
    if (appliedStatus === 'prayed' && !r.prayedAt) return false;
    if (appliedSearch) {
      const q = appliedSearch.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.request.toLowerCase().includes(q)) return false;
    }
    if (appliedFrom) {
      if (new Date(r.createdAt) < new Date(appliedFrom + 'T00:00:00Z')) return false;
    }
    if (appliedTo) {
      if (new Date(r.createdAt) > new Date(appliedTo + 'T23:59:59Z')) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // --- Acciones ---

  function exportCSV() {
    const headers = ['ID', 'Nombre', 'Peticion', 'Estado', 'Fecha'];
    const rows = filtered.map(r => {
      const status = r.prayedAt ? 'Orada' : r.readAt ? 'Leida' : 'Nueva';
      return [
        r.id,
        r.name.replace(/"/g, '""'),
        r.request.replace(/"/g, '""').replace(/\n/g, ' '),
        status,
        new Date(r.createdAt).toISOString(),
      ];
    });
    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `peticiones-oracion-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function openPrintView() {
    const filterParam =
      appliedStatus === 'prayed' ? 'oradas' :
      appliedStatus === 'read' ? 'leidas' :
      appliedStatus === 'new' ? 'nuevas' : 'todas';
    window.open(`/admin/prayer-requests/print?filter=${filterParam}`, '_blank');
  }

  async function handleMarkRead(req: PrayerRequest) {
    if (!req.readAt) {
      try {
        const res = await fetch(`/api/admin/prayer-requests/${req.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markRead: true }),
        });
        if (res.ok) {
          const updated = await res.json();
          setRequests(prev => prev.map(r => r.id === req.id ? updated : r));
          setDetailModal(prev => prev?.id === req.id ? updated : prev);
        }
      } catch { /* silencioso */ }
    }
  }

  async function handleTogglePrayed(id: string, currentlyPrayed: boolean) {
    try {
      const res = await fetch(`/api/admin/prayer-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentlyPrayed ? { unmarkPrayed: true } : { markPrayed: true }),
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests(prev => prev.map(r => r.id === id ? updated : r));
        setDetailModal(prev => prev?.id === id ? updated : prev);
        flash(currentlyPrayed ? t.flashUnmarked : t.flashPrayed);
      } else {
        flash(t.flashError);
      }
    } catch { flash(t.flashError); }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/prayer-requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
        setDeleteConfirm(null);
        setDetailModal(null);
        flash(t.flashDeleted);
      } else {
        flash(t.flashError);
        setDeleteConfirm(null);
      }
    } catch { flash(t.flashError); setDeleteConfirm(null); }
  }

  function openDetail(req: PrayerRequest) {
    setDetailModal(req);
    handleMarkRead(req);
  }

  function getStatusBadge(req: PrayerRequest) {
    if (req.prayedAt) {
      return { label: t.badgePrayed, bg: 'rgba(13,71,161,0.35)', color: '#90CAF9', border: '1px solid rgba(21,101,192,0.35)' };
    }
    if (req.readAt) {
      return { label: t.badgeRead, bg: 'rgba(55,65,81,0.55)', color: '#9CA3AF', border: '1px solid rgba(100,116,139,0.25)' };
    }
    return { label: t.badgeNew, bg: 'rgba(20,83,45,0.45)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' };
  }

  // --- Estilos reutilizables ---

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px', borderRadius: '7px',
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.35)',
    color: '#f1f5f9', fontSize: '13px', outline: 'none',
  };

  const btnSecondaryStyle: React.CSSProperties = {
    padding: '7px 14px', borderRadius: '7px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)', color: '#94a3b8',
    fontSize: '13px', cursor: 'pointer', fontWeight: 500,
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '24px',
  };

  const modalStyle: React.CSSProperties = {
    background: '#0f172a', borderRadius: '16px', padding: '28px',
    border: '1px solid rgba(255,255,255,0.1)', maxWidth: '500px', width: '100%',
    boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ animation: 'spin 1s linear infinite' }}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        {t.loading}
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: '24px', maxWidth: '1100px' }}>

        {/* Sub-header: botones de acción alineados a la derecha */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          gap: '8px', marginBottom: '18px', flexWrap: 'wrap',
        }}>
          <button onClick={loadRequests} style={btnSecondaryStyle}>
            ↺ {t.btnUpdate}
          </button>
          <button onClick={exportCSV} style={btnSecondaryStyle}>
            ↓ {t.btnExport}
          </button>
          <button
            onClick={openPrintView}
            style={{
              padding: '7px 16px', borderRadius: '7px', border: 'none',
              background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
              color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
            }}
          >
            ⎙ {t.btnPrint}
          </button>
        </div>

        {/* Barra de filtros */}
        <div style={{
          background: '#1e293b', borderRadius: '10px', padding: '16px',
          border: '1px solid rgba(255,255,255,0.07)', marginBottom: '18px',
          display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end',
        }}>
          {/* Buscador */}
          <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* Dropdown estado */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="all">{t.statusAll}</option>
              <option value="new">{t.statusNew}</option>
              <option value="read">{t.statusRead}</option>
              <option value="prayed">{t.statusPrayed}</option>
            </select>
          </div>

          {/* Fecha desde */}
          <div>
            <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
              {t.labelFrom}
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
              {t.labelTo}
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>

          {/* Botón aplicar */}
          <button
            onClick={applyFilters}
            style={{
              padding: '8px 20px', borderRadius: '7px', border: 'none',
              background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
              color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {t.btnApplyFilters}
          </button>
        </div>

        {/* Flash de notificación */}
        {msg && (
          <div style={{
            marginBottom: '14px', padding: '10px 16px', borderRadius: '8px',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            color: '#22c55e', fontSize: '13px',
          }}>
            {msg}
          </div>
        )}

        {/* Tabla */}
        {filtered.length === 0 ? (
          <div style={{ padding: '56px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
            {requests.length === 0 ? t.noRequests : t.noRequestsFilter}
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {[t.colName, t.colRequest, t.colStatus, t.colDate, t.colActions].map(col => (
                      <th
                        key={col}
                        style={{
                          padding: '12px 14px', textAlign: 'left', color: '#64748b',
                          fontWeight: 600, fontSize: '11px', whiteSpace: 'nowrap',
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((req, i) => {
                    const badge = getStatusBadge(req);
                    const truncated = req.request.length > 60
                      ? req.request.slice(0, 60) + '…'
                      : req.request;
                    const isEven = i % 2 === 0;

                    return (
                      <tr
                        key={req.id}
                        style={{
                          borderBottom: i < paginated.length - 1
                            ? '1px solid rgba(255,255,255,0.05)'
                            : 'none',
                          background: isEven ? 'transparent' : 'rgba(255,255,255,0.015)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.04)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLTableRowElement).style.background =
                            isEven ? 'transparent' : 'rgba(255,255,255,0.015)';
                        }}
                      >
                        <td style={{ padding: '12px 14px', color: '#f1f5f9', fontWeight: 500 }}>
                          {req.name}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#94a3b8', maxWidth: '280px' }}>
                          {truncated}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: '99px', fontSize: '11px',
                            fontWeight: 700, background: badge.bg, color: badge.color,
                            border: badge.border, whiteSpace: 'nowrap',
                          }}>
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#64748b', whiteSpace: 'nowrap', fontSize: '12px' }}>
                          {new Date(req.createdAt).toLocaleDateString(
                            lang === 'es' ? 'es' : 'en',
                            { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }
                          )}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => openDetail(req)}
                              style={{
                                padding: '5px 11px', borderRadius: '6px',
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
                                fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
                              }}
                            >
                              {t.actionViewDetail}
                            </button>
                            <button
                              onClick={() => handleTogglePrayed(req.id, !!req.prayedAt)}
                              style={{
                                padding: '5px 11px', borderRadius: '6px',
                                border: `1px solid ${req.prayedAt ? 'rgba(255,255,255,0.08)' : 'rgba(21,101,192,0.3)'}`,
                                background: req.prayedAt ? 'rgba(255,255,255,0.04)' : 'rgba(21,101,192,0.12)',
                                color: req.prayedAt ? '#475569' : '#60a5fa',
                                fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
                              }}
                            >
                              {t.actionMarkPresented}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '14px', marginTop: '18px', color: '#64748b', fontSize: '13px',
              }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    ...btnSecondaryStyle,
                    opacity: currentPage === 1 ? 0.4 : 1,
                    cursor: currentPage === 1 ? 'default' : 'pointer',
                  }}
                >
                  {t.prev}
                </button>
                <span>{t.pageOf(currentPage, totalPages)}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    ...btnSecondaryStyle,
                    opacity: currentPage === totalPages ? 0.4 : 1,
                    cursor: currentPage === totalPages ? 'default' : 'pointer',
                  }}
                >
                  {t.next}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ---- Modal de detalle ---- */}
      {detailModal && (
        <div style={overlayStyle} onClick={() => setDetailModal(null)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            {/* Cabecera modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                {t.modalTitle}
              </h2>
              <button
                onClick={() => setDetailModal(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '22px', lineHeight: 1, padding: '0 4px' }}
              >
                ×
              </button>
            </div>

            {/* Metadatos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {t.modalName}
                </span>
                <p style={{ fontSize: '14px', color: '#f1f5f9', margin: '4px 0 0', fontWeight: 600 }}>
                  {detailModal.name}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {t.modalDate}
                </span>
                <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '4px 0 0' }}>
                  {new Date(detailModal.createdAt).toLocaleString(
                    lang === 'es' ? 'es' : 'en',
                    { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
                  )}
                </p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {t.modalStatus}
                </span>
                <div style={{ marginTop: '6px' }}>
                  {(() => {
                    const b = getStatusBadge(detailModal);
                    return (
                      <span style={{
                        padding: '3px 10px', borderRadius: '99px', fontSize: '12px',
                        fontWeight: 700, background: b.bg, color: b.color, border: b.border,
                      }}>
                        {b.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Texto de la petición */}
            <div style={{ marginBottom: '22px' }}>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {t.modalRequest}
              </span>
              <p style={{
                fontSize: '14px', color: '#cbd5e1', margin: '8px 0 0',
                lineHeight: 1.75, whiteSpace: 'pre-wrap',
                background: 'rgba(255,255,255,0.03)', padding: '14px',
                borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)',
                maxHeight: '220px', overflowY: 'auto',
              }}>
                {detailModal.request}
              </p>
            </div>

            {/* Acciones del modal */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleTogglePrayed(detailModal.id, !!detailModal.prayedAt)}
                style={{
                  flex: 1, minWidth: '110px', padding: '9px 14px', borderRadius: '8px',
                  border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                  background: detailModal.prayedAt ? 'rgba(255,255,255,0.06)' : 'rgba(46,125,50,0.18)',
                  color: detailModal.prayedAt ? '#64748b' : '#4ade80',
                }}
              >
                {detailModal.prayedAt ? t.btnUnmark : `🙏 ${t.btnMarkPrayed}`}
              </button>
              <button
                onClick={() => setDeleteConfirm(detailModal.id)}
                style={{
                  padding: '9px 14px', borderRadius: '8px', cursor: 'pointer',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)',
                  color: '#ef4444', fontSize: '13px',
                }}
              >
                {t.btnDelete}
              </button>
              <button
                onClick={() => setDetailModal(null)}
                style={{
                  padding: '9px 14px', borderRadius: '8px', cursor: 'pointer',
                  background: 'transparent', border: '1px solid #334155',
                  color: '#94a3b8', fontSize: '13px',
                }}
              >
                {t.btnClose}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Modal confirmar eliminación ---- */}
      {deleteConfirm && (
        <div
          style={{ ...overlayStyle, zIndex: 1100 }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{ ...modalStyle, maxWidth: '380px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '50%', margin: '0 auto 14px',
                background: 'rgba(239,68,68,0.12)', color: '#ef4444',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>
                {t.deleteConfirmTitle}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{t.deleteConfirmDesc}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, padding: '10px', background: 'transparent',
                  border: '1px solid #334155', borderRadius: '8px',
                  color: '#94a3b8', fontSize: '13px', cursor: 'pointer',
                }}
              >
                {t.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  flex: 1, padding: '10px', background: '#ef4444',
                  border: 'none', borderRadius: '8px',
                  color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                }}
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
