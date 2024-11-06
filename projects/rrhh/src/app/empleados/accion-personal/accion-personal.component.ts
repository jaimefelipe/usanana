import { Component, OnInit } from '@angular/core';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { PuestoService } from '../puesto/puesto.service';
import { DepartamentoService } from '../departamento/departamento.service';
import { AccionPersonalService } from './accion-personal.service';
import { RrhhService } from '../rrhh/rrhh.service';
import { RollService } from '../roll/roll.service';

import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accion-personal',
  templateUrl: './accion-personal.component.html',
  styleUrls: ['./accion-personal.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class AccionPersonalComponent implements OnInit {

  constructor(
    private peopleService:ContactoService,
    private puestoService:PuestoService,
    private departamentoService:DepartamentoService,
    private AccionPersonalService:AccionPersonalService,
    private rrhhService:RrhhService,
    private rollService:RollService
  ) { }

  edit = false;
  PantallaEmpleados = false;
  PantallaPuestos = false;
  PantallaDepartamentos = false;
  PantallaRoles = false;

  hoy = new Date();
  

  searchField = '';
  searchFieldEmpleados = '';
  searchFieldPuestos = '';
  searchFieldDepartamentos ='';

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Fecha_Accion =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  Fecha_Inicio =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  Fecha_Fin =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  Accion = {
    Id_Accion_Personal:'',
    Tipo_Accion: '1',
    Fecha_Accion:'',
    Id_Persona:'',
    Nombre:'',
    Id_Puesto:'',
    Puesto:'',
    Id_Departamento:'',
    Departamento:'',
    Salario:'',
    Fecha_Inicio:'',
    Fecha_Fin:'',
    Puesto_Anterior:'',
    Departamento_Anterior:'',
    Salario_Anterior:'',
    Tipo_Contrato:'',
    Tipo_Contrato_Old:'',
    Jornada:'',
    Jornada_Old:'',
    Id_Roll:'',
    Nombre_Roll:'',
    Fecha_Ingreso:'',
    Fecha_Salida:'',
    Estado:'0'
  }

  Acciones = [];
  Empleados = [];
  Puestos = [];
  Departamentos = [];
  Roles = [];

  ngOnInit() {
    this.leerAcciones();
    this.leerRoles();
  }
  search(){
    this.leerAcciones();
  }
  searchEmpleados(){
    this.leerEmpleados();
  }

  searchPuestos(){
    this.leerEmpleados();
  }
  searchDepartamentos(){
    this.leerDepartamentos();
  }
  searchRolles(){
    this.leerRoles();
  }
  keytabRoles(event:any){
    if (event.key === 'Enter') {
      this.searchRolles();
    }
  }

  keytab(event:any){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabEmpleados(event:any){
    if (event.key === 'Enter') {
      this.searchEmpleados();
    }
  }
  keytabPuestos(event:any){
    if (event.key === 'Enter') {
      this.searchEmpleados();
    }
  }
  keytabDepartamentos(event:any){
    if (event.key === 'Enter') {
      this.searchDepartamentos();
    }
  }
  ChangePage(action:any){
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
    //this.loadAsientos();
  }
  async leerAcciones(){
     let data = await this.AccionPersonalService.loadAcciones(this.paginacion,this.searchField);
     if(data['total'] == 0){
      this.Acciones = [];
    }else{
      this.Acciones = data['data'];
    }
  }

  async editRecord(e){
    if(!e){
      this.Accion = {
        Id_Accion_Personal:'',
        Tipo_Accion: '1',
        Fecha_Accion:'',
        Id_Persona:'',
        Nombre:'',
        Id_Puesto:'',
        Puesto:'',
        Id_Departamento:'',
        Departamento:'',
        Salario:'',
        Fecha_Inicio:'',
        Fecha_Fin:'',
        Puesto_Anterior:'',
        Departamento_Anterior:'',
        Salario_Anterior:'',
        Tipo_Contrato:'',
        Tipo_Contrato_Old:'',
        Jornada:'',
        Jornada_Old:'',
        Id_Roll:'',
        Nombre_Roll:'',
        Fecha_Ingreso:'',
        Fecha_Salida:'',
        Estado:'0'
      }
    }else{
      
      let data = await this.AccionPersonalService.leerAccion(e.Id_Accion_Personal);
      if(data['total'] == 1){
        this.Accion = data['data'][0];
        this.Accion.Id_Accion_Personal = e.Id_Accion_Personal;
        if(this.Accion.Fecha_Accion){
          let fechaAccionArr = this.Accion.Fecha_Accion.split('-');
          this.Fecha_Accion = {
            month: parseInt(fechaAccionArr[1]),
            day: parseInt(fechaAccionArr[2]),
            year: parseInt(fechaAccionArr[0]),
          }
        }
        if(this.Accion.Fecha_Inicio){ 
          let fechaInicioArr = this.Accion.Fecha_Inicio.split('-');
          this.Fecha_Inicio = {
            month: parseInt(fechaInicioArr[1]),
            day: parseInt(fechaInicioArr[2]),
            year: parseInt(fechaInicioArr[0]),
          }
        }
        if(this.Accion.Fecha_Fin){ 
          let fechaFinArr = this.Accion.Fecha_Fin.split('-');
          this.Fecha_Fin = {
            month: parseInt(fechaFinArr[1]),
            day: parseInt(fechaFinArr[2]),
            year: parseInt(fechaFinArr[0]),
          }
        }
      }
    }
    this.edit = true;
  }
  async grabar(){
    //Fecha
    this.Accion.Fecha_Accion =  this.Fecha_Accion.year + '/' + this.Fecha_Accion.month + '/' + this.Fecha_Accion.day;
    this.Accion.Fecha_Inicio = this.Fecha_Inicio.year + '/' + this.Fecha_Inicio.month + '/' + this.Fecha_Inicio.day;
    this.Accion.Fecha_Fin = this.Fecha_Fin.year + '/' + this.Fecha_Fin.month + '/' + this.Fecha_Fin.day;

    //Validar Informacion
    if(this.Accion.Id_Persona == ''){
      Swal.fire("Seleccione el empleado");
      return false;
    }
    if(this.Accion.Id_Puesto == ''){
      Swal.fire("Seleccione el puesto");
      return false;
    }
    if(this.Accion.Id_Departamento == ''){
      Swal.fire("Seleccione el Departamento");
      return false;
    }
    if(this.Accion.Salario == ''){
      Swal.fire("Ingrese el Salario");
      return false;
    }
    if(this.Accion.Tipo_Accion === '2' || this.Accion.Tipo_Accion === '3'){
      if(this.Accion.Fecha_Fin == this.Accion.Fecha_Fin){
        Swal.fire('Fechas de Inicio y Fin no pueden ser la misma');
        return false;
      }
    }
    let data = await this.AccionPersonalService.grabarAccion(this.Accion);
    if(this.Accion.Id_Accion_Personal == ''){
      this.Accion.Id_Accion_Personal = data['data'][0]['Identity'];
    }
    Swal.fire({
      title: 'Desea Aplicar la Accion?',
      text: "Si aplica la accion no le podra realizar ninún cambio!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Aplicar la accion!'
    }).then((result) => {
      //this.PantallaLoading = true;
      if (result.value) {
        //this.aplicandoAccion()
        this.aplicarAccion();
      }
    });

    this.leerAcciones();
    this.edit = false;
    return true;
  }
  cancel(){
    this.edit = false;
  }
 
  closePantallaEmpleados(){
    this.PantallaEmpleados = false;
  }
  OpenEmpleadoPanel(){
    this.PantallaEmpleados = true;
    this.leerEmpleados();
  }
  async leerEmpleados(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.peopleService.loadPersonas(paginacion, this.searchFieldEmpleados, 5); 
    this.Empleados = data['data'];
  }

  SeleccionarEmpleado(empleado){
    this.Accion.Id_Persona = empleado.Id_Persona;
    this.Accion.Nombre = empleado.Nombre;
    this.closePantallaEmpleados();
  }
  OpenPuestosPanel(){
    this.PantallaPuestos = true;
    this.leerPuestos();
  }
  async leerPuestos(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.puestoService.loadPuestos(paginacion, this.searchFieldPuestos); 
    this.Puestos = data['data'];
  }
  closePantallaPuestos(){
    this.PantallaPuestos = false;
  }
  SeleccionarPuesto(Puesto){
    this.Accion.Id_Puesto = Puesto.Id_Puesto;
    this.Accion.Puesto = Puesto.Puesto;
    this.closePantallaPuestos();
  }
  OpenDepartamentosPanel(){
    this.PantallaDepartamentos = true;
    this.leerDepartamentos();
  }
  async leerDepartamentos(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.departamentoService.loadDepartamentos(paginacion, this.searchFieldDepartamentos); 
    this.Departamentos = data['data'];
  }
  SeleccionarDepartamento(Departamento){
    this.Accion.Id_Departamento = Departamento.Id_Departamento;
    this.Accion.Departamento = Departamento.Departamento;
    this.closePantallaDepartamento();
  }
  closePantallaDepartamento(){
    this.PantallaDepartamentos = false;
  }
  async aplicarAccion(){
    //Consultar si existe el registro del empleado.
    let Estado = '1';
    //Accion de Nombramiento
    if(this.Accion.Tipo_Accion == '1'){
      Estado = '1';
    }
    //Accion de Vacaciones
    if(this.Accion.Tipo_Accion == '2'){
      Estado = '2';
    }
    let data = await this.AccionPersonalService.AplicarAccion(this.Accion);
    data = await this.AccionPersonalService.actualizarEstado(this.Accion.Id_Persona,Estado);
    if(this.Accion.Tipo_Accion == '1'){
      data = await this.AccionPersonalService.ActualizarFechaIngreso(this.Accion.Id_Persona,this.Accion.Fecha_Inicio);
    }
    if(this.Accion.Tipo_Accion == '6' || this.Accion.Tipo_Accion == '7')   {
      data = await this.AccionPersonalService.ActualizarFechaIngreso(this.Accion.Id_Persona,this.Accion.Fecha_Inicio);
    }
    await this.AccionPersonalService.actualizarEstadoAccion(this.Accion.Id_Accion_Personal);
  }

  openRollPanel(){
    this.PantallaRoles = true;
  }

  SeleccionarRoll(roll){
    this.Accion.Nombre_Roll = roll.Nombre;
    this.Accion.Id_Roll = roll.Id_Roll;
    this.closePantallaRoles();
  }
  closePantallaRoles(){
    this.PantallaRoles = false;
  }
  async leerRoles(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.rollService.loadRolles(paginacion,this.searchField);
    if(data['total'] == 0){
      this.Roles = [];
    }else{
      this.Roles = data['data'];
    }
    
  }
  imprimir(){
    let Param = localStorage.getItem('Id_Empresa')+'&c='+this.Accion.Id_Accion_Personal;
    window.open('https://toxo.work/reportes/rrhh/accion-personal.php?Id=' + Param, '_blank');
  }
   
}
