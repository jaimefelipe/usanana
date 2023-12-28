import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';


@Injectable({
  providedIn: 'root'
})
export class TransportItineraryService {

  constructor(private apiService: ApiService) {}

  async loadItineraries(paginacion,search?) {
    let sqlConfig = {
      table: 'Tra_Itinerario LEFT JOIN Gen_Persona on Tra_Itinerario.Id_Cliente = Gen_Persona.Id_Persona',
      fields: 'Tra_Itinerario.Id_Itinerario, Gen_Persona.Nombre as Cliente, Tra_Itinerario.Nombre_Pasajero,Tra_Itinerario.Creado_El',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadItinerary(Id_Itinerario){
    let sqlConfig = {
      table: 'Tra_Itinerario left join Gen_Persona on Tra_Itinerario.Id_Cliente = Gen_Persona.Id_Persona',
      fields: 'Id_Itinerario,Id_Cliente,Nombre_Pasajero,Tra_Itinerario.Porcentaje_Comision,Sub_Total,Descuento,Total,Cargar_Cliente,Gen_Persona.Nombre as Nombre_Cliente,Correo_Cliente,Whatsapp_Cliente',
      orderField: '',
      searchField: '',
      where: "Id_Itinerario = " + Id_Itinerario
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadServices(Id_Itinerario) {
    let sqlConfig = {
      table: 'Tra_Servicio inner Join Tra_Ruta On Tra_Servicio.Id_Ruta =Tra_Ruta.Id_Ruta',
      fields: 'Tra_Ruta.Lugar_Origen,Tra_Ruta.Lugar_Destino,Id_Servicio,Id_Proveedor,Id_Itinerario,Tra_Servicio.Id_Ruta,Pasajeros,Adultos,Menores_Doce,Mayores_Doce,Tarifa,Sub_Total,Descuento,Total,Fecha_Servicio,Lugar_PickUp,Lugar_DropOff,Notas_PickUP,Notas_DropOff,Nombre_PickUp,Nombre_DropOff,Nombre_Ruta,Estado,Tra_Servicio.Tipo_Ruta,Nombre_Proveedor,Horario',
      orderField: '',
      searchField: '',
      where: 'Id_Itinerario =' + Id_Itinerario
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadServicesById(Id_Servicio) {
    let sqlConfig = {
      table: 'Tra_Servicio inner Join Tra_Ruta On Tra_Servicio.Id_Ruta = Tra_Ruta.Id_Ruta',
      fields: 'Tra_Servicio.Id_Vehiculo,Tra_Ruta.Lugar_Origen,Tra_Ruta.Lugar_Destino,Id_Servicio,Id_Proveedor,Id_Itinerario,Tra_Servicio.Id_Ruta,Pasajeros,Adultos,Menores_Doce,Mayores_Doce,Tarifa,Sub_Total,Descuento,Total,Fecha_Servicio,Lugar_PickUp,Lugar_DropOff,Notas_PickUP,Notas_DropOff,Nombre_PickUp,Nombre_DropOff,Nombre_Ruta,Estado,Tra_Servicio.Tipo_Ruta,Nombre_Proveedor,Horario',
      orderField: '',
      searchField: '',
      where: 'Id_Servicio =' + Id_Servicio
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async insertItinerary(Itinerary){
    let sqlConfig = {
      table: 'Tra_Itinerario',
      fields: 'Id_Cliente,Nombre_Pasajero,Porcentaje_Comision,Sub_Total,Descuento,Total,Cargar_Cliente,Correo_Cliente,Whatsapp_Cliente',
      values: '\'' + Itinerary.Id_Cliente
      + '\',\'' + Itinerary.Nombre_Pasajero
      + '\',\'' + Itinerary.Porcentaje_Comision
      + '\',\'' + Itinerary.Sub_Total
      + '\',\'' + Itinerary.Descuento
      + '\',\'' + Itinerary.Total
      + '\',\'' + Itinerary.Cargar_Cliente
      + '\',\'' + Itinerary.Correo_Cliente
      + '\',\'' + Itinerary.Whatsapp_Cliente
      + '\''
    };
    return await this.apiService.insertRecord(sqlConfig);
  }
  async updateItinerary(Itinerary){
    let sqlConfig = {
      table: 'Tra_Itinerario',
      fields: 'Id_Cliente = ' + Itinerary.Id_Cliente
      + ',Nombre_Pasajero = \'' + Itinerary.Nombre_Pasajero
      + '\',Porcentaje_Comision = \'' + Itinerary.Porcentaje_Comision
      + '\',Sub_Total = \'' + Itinerary.Sub_Total
      + '\',Descuento = \'' + Itinerary.Descuento
      + '\',Cargar_Cliente=\'' + Itinerary.Cargar_Cliente
      + '\',Correo_Cliente=\'' + Itinerary.Correo_Cliente
      + '\',Whatsapp_Cliente=\'' + Itinerary.Whatsapp_Cliente + '\'',
      where: 'Id_Itinerario =' + Itinerary.Id_Itinerario
    };
    return await this.apiService.updateRecord(sqlConfig);
  }
  async insertService(Service,Id_Itinerario){
    let sqlConfig = {
      table: 'Tra_Servicio',
      fields: 'Id_Itinerario,Id_Proveedor,Id_Ruta,Pasajeros,Adultos,Menores_Doce,Mayores_Doce,Tarifa,Sub_Total,Descuento,Total,Fecha_Servicio,Lugar_PickUp,Lugar_DropOff,Notas_PickUP,Notas_DropOff,Tipo_Ruta,Horario,Nombre_PickUp,Nombre_DropOff,Nombre_Ruta,Nombre_Proveedor,Estado',
      values: '\'' + Id_Itinerario
      + '\',\'' + Service.Id_Proveedor
      + '\',\'' + Service.Id_Ruta
      + '\',\'' + Service.Pasajeros
      + '\',\'' + Service.Adultos
      + '\',\'' + Service.Menores_Doce
      + '\',\'' + Service.Mayores_Doce
      + '\',\'' + Service.Tarifa
      + '\',\'' + Service.Sub_Total
      + '\',\'' + Service.Descuento
      + '\',\'' + Service.Total
      + '\',\'' + Service.Fecha_Servicio
      + '\',\'' + Service.Lugar_PickUp
      + '\',\'' + Service.Lugar_DropOff
      + '\',\'' + Service.Notas_PickUP
      + '\',\'' + Service.Notas_DropOff
      + '\',\'' + Service.Tipo_Ruta
      + '\',\'' + Service.Horario
      + '\',\'' + Service.Nombre_PickUp
      + '\',\'' + Service.Nombre_DropOff
      + '\',\'' + Service.Nombre_Ruta
      + '\',\'' + Service.Nombre_Proveedor
      + '\',\'' + Service.Estado
      + '\''
    };
    return await this.apiService.insertRecord(sqlConfig);
  }
  async updateService(Service){
    let sqlConfig = {
      table: 'Tra_Servicio',
      fields: ' Id_Proveedor = ' + Service.Id_Proveedor
      + ',Id_Ruta = \'' + Service.Id_Ruta
      + '\',Pasajeros = \'' + Service.Pasajeros
      + '\',Adultos = \'' + Service.Adultos
      + '\',Menores_Doce = \'' + Service.Menores_Doce
      + '\',Mayores_Doce = \'' + Service.Mayores_Doce
      + '\',Tarifa = \'' + Service.Tarifa
      + '\',Sub_Total = \'' + Service.Sub_Total
      + '\',Descuento = \'' + Service.Descuento
      + '\',Fecha_Servicio = \'' + Service.Fecha_Servicio
      + '\',Lugar_PickUp = \'' + Service.Lugar_PickUp
      + '\',Lugar_DropOff = \'' + Service.Lugar_DropOff
      + '\',Notas_PickUP = \'' + Service.Notas_PickUP
      + '\',Notas_DropOff = \'' + Service.Notas_DropOff
      + '\',Tipo_Ruta = \'' + Service.Tipo_Ruta
      + '\',Horario = \'' + Service.Horario
      + '\',Nombre_PickUp = \'' + Service.Nombre_PickUp
      + '\',Nombre_DropOff = \'' + Service.Nombre_DropOff
      + '\',Nombre_Ruta = \'' + Service.Nombre_Ruta
      + '\',Nombre_Proveedor = \'' + Service.Nombre_Proveedor
      + '\',Estado=\'' + Service.Estado + '\'',
      where: 'Id_Servicio =' + Service.Id_Servicio
    };
    return await this.apiService.updateRecord(sqlConfig);
  }

}
