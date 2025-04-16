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
      where: "Gen_Persona.Id_Usuario ="+Id_Usuario+ " and Tipo = 7 and Pro_Proyecto.Estado !=6"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async getLastTaskByUser(){
    let usuario = localStorage.getItem('Nombre_Usuario');
    let   paginacion = {
      FirstRow: 1,
      LastRow: 1,
      TotalRows: 1
    };
    let sqlConfig = {
      table: 'Pro_Proyecto',
      fields: 'Id_Proyecto,Padre',
      where: "  Nivel = 7  and ( Creado_Por = '"+usuario+"' OR Modificado_Por = '"+usuario+"')",
      orderField: ' COALESCE(Modificado_El, Creado_El)',
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}

