import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class MatriculaEstudianteService {

constructor(
  private apiService:ApiService
) { }

 async cargarMatriculas(Id_Grupo?) {
    const idEmpresa = Number(localStorage.getItem('Id_Empresa'));
    const idUsuario = Number(localStorage.getItem('Id_Usuario'));
    const filtroGrupo = Number(Id_Grupo)
      ? `AND g.Id_Grupo = ${Number(Id_Grupo)}`
      : '';

    if (!idEmpresa || !idUsuario) {
      return { success: 'false', total: 0, data: [] };
    }

    const sql = `
      SELECT
        g.Id_Grupo,
        g.Id_Curso,
        alumno.Id_Persona,
        g.Id_Periodo,
        g.Nombre AS Grupo,
        g.Aula,
        g.Dia,
        g.Hora,
        g.Modalidad,
        profesor.Nombre AS Profesor,
        c.Curso,
        c.Codigo,
        c.Creditos,
        MIN(cc.Bloque) AS Bloque,
        pa.Periodo,
        pa.Bloque AS Periodo_Bloque,
        pa.Anio,
        GROUP_CONCAT(DISTINCT ca.Carrera ORDER BY ca.Carrera SEPARATOR ', ') AS Carrera,
        GROUP_CONCAT(DISTINCT ca.Id_Carrera ORDER BY ca.Carrera SEPARATOR ',') AS Id_Carrera_Lista,
        GROUP_CONCAT(DISTINCT fa.Facultad ORDER BY fa.Facultad SEPARATOR ', ') AS Facultad,
        GROUP_CONCAT(DISTINCT fa.Id_Facultad ORDER BY fa.Facultad SEPARATOR ',') AS Id_Facultad_Lista
      FROM Gen_Persona alumno
      INNER JOIN Edu_Carrera_Estudiante ce
        ON ce.Id_Persona = alumno.Id_Persona
        AND ce.Estado = 1
      INNER JOIN Edu_Carrera ca
        ON ca.Id_Carrera = ce.Id_Carrera
      LEFT JOIN Edu_Facultad fa
        ON fa.Id_Facultad = ca.Id_Facultad
      INNER JOIN Edu_Curso_Carrera cc
        ON cc.Id_Carrera = ce.Id_Carrera
      INNER JOIN Edu_Curso c
        ON c.Id_Curso = cc.Id_Curso
      INNER JOIN Edu_Grupo g
        ON g.Id_Curso = c.Id_Curso
      INNER JOIN Edu_Periodo_Academico pa
        ON pa.Id_Periodo_Academico = g.Id_Periodo
        AND pa.Estado = 1
      LEFT JOIN Gen_Persona profesor
        ON profesor.Id_Persona = g.Id_Profesor
      WHERE alumno.Id_Empresa = ${idEmpresa}
        AND alumno.Id_Usuario = ${idUsuario}
        AND g.Id_Empresa = ${idEmpresa}
        AND g.Estado = 1
        AND pa.Id_Empresa = ${idEmpresa}
        AND c.Id_Empresa = ${idEmpresa}
        AND c.Estado = 1
        ${filtroGrupo}
        AND c.Id_Curso NOT IN (
          SELECT g2.Id_Curso
          FROM Edu_Matricula_Detalle md
          INNER JOIN Edu_Matricula m
            ON m.Id_Matricula = md.Id_Matricula
          INNER JOIN Edu_Grupo g2
            ON g2.Id_Grupo = md.Id_Grupo
          WHERE m.Id_Persona = alumno.Id_Persona
            AND md.Estado IN (1, 2, 4, 6)
        )
      GROUP BY
        g.Id_Grupo,
        g.Id_Curso,
        alumno.Id_Persona,
        g.Id_Periodo,
        g.Nombre,
        g.Aula,
        g.Dia,
        g.Hora,
        g.Modalidad,
        profesor.Nombre,
        c.Curso,
        c.Codigo,
        c.Creditos,
        pa.Periodo,
        pa.Bloque,
        pa.Anio
      ORDER BY c.Codigo, c.Curso, g.Nombre
    `;

    return await this.apiService.postRecord(sql);
  }

  async matricularCurso(Curso) {
    const idEmpresa = Number(localStorage.getItem('Id_Empresa'));
    const idGrupo = Number(Curso?.Id_Grupo);

    if (!idEmpresa || !idGrupo) {
      return { success: 'false', message: 'No se pudo identificar el curso a matricular.' };
    }

    const disponible = await this.cargarMatriculas(idGrupo);
    if (!disponible || Number(disponible['total'] || 0) === 0 || !disponible['data']?.[0]) {
      return { success: 'false', message: 'Este curso ya no esta disponible para matricula.' };
    }

    const cursoDisponible = disponible['data'][0];
    const idPersona = Number(cursoDisponible.Id_Persona);
    const idPeriodo = Number(cursoDisponible.Id_Periodo);
    const idCurso = Number(cursoDisponible.Id_Curso);

    const duplicado = await this.buscarCursoActivo(idEmpresa, idPersona, idCurso);
    if (Number(duplicado?.['total'] || 0) > 0) {
      return { success: 'false', message: 'Este curso ya fue solicitado o matriculado.' };
    }

    const matricula = await this.buscarMatriculaPeriodo(idEmpresa, idPersona, idPeriodo);
    let idMatricula = Number(matricula?.['data']?.[0]?.Id_Matricula);

    if (!idMatricula) {
      const nuevaMatricula = await this.apiService.insertRecord({
        table: 'Edu_Matricula',
        fields: 'Id_Persona,Id_Periodo',
        values: `'${idPersona}','${idPeriodo}'`
      });

      if (!nuevaMatricula || nuevaMatricula['success'] !== 'true') {
        return {
          success: 'false',
          message: nuevaMatricula?.['Error'] || nuevaMatricula?.['error'] || 'No se pudo crear la matricula.'
        };
      }

      idMatricula = Number(nuevaMatricula['Identity']);
    }

    if (!idMatricula) {
      return { success: 'false', message: 'No se pudo obtener el numero de matricula.' };
    }

    const detalle = await this.apiService.insertRecord({
      table: 'Edu_Matricula_Detalle',
      fields: 'Id_Matricula,Id_Grupo,Estado',
      values: `'${idMatricula}','${idGrupo}','6'`
    });

    if (!detalle || detalle['success'] !== 'true') {
      return {
        success: 'false',
        message: detalle?.['Error'] || detalle?.['error'] || 'No se pudo registrar el curso en prematricula.'
      };
    }

    return {
      success: 'true',
      Id_Matricula: idMatricula,
      message: 'Solicitud de matricula registrada en estado de prematricula.'
    };
  }

  private async buscarMatriculaPeriodo(idEmpresa, idPersona, idPeriodo) {
    const sql = `
      SELECT Id_Matricula
      FROM Edu_Matricula
      WHERE Id_Empresa = ${idEmpresa}
        AND Id_Persona = ${idPersona}
        AND Id_Periodo = ${idPeriodo}
      ORDER BY Id_Matricula DESC
      LIMIT 1
    `;

    return await this.apiService.postRecord(sql);
  }

  private async buscarCursoActivo(idEmpresa, idPersona, idCurso) {
    const sql = `
      SELECT md.Id_Matricula_Detalle
      FROM Edu_Matricula_Detalle md
      INNER JOIN Edu_Matricula m
        ON m.Id_Matricula = md.Id_Matricula
      INNER JOIN Edu_Grupo g
        ON g.Id_Grupo = md.Id_Grupo
      WHERE m.Id_Empresa = ${idEmpresa}
        AND m.Id_Persona = ${idPersona}
        AND g.Id_Curso = ${idCurso}
        AND md.Estado IN (1, 2, 4, 6)
      LIMIT 1
    `;

    return await this.apiService.postRecord(sql);
  }


}
