import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CoordinateService {

  constructor(private apiService: ApiService) {}
  async coordinar(){
    let sql = "EXECUTE Sp_Tra_Coordinacion " + localStorage.getItem('Id_Empresa');
    return await this.apiService.postRecord(sql);
  }
  async loadDates(paginacion,search?) {
    let sqlConfig = {
      table: 'Tra_Servicio',
      fields: 'Fecha_Servicio,count(Pasajeros) as Pasajeros',
      orderField: 'Fecha_Servicio',
      searchField: search,
      orderDirection: ' ASC ',
      paginacion: paginacion,
      where:' Fecha_Servicio > = GETDATE()',
      GroupBy:' GROUP BY Fecha_Servicio '
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadVehiclesByDate(Date){
    let sqlConfig = {
      table: 'Tra_Servicio inner join Tra_Vehiculo on Tra_Servicio.Id_Vehiculo = Tra_Vehiculo.Id_Vehiculo inner join Tra_Ruta on Tra_Servicio.Id_Ruta = Tra_Ruta.Id_Ruta join Tur_Sitio as Origen on Tra_Ruta.Lugar_Origen = Origen.Id_Sitio inner join Tur_Sitio as Destino on Tra_Ruta.Lugar_Destino = Destino.Id_Sitio',
      fields: "count(Pasajeros) as Pasajeros,Tra_Servicio.Id_Vehiculo,Tra_Vehiculo.Placa,Tra_Servicio.Id_Ruta,Origen.Nombre || ' - ' || Destino.Nombre as Nombre_Ruta",
      searchField: '',
      paginacion: '',
      simple:true,
      where:" Fecha_Servicio = '" + Date + "'",
      GroupBy:' GROUP BY Tra_Servicio.Id_Vehiculo, Tra_Vehiculo.Placa,Tra_Servicio.Id_Ruta,Origen.Nombre, Destino.Nombre '
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadServicesByDate(Date){
    let sqlConfig = {
      table: 'Tra_Servicio inner join Tra_Ruta on Tra_Servicio.Id_Ruta = Tra_Ruta.Id_Ruta join Tur_Sitio as Origen on Tra_Ruta.Lugar_Origen = Origen.Id_Sitio inner join Tur_Sitio as Destino on Tra_Ruta.Lugar_Destino = Destino.Id_Sitio',
      fields: "Count(Pasajeros) as Pasajeros, Id_Servicio,Tra_Servicio.Id_Ruta,Origen.Nombre || ' - ' || Destino.Nombre as Nombre_Ruta",
      searchField: '',
      paginacion: '',
      simple:true,
      where:" Id_Vehiculo Is Null and Fecha_Servicio = '" + Date + "'",
      GroupBy:' GROUP BY  Id_Servicio,Tra_Servicio.Id_Ruta,Origen.Nombre, Destino.Nombre '
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadServiceByVehicle(Id_Vehiculo,Date){
    let sqlConfig = {
      table: 'Tra_Servicio inner join Tra_Itinerario on Tra_Servicio.Id_Itinerario = Tra_Itinerario.Id_Itinerario left join Gen_Persona on Tra_Itinerario.Id_Cliente = Gen_Persona.Id_Persona',
      fields: "Tra_Servicio.Id_Vehiculo,Id_Servicio,Tra_Servicio.Id_Itinerario,Id_Ruta,Pasajeros,Tra_Itinerario.Id_Cliente,Tra_Itinerario.Cargar_Cliente, Gen_Persona.Nombre as Cliente",
      searchField: '',
      paginacion: '',
      simple:true,
      where:" Id_Vehiculo = "+Id_Vehiculo+" and Fecha_Servicio = '" + Date + "'"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);

  }
  async UnMountService(Id_Servicio){
    let sqlConfig = {
      table: 'Tra_Servicio',
      fields: 'Estado = 1,Id_Vehiculo = NULL',
      where: 'Id_Servicio =' + Id_Servicio
    };
    return await this.apiService.updateRecord(sqlConfig);
  }
  async ChangeStatusOfService(Id_Servicio,Estado){
    let sqlConfig = {
      table: 'Tra_Servicio',
      fields: 'Estado = '+ Estado,
      where: 'Id_Servicio =' + Id_Servicio
    };
    return await this.apiService.updateRecord(sqlConfig);
  }
  //Leer los dias que tienen servicios
  async LoadVehicles(Date){
    let sqlConfig = {
      table: "Tra_Vehiculo left Join (Select Id_Vehiculo,Sum(Pasajeros) as Pasajeros, Id_Ruta From Tra_Servicio where Id_Empresa = "+ localStorage.getItem('Id_Empresa') +" and Fecha_Servicio = '"+Date+"' Group By Id_Vehiculo,Id_Ruta) As Pasajeros On Tra_Vehiculo.Id_Vehiculo = Pasajeros.Id_Vehiculo Left Join Tra_Ruta On Pasajeros.Id_Ruta = Tra_Ruta.Id_Ruta left Join Tur_Sitio as Origen On Tra_Ruta.Lugar_Origen = Origen.Id_Sitio left Join Tur_Sitio as Destino On Tra_Ruta.Lugar_Destino = Destino.Id_Sitio ",
      fields: "Tra_Vehiculo.Id_Vehiculo,Placa,Capacidad, Pasajeros.Pasajeros, Pasajeros.Id_Ruta, Origen.Nombre || '-' || Destino.Nombre As Nombre_Ruta",
      searchField: '',
      paginacion: '',
      simple:true
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async CangeVehicle(Id_Servicio,Id_Vehiculo){
    let sqlConfig = {
      table: 'Tra_Servicio',
      fields: 'Id_Vehiculo = '+Id_Vehiculo,
      where: 'Id_Servicio =' + Id_Servicio
    };
    return await this.apiService.updateRecord(sqlConfig);

  }
}
