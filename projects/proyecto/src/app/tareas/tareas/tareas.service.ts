import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(private apiService: ApiService) {}

  async getTasksByUser(Id_Usuario){
    let sqlConfig = {
      table: 'Pro_Proyecto JOIN Gen_Persona ON Pro_Proyecto.Responsable = Gen_Persona.Id_Persona',
      fields: 'Pro_Proyecto.Id_Proyecto,Pro_Proyecto.Tipo,Pro_Proyecto.Nivel,Pro_Proyecto.Codigo,Pro_Proyecto.Padre,Pro_Proyecto.Nombre,Pro_Proyecto.Estado,Pro_Proyecto.Inicio_Planificado,Pro_Proyecto.Prioridad,Pro_Proyecto.Estado',
      where: 'Gen_Persona.Id_Usuario ='+Id_Usuario+ ' and Tipo = 7'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}

