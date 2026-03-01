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
    campania_id: '',
  });
  const [data, setData] = useState([]);
  const [page, setPage] = useState({ limit: 10, offset: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [loadedRegions, loadedCampaigns] = await Promise.all([getRegions(), getCampaigns()]);
        setRegions(loadedRegions);
        setCampaigns(loadedCampaigns);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setSubs([]);
      setPdvs([]);
      setFilters((current) => ({ ...current, subterritorio_id: '', pdv_id: '' }));
      if (!filters.region_id) return;
      try {
        setSubs(await getSubterritories(filters.region_id));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [filters.region_id]);

  useEffect(() => {
    (async () => {
      setPdvs([]);
      setFilters((current) => ({ ...current, pdv_id: '' }));
      if (!filters.subterritorio_id) return;
      try {
        setPdvs(await getPdvs(filters.subterritorio_id));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [filters.subterritorio_id]);

  const queryKey = useMemo(
    () => JSON.stringify({ limit: page.limit, offset: page.offset, filters }),
    [page.limit, page.offset, filters],
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const response = await listRequests({ limit: page.limit, offset: page.offset, filters });
        if (!alive) return;
        setData(response.data || []);
        setPage((current) => ({ ...current, total: response.page?.total ?? 0 }));
      } catch (error) {
        if (!alive) return;
        setErr(error.message || 'Error cargando solicitudes');
        setData([]);
        setPage((current) => ({ ...current, total: 0 }));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [queryKey]);

  const totalPages = Math.max(1, Math.ceil((page.total || 0) / page.limit));
  const currentPage = Math.floor(page.offset / page.limit) + 1;

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage((current) => ({ ...current, offset: 0 }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Historial de Solicitudes</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <select className="border p-2 rounded" value={filters.region_id} onChange={(event) => updateFilter('region_id', event.target.value)}>
          <option value="">Todas las regiones</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filters.subterritorio_id}
          onChange={(event) => updateFilter('subterritorio_id', event.target.value)}
          disabled={!subs.length}
        >
          <option value="">Todos los subterritorios</option>
          {subs.map((subterritory) => (
            <option key={subterritory.id} value={subterritory.id}>
              {subterritory.name}
            </option>
          ))}
        </select>

        <select className="border p-2 rounded" value={filters.pdv_id} onChange={(event) => updateFilter('pdv_id', event.target.value)} disabled={!pdvs.length}>
          <option value="">Todos los PDV</option>
          {pdvs.map((pdv) => (
            <option key={pdv.id} value={pdv.id}>
              {pdv.name}
            </option>
          ))}
        </select>

        <select className="border p-2 rounded" value={filters.campania_id} onChange={(event) => updateFilter('campania_id', event.target.value)}>
          <option value="">Todas las campanias</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Region</th>
                <th className="p-3 text-left">Subterritorio</th>
                <th className="p-3 text-left">PDV</th>
                <th className="p-3 text-left">Campania</th>
                <th className="p-3 text-left">Prioridad</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Creado por</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={10}>
                    Cargando...
                  </td>
                </tr>
              )}
              {!loading && err && (
                <tr>
                  <td className="p-4 text-red-600" colSpan={10}>
                    {err}
                  </td>
                </tr>
              )}
              {!loading && !err && data.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={10}>
                    No hay solicitudes
                  </td>
                </tr>
              )}
              {!loading &&
                !err &&
                data.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-3 font-medium">#{row.id}</td>
                    <td className="p-3">{row.region_name || row.region_id || '-'}</td>
                    <td className="p-3">{row.subterritorio_name || row.subterritorio_id || '-'}</td>
                    <td className="p-3">{row.pdv_name || row.pdv_id || '-'}</td>
                    <td className="p-3">{row.campania_name || row.campania_id || '-'}</td>
                    <td className="p-3">{row.prioridad || '-'}</td>
                    <td className="p-3">{row.items_count ?? '-'}</td>
                    <td className="p-3">{row.created_by || row.creado_por || '-'}</td>
                    <td className="p-3">{row.created_at || row.creado_en || '-'}</td>
                    <td className="p-3">
                      <a className="text-blue-600 hover:underline" href={`/requests/${row.id}`}>
                        Ver
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 border-t">
          <div className="text-sm text-gray-600">
            {page.total > 0
              ? `Mostrando ${page.offset + 1}-${Math.min(page.offset + page.limit, page.total)} de ${page.total}`
              : 'Sin resultados'}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage <= 1}
              onClick={() => setPage((current) => ({ ...current, offset: Math.max(0, current.offset - current.limit) }))}
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((current) => ({ ...current, offset: current.offset + current.limit }))}
            >
              Siguiente
            </button>
            <select
              className="ml-2 border p-1 rounded"
              value={page.limit}
              onChange={(event) => setPage((current) => ({ ...current, limit: Number(event.target.value), offset: 0 }))}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}/pagina
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
