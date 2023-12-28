import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private apiService: ApiService) {}

  async loadSchedules(paginacion,search?) {
    let sqlConfig = {
      table: 'Tra_Horario inner join Tra_Ruta on Tra_Horario.Id_Ruta = Tra_Ruta.Id_Ruta inner join Tur_Sitio as Origen on Tra_Ruta.Lugar_Origen = Origen.Id_Sitio inner join Tur_Sitio as Destino on Tra_Ruta.Lugar_Destino = Destino.Id_Sitio',
      fields: "Id_Horario,Tra_Horario.Id_Ruta,Horario,Concat(Origen.Nombre,' - ',Destino.Nombre) as Nombre",
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadSchedule(Id_Horario){
    let sqlConfig = {
      table: 'Tra_Horario inner join Tra_Ruta on Tra_Horario.Id_Ruta = Tra_Ruta.Id_Ruta inner join Tur_Sitio as Origen on Tra_Ruta.Lugar_Origen = Origen.Id_Sitio inner join Tur_Sitio as Destino on Tra_Ruta.Lugar_Destino = Destino.Id_Sitio',
      fields: "Id_Horario,Tra_Horario.Id_Ruta,Horario,Concat(Origen.Nombre,' - ',Destino.Nombre) as Nombre",
      orderField: '',
      searchField: '',
      where: "Id_Horario = " + Id_Horario
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async insertSchedule(Schedule){
    let sqlConfig = {
      table: 'Tra_Horario',
      fields: 'Id_Ruta,Horario,Tipo_Ruta',
      values: '\'' + Schedule.Id_Ruta
      + '\',\'' + Schedule.Horario
      + '\',\'' + 2
      + '\''
    };
    return await this.apiService.insertRecord(sqlConfig);
  }
  async updateSchedule(Schedule){
    let sqlConfig = {
      table: 'Tra_Horario',
      fields: 'Id_Ruta = ' + Schedule.Id_Ruta
      + ',Horario = \'' + Schedule.Horario
      + '\'',
      where: 'Id_Horario =' + Schedule.Id_Horario
    };
    return await this.apiService.updateRecord(sqlConfig);
  }

  async loadSchedulesByRoute(Id_Ruta){
    let sqlConfig = {
      table: 'Tra_Horario',
      fields: "Id_Horario,Horario",
      orderField: '',
      searchField: '',
      where: "Tipo_Ruta = 2 and Id_Ruta = " + Id_Ruta
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
