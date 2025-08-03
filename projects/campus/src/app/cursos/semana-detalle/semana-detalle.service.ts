import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class SemanaDetalleService {

  constructor(
    private apiService:ApiService
  ) { }

  async leerRecursosSemana(Id_Semana){
    let sqlConfig = {
        table: 'Lms_Recurso',
        fields: 'Id_Recurso,Titulo',
        where: 'Id_Semana = ' + Id_Semana
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async leerActividadesSemana(Id_Semana){
    let sqlConfig = {
        table: 'Lms_Actividad',
        fields: 'Id_Actividad,Nombre',
        where: 'Id_Semana = ' + Id_Semana
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
