import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class AulaVirtualService {


  constructor(private apiService: ApiService) {}

  async getAulas(paginacion: any, filtro: string = '') {
  const sqlConfig: any = {
    table: 'Lms_AulaVirtual inner Join Edu_Grupo on Lms_AulaVirtual.Id_Grupo =  Edu_Grupo.Id_Grupo inner Join Edu_Curso on Edu_Grupo.Id_Curso = Edu_Curso.Id_Curso inner Join Gen_Persona on Edu_Grupo.Id_Profesor = Gen_Persona.Id_Persona',
    fields: 'Id_AulaVirtual,Lms_AulaVirtual.Id_Grupo,Bienvenida, Edu_Grupo.Nombre as Grupo, Gen_Persona.Nombre as Profesor,Lms_AulaVirtual.Activo,Edu_Curso.Curso ',
    order: 'Lms_AulaVirtual.Id_AulaVirtual desc',
    limit: paginacion.LastRow,
    offset: paginacion.FirstRow - 1
  };

  if (filtro && filtro.trim() !== '') {
    sqlConfig.where += ` AND (Bienvenida LIKE '%${filtro}%' OR Link_Reglamento LIKE '%${filtro}%')`;
  }

  return await this.apiService.executeSqlSyn(sqlConfig);
}

  async saveAula(aula: any, userId: number = null) {
    if (!aula.Id_AulaVirtual || aula.Id_AulaVirtual === '') {
      // INSERT
      const sql = {
        table: 'Lms_AulaVirtual',
        fields: 'Id_Grupo, Bienvenida, Link_Reglamento, Link_Etiqueta, Activo' +
                (userId ? ', Creado_Por' : ''),
        values: `'${aula.Id_Grupo}', '${aula.Bienvenida}', '${aula.Link_Reglamento}', '${aula.Link_Etiqueta}', '${aula.Activo ? 1 : 0}'` +
                (userId ? `, '${userId}'` : '')
      };
      return await this.apiService.insertRecord(sql);
    } else {
      // UPDATE
      const sql = {
        table: 'Lms_AulaVirtual',
        values:
          `Id_Grupo = '${aula.Id_Grupo}', ` +
          `Bienvenida = '${aula.Bienvenida}', ` +
          `Link_Reglamento = '${aula.Link_Reglamento}', ` +
          `Link_Etiqueta = '${aula.Link_Etiqueta}', ` +
          `Activo = '${aula.Activo ? 1 : 0}', ` +
          `Modificado_El = NOW()` +
          (userId ? `, Modificado_Por = '${userId}'` : ''),
        where: `Id_AulaVirtual = ${aula.Id_AulaVirtual}`
      };
      return await this.apiService.updateRecord(sql);
    }
  }
}
