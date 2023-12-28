import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { VehicleCategoryService } from './vehicle-category.service';

@Component({
  selector: 'app-vehicle-category',
  templateUrl: './vehicle-category.component.html',
  styleUrls: ['./vehicle-category.component.css'],

})
export class VehicleCategoryComponent implements OnInit {

  constructor(private VehicleCategoryService:VehicleCategoryService) { }
  interfazInventario = false;
  appRestaurante = false;
  SeguridadStr = localStorage.getItem("ToxoSG");
  Seguridad = [];
  Categories = [];
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
  category = {
    Id_Categoria_Vehiculo:'',
    Id_Tipo:'1',
    Nombre: '',
    Cuenta_Contable:'',
    Codigo_Actividad : '',
    Utilidad:'',
    Cocina:'0',
    Estado:'1'
  }
  ngOnInit(): void {
    if(this.SeguridadStr == ""){
      this.SeguridadStr = "0.0.0.0.0.0.0.0";
    }
    this.Seguridad = this.SeguridadStr.split(".");
    if(this.Seguridad[3] ==1){this.interfazInventario = true}
    if(this.Seguridad[7] ==1){this.appRestaurante = true}
    this.loadCategories();
  }
  async loadCategories(search?:any){
    let data = await this.VehicleCategoryService.loadCategories(this.paginacion,search);
    if(data['total'] == 0){
      this.Categories = [];
    }else{
      this.Categories = data['data'];
    }
  }
  async editRecord(category){
    this.edit = true;
    if(category){
      this.category.Id_Categoria_Vehiculo = category.Id_Categoria_Vehiculo;
      this.loadCategory();
    }else{
      this.category = {
        Id_Categoria_Vehiculo:'',
        Id_Tipo:'1',
        Nombre: '',
        Cuenta_Contable:'',
        Codigo_Actividad:'',
        Utilidad:'',
        Cocina:'0',
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
    if(this.category.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre de la Categoria');
      return false;
    }
    if(this.category.Utilidad ==''){
      this.category.Utilidad = '0';
    }
    let data = await this.VehicleCategoryService.saveCategory(this.category);
    if(data['success'] =='true'){
      Swal.fire('Categoria grabada correctamente');
      this.loadCategories(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadCategory(){
    let data = await this.VehicleCategoryService.loadCategory(this.category.Id_Categoria_Vehiculo);
    if(data['total']==1){
      this.category = data['data'][0];
    }
   }

}
