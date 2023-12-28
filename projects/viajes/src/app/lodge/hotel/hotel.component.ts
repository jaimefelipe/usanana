import { Component, OnInit } from '@angular/core';
import { HotelService } from './hotel.service';
import Swal from 'sweetalert2';
import { PlaceService } from '../../core/place/place.service';


@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit {

  constructor(
    private hotelService:HotelService,
    private placeService:PlaceService
    ) { }

  interfazInventario = false;
  appRestaurante = false;
  PlacePanel = false;
  Hotels = [];
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
  Hotel = {
    Id_Hotel:'',
    Nombre:'',
    Id_Sitio: '',
    Nombre_Sitio:'',
    Comision: '',
    Estado:'1'
  }
  ngOnInit(): void {
    this.loadHotels();
    this.loadPlaces();
  }
  async loadHotels(search?:any){
    let data = await this.hotelService.loadHotels(this.paginacion,search);
    if(data['total'] == 0){
      this.Hotels = [];
    }else{
      this.Hotels = data['data'];
    }
  }
  async editRecord(Hotel){
    this.edit = true;
    if(Hotel){
      this.Hotel.Id_Hotel = Hotel.Id_Hotel;
      this.loadCategory();
    }else{
      this.Hotel = {
        Id_Hotel:'',
        Nombre:'',
        Id_Sitio: '',
        Nombre_Sitio:'',
        Comision:'',
        Estado:'1'
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
    this.loadHotels();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadHotels(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    if(this.Hotel.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre');
      return false;
    }
    let data = await this.hotelService.saveHotel(this.Hotel);
    if(data['success'] =='true'){
      Swal.fire('Categoria grabada correctamente');
      this.loadHotels(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadCategory(){
    let data = await this.hotelService.loadHotel(this.Hotel.Id_Hotel);
    if(data['total']==1){
      this.Hotel = data['data'][0];
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
    this.Hotel.Id_Sitio = Place.Id_Sitio;
    this.Hotel.Nombre_Sitio = Place.Nombre;
    this.closePlacePanel();
  }
}
