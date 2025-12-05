const Module = require('module');
const originalRequire = Module.prototype.require;

// Mock database module
const mockPool = {
    request: () => ({
        input: function() { return this; },
        query: async (query) => {
            // console.log("CAPTURED QUERY:\n", query);
            
            // Check for safety mechanisms
            const hasOverlapCheck = query.includes("IF EXISTS") && query.includes("SELECT 1 FROM Citas");
            const usesStoredProc = query.includes("AgendarCita") && !query.includes("INSERT INTO Citas"); // If it uses SP, it shouldn't raw insert
            
            if (!hasOverlapCheck && !usesStoredProc) {
                 console.log("FAIL: Raw INSERT detected without overlap validation.");
                 // We don't throw here to let the controller finish, but we log the failure
                 return { recordset: [{ NuevaCitaID: 123 }] };
            }
            
            console.log("SUCCESS: Overlap validation found.");
            return { recordset: [{ NuevaCitaID: 123 }] };
        }
    })
};

Module.prototype.require = function(path) {
    if (path.endsWith('config/database')) {
        return {
            getConnection: async () => mockPool,
            sql: { 
                Int: 'Int', Date: 'Date', VarChar: (n) => 'VarChar', NVarChar: 'NVarChar', Time: 'Time' 
            }
        };
    }
    return originalRequire.apply(this, arguments);
};

const controller = require('./controllers/citasController');

async function run() {
    console.log("--- Running Double Booking Validation Test ---");
    const req = {
        body: { pacienteId: 1, odontologoId: 2, fecha: '2025-12-25', hora: '10:00', motivo: 'Test Bug' }
    };
    const res = {
        status: (code) => ({ json: (data) => {} }), 
        json: (data) => {}
    };
    
    try {
        await controller.createCita(req, res);
    } catch (e) {
        console.error("Controller error:", e);
    }
    console.log("--- Test Complete ---");
}

run();
