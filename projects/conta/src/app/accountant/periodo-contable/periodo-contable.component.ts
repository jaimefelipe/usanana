
import { PeriodoContableService } from './periodo-contable.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-periodo-contable',
  templateUrl: './periodo-contable.component.html',
  styleUrls: ['./periodo-contable.component.css']
})
export class PeriodoContableComponent implements OnInit {
  constructor(private periodoContableService:PeriodoContableService) { }
  edit = false;
  searchField = '';
  bankAccountans = [];
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Periodos = [];
  Periodo = {
    Id_Periodo_Contable:'',
    Mes:'',
    Anio:'',
    Secuencia:'',
    Estado:''
  }

  ngOnInit(): void {
    this.loadPeriodos();
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
    this.loadPeriodos();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadPeriodos(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   editRecord(Periodo){
    this.edit = true;
    if(Periodo){
        this.loadPeriodo(Periodo.Id_Periodo_Contable);
    }else{
      this.Periodo = {
        Id_Periodo_Contable:'',
        Mes:'',
        Anio:'',
        Secuencia:'',
        Estado:''
      }
    }
   }
  async loadPeriodos(search?:any){
    let data = await this.periodoContableService.loadPeriodos(this.paginacion,search);
    if(data['total'] == 0){
      this.Periodos = [];
    }else{
      this.Periodos = data['data'];
    }
  }
  async loadPeriodo(Id_Periodo_Contable){
    let data = await this.periodoContableService.loadPeriodo(Id_Periodo_Contable);
    if(data['total'] == 0){
      this.Periodo = {
        Id_Periodo_Contable:'',
        Mes:'',
        Anio:'',
        Secuencia:'',
        Estado:''
      }
    }else{
      this.Periodo = data['data'][0];
    }
  }
  async grabar(){
    if(this.Periodo.Mes == ""){
      Swal.fire('Favor suministrar el mes');
      return false;
    }
    if(this.Periodo.Anio == ""){
      Swal.fire('Favor suministrar el año');
      return false;
    }
    let data = await this.periodoContableService.savePeriodo(this.Periodo);

    if(data['success'] == 'true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadPeriodos(this.searchField);
      this.edit = false;
    }
    return true;
  }

}
