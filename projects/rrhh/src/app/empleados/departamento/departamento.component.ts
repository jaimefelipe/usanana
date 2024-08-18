import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DepartamentoService } from './departamento.service';


@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {

  constructor(private departamentoService:DepartamentoService) { }

  edit = false;
  searchField = '';
  bankAccountans = [];
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Departamentos = [];
  Departamento = {
    Id_Departamento:'',
    Departamento:''
  }

  ngOnInit(): void {
    this.loadDepartamentos();
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
    this.loadDepartamentos();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadDepartamentos(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   editRecord(Departamento){
    this.edit = true;
    if(Departamento){
        this.loadDepartamento(Departamento.Id_Departamento);
    }else{
      this.Departamento = {
        Id_Departamento:'',
        Departamento:''
      }
    }
   }
  async loadDepartamentos(search?:any){
    let data = await this.departamentoService.loadDepartamentos(this.paginacion,search);
    if(data['total'] == 0){
      this.Departamentos = [];
    }else{
      this.Departamentos = data['data'];
    }
  }
  async loadDepartamento(Id_Departamento){
    let data = await this.departamentoService.loadDepartamento(Id_Departamento);
    
    if(data['total'] == 0){
      this.Departamento = {
        Id_Departamento:'',
        Departamento:''
      }
    }else{
      this.Departamento = data['data'][0];
    }
  }
  async grabar(){
    if(this.Departamento.Departamento == ""){
      Swal.fire('Favor suministrar el nombre ');
      return false;
    }
   
    let data = await this.departamentoService.saveDepartamento(this.Departamento);

    if(data['success'] == 'true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadDepartamentos(this.searchField);
      this.edit = false;
    }
    return true;
  }


}
