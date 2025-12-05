CREATE OR ALTER PROCEDURE CancelarCita
    @citaId INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verificar si la cita existe
        IF NOT EXISTS (SELECT 1 FROM Citas WHERE CitaID = @citaId)
        BEGIN
            THROW 50001, 'La cita no existe.', 1;
        END

        -- Eliminar la cita
        DELETE FROM Citas WHERE CitaID = @citaId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO
