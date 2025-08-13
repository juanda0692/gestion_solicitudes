/**
 * Utilidades para manejar información persistente utilizando
 * `localStorage`. Estas funciones se usan como sustitutas de un
 * backend real durante las pruebas y pueden ser reemplazadas por
 * llamadas a servicios externos en el futuro.
 */

/**
 * Claves conocidas utilizadas por la aplicación. Se exponen para que
 * servicios de limpieza puedan identificar qué entradas pertenecen al
 * proyecto.
 *
 * @type {string[]}
 */
export const PROJECT_KEYS = [
  'material-requests',
  'pdv-update-requests',
  'locations_normalized',
  'normalization_report',
  'locations_source',
  'locations/imported',
  'locations/source',
];

/**
 * Obtiene un valor del `localStorage` del navegador.
 *
 * @param {string} key Clave a consultar.
 * @returns {any|null} Valor parseado o `null` si no existe.
 */
export const getStorageItem = (key) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error al obtener de localStorage:', error);
    return null;
  }
};

/**
 * Guarda un valor en `localStorage`.
 *
 * @param {string} key Clave del registro.
 * @param {any} value Valor a almacenar. Se serializa como JSON.
 */
export const setStorageItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error al establecer en localStorage:', error);
  }
};

/**
 * Elimina una entrada del `localStorage`.
 *
 * @param {string} key Clave del registro a eliminar.
 */
export const removeStorageItem = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error al remover de localStorage:', error);
  }
};

