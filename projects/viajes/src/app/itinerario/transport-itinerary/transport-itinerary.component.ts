import { Component, OnInit } from '@angular/core';
import { TransportItineraryService } from './transport-itinerary.service';
import { PeopleService } from '../../../../../main/src/app/general/people/people.service';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { RouteService } from '../../transport/route/route.service';
import { RouteRateService } from '../../transport/route-rate/route-rate.service';
import { HotelService } from '../../lodge/hotel/hotel.service';
import { ScheduleService } from '../../transport/schedule/schedule.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-trasport-itinerary',
  templateUrl: './transport-itinerary.component.html',
  styleUrls: ['./transport-itinerary.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class TransportItineraryComponent implements OnInit {

  constructor(
    private transportItineraryService:TransportItineraryService,
    private peopleService:PeopleService,
    private routeService:RouteService,
    private routeRateService:RouteRateService,
    private hotelService:HotelService,
    private scheduleService:ScheduleService
     ) { }
  hoy = new Date();
  PantallaClientes = false;
  PantallaServicio = false;
  PantallaRutas = false;
  Numeros = Array.from(Array(50).keys());
  Itineraries = [];
  Services = [];
  Clientes = [];
  Routes = [];
  HotelesOrigen = [];
  HotelesDestino = [];
  Horarios = [];
  searchField = ""
  searchFieldClientes = "";
  searchFieldRutas = '';
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  TipoPersona = 1;
  edit = false;
  Itinerary = {
    Id_Itinerario: '',
    Id_Cliente: '',
    Nombre_Pasajero: '',
    Nombre_Cliente:'',
    Porcentaje_Comision: '0',
    Sub_Total: '0',
    Total: '0',
    Descuento: '0',
    Cargar_Cliente: '1',
    Correo_Cliente:'',
    Whatsapp_Cliente:''
  }
  Service = {
    Id_Servicio : '',
    Id_Itinerario : '',
    Fecha_Servicio : '',
    Fecha:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Id_Ruta: '',
    Nombre_Ruta: '',
    Pasajeros : 1,
    Adultos: '1',
    Menores_Doce: '0',
    Mayores_Doce: '0',
    Tarifa: '0',
    Sub_Total: '0',
    Descuento: '0',
    Total: 0,
    Lugar_PickUp : '',
    Lugar_DropOff : '',
    Nombre_PickUp : '',
    Nombre_DropOff : '',
    Notas_PickUP : '',
    Notas_DropOff : '',
    Tipo_Ruta : '1',
    Lugar_Origen : '',
    Lugar_Destino : '',
    Horario:'',
    Id_Proveedor:'',
    Nombre_Proveedor:'',
    indice:'',
    Estado:'1'
  }
  ngOnInit(): void {
    this.loadItineraries();
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
    this.loadItineraries();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabClientes(event){
    if (event.key === "Enter") {
      this.searchClientes(1);
    }
  }

  keytabRoutes(event){
    if (event.key === 'Enter') {
      this.searchRoutes();
    }
  }

  search(){
    this.loadItineraries(this.searchField);
  }

  async loadItineraries(search?:any){
    let data = await this.transportItineraryService.loadItineraries(this.paginacion,search);
    if(data['total'] == 0){
      this.Itineraries = [];
    }else{
      this.Itineraries = data['data'];
    }
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   closePantallaClientes(){
     if(this.TipoPersona == 2){
       this.PantallaServicio = true;
     }
     this.PantallaClientes = false;
   }
   async editRecord(Itinerary){
    this.edit = true;
    if(Itinerary){
      this.Itinerary.Id_Itinerario = Itinerary.Id_Itinerario;
      this.loadItinerary();
    }else{
      this.Itinerary = {
        Id_Itinerario: '',
        Id_Cliente: '',
        Nombre_Pasajero: '',
        Nombre_Cliente:'',
        Porcentaje_Comision: '0',
        Sub_Total: '0',
        Total: '0',
        Descuento: '0',
        Cargar_Cliente: '1',
        Correo_Cliente:'',
        Whatsapp_Cliente:''
      }
    }
  }
  async loadItinerary(){
    let data = await this.transportItineraryService.loadItinerary(this.Itinerary.Id_Itinerario);
    if(data['total']==1){
      this.Itinerary = data['data'][0];
      this.loadServices();
    }
  }
  async loadServices(){
    let data = await this.transportItineraryService.loadServices(this.Itinerary.Id_Itinerario);
    if(data['total'] == 0){
      this.Services = [];
    }else{
      this.Services = data['data'];
    }
  }
  async grabar(){
    if(this.Itinerary.Nombre_Pasajero == ''){
      Swal.fire('Debe suministrar el Nombre del Pasajero');
      return false;
    }
    //Calcular el Total de Itinerario
    await this.calcularTotales();
    if(this.Itinerary.Porcentaje_Comision == ''){
      this.Itinerary.Porcentaje_Comision = '0';
    }
    if(this.Itinerary.Descuento == ''){
      this.Itinerary.Descuento = '0';
    }
    if(this.Itinerary.Sub_Total == ''){
      this.Itinerary.Sub_Total = '0';
    }
    if(this.Itinerary.Total == ''){
      this.Itinerary.Total = '0';
    }

    if (this.Itinerary.Id_Itinerario == "") {
      //Insertar header
      let data = await this.transportItineraryService.insertItinerary(this.Itinerary);
      this.Itinerary.Id_Itinerario = data["data"][0]["Identity"];
    }else{
      //Update header
      let data = await this.transportItineraryService.updateItinerary(this.Itinerary);
    }
    this.grabarDetalles();
    this.cancel();
    return true;
  }
  async grabarDetalles(){
    for (let i = 0; i < this.Services.length; i++) {
      this.grabarUnDetalle(i);
    }
  }
  async grabarUnDetalle(indice){
    if(this.Services[indice].Id_Servicio == ''){
      //Insertar el servicio
      let data = await this.transportItineraryService.insertService(this.Services[indice],this.Itinerary.Id_Itinerario);
      this.Services[indice].Id_Servicio = data["data"][0]["Identity"];
    }else{
      //Actualizar el servicio
      if(this.Services[indice] == 1){
        let data = await this.transportItineraryService.updateService(this.Services[indice]);
      }
    }
  }
  editService(indice){
    this.Service = this.Services[indice];
    let fechaArr = this.Service.Fecha_Servicio.split('/');
    this.Service.Fecha = {
      month: parseInt(fechaArr[1]),
      day: parseInt(fechaArr[0]),
      year: parseInt(fechaArr[2]),
    }
    this.Services.splice(indice, 1);
    this.PantallaServicio = true;
    if(this.Service.Tipo_Ruta == '2'){
      this.leerHotelesOrigen();
      this.LeerHotelesDestion();
      this.leerHorarios();
    }
  }
  openClientePanel(tipo){
    this.TipoPersona = tipo;
    this.searchClientes(tipo);
    if(tipo == 2){
      this.PantallaServicio = false;
    }
    this.PantallaClientes = true;
  }
  async searchClientes(tipo?){
    if(tipo){
      this.TipoPersona = tipo;
    }
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.peopleService.loadPersonas(paginacion, this.searchFieldClientes,this.TipoPersona );
    this.Clientes = data['data'];
  }
  SeleccionarCliente(Cliente){
    if(this.TipoPersona == 1){
      this.Itinerary.Id_Cliente = Cliente.Id_Persona;
      this.Itinerary.Nombre_Cliente = Cliente.Nombre;
      this.Itinerary.Porcentaje_Comision = Cliente.Porcentaje_Comision;
      this.Itinerary.Descuento = Cliente.Porcentaje_Descuento;
    }else{
      this.Service.Id_Proveedor = Cliente.Id_Persona;
      this.Service.Nombre_Proveedor = Cliente.Nombre;
      this.loadRouteRate();
    }

    this.closePantallaClientes();
  }

  openPantallaServicio(){
    this.PantallaServicio = true;
  }
  closePantallaServicio(){
    if(this.Service.Id_Servicio !=''){
      this.Services.push(this.Service);
    }
    this.PantallaServicio = false;
    this.initServiceDetail();
  }
  openPantallaRuta(){
    this.searchRoutes();
    this.PantallaServicio = false;
    this.PantallaRutas = true;
  }
  closePantallaRutas(){
    this.PantallaRutas = false;
    this.PantallaServicio = true;
  }
  async searchRoutes(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.routeService.loadRoutes(paginacion, this.searchFieldRutas);
    this.Routes = data['data'];
  }
  async SeleccionarRuta(Ruta){
    this.Service.Id_Ruta = Ruta.Id_Ruta;
    this.Service.Nombre_Ruta = Ruta.Nombre;
    this.Service.Lugar_Origen = Ruta.Lugar_Origen;
    this.Service.Lugar_Destino = Ruta.Lugar_Destino;
    //Obtener la Tarifa de la Ruta
    this.loadRouteRate();
    this.closePantallaRutas();
  }
  async loadRouteRate(){
    if(this.Service.Id_Ruta == ''){
      return false;
    }
    if(this.Service.Id_Proveedor == ''){
      return false;
    }
    this.Service.Fecha_Servicio = this.Service.Fecha.day + '/' + this.Service.Fecha.month + '/' + this.Service.Fecha.year
    let data = await this.routeRateService.loadRouteRatePerProvider(this.Service.Id_Ruta,this.Service.Id_Proveedor,this.Service.Tipo_Ruta,this.Service.Fecha_Servicio);
    this.Service.Tarifa = data['data'][0]['Tarifa'];
    if(!this.Service.Tarifa){
      Swal.fire('No se ha definido tarifa para la ruta seleccionada, Debe agregar una tarifa o seleccionar otra ruta');
      this.Service.Id_Ruta = '';
      this.Service.Nombre_Ruta = '';
      this.Service.Lugar_Origen = '';
      this.Service.Lugar_Destino = '';
      return false;
    }else{
      this.SumarPasajeros();
    }
    if(this.Service.Tipo_Ruta == '2'){
      this.leerHotelesOrigen();
      this.LeerHotelesDestion();
      this.leerHorarios();
    }
    return true;
  }
  async leerHotelesOrigen(){
    let data = await this.hotelService.loadHotelsFromPlace(this.Service.Lugar_Origen);
    this.HotelesOrigen = data['data'];
  }
  async LeerHotelesDestion(){
    let data = await this.hotelService.loadHotelsFromPlace(this.Service.Lugar_Destino);
    this.HotelesDestino = data['data'];
  }
  async leerHorarios(){
    let data = await this.scheduleService.loadSchedulesByRoute(this.Service.Id_Ruta);
    if(data['total'] === 0){
      this.Horarios[0] = {
        Id_Horario : '0',
        Horario : 'Diguite el Horario en la notas del Pickup'
      }
    }else{
      this.Horarios = data['data'];
      this.Service.Horario = this.Horarios[0]['Horario'];
    }
  }

  addService(){
    if(this.Service.Id_Proveedor ==''){
      Swal.fire('Debe seleccionar un proveedor');
      return false;
    }
    if(this.Service.Id_Ruta ==''){
      Swal.fire('Debe seleccionar una ruta');
      return false;
    }
    if(this.Service.Tipo_Ruta == '1'){
      if(this.Service.Nombre_PickUp ==''){
        Swal.fire('Debe seleccionar una Pick Up');
        return false;
      }
      if(this.Service.Nombre_DropOff ==''){
        Swal.fire('Debe seleccionar una Drop Off');
        return false;
      }
      if(this.Service.Horario ==''){
        Swal.fire('Debe seleccionar una Horario');
        return false;
      }
    }
    //Actualizar la fecha
    this.Service.Fecha_Servicio = this.Service.Fecha.day + '/' + this.Service.Fecha.month + '/' + this.Service.Fecha.year;
    this.Services.push(this.Service);
    this.initServiceDetail();
    this.closePantallaServicio();
    return true;
  }
  initServiceDetail(){
    this.Service = {
      Id_Servicio : '',
      Id_Itinerario : '',
      Fecha_Servicio : '',
      Fecha:  {
        month: this.hoy.getMonth() + 1,
        day: this.hoy.getDate(),
        year: this.hoy.getFullYear()
      },
      Id_Ruta: '',
      Nombre_Ruta: '',
      Pasajeros : 1,
      Adultos: '1',
      Menores_Doce: '0',
      Mayores_Doce: '0',
      Tarifa: '0',
      Sub_Total: '0',
      Descuento: '0',
      Total: 0,
      Lugar_PickUp : '',
      Lugar_DropOff : '',
      Nombre_PickUp : '',
      Nombre_DropOff : '',
      Notas_PickUP : '',
      Notas_DropOff : '',
      Tipo_Ruta : '1',
      Lugar_Origen : '',
      Lugar_Destino : '',
      Horario:'',
      Id_Proveedor:'',
      Nombre_Proveedor:'',
      indice:'',
      Estado:'1'
    }
  }
  SumarPasajeros(){
    if(!this.Service.Adultos){
      this.Service.Adultos = '1';
    }
    if(!this.Service.Mayores_Doce){
      this.Service.Mayores_Doce = '0';
    }
    if(!this.Service.Menores_Doce){
      this.Service.Menores_Doce = '0';
    }
    let numero = parseInt(this.Service.Adultos) + parseInt(this.Service.Mayores_Doce) + parseInt(this.Service.Menores_Doce);
    this.Service.Pasajeros = numero;
    //Si el tipo de servicio es privado la tarifa es la de la ruta de lo contario es por persona
    if(this.Service.Tipo_Ruta ==="1") {
      this.Service.Total =parseFloat(this.Service.Tarifa);
    }else{
      let MontoAdultos = parseInt(this.Service.Adultos) * parseInt(this.Service.Tarifa);
      let MontoAdolecentes =  parseInt(this.Service.Mayores_Doce) * parseInt(this.Service.Tarifa);
      let MontoMenores = ( parseInt(this.Service.Menores_Doce) * parseInt(this.Service.Tarifa)) /2 ;
      this.Service.Total = MontoAdultos + MontoAdolecentes + MontoMenores;
    }
  }
  calcularTotales(){
    let SubTotal = 0;
    let Descuento = 0;
    let Total = 0;
    for (let i = 0; i < this.Services.length; i++) {
      SubTotal = SubTotal + parseFloat(this.Services[i].SubTotal);
      Descuento = Descuento + parseFloat(this.Services[i].Descuento);
      Total = Total + parseFloat(this.Services[i].Total);
    }
  }
  confirma(){
    window.open('http://ibo.jaimebrenes.com/reportes/turismo/traConfirma.php?id='+this.Itinerary.Id_Itinerario,'_blank')
  }
  removeVen_Factura_Detalle(Inddex){
    //Hay que revisar esta función

  }
}
