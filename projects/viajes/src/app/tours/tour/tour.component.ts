import { Component, OnInit } from '@angular/core';
import { TourService } from './tour.service';
import Swal from 'sweetalert2';
import { PlaceService } from '../../core/place/place.service';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {

  constructor(
    private tourService:TourService,
    private placeService:PlaceService
    ) { }

  interfazInventario = false;
  appRestaurante = false;
  PlacePanel = false;
  Tours = [];
  Places = [];
  searchField = "";
  searchFieldPlace = '';
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  edit = false;
  interfazContable = localStorage.getItem("InterfazContable");

  /**
   * Variables del
   * Formulario de Edición
   */
  Tour = {
    Id_Tour: '',
    Id_Sitio: '',
    Nombre_Sitio: '',
    Nombre:'',
    Estado:'',
    Url:'',
    KeyWords:'',
    Descripcion:'',
    Contenido:'',
    Foto:''
  }
  ngOnInit(): void {
    this.loadTours();
    this.loadPlaces();
  }
  async loadTours(search?:any){
    let data = await this.tourService.LeerTours(this.paginacion,search);
    if(data['total'] == 0){
      this.Tours = [];
    }else{
      this.Tours = data['data'];
    }
  }
  async editRecord(Tour){
    this.edit = true;
    if(Tour){
      this.Tour.Id_Tour = Tour.Id_Tour;
      this.loadTour();
    }else{
      this.Tour = {
        Id_Tour: '',
        Id_Sitio: '',
        Nombre_Sitio: '',
        Nombre:'',
        Estado:'',
        Url:'',
        KeyWords:'',
        Descripcion:'',
        Contenido:'',
        Foto:''
      }
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
    this.loadTours();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadTours(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    if(this.Tour.Id_Sitio ==""){
      Swal.fire('Favor Suministrar el Sitio');
      return false;
    }
    if(this.Tour.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre');
      return false;
    }
    let data = await this.tourService.saveTour(this.Tour);
    if(data['success'] =='true'){
      Swal.fire('Tour grabada correctamente');
      this.loadTours(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadTour(){
    let data = await this.tourService.loadTour(this.Tour.Id_Tour);
    if(data['total']==1){
      this.Tour = data['data'][0];
    }
    return true
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
  keytabPlaces(event){
    if (event.key === 'Enter') {
      this.searchPlaces();
    }
  }
  openPlacePanel(){
    this.PlacePanel = true;
  }
  closePlacePanel(){
    this.PlacePanel = false;
  }
  selectPlace(Place){
    this.Tour.Id_Sitio = Place.Id_Sitio;
    this.Tour.Nombre_Sitio = Place.Nombre;
    this.closePlacePanel();
  }

}
