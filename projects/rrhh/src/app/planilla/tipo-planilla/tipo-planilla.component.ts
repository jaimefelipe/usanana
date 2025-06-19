import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TipoPlanillaService } from './tipo-planilla.service';
import { PeriodoPagoService } from '../periodo-pago/periodo-pago.service';

@Component({
  selector: 'app-tipo-planilla',
  templateUrl: './tipo-planilla.component.html',
  styleUrls: ['./tipo-planilla.component.css']
})
export class TipoPlanillaComponent implements OnInit {

  constructor(
    private tipoPlanillaService:TipoPlanillaService,
    private periodoPagoService:PeriodoPagoService
  
  ) { }

  edit = false;
  searchField = '';
  bankAccountans = [];
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Tipos = [];
  Periodos = [];
  Tipo = {
    Id_Tipo_Planilla:'',
    Nombre:'',
    Id_Periodo_Pago:'',
    Metodo_Calculo_Salario:''
  }

  ngOnInit(): void {
    this.loadTipos();
    this.leerPeriodosPago();
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
    this.loadTipos();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadTipos(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   editRecord(Tipo){
    this.edit = true;
    if(Tipo){
        this.loadTipo(Tipo.Id_Tipo_Planilla);
    }else{
      this.Tipo = {
        Id_Tipo_Planilla:'',
        Nombre:'',
        Id_Periodo_Pago:'',
        Metodo_Calculo_Salario:''
      }
    }
   }
  async loadTipos(search?:any){
    let data = await this.tipoPlanillaService.loadTipos(this.paginacion,search);
    if(data['total'] == 0){
      this.Tipos = [];
    }else{
      this.Tipos = data['data'];
    }
  }
  async loadTipo(Id_Tipo_Pago){
    let data = await this.tipoPlanillaService.loadTipo(Id_Tipo_Pago);
    if(data['total'] == 0){
      this.Tipo = {
        Id_Tipo_Planilla:'',
        Nombre:'',
        Id_Periodo_Pago:'',
        Metodo_Calculo_Salario:''
      }
    }else{
      this.Tipo = data['data'][0];
    }
  }
  async grabar(){
    if(this.Tipo.Nombre == ""){
      Swal.fire('Favor suministrar el nombre ');
      return false;
    }
    if(this.Tipo.Id_Periodo_Pago == ""){
      Swal.fire('Favor suministrar el periodo de pago');
      return false;
    }
   
    let data = await this.tipoPlanillaService.saveTipo(this.Tipo);

    if(data['success'] == 'true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadTipos(this.searchField);
      this.edit = false;
    }
    return true;
  }
  async leerPeriodosPago(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.periodoPagoService.loadPeriodos(paginacion);
    this.Periodos = data['data'];
  }
}
