import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { VehicleService } from './vehicle.service';
import { VehicleTypeService } from '../vehicle-type/vehicle-type.service';
import { VehicleCategoryService } from '../vehicle-category/vehicle-category.service';
import { PlaceService } from '../../core/place/place.service';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class VehicleComponent implements OnInit {
  constructor(
    private vehicleService: VehicleService,
    private vehicleTypeService:VehicleTypeService,
    private vehicleCategoryService:VehicleCategoryService,
    private placeService:PlaceService
    ) {}
  hoy = new Date();
  PlacePanel = false;
  interfazInventario = false;
  appRestaurante = false;
  Vehicles = [];
  VehicleTypes = [];
  VehicleCategories = [];
  Places = [];
  searchField = '';
  searchFieldPlace = '';
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  edit = false;
  interfazContable = localStorage.getItem('InterfazContable');

  /**
   * Variables del
   * Formulario de Edición
   */
  Vehicle = {
    Id_Vehiculo: '',
    Placa: '',
    Marca: '',
    Modelo: '',
    Anio: '',
    Capacidad: '',
    Permiso_Turismo: '',
    Vencimiento_Permiso: '',
    Fecha_Vencimiento_Permiso:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Numero_Poliza: '',
    Vencimiento_Poliza: '',
    Fecha_Vencimiento_Poliza:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Id_Base: '',
    Nombre_Base:'',
    Estado: '1',
    Tipo: '',
    Serie: '',
    categoria: '',
  };
  ngOnInit(): void {
    this.loadVehicles();
    this.loadVehicleTypes();
    this.loadVehicleCategories();
    this.loadPlaces();
  }
  async loadVehicles(search?: any) {
    let data = await this.vehicleService.loadVehicles(this.paginacion, search);
    if (data['total'] == 0) {
      this.Vehicles = [];
    } else {
      this.Vehicles = data['data'];
    }
  }
  async editRecord(vehicle) {
    this.edit = true;
    if (vehicle) {
      this.Vehicle.Id_Vehiculo = vehicle.Id_Vehiculo;
      this.loadVehicle();
    } else {
      this.Vehicle = {
        Id_Vehiculo: '',
        Placa: '',
        Marca: '',
        Modelo: '',
        Anio: '',
        Capacidad: '',
        Permiso_Turismo: '',
        Vencimiento_Permiso: '',
        Fecha_Vencimiento_Permiso:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Numero_Poliza: '',
        Vencimiento_Poliza: '',
        Fecha_Vencimiento_Poliza:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Id_Base: '',
        Nombre_Base:'',
        Estado: '1',
        Tipo: '',
        Serie: '',
        categoria: '',
      };
    }
  }
  ChangePage(action) {
    if (action == 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion.FirstRow < 50) {
        this.paginacion.FirstRow = 1;
        this.paginacion.LastRow = 50;
      } else {
        this.paginacion.FirstRow = this.paginacion.FirstRow - 50;
        this.paginacion.LastRow = this.paginacion.LastRow - 50;
      }
    }
    if (action == 2) {
      this.paginacion.FirstRow = this.paginacion.FirstRow + 50;
      this.paginacion.LastRow = this.paginacion.LastRow + 50;
    }
    this.loadVehicles();
  }
  keytab(event) {
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabPlaces(event){
    if (event.key === 'Enter') {
      this.searchPlaces();
    }
  }
  async loadPlaces(search?:any){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    }
    let data = await this.placeService.loadSites(paginacion,this.searchFieldPlace);
    if(data['total'] == 0){
      this.Places = [];
    }else{
      this.Places = data['data'];
    }
  }
  search() {
    this.loadVehicles(this.searchField);
  }
  searchPlaces(){
    this.loadPlaces(this.searchFieldPlace);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
  cancel() {
    this.edit = false;
  }
  closePlacePanel(){
    this.PlacePanel = false;
  }
  async grabar() {
    if (this.Vehicle.Placa == '') {
      Swal.fire('Favor Suministrar el número de Placa');
      return false;
    }
    if(!this.Vehicle.Fecha_Vencimiento_Permiso.day){
      this.Vehicle.Vencimiento_Permiso = this.hoy.getMonth() + 1 + '/' + this.hoy.getDate() + '/' + this.hoy.getFullYear();
      this.Vehicle.Vencimiento_Poliza = this.hoy.getMonth() + 1 + '/' + this.hoy.getDate() + '/' + this.hoy.getFullYear();
    }else{
      this.Vehicle.Vencimiento_Permiso = this.Vehicle.Fecha_Vencimiento_Permiso.day + '/' + this.Vehicle.Fecha_Vencimiento_Permiso.month + '/' + this.Vehicle.Fecha_Vencimiento_Permiso.year;
      this.Vehicle.Vencimiento_Poliza = this.Vehicle.Fecha_Vencimiento_Poliza.day + '/' + this.Vehicle.Fecha_Vencimiento_Poliza.month + '/' + this.Vehicle.Fecha_Vencimiento_Poliza.year;
    }

    let data = await this.vehicleService.saveVehicle(this.Vehicle);
    if (data['success'] == 'true') {
      Swal.fire('Categoria grabada correctamente');
      this.loadVehicles(this.searchField);
      this.edit = false;
    }
    return true;
  }
  async loadVehicle() {
    let data = await this.vehicleService.loadVehicle(this.Vehicle.Id_Vehiculo);
    if (data['total'] == 1) {
      this.Vehicle = data['data'][0];
      let fechaArr = this.Vehicle.Vencimiento_Permiso.split('/');
      this.Vehicle.Fecha_Vencimiento_Permiso = {
        month: parseInt(fechaArr[1]),
        day: parseInt(fechaArr[0]),
        year: parseInt(fechaArr[2]),
      }
      fechaArr = this.Vehicle.Vencimiento_Poliza.split('/');
      this.Vehicle.Fecha_Vencimiento_Poliza = {
        month: parseInt(fechaArr[1]),
        day: parseInt(fechaArr[0]),
        year: parseInt(fechaArr[2]),
      }
    }
  }
  async loadVehicleTypes() {
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.vehicleTypeService.loadTipos(paginacion,'');
    this.VehicleTypes = data['data'];
  }
  async loadVehicleCategories() {
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.vehicleCategoryService.loadCategories(paginacion,'');
    this.VehicleCategories = data['data'];
  }
  openPlacePanel(){
    this.PlacePanel = true;
  }
  selectPlace(Place){
    this.Vehicle.Id_Base = Place.Id_Sitio;
    this.Vehicle.Nombre_Base = Place.Nombre;
    this.closePlacePanel();
  }
}
