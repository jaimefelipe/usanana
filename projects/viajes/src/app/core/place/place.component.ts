import { Component, OnInit } from '@angular/core';
import { PlaceService } from './place.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {

  constructor(
    private placeService:PlaceService
    ) { }

  interfazInventario = false;
  appRestaurante = false;
  SeguridadStr = localStorage.getItem("ToxoSG");
  Seguridad = [];
  Places = [];
  searchField = ""
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  edit = false;
  interfazContable = localStorage.getItem("InterfazContable");
  Place = {
    Id_Sitio:'',
    Nombre:''
  }
  /**
   * Variables del
   * Formulario de Edición
   */

  ngOnInit(): void {
    if(this.SeguridadStr == ""){
      this.SeguridadStr = "0.0.0.0.0.0.0.0";
    }
    this.Seguridad = this.SeguridadStr.split(".");
    if(this.Seguridad[3] ==1){this.interfazInventario = true}
    if(this.Seguridad[7] ==1){this.appRestaurante = true}
    this.loadPlaces();
  }
  async loadPlaces(search?:any){
    let data = await this.placeService.loadSites(this.paginacion,search);
    if(data['total'] == 0){
      this.Places = [];
    }else{
      this.Places = data['data'];
    }
  }
  async editRecord(Place){
    this.edit = true;
    if(Place){
      this.Place.Id_Sitio = Place.Id_Sitio;
      this.loadPlace();
    }else{
      this.Place = {
        Id_Sitio:'',
        Nombre:''
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
      Swal.fire('Favor Suministrar el nombre de la Categoria');
      return false;
    }
    if (this.Place.Id_Sitio == "") {
      //Insertar header
      let data = await this.placeService.insertPlace(this.Place);
    }else{
      //Update header
      let data = await this.placeService.updatePlace(this.Place);
    }
    this.search();
    this.cancel();
    return true;
   }
   async loadPlace(){
    let data = await this.placeService.loadPlace(this.Place.Id_Sitio);
    if(data['total']==1){
      this.Place = data['data'][0];
    }
   }

}
