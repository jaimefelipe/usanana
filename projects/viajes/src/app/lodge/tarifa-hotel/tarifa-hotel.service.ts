import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TarifaHotelService {

  constructor(private apiService: ApiService) {}

  async cartarTarifadeHabitacion(paginacion,search?) {
    let sqlConfig = {
      table: 'Hot_Tarifa inner join Tur_Hotel on Hot_Tarifa.Id_Hotel = Tur_Hotel.Id_Hotel inner Join Hot_Tipo_Habitacion on Hot_Tarifa.Id_Tipo_Habitacion = Hot_Tipo_Habitacion.Id_Tipo_Habitacion',
      fields: 'Id_Tarifa,Hot_Tarifa.Id_Hotel,Tur_Hotel.Nombre as Nombre_Hotel, Hot_Tarifa.Id_Tipo_Habitacion, Hot_Tipo_Habitacion.Nombre as Nombre_Habitacion,Inicio,Fin,Tarifa,Numero,Moneda',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async cargarTarifa(Id_Tarifa){
    let sqlConfig = {
      table: 'Hot_Tarifa inner Join Tur_Hotel on Hot_Tarifa.Id_Hotel = Tur_Hotel.Id_Hotel',
      fields: 'Id_Tarifa,Hot_Tarifa.Id_Hotel,Id_Tipo_Habitacion,Inicio,Fin,Tarifa,Numero,Tur_Hotel.Nombre as Nombre_Hotel,Moneda',
      orderField: '',
      searchField: '',
      where: "Id_Tarifa = " + Id_Tarifa
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async cargarTarifaHotel(Id_Hotel,Id_Tipo_Habitacion,Fecha){
    let sqlConfig = {
      table: 'Hot_Tarifa',
      fields: 'Id_Tarifa,Tarifa,Moneda',
      orderField: '',
      searchField: '',
      where: 'Id_Hotel = ' + Id_Hotel + ' and Id_Tipo_Habitacion = ' + Id_Tipo_Habitacion  + " AND  (STR_TO_DATE(Inicio,'%d/%m/%Y %H:%i:%s') <= STR_TO_DATE('"+Fecha+"','%d/%m/%Y %H:%i:%s')) and (STR_TO_DATE(Fin,'%d/%m/%Y %H:%i:%s') >= STR_TO_DATE('"+Fecha+"','%d/%m/%Y %H:%i:%s'))"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async EditarTarifa(TarifaHabitacion){
      let sql = {
        table: 'Hot_Tarifa',
        fields: 'Id_Hotel,Id_Tipo_Habitacion,Inicio,Fin,Tarifa,Numero,Moneda',
        values: '\'' + TarifaHabitacion.Id_Hotel
        + '\',\'' + TarifaHabitacion.Id_Tipo_Habitacion
        + '\',\'' + TarifaHabitacion.Inicio
        + '\',\'' + TarifaHabitacion.Fin
        + '\',\'' + TarifaHabitacion.Tarifa
        + '\',\'' + TarifaHabitacion.Numero
        + '\',\'' + TarifaHabitacion.Moneda
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }
  async NuevoTarifa(TarifaHabitacion){
      let sql = {
        table: 'Hot_Tarifa',
        fields: 'Id_Hotel=\'' + TarifaHabitacion.Id_Hotel
        + '\',Id_Tipo_Habitacion=\'' + TarifaHabitacion.Id_Tipo_Habitacion
        + '\',Inicio=\'' + TarifaHabitacion.Inicio
        + '\',Fin=\'' + TarifaHabitacion.Fin
        + '\',Tarifa=\'' + TarifaHabitacion.Tarifa
        + '\',Numero=\'' + TarifaHabitacion.Numero
        + '\',Moneda=\'' + TarifaHabitacion.Moneda
        + '\'',
        where: 'Id_Tarifa=' + TarifaHabitacion.Id_Tarifa
      };
      return await this.apiService.updateRecord(sql);
  }

}
