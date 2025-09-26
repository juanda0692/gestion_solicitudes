// import * as XLSX from 'xlsx';
// import { getStorageItem } from './storage';
// import { getDisplayName, formatQuantity } from './materialDisplay';

// /**
//  * Exporta un objeto de solicitud de materiales a un archivo Excel (.xlsx).
//  * Cada combinación de PDV y material se convierte en una fila del archivo.
//  *
//  * @param {Object} exportObj - Objeto estructurado con la información a exportar
//  */
// export default function exportToExcel(exportObj) {
//   try {
//     if (!exportObj || !Array.isArray(exportObj.pdvs)) {
//       return false;
//     }

//     const headers = [
//       'Fecha',
//       'Tipo',
//       'Canal',
//       'Región',
//       'Subterritorio',
//       'PDV',
//       'Material',
//       'Medida',
//       'Cantidad',
//       'Zonas',
//       'Prioridad',
//       'Campaña',
//       'Contacto (PDV)',
//       'Teléfono (PDV)',
//       'Ciudad (PDV)',
//       'Dirección (PDV)',
//       'Notas internas (PDV)',
//     ];

//     const rows = [];
//     exportObj.pdvs.forEach((pdv) => {
//       const zone = Array.isArray(pdv.zone) ? pdv.zone.join(', ') : pdv.zone || '';
//       const campaigns = Array.isArray(pdv.campaigns)
//         ? pdv.campaigns.join(', ')
//         : pdv.campaigns || '';
//       const data = pdv.pdvData || getStorageItem(`pdv-${pdv.id}-data`) || {};
//       const contactName = data.contactName || '';
//       const contactPhone = data.contactPhone || '';
//       const city = data.city || '';
//       const address = data.address || '';
//       const notes = data.notes || '';
//       const mats = Array.isArray(pdv.materials) ? pdv.materials : [];
//       mats.forEach((mat) => {
//         rows.push({
//           Fecha: pdv.date || '',
//           Tipo: pdv.requestType || '',
//           Canal: exportObj.channelName || '',
//           Región: pdv.regionName || '',
//           Subterritorio: pdv.subterritoryName || '',
//           PDV: pdv.name || '',
//           Material: getDisplayName(mat.name),
//           Medida: mat.measure || '',
//           Cantidad: formatQuantity(mat.name, mat.quantity) || '',
//           Zonas: zone,
//           Prioridad: pdv.priority || '',
//           Campaña: campaigns,
//           'Contacto (PDV)': contactName,
//           'Teléfono (PDV)': contactPhone,
//           'Ciudad (PDV)': city,
//           'Dirección (PDV)': address,
//           'Notas internas (PDV)': notes,
//         });
//       });
//     });

//     if (rows.length === 0) {
//       return false;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
//     XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

//     // Freeze header row
//     worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

//     // Basic auto width
//     worksheet['!cols'] = headers.map((h) => ({
//       wch: Math.max(
//         h.length,
//         ...rows.map((r) => (r[h] ? r[h].toString().length : 0)),
//       ) + 2,
//     }));

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Solicitud');

//     const date = new Date().toISOString().split('T')[0];
//     const scope = (exportObj.scope || 'General').replace(/\s+/g, '-');
//     const filename = `Export_${scope}_${date}.xlsx`;
//     XLSX.writeFile(workbook, filename);
//     return true;
//   } catch (e) {
//     console.error('Error generating Excel', e);
//     return false;
//   }
// }

// src/utils/exportToExcel.js
// Versión para exportar usando n8n (RPC en Supabase) y descargar el blob .xlsx











// const N8N = process.env.REACT_APP_API_BASE_URL;

// /**
//  * Descarga un Blob como archivo
//  * @param {Blob} blob
//  * @param {string} filename
//  */
// function downloadBlobAsFile(blob, filename = 'export.xlsx') {
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   URL.revokeObjectURL(url);
// }

// /**
//  * Exporta a Excel pidiendo el archivo al webhook de n8n.
//  * Debes enviar pdvIds (array de strings) y canalId (string) en exportObj.
//  *
//  * @param {Object} exportObj - Objeto con datos de la selección
//  *   Esperado:
//  *     - pdvIds: string[]
//  *     - canalId: string
//  *     - regionName?: string (solo para nombrar archivo)
//  *     - channelName?: string (solo para nombrar archivo)
//  *     - filename?: string   (opcional, si quieres forzar nombre)
//  * @returns {Promise<boolean>}
//  */
// export default async function exportToExcel(exportObj) {
//   try {
//     const { pdvIds, canalId, regionName, channelName } = exportObj || {};

