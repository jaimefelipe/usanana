import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoTipoPlanillaService {

  constructor( private apiService:ApiService) { }
  
  async loadempleadosTipoPlanilla(paginacion?,search?,Estado?){
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Pl_Empleado_Tipo_Planilla Inner Join Pl_Tipo_Planilla on Pl_Empleado_Tipo_Planilla.Id_Tipo_Planilla = Pl_Tipo_Planilla.Id_Tipo_Planilla Inner Join Rhh_Empleado on   Pl_Empleado_Tipo_Planilla.Id_Empleado = Rhh_Empleado.Id_Empleado Inner Join Gen_Persona on Gen_Persona.Id_Persona = Rhh_Empleado.Id_Persona',
      fields: 'Id_Empleado_Tipo_Planilla,Pl_Empleado_Tipo_Planilla.Id_Tipo_Planilla, Pl_Empleado_Tipo_Planilla.Id_Empleado,Pl_Empleado_Tipo_Planilla.Estado,Pl_Tipo_Planilla.Nombre as Tipo_Planilla, Gen_Persona.Nombre as Empleado',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadempleadoTIpoPlanilla(Id_Empleado_Tipo_Planilla){
    let sqlConfig = {
      table: 'Pl_Empleado_Tipo_Planilla',
      fields: 'Id_Empleado_Tipo_Planilla,Id_Tipo_Planilla,Id_Empleado,Estado',
      where: 'Id_Empleado_Tipo_Planilla='+Id_Empleado_Tipo_Planilla
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveempleadoTipoPlanilla(empleadoTipoPlanilla){
    if(empleadoTipoPlanilla.Id_Empleado_Tipo_Planilla == ""){
      let sql = {
        table: 'Pl_Empleado_Tipo_Planilla',
        fields: 'Id_Tipo_Planilla,Id_Empleado,Estado',
        values: '\'' + empleadoTipoPlanilla.Id_Tipo_Planilla  + '\','
        + '\'' + empleadoTipoPlanilla.Id_Empleado + '\','
        + '\'' + empleadoTipoPlanilla.Estado 
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Pl_Empleado_Tipo_Planilla',
        fields: 'Id_Tipo_Planilla=\'' + empleadoTipoPlanilla.Id_Tipo_Planilla + '\','
        + 'Id_Empleado=\'' + empleadoTipoPlanilla.Id_Empleado
        + 'Estado=\'' + empleadoTipoPlanilla.Estado
        + '\'',
        where: 'Pl_Empleado_Tipo_Planilla=' + empleadoTipoPlanilla.Id_Empleado_Tipo_Planilla
      };
      return await this.apiService.updateRecord(sql);
    }
  }
}
