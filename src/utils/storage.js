import React, { useState, useEffect } from 'react';

/**
 * Utilidades para manejar información persistente utilizando
 * `localStorage`. Estas funciones se usan como sustitutas de un
 * backend real durante las pruebas y pueden ser reemplazadas por
 * llamadas a servicios externos en el futuro.
 */

// Función para crear un hook de almacenamiento local
export const useLocalStorage = (key, initialValue) => {
  // Obtener el valor inicial del localStorage o usar el valor predeterminado
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return initialValue;
    }
  });

  // Actualizar el localStorage cada vez que el estado cambie
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error al escribir en localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

// Función para obtener un valor del localStorage
export const getStorageItem = (key) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error al obtener de localStorage:', error);
    return null;
  }
};

// Función para establecer un valor en el localStorage
export const setStorageItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error al establecer en localStorage:', error);
  }
};

// Función para remover un valor del localStorage
export const removeStorageItem = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error al remover de localStorage:', error);
  }
};

// Deduplica y filtra arreglos de objetos por `pdvId` válido
const dedupeArray = (list = [], validIds = []) => {
  const seen = new Set();
  return list
    .filter((entry) => entry && validIds.includes(entry.pdvId))
    .filter((entry) => {
      const key = JSON.stringify(entry);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

/**
 * Limpia datos almacenados en `localStorage` que estén incompletos,
 * duplicados o sin relación con un PDV válido.
 *
 * @param {string[]} validPdvIds - Lista de identificadores de PDV válidos
 */
export const cleanupLocalStorage = (validPdvIds = []) => {
  try {
    // Remover datos de PDVs inexistentes
    Object.keys(window.localStorage).forEach((key) => {
      if (/^pdv-.*-(data|defaults-list)$/.test(key)) {
        const match = key.match(/^pdv-(.*)-(data|defaults-list)$/);
        const pdvId = match ? match[1] : '';
        if (pdvId && !validPdvIds.includes(pdvId)) {
          window.localStorage.removeItem(key);
        }
      }
    });

    // Solicitudes de material
    const material = getStorageItem('material-requests') || [];
    const cleanedMaterial = dedupeArray(material, validPdvIds);
    setStorageItem('material-requests', cleanedMaterial);

    // Actualizaciones de PDV
    const updates = getStorageItem('pdv-update-requests') || [];
    const cleanedUpdates = dedupeArray(updates, validPdvIds);
    setStorageItem('pdv-update-requests', cleanedUpdates);
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
  }
};
