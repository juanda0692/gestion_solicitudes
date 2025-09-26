// src/pages/ExportPdvsPage.jsx
import ExportData from '../components/ExportData';

export default function ExportPdvsPage() {
    const onExport = async (exportObj) => {
        // exportObj trae lo que le mandaste desde el hijo:
        // { regionName, channelName, canalId, pdvIds, pdvs, meta }
        const payload = {
            p_pdv_ids: exportObj.pdvIds,                 // array de IDs de PDV
            p_canal_id: exportObj.canalId,               // ID del canal
            filename: `solicitudes_${new Date().toISOString().slice(0, 10)}.xlsx`,
        };

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/solicitudes/export`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
                    body: JSON.stringify(payload),
                }
            );
            const ct = res.headers.get('Content-Type') || '';
            if (!res.ok) {
                const msg = await res.text().catch(() => '');
                throw new Error(`Export failed: ${res.status} ${msg}`);
            }
            // si nos devuelven JSON… es que NO es el webhook correcto
            if (ct.includes('application/json')) {
                const text = await res.text();
                console.warn('El endpoint respondió JSON (no XLSX). ¿Seguro que es el webhook de n8n?', text);
                throw new Error('El endpoint no devolvió XLSX (revisa URL / flujo n8n)');
            }
            let filename = payload.filename;
            const cd = res.headers.get('Content-Disposition');
            if (cd) {
                const m = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(cd);
                if (m?.[1]) filename = decodeURIComponent(m[1]);
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
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
