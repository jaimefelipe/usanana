import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class FullService {

constructor(
  private apiService:ApiService
) { }

  async CargarCursosUsuario() {
    const idEmpresa = Number(localStorage.getItem('Id_Empresa'));
    const idUsuario = Number(localStorage.getItem('Id_Usuario'));

    if(!idEmpresa || !idUsuario){
      return { data: [], total: 0, success: 'false' };
    }

    // Facultad/Carrera se resuelven acotadas a las carreras activas del alumno
    // (Edu_Carrera_Estudiante), para poder filtrar cuando esta matriculado en
    // varias. Un curso compartido entre varias de sus carreras se agrupa con
    // GROUP_CONCAT para no duplicar la tarjeta del curso.
    const sql = `
      SELECT
        p.Id_Persona, m.Id_Matricula, md.Id_Grupo, g.Id_Curso,
        c.Codigo, c.Curso, g.Nombre AS Grupo, g.Modalidad, g.Dia, g.Hora,
        profesor.Nombre AS Profesor, pa.Bloque, pa.Anio,
        IF(av.Imagen IS NOT NULL AND LENGTH(av.Imagen) > 0, av.Imagen, c.Imagen) AS Imagen,
        MIN(ca.Id_Carrera) AS Id_Carrera,
        GROUP_CONCAT(DISTINCT ca.Carrera ORDER BY ca.Carrera SEPARATOR ', ') AS Carrera,
        MIN(fa.Id_Facultad) AS Id_Facultad,
        GROUP_CONCAT(DISTINCT fa.Facultad ORDER BY fa.Facultad SEPARATOR ', ') AS Facultad
      FROM Gen_Persona p
      INNER JOIN Edu_Matricula m ON p.Id_Persona = m.Id_Persona
      INNER JOIN Edu_Matricula_Detalle md ON m.Id_Matricula = md.Id_Matricula
      INNER JOIN Edu_Grupo g ON md.Id_Grupo = g.Id_Grupo
      INNER JOIN Edu_Curso c ON g.Id_Curso = c.Id_Curso
      LEFT JOIN Lms_AulaVirtual av ON av.Id_Grupo = g.Id_Grupo AND av.Activo = 1
      LEFT JOIN Gen_Persona profesor ON profesor.Id_Persona = g.Id_Profesor
      LEFT JOIN Edu_Periodo_Academico pa ON pa.Id_Periodo_Academico = g.Id_Periodo
      LEFT JOIN Edu_Carrera_Estudiante ce ON ce.Id_Persona = p.Id_Persona AND ce.Estado = 1
      LEFT JOIN Edu_Curso_Carrera cc ON cc.Id_Curso = c.Id_Curso AND cc.Id_Carrera = ce.Id_Carrera
      LEFT JOIN Edu_Carrera ca ON ca.Id_Carrera = cc.Id_Carrera
      LEFT JOIN Edu_Facultad fa ON fa.Id_Facultad = ca.Id_Facultad
      WHERE p.Id_Empresa = ${idEmpresa}
        AND p.Id_Usuario = ${idUsuario}
        AND md.Estado = 1
        AND c.Estado = 1
        AND g.Estado = 1
        AND md.Id_Matricula_Detalle = (
          SELECT MAX(md2.Id_Matricula_Detalle)
          FROM Edu_Matricula_Detalle md2
          INNER JOIN Edu_Matricula m2 ON m2.Id_Matricula = md2.Id_Matricula
          INNER JOIN Edu_Grupo g2 ON g2.Id_Grupo = md2.Id_Grupo
          WHERE m2.Id_Persona = p.Id_Persona
            AND m2.Id_Empresa = p.Id_Empresa
            AND md2.Estado = 1
            AND g2.Estado = 1
            AND g2.Id_Curso = g.Id_Curso
            AND g2.Id_Periodo = g.Id_Periodo
        )
      GROUP BY p.Id_Persona, m.Id_Matricula, md.Id_Grupo, g.Id_Curso, c.Codigo, c.Curso,
        g.Nombre, g.Modalidad, g.Dia, g.Hora, profesor.Nombre, pa.Bloque, pa.Anio, Imagen
      ORDER BY c.Codigo, g.Nombre
    `;
    return await this.apiService.postRecord(sql);
  }

}
