/**
 * Utilidad simple para exportar el objeto de solicitudes en formato JSON.
 * Genera un archivo descargable en el navegador.
 */
export default function exportToJson(data) {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    const scope = (data.scope || 'General').replace(/\s+/g, '-');
    link.download = `Export_${scope}_${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.error('Error generating JSON', e);
    return false;
  }
}
