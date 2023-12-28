import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantPlaceService {

  constructor(private apiService: ApiService) {}

  async loadPlaces(paginacion,search?) {
    let sqlConfig = {
      table: 'Res_Mesa inner Join Res_Zona on Res_Mesa.Id_Zona = Res_Zona.Id_Zona',
      fields: 'Id_Mesa,Res_Mesa.Nombre,Res_Mesa.Estado,Res_Zona.Nombre as Zona,Tipo',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadPlacesZone(Id_Zone){
    let sqlConfig = {
      table: 'Res_Mesa',
      fields: 'Id_Mesa,Nombre,Estado,Arriba,Derecha,Tipo',
      orderField: '',
      where: 'Id_Zona=' + Id_Zone
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async savePlace(Place){
    if(Place.Id_Mesa ==""){
      let sql = {
        table: 'Res_Mesa',
        fields: 'Nombre,Id_Zona,Arriba,Derecha,Estado,Tipo',
        values: '\'' + Place.Nombre
        + '\',\'' + Place.Id_Zona
        + '\',\'' + Place.Arriba
        + '\',\'' + Place.Derecha
        + '\',\'' + Place.Estado
        + '\',\'' + Place.Tipo + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Res_Mesa',
        fields: 'Nombre=\'' + Place.Nombre
        + '\',Estado=\''+ Place.Estado
        + '\',Arriba=\''+ Place.Arriba
        + '\',Derecha=\''+ Place.Derecha
        + '\',Id_Zona=\''+ Place.Id_Zona
        + '\',Tipo=\''+ Place.Tipo  + '\'',
        where: 'Id_Mesa=' + Place.Id_Mesa
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadPlace(Id_Place){
    let sqlConfig = {
      table: 'Res_Mesa',
      fields: 'Id_Mesa,Id_Zona,Nombre,Estado,Arriba,Derecha,Tipo',
      orderField: '',
      searchField: '',
      where: "Id_Mesa = " + Id_Place
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
