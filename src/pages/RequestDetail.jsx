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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Solicitud #{data.id}</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
