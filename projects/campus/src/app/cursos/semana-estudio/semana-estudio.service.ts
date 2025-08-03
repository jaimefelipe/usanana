import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class SemanaEstudioService {

constructor(
  private apiService:ApiService
) { }

  async leerInfoSemana(Id_Semana){
    let sqlConfig = {
        table: 'Lms_SemanaCurso',
        fields: 'Titulo,RutaAprendizaje,Fecha_Inicio,Fecha_Limite',
        where: 'Id_Semana = ' + Id_Semana
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async leerRecursosSemana(Id_Semana){
    let sqlConfig = {
        table: 'Lms_Recurso',
        fields: 'Id_Recurso,Titulo,Tipo,IF(Tipo = 1, Contenido, Url) AS Contenido',
        where: 'Id_Semana = ' + Id_Semana
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async leerActividadesSemana(Id_Semana){
    let sqlConfig = {
        table: 'Lms_Actividad',
        fields: 'Id_Actividad,Nombre,Tipo',
        where: 'Id_Semana = ' + Id_Semana
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }


}
