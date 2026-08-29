import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class OfertaAcademicaService {

  constructor(private apiService: ApiService) { }
  private empresaOfertaActual = 1;

  private getIdEmpresa(): number {
    const tieneSesion = localStorage.getItem('isLoggedin') === 'true'
      && !!localStorage.getItem('Id_Usuario')
      && !!localStorage.getItem('Id_Empresa');
    const empresaSesion = Number(localStorage.getItem('Id_Empresa') || '0');
    return tieneSesion && empresaSesion ? empresaSesion : 1;
  }

  async cargarCarreras(idEmpresa = this.getIdEmpresa(), permitirFallback = true) {
    const sql = `
      SELECT
        c.Id_Carrera,
        c.Codigo,
        c.Carrera,
        c.Descripcion,
        c.Requisito,
        c.Duracion,
        c.Creditos,
        c.Nivel,
        c.Id_Facultad,
        f.Facultad,
        COUNT(DISTINCT cc.Id_Curso) AS Total_Cursos,
        COALESCE(SUM(CAST(NULLIF(cu.Creditos, '') AS UNSIGNED)), 0) AS Total_Creditos
      FROM Edu_Carrera c
      LEFT JOIN Edu_Facultad f
        ON f.Id_Facultad = c.Id_Facultad
      LEFT JOIN Edu_Curso_Carrera cc
        ON cc.Id_Carrera = c.Id_Carrera
        AND cc.Id_Empresa = c.Id_Empresa
      LEFT JOIN Edu_Curso cu
        ON cu.Id_Curso = cc.Id_Curso
        AND cu.Id_Empresa = c.Id_Empresa
        AND cu.Estado = 1
      WHERE c.Id_Empresa = ${idEmpresa}
        AND c.Estado = 1
        AND c.Codigo NOT IN ('CGPE01')
      GROUP BY
        c.Id_Carrera,
        c.Codigo,
        c.Carrera,
        c.Descripcion,
        c.Requisito,
        c.Duracion,
        c.Creditos,
        c.Nivel,
        c.Id_Facultad,
        f.Facultad
      ORDER BY COALESCE(f.Facultad, 'Programas sin facultad'), c.Nivel, c.Carrera
    `;

    const data = await this.apiService.postRecord(sql);
    const total = Number(data?.total || data?.data?.length || 0);
    if (total > 0) {
      this.empresaOfertaActual = idEmpresa;
      return data;
    }

    if (permitirFallback && idEmpresa !== 7) {
      return await this.cargarCarreras(1, false);
    }

    this.empresaOfertaActual = 1;
    return data || { success: 'false', total: 0, data: [] };
  }

  async cargarPlanEstudios(idCarrera: any) {
    const idEmpresa = this.empresaOfertaActual || 1;
    const id = Number(idCarrera);
    if (!id) {
      return { success: 'false', total: 0, data: [] };
    }

    const sql = `
      SELECT
        cc.Id_Curso_Carrera,
        cc.Bloque,
        cu.Id_Curso,
        cu.Codigo,
        cu.Curso,
        cu.Descripcion,
        cu.Requisitos,
        cu.Creditos,
        cu.Horas,
        cu.Imagen
      FROM Edu_Curso_Carrera cc
      INNER JOIN Edu_Curso cu
        ON cu.Id_Curso = cc.Id_Curso
        AND cu.Id_Empresa = cc.Id_Empresa
      WHERE cc.Id_Empresa = ${idEmpresa}
        AND cc.Id_Carrera = ${id}
        AND cu.Estado = 1
      ORDER BY CAST(NULLIF(cc.Bloque, '') AS UNSIGNED), cu.Codigo, cu.Curso
    `;

    return await this.apiService.postRecord(sql);
  }

  async obtenerPersonaSesion() {
    const idEmpresa = this.getIdEmpresa();
    const idUsuario = Number(localStorage.getItem('Id_Usuario') || '0');
    if (!idUsuario) {
      return { success: 'false', total: 0, data: [] };
    }

    const sql = `
      SELECT Id_Persona
      FROM Gen_Persona
      WHERE Id_Empresa = ${idEmpresa}
        AND Id_Usuario = ${idUsuario}
      LIMIT 1
    `;

    return await this.apiService.postRecord(sql);
  }

  async asignarCarrera(idCarrera: any, idPersona: any) {
    const idEmpresa = this.getIdEmpresa();
    const carrera = Number(idCarrera);
    const persona = Number(idPersona);
    if (!carrera || !persona) {
      return { success: 'false', message: 'No se pudo identificar la carrera o el estudiante.' };
    }

    const existente = await this.apiService.postRecord(`
      SELECT Id_Carrera_Estudiante
      FROM Edu_Carrera_Estudiante
      WHERE Id_Empresa = ${idEmpresa}
        AND Id_Persona = ${persona}
        AND Id_Carrera = ${carrera}
      LIMIT 1
    `);

    if (Number(existente?.total || 0) > 0) {
      const id = Number(existente.data?.[0]?.Id_Carrera_Estudiante);
      return await this.apiService.postRecord(`
        UPDATE Edu_Carrera_Estudiante
        SET Estado = 1
        WHERE Id_Empresa = ${idEmpresa}
          AND Id_Carrera_Estudiante = ${id}
      `);
    }

    return await this.apiService.insertRecord({
      table: 'Edu_Carrera_Estudiante',
      fields: 'Id_Persona,Id_Carrera,Estado',
      values: `'${persona}','${carrera}',1`
    });
  }
}
