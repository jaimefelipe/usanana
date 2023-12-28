import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ItinerarioService {

  constructor(private apiService: ApiService) {}
  async loadItinerarios(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Tur_Itinerario',
      fields: 'Id_Itinerario,Nombre_Pasajero,Correo_Cliente,Estado,Creado_El',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadItinerario(Id_Itinerario) {
    let sqlConfig = {
      table: 'Tur_Itinerario',
      fields: 'Id_Itinerario,Nombre_Pasajero,Correo_Cliente,Whatsapp_Cliente,Pais_Cliente,Llegada_Pais,Vuelo_Llegada_Pais,Hora_Llegada_Pais,Salida_Pais,Vuelo_Salida_Pais,Hora_Salida_Pais,Cantidad_Adultos,Cantidad_Adolecentes,Cantidad_Ninos,Cantidad_Habitaciones,Estado',
      where: 'Id_Itinerario='+Id_Itinerario
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async NuevoItinerario(Itinerario){
    let sql = {
      table: 'Tur_Itinerario',
      fields: ' Nombre_Pasajero,Correo_Cliente,Whatsapp_Cliente,Pais_Cliente,Cantidad_Adultos,Cantidad_Adolecentes,Cantidad_Ninos,Cantidad_Habitaciones,Llegada_Pais,Vuelo_Llegada_Pais,Hora_Llegada_Pais,Salida_Pais,Vuelo_Salida_Pais,Hora_Salida_Pais,Id_Paquete',
      values: '\'' + Itinerario.Nombre_Pasajero
      + '\',\'' + Itinerario.Correo_Cliente
      + '\',\'' + Itinerario.Whatsapp_Cliente
      + '\',\'' + Itinerario.Pais_Cliente
      + '\',\'' + Itinerario.Cantidad_Adultos
      + '\',\'' + Itinerario.Cantidad_Adolecentes
      + '\',\'' + Itinerario.Cantidad_Ninos
      + '\',\'' + Itinerario.Cantidad_Habitaciones
      + '\',\'' + Itinerario.Llegada_Pais
      + '\',\'' + Itinerario.Vuelo_Llegada_Pais
      + '\',\'' + Itinerario.Hora_Llegada_Pais
      + '\',\'' + Itinerario.Salida_Pais
      + '\',\'' + Itinerario.Vuelo_Salida_Pais
      + '\',\'' + Itinerario.Hora_Salida_Pais
      + '\',\'' + Itinerario.Id_Paquete
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async ModificarItinerario(Itinerario){
    let sql = {
      table: 'Tur_Itinerario',
      fields: 'Nombre_Pasajero=\'' + Itinerario.Nombre_Pasajero
      + '\',Correo_Cliente=\'' + Itinerario.Correo_Cliente
      + '\',Whatsapp_Cliente=\'' + Itinerario.Whatsapp_Cliente
      + '\',Pais_Cliente=\'' + Itinerario.Pais_Cliente
      + '\',Cantidad_Adultos=\'' + Itinerario.Cantidad_Adultos
      + '\',Cantidad_Adolecentes=\'' + Itinerario.Cantidad_Adolecentes
      + '\',Cantidad_Ninos=\'' + Itinerario.Cantidad_Ninos
      + '\',Cantidad_Habitaciones=\'' + Itinerario.Cantidad_Habitaciones
      + '\',Llegada_Pais=\'' + Itinerario.Llegada_Pais
      + '\',Vuelo_Llegada_Pais=\'' + Itinerario.Vuelo_Llegada_Pais
      + '\',Hora_Llegada_Pais=\'' + Itinerario.Hora_Llegada_Pais
      + '\',Salida_Pais=\'' + Itinerario.Salida_Pais
      + '\',Vuelo_Salida_Pais=\'' + Itinerario.Vuelo_Salida_Pais
      + '\',Hora_Salida_Pais=\'' + Itinerario.Hora_Salida_Pais
      + '\',Id_Paquete=\'' + Itinerario.Id_Paquete
      + '\'',
      where: 'Id_Itinerario=' + Itinerario.Id_Itinerario
    };
    return await this.apiService.updateRecord(sql);
  }
  async saveItinerario(Itinerario){
    if(Itinerario.Id_Itinerario_Contable == ""){
      let sql = {
        table: 'Tur_Itinerario',
        fields: 'Nombre_Pasajero,Correo_Cliente,Whatsapp_Cliente',
        values: '\'' + Itinerario.Nombre_Pasajero
        + '\',\'' + Itinerario.Correo_Cliente
        + '\',\'' + Itinerario.Whatsapp_Cliente + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Tur_Itinerario',
        fields: 'Nombre_Pasajero=\'' + Itinerario.Nombre_Pasajero
        + '\',Correo_Cliente=\'' + Itinerario.Correo_Cliente
        + '\',Whatsapp_Cliente=\''+ Itinerario.Whatsapp_Cliente  + '\'',
        where: 'Id_Itinerario=' + Itinerario.Id_Itinerario
      };
      return await this.apiService.updateRecord(sql);
    }
  }

  async loadServicios(Id_Itinerario,paginacion,search?,Estado?) {
    let sqlConfig = {
      table: 'Tur_Servicio',
      fields: 'Id_Servicio,Id_Itinerario,Fecha_Servicio,Tipo_Servicio,Tipo_Servicio_Origen,Id_Proveedor,Nombre_Proveedor,Id_Registro_Origen,Nombre_Servicio,Horario,Id_Sitio_Inicio,Nombre_Inicio,Id_Sitio_Fin,Nombre_Fin,Notas_Inicio,Notas_Fin,Estado,Numero_Confirmacion_Proveedor,Fecha_Confirmacion_Proveedor,Notas_Confirmacion_Proveedor',
      searchField: search,
      paginacion: paginacion,
      where:'Id_Itinerario = ' + Id_Itinerario
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadServicio(Id_Servicio) {
    let sqlConfig = {
      table: 'Tur_Servicio',
      fields: 'Id_Servicio,Id_Itinerario,Fecha_Servicio,Tipo_Servicio,Tipo_Servicio_Origen,Id_Proveedor,Nombre_Proveedor,Id_Registro_Origen,Nombre_Servicio,Horario,Id_Sitio_Inicio,Nombre_Inicio,Id_Sitio_Fin,Nombre_Fin,Notas_Inicio,Notas_Fin,Estado,Numero_Confirmacion_Proveedor,Fecha_Confirmacion_Proveedor,Notas_Confirmacion_Proveedor,Lugar_Origen,Lugar_Destino,Tarifa,Sub_Total,Descuento,Total,Moneda,Cantidad_Dias',
      where:'Id_Servicio = ' + Id_Servicio
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveServicio(Servicio){
    if(Servicio.Id_Servicio == ""){
      let sql = {
        table: 'Tur_Servicio',
        fields: 'Id_Itinerario,Fecha_Servicio,Tipo_Servicio,Tipo_Servicio_Origen,Id_Proveedor,Nombre_Proveedor,Id_Registro_Origen,Nombre_Servicio,Horario,Id_Sitio_Inicio,Nombre_Inicio,Id_Sitio_Fin,Nombre_Fin,Notas_Inicio,Notas_Fin,Estado,Numero_Confirmacion_Proveedor,Fecha_Confirmacion_Proveedor,Notas_Confirmacion_Proveedor,Lugar_Origen,Lugar_Destino,Tarifa,Sub_Total,Descuento,Total,Moneda,Cantidad_Dias',
        values: '\'' + Servicio.Id_Itinerario
        + '\',\'' + Servicio.Fecha_Servicio
        + '\',\'' + Servicio.Tipo_Servicio  // 1. Transfer 2.Hospedaje 3. Tour
        + '\',\'' + Servicio.Tipo_Servicio_Origen // 1. Privado 2. Shuttle, Tipo de Habitación
        + '\',\'' + Servicio.Id_Proveedor
        + '\',\'' + Servicio.Nombre_Proveedor
        + '\',\'' + Servicio.Id_Registro_Origen // Id_Ruta, Id_Hotel, Id_Tour
        + '\',\'' + Servicio.Nombre_Servicio //Nombre_Ruta, Nombre_Hotel, Nombre Tour
        + '\',\'' + Servicio.Horario
        + '\',\'' + Servicio.Id_Sitio_Inicio
        + '\',\'' + Servicio.Nombre_Inicio
        + '\',\'' + Servicio.Id_Sitio_Fin
        + '\',\'' + Servicio.Nombre_Fin
        + '\',\'' + Servicio.Notas_Inicio
        + '\',\'' + Servicio.Notas_Fin
        + '\',\'' + Servicio.Estado
        + '\',\'' + Servicio.Numero_Confirmacion_Proveedor
        + '\',\'' + Servicio.Fecha_Confirmacion_Proveedor
        + '\',\'' + Servicio.Notas_Confirmacion_Proveedor
        + '\',\'' + Servicio.Lugar_Origen
        + '\',\'' + Servicio.Lugar_Destino
        + '\',\'' + Servicio.Tarifa
        + '\',\'' + Servicio.Sub_Total
        + '\',\'' + Servicio.Descuento
        + '\',\'' + Servicio.Total
        + '\',\'' + Servicio.Moneda
        + '\',\'' + Servicio.Cantidad_Dias
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Tur_Servicio',
        fields: 'Fecha_Servicio=\'' + Servicio.Fecha_Servicio
        + '\',Tipo_Servicio=\'' + Servicio.Tipo_Servicio
        + '\',Tipo_Servicio_Origen=\'' + Servicio.Tipo_Servicio_Origen
        + '\',Id_Proveedor=\'' + Servicio.Id_Proveedor
        + '\',Nombre_Proveedor=\'' + Servicio.Nombre_Proveedor
        + '\',Id_Registro_Origen=\'' + Servicio.Id_Registro_Origen
        + '\',Nombre_Servicio=\''+ Servicio.Nombre_Servicio
        + '\',Horario=\''+ Servicio.Horario
        + '\',Id_Sitio_Inicio=\''+ Servicio.Id_Sitio_Inicio
        + '\',Nombre_Inicio=\''+ Servicio.Nombre_Inicio
        + '\',Id_Sitio_Fin=\''+ Servicio.Id_Sitio_Fin
        + '\',Nombre_Fin=\''+ Servicio.Nombre_Fin
        + '\',Notas_Inicio=\''+ Servicio.Notas_Inicio
        + '\',Notas_Fin=\''+ Servicio.Notas_Fin
        + '\',Estado=\''+ Servicio.Estado
        + '\',Numero_Confirmacion_Proveedor=\''+ Servicio.Numero_Confirmacion_Proveedor
        + '\',Fecha_Confirmacion_Proveedor=\''+ Servicio.Fecha_Confirmacion_Proveedor
        + '\',Notas_Confirmacion_Proveedor=\''+ Servicio.Notas_Confirmacion_Proveedor
        + '\',Lugar_Origen=\''+ Servicio.Lugar_Origen
        + '\',Lugar_Destino=\''+ Servicio.Lugar_Destino
        + '\',Tarifa=\''+ Servicio.Tarifa
        + '\',Sub_Total=\''+ Servicio.Sub_Total
        + '\',Descuento=\''+ Servicio.Descuento
        + '\',Total=\''+ Servicio.Total
        + '\',Moneda=\''+ Servicio.Moneda
        + '\',Cantidad_Dias=\''+ Servicio.Cantidad_Dias
        + '\'',
        where: 'Id_Servicio=' + Servicio.Id_Servicio
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async obtenerPaises(){
    return this.apiService.obtenerPaises();
  }
  async leerPaquetes(){
    let sqlConfig = {
      table: 'Tur_Paquete',
      fields: 'Id_Paquete,Tipo,Nombre'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);

  }
}
