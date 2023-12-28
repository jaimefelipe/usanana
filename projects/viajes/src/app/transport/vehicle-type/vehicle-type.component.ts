import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { VehicleTypeService } from './vehicle-type.service';
@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.css']
})
export class VehicleTypeComponent implements OnInit {

  constructor(private vehicleTypeService:VehicleTypeService) { }
  interfazInventario = false;
  appRestaurante = false;
  SeguridadStr = localStorage.getItem("ToxoSG");
  Seguridad = [];
  VehicleTypes = [];
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
  VehicleType = {
    Id_Tipo_Vehiculo:'',
    Tipo: ''
  }
  ngOnInit(): void {
    this.loadCategories();
  }
  async loadCategories(search?:any){
    let data = await this.vehicleTypeService.loadTipos(this.paginacion,search);
    if(data['total'] == 0){
      this.VehicleTypes = [];
    }else{
      this.VehicleTypes = data['data'];
    }
  }
  async editRecord(tipo){
    this.edit = true;
    if(tipo){
      this.VehicleType.Id_Tipo_Vehiculo = tipo.Id_Tipo_Vehiculo;
      this.loadCategory();
    }else{
      this.VehicleType = {
        Id_Tipo_Vehiculo:'',
        Tipo: ''
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
    this.loadCategories();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadCategories(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    if(this.VehicleType.Tipo == ""){
      Swal.fire('Favor Suministrar el nombre de la Categoria');
      return false;
    }

    let data = await this.vehicleTypeService.saveTipo(this.VehicleType);
    if(data['success'] =='true'){
      Swal.fire('Categoria grabada correctamente');
      this.loadCategories(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadCategory(){
    let data = await this.vehicleTypeService.loadTipo(this.VehicleType.Id_Tipo_Vehiculo);
    if(data['total']==1){
      this.VehicleType = data['data'][0];
    }
   }


}
