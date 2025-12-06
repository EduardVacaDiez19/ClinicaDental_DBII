
/**
 * Componente Principal de la Aplicación
 * 
 * Componente raíz que configura el enrutamiento de la aplicación de la clínica dental.
 * Utiliza React Router para gestionar la navegación entre diferentes páginas.
 * Incluye el componente Navbar y Footer que se muestran en todas las páginas.
 * 
 * @component
 * @returns {JSX.Element} Aplicación completa con enrutamiento
 * @example
 * // Renderizado en main.jsx
 * <App />
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Services from './pages/Services'
import About from './pages/About'
import Footer from './components/Footer'

/**
 * Función principal de la aplicación
 * 
 * Define la estructura de la aplicación con enrutamiento y layout principal.
 * Utiliza un diseño de columna flexible con header, contenido principal y footer.
 * 
 * @function App
 * @returns {JSX.Element} Estructura completa de la aplicación
 */
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

/**
 * Exportar componente App
 * 
 * @exports {JSX.Element} Componente App para renderizado principal
 */
export default App