//     if (!Array.isArray(pdvIds) || pdvIds.length === 0) {
//       throw new Error('Seleccione al menos un PDV.');
//     }
//     if (!canalId) {
//       throw new Error('Seleccione un canal.');
//     }

//     const safeDate = new Date().toISOString().slice(0, 10);
//     const filename =
//       exportObj?.filename ||
//       `solicitudes_${(regionName || 'region')
//         .replace(/\s+/g, '-')
//         .toLowerCase()}_${(channelName || 'canal')
//         .replace(/\s+/g, '-')
//         .toLowerCase()}_${safeDate}.xlsx`;

//     const res = await fetch(`${N8N}/solicitudes/export`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         p_pdv_ids: pdvIds,
//         p_canal_id: canalId,
//         filename,
//       }),
//     });

//     if (!res.ok) {
//       const msg = await res.text().catch(() => '');
//       throw new Error(`Error exportando: ${res.status} ${msg}`.trim());
//     }

//     // Si el flujo puso Content-Disposition con filename, úsalo
//   const cd = res.headers.get('Content-Disposition');
//   if (cd) {
//     const m = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(cd);
//     if (m?.[1]) filename = decodeURIComponent(m[1]);
//   }

//     const blob = await res.blob();
//     downloadBlobAsFile(blob, filename);
//     return true;
//   } catch (e) {
//     console.error('Error generating Excel via n8n', e);
//     return false;
//   }
// }







// utils/exportToExcel.js (o donde hagas el fetch)

const BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5678/webhook').replace(/\/+$/, '');

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'export.xlsx';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name) {
  return (name || 'export.xlsx')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_');
}

export default async function exportToExcel({ pdvIds, canalId, regionName, channelName, filename }) {
  if (!Array.isArray(pdvIds) || pdvIds.length === 0) {
    throw new Error('Seleccione al menos un PDV');
  }
  // Si tu flujo exige canal obligatoriamente, descomenta:
  if (!canalId) throw new Error('Seleccione un canal');

  const date = new Date().toISOString().slice(0, 10);
  let outName = sanitizeFilename(
    filename ||
      `solicitudes_${(regionName || 'region').toLowerCase()}_${(channelName || 'canal').toLowerCase()}_${date}.xlsx`
  );

  const url = `${BASE}/solicitudes/export`;
  // console.log('[export] → POST', url, { p_pdv_ids: pdvIds, p_canal_id: canalId, outName });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // no pongas Accept “cerrado” para que no fuerce transformaciones del servidor/CORS
      // 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    body: JSON.stringify({
      p_pdv_ids: pdvIds,
      p_canal_id: canalId,
      filename: outName,
    }),
  });

  // Log útil para depurar en un paso
  const rawHeaders = {};
  res.headers.forEach((v, k) => { rawHeaders[k] = v; });
  // console.log('[export] ← status', res.status, 'headers:', rawHeaders);

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    // console.error('[export] non-OK:', res.status, txt);
    throw new Error(`Export failed: ${res.status}`);
  }

  // Nombre desde Content-Disposition si viene
  const cd = res.headers.get('Content-Disposition') || '';
  const m = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(cd);
  if (m?.[1]) outName = sanitizeFilename(decodeURIComponent(m[1]));

  // Tipos que aceptamos como binario excel
  const ct = (res.headers.get('Content-Type') || '').toLowerCase();
  const looksLikeXlsx =
    ct.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
    ct.includes('application/octet-stream'); // algunos proxies devuelven este

  // lee SIEMPRE como arrayBuffer (no intentes .json()/.text() por default)
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);

  if (!looksLikeXlsx) {
    // intenta mostrar preview textual para entender qué llegó
    let preview = '';
    try { preview = new TextDecoder('utf-8').decode(bytes).slice(0, 800); } catch {}
    // console.warn('[export] NO XLSX. CT:', ct, '\nPreview body:\n', preview);
    throw new Error('El endpoint no devolvió XLSX (revisa consola y el nodo Respond to Webhook).');
  }

  // XLSX es ZIP → firma "PK\0x03\0x04"
  const isZip =
    bytes.length > 4 &&
    bytes[0] === 0x50 && // 'P'
    bytes[1] === 0x4b && // 'K'
    bytes[2] === 0x03 &&
    bytes[3] === 0x04;

  if (!isZip) {
    let preview = '';
    try { preview = new TextDecoder('utf-8').decode(bytes).slice(0, 800); } catch {}
    // console.error('[export] El binario no parece un .xlsx (no empieza con PK). Preview:\n', preview);
    throw new Error('El archivo recibido no es un XLSX válido.');
  }

  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveBlob(blob, outName);
  return true;
}
