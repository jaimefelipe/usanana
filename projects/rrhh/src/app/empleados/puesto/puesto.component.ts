import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PuestoService } from './puesto.service';

@Component({
  selector: 'app-puesto',
  templateUrl: './puesto.component.html',
  styleUrls: ['./puesto.component.css']
})
export class PuestoComponent implements OnInit {
  constructor(private PuestoService:PuestoService) { }

  edit = false;
  searchField = '';
  bankAccountans = [];
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Puestos = [];
  Puesto = {
    Id_Puesto:'',
    Puesto:''
  }

  ngOnInit(): void {
    this.loadPuestos();
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
    this.loadPuestos();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadPuestos(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   editRecord(Puesto){
    this.edit = true;
    if(Puesto){
        this.loadPuesto(Puesto.Id_Puesto);
    }else{
      this.Puesto = {
        Id_Puesto:'',
        Puesto:''
      }
    }
   }
  async loadPuestos(search?:any){
    let data = await this.PuestoService.loadPuestos(this.paginacion,search);
    if(data['total'] == 0){
      this.Puestos = [];
    }else{
      this.Puestos = data['data'];
    }
  }
  async loadPuesto(Id_Puesto){
    let data = await this.PuestoService.loadPuesto(Id_Puesto);
    
    if(data['total'] == 0){
      this.Puesto = {
        Id_Puesto:'',
        Puesto:''
      }
    }else{
      this.Puesto = data['data'][0];
    }
  }
  async grabar(){
    if(this.Puesto.Puesto == ""){
      Swal.fire('Favor suministrar el nombre ');
      return false;
    }
   
    let data = await this.PuestoService.savePuesto(this.Puesto);

    if(data['success'] == 'true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadPuestos(this.searchField);
      this.edit = false;
    }
    return true;
  }


}
