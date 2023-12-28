import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantZoneService {

  constructor(private apiService: ApiService) {}

  async loadZones(paginacion,search?) {
    let sqlConfig = {
      table: 'Res_Zona',
      fields: 'Id_Zona,Nombre,Estado',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveZone(Zone){
    if(Zone.Id_Zona ==""){
      let sql = {
        table: 'Res_Zona',
        fields: 'Nombre,Servicio,Estado',
        values: '\'' + Zone.Nombre
        + '\',\'' + Zone.Servicio 
        + '\',\'' + Zone.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Res_Zona',
        fields: 'Nombre=\'' + Zone.Nombre
        + '\',Servicio=\''+ Zone.Servicio
        + '\',Estado=\''+ Zone.Estado
        + '\'',
        where: 'Id_Zona=' + Zone.Id_Zona
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadZone(Id_Zone){
    let sqlConfig = {
      table: 'Res_Zona',
      fields: 'Id_Zona,Nombre,Servicio,Estado',
      orderField: '',
      searchField: '',
      where: "Id_Zona = " + Id_Zone
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
