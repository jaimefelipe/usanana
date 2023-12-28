import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private apiService: ApiService) {}

  async loadRoutes(paginacion,search?) {
    let sqlConfig = {
      table: 'Tra_Ruta inner join Tur_Sitio as Origen on Tra_Ruta.Lugar_Origen = Origen.Id_Sitio inner join Tur_Sitio as Destino on Tra_Ruta.Lugar_Destino = Destino.Id_Sitio',
      fields: "Id_Ruta,Lugar_Origen, Lugar_Destino, Tipo_Ruta, Concat(Origen.Nombre,' - ',Destino.Nombre) as Nombre",
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadRoute(Id_Ruta){
    let sqlConfig = {
      table: 'Tra_Ruta inner join Tur_Sitio as Origen on Tra_Ruta.Lugar_Origen = Origen.Id_Sitio inner join Tur_Sitio as Destino on Tra_Ruta.Lugar_Destino = Destino.Id_Sitio',
      fields: 'Id_Ruta,Lugar_Origen, Lugar_Destino, Origen.Nombre as Origen_Nombre, Destino.Nombre as Destino_Nombre',
      orderField: '',
      searchField: '',
      where: "Id_Ruta = " + Id_Ruta
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async insertRoute(Route){
    let sqlConfig = {
      table: 'Tra_Ruta',
      fields: 'Lugar_Origen,Lugar_Destino',
      values: '\'' + Route.Lugar_Origen
      + '\',\'' + Route.Lugar_Destino
      + '\''
    };
    return await this.apiService.insertRecord(sqlConfig);
  }
  async updateRoute(Route){
    let sqlConfig = {
      table: 'Tra_Ruta',
      fields: 'Lugar_Origen = ' + Route.Lugar_Origen
      + ',Lugar_Destino = \'' + Route.Lugar_Destino + '\'',
      where: 'Id_Ruta =' + Route.Id_Ruta
    };
    return await this.apiService.updateRecord(sqlConfig);
  }
}
