import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ConceptoSalarialService } from './concepto-salarial.service';

@Component({
  selector: 'app-concepto-salarial',
  templateUrl: './concepto-salarial.component.html',
  styleUrls: ['./concepto-salarial.component.css']
})
export class ConceptoSalarialComponent implements OnInit {

  constructor(private periodoPagoService:ConceptoSalarialService) { }

  edit = false;
  searchField = '';
  bankAccountans = [];
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Conceptos = [];
  Periodo = {
    Id_Concepto_Salarial:'',
    Nombre:'',
    Tipo_Concepto:'',
    Aplica_Como:'',
    Tipo_Referencia:'',
    Tipo_Valor:'',
    Aplica_Calculos:'',
    Estado:'',
    Secuencia:'',
    Valor:'',
    Formula:'',
    Etiqueta:''
  }

  ngOnInit(): void {
    this.loadConceptos();
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
    this.loadConceptos();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadConceptos(this.searchField);
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
        this.loadCentro(Centro.Id_Concepto_Salarial);
    }else{
      this.Periodo = {
        Id_Concepto_Salarial:'',
        Nombre:'',
        Tipo_Concepto:'',
        Aplica_Como:'',
        Tipo_Referencia:'',
        Tipo_Valor:'',
        Aplica_Calculos:'',
        Estado:'',
        Secuencia:'',
        Valor:'',
        Formula:'',
        Etiqueta:''
      }
    }
   }
  async loadConceptos(search?:any){
    let data = await this.periodoPagoService.loadConceptos(this.paginacion,search);
    if(data['total'] == 0){
      this.Conceptos = [];
    }else{
      this.Conceptos = data['data'];
    }
  }
  async loadCentro(Id_Centro_Pago){
    let data = await this.periodoPagoService.loadCentro(Id_Centro_Pago);
    if(data['total'] == 0){
      this.Periodo = {
        Id_Concepto_Salarial:'',
        Nombre:'',
        Tipo_Concepto:'',
        Aplica_Como:'',
        Tipo_Referencia:'',
        Tipo_Valor:'',
        Aplica_Calculos:'',
        Estado:'',
        Secuencia:'',
        Valor:'',
        Formula:'',
        Etiqueta:''
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
    
   
    let data = await this.periodoPagoService.savePeriodo(this.Periodo);

    if(data['success'] == 'true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadConceptos(this.searchField);
      this.edit = false;
    }
    return true;
  }

}
