// src/pages/ExportPdvsPage.jsx
import ExportData from '../components/ExportData';

export default function ExportPdvsPage() {
    const onExport = async (exportObj) => {
        // exportObj trae lo que le mandaste desde el hijo:
        // { regionName, channelName, canalId, pdvIds, pdvs, meta }
        const payload = {
            pdvIds: exportObj.pdvIds,                 // array de IDs de PDV
            canalId: exportObj.canalId,               // ID del canal
            filename: `solicitudes_${new Date().toISOString().slice(0, 10)}.xlsx`,
        };

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/solicitudes/export`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );
            if (!res.ok) throw new Error('Export failed');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = payload.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert('No se pudo exportar el archivo');
        }
    };

    return (
        <ExportData
            onExport={onExport}
            onBack={() => window.history.back()}
        />
    );
}
