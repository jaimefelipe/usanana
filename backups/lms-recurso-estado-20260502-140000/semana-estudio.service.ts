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
        Empresa:false,
        where: 'Id_Semana = ' + Id_Semana 
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async leerRecursosSemana(Id_Semana){
    let sqlConfig = {
        table: 'Lms_Recurso',
        fields: 'Id_Recurso,Id_Semana,Titulo,Tipo,URL,CASE WHEN Tipo = 1 THEN Contenido ELSE URL END AS Contenido',
        orderField: 'Id_Recurso',
        orderDirection: ' ASC ',
        Empresa:false,
        where: 'Id_Semana = ' + Id_Semana + ' and Estado = 1'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async leerActividadesSemana(Id_Semana){
    let sqlConfig = {
        table: 'Lms_Actividad',
        fields: 'Id_Actividad,Nombre,Tipo,Instrucciones,Fecha_Limite,Puntaje,URL',
        orderField: 'Id_Actividad',
        orderDirection: ' ASC ',
        Empresa:false,
        where: 'Id_Semana = ' + Id_Semana + ' and Estado = 1'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }


}
