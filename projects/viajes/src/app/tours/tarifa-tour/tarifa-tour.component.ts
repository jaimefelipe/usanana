import { Component, OnInit } from '@angular/core';
import { TarifaTourService } from './tarifa-tour.service';
import { TourService } from '../tour/tour.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tarifa-tour',
  templateUrl: './tarifa-tour.component.html',
  styleUrls: ['./tarifa-tour.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class TarifaTourComponent implements OnInit {

  constructor(
    private tarifaTourService:TarifaTourService,
    private tourService:TourService,
    private contactoService:ContactoService
  ) { }

  edit = false;
  TarifaPanel = false;
  TourPanel = false;
  ProveedorPanel = false
  hoy = new Date();

  searchField = '';
  searchFieldTour = ""
  searchFieldProveedor = ""
  TarifasTour = [];
  TipoToures = [];
  Tours = [];
  Proveedores = [];

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  paginacionProveedor = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  TarifaTour = {
    Id_Tarifa_Tour:'',
    Nombre: ''
  }

  Tarifa = {
    Id_Tarifa: '',
    Id_Tour: '',
    Nombre_Tour : '',
    Inicio: '',
    Tipo_Ruta:'1',
    FechaInicio:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Fin: '',
    FechaFin:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Nombre_Origen: '',
    Id_Proveedor: '',
    Tarifa: '',
    Nombre_Proveedor : '',
    Moneda:''
  }

  ngOnInit() {
    this.cargarTarifasTour();
    this.cargarTours();
    this.cargarProveedores();
  }
  async cargarProveedores(search?){
    let data = await this.contactoService.loadPersonas(this.paginacionProveedor,search,2);
    if(data['total'] == 0){
      this.Proveedores = [];
    }else{
      this.Proveedores = data['data'];
    }
  }
  search(){
    this.cargarTarifasTour(this.searchField);
  }
  searchTour(){
    this.cargarTours(this.searchFieldTour);
  }
  searchProveedor(){
    this.cargarProveedores(this.searchFieldProveedor);
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.searchTour();
    }
  }
  keytabTour(event){
    if (event.key === 'Enter') {
      this.searchTour();
    }
  }
  keytabProveedor(event){
    if (event.key === 'Enter') {
      this.cargarProveedores();
    }
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
    this.cargarTarifasTour();
  }
  async cargarTarifasTour(search?:any){
    let data = await this.tarifaTourService.cartarTarifadeTour(this.paginacion,search);
    if(data['total'] == 0){
      this.TarifasTour = [];
    }else{
      this.TarifasTour = data['data'];
    }
  }
  async editRecord(TarifaTour){
    this.TarifaTour = {
      Id_Tarifa_Tour:'',
      Nombre: ''
    }
    if(TarifaTour){
      let data = await this.tarifaTourService.cargarTarifa(TarifaTour.Id_Tarifa);
      if(data['total']==1){
        this.Tarifa = data['data'][0];
        let fecha1Arr = data['data'][0]['Inicio'].split('/');
        this.Tarifa.FechaInicio = {
          month: parseInt(fecha1Arr[1]),
          day: parseInt(fecha1Arr[0]),
          year: parseInt(fecha1Arr[2]),
        }
        let fecha2Arr = data['data'][0]['Fin'].split('/');
        this.Tarifa.FechaFin = {
          month: parseInt(fecha2Arr[1]),
          day: parseInt(fecha2Arr[0]),
          year: parseInt(fecha2Arr[2]),
        }
      }
    }
    this.edit = true;
  }

  async grabar(){
    this.Tarifa.Inicio = this.Tarifa.FechaInicio.day + '/' + this.Tarifa.FechaInicio.month + '/' + this.Tarifa.FechaInicio.year;
    this.Tarifa.Fin = this.Tarifa.FechaFin.day + '/' + this.Tarifa.FechaFin.month + '/' + this.Tarifa.FechaFin.year;

    if(this.Tarifa.Id_Tarifa == ""){
      await this.tarifaTourService.EditarTarifa(this.Tarifa);
    }else{
      await this.tarifaTourService.NuevoTarifa(this.Tarifa);
    }
    this.cargarTarifasTour();
    this.cancel();
  }
  cancel(){
    this.edit = false;
  }

  abrirTourPanel(){
    this.TourPanel  = true;

  }
  selectTour(Tour){
    this.Tarifa.Id_Tour = Tour.Id_Tarifa;
    this.Tarifa.Nombre_Tour = Tour.Tour + '-' + Tour.Sitio;
    this.closePanelTours();
  }
  closePanelTours(){
    this.TourPanel = false;
  }
  async cargarTours(search?){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.tourService.LeerTours(paginacion,search);
    if(data['total'] == 0){
      this.Tours = [];
    }else{
      this.Tours = data['data'];
    }
  }
  abrirProveedorPanel(){
    this.ProveedorPanel = true;
  }
  selectProveedor(Proveedor){
    this.Tarifa.Id_Proveedor = Proveedor.Id_Persona;
    this.Tarifa.Nombre_Proveedor = Proveedor.Nombre;
    this.closePanelProveedor();
  }
  closePanelProveedor(){
    this.ProveedorPanel = false;
  }
}
