import { Component, OnInit } from '@angular/core';
import { RouteRateService } from './route-rate.service';
import { RouteService } from '../route/route.service';
import { PeopleService } from '../../../../../main/src/app/general/people/people.service';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-route-rate',
  templateUrl: './route-rate.component.html',
  styleUrls: ['./route-rate.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class RouteRateComponent implements OnInit {

  constructor(
    private routeRateService:RouteRateService,
    private routeService:RouteService,
    private peopleService:PeopleService
  ) { }
  hoy = new Date();
  PantallaRutas = false;
  ProviderPanel = false;
  searchField = "";
  searchFieldRutas = "";
  searchFieldProvider = "";
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  edit = false;
  Rates = [];
  Routes = [];
  Provideres = [];
  Rate = {
    Id_Tarifa:'',
    Id_Ruta:'',
    Tipo_Ruta:'',
    Nombre_Ruta:'',
    Id_Proveedor:'',
    Nombre_Proveedor:'',
    Inicio:'',
    Fecha_Inicio:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Fin:'',
    Fecha_Fin:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Tarifa:'',
    Moneda:'',
  }

  ngOnInit(): void {
    this.search();
    this.searchRoutes();
    this.loadProviders();
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
    this.loadRates();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabRoutes(event){
    if (event.key === 'Enter') {
      this.searchRoutes();
    }
  }
  keytabProviders(event){
    if (event.key === 'Enter') {
      this.searchProviders();
    }
  }
  search(){
    this.loadRates(this.searchField);
  }
  searchProviders(){
    this.loadProviders();
  }
  async loadProviders(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.peopleService.loadPersonas(paginacion, this.searchFieldProvider,2 );
    this.Provideres = data['data'];
  }
  closeProviderPanel(){
    this.ProviderPanel = false;
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
  async loadRates(search?:any){
    let data = await this.routeRateService.loadRates(this.paginacion,search);
    if(data['total'] == 0){
      this.Rates = [];
    }else{
      this.Rates = data['data'];
    }
  }
  async loadRate(){
    let data = await this.routeRateService.loadRate(this.Rate.Id_Tarifa);
    if(data['total']==1){
      this.Rate = data['data'][0];
      let fechaArr = this.Rate.Inicio.split('/');
      this.Rate.Fecha_Inicio = {
        month: parseInt(fechaArr[1]),
        day: parseInt(fechaArr[0]),
        year: parseInt(fechaArr[2]),
      }
      fechaArr = this.Rate.Fin.split('/');
      this.Rate.Fecha_Fin = {
        month: parseInt(fechaArr[1]),
        day: parseInt(fechaArr[0]),
        year: parseInt(fechaArr[2]),
      }
    }else{
      this.Rate = {
        Id_Tarifa:'',
        Id_Ruta:'',
        Tipo_Ruta:'',
        Nombre_Ruta:'',
        Id_Proveedor:'',
        Nombre_Proveedor:'',
        Inicio:'',
        Fecha_Inicio:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Fin:'',
        Fecha_Fin:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Tarifa:'',
        Moneda:'',
      }
    }

  }
  editRecord(Rate){
    this.edit = true;
    if(Rate){
      this.Rate.Id_Tarifa = Rate.Id_Tarifa;
      this.loadRate();
    }else{
      this.Rate = {
        Id_Tarifa:'',
        Id_Ruta:'',
        Tipo_Ruta:'',
        Nombre_Ruta:'',
        Id_Proveedor:'',
        Nombre_Proveedor:'',
        Inicio:'',
        Fecha_Inicio:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Fin:'',
        Fecha_Fin:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Tarifa:'',
        Moneda:''
      }
      this.Rate.Inicio = this.Rate.Fecha_Inicio.day + '/' + this.Rate.Fecha_Inicio.month + '/' + this.Rate.Fecha_Inicio.year
      this.Rate.Fin = this.Rate.Fecha_Fin.day + '/' + this.Rate.Fecha_Fin.month + '/' + this.Rate.Fecha_Fin.year
    }
  }
  async grabar(){
    this.Rate.Inicio = this.Rate.Fecha_Inicio.day + '/' + this.Rate.Fecha_Inicio.month + '/' + this.Rate.Fecha_Inicio.year
    this.Rate.Fin = this.Rate.Fecha_Fin.day + '/' + this.Rate.Fecha_Fin.month + '/' + this.Rate.Fecha_Fin.year
    if (this.Rate.Id_Tarifa == "") {
      //Insertar header
      let data = await this.routeRateService.insertRate(this.Rate);
    }else{
      //Update header
      let data = await this.routeRateService.updateRate(this.Rate);
    }
    this.search();
    this.cancel();
  }
  cancel(){
    this.edit = false;
  }
  openPantallaRuta(){
    this.PantallaRutas = true;
  }
  closePantallaRutas(){
    this.PantallaRutas = false;
  }
  async SeleccionarRuta(Ruta){
    this.Rate.Id_Ruta = Ruta.Id_Ruta;
    this.Rate.Nombre_Ruta = Ruta.Nombre;
    this.closePantallaRutas();
  }
  openProviderPanel(){
    this.ProviderPanel = true;
  }
  selectProvider(Provider){
    this.Rate.Id_Proveedor = Provider.Id_Persona;
    this.Rate.Nombre_Proveedor = Provider.Nombre;
    this.closeProviderPanel();
  }
}
