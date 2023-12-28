import { RestaurantZoneService } from './restaurant-zone.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurant-zone',
  templateUrl: './restaurant-zone.component.html',
  styleUrls: ['./restaurant-zone.component.css']
})
export class RestaurantZoneComponent implements OnInit {

  constructor(private restaurantZoneService:RestaurantZoneService) { }
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
  Zone = {
    Id_Zona:'',
    Id_Tipo:'1',
    Nombre: '',
    Cuenta_Contable:'',
    Codigo_Actividad : '',
    Estado:'1',
    Servicio:'0'
  }
  ngOnInit(): void {
    this.loadZones()
  }
  async loadZones(search?:any){
    let data = await this.restaurantZoneService.loadZones(this.paginacion,search);
    if(data['total'] == 0){
      this.Zones = [];
    }else{
      this.Zones = data['data'];
    }
  }
  async editRecord(Zone){
    this.edit = true;
    if(Zone){
      this.Zone.Id_Zona = Zone.Id_Zona;
      this.loadZone();
    }else{
      this.Zone = {
        Id_Zona:'',
        Id_Tipo:'1',
        Nombre: '',
        Cuenta_Contable:'',
        Codigo_Actividad:'',
        Estado:'1',
        Servicio:'0'
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
    this.loadZones();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadZones(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    if(this.Zone.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre de la Zona');
      return false;
    }
    let data = await this.restaurantZoneService.saveZone(this.Zone);
    if(data['success'] =='true'){
      Swal.fire('Zona grabada correctamente');
      this.loadZones(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadZone(){
    let data = await this.restaurantZoneService.loadZone(this.Zone.Id_Zona);
    if(data['total']==1){
      this.Zone = data['data'][0];
      if(this.Zone.Servicio ==''){
        this.Zone.Servicio = '0';
      }
    }
   }

}
