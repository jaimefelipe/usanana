import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CentroCostoService } from './centro-costo.service';
@Component({
  selector: 'app-centro-costo',
  templateUrl: './centro-costo.component.html',
  styleUrls: ['./centro-costo.component.css']
})
export class CentroCostoComponent implements OnInit {

  constructor(private centroCostoService:CentroCostoService) { }

  edit = false;
  searchField = '';
  bankAccountans = [];
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Centros = [];
  Centro = {
    Id_Centro_Costo:'',
    Nombre:''
  }

  ngOnInit(): void {
    this.loadCentros();
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
    this.loadCentros();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadCentros(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   editRecord(Centro){
    this.edit = true;
    if(Centro){
        this.loadCentro(Centro.Id_Centro_Contable);
    }else{
      this.Centro = {
        Id_Centro_Costo:'',
       Nombre:''
      }
    }
   }
  async loadCentros(search?:any){
    let data = await this.centroCostoService.loadCentros(this.paginacion,search);
    if(data['total'] == 0){
      this.Centros = [];
    }else{
      this.Centros = data['data'];
    }
  }
  async loadCentro(Id_Centro_Contable){
    let data = await this.centroCostoService.loadCentro(Id_Centro_Contable);
    if(data['total'] == 0){
      this.Centro = {
        Id_Centro_Costo:'',
        Nombre:''
      }
    }else{
      this.Centro = data['data'][0];
    }
  }
  async grabar(){
    if(this.Centro.Nombre == ""){
      Swal.fire('Favor suministrar el nombre ');
      return false;
    }
   
    let data = await this.centroCostoService.saveCentro(this.Centro);

    if(data['success'] == 'true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadCentros(this.searchField);
      this.edit = false;
    }
    return true;
  }

}
