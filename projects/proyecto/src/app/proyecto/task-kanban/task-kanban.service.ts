import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskKanbanService {

  constructor(private apiService: ApiService) {}

  async leerProyectosHijos(Id_Proyecto?) {
    let idEmpresa = localStorage.getItem("Id_Empresa");
    let idUsuario = localStorage.getItem("Id_Usuario");

    let sql = `CALL pro_Obtener_Proyectos_Hijos(${Id_Proyecto}, ${idEmpresa}, ${idUsuario})`;
    return await this.apiService.postRecord(sql);
}
  async updateProyectStatus(Id_Proyecto,Estado){
    let sql = {
      table: 'Pro_Proyecto',
      fields: 'Estado=\'' + Estado
      + '\'',
      where: 'Id_Proyecto=' + Id_Proyecto
    };
    return await this.apiService.updateRecord(sql,2);
  }
}
