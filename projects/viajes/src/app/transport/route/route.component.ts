import { Component, OnInit } from '@angular/core';
import { RouteService } from './route.service';
import { PlaceService } from '../../core/place/place.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  constructor(
    private routeService:RouteService,
    private placeService:PlaceService
  ) { }
  PlacePanel = false;
  Panel = 1;
  Rutas = [];
  Places = [];
  searchField = "";
  searchFieldPlace = "";
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  edit = false;
  Ruta = {
    Id_Ruta:'',
    Lugar_Origen:'1',
    Lugar_Destino: '',
    Tipo_Ruta:'',
    Nombre : '',
    Origen_Nombre:'',
    Destino_Nombre:''
  }
  ngOnInit(): void {
    this.loadRutas();
    this.loadPlaces();
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
    //this.loadZones();
  }
  async loadRutas(search?:any){
    let data = await this.routeService.loadRoutes(this.paginacion,search);
    if(data['total'] == 0){
      this.Rutas = [];
    }else{
      this.Rutas = data['data'];
    }
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabPlaces(event){
    if (event.key === 'Enter') {
      this.searchPlaces();
    }
  }
  search(){
    this.loadRutas(this.searchField);
  }
  searchPlaces(){
    this.loadPlaces(this.searchFieldPlace);
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
  cancel(){
    this.edit = false;
  }
  async editRecord(Ruta){
    this.edit = true;

    if(Ruta){
      this.Ruta.Id_Ruta = Ruta.Id_Ruta;
      this.loadRoute();
    }else{
      Ruta = {
        Id_Ruta:'',
        Lugar_Origen:'1',
        Lugar_Destino: '',
        Tipo_Ruta:'',
        Nombre : '',
        Origen_Nombre:'',
        Destino_Nombre:''
      }
    }
  }
  async loadRoute(){
    let data = await this.routeService.loadRoute(this.Ruta.Id_Ruta);
    if(data['total']==1){
      this.Ruta = data['data'][0];
    }
  }
  async grabar(){
    if (this.Ruta.Id_Ruta == "") {
      //Insertar header
      let data = await this.routeService.insertRoute(this.Ruta);
    }else{
      //Update header
      let data = await this.routeService.updateRoute(this.Ruta);
    }
    this.search();
    this.cancel();
  }
  openPlacePanel(Panel){
    this.Panel = Panel;
    this.PlacePanel = true;
  }
  closePlacePanel(){
    this.PlacePanel = false;
  }
  selectPlace(Place){
    if(this.Panel ==1){
      this.Ruta.Lugar_Origen = Place.Id_Sitio;
      this.Ruta.Origen_Nombre = Place.Nombre
    }else{
      this.Ruta.Lugar_Origen = Place.Id_Sitio;
      this.Ruta.Destino_Nombre = Place.Nombre;
    }
    this.closePlacePanel();
  }

}
