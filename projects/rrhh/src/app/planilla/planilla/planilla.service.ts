import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlanillaService {

constructor(
  private apiService:ApiService
) { }

  async loadPlanillas(paginacion:any,search?:any) {
    let sqlConfig = {
      table: 'Pl_Planilla',
      fields: 'Id_Planilla,Id_Tipo_Planilla,Nombre,Fecha,Fecha_Inicio,Fecha_Fin,Fecha_Pago,Ultima,Estado',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async leerPlanilla(Id_Planilla) {
    let sqlConfig = {
      table: 'Pl_Planilla',
      fields: 'Id_Planilla,Id_Tipo_Planilla,Nombre,Fecha,Fecha_Inicio,Fecha_Fin,Fecha_Pago,Ultima,Estado',
      where: 'Id_Planilla='+Id_Planilla
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async NuevaPlanilla(Planilla){
    let sql = {
      table: 'Pl_Planilla',
      fields: 'Id_Tipo_Planilla,Nombre,Fecha,Fecha_Inicio,Fecha_Fin,Fecha_Pago,Ultima,Estado',
      values: '\'' + Planilla.Id_Tipo_Planilla
      + '\',\'' + Planilla.Nombre
      + '\',\'' + Planilla.Fecha
      + '\',\'' + Planilla.Fecha_Inicio
      + '\',\'' + Planilla.Fecha_Fin
      + '\',\'' + Planilla.Fecha_Pago
      + '\',\'' + Planilla.Ultima
      + '\',\'' + 1
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async UpdatePlanilla(Planilla){
    let sql = {
      table: 'Pl_Planilla',
      fields: 'Id_Tipo_Planilla=\'' + Planilla.Id_Tipo_Planilla
      + '\',Nombre=\'' + Planilla.Nombre
      + '\',Fecha=\'' + Planilla.Fecha
      + '\',Fecha_Inicio=\'' + Planilla.Fecha_Inicio
      + '\',Fecha_Fin=\'' + Planilla.Fecha_Fin
      + '\',Fecha_Pago=\''+ Planilla.Fecha_Pago
      + '\',Ultima=\''+ Planilla.Ultima
      + '\',Estado=\''+ Planilla.Estado
      + '\'',
      where: 'Id_Planilla=' + Planilla.Id_Planilla
    };
    return await this.apiService.updateRecord(sql);
  }
  async ProcesarMarcas(Id_Planilla){
    let data =  await this.apiService.postRecord("Call sp_Calcular_Horas_Jornada_Acumulativa(" + Id_Planilla + ",'" + localStorage.getItem('Nombre_Usuario') + "')" );
    console.log(data);
    return true;
  }
  async calcularPlanilla(Id_Planilla){
    let data =  await this.apiService.postRecord("Call sp_Pl_Calcular_Planilla(" + Id_Planilla + ",'" + localStorage.getItem('Nombre_Usuario') + "')" );
    console.log(data);
    return true;
  }
}
