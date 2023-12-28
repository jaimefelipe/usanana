import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(private apiService: ApiService) {}

  async loadHotelsFromPlace(Id_Sitio) {
    let sqlConfig = {
      table: 'Tur_Hotel',
      fields: 'Id_Hotel, Nombre',
      orderField: '',
      simple:true,
      where: ' Id_Sitio = ' + Id_Sitio
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadHotels(paginacion,search?) {
    let sqlConfig = {
      table: 'Tur_Hotel left join Tur_Sitio on Tur_Hotel.Id_Sitio = Tur_Sitio.Id_Sitio',
      fields: 'Id_Hotel, Tur_Hotel.Nombre,Tur_Hotel.Estado,Tur_Sitio.Nombre as Nombre_Sitio',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveHotel(Hotel){
    if(Hotel.Id_Hotel ==""){
      let sql = {
        table: 'Tur_Hotel',
        fields: ' Nombre,Id_Sitio,Comision,Estado',
        values: '\'' + Hotel.Nombre
        + '\',\'' + Hotel.Id_Sitio
        + '\',\'' + Hotel.Comision
        + '\',\'' + Hotel.Estado
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Tur_Hotel',
        fields: 'Nombre=\'' + Hotel.Nombre
        + '\',Id_Sitio=\'' + Hotel.Id_Sitio
        + '\',Comision=\'' + Hotel.Comision
        + '\',Estado=\'' + Hotel.Estado
        + '\'',
        where: 'Id_Hotel=' + Hotel.Id_Hotel
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadHotel(Id_Hotel){
    let sqlConfig = {
      table: 'Tur_Hotel left join Tur_Sitio on Tur_Hotel.Id_Sitio = Tur_Sitio.Id_Sitio',
      fields: 'Id_Hotel,Tur_Hotel.Nombre,Tur_Hotel.Id_Sitio,Tur_Hotel.Estado,Tur_Sitio.Nombre as Nombre_Sitio, Comision',
      orderField: '',
      searchField: '',
      where: "Id_Hotel = " + Id_Hotel
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
