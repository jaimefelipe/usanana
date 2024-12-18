import { Component, OnInit } from '@angular/core';
import { ConceptoTipoPlanillaService } from './concepto-tipo-planilla.service';
import { ConceptoSalarialService } from '../concepto-salarial/concepto-salarial.service';
import { TipoPlanillaService } from '../tipo-planilla/tipo-planilla.service';

@Component({
  selector: 'app-concepto-tipo-planilla',
  templateUrl: './concepto-tipo-planilla.component.html',
  styleUrls: ['./concepto-tipo-planilla.component.css']
})
export class ConceptoTipoPlanillaComponent implements OnInit {

  constructor(
    private conceptoTipoPlanillaService:ConceptoTipoPlanillaService,
    private conceptoSalarialService:ConceptoSalarialService,
    private tipoPlanillaService:TipoPlanillaService
  ) { }

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

  Concepto_Tipo_Planilla = {
    Id_Concepto_Tipo_Planilla:'',
    Id_Tipo_Planilla:'',
    Id_Concepto_Salarial:'',
    Estado:'1'
  }

  ngOnInit() {
    this.leerTipoPlanilla();
    this.leerConceptoSalariales();
    this.loadConceptosTipos();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadConceptosTipos(this.searchField);
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
  async editRecord(ConceptoTipo){
    this.edit = true;
    if(ConceptoTipo){
        await this.loadConceptosTipos(ConceptoTipo.Id_Concepto_Tipo_Planilla);
    }else{
      this.Concepto_Tipo_Planilla = {
        Id_Concepto_Tipo_Planilla:'',
        Id_Tipo_Planilla:'',
        Id_Concepto_Salarial:'',
        Estado:'1'
      }
    }
  }
  
  async loadConceptoTipoPlanilla(Id_Concepto_Tipo_Planilla){
    let data = await this.conceptoTipoPlanillaService.loadConceptoTIpoPlanilla(Id_Concepto_Tipo_Planilla);
    if(data['total'] == 0){
      this.Concepto_Tipo_Planilla = {
        Id_Concepto_Tipo_Planilla:'',
        Id_Tipo_Planilla:'',
        Id_Concepto_Salarial:'',
        Estado:'1'
      }
    }else{
      this.Concepto_Tipo_Planilla = data['data'][0];
    }
  }

  async loadConceptosTipos(search?){
    let data = await this.conceptoTipoPlanillaService.loadConceptosTipoPlanilla(this.paginacion,search);
    if(data['total'] == 0){
      this.ConceptoTipos = [];
    }else{
      this.ConceptoTipos = data['data'];
    }
  }

  async grabar(){
    this.conceptoTipoPlanillaService.saveConceptoTipoPlanilla(this.Concepto_Tipo_Planilla);
    this.loadConceptosTipos();
    this.cancel();
  }
  cancel(){
    this.edit = false;
    
  }

  async leerConceptoSalariales(){
    let  paginacion = {
      FirstRow: 1,
      LastRow: 500,
      TotalRows: 0
    };
    let data = await this.conceptoSalarialService.loadConceptos(paginacion,'');
    if(data['total'] == 0){
      this.Conceptos = [];
    }else{
      this.Conceptos = data['data'];
    }

  }
  async leerTipoPlanilla(){
    let  paginacion = {
      FirstRow: 1,
      LastRow: 500,
      TotalRows: 0
    };
    let data = await this.tipoPlanillaService.loadTipos(paginacion,'');
    if(data['total'] == 0){
      this.Tipos = [];
    }else{
      this.Tipos = data['data'];
    }
  }
}
