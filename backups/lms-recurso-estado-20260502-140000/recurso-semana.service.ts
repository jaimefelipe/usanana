import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class RecursoSemanaService {

constructor( private apiService:ApiService) { }
  async getRecursos(Id_Semana: string) {
    const sqlConfig = {
      table: 'Lms_Recurso',
      fields: 'Id_Recurso, Id_Semana, Titulo, Tipo, URL,Contenido',
      where: 'Id_Semana = ' + Id_Semana + ' and Estado = 1',
      orderField: 'Id_Recurso',
      orderDirection: ' ASC '
    };
    return await this.apiService.executeSqlSyn(sqlConfig).then(r => r.data || []);
  }

  async guardarRecurso(Recurso: any) {
    if (!Recurso.Id_Recurso) {
      // INSERT
      const sql = {
        table: 'Lms_Recurso',
        fields: 'Id_Semana, Titulo, Tipo, URL,Contenido ',
        values: `'${Recurso.Id_Semana}', '${Recurso.Titulo}', '${Recurso.Tipo}', '${Recurso.URL}', '${Recurso.Contenido}'`
      };
      return await this.apiService.insertRecord(sql);
    } else {
      // UPDATE
      const sql = {
        table: 'Lms_Recurso',
        fields: `Titulo='${Recurso.Titulo}', Tipo='${Recurso.Tipo}', URL='${Recurso.URL}', Contenido='${Recurso.Contenido}'`,
        where: `Id_Recurso=${Recurso.Id_Recurso}`
      };
      return await this.apiService.updateRecord(sql);
    }
  }

  async eliminarRecurso(Id_Recurso: string) {
    const sql = {
        table: 'Lms_Recurso',
        fields: `Estado='0'`,
        where: `Id_Recurso=${Id_Recurso}`
      };
      return await this.apiService.updateRecord(sql);
  }

  async subirArchivo(file){
    return await this.apiService.loadPublicFile(file);
  }
}
