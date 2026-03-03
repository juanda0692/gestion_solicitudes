import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRequest } from '../services/requests';

export default function RequestDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setData(await getRequest(id));
      } catch (loadError) {
        setError(loadError.message || 'Error cargando solicitud');
      }
    })();
  }, [id]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">Cargando...</div>;

  const header = data.header || {};

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Solicitud #{data.id}</h1>

      <section>
        <h2 className="font-semibold mb-2">Cabecera</h2>
        <ul className="text-sm list-disc pl-4">
          <li>Region: {header.region_id || '-'}</li>
          <li>Subterritorio: {header.subterritorio_id || '-'}</li>
          <li>PDV: {header.pdv_id || '-'}</li>
          <li>Canal: {header.canal_id || '-'}</li>
          <li>Campania: {header.campania_id || '-'}</li>
          <li>Prioridad: {header.prioridad ?? '-'}</li>
          <li>Zonas: {Array.isArray(header.zonas) ? header.zonas.join(', ') : '-'}</li>
          <li>Observaciones: {header.observaciones || '-'}</li>
          <li>Creado por: {header.created_by || header.creado_por || '-'}</li>
          <li>Creado en: {header.created_at || header.creado_en || '-'}</li>
          <li>Estado: {header.status || '-'}</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Items</h2>
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
            {(data.items || []).map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.material_name || item.material_id}</td>
                <td className="p-2">{item.cantidad}</td>
                <td className="p-2">{item.medida_etiqueta || item.medida_custom || '-'}</td>
                <td className="p-2">{item.observaciones || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
