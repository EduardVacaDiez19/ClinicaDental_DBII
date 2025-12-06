/**
 * Punto de Entrada de la Aplicación React
 * 
 * Archivo principal que inicializa y renderiza la aplicación React.
 * Configura el modo estricto de React y monta la aplicación en el DOM.
 * 
 * @module main
 * @requires react
 * @requires react-dom/client
 * @requires ./index.css
 * @requires ./App.jsx
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * Renderizar aplicación React
 * 
 * Crea el root de React y renderiza la aplicación en modo estricto.
 * El modo estricto ayuda a identificar problemas potenciales en la aplicación.
 * 
 * @function
 * @returns {void}
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
