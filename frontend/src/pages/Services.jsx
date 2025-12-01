const Services = () => {
    return (
        <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Nuestros Servicios
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Ofrecemos una amplia gama de tratamientos dentales para cuidar de tu salud bucal.
                    </p>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        { title: 'Limpieza Dental', desc: 'Eliminación de placa y sarro para prevenir enfermedades.' },
                        { title: 'Blanqueamiento', desc: 'Tratamiento estético para aclarar el tono de tus dientes.' },
                        { title: 'Ortodoncia', desc: 'Corrección de la posición de los dientes con brackets o alineadores.' },
                        { title: 'Implantes', desc: 'Reemplazo de dientes perdidos con raíces artificiales de titanio.' },
                        { title: 'Endodoncia', desc: 'Tratamiento de conductos para salvar dientes dañados.' },
                        { title: 'Odontopediatría', desc: 'Atención dental especializada para niños.' },
                    ].map((service, index) => (
                        <div key={index} className="pt-6">
                            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                <div className="-mt-6">
                                    <div className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{service.title}</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        {service.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
