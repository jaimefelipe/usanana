import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class MovimientoPlanillaService {

constructor(
  private apiService:ApiService
) { } 

  async loadMovimientosPlanilla(Id_Planilla,search){

    let sqlConfig = {
      table: 'Movimientos_Planilla inner Join Rhh_Empleado On Rhh_Empleado.Id_Empleado = Movimientos_Planilla.Id_Empleado  inner Join Gen_Persona On Gen_Persona.Id_Persona = Rhh_Empleado.Id_Persona inner Join Pl_Concepto_Salarial on Pl_Concepto_Salarial.Id_Concepto_Salarial = Movimientos_Planilla.Id_Concepto_Salarial',
      fields: 'Id_Movimiento_Planilla, Gen_Persona.Nombre as Empleado, Pl_Concepto_Salarial.Nombre As Concepto,Movimientos_Planilla.Estado',
      searchField: search,
      where:"Id_Planilla="+Id_Planilla,
      Empresa:false
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async LeerMovimiento(Id_Movimiento_Planilla){
    let sqlConfig = {
      table: 'Movimientos_Planilla inner Join Rhh_Empleado On Rhh_Empleado.Id_Empleado = Movimientos_Planilla.Id_Empleado  inner Join Gen_Persona On Gen_Persona.Id_Persona = Rhh_Empleado.Id_Persona inner Join Pl_Concepto_Salarial on Pl_Concepto_Salarial.Id_Concepto_Salarial = Movimientos_Planilla.Id_Concepto_Salarial',
      fields: 'Id_Movimiento_Planilla, Movimientos_Planilla.Id_Empleado, Gen_Persona.Nombre as Empleado, Movimientos_Planilla.Id_Concepto_Salarial, Pl_Concepto_Salarial.Nombre As Concepto_Salarial,Movimientos_Planilla.Cantidad,Movimientos_Planilla.Estado',
      where: 'Id_Movimiento_Planilla='+Id_Movimiento_Planilla
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async NuevoMovimiento(Movimiento){
    let sql = {
        table: 'Movimientos_Planilla',
        fields: 'Id_Planilla,Id_Empleado,Id_Concepto_Salarial,Cantidad,Estado',
        values: '\'' + Movimiento.Id_Planilla  + '\','
        + '\'' + Movimiento.Id_Empleado + '\','
        + '\'' + Movimiento.Id_Concepto_Salarial + '\','
        + '\'' + Movimiento.Cantidad + '\','
        + '\'' + Movimiento.Estado 
        + '\''
      };
      return await this.apiService.insertRecord(sql);
  }
  async UpdateMovimiento(Movimiento){
    let sql = {
        table: 'Movimientos_Planilla',
        fields: 'Id_Planilla=\'' + Movimiento.Id_Planilla + '\','
        + 'Id_Empleado=\'' + Movimiento.Id_Empleado + '\','
        + 'Id_Concepto_Salarial=\'' + Movimiento.Id_Concepto_Salarial + '\','
        + 'Cantidad=\'' + Movimiento.Cantidad + '\','
        + 'Estado=\'' + Movimiento.Estado
        + '\'',
        where: 'Id_Movimiento_Planilla=' + Movimiento.Id_Movimiento_Planilla
      };
      return await this.apiService.updateRecord(sql);
  }

}
