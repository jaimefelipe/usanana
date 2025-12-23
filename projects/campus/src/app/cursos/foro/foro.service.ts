import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ForoService {

constructor(
  private apiService:ApiService
) { }

  async obtenerForo(Id_Actividad){
    let sqlConfig = {
      table: 'Lms_Foro',
      fields: 'Id_Foro,Titulo,Descripcion',
      where: 'Id_Actividad = ' + Id_Actividad
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async obtenerMensajes(Id_Foro){
    let sqlConfig = {
      table: 'Lms_Foro_Mensaje inner join Gen_Persona on Gen_Persona.Id_Persona = Lms_Foro_Mensaje.Id_Persona',
      fields: 'Id_Mensaje,Lms_Foro_Mensaje.Id_Persona,Mensaje,Lms_Foro_Mensaje.Creado_El,Es_Profesor,Nombre',
      where: 'Id_Foro = ' + Id_Foro
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async enviarMensaje(Mensaje){
    let sql = {
        table: 'Lms_Foro_Mensaje',
        fields: 'Id_Foro,Id_Persona,Mensaje',
        values: '\'' + Mensaje.Id_Foro
        + '\',\'' + Mensaje.Id_Persona
        + '\',\'' + Mensaje.Mensaje + '\''
      };
      return await this.apiService.insertRecord(sql);
  }

  async obtenerIdPersona(){
    let sqlConfig = {
      table: 'Gen_Persona',
      fields: 'Id_Persona',
      where: 'Id_Usuario = ' + localStorage.getItem('Id_Usuario') + ' and Id_Empresa = ' + localStorage.getItem('Id_Empresa')
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
