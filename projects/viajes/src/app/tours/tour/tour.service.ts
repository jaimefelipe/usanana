import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';


@Injectable({
  providedIn: 'root'
})
export class TourService {
  constructor(private apiService: ApiService) {}

  async LeerTours(paginacion,search?) {
    let sqlConfig = {
      table: 'Tur_Tour inner JOIN Tur_Sitio on Tur_Sitio.Id_Sitio = Tur_Tour.Id_Sitio',
      fields: 'Id_Tour,Tur_Tour.Id_Sitio,Tur_Sitio.Nombre as Sitio,Tur_Tour.Nombre as Tour',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async LeerTourPorSitio(Id_Sitio){
    let sqlConfig = {
      table: 'Tur_Tour inner JOIN Tur_Sitio on Tur_Sitio.Id_Sitio = Tur_Tour.Id_Sitio',
      fields: 'Id_Tour,Tur_Tour.Id_Sitio,Tur_Sitio.Nombre as Sitio,Tur_Tour.Nombre as Tour',
      orderField: '',
      where: "Tur_Tour.Id_Sitio="+ Id_Sitio
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveTour(Tour){
    if(Tour.Id_Tour ==""){
      let sql = {
        table: 'Tur_Tour',
        fields: ' Nombre,Id_Sitio,Estado',
        values: '\'' + Tour.Nombre
        + '\',\'' + Tour.Id_Sitio
        + '\',\'' + Tour.Estado
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Tur_Tour',
        fields: 'Nombre=\'' + Tour.Nombre
        + '\',Id_Sitio=\'' + Tour.Id_Sitio
        + '\',Estado=\'' + Tour.Estado
        + '\'',
        where: 'Id_Tour=' + Tour.Id_Tour
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadTour(Id_Tour){
    let sqlConfig = {
      table: 'Tur_Tour inner JOIN Tur_Sitio on Tur_Sitio.Id_Sitio = Tur_Tour.Id_Sitio',
      fields: 'Id_Tour,Tur_Tour.Id_Sitio,Tur_Tour.Nombre,Tur_Tour.Url,Tur_Tour.Descripcion,Tur_Tour.KeyWords,Tur_Tour.Contenido,Tur_Tour.Foto,Tur_Tour.Estado,Tur_Sitio.Nombre as Nombre_Sitio',
      orderField: '',
      searchField: '',
      where: "Id_Tour = " + Id_Tour
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
