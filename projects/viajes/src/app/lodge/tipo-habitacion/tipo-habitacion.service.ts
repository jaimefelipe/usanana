import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TipoHabitacionService {

  constructor(private apiService: ApiService) {}

  async cartarTipodeHabitacion(paginacion?,search?) {
    let sqlConfig = {
      //table: 'Hot_Tipo_Habitacion inner join Tur_Hotel on Hot_Tipo_Habitacion.Id_Hotel = Tur_Hotel.Id_Hotel',
      //fields: 'Id_Tipo_Habitacion,Hot_Tipo_Habitacion.Id_Hotel,Hot_Tipo_Habitacion.Nombre, Tur_Hotel.Nombre as Hotel, Nombre_Sitio',
      table: 'Hot_Tipo_Habitacion',
      fields: 'Id_Tipo_Habitacion,Id_Hotel,Nombre',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async cargarTipo(Id_Tipo_Habitacion){
    let sqlConfig = {
      table: 'Hot_Tipo_Habitacion',
      fields: 'Id_Tipo_Habitacion,Id_Hotel,Nombre',
      orderField: '',
      searchField: '',
      where: "Id_Tipo_Habitacion = " + Id_Tipo_Habitacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async EditarTipo(TipoHabitacion){
      let sql = {
        table: 'Hot_Tipo_Habitacion',
        fields: ' Nombre',
        values: '\'' + TipoHabitacion.Nombre
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }
  async NuevoTipo(TipoHabitacion){
      let sql = {
        table: 'Hot_Tipo_Habitacion',
        fields: 'Nombre=\'' + TipoHabitacion.Nombre
        + '\'',
        where: 'Id_Tipo_Habitacion=' + TipoHabitacion.Id_Tipo_Habitacion
      };
      return await this.apiService.updateRecord(sql);
  }

}
