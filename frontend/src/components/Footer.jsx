const Footer = () => {
    return (
        <footer className="bg-secondary text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Clinica Dental Vaca Diez</h3>
                        <p className="text-gray-300">
                            Cuidando tu sonrisa con la mejor tecnología y profesionales expertos.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contacto</h3>
                        <p className="text-gray-300">Av. Principal #123</p>
                        <p className="text-gray-300">Tel: (123) 456-7890</p>
                        <p className="text-gray-300">Email: info@vacadiez.com</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Horario</h3>
                        <p className="text-gray-300">Lunes - Viernes: 9:00 - 19:00</p>
                        <p className="text-gray-300">Sábado: 9:00 - 13:00</p>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center">
                    <p className="text-gray-400">&copy; 2024 Clinica Dental Vaca Diez. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
