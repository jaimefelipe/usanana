import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PeriodoPagoService } from './periodo-pago.service';

@Component({
  selector: 'app-periodo-pago',
  templateUrl: './periodo-pago.component.html',
  styleUrls: ['./periodo-pago.component.css']
})
export class PeriodoPagoComponent implements OnInit {

  constructor(private periodoPagoService:PeriodoPagoService) { }

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
    Id_Periodo_Pago:'',
    Nombre:'',
    Horas_Periodo:''
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
   editRecord(Centro){
    this.edit = true;
    if(Centro){
        this.loadCentro(Centro.Id_Periodo_Pago);
    }else{
      this.Periodo = {
        Id_Periodo_Pago:'',
        Nombre:'',
        Horas_Periodo:''
      }
    }
   }
  async loadPeriodos(search?:any){
    let data = await this.periodoPagoService.loadPeriodos(this.paginacion,search);
    if(data['total'] == 0){
      this.Periodos = [];
    }else{
      this.Periodos = data['data'];
    }
  }
  async loadCentro(Id_Centro_Pago){
    let data = await this.periodoPagoService.loadCentro(Id_Centro_Pago);
    if(data['total'] == 0){
      this.Periodo = {
        Id_Periodo_Pago:'',
        Nombre:'',
        Horas_Periodo:''
      }
    }else{
      this.Periodo = data['data'][0];
    }
  }
  async grabar(){
    if(this.Periodo.Nombre == ""){
      Swal.fire('Favor suministrar el nombre ');
      return false;
    }
    if(this.Periodo.Horas_Periodo == ""){
      Swal.fire('Favor suministrar el La cantidad de horas por periodo ');
      return false;
    }
   
    let data = await this.periodoPagoService.savePeriodo(this.Periodo);

    if(data['success'] == 'true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadPeriodos(this.searchField);
      this.edit = false;
    }
    return true;
  }

}
