import { getStorageItem, setStorageItem, removeStorageItem, PROJECT_KEYS } from './storage';

/**
 * Crea una copia de seguridad de las claves indicadas.
 * Las copias se almacenan con el formato `${key}_backup_YYYYMMDD`.
 *
 * @param {string[]} keys
 * @returns {string[]} claves creadas
 */
export const backup = (keys = []) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const created = [];
  keys.forEach((key) => {
    const value = getStorageItem(key);
    if (value !== null) {
      const backupKey = `${key}_backup_${date}`;
      setStorageItem(backupKey, value);
      created.push(backupKey);
    }
  });
  return created;
};

/**
 * Aplica un mapa de IDs normalizados a las entradas almacenadas.
 *
 * @param {{[oldId: string]: string}} idMap
 * @returns {number} cantidad de elementos migrados
 */
export const migrateIds = (idMap = {}) => {
  if (!idMap || Object.keys(idMap).length === 0) return 0;
  let migrated = 0;

  // Migrar claves de pdv data y defaults
  Object.keys(localStorage).forEach((key) => {
    const match = key.match(/^pdv-(.*)-(data|defaults-list)$/);
    if (match) {
      const oldId = match[1];
      const suffix = match[2];
      const newId = idMap[oldId];
      if (newId) {
        const value = getStorageItem(key);
        removeStorageItem(key);
        setStorageItem(`pdv-${newId}-${suffix}`, value);
        migrated++;
      }
    }
  });

  // Migrar listas de solicitudes
  ['material-requests', 'pdv-update-requests'].forEach((k) => {
    const arr = getStorageItem(k) || [];
    const updated = arr.map((entry) => {
      if (entry && idMap[entry.pdvId]) {
        migrated++;
        return { ...entry, pdvId: idMap[entry.pdvId] };
      }
      return entry;
    });
    setStorageItem(k, updated);
  });

  return migrated;
};

/**
 * Elimina entradas huérfanas del almacenamiento.
 *
 * @param {string[]} validIds Lista de IDs válidos de PDV
 * @returns {number} cantidad de entradas removidas
 */
export const cleanupOrphans = (validIds = []) => {
  if (!validIds || validIds.length === 0) return 0;
  let removed = 0;
  const isValid = (id) => validIds.includes(id);

  // limpiar claves de pdv
  Object.keys(localStorage).forEach((key) => {
    const match = key.match(/^pdv-(.*)-(data|defaults-list)$/);
    if (match) {
      const id = match[1];
      if (!isValid(id)) {
        removeStorageItem(key);
        removed++;
      }
    }
  });

  // limpiar requests sin pdvId válido
  ['material-requests', 'pdv-update-requests'].forEach((k) => {
    const arr = (getStorageItem(k) || []).filter(
      (e) => e && e.pdvId && isValid(e.pdvId)
    );
    setStorageItem(k, arr);
  });

  return removed;
};

/**
 * Deduplica solicitudes de material y actualizaciones.
 *
 * @returns {number} cantidad de elementos deduplicados
 */
export const dedupeRequests = () => {
  const dedupe = (arr, keyFn) => {
    const seen = new Set();
    return arr.filter((item) => {
      const hash = keyFn(item);
      if (seen.has(hash)) return false;
      seen.add(hash);
      return true;
    });
  };

  let deduped = 0;
  ['material-requests', 'pdv-update-requests'].forEach((k) => {
    const arr = getStorageItem(k) || [];
    const filtered = dedupe(arr, (e) =>
      JSON.stringify({ pdvId: e.pdvId, date: e.date, data: e.data, items: e.items })
    );
    deduped += arr.length - filtered.length;
    setStorageItem(k, filtered);
  });

  return deduped;
};

/**
 * Elimina todas las claves pertenecientes al proyecto.
 */
export const resetAll = () => {
  Object.keys(localStorage).forEach((key) => {
    if (
      PROJECT_KEYS.includes(key) ||
      /^pdv-.*-(data|defaults-list)$/.test(key)
    ) {
      removeStorageItem(key);
    }
  });
};

/**
 * Ejecuta los procesos de saneamiento al iniciar la aplicación.
 *
 * @param {string[]} validIds IDs de PDV válidos
 * @returns {{migrated:number,deduped:number,removed:number,backups:string[]}}
 */
export const sanitizeOnBoot = (validIds = []) => {
  const report = getStorageItem('normalization_report') || {};
  const backups = backup(['material-requests', 'pdv-update-requests']);
  const migrated = migrateIds(report.idMap || {});
  const deduped = dedupeRequests();
  const removed = cleanupOrphans(validIds);
  const summary = { migrated, deduped, removed, backups };
  return summary;
};

export default {
  backup,
  migrateIds,
  cleanupOrphans,
  dedupeRequests,
  resetAll,
  sanitizeOnBoot,
};
