import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskCalendarService {

  constructor(private apiService: ApiService) {}

  async updateProyectStatus(Id_Proyecto,Start,End,Progreso,Predecesor){
    let sql = {
      table: 'Pro_Proyecto',
      fields: 'Inicio_Planificado=\'' + Start
      + '\',Fin_Planificado=\''+ End
      + '\',Progreso=\''+ Progreso
      + '\',Predecesor=\''+ Predecesor
      + '\'',
      where: 'Id_Proyecto=' + Id_Proyecto
    };
    return await this.apiService.updateRecord(sql,2);
  }
  
  async GetResponsables(){
    let sqlConfig = {
      table: 'Pro_Proyecto  INNER JOIN Gen_Persona g ON Pro_Proyecto.Responsable = g.Id_Persona',
      fields: " DISTINCT g.Id_Persona, g.Nombre_Usuario as OwnerText,  g.Nombre_Usuario as Id, CONCAT('#', LPAD(HEX(g.Id_Persona * 1234567 % 0xFFFFFF), 6, '0')) AS OwnerColor",
      orderField:'g.Id_Persona',
      where: " Pro_Proyecto.Responsable IS NOT NULL"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
