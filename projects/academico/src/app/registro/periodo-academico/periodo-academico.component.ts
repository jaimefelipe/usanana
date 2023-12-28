import { Component, OnInit } from '@angular/core';
import { PeriodoAcademicoService } from './periodo-academico.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-periodo-academico',
  templateUrl: './periodo-academico.component.html',
  styleUrls: ['./periodo-academico.component.css']
})
export class PeriodoAcademicoComponent implements OnInit {

  constructor(private periodoAcademicoService:PeriodoAcademicoService) { }
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
    Id_Periodo_Academico:'',
    Bloque:'',
    Anio:'',
    Inicio:'',
    Fin:'',
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
        this.loadPeriodo(Periodo.Id_Periodo_Academico);
    }else{
      this.Periodo = {
        Id_Periodo_Academico:'',
        Bloque:'',
        Anio:'',
        Inicio:'',
        Fin:'',
        Estado:''
      }
    }
   }
  async loadPeriodos(search?:any){
    let data = await this.periodoAcademicoService.loadPeriodos(this.paginacion,search);
    if(data['total'] == 0){
      this.Periodos = [];
    }else{
      this.Periodos = data['data'];
    }
  }
  async loadPeriodo(Id_Periodo_Academico){
    let data = await this.periodoAcademicoService.loadPeriodo(Id_Periodo_Academico);
    if(data['total'] == 0){
      this.Periodo = {
        Id_Periodo_Academico:'',
        Bloque:'',
        Anio:'',
        Inicio:'',
        Fin:'',
        Estado:''
      }
    }else{
      this.Periodo = data['data'][0];
    }
  }
  async grabar(){
    if(this.Periodo.Bloque == ""){
      Swal.fire('Favor suministrar el Bloque');
      return false;
    }
    if(this.Periodo.Anio == ""){
      Swal.fire('Favor suministrar el año');
      return false;
    }
    let data = await this.periodoAcademicoService.savePeriodo(this.Periodo);

    if(data['success'] == 'true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadPeriodos(this.searchField);
      this.edit = false;
    }
    return true;
  }

}
