import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class RouteRateService {

  constructor(private apiService: ApiService) {}

  async loadRates(paginacion,search?) {
    let sqlConfig = {
      table: 'Tra_Tarifa inner JOIN Tra_Ruta on Tra_Tarifa.Id_Ruta = Tra_Ruta.Id_Ruta inner join Tur_Sitio as Origen on Tra_Ruta.Lugar_Origen = Origen.Id_Sitio inner join Tur_Sitio as Destino on Tra_Ruta.Lugar_Destino = Destino.Id_Sitio left OUTER join Gen_Persona on Gen_Persona.Id_Persona = Tra_Tarifa.Id_Proveedor',
      fields: "Tra_Tarifa.Id_Tarifa, Tra_Tarifa.Id_Ruta, Tra_Tarifa.Inicio, Tra_Tarifa.Fin, Tra_Tarifa.Tarifa, Concat(Origen.Nombre,' - ',Destino.Nombre) as Nombre,Tra_Tarifa.Tipo_Ruta,Gen_Persona.Nombre as Nombre_Proveedor, Tra_Tarifa.Moneda",
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadRate(Id_Tarifa){
    let sqlConfig = {
      table: 'Tra_Tarifa left Join Gen_Persona on Tra_Tarifa.Id_Proveedor = Gen_Persona.Id_Persona inner join Tra_Ruta on Tra_Tarifa.Id_Ruta = Tra_Ruta.Id_Ruta inner join Tur_Sitio as Origen on Tra_Ruta.Lugar_Origen = Origen.Id_Sitio inner join Tur_Sitio as Destino on Tra_Ruta.Lugar_Destino = Destino.Id_Sitio',
      fields: "Id_Tarifa,Tra_Tarifa.Id_Ruta,Tra_Tarifa.Tipo_Ruta,Tra_Tarifa.Id_Proveedor,Inicio,Fin,Tarifa,Concat(Origen.Nombre,' - ',Destino.Nombre) as Nombre_Ruta,Gen_Persona.Nombre as Nombre_Proveedor,Tra_Tarifa.Moneda",
      orderField: '',
      searchField: '',
      where: "Id_Tarifa = " + Id_Tarifa
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadRouteRatePerProvider(Id_Ruta,Id_Proveedor,Type,Date) {
    let sqlConfig = {
      table: 'Tra_Tarifa',
      fields: 'Tarifa,Moneda',
      orderField: '',
      simple:true,
      where: 'Id_Ruta = ' + Id_Ruta + ' and Tipo_Ruta = ' + Type + ' and Id_Proveedor =' + Id_Proveedor + " AND  (STR_TO_DATE(Inicio,'%d/%m/%Y %H:%i:%s') <= STR_TO_DATE('"+Date+"','%d/%m/%Y %H:%i:%s')) and (STR_TO_DATE(Fin,'%d/%m/%Y %H:%i:%s') >= STR_TO_DATE('"+Date+"','%d/%m/%Y %H:%i:%s'))"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async insertRate(Rate){
    let sqlConfig = {
      table: 'Tra_Tarifa',
      fields: 'Id_Ruta,Inicio,Fin,Tarifa,Tipo_Ruta,Id_Proveedor,Moneda',
      values: '\'' + Rate.Id_Ruta
      + '\',\'' + Rate.Inicio
      + '\',\'' + Rate.Fin
      + '\',\'' + Rate.Tarifa
      + '\',\'' + Rate.Tipo_Ruta
      + '\',\'' + Rate.Id_Proveedor
      + '\',\'' + Rate.Moneda
      + '\''
    };
    return await this.apiService.insertRecord(sqlConfig);
  }
  async updateRate(Rate){
    let sqlConfig = {
      table: 'Tra_Tarifa',
      fields: 'Id_Ruta = ' + Rate.Id_Ruta
      + ',Inicio = \'' + Rate.Inicio
      + '\',Fin = \'' + Rate.Fin
      + '\',Tarifa = \'' + Rate.Tarifa
      + '\',Tipo_Ruta = \'' + Rate.Tipo_Ruta
      + '\',Id_Proveedor = \'' + Rate.Id_Proveedor
      + '\',Moneda = \'' + Rate.Moneda
      + '\'',
      where: 'Id_Tarifa =' + Rate.Id_Tarifa
    };
    return await this.apiService.updateRecord(sqlConfig);
  }

}
