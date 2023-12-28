import { RouteRateService } from './../../transport/route-rate/route-rate.service';
import { RouteService } from './../../transport/route/route.service';
import { Component, OnInit } from '@angular/core';
import { ItinerarioService } from './itinerario.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { ScheduleService } from '../../transport/schedule/schedule.service';
import { HotelService } from '../../lodge/hotel/hotel.service';
import { TipoHabitacionService } from '../../lodge/tipo-habitacion/tipo-habitacion.service';
import { PlaceService } from '../../core/place/place.service';
import { TourService } from '../../tours/tour/tour.service';
import { TarifaTourService } from '../../tours/tarifa-tour/tarifa-tour.service';
import { TarifaHotelService } from '../../lodge/tarifa-hotel/tarifa-hotel.service';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-itinerario',
  templateUrl: './itinerario.component.html',
  styleUrls: ['./itinerario.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ItinerarioComponent implements OnInit {

  constructor(
    private itinerarioService:ItinerarioService,
    private contactoService:ContactoService,
    private routeService:RouteService,
    private scheduleService:ScheduleService,
    private hotelService:HotelService,
    private routeRateService:RouteRateService,
    private tipoHabitacionService:TipoHabitacionService,
    private placeService:PlaceService,
    private tourService:TourService,
    private tarifaTourService:TarifaTourService,
    private tarifaHotelService:TarifaHotelService
    ) { }

  hoy = new Date();
  Paises: any;
  Numeros = Array.from(Array(50).keys());

  edit = false;
  PantallaServicio = false;
  ProveedorPanel = false;
  PantallaRutas = false;
  PlacePanel = false;
  HotelPanel = false;
  TourPanel = false;

  searchField = '';
  searchServicios = '';
  searchFieldProveedor = '';
  searchFieldRutas = '';
  searchFieldPlace = '';
  searchFielHotel = '';
  searchFielTour = '';


  Cantidad_Habitaciones = 0;

  Itinerarios = [];
  Servicios = [];
  Paquetes = [];
  Habitaciones = [];
  Proveedores = [];
  Rutas = [];
  Horarios = [];
  HotelesOrigen = [];
  HotelesDestino = [];
  Lugares = [];
  Hoteles = [];
  Tours = [];


  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  paginacionServicios = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  paginacionProveedor = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  paginacionRuta = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  }
  paginacionLugar = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  }
  paginacionHotel = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  }
  paginacionTour = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  }

  Itinerario = {
    Id_Itinerario: '',
    Nombre_Pasajero: '',
    Correo_Cliente: '',
    Whatsapp_Cliente:'',
    Pais_Cliente: '',
    Llegada_Pais:'',
    Fecha_Llegada:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Vuelo_Llegada_Pais:'',
    Hora_Llegada_Pais:'',
    Salida_Pais:'',
    Fecha_Salida:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Vuelo_Salida_Pais:'',
    Hora_Salida_Pais:'',
    Cantidad_Habitaciones:'1',
    Cantidad_Adultos:'1',
    Cantidad_Adolecentes:'0',
    Cantidad_Ninos:'0',
    Pasajeros:'1',
    Id_Paquete:''
  }
  Servicio = {
    Indice : null,
    Secuencia : '',
    Habitacion1 : '',
    Habitacion2 : '',
    Habitacion3 : '',
    Habitacion4 : '',
    Habitacion5 : '',
    Habitacion6 : '',
    Huesped_Habitacion : '',
    Id_Servicio : '',
    Id_Itinerario : '',
    Id_Sitio : '',
    Fecha_Servicio : '',
    Id_Paquete: '',
    Id_Paquete_Detalle:'',
    Fecha:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Id_Ruta: '',
    Nombre_Ruta: '',
    Nombre_Proveedor:'',
    Nombre_Servicio: '',
    Nombre_Sitio : '',
    Pasajeros : '',
    Adultos: '1',
    Menores_Doce: '0',
    Mayores_Doce: '0',
    Tarifa: '0',
    Sub_Total: '0',
    Descuento: '0',
    Total: 0,
    Id_Sitio_Inicio: '',
    Nombre_Inicio: '',
    Id_Sitio_Fin: '',
    Nombre_Fin: '',
    Lugar_PickUp : '',
    Lugar_DropOff : '',
    Nombre_PickUp : '',
    Nombre_DropOff : '',
    Notas_Inicio : '',
    Notas_Fin : '',
    Tipo_Ruta : '1',
    Tipo_Servicio : '1',
    Tipo_Servicio_Origen : '',
    Lugar_Origen : '',
    Lugar_Destino : '',
    Horario:'',
    Id_Proveedor:'',
    indice:'',
    Estado: '1',
    Numero_Confirmacion_Proveedor : '',
    Fecha_Confirmacion_Proveedor : '',
    Notas_Confirmacion_Proveedor : '',
    Id_Registro_Origen : '',
    Cantidad_Dias: '1',
    Moneda:''
  }

  ngOnInit(): void {
    this.loadItinerarios();
    this.CargarPaises();
    this.leerPaquetes();
    this.cargarProveedores();
    this.cargarRutas();
    this.CargarTiposHabitacion();
    this.CargarLugares();
  }
  async CargarPaises(){
    this.Paises = await this.itinerarioService.obtenerPaises();
  }
  ChangePage(action){
    if (action == 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion.FirstRow < 50) {
        this.paginacion.FirstRow = 1;
        this.paginacion.LastRow = 50;
      } else {
        this.paginacion.FirstRow= this.paginacion.FirstRow -50;
        this.paginacion.LastRow= this.paginacion.LastRow -50;
      }
    }
    if (action == 2) {
      this.paginacion.FirstRow = this.paginacion.FirstRow +50;
      this.paginacion.LastRow = this.paginacion.LastRow + 50;
    }
    this.loadItinerarios();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabProveedor(event){
    if (event.key === 'Enter') {
      this.searchProveedor();
    }
  }
  keytabRoutes(event){
    if (event.key === 'Enter') {
      this.searchRoutes();
    }
  }
  keytabPlaces(event){
    if (event.key === 'Enter') {
      this.searchPlaces();
    }
  }
  keytabHotels(event){
    if (event.key === 'Enter') {
      this.searchHotels();
    }
  }
  keytabTours(event){
    if (event.key === 'Enter') {
      this.searchTours();
    }
  }
  search(){
    this.loadItinerarios(this.searchField);
  }
  searchProveedor(){
    this.cargarProveedores(this.searchFieldProveedor);
  }
  searchRoutes(){
    this.cargarRutas(this.searchFieldRutas);
  }
  searchPlaces(){
    this.CargarLugares(this.searchFieldPlace);
  }
  searchHotels(){
    this.cargarHotelesPorDestino(this.searchFielHotel);
  }
  searchTours(){

  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   editRecord(Itinerario){
    this.edit = true;
    if(Itinerario){
        this.loadItinerario(Itinerario.Id_Itinerario);
    }else{
      this.Itinerario = {
        Id_Itinerario: '',
        Nombre_Pasajero: '',
        Correo_Cliente: '',
        Whatsapp_Cliente:'',
        Pais_Cliente: '',
        Llegada_Pais:'',
        Fecha_Llegada:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Vuelo_Llegada_Pais:'',
        Hora_Llegada_Pais:'',
        Salida_Pais:'',
        Fecha_Salida:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Vuelo_Salida_Pais:'',
        Hora_Salida_Pais:'',
        Cantidad_Habitaciones:'1',
        Cantidad_Adultos:'1',
        Cantidad_Adolecentes:'0',
        Cantidad_Ninos:'0',
        Pasajeros:'1',
        Id_Paquete:''
      }
    }
   }
  async loadItinerarios(search?:any){
    let data = await this.itinerarioService.loadItinerarios(this.paginacion,search);
    if(data['total'] == 0){
      this.Itinerarios = [];
    }else{
      this.Itinerarios = data['data'];
    }
  }
  async loadItinerario(Id_Itinerario){
    let data = await this.itinerarioService.loadItinerario(Id_Itinerario);
    if(data['total'] == 0){
      this.Itinerario = {
        Id_Itinerario: '',
        Nombre_Pasajero: '',
        Correo_Cliente: '',
        Whatsapp_Cliente:'',
        Pais_Cliente: '',
        Llegada_Pais:'',
        Fecha_Llegada:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Vuelo_Llegada_Pais:'',
        Hora_Llegada_Pais:'',
        Salida_Pais:'',
        Fecha_Salida:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Vuelo_Salida_Pais:'',
        Hora_Salida_Pais:'',
        Cantidad_Habitaciones:'1',
        Cantidad_Adultos:'1',
        Cantidad_Adolecentes:'0',
        Cantidad_Ninos:'0',
        Pasajeros:'1',
        Id_Paquete:''
      }
    }else{
      this.Itinerario = data['data'][0];
      let fecha1Arr =this.Itinerario.Llegada_Pais.split('/');
      this.Itinerario.Fecha_Llegada = {
        month: parseInt(fecha1Arr[1]),
        day: parseInt(fecha1Arr[0]),
        year: parseInt(fecha1Arr[2]),
      }
      let fecha2Arr =this.Itinerario.Salida_Pais.split('/');
      this.Itinerario.Fecha_Salida = {
        month: parseInt(fecha2Arr[1]),
        day: parseInt(fecha2Arr[0]),
        year: parseInt(fecha2Arr[2]),
      }
      this.SumarPasajeros();
      this.LeerServicios();
    }
  }
  async grabar(){
    if(this.Itinerario.Nombre_Pasajero == ""){
      Swal.fire('Favor suministrar el Nombre del Cliente');
      return false;
    }
    if(this.Itinerario.Whatsapp_Cliente == ""){
      Swal.fire('Favor suministrar el Whatsapp del Cliente');
      return false;
    }
    this.Itinerario.Llegada_Pais = this.Itinerario.Fecha_Llegada.day + '/' + this.Itinerario.Fecha_Llegada.month + '/' + this.Itinerario.Fecha_Llegada.year;
    this.Itinerario.Salida_Pais = this.Itinerario.Fecha_Salida.day + '/' + this.Itinerario.Fecha_Salida.month + '/' + this.Itinerario.Fecha_Salida.year;

    if(this.Itinerario.Id_Itinerario == ''){
      this.NuevoItinerario();
    }else{
      this.ModificarItinerario();
    }
    return true;
  }

  async NuevoItinerario(){
    let data = await this.itinerarioService.NuevoItinerario(this.Itinerario);
    if(data['success'] == "true"){
      Swal.fire('Información actualizada');
      this.Itinerario.Id_Itinerario = data["data"][0]["Identity"];
    }
  }
  async ModificarItinerario(){
    let data = await this.itinerarioService.ModificarItinerario(this.Itinerario);
    if(data['success'] == "true"){
      Swal.fire('Información actualizada');
    }
  }

  async editServicio(servicio){
    this.Servicio = {
      Indice : null,
      Secuencia : '',
      Habitacion1 : '',
      Habitacion2 : '',
      Habitacion3 : '',
      Habitacion4 : '',
      Habitacion5 : '',
      Habitacion6 : '',
      Huesped_Habitacion : '',
      Id_Servicio : '',
      Id_Itinerario : '',
      Id_Sitio : '',
      Fecha_Servicio : '',
      Id_Paquete: '',
      Id_Paquete_Detalle:'',
      Fecha:  {
        month: this.hoy.getMonth() + 1,
        day: this.hoy.getDate(),
        year: this.hoy.getFullYear()
      },
      Id_Ruta: '',
      Nombre_Ruta: '',
      Nombre_Proveedor:'',
      Nombre_Servicio: '',
      Nombre_Sitio : '',
      Pasajeros : '',
      Adultos: '1',
      Menores_Doce: '0',
      Mayores_Doce: '0',
      Tarifa: '0',
      Sub_Total: '0',
      Descuento: '0',
      Total: 0,
      Id_Sitio_Inicio: '',
      Nombre_Inicio: '',
      Id_Sitio_Fin: '',
      Nombre_Fin: '',
      Lugar_PickUp : '',
      Lugar_DropOff : '',
      Nombre_PickUp : '',
      Nombre_DropOff : '',
      Notas_Inicio : '',
      Notas_Fin : '',
      Tipo_Ruta : '1',
      Tipo_Servicio : '1',
      Tipo_Servicio_Origen : '',
      Lugar_Origen : '',
      Lugar_Destino : '',
      Horario:'',
      Id_Proveedor:'',
      indice:'',
      Estado: '1',
      Numero_Confirmacion_Proveedor : '',
      Fecha_Confirmacion_Proveedor : '',
      Notas_Confirmacion_Proveedor : '',
      Id_Registro_Origen : '',
      Cantidad_Dias: '1',
      Moneda:''
    }
    this.PantallaServicio = true;
    if(servicio){
      await this.LeerServicio(servicio.Id_Servicio);
    }
    this.SumarPasajeros();
    this.Servicio.Adultos = this.Itinerario.Cantidad_Adultos;
    this.Servicio.Mayores_Doce = this.Itinerario.Cantidad_Adolecentes;
    this.Servicio.Menores_Doce = this.Itinerario.Cantidad_Ninos;
    this.Servicio.Pasajeros = this.Itinerario.Pasajeros;
  }

  closePantallaServicio(){
    this.PantallaServicio = false;
  }

  async LeerServicios(){
    let data = await this.itinerarioService.loadServicios(this.Itinerario.Id_Itinerario,this.paginacionServicios,this.searchServicios);
    if(data['total'] == 0){
      this.Servicios = [];
    }else{
      this.Servicios = data['data'];
    }
  }
  async LeerServicio(Id_Servicio){
    let data =  await this.itinerarioService.loadServicio(Id_Servicio);
    this.Servicio = data['data'][0];
    let fecha1Arr =this.Servicio.Fecha_Servicio.split('/');
    this.Servicio.Fecha = {
      month: parseInt(fecha1Arr[1]),
      day: parseInt(fecha1Arr[0]),
      year: parseInt(fecha1Arr[2]),
    }
    this.Servicio.Id_Itinerario = this.Itinerario.Id_Itinerario;
    this.cargarHorarios();
    this.CargarHotelesOrigen();
    this.CargarHotelesDestino();

  }
  async GrabarServicio(){
    this.Servicio.Id_Itinerario = this.Itinerario.Id_Itinerario;
    this.Servicio.Fecha_Servicio = this.Servicio.Fecha.year  + '/' + this.Servicio.Fecha.month + '/' + this.Servicio.Fecha.day ;

    let data = await this.itinerarioService.saveServicio(this.Servicio);
    this.closePantallaServicio()
    this.LeerServicios();
  }
  imprimir(){
    window.open('https://toxo.work/reportes/turismo/boucher_old.php?id='+this.Itinerario.Id_Itinerario,'_Blank')
  }
  SumarPasajeros(){
    if(!this.Itinerario.Cantidad_Adultos){
      this.Itinerario.Cantidad_Adultos = '1';
    }
    if(!this.Itinerario.Cantidad_Adolecentes){
      this.Itinerario.Cantidad_Adolecentes = '0';
    }
    if(!this.Itinerario.Cantidad_Ninos){
      this.Itinerario.Cantidad_Ninos = '0';
    }
    let numero = parseInt(this.Itinerario.Cantidad_Adultos) + parseInt(this.Itinerario.Cantidad_Adolecentes) + parseInt(this.Itinerario.Cantidad_Ninos);
    this.Itinerario.Pasajeros = String(numero);
    //Si el tipo de servicio es privado la tarifa es la de la ruta de lo contario es por persona
  }
  async leerPaquetes(){
    let data = await this.itinerarioService.leerPaquetes();
    if(data['total'] == 0){
      this.Paquetes = [];
    }else{
      this.Paquetes = data['data'];
    }
  }
  async cargarRutas(search?){
    let data = await this.routeService.loadRoutes(this.paginacionRuta,search);
    if(data['total'] == 0){
      this.Rutas = [];
    }else{
      this.Rutas = data['data'];
    }
  }

  async cargarProveedores(search?){
    let data = await this.contactoService.loadPersonas(this.paginacionProveedor,search,2);
    if(data['total'] == 0){
      this.Proveedores = [];
    }else{
      this.Proveedores = data['data'];
    }
  }
  async cargarHorarios(){
    let data = await this.scheduleService.loadSchedulesByRoute(this.Servicio.Id_Registro_Origen);
    if(data['total'] == 0){
      this.Horarios = [];
    }else{
      this.Horarios = data['data'];
    }
  }
  async CargarHotelesOrigen(){
    let data = await this.hotelService.loadHotelsFromPlace(this.Servicio.Lugar_Origen);
    if(data['total'] == 0){
      this.HotelesOrigen = [];
    }else{
      this.HotelesOrigen = data['data'];
    }
  }
  async CargarHotelesDestino(){
    let data = await this.hotelService.loadHotelsFromPlace(this.Servicio.Lugar_Destino);
    if(data['total'] == 0){
      this.HotelesDestino = [];
    }else{
      this.HotelesDestino = data['data'];
    }
  }
  async CargarTiposHabitacion(){
    let data = await this.tipoHabitacionService.cartarTipodeHabitacion();
    if(data['total'] == 0){
      this.Habitaciones = [];
    }else{
      this.Habitaciones = data['data'];
    }
  }
  async CargarLugares(search?){
    let data = await this.placeService.loadSites(this.paginacionLugar,search);
    if(data['total'] == 0){
      this.Lugares = [];
    }else{
      this.Lugares = data['data'];
    }
  }
  async cargarHotelesPorDestino(Id_Place){
    let data = await this.hotelService.loadHotelsFromPlace(Id_Place);
    if(data['total'] == 0){
      this.Hoteles = [];
    }else{
      this.Hoteles = data['data'];
    }
  }
  async cargarTours(Id_Place){
    let data = await this.tourService.LeerTourPorSitio(Id_Place);
    if(data['total'] == 0){
      this.Tours = [];
    }else{
      this.Tours = data['data'];
    }
  }

  async CargarTarifaTransporte(){
    this.Servicio.Fecha_Servicio = this.Servicio.Fecha.day + '/' + this.Servicio.Fecha.month + '/' + this.Servicio.Fecha.year;
    let data = await this.routeRateService.loadRouteRatePerProvider(this.Servicio.Id_Registro_Origen,this.Servicio.Id_Proveedor,this.Servicio.Tipo_Servicio_Origen,this.Servicio.Fecha_Servicio);
    if(data['total'] == 0){
      Swal.fire('No existe Tarifa para esta ruta');
      this.Servicio.Tarifa = '0';
      this.Servicio.Total = 0;
    }else{
      this.Servicio.Tarifa = data['data'][0]['Tarifa'];
      let Monto = parseInt(this.Servicio.Pasajeros) * parseInt(this.Servicio.Tarifa);
      this.Servicio.Total = Monto;
      this.Servicio.Moneda = data['data'][0]['Moneda'];
    }
  }

  selectProveedor(Proveedor){
    this.Servicio.Id_Proveedor = Proveedor.Id_Persona;
    this.Servicio.Nombre_Proveedor = Proveedor.Nombre;
    this.cerrarPantallaProveedor();
  }
  SeleccionarRuta(Ruta){
    this.Servicio.Id_Registro_Origen = Ruta.Id_Ruta;
    this.Servicio.Nombre_Servicio = Ruta.Nombre;
    this.Servicio.Lugar_Origen = Ruta.Lugar_Origen;
    this.Servicio.Lugar_Destino = Ruta.Lugar_Destino;
    this.cargarHorarios();
    this.CargarHotelesOrigen();
    this.CargarHotelesDestino();
    this.CargarTarifaTransporte();
    this.cerrarPantallaRutas();
  }
  GenerarPaquete(){}
  openPantallaProveedor(){
    this.ProveedorPanel = true;
  }
  cerrarPantallaProveedor(){
    this.ProveedorPanel = false
  }
  cerrarPantallaRutas(){
    this.PantallaRutas = false;
  }
  cerrarPantalalHoteles(){
    this.HotelPanel = false;
  }
  openPantallaRuta(){
    this.PantallaRutas = true;
  }
  openPantallaLugar(){
    this.PlacePanel = true;
  }
  closePlacePanel(){
    this.PlacePanel = false;
  }
  async openPantallaHotel(){
    if(this.Servicio.Id_Sitio_Inicio == ''){
      Swal.fire('Selecciones el lugar primero');
      return false
    }else{
      await this.cargarHotelesPorDestino(this.Servicio.Id_Sitio_Inicio);
      this.HotelPanel = true;
      return true;
    }
  }
  async openPantallaTur(){
    if(this.Servicio.Id_Sitio_Inicio == ''){
      Swal.fire('Selecciones el lugar primero');
      return false;
    }
    if(this.Servicio.Id_Proveedor == ''){
      Swal.fire('Selecciones el lugar proveedor');
      return false;
    }
    await this.cargarTours(this.Servicio.Id_Sitio_Inicio);
    this.TourPanel = true;
    return true;
  }
  cerrarPantalalTours(){
    this.TourPanel = false;
  }
  SolicitudProveedor(){
    window.open('https://toxo.work/reportes/turismo/MailProveedor.php?id='+this.Servicio.Id_Servicio, "_blank");
  }
  GenerarBoucher(){
    window.open('https://toxo.work/reportes/turismo/boucher.php?id='+this.Servicio.Id_Servicio, "_blank");
  }
  Cotizar(){
    window.open('https://toxo.work/reportes/turismo/CotizacionPdf.php?id='+this.Itinerario.Id_Itinerario, "_blank");
  }
  selectPlace(Lugar){
    this.Servicio.Id_Sitio_Inicio = Lugar.Id_Sitio;
    this.Servicio.Nombre_Inicio = Lugar.Nombre;
    this.closePlacePanel();
  }
  selectHotel(hotel){
    this.Servicio.Id_Registro_Origen = hotel.Id_Hotel;
    this.Servicio.Nombre_Servicio = hotel.Nombre;
    this.leerTarifaHotel();
    this.cerrarPantalalHoteles();
    return true;
  }
  selectTour(tour){
    this.Servicio.Id_Registro_Origen = tour.Id_Tour;
    this.Servicio.Nombre_Servicio = tour.Tour;
    // Leer la tarifa del Tour.
    this.leerTarifaTour(this.Servicio.Id_Registro_Origen,this.Servicio.Id_Proveedor);
    this.cerrarPantalalTours();
  }
  async leerTarifaHotel(){
    //jaime
    this.Servicio.Fecha_Servicio = this.Servicio.Fecha.day + '/' + this.Servicio.Fecha.month + '/' + this.Servicio.Fecha.year;
    let data = await this.tarifaHotelService.cargarTarifaHotel(this.Servicio.Id_Registro_Origen,this.Servicio.Tipo_Servicio_Origen,this.Servicio.Fecha_Servicio);
    if(data['total'] == 0){
      Swal.fire('No existe Tarifa para este Hotel');
      this.Servicio.Tarifa = '0';
      this.Servicio.Total = 0;
    }else{
      this.Servicio.Tarifa = data['data'][0]['Tarifa'];
      let Monto = parseInt(this.Servicio.Pasajeros) * parseInt(this.Servicio.Tarifa);
      this.Servicio.Total = Monto;
      this.Servicio.Moneda = data['data'][0]['Moneda'];
    }
  }
  async leerTarifaTour(Id_Tour,Id_Proveedor){
    this.Servicio.Fecha_Servicio = this.Servicio.Fecha.day + '/' + this.Servicio.Fecha.month + '/' + this.Servicio.Fecha.year;
    let data = await this.tarifaTourService.cargarTarifaProveedor(Id_Tour,Id_Proveedor,this.Servicio.Fecha_Servicio);
    if(data['total'] == 0){
      Swal.fire('No existe Tarifa para esta Tour por este Proveedor');
      this.Servicio.Tarifa = '0';
      this.Servicio.Total = 0;
    }else{
      this.Servicio.Tarifa = data['data'][0]['Tarifa'];
      let Monto = parseInt(this.Servicio.Pasajeros) * parseInt(this.Servicio.Tarifa);
      this.Servicio.Total = Monto;
      this.Servicio.Moneda = data['data'][0]['Moneda'];
    }
  }

}
