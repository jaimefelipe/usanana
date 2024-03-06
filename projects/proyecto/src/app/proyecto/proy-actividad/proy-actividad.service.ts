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
      fields: 'Id_Proyecto,Tipo,Nivel,Codigo,Padre,Nombre,Descripcion,Objetivo,Alcance,Restricciones,Inicio,Fin,Estado,Miembros',
      where:"Id_Proyecto = " + Id_Proyecto
    }
    return await this.apiService.executeSqlSyn(sqlConfig);

  }
  async newProyecto(Proyecto){
    let sql = {
      table: 'Pro_Proyecto',
      fields: 'Tipo,Nivel,Codigo,Padre,Nombre,Descripcion,Objetivo,Alcance,Restricciones,Inicio,Fin,Estado,Miembros',
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
      + '\',\'' + Proyecto.Estado
      + '\',\'' + Proyecto.Miembros
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
      + '\',Estado=\''+ Proyecto.Estado
      + '\',Miembros=\''+ Proyecto.Miembros
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

  async AsignarMiembro(Id_Proyecto,Id_Persona){
    let sql = {
      table: 'Pro_Miembro',
      fields: 'Id_Proyecto,Id_Persona',
      values: '\'' + Id_Proyecto
      + '\',\'' + Id_Persona
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async DesasignarMiembro(Id_Proyecto,Id_Persona){
    let sql = "Delete from Pro_Miembro where Id_Proyecto = "+Id_Proyecto + " and Id_Persona = "+ Id_Persona;
    return await this.apiService.postRecord(sql);
  }
  async leerMiembros(Id_Proyecto){
    let sqlConfig = {
      table: 'Pro_Miembro inner join Gen_Persona on Pro_Miembro.Id_Persona = Gen_Persona.Id_Persona',
      fields: 'Id_Miembro,Id_Proyecto,Pro_Miembro.Id_Persona,Nombre',
      where:"Id_Proyecto = " + Id_Proyecto
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async nuevaNota(Nota){
    let sql = {
      table: 'Pro_Nota',
      fields: 'Id_Proyecto,Id_Persona,Nota',
      values: '\'' + Nota.Id_Proyecto
      + '\',\'' + Nota.Id_Persona
      + '\',\'' + Nota.Nota
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async leerNotas(Id_Proyecto){
    let sqlConfig = {
      table: 'Pro_Nota inner join Gen_Persona on Pro_Nota.Id_Persona = Gen_Persona.Id_Persona',
      fields: 'Id_Nota,Id_Proyecto,Pro_Nota.Id_Persona,Nombre,Nota,Pro_Nota.Creado_El as Fecha',
      where:"Id_Proyecto = " + Id_Proyecto
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
