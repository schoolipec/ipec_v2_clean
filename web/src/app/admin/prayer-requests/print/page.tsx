import { prisma } from '@/lib/db';

type FilterValue = 'nuevas' | 'oradas' | 'leidas' | 'todas';

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function PrintPrayerRequests({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = (params.filter ?? 'nuevas') as FilterValue;

  // Construir cláusula where según el filtro recibido
  const whereClause =
    filter === 'oradas'
      ? { NOT: { prayedAt: null as null } }
      : filter === 'leidas'
      ? { NOT: { readAt: null as null }, prayedAt: null as null }
      : filter === 'todas'
      ? {}
      : { prayedAt: null as null }; // 'nuevas' es el default

  const requests = await prisma.prayerRequest.findMany({
    where: whereClause,
    orderBy: { createdAt: 'asc' },
  });

  const filterLabel =
    filter === 'oradas' ? 'Peticiones Oradas' :
    filter === 'leidas' ? 'Peticiones Leídas' :
    filter === 'todas' ? 'Todas las Peticiones' :
    'Peticiones Nuevas';

  const today = new Date().toLocaleDateString('es', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC',
  });

  return (
    <>
      {/* Script auto-print al cargar */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.addEventListener('load', function(){ setTimeout(function(){ window.print(); }, 400); });`,
        }}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          /* Reset para modo impresión limpio */
          body { background: #f8f4ef !important; }

          /* Ocultar el chrome del admin en pantalla y al imprimir */
          @media print {
            nav, aside, header, [data-testid="admin-nav"],
            [class*="AdminShell"], [class*="AdminNav"],
            [class*="sidebar"], [class*="navbar"] {
              display: none !important;
            }
            body { background: white !important; color: black !important; }
          }

          /* Contenedor principal */
          .prayer-print-root {
            font-family: Georgia, 'Times New Roman', serif;
            color: #1a1a1a;
            max-width: 760px;
            margin: 0 auto;
            padding: 0;
          }

          /* Cabecera del documento */
          .pp-header {
            text-align: center;
            padding: 28px 32px 18px;
            border-bottom: 2px solid #8B4513;
            margin-bottom: 0;
          }
          .pp-church-name {
            font-size: 19px; font-weight: 700;
            color: #4A2000; letter-spacing: 0.06em;
            text-transform: uppercase; margin-top: 10px;
          }
          .pp-subtitle {
            font-size: 14px; color: #7B5B3A; margin-top: 3px;
          }
          .pp-date {
            font-size: 12px; color: #9B8B7A; margin-top: 3px;
            font-family: Arial, sans-serif;
          }
          .pp-filter-badge {
            display: inline-block; margin-top: 8px;
            padding: 2px 14px; border-radius: 99px;
            background: #8B4513; color: #fff;
            font-size: 11px; font-family: Arial, sans-serif;
            letter-spacing: 0.08em; text-transform: uppercase;
          }

          /* Tarjeta de petición individual */
          .pp-card {
            padding: 24px 32px;
            page-break-after: always;
            page-break-inside: avoid;
          }
          .pp-card:last-child {
            page-break-after: auto;
          }

          /* Cabecera de la tarjeta */
          .pp-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
            gap: 16px;
          }
          .pp-name {
            font-size: 17px; font-weight: 700; color: #2D1500;
          }
          .pp-cross {
            color: #8B4513; margin-right: 6px;
          }
          .pp-meta {
            text-align: right; font-size: 12px;
            color: #9B8B7A; font-family: Arial, sans-serif;
            flex-shrink: 0;
          }
          .pp-meta-status {
            margin-top: 2px; font-weight: 600;
            font-size: 11px; letter-spacing: 0.05em;
          }

          /* Texto de la petición */
          .pp-text {
            font-size: 14px; line-height: 1.85; color: #2A1800;
            border-left: 3px solid #8B4513; padding-left: 16px;
            font-style: italic; white-space: pre-wrap;
          }

          /* Divisor entre peticiones */
          .pp-divider {
            border: none; border-top: 1px solid #D4C4B0;
            margin-top: 18px;
          }

          /* Sin peticiones */
          .pp-empty {
            text-align: center; padding: 64px 32px;
            color: #9B8B7A; font-size: 16px; font-style: italic;
          }

          /* Overrides para impresión */
          @media print {
            .pp-church-name { color: #000; }
            .pp-subtitle { color: #333; }
            .pp-date { color: #555; }
            .pp-filter-badge { background: #333; }
            .pp-name { color: #000; }
            .pp-cross { color: #000; }
            .pp-meta { color: #555; }
            .pp-text { color: #000; border-left: 2px solid #000; }
            .pp-divider { border-top-color: #aaa; }
          }
        `,
      }} />

      <div className="prayer-print-root">

        {/* Cabecera del documento */}
        <div className="pp-header">
          {/* Cruz SVG simple */}
          <svg
            width="36" height="36" viewBox="0 0 36 36"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', margin: '0 auto' }}
          >
            <rect x="15" y="2" width="6" height="32" rx="2" fill="#8B4513" />
            <rect x="4" y="11" width="28" height="6" rx="2" fill="#8B4513" />
          </svg>

          <div className="pp-church-name">Iglesia Plenitud en Cristo</div>
          <div className="pp-subtitle">Peticiones de Oración</div>
          <div className="pp-date">{today}</div>
          <span className="pp-filter-badge">{filterLabel}</span>
        </div>

        {/* Contenido */}
        {requests.length === 0 ? (
          <div className="pp-empty">
            No hay peticiones de oración en esta categoría.
          </div>
        ) : (
          requests.map(req => {
            const dateStr = new Date(req.createdAt).toLocaleDateString('es', {
              day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC',
            });
            const statusLabel = req.prayedAt ? 'Orada' : req.readAt ? 'Leída' : 'Nueva';

            return (
              <div key={req.id} className="pp-card">
                <div className="pp-card-header">
                  <div className="pp-name">
                    <span className="pp-cross">✞</span>
                    {req.name}
                  </div>
                  <div className="pp-meta">
                    <div>{dateStr}</div>
                    <div className="pp-meta-status">{statusLabel}</div>
                  </div>
                </div>
                <p className="pp-text">{req.request}</p>
                <hr className="pp-divider" />
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
