import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TarifaTourService {

  constructor(private apiService: ApiService) {}

  async cartarTarifadeTour(paginacion,search?) {
    let sqlConfig = {
      table: 'Tur_Tour_tarifa INNER JOIN Tur_Tour on Tur_Tour.Id_Tour = Tur_Tour_tarifa.Id_Tour Inner Join Gen_Persona on Gen_Persona.Id_Persona = Tur_Tour_tarifa.Id_Proveedor ',
      fields: 'Id_Tarifa,Tur_Tour_tarifa.Id_Tour,Tur_Tour.Nombre as Tour,Tur_Tour_tarifa.Id_Proveedor,Gen_Persona.Nombre,Inicio,Fin,Tarifa,Tur_Tour_tarifa.Moneda',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async cargarTarifa(Id_Tarifa){
    let sqlConfig = {
      table: 'Tur_Tour_tarifa INNER JOIN Tur_Tour on Tur_Tour.Id_Tour = Tur_Tour_tarifa.Id_Tour Inner Join Gen_Persona on Gen_Persona.Id_Persona = Tur_Tour_tarifa.Id_Proveedor ',
      fields: 'Id_Tarifa,Tur_Tour_tarifa.Id_Tour,Tur_Tour.Nombre as Nombre_Tour,Tur_Tour_tarifa.Id_Proveedor,Gen_Persona.Nombre as Nombre_Proveedor,Inicio,Fin,Tarifa,Tur_Tour_tarifa.Moneda',
      orderField: '',
      searchField: '',
      where: "Tur_Tour_tarifa.Id_Tarifa = " + Id_Tarifa
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async EditarTarifa(TarifaTour){
      let sql = {
        table: 'Tur_Tour_tarifa',
        fields: 'Id_Tour,Inicio,Tarifa,Fin,Id_Proveedor,Moneda',
        values: '\'' + TarifaTour.Id_Tour
        + '\',\'' + TarifaTour.Inicio
        + '\',\'' + TarifaTour.Fin
        + '\',\'' + TarifaTour.Tarifa
        + '\',\'' + TarifaTour.Id_Proveedor
        + '\',\'' + TarifaTour.Moneda
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }
  async NuevoTarifa(TarifaTour){
      let sql = {
        table: 'Tur_Tour_tarifa',
        fields: 'Id_Tour=\'' + TarifaTour.Id_Tour
        + '\',Inicio=\'' + TarifaTour.Inicio
        + '\',Fin=\'' + TarifaTour.Fin
        + '\',Tarifa=\'' + TarifaTour.Tarifa
        + '\',Id_Proveedor=\'' + TarifaTour.Id_Proveedor
        + '\',Moneda=\'' + TarifaTour.Moneda
        + '\'',
        where: 'Id_Tarifa=' + TarifaTour.Id_Tarifa
      };
      return await this.apiService.updateRecord(sql);
  }
  async cargarTarifaProveedor(Id_Tour,Id_Proveedor,Fecha){
    let sqlConfig = {
      table: 'Tur_Tour_tarifa INNER JOIN Tur_Tour on Tur_Tour.Id_Tour = Tur_Tour_tarifa.Id_Tour Inner Join Gen_Persona on Gen_Persona.Id_Persona = Tur_Tour_tarifa.Id_Proveedor ',
      fields: 'Id_Tarifa,Tur_Tour_tarifa.Id_Tour,Tur_Tour.Nombre as Nombre_Tour,Tur_Tour_tarifa.Id_Proveedor,Gen_Persona.Nombre as Nombre_Proveedor,Inicio,Fin,Tarifa,Tur_Tour_tarifa.Moneda',
      orderField: '',
      searchField: '',
      where: "Tur_Tour_tarifa.Id_Tour = " + Id_Tour + " and Tur_Tour_tarifa.Id_Proveedor =" + Id_Proveedor + " AND  (STR_TO_DATE(Inicio,'%d/%m/%Y %H:%i:%s') <= STR_TO_DATE('"+Fecha+"','%d/%m/%Y %H:%i:%s')) and (STR_TO_DATE(Fin,'%d/%m/%Y %H:%i:%s') >= STR_TO_DATE('"+Fecha+"','%d/%m/%Y %H:%i:%s'))"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
