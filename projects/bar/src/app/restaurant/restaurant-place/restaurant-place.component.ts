import { RestaurantPlaceService } from './restaurant-place.service';
import { RestaurantZoneService } from '../restaurant-zone/restaurant-zone.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurant-place',
  templateUrl: './restaurant-place.component.html',
  styleUrls: ['./restaurant-place.component.css']
})
export class RestaurantPlaceComponent implements OnInit {
  constructor(
    private restaurantPlaceService:RestaurantPlaceService,
    private restaurantZoneService:RestaurantZoneService
    ) { }
  Places = [];
  Zones = [];
  searchField = ""
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
  Place = {
    Id_Mesa:'',
    Id_Zona:'1',
    Nombre: '',
    Cuenta_Contable:'',
    Codigo_Actividad : '',
    Arriba:'',
    Derecha:'',
    Estado:'1',
    Tipo:'1',
  }
  ngOnInit(): void {
    this.loadPlaces();
    this.loadZones();
  }
  async loadPlaces(search?:any){
    let data = await this.restaurantPlaceService.loadPlaces(this.paginacion,search);
    if(data['total'] == 0){
      this.Places = [];
    }else{
      this.Places = data['data'];
    }
  }
  async loadZones(search?:any){
    let data = await this.restaurantZoneService.loadZones(this.paginacion,search);
    if(data['total'] == 0){
      this.Zones = [];
    }else{
      this.Zones = data['data'];
    }
  }
  async editRecord(Place){
    this.edit = true;
    if(Place){
      this.Place.Id_Mesa = Place.Id_Mesa;
      this.loadPlace();
    }else{
      this.Place = {
        Id_Mesa:'',
        Id_Zona:'1',
        Nombre: '',
        Cuenta_Contable:'',
        Codigo_Actividad:'',
        Arriba:'',
        Derecha:'',
        Estado:'1',
        Tipo:'1'
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
    this.loadPlaces();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadPlaces(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    if(this.Place.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre de la Mesa');
      return false;
    }
    let data = await this.restaurantPlaceService.savePlace(this.Place);
    if(data['success'] =='true'){
      Swal.fire('Mesa grabada correctamente');
      this.loadPlaces(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadPlace(){
    let data = await this.restaurantPlaceService.loadPlace(this.Place.Id_Mesa);
    if(data['total']==1){
      this.Place = data['data'][0];
    }
   }

}
