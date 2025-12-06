/**
 * Panel de Control Principal
 * 
 * Componente que muestra el dashboard del usuario después del login.
- * Incluye información del usuario, citas programadas, acciones rápidas
-- * y diferenciación de interfaz según rol (admin/usuario normal).
-* 
 * @component
 * @returns {JSX.Element} Dashboard personalizado según el usuario
 * @example
 * // Ruta: /dashboard (requiere autenticación)
 * <Dashboard />
 */

import { useState, useEffect } from 'react';

/**
 * Función del componente Dashboard
 * 
 * Gestiona el estado del usuario, citas y modal de agendamiento.
 * Muestra interfaz diferenciada para administradores y usuarios normales.
 * 
 * @function Dashboard
 * @returns {JSX.Element} Panel de control completo
 */
const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Mock appointments
        setAppointments([
            { id: 1, fecha: '2024-05-20', hora: '10:00', motivo: 'Limpieza General', doctor: 'Dr. Perez' },
            { id: 2, fecha: '2024-06-15', hora: '15:30', motivo: 'Revisión Ortodoncia', doctor: 'Dra. Gomez' },
        ]);
    }, []);

/**
 * Cerrar sesión del usuario
 * 
 * Elimina token y datos de usuario del localStorage
 * y redirige a la página de login
 * 
 * @function handleLogout
 * @returns {void}
 */
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

/**
 * Abrir modal de nueva cita
 * 
 * Muestra el formulario para agendar una cita
 * 
 * @function handleNewAppointment
 * @returns {void}
 */
    const handleNewAppointment = () => {
        setShowModal(true);
    };

/**
 * Confirmar cita y cerrar modal
 * 
 * Simula el proceso de agendamiento y cierra el formulario
 * 
 * @function closeAppointment
 * @returns {void}
 */
    const closeAppointment = () => {
        setShowModal(false);
        alert('Cita agendada exitosamente (Simulación)');
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Bienvenido, {user ? user.nombre : 'Paciente'}
                        {user && user.rol === 'Admin' && <span className="ml-2 text-sm bg-red-100 text-red-800 py-1 px-2 rounded-full">Admin</span>}
                    </h1>
                    <div className="flex space-x-4">
                        {user && user.rol === 'Admin' && (
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                                Gestionar Usuarios
                            </button>
                        )}
                        <button onClick={handleNewAppointment} className="bg-primary hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                            Nueva Cita
                        </button>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                Agendar Nueva Cita
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Seleccione la fecha y el motivo de su consulta.
                                                </p>
                                                <div className="mt-4 space-y-4">
                                                    <input type="date" className="w-full border border-gray-300 rounded-md p-2" />
                                                    <select className="w-full border border-gray-300 rounded-md p-2">
                                                        <option>Limpieza General</option>
                                                        <option>Consulta General</option>
                                                        <option>Ortodoncia</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button onClick={closeAppointment} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-sky-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                                        Confirmar
                                    </button>
                                    <button onClick={() => setShowModal(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Próximas Citas
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Tus citas programadas en la clínica.
                        </p>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {appointments.map((appointment) => (
                                <li key={appointment.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-primary truncate">
                                            {appointment.motivo}
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Confirmada
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                Dr/a. {appointment.doctor}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                {appointment.fecha} a las {appointment.hora}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1 */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Historial Médico
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                Ver
                            </dd>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Pagos Pendientes
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                $0.00
                            </dd>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Mensajes
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                0
                            </dd>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

/**
 * Exportar componente Dashboard
 * 
 * @exports {Function} Componente de panel de control
 */
export default Dashboard;
