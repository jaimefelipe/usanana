import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private apiService: ApiService) {}

  async loadVehicles(paginacion,search?) {
    let sqlConfig = {
      table: 'Tra_Vehiculo',
      fields: 'Id_Vehiculo,Placa,Marca,Modelo,Anio,Capacidad,Permiso_Turismo,Vencimiento_Permiso,Numero_Poliza,Vencimiento_Poliza,Id_Base,Estado,Tipo,Serie,categoria',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveVehicle(vehicle){
    if(vehicle.Id_Vehiculo ==""){
      let sql = {
        table: 'Tra_Vehiculo',
        fields: 'Placa,Marca,Modelo,Anio,Capacidad,Permiso_Turismo,Vencimiento_Permiso,Numero_Poliza,Vencimiento_Poliza,Id_Base,Estado,Tipo,Serie,categoria',
        values: '\'' + vehicle.Placa
        + '\',\'' + vehicle.Marca
        + '\',\'' + vehicle.Modelo
        + '\',\'' + vehicle.Anio
        + '\',\'' + vehicle.Capacidad
        + '\',\'' + vehicle.Permiso_Turismo
        + '\',\'' + vehicle.Vencimiento_Permiso
        + '\',\'' + vehicle.Numero_Poliza
        + '\',\'' + vehicle.Vencimiento_Poliza
        + '\',\'' + vehicle.Id_Base
        + '\',\'' + vehicle.Estado
        + '\',\'' + vehicle.Tipo
        + '\',\'' + vehicle.Serie
        + '\',\'' + vehicle.categoria
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Tra_Vehiculo',
        fields: 'Placa=\'' + vehicle.Placa
        + '\',Marca=\'' + vehicle.Marca
        + '\',Modelo=\'' + vehicle.Modelo
        + '\',Anio=\'' + vehicle.Anio
        + '\',Capacidad=\'' + vehicle.Capacidad
        + '\',Permiso_Turismo=\'' + vehicle.Permiso_Turismo
        + '\',Vencimiento_Permiso=\'' + vehicle.Vencimiento_Permiso
        + '\',Numero_Poliza=\'' + vehicle.Numero_Poliza
        + '\',Vencimiento_Poliza=\'' + vehicle.Vencimiento_Poliza
        + '\',Id_Base=\'' + vehicle.Id_Base
        + '\',Estado=\'' + vehicle.Estado
        + '\',Serie=\'' + vehicle.Serie
        + '\',categoria=\'' + vehicle.categoria
        + '\'',
        where: 'Id_Vehiculo=' + vehicle.Id_Vehiculo
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadVehicle(Id_Vehiculo){
    let sqlConfig = {
      table: 'Tra_Vehiculo left Join Tur_Sitio on Tra_Vehiculo.Id_Base = Tur_Sitio.Id_Sitio',
      fields: 'Id_Vehiculo,Placa,Marca,Modelo,Anio,Capacidad,Permiso_Turismo,Vencimiento_Permiso,Numero_Poliza,Vencimiento_Poliza,Tra_Vehiculo.Id_Base,Tra_Vehiculo.Estado,Tipo,Serie,categoria, Tur_Sitio.Nombre as Nombre_Base',
      orderField: '',
      searchField: '',
      where: "Id_Vehiculo = " + Id_Vehiculo
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async LoadVehiclesByDate(Date){
    let sqlConfig = {
      table: 'Tra_Vehiculo left Join Tur_Sitio on Tra_Vehiculo.Id_Base = Tur_Sitio.Id_Sitio',
      fields: 'Id_Vehiculo,Placa,Marca,Modelo,Anio,Capacidad,Permiso_Turismo,Vencimiento_Permiso,Numero_Poliza,Vencimiento_Poliza,Tra_Vehiculo.Id_Base,Tra_Vehiculo.Estado,Tipo,Serie,categoria, Tur_Sitio.Nombre as Nombre_Base',
      orderField: '',
      searchField: '',
      where: "Id_Vehiculo = " + Date
    }
    return await this.apiService.executeSqlSyn(sqlConfig);

  }

}
