import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class SemanaCursoService {

constructor(private apiService: ApiService) {}

  async getAulas() {
    const sql = {
      table: 'Lms_AulaVirtual AV INNER JOIN Edu_Grupo G ON AV.Id_Grupo = G.Id_Grupo',
      fields: 'AV.Id_AulaVirtual, G.Curso, G.Codigo as Grupo',
      where: 'AV.Activo = 1',
      order: 'G.Curso ASC'
    };
    return await this.apiService.executeSqlSyn(sql);
  }

  async getSemanas(Id_AulaVirtual) {
    const sql = {
      table: 'Lms_SemanaCurso',
      fields: 'Id_Semana,Numero_Semana,Titulo,RutaAprendizaje,Fecha_Inicio,Fecha_Limite',
      where: `Id_AulaVirtual = ${Id_AulaVirtual}`,
      order: 'Numero_Semana ASC'
    };
    return await this.apiService.executeSqlSyn(sql);
  }

  async guardarSemana(semana: any) {
    if (!semana.Id_Semana) {
      const insert = {
        table: 'Lms_SemanaCurso',
        fields: 'Id_AulaVirtual, Numero_Semana, Titulo, RutaAprendizaje, Fecha_Inicio, Fecha_Limite',
        values: `'${semana.Id_AulaVirtual}', '${semana.Numero_Semana}', '${semana.Titulo}', '${semana.RutaAprendizaje}', '${semana.Fecha_Inicio}', '${semana.Fecha_Limite}'`
      };
      return await this.apiService.insertRecord(insert);
    } else {
      const update = {
        table: 'Lms_SemanaCurso',
        values: `
          Numero_Semana = '${semana.Numero_Semana}',
          Titulo = '${semana.Titulo}',
          RutaAprendizaje = '${semana.RutaAprendizaje}',
          Fecha_Inicio = '${semana.Fecha_Inicio}',
          Fecha_Limite = '${semana.Fecha_Limite}'
        `,
        where: `Id_Semana = ${semana.Id_Semana}`
      };
      return await this.apiService.updateRecord(update);
    }
  }

  async eliminarSemana(Id_Semana: number) {
    const sql = {
      table: 'Lms_SemanaCurso',
      where: `Id_Semana = ${Id_Semana}`
    };
    //return await this.apiService.deleteRecord(sql);
  }

}
