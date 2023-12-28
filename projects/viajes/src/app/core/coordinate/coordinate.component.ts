import { Component, OnInit } from '@angular/core';
import { CoordinateService } from './coordinate.service';
import { TransportItineraryService } from '../../itinerario/transport-itinerary/transport-itinerary.service';

@Component({
  selector: 'app-coordinate',
  templateUrl: './coordinate.component.html',
  styleUrls: ['./coordinate.component.css']
})
export class CoordinateComponent implements OnInit {

  constructor(
    private coordinateService:CoordinateService,
    private transportItineraryService:TransportItineraryService
  ) { }
  edit = false;
  Paso = 1;
  ServiceByVehiclePanel = false;
  ServicePanel = false;
  Services = [];
  ServicesByDate = [];
  ServicesByVehicle = [];
  Dates = [];
  Vehiculo = {
    Id_Vehiculo:'',
    Placa:'',
    Nombre_Ruta:''
  };
  Vehicles = [];
  AllVehicles = [];
  searchField = '';
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  Date = {
    Fecha_Servicio:'',
    Pasajeros:''
  }

  Service = {
    Id_Servicio:'',
    Id_Itinerario:'',
    Fecha_Servicio:'',
    Proveedor:'',
    Placa:'',
    Tipo_Ruta:'',
    Nombre_Ruta:'',
    Pasajeros:'',
    Adultos:'',
    Mayores_Doce:'',
    Menores_Doce:'',
    Tarifa:'',
    Descuento:'',
    Service:'',
    Total:'',
    Horario:'',
    Nombre_PickUp:'',
    Notas_PickUP:'',
    Nombre_DropOff:'',
    Notas_DropOff:'',
    Id_Vehiculo:'',
    Estado:''
  }
  ngOnInit() {
    this.LoadDates();
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
    this.LoadDates();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.LoadDates(this.searchField);
  }
  editRecord(Date){
    this.Date = Date;
    this.edit = true;
    this.loadVehiclesByDate();
    this.loadServicesByDate();

  }
  async coordinar(){
    let data = await this.coordinateService.coordinar();
    if(data['success'] == 'true'){
      alert('Ok')
    }
  }
  async LoadDates(search?:any){
    let data = await this.coordinateService.loadDates(this.paginacion,search);
    if(data['total'] == 0){
      this.Dates = [];
    }else{
      this.Dates = data['data'];
    }
  }
  grabar(){

  }
  cancel(){
    this.edit = false;
  }
  async loadVehiclesByDate(){
    let data = await this.coordinateService.loadVehiclesByDate(this.Date.Fecha_Servicio);
    if(data['total'] == 0){
      this.Vehicles = [];
    }else{
      this.Vehicles = data['data'];
    }
  }
  async loadServicesByDate(){
    let data = await this.coordinateService.loadServicesByDate(this.Date.Fecha_Servicio);
    if(data['total'] == 0){
      this.ServicesByDate = [];
    }else{
      this.ServicesByDate = data['data'];
    }
  }
  async ShowVehicleServices(Vehiculo){
    this.Vehiculo = Vehiculo;
    this.ServiceByVehiclePanel = true;
    this.loadServiceByVehicle(Vehiculo.Id_Vehiculo,this.Date.Fecha_Servicio);
  }
  closeServiceByVehiclePanel(){
    this.ServiceByVehiclePanel = false;

  }
  async loadServiceByVehicle(Id_Vehiculo,Date){
    let data = await this.coordinateService.loadServiceByVehicle(Id_Vehiculo,Date);
    if(data['total'] == 0){
      this.ServicesByVehicle = [];
    }else{
      this.ServicesByVehicle = data['data'];
    }
  }
  SelelectService(Service,Paso){
    this.Paso = Paso;
    this.ServiceByVehiclePanel = false;
    this.ServicePanel = true;
    this.loadService(Service);
    this.LoadAllVehicles();
  }
  async loadService(Service){
    let data = await this.transportItineraryService.loadServicesById(Service.Id_Servicio);
    this.Service = data['data'][0];
  }
  closeServicePanel(){
    this.recargar();
    if(this.Paso == 1){
      this.edit =true;
    }else{
      this.ServiceByVehiclePanel = true;
    }
    this.ServicePanel = false;
  }
  async UnMountService(){
    let data = await this.coordinateService.UnMountService(this.Service.Id_Servicio);
    this.closeServicePanel();
  }
  async LoadAllVehicles(){
    let data = await this.coordinateService.LoadVehicles(this.Date.Fecha_Servicio)
    if(data['total'] == 0){
      this.AllVehicles = [];
    }else{
      this.AllVehicles = data['data'];
    }
  }
  async changeVehicle(){
    let data = await this.coordinateService.CangeVehicle(this.Service.Id_Servicio,this.Service.Id_Vehiculo);
    this.closeServicePanel();
  }
  async recargar(){
    let Fecha = this.Date.Fecha_Servicio;
    let Vehiculo = this.Vehiculo.Id_Vehiculo;
    //await this.editRecord(Fecha);
    this.loadVehiclesByDate();
    this.loadServicesByDate();
    await this.loadServiceByVehicle(Vehiculo,Fecha);
  }
  hojaRuta(){
    window.open('https://toxo.work/reportes/turismo/traHojaRuta.php?fe='+this.Date.Fecha_Servicio+'&id='+localStorage.getItem('Id_Empresa'),'_Blank');
  }
  async changeStatus(){
    let data = await this.coordinateService.ChangeStatusOfService(this.Service.Id_Servicio,this.Service.Estado);
    this.closeServicePanel();
  }
}
