import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProyGanttService {

  constructor(private apiService: ApiService) {}

  async leerItems(Id){
    let param = Id+'&e=' + localStorage.getItem('Id_Empresa');
    let data = await this.apiService.postScript('https://toxo.work/core/db/eps_leer_tareas_gantt.php',param);
    return data;
  }
  async LeerMiembros(){
    let sqlConfig = {
      table: 'Pro_Miembro inner Join Gen_Persona on Pro_Miembro.Id_Persona = Gen_Persona.Id_Persona',
      Distinct:true,
      fields: 'Pro_Miembro.Id_Persona,Nombre as name'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async actualizarItem(taskId,Start,End){
    let sql = {
      table: 'Pro_Proyecto',
      fields: 'Inicio=\''+ Start
      + '\',Fin=\''+ End
      + '\'',
      where: 'Id_Proyecto=' + taskId
    };
    return await this.apiService.updateRecord(sql);
  }

}
