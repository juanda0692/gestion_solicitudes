import { useEffect, useMemo, useState } from 'react';
import { listRequests } from '../services/requests';
import { getRegions, getSubterritories, getPdvs, getCampaigns } from '../services/api';

export default function RequestsHistory() {
  const [regions, setRegions] = useState([]);
  const [subs, setSubs] = useState([]);
  const [pdvs, setPdvs] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const [filters, setFilters] = useState({
    region_id: '',
    subterritorio_id: '',
    pdv_id: '',
    'campaña_id': ''
  });

  const [data, setData] = useState([]);
  const [page, setPage] = useState({ limit: 10, offset: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Catálogo inicial
  useEffect(() => {
    (async () => {
      try {
        const [r, c] = await Promise.all([getRegions(), getCampaigns()]);
        setRegions(r); setCampaigns(c);
      } catch (e) { console.error(e); }
    })();
  }, []);

  // Dependencia: región -> subterritorios
  useEffect(() => {
    (async () => {
      setSubs([]); setPdvs([]);
      setFilters(f => ({ ...f, subterritorio_id: '', pdv_id: '' }));
      if (!filters.region_id) return;
      try { setSubs(await getSubterritories(filters.region_id)); } catch (e) { console.error(e); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.region_id]);

  // Dependencia: subterritorio -> pdvs
  useEffect(() => {
    (async () => {
      setPdvs([]);
      setFilters(f => ({ ...f, pdv_id: '' }));
      if (!filters.subterritorio_id) return;
      try { setPdvs(await getPdvs(filters.subterritorio_id)); } catch (e) { console.error(e); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.subterritorio_id]);

  const queryKey = useMemo(
    () => JSON.stringify({ limit: page.limit, offset: page.offset, filters }),
    [page.limit, page.offset, filters]
  );

  // Cargar listado
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true); setErr('');
      try {
        const res = await listRequests({ limit: page.limit, offset: page.offset, filters });
        if (!alive) return;
        setData(res.data || []);
        setPage(p => ({ ...p, total: res.page?.total ?? 0 }));
      } catch (e) {
        if (!alive) return;
        setErr(e.message || 'Error cargando solicitudes');
        setData([]);
        setPage(p => ({ ...p, total: 0 }));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [queryKey]);

  const totalPages = Math.max(1, Math.ceil((page.total || 0) / page.limit));
  const currentPage = Math.floor(page.offset / page.limit) + 1;

  const updateFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPage(p => ({ ...p, offset: 0 })); // reset de página al cambiar filtros
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Historial de Solicitudes</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <select className="border p-2 rounded" value={filters.region_id}
          onChange={e => updateFilter('region_id', e.target.value)}>
          <option value="">Todas las regiones</option>
          {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <select className="border p-2 rounded" value={filters.subterritorio_id}
          onChange={e => updateFilter('subterritorio_id', e.target.value)} disabled={!subs.length}>
          <option value="">Todos los subterritorios</option>
          {subs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <select className="border p-2 rounded" value={filters.pdv_id}
          onChange={e => updateFilter('pdv_id', e.target.value)} disabled={!pdvs.length}>
          <option value="">Todos los PDV</option>
          {pdvs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select className="border p-2 rounded" value={filters['campaña_id']}
          onChange={e => updateFilter('campaña_id', e.target.value)}>
          <option value="">Todas las campañas</option>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Región</th>
                <th className="p-3 text-left">Subterritorio</th>
                <th className="p-3 text-left">PDV</th>
                <th className="p-3 text-left">Campaña</th>
                <th className="p-3 text-left">Prioridad</th>
                <th className="p-3 text-left">Ítems</th>
                <th className="p-3 text-left">Creado por</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td className="p-4 text-gray-500" colSpan={10}>Cargando…</td></tr>
              )}
              {!loading && err && (
                <tr><td className="p-4 text-red-600" colSpan={10}>{err}</td></tr>
              )}
              {!loading && !err && data.length === 0 && (
                <tr><td className="p-4 text-gray-500" colSpan={10}>No hay solicitudes</td></tr>
              )}
              {!loading && !err && data.map(row => (
                <tr key={row.id} className="border-t">
                  <td className="p-3 font-medium">#{row.id}</td>
                  <td className="p-3">{row.region_id || '-'}</td>
                  <td className="p-3">{row.subterritorio_id || '-'}</td>
                  <td className="p-3">{row.pdv_id || '-'}</td>
                  <td className="p-3">{row.campaña_id || '-'}</td>
                  <td className="p-3">{row.prioridad || '-'}</td>
                  <td className="p-3">{row.items_count ?? '-'}</td>
                  <td className="p-3">{row.creado_por || '-'}</td>
                  <td className="p-3">{row.creado_en}</td>
                  <td className="p-3">
                    <a className="text-blue-600 hover:underline" href={`/requests/${row.id}`}>Ver</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between p-3 bg-gray-50 border-t">
          <div className="text-sm text-gray-600">
            {page.total > 0
              ? `Mostrando ${page.offset + 1}–${Math.min(page.offset + page.limit, page.total)} de ${page.total}`
              : 'Sin resultados'}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage <= 1}
              onClick={() => setPage(p => ({ ...p, offset: Math.max(0, p.offset - p.limit) }))}
            >Anterior</button>
            <span className="text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(p => ({ ...p, offset: p.offset + p.limit }))}
            >Siguiente</button>
            <select
              className="ml-2 border p-1 rounded"
              value={page.limit}
              onChange={e => setPage(p => ({ ...p, limit: Number(e.target.value), offset: 0 }))}
            >
              {[10,20,50,100].map(n => <option key={n} value={n}>{n}/página</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

