import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-concepto-tipo-planilla',
  templateUrl: './concepto-tipo-planilla.component.html',
  styleUrls: ['./concepto-tipo-planilla.component.css']
})
export class ConceptoTipoPlanillaComponent implements OnInit {

  constructor() { }

  edit = false;

  searchField = '';

  ConceptoTipos = [];
  Tipos = [];
  Conceptos = [];

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  ConceptoTipo = {
    Id_Concepto_Tipo_Planilla:'',
    Id_Tipo_Planilla:'',
    Id_Concepto_Calculo:'',
    Estado:''
  }

  ngOnInit() {
  }
  search(){

  }
  keytab(e){

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
    this.loadConceptosTipos();
  }
  editRecord(e){

  }
  loadConceptosTipos(){}
  grabar(){

  }
  cancel(){
    
  }
}
