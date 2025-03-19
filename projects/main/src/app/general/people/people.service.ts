import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private apiService: ApiService) {}

  async loadPersonas(paginacion,search?,Tipo?) {
    let where = '';
    if(Tipo){
      switch(Tipo) {
        case 1: {
           where = ' Cliente = 1'
           break;
        }
        case 2: {
          where = ' Proveedor = 1'
          break;
       }

        default: {
          where = '';
           break;
        }
     }
    }
    let sqlConfig = {
      table: 'Gen_Persona',
      fields: 'Id_Persona,Nombre,Telefono,Correo,Identificacion,Tipo_Identificacion,Porcentaje_Comision, Porcentaje_Descuento',
      orderField: '',
      where: where,
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadPersona(Id_Persona){
    let sqlConfig = {
      table: 'Gen_Persona',
      fields: 'Id_Persona,Nombre,Telefono,Correo,Identificacion,Tipo_Identificacion,Porcentaje_Comision, Porcentaje_Descuento,Cliente,Proveedor,Empleado',
      orderField: '',
      searchField: '',
      where: "Id_Persona = " + Id_Persona
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async savePersona(Persona){
    if(Persona.Id_Persona ==""){
      let sql = {
        table: 'Gen_Persona',
        fields: 'Nombre,Telefono,Correo,Tipo_Identificacion,Identificacion,Cliente,Proveedor,Empleado,Codigo_Actividad_Economica,Nombre_Actividad_Economica',
        values: '\'' + Persona.Nombre
        + '\',\'' + Persona.Telefono
        + '\',\'' + Persona.Correo
        + '\',\'' + Persona.Tipo_Identificacion
        + '\',\'' + Persona.Identificacion
        + '\',\'' + Persona.Cliente
        + '\',\'' + Persona.Proveedor
        + '\',\'' + Persona.Empleado
        + '\',\'' + Persona.Codigo_Actividad_Economica
        + '\',\'' + Persona.Nombre_Actividad_Economica
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Gen_Persona',
        fields: 'Nombre=\'' + Persona.Nombre
        + '\',Telefono=\'' + Persona.Telefono
        + '\',Correo=\'' + Persona.Correo
        + '\',Tipo_Identificacion=\'' + Persona.Tipo_Identificacion
        + '\',Identificacion=\''+ Persona.Identificacion
        + '\',Cliente=\''+ Persona.Cliente
        + '\',Proveedor=\''+ Persona.Proveedor
        + '\',Empleado=\''+ Persona.Empleado
        + '\',Codigo_Actividad_Economica=\''+ Persona.Codigo_Actividad_Economica
        + '\',Nombre_Actividad_Economica=\''+ Persona.Nombre_Actividad_Economica
        + '\'',
        where: 'Id_Persona=' + Persona.Id_Persona
      };
      return await this.apiService.updateRecord(sql);
    }
  }
}
