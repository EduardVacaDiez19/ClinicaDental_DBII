const { getConnection, sql } = require('../config/database');

/**
 * Obtiene todas las citas del sistema con informacion del paciente y odontologo
 * @async
 * @function getAllCitas
 * @param {Object} req - objeto de peticion Express
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con JSON conteniendo array de citas o error
 * @description retorna todas las citas ordenadas por fecha descendente, incluyendo
 * estado calculado (Realizada/Hoy/Programada) basado en la fecha actual
 */
async function getAllCitas(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT
                c.CitaID,
                c.FechaCita,
                c.HoraCita,
                c.Motivo,
                p.Nombre + ' ' + p.Apellido as Paciente,
                p.PacienteID,
                o.Nombre + ' ' + o.Apellido as Odontologo,
                o.OdontologoID,
                o.Especialidad,
                CASE
                    WHEN c.FechaCita < CAST(GETDATE() AS DATE) THEN 'Realizada'
                    WHEN c.FechaCita = CAST(GETDATE() AS DATE) THEN 'Hoy'
                    ELSE 'Programada'
                END as Estado
            FROM Citas c
            INNER JOIN Pacientes p ON c.PacienteID = p.PacienteID
            INNER JOIN Odontologos o ON c.OdontologoID = o.OdontologoID
            ORDER BY c.FechaCita DESC, c.HoraCita DESC
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo citas:', error);
        res.status(500).json({ error: 'Error al obtener citas' });
    }
}

/**
 * Obtiene una cita especifica por su ID
 * @async
 * @function getCitaById
 * @param {Object} req - objeto de peticion Express
 * @param {string} req.params.id - ID de la cita a buscar
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con JSON de la cita encontrada o error 404
 */
async function getCitaById(req, res) {
    try {
        const { id } = req.params;
        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    c.CitaID,
                    c.PacienteID,
                    c.OdontologoID,
                    c.FechaCita,
                    c.HoraCita,
                    c.Motivo,
                    p.Nombre + ' ' + p.Apellido as Paciente,
                    o.Nombre + ' ' + o.Apellido as Odontologo,
                    o.Especialidad
                FROM Citas c
                INNER JOIN Pacientes p ON c.PacienteID = p.PacienteID
                INNER JOIN Odontologos o ON c.OdontologoID = o.OdontologoID
                WHERE c.CitaID = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error obteniendo cita:', error);
        res.status(500).json({ error: 'Error al obtener cita' });
    }
}

/**
 * Crea una nueva cita en el sistema
 * @async
 * @function createCita
 * @param {Object} req - objeto de peticion Express
 * @param {number} req.body.pacienteId - ID del paciente
 * @param {number} req.body.odontologoId - ID del odontologo
 * @param {string} req.body.fecha - fecha de la cita (formato YYYY-MM-DD)
 * @param {string} req.body.hora - hora de la cita (formato HH:MM)
 * @param {string} req.body.motivo - motivo de la consulta
 * @param {number} [req.body.tratamientoId] - ID del tratamiento asociado (opcional)
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con JSON conteniendo ID de cita creada o error
 * @description valida disponibilidad del odontologo y crea cita con tratamiento opcional
 */
