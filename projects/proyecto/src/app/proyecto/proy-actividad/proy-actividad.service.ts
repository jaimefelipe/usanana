import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root' 
})
export class ProyActividadService {
  constructor(private apiService: ApiService) {}
  
  async leerProyecto(Id_Proyecto){
    let sqlConfig = {
      table: 'Pro_Proyecto',
      fields: 'Id_Proyecto,Tipo,Nivel,Codigo,Padre,Nombre,Descripcion,Objetivo,Alcance,Restricciones,Inicio,Fin',
      where:"Id_Proyecto = " + Id_Proyecto
    }
    return await this.apiService.executeSqlSyn(sqlConfig);

  }
  async newProyecto(Proyecto){
    let sql = {
      table: 'Pro_Proyecto',
      fields: 'Tipo,Nivel,Codigo,Padre,Nombre,Descripcion,Objetivo,Alcance,Restricciones,Inicio,Fin',
      values: '\'' + Proyecto.Tipo
      + '\',\'' + Proyecto.Nivel
      + '\',\'' + Proyecto.Codigo
      + '\',\'' + Proyecto.Padre
      + '\',\'' + Proyecto.Nombre
      + '\',\'' + Proyecto.Descripcion
      + '\',\'' + Proyecto.Objetivo
      + '\',\'' + Proyecto.Alcance
      + '\',\'' + Proyecto.Restricciones
      + '\',\'' + Proyecto.Inicio
      + '\',\'' + Proyecto.Fin
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateProyecto(Proyecto){
    let sql = {
      table: 'Pro_Proyecto',
      fields: 'Tipo=\'' + Proyecto.Tipo
      + '\',Nivel=\'' + Proyecto.Nivel
      + '\',Codigo=\'' + Proyecto.Codigo
      + '\',Padre=\'' + Proyecto.Padre
      + '\',Nombre=\''+ Proyecto.Nombre
      + '\',Descripcion=\''+ Proyecto.Descripcion
      + '\',Objetivo=\''+ Proyecto.Objetivo
      + '\',Alcance=\''+ Proyecto.Alcance
      + '\',Restricciones=\''+ Proyecto.Restricciones
      + '\',Inicio=\''+ Proyecto.Inicio
      + '\',Fin=\''+ Proyecto.Fin
      + '\'',
      where: 'Id_Proyecto=' + Proyecto.Id_Proyecto
    };
    return await this.apiService.updateRecord(sql);
  }

  async getLastProyectId(Nivel){
    //Obtener el Id del ultimo registro
    let sqlConfig = {
      table: 'Pro_Proyecto',
      fields: 'Id_Proyecto,Codigo',
      where: 'Nivel = '+ Nivel
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
