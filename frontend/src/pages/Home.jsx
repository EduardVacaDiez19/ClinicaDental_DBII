import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-secondary overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-secondary sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Tu sonrisa es</span>{' '}
                                    <span className="block text-primary xl:inline">nuestra prioridad</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    En Clinica Dental Vaca Diez, combinamos experiencia y tecnología para brindarte la mejor atención odontológica.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-sky-600 md:py-4 md:text-lg md:px-10">
                                            Agendar Cita
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link to="/services" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                                            Ver Servicios
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                        src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
                        alt="Dentist working on patient"
                    />
                </div>
            </div>

            {/* Services Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Servicios</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Tratamientos Integrales
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Ofrecemos una amplia gama de servicios dentales para toda la familia.
                        </p>
                    </div>

                    <div className="mt-10">
                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            {[
                                {
                                    name: 'Ortodoncia',
                                    description: 'Corrección de la posición de los dientes y mandíbula.',
                                },
                                {
                                    name: 'Implantes Dentales',
                                    description: 'Reemplazo de dientes perdidos con apariencia natural.',
                                },
                                {
                                    name: 'Blanqueamiento',
                                    description: 'Mejora la estética de tu sonrisa con nuestros tratamientos.',
                                },
                                {
                                    name: 'Odontopediatría',
                                    description: 'Atención especializada para los más pequeños.',
                                },
                            ].map((service) => (
                                <div key={service.name} className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                            {/* Icon placeholder */}
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{service.name}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500">{service.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
