/**
 * Componente de Navegación Principal
 * 
 * Barra de navegación responsive que proporciona acceso a las principales
 * secciones de la aplicación de la clínica dental. Incluye enlaces a
 * inicio, servicios, nosotros, login y registro.
 * 
 * @component
 * @returns {JSX.Element} Barra de navegación con enlaces principales
 * @example
 * // Se incluye automáticamente en App.jsx
 * <Navbar />
 */

import { Link } from 'react-router-dom';

/**
 * Función del componente Navbar
 * 
 * Renderiza la barra de navegación con el logo de la clínica y los enlaces
 * principales. Utiliza clases de Tailwind CSS para un diseño responsive
 * y moderno.
 * 
 * @function Navbar
 * @returns {JSX.Element} Barra de navegación completa
 */
const Navbar = () => {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-primary">
                                Vaca Diez
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Inicio
                            </Link>
                            <Link to="/services" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Servicios
                            </Link>
                            <Link to="/about" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Nosotros
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <Link to="/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Iniciar Sesión
                        </Link>
                        <Link to="/register" className="bg-primary hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-medium ml-3">
                            Registrarse
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

/**
 * Exportar componente Navbar
 * 
 * @exports {Function} Componente Navbar para navegación principal
 */
export default Navbar;
