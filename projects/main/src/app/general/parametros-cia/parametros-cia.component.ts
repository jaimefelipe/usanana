import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ParametrosCiaService } from './parametros-cia.service';
import { CompanyService } from '../company/company.service';

@Component({
  selector: 'app-parametros-cia',
  templateUrl: './parametros-cia.component.html',
  styleUrls: ['./parametros-cia.component.css']
})
export class ParametrosCiaComponent implements OnInit {

  constructor(
    private parametrosCiaService:ParametrosCiaService,
    private companyService:CompanyService
    ) { }
  Parameters = [];
  Companies = [];
  searchField = ""
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  edit = false;
  interfazContable = localStorage.getItem("InterfazContable");

  /**
   * Variables del
   * Formulario de Edición
   */
  Parameter = {
    Id_Gen_Parametros_Compania:'',
    Id_Empresa : '',
    Id_Tipo:'1',
    Parametro: '',
    Valor:'',
    Codigo_Actividad : '',
    Estado:'1'
  }
  ngOnInit(): void {
    this.loadParameters();
    this.loadCompanies();
  }
  async loadParameters(search?:any){
    let data = await this.parametrosCiaService.loadParameters(this.paginacion,search);
    if(data['total'] == 0){
      this.Parameters = [];
    }else{
      this.Parameters = data['data'];
    }
  }
  async loadCompanies(search?:any){
    let data = await this.companyService.loadCompanies();
    if(data['total'] == 0){
      this.Companies = [];
    }else{
      this.Companies = data['data'];
    }
  }
  async editRecord(Parameter){
    this.edit = true;
    if(Parameter){
      this.Parameter.Id_Gen_Parametros_Compania = Parameter.Id_Gen_Parametros_Compania;
      this.loadParameter();
    }else{
      this.Parameter = {
        Id_Gen_Parametros_Compania:'',
        Id_Empresa : '',
        Id_Tipo:'1',
        Parametro: '',
        Valor:'',
        Codigo_Actividad:'',
        Estado:'1'
      }
    }
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
    this.loadParameters();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadParameters(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    if(this.Parameter.Parametro == ""){
      Swal.fire('Favor Suministrar el nombre de la Parametro');
      return false;
    }
    let data = await this.parametrosCiaService.saveParameter(this.Parameter);
    if(data['success'] =='true'){
      Swal.fire('Parametro grabada correctamente');
      this.loadParameters(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadParameter(){
    let data = await this.parametrosCiaService.loadParameter(this.Parameter.Id_Gen_Parametros_Compania);
    if(data['total']==1){
      this.Parameter = data['data'][0];
    }
   }
}
