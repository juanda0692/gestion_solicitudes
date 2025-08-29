import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRequest } from '../services/api';

export default function RequestDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setData(await getRequest(id));
      } catch (e) {
        setError(e.message || 'Error cargando solicitud');
      }
    })();
  }, [id]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">Cargando…</div>;

  const h = data.header;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Solicitud #{data.id}</h1>

      <section>
        <h2 className="font-semibold mb-2">Cabecera</h2>
        <ul className="text-sm list-disc pl-4">
          <li>Región: {h.region_id || '-'}</li>
          <li>Subterritorio: {h.subterritorio_id || '-'}</li>
          <li>PDV: {h.pdv_id}</li>
          <li>Campaña: {h['campaña_id'] || '-'}</li>
          <li>Prioridad: {h.prioridad ?? '-'}</li>
          <li>Zonas: {Array.isArray(h.zonas) ? h.zonas.join(', ') : '-'}</li>
          <li>Observaciones: {h.observaciones || '-'}</li>
          <li>Creado por: {h.creado_por || '-'}</li>
          <li>Creado en: {h.creado_en}</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Ítems</h2>
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Material</th>
              <th className="p-2 text-left">Cantidad</th>
              <th className="p-2 text-left">Medidas</th>
              <th className="p-2 text-left">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(it => (
              <tr key={it.id} className="border-t">
                <td className="p-2">{it.material_id}</td>
                <td className="p-2">{it.cantidad}</td>
                <td className="p-2">{it.medida_etiqueta || it.medida_custom || '-'}</td>
                <td className="p-2">{it.observaciones || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <button
        className="mt-4 px-3 py-2 bg-blue-600 text-white rounded"
        onClick={() => { /* TODO: Export using SheetJS (XLSX.utils.json_to_sheet) */ }}
      >Exportar a Excel</button>
    </div>
  );
}
