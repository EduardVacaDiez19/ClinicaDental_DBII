const About = () => {
    return (
        <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Nosotros</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Clinica Dental Vaca Diez
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        Más de 20 años de experiencia cuidando sonrisas.
                    </p>
                </div>

                <div className="mt-10">
                    <div className="prose prose-indigo prose-lg text-gray-500 mx-auto">
                        <p>
                            En Clinica Dental Vaca Diez, nos dedicamos a ofrecer la mejor atención odontológica con un enfoque humano y personalizado. Nuestro equipo de profesionales altamente capacitados utiliza la última tecnología para garantizar tratamientos efectivos y sin dolor.
                        </p>
                        <p className="mt-4">
                            Nuestra misión es devolver la confianza a nuestros pacientes a través de una sonrisa saludable y radiante.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
