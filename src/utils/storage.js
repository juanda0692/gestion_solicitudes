import React, { useState, useEffect } from 'react';

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