async function createCita(req, res) {
    try {
        const { pacienteId, odontologoId, fecha, hora, motivo, tratamientoId } = req.body;
        console.error('DEBUG - Datos recibidos:', req.body);

        if (!pacienteId || !odontologoId || !fecha || !hora || !motivo) {
            console.error('DEBUG - Faltan datos:', { pacienteId, odontologoId, fecha, hora, motivo });
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const pacienteIdInt = parseInt(pacienteId);
        const odontologoIdInt = parseInt(odontologoId);
        const tratamientoIdInt = tratamientoId ? parseInt(tratamientoId) : null;

        if (isNaN(pacienteIdInt) || isNaN(odontologoIdInt)) {
            return res.status(400).json({ error: 'IDs de paciente u odontólogo inválidos' });
        }

        const pool = await getConnection();

        // Usar INSERT directo para depuración
        const request = pool.request()
            .input('PacienteID', sql.Int, pacienteIdInt)
            .input('OdontologoID', sql.Int, odontologoIdInt)
            .input('Fecha', sql.Date, fecha)
            .input('Hora', sql.VarChar(5), hora)
            .input('Motivo', sql.VarChar, motivo);

        request.input('TratamientoID', sql.Int, tratamientoIdInt || null);

        const result = await request.query(`
                DECLARE @NuevaCitaID INT;

                -- Validar si el odontólogo ya tiene una cita en ese horario
                IF EXISTS (SELECT 1 FROM Citas
                           WHERE OdontologoID = @OdontologoID
                           AND FechaCita = @Fecha
                           AND HoraCita = @Hora)
                BEGIN
                    THROW 51000, 'El odontólogo ya tiene una cita asignada en ese horario.', 1;
                END

                INSERT INTO Citas (PacienteID, OdontologoID, FechaCita, HoraCita, Motivo)
                VALUES (@PacienteID, @OdontologoID, @Fecha, @Hora, @Motivo);

                SET @NuevaCitaID = SCOPE_IDENTITY();

                IF @TratamientoID IS NOT NULL
                BEGIN
                    INSERT INTO DetalleCitaTratamiento (CitaID, TratamientoID, Cantidad, PrecioTotal)
                    SELECT @NuevaCitaID, @TratamientoID, 1, Costo
                    FROM Tratamientos
                    WHERE TratamientoID = @TratamientoID;
                END

                SELECT @NuevaCitaID as NuevaCitaID;
            `);

        res.status(201).json({
            message: 'Cita agendada exitosamente',
            citaId: result.recordset[0].NuevaCitaID
        });
    } catch (error) {
        console.error('Error creando cita:', error);

        // Error específico del trigger o stored procedure
        if (error.message.includes('ya tiene una cita')) {
            return res.status(409).json({ error: 'El odontólogo ya tiene una cita en ese horario' });
        }
        if (error.message.includes('horario')) {
            return res.status(400).json({ error: 'Fuera del horario de atención (08:00 - 20:00)' });
        }

        res.status(500).json({ error: 'Error al crear cita: ' + error.message });
    }
}

/**
 * Actualiza una cita existente
 * @async
 * @function updateCita
 * @param {Object} req - objeto de peticion Express
 * @param {string} req.params.id - ID de la cita a actualizar
 * @param {number} req.body.pacienteId - nuevo ID del paciente
 * @param {number} req.body.odontologoId - nuevo ID del odontologo
 * @param {string} req.body.fecha - nueva fecha de la cita
 * @param {string} req.body.hora - nueva hora de la cita
 * @param {string} req.body.motivo - nuevo motivo de la consulta
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con mensaje de exito o error
 */
async function updateCita(req, res) {
    try {
        const { id } = req.params;
        const { pacienteId, odontologoId, fecha, hora, motivo } = req.body;

        const pool = await getConnection();

        await pool.request()
            .input('id', sql.Int, id)
            .input('pacienteId', sql.Int, pacienteId)
            .input('odontologoId', sql.Int, odontologoId)
            .input('fecha', sql.Date, fecha)
            .input('hora', sql.VarChar(5), hora)
            .input('motivo', sql.NVarChar, motivo)
            .query(`
                UPDATE Citas
                SET PacienteID = @pacienteId,
                    OdontologoID = @odontologoId,
                    FechaCita = @fecha,
                    HoraCita = @hora,
                    Motivo = @motivo
                WHERE CitaID = @id
            `);

        res.json({ message: 'Cita actualizada exitosamente' });
    } catch (error) {
        console.error('Error actualizando cita:', error);
        res.status(500).json({ error: 'Error al actualizar cita' });
    }
}

/**
 * Cancela o elimina una cita del sistema
 * @async
 * @function deleteCita
 * @param {Object} req - objeto de peticion Express
 * @param {string} req.params.id - ID de la cita a cancelar
 * @param {Object} req.user - usuario autenticado del middleware
 * @param {string} req.user.role - rol del usuario (Administrador o Usuario)
 * @param {number} req.user.pacienteId - ID del paciente asociado al usuario
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con mensaje de exito o error
 * @description valida permisos: admin puede cancelar cualquier cita, usuario solo las propias
 */
async function deleteCita(req, res) {
    try {
        const { id } = req.params;
        const user = req.user; // From auth middleware

        // Validar que user existe (middleware ejecutado correctamente)
        if (!user) {
            console.error('[DELETE] Error: req.user is undefined - auth middleware may not have executed');
            return res.status(401).json({ error: 'No autorizado - sesión no válida' });
        }

        console.log(`[DELETE] Request to cancel CitaID: ${id}`);
        console.log(`[DELETE] User: ${JSON.stringify(user)}`);

        const pool = await getConnection();

        // Verificar permisos si no es admin
        if (user.role !== 'Administrador') {
            // Obtener la cita para verificar propiedad
            const citaCheck = await pool.request()
                .input('citaId', sql.Int, id)
                .query('SELECT PacienteID FROM Citas WHERE CitaID = @citaId');

            if (citaCheck.recordset.length === 0) {
                console.log('[DELETE] Cita not found');
                return res.status(404).json({ error: 'Cita no encontrada' });
            }

            const cita = citaCheck.recordset[0];
            console.log(`[DELETE] Cita owner (PacienteID): ${cita.PacienteID}, Requestor (PacienteID): ${user.pacienteId}`);

            // Verificar si el usuario es el paciente dueño de la cita
            // Ensure both are integers for comparison
            if (!user.pacienteId || parseInt(cita.PacienteID) !== parseInt(user.pacienteId)) {
                console.warn(`[DELETE] Access denied. User ${user.username} (PID: ${user.pacienteId}) tried to delete cita ${id} of patient ${cita.PacienteID}.`);
                return res.status(403).json({ error: 'No tiene permiso para cancelar esta cita' });
            }
        }

        // Usar el stored procedure que maneja las relaciones
        await pool.request()
            .input('citaId', sql.Int, id)
            .execute('CancelarCita');

        console.log(`[DELETE] Cita ID: ${id} cancelada exitosamente`);
        res.json({ message: 'Cita cancelada exitosamente' });
    } catch (error) {
        console.error(`[DELETE] Error cancelando cita ID: ${id}`, error);
        res.status(500).json({ error: 'Error al cancelar cita: ' + error.message });
    }
}

/**
 * Obtiene todas las citas de una fecha especifica
 * @async
 * @function getCitasByFecha
 * @param {Object} req - objeto de peticion Express
 * @param {string} req.params.fecha - fecha a consultar (formato YYYY-MM-DD)
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con array de citas de la fecha especificada
 */
async function getCitasByFecha(req, res) {
    try {
        const { fecha } = req.params;
        const pool = await getConnection();

        const result = await pool.request()
            .input('fecha', sql.Date, fecha)
            .query(`
                SELECT
                    c.CitaID,
                    c.HoraCita,
                    c.Motivo,
                    p.Nombre + ' ' + p.Apellido as Paciente,
                    o.Nombre + ' ' + o.Apellido as Odontologo,
                    o.Especialidad
                FROM Citas c
                INNER JOIN Pacientes p ON c.PacienteID = p.PacienteID
                INNER JOIN Odontologos o ON c.OdontologoID = o.OdontologoID
                WHERE c.FechaCita = @fecha
                ORDER BY c.HoraCita
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo citas por fecha:', error);
        res.status(500).json({ error: 'Error al obtener citas' });
    }
}

module.exports = {
    getAllCitas,
    getCitaById,
    createCita,
    updateCita,
    deleteCita,
    getCitasByFecha,
    getDetallePago,
    generarFactura
};

/**
 * Obtiene el detalle de pago de una cita (pre-factura)
 * @async
 * @function getDetallePago
 * @param {Object} req - objeto de peticion Express
 * @param {string} req.params.id - ID de la cita
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con detalle de pago incluyendo tratamientos, descuentos y total
 * @description calcula subtotal de tratamientos, aplica descuento del seguro y verifica si ya fue facturada
 */
async function getDetallePago(req, res) {
    try {
        const { id } = req.params;
        console.log(`[DEBUG] getDetallePago called for ID: ${id}`);
        const pool = await getConnection();

        // 1. Obtener datos de la cita y paciente
        const citaData = await pool.request()
            .input('citaId', sql.Int, id)
            .query(`
                SELECT
                    c.CitaID,
                    c.PacienteID,
                    p.TipoSeguro,
                    ISNULL(s.Descuento, 0) as Descuento
                FROM Citas c
                INNER JOIN Pacientes p ON c.PacienteID = p.PacienteID
                LEFT JOIN Seguros s ON p.TipoSeguro = s.Nombre
                WHERE c.CitaID = @citaId
            `);

        console.log('[DEBUG] Cita Data:', citaData.recordset);

        if (citaData.recordset.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        const { TipoSeguro, Descuento } = citaData.recordset[0];

        // 2. Obtener tratamientos y calcular subtotal
        const tratamientos = await pool.request()
            .input('citaId', sql.Int, id)
            .query(`
                SELECT
                    t.Nombre as NombreTratamiento,
                    dct.PrecioTotal
                FROM DetalleCitaTratamiento dct
                INNER JOIN Tratamientos t ON dct.TratamientoID = t.TratamientoID
                WHERE dct.CitaID = @citaId
            `);

        console.log('[DEBUG] Tratamientos:', tratamientos.recordset);

        let subtotal = 0;
        tratamientos.recordset.forEach(t => {
            subtotal += t.PrecioTotal;
        });

        const totalConDescuento = subtotal * (1 - Descuento);

        // 3. Verificar si ya está facturada
        const facturaCheck = await pool.request()
            .input('citaId', sql.Int, id)
            .query('SELECT FacturaID FROM Facturas WHERE CitaID = @citaId');

        const facturada = facturaCheck.recordset.length > 0;

        res.json({
            citaId: id,
            tipoSeguro: TipoSeguro || 'Ninguno',
            descuentoPorcentaje: Descuento * 100,
            subtotal: subtotal,
            totalPagar: totalConDescuento,
            tratamientos: tratamientos.recordset,
            facturada: facturada
        });

    } catch (error) {
        console.error('Error obteniendo detalle de pago:', error);
        res.status(500).json({ error: 'Error al obtener detalle de pago: ' + error.message });
    }
}

/**
 * Genera la factura final para una cita
 * @async
 * @function generarFactura
 * @param {Object} req - objeto de peticion Express
 * @param {string} req.params.id - ID de la cita a facturar
 * @param {string} [req.body.metodoPago='Efectivo'] - metodo de pago (Efectivo, Tarjeta, etc)
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con mensaje de exito o error
 * @description ejecuta stored procedure sp_GenerarFactura que crea la factura en BD
 */
async function generarFactura(req, res) {
    try {
        const { id } = req.params;
        const { metodoPago } = req.body; // 'Efectivo', 'Tarjeta', etc.
        const pool = await getConnection();

        await pool.request()
            .input('CitaID', sql.Int, id)
            .input('MetodoPago', sql.NVarChar(20), metodoPago || 'Efectivo')
            .execute('sp_GenerarFactura');

        res.json({ message: 'Factura generada exitosamente' });
    } catch (error) {
        console.error('Error generando factura:', error);
        res.status(500).json({ error: 'Error al generar factura: ' + error.message });
    }
}
