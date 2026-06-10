UPDATE Lms_Recurso
SET Estado = 1
WHERE Estado IS NULL
   OR CAST(Estado AS CHAR) = '';
