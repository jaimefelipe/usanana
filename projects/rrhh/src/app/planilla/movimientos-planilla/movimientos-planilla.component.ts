import { Component, OnInit,Input,OnChanges, SimpleChanges } from '@angular/core';
import { EmpleadoService } from '../../empleados/empleados/empleado.service';
import { ConceptoSalarialService } from '../concepto-salarial/concepto-salarial.service';
import { MovimientoPlanillaService } from './movimiento-planilla.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movimientos-planilla',
  templateUrl: './movimientos-planilla.component.html',
  styleUrls: ['./movimientos-planilla.component.css']
})
export class MovimientosPlanillaComponent implements OnInit {
  @Input() Planilla : any;
  constructor(
    private empleadoService:EmpleadoService,
    private conceptoSalarialService:ConceptoSalarialService,
    private movimientoPlanillaService:MovimientoPlanillaService
  ) { }
  MostrarPaginacion=false;
  PantallaMovimiento = false;
  PantallaEmpleados = false;
  PantallaConceptos = false;
  searchField = '';
  searchFieldEmpleados = '';
  tituloSeccion = 'Movimientos de planilla';
  Movimientos = [];
  Empleados = [];
  Conceptos = [];
  Movimiento = {
    Id_Planilla:'',
    Id_Movimiento_Planilla:'',
    Id_Empleado:'',
    Empleado:'',
    Id_Concepto_Salarial:'',
    Concepto_Salarial:'',
    Cantidad:'',
    Estado:'1'
  }
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Planilla'] && changes['Planilla'].currentValue) {
      this.leerMovimientos();
    }
  }
  search(){
    this.leerMovimientos();
  }
  searchEmpleados(){

  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabEmpleados(e){

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
    this.leerMovimientos();
  }
  editRecord(Movimiento){
    this.PantallaMovimiento = true;
    if(Movimiento.Id_Movimiento_Planilla){
      this.leerMovimiento(Movimiento.Id_Movimiento_Planilla);
    }else{
      this.Movimiento = {
        Id_Planilla:'',
        Id_Movimiento_Planilla:'',
        Id_Empleado:'',
        Empleado:'',
        Id_Concepto_Salarial:'',
        Concepto_Salarial:'',
        Cantidad:'',
        Estado:'1'
      }
    }
  }
  async leerMovimientos(){
    if (!this.Planilla?.Id_Planilla) return;
    let data = await this.movimientoPlanillaService.loadMovimientosPlanilla(this.Planilla.Id_Planilla,this.searchField);
    this.Movimientos = data['data'];
  }
  async leerMovimiento(Id_Movimiento_Planilla){
    let data = await this.movimientoPlanillaService.LeerMovimiento(Id_Movimiento_Planilla);
    this.Movimiento = data['data'][0];
  }
  closePantallaMovimiento(){
    this.PantallaMovimiento = false;
  }
  openEmpleadoPanel(){
    this.leerEmpleados();
    this.PantallaEmpleados = true;
  }

  SeleccionarEmpleados(Empleado){
    this.Movimiento.Id_Empleado = Empleado.Id_Empleado;
    this.Movimiento.Empleado = Empleado.Nombre;
    this.closePantallaEmpleados(); 

  }
  closePantallaEmpleados(){
    this.PantallaEmpleados = false;
  }
  async leerEmpleados(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    }; 
    let data = await this.empleadoService.leerEmpleados();
    this.Empleados = data['data'];
  }
  openConceptoPanel(){
    this.leerConceptosSalariales();
    this.PantallaConceptos = true;
    console.log(this.PantallaConceptos)
  }
  SeleccionarConcepto(Concepto){
    this.Movimiento.Id_Concepto_Salarial = Concepto.Id_Concepto_Salarial;
    this.Movimiento.Concepto_Salarial = Concepto.Nombre;
    this.closePantallaConceptos();
  }
  closePantallaConceptos(){
    this.PantallaConceptos = false;
  }
  async leerConceptosSalariales(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    }; 
    let data = await this.conceptoSalarialService.loadConceptos(paginacion);
    this.Conceptos = data['data'];
  }
  grabarMovimiento(){
    if(this.Movimiento.Id_Concepto_Salarial ==''){
      Swal.fire('Seleccione el Concepto Salarial');
      return false;
    }
    if(this.Movimiento.Id_Empleado==''){
      Swal.fire('Seleccione el empleado');
      return false;
    }
    if(this.Movimiento.Cantidad == ''){
      Swal.fire("Escriba la cantidad");
      return false;
    }
    this.Movimiento.Id_Planilla = this.Planilla.Id_Planilla;
    if(this.Movimiento.Id_Movimiento_Planilla ==''){
      this.nuevoMovimiento();
    }else{
      this.updateMovimiento();
    }
    return true;
  }
  async nuevoMovimiento(){
    let data = await this.movimientoPlanillaService.NuevoMovimiento(this.Movimiento);
    this.Movimiento.Id_Movimiento_Planilla = data['Identity'];
    this.leerMovimientos();
    this.closePantallaMovimiento();
  }
  async updateMovimiento(){
    let data = await this.movimientoPlanillaService.UpdateMovimiento(this.Movimiento);
    this.leerMovimientos();
    this.closePantallaMovimiento();
  }

}
