import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private apiService: ApiService) {}

  async loadSites(paginacion,search?) {
    let sqlConfig = {
      table: 'Tur_Sitio',
      fields: 'Id_Sitio,Nombre',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadPlace(Id_Sitio){
    let sqlConfig = {
      table: 'Tur_Sitio',
      fields: 'Id_Sitio,Nombre',
      orderField: '',
      searchField: '',
      where: "Id_Sitio = " + Id_Sitio
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async insertPlace(Place){
    let sqlConfig = {
      table: 'Tur_Sitio',
      fields: 'Nombre',
      values: '\'' + Place.Nombre
      + '\''
    };
    return await this.apiService.insertRecord(sqlConfig);
  }
  async updatePlace(Place){
    let sqlConfig = {
      table: 'Tur_Sitio',
      fields: 'Nombre = \'' + Place.Nombre
      + '\'',
      where: 'Id_Sitio =' + Place.Id_Sitio
    };
    return await this.apiService.updateRecord(sqlConfig);
  }

}
