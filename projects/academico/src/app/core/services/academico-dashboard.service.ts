import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

export interface AcademicoDashboardKpis {
  carrerasActivas: number;
  cursosActivos: number;
  gruposActivos: number;
  matriculasPeriodo: number;
  periodosAbiertos: number;
  aulasActivas: number;
}

@Injectable({
  providedIn: 'root'
})
export class AcademicoDashboardService {
  constructor(private apiService: ApiService) {}

  private async fetchCount(sql: string): Promise<number> {
    try {
      const data = await this.apiService.postRecord(sql);
      const raw =
        data?.data?.[0]?.total ??
        data?.data?.[0]?.TOTAL ??
        data?.data?.[0]?.Total;
      const value = Number(raw);
      return Number.isFinite(value) ? value : 0;
    } catch {
      return 0;
    }
  }

  async loadKpis(): Promise<AcademicoDashboardKpis> {
    const empresa = localStorage.getItem('Id_Empresa');
    const whereEmpresa = empresa ? `Id_Empresa = ${empresa}` : '1=1';
    const whereEmpresaMatricula = empresa
      ? `Edu_Matricula.Id_Empresa = ${empresa}`
      : '1=1';

    const queries = {
      carrerasActivas: `SELECT COUNT(*) AS total FROM Edu_Carrera WHERE ${whereEmpresa} AND Estado = 1`,
      cursosActivos: `SELECT COUNT(*) AS total FROM Edu_Curso WHERE ${whereEmpresa} AND Estado = 1`,
      gruposActivos: `SELECT COUNT(*) AS total FROM Edu_Grupo WHERE ${whereEmpresa} AND Estado = 1`,
      periodosAbiertos: `SELECT COUNT(*) AS total FROM Edu_Periodo_Academico WHERE ${whereEmpresa} AND Estado = 1`,
      matriculasPeriodo: `SELECT COUNT(*) AS total FROM Edu_Matricula INNER JOIN Edu_Periodo_Academico ON Edu_Matricula.Id_Periodo = Edu_Periodo_Academico.Id_Periodo_Academico WHERE Edu_Periodo_Academico.Estado = 1 AND ${whereEmpresaMatricula}`,
      aulasActivas: `SELECT COUNT(*) AS total FROM Lms_AulaVirtual WHERE ${whereEmpresa} AND Activo = 1`
    };

    const [
      carrerasActivas,
      cursosActivos,
      gruposActivos,
      periodosAbiertos,
      matriculasPeriodo,
      aulasActivas
    ] = await Promise.all([
      this.fetchCount(queries.carrerasActivas),
      this.fetchCount(queries.cursosActivos),
      this.fetchCount(queries.gruposActivos),
      this.fetchCount(queries.periodosAbiertos),
      this.fetchCount(queries.matriculasPeriodo),
      this.fetchCount(queries.aulasActivas)
    ]);

    return {
      carrerasActivas,
      cursosActivos,
      gruposActivos,
      matriculasPeriodo,
      periodosAbiertos,
      aulasActivas
    };
  }
}
