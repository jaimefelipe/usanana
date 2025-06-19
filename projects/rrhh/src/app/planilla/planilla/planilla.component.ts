import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../core/layaut/app-menu-superior/title.service';
import { PlanillaService } from './planilla.service';
import Swal from 'sweetalert2';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-planilla',
  templateUrl: './planilla.component.html',
  styleUrls: ['./planilla.component.css']
})
export class PlanillaComponent implements OnInit {

  constructor(
    private titleService:TitleService,
    private planillaService:PlanillaService
  ) { }
  
  edit = false;
  GeneralActivo = true;
  MovimientosActivo = false;
  CalculoActivo = false;
  MarcasActivo = false;
  searchField = '';
  tituloSeccion = 'Planillas'
  Planillas = [];
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Planilla = {
    Id_Planilla:'',
    Id_Tipo_Planilla:'',
    Nombre:'',
    Fecha:'',
    Fecha_Inicio:'',
    Fecha_Fin:'',
    Fecha_Pago:'',
    Ultima:'',
    Estado:''
  }

  ngOnInit() {
    this.titleService.setTitulo('Planillas');
    this.loadPlanillas();
  }
  activarGeneral(){
    this.GeneralActivo = true;
    this.MarcasActivo = false;
    this.MovimientosActivo = false;
    this.CalculoActivo = false;
   
  }
    activarMarcas(){
    this.GeneralActivo = false;
    this.MarcasActivo = true;
    this.MovimientosActivo = false;
    this.CalculoActivo = false;
   
  }
  activarMovimientos(){
    this.GeneralActivo = false;
    this.MarcasActivo = false;
    this.MovimientosActivo = true;
    this.CalculoActivo = false;
  }
  activarCalculo(){
    this.GeneralActivo = false;
    this.MarcasActivo = false;
    this.MovimientosActivo = false;
    this.CalculoActivo = true;
  }

  activarRhh(){}
  search(){

  }
  keytab(e){

  }
  editRecord(e){
    if(e.Id_Planilla){
      this.leerPlanilla(e.Id_Planilla);
    }else{
      this.Planilla = {
        Id_Planilla:'',
        Id_Tipo_Planilla:'',
        Nombre:'',
        Fecha:'',
        Fecha_Inicio:'',
        Fecha_Fin:'',
        Fecha_Pago:'',
        Ultima:'',
        Estado:''
      }
    }
    this.edit = true;
  }
  async leerPlanilla(Id_Planilla){
    let data = await this.planillaService.leerPlanilla(Id_Planilla);
    this.Planilla = data['data'][0];


    const camposFecha = ['Fecha', 'Fecha_Inicio', 'Fecha_Fin', 'Fecha_Pago'];
    camposFecha.forEach(campo => {
      if (this.Planilla[campo]) {
        this.Planilla[campo] = this.Planilla[campo].split(' ')[0];
      }
    });

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
    this.loadPlanillas();
  }
  async loadPlanillas(){
    let data = await this.planillaService.loadPlanillas(this.paginacion,this.searchField);
    if(data['total']>0){
      this.Planillas = data['data'];
    }else{
      this.Planillas = [];
    }
  }
  async grabar(){
    //Validar Datos
    if(this.Planilla.Nombre == ''){
      Swal.fire('Suministre una descripcion para la planilla');
      return false;
    }
    if(this.Planilla.Id_Tipo_Planilla ===''){
      Swal.fire('Suministre el tipo de planilla');
      return  false;
    }
    if(this.Planilla.Fecha == ''){
      Swal.fire('Suministre la fecha de la planilla');
      return false;
    }
    if(this.Planilla.Fecha_Inicio == ''){
      Swal.fire('Suministre la fecha de la planilla');
      return false;
    }
    if(this.Planilla.Fecha_Fin == ''){
      Swal.fire('Suministre la fecha de la planilla');
      return false;
    }
    if(this.Planilla.Fecha_Pago == ''){
      Swal.fire('Suministre la fecha de la planilla');
      return false;
    }
    if(this.Planilla.Id_Planilla == ''){
      await this.nuevaPlanilla();
    }else{
      await this.updatePlanilla();
    }
    this.loadPlanillas();
    Swal.fire('Registro grabado');
    return true;
  }
  async nuevaPlanilla(){
    let data = await this.planillaService.NuevaPlanilla(this.Planilla);
    this.Planilla.Id_Planilla = data['Identity'];
    this.Planilla.Estado = '1';
  }
  async updatePlanilla(){
    let data = await this.planillaService.UpdatePlanilla(this.Planilla);
  }
  cancel(){
    this.edit = false;
  }
  async procesarMarcas(){
    await this.planillaService.ProcesarMarcas(this.Planilla.Id_Planilla);
    this.Planilla = { ...this.Planilla }; // forzamos nuevo objeto para trigger ngOnChanges
    Swal.fire('Marcas Procesadas');
  }
  async calcularPlanila(){
    await this.planillaService.calcularPlanilla(this.Planilla.Id_Planilla);
    this.Planilla = { ...this.Planilla }; // forzamos nuevo objeto para trigger ngOnChanges
    Swal.fire('Planilla Calculada');
  }
  async reportePlanilla(){
    let param = this.Planilla.Id_Planilla //'1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin + '&c=' + this.Id_Caja + '&cc=' + this.Id_Caja_Diaria;
    window.open('https://toxo.work/reportes/rrhh/pl_reporte_planilla_xls.php?Id_Planilla=' + param, '_blank');
  }
  async colillaPago(){
    let param = this.Planilla.Id_Planilla //'1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin + '&c=' + this.Id_Caja + '&cc=' + this.Id_Caja_Diaria;
    window.open('https://toxo.work/reportes/rrhh/pl_colilla_pago.php?Id_Planilla=' + param, '_blank');
  }

}
