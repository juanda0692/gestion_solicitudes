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

// Generates a URL-friendly slug removing accents and special characters
const slug = (str = '') =>
  str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

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
  const warnings = [];

  // --- Regiones ---
  const regionMap = new Map();
  const regionNameMap = new Map(); // slug(name) -> id
  regionList.forEach((r) => {
    if (!r) return;
    const name = normalizeName(r.name || r.id);
    let id = r.id ? r.id.trim() : `region-${slug(name)}`;
    let baseId = id;
    let n = 2;
    while (regionMap.has(id)) {
      id = `${baseId}-${n++}`;
    }
    if (regionNameMap.has(slug(name))) {
      const prevId = regionNameMap.get(slug(name));
      warnings.push(`Región "${name}" duplicada (IDs ${prevId} / ${id})`);
    } else {
      regionNameMap.set(slug(name), id);
    }
    regionMap.set(id, { id, name });
  });

  // Ensure all regions referenced in subterritories exist
  Object.keys(subMap).forEach((regionId) => {
    if (!regionMap.has(regionId)) {
      const name = normalizeName(regionId.replace('region-', '').replace('-', ' '));
      regionMap.set(regionId, { id: regionId, name });
    }
  });

  // --- Subterritorios ---
  const normalizedSubs = {};
  const globalSubNames = new Map(); // slug(name) -> { name, regions:Set }
  const subNameById = {}; // id -> name for later reference
  const subToRegion = {};
  Object.entries(subMap).forEach(([regionId, subs]) => {
    const regionName = regionMap.get(regionId)?.name || regionId;
    const subNamesInRegion = new Map();
    normalizedSubs[regionId] = subs.map((s) => {
      const name = normalizeName(s.name || s.id || 'General');
      let id = s.id ? s.id.trim() : `sub-${slug(regionName)}-${slug(name || 'general')}`;
      let baseId = id;
      let n = 2;
      while (subNameById[id]) {
        id = `${baseId}-${n++}`;
      }
      const nameSlug = slug(name);
      if (subNamesInRegion.has(nameSlug)) {
        const prevId = subNamesInRegion.get(nameSlug);
        warnings.push(
          `Subterritorio "${name}" duplicado en región "${regionName}" (IDs ${prevId} / ${id})`,
        );
      } else {
        subNamesInRegion.set(nameSlug, id);
      }
      const global = globalSubNames.get(nameSlug) || { name, regions: new Set() };
      global.regions.add(regionId);
      globalSubNames.set(nameSlug, global);

      subNameById[id] = name;
      subToRegion[id] = regionId;
      return { id, name };
    });
  });

  // Cross-region subterritory duplicates
  globalSubNames.forEach((info) => {
    if (info.regions.size > 1) {
      const regionNames = Array.from(info.regions).map(
        (rid) => regionMap.get(rid)?.name || rid,
      );
      warnings.push(
        `Subterritorio "${info.name}" duplicado en regiones ${regionNames.join(' / ')}`,
      );
    }
  });

  // --- PDVs ---
  const seenIds = new Set();
  const normalizedPdvs = {};
  Object.entries(pdvMap).forEach(([subId, list]) => {
    const subName = subNameById[subId] || subId;
    const pdvNamesInSub = new Map();
    normalizedPdvs[subId] = list.map((pdv, idx) => {
      const name = normalizeName(pdv.name || pdv.id || '');
      let id = pdv.id ? pdv.id.trim() : `pdv-${slug(name)}`;
      let baseId = id;
      let n = 2;
      while (seenIds.has(id)) {
        id = `${baseId}-${n++}`;
      }
      seenIds.add(id);

      const nameSlug = slug(name);
      if (pdvNamesInSub.has(nameSlug)) {
        const prevId = pdvNamesInSub.get(nameSlug);
        warnings.push(
          `PDV "${name}" duplicado en subterritorio "${subName}" (IDs ${prevId} / ${id})`,
        );
      } else {
        pdvNamesInSub.set(nameSlug, id);
      }

      const regionId = subToRegion[subId] || '';
      const city = normalizeName(pdv.city || '');
      const address = pdv.address || 'Sin dirección';
      const contactName = normalizeName(pdv.contactName || '');
      const contactPhone = pdv.contactPhone || '';
      const notes = pdv.notes || '';
      const contact =
        pdv.contact || `${contactName}${contactPhone ? ` - ${contactPhone}` : ''}`;
      const complete = Boolean(
        id && pdv.name && regionId && subId && city && address && contactName && contactPhone,
      );
      return {
        id,
        name: name || id,
        regionId,
        subterritoryId: subId,
        city,
        address,
        contactName,
        contactPhone,
        contact,
        notes,
        complete,
      };
    });
  });

  return {
    regions: Array.from(regionMap.values()),
    subterritories: normalizedSubs,
    pdvs: normalizedPdvs,
    warnings,
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
