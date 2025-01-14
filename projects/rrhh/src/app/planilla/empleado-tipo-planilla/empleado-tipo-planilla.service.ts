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
      table: 'Pl_empleado_Tipo_Planilla inner join Pl_empleado_Salarial on Pl_empleado_Tipo_Planilla.Id_empleado_Salarial = Pl_empleado_Salarial.Id_empleado_Salarial Inner Join Pl_Tipo_Planilla on Pl_empleado_Tipo_Planilla.Id_Tipo_Planilla = Pl_Tipo_Planilla.Id_Tipo_Planilla',
      fields: 'Id_empleado_Tipo_Planilla,Pl_empleado_Tipo_Planilla.Id_Tipo_Planilla,Pl_empleado_Tipo_Planilla.Id_empleado_Salarial,Pl_empleado_Tipo_Planilla.Estado, Pl_empleado_Salarial.Nombre as empleado_Salarial, Pl_Tipo_Planilla.Nombre as Tipo_Planilla',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadempleadoTIpoPlanilla(Id_empleado_Tipo_Planilla){
    let sqlConfig = {
      table: 'Pl_Empleado_Tipo_Planilla',
      fields: 'Id_Empleado_Tipo_Planilla,Id_Tipo_Planilla,Id_Empleado,Estado',
      where: 'Id_empleado_Tipo_Planilla='+Id_empleado_Tipo_Planilla
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveempleadoTipoPlanilla(empleadoTipoPlanilla){
    if(empleadoTipoPlanilla.Id_empleado_Tipo_Planilla == ""){
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
        where: 'Id_Empleado_Tipo_Planilla=' + empleadoTipoPlanilla.Id_Empleado_Tipo_Planilla
      };
      return await this.apiService.updateRecord(sql);
    }
  }
}
