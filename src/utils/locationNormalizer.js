/**
 * Utilities for normalizing and validating location data.
 *
 * The normalization process cleans region and subterritory names,
 * ensures all referenced regions exist, and fixes duplicated PDV IDs.
 * Each PDV is enriched with region and subterritory references and
 * basic contact information.
 */

// Helper to capitalize every word and trim spacing
const normalizeName = (str = '') =>
  str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Normalizes location structures.
 *
 * @param {Array} regionList - array of region objects
 * @param {Object} subMap - mapping regionId -> array of subterritories
 * @param {Object} pdvMap - mapping subterritoryId -> array of PDVs
 * @returns {{regions: Array, subterritories: Object, pdvs: Object}}
 */
export const normalizeLocationData = (
  regionList = [],
  subMap = {},
  pdvMap = {},
) => {
  const regionMap = new Map();
  regionList.forEach((r) => {
    if (r && r.id) {
      regionMap.set(r.id.trim(), {
        id: r.id.trim(),
        name: normalizeName(r.name || r.id),
      });
    }
  });

  // Ensure all regions referenced in subterritories exist
  Object.keys(subMap).forEach((regionId) => {
    if (!regionMap.has(regionId)) {
      const name = normalizeName(regionId.replace('region-', '').replace('-', ' '));
      regionMap.set(regionId, { id: regionId, name });
    }
  });

  // Normalize subterritory names
  const normalizedSubs = {};
  Object.entries(subMap).forEach(([regionId, subs]) => {
    normalizedSubs[regionId] = subs.map((s) => ({
      id: s.id.trim(),
      name: normalizeName(s.name || s.id),
    }));
  });

  // Map subterritory -> region for quick lookup
  const subToRegion = {};
  Object.entries(normalizedSubs).forEach(([regionId, subs]) => {
    subs.forEach((s) => {
      subToRegion[s.id] = regionId;
    });
  });

  // Normalize PDVs, ensuring unique IDs and required fields
  const seenIds = new Set();
  const normalizedPdvs = {};
  Object.entries(pdvMap).forEach(([subId, list]) => {
    normalizedPdvs[subId] = list.map((pdv, idx) => {
      let id = pdv.id ? pdv.id.trim() : '';
      if (!id || seenIds.has(id)) {
        id = `${subId}-${idx + 1}`;
      }
      // Avoid collisions
      while (seenIds.has(id)) {
        id = `${id}-${idx + 1}`;
      }
      seenIds.add(id);

      const regionId = subToRegion[subId] || '';
      const address = pdv.address || 'Sin dirección';
      const contact = pdv.contact || 'Sin contacto';
      const complete = Boolean(
        id && pdv.name && regionId && subId && address && contact,
      );
      return {
        id,
        name: normalizeName(pdv.name || id),
        regionId,
        subterritoryId: subId,
        address,
        contact,
        complete,
      };
    });
  });

  return {
    regions: Array.from(regionMap.values()),
    subterritories: normalizedSubs,
    pdvs: normalizedPdvs,
  };
};

/**
 * Validates a new PDV before insertion.
 * Ensures required fields exist and ID is unique.
 *
 * @param {Object} pdv - PDV data to validate
 * @param {Object} pdvData - existing PDV mapping
 * @returns {boolean}
 */
export const validateNewPdv = (pdv, pdvData) => {
  const required = ['id', 'name', 'regionId', 'subterritoryId', 'address', 'contact'];
  if (!pdv || !required.every((k) => pdv[k])) return false;
  const allPdvs = Object.values(pdvData || {}).flat();
  return !allPdvs.some((p) => p.id === pdv.id);
};

export default normalizeLocationData;
