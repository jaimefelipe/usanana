import { Component, OnInit, ViewEncapsulation,Input } from '@angular/core';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Output, EventEmitter } from '@angular/core';
import { ProyActividadService } from './proy-actividad.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-proy-actividad',
  templateUrl: './proy-actividad.component.html',
  styleUrl: './proy-actividad.component.css',
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ProyActividadComponent implements OnInit {
  @Input() ItemSelected: EventEmitter<string>; 
  @Output() NewItem = new EventEmitter<any>();
  @Output() UpdateItem = new EventEmitter<any>();

  constructor(
    private proyActividadService: ProyActividadService,
    private contactoService: ContactoService
    ) {}
  hoy = new Date();
  MiembroPanel = false;
  GeneralTabActivo = true;
  SeguimientoTabActivo = false;
  Proyecto = {
    Id_Proyecto:'',
    Tipo:'1',
    Nivel:'0',
    Codigo:'',
    Padre:'',
    Nombre: '',
    Descripcion:'',
    Objetivo:'',
    Alcance:'',
    Restricciones:'',
    Inicio:'',
    HInicio:'',
    Fin:'',
    HFin:'',
    Estado:'1',
    Miembros:''
  }
  FechaHoy = this.hoy.getDate() + '-'+  this.hoy.getMonth() + 1 + "-"+ this.hoy.getFullYear()
  FechaInicio =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  FechaFin =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  NivelActual = '1';
  CodigoActual = '';
  UltimoCodigo = '';
  Seguimiento = '';
  searchFieldMiembro = '';

  GeneralClass = 'text-success tablinks active';
  SeguimientoClass = '';



  Miembros = [];
  Contactos = [];
  Seguimientos = [];
  ngOnInit(): void {
    this.subscribeToParentEmitter(); 
  }

  subscribeToParentEmitter(): void { 
    this.ItemSelected.subscribe((data: any) => { 
      this.Proyecto = data;
      this.leerProyecto();
      this.leerSeguimientos();
      //this.message = data; 
    }); 
  } 
  /**Acciones sobre los tabs */
  activarGeneralTab(){
    this.GeneralTabActivo = true;
    this.SeguimientoTabActivo = false;
    this.GeneralClass = 'text-success tablinks active';
    this.SeguimientoClass = '';
  }
  activarSeguimientotab(){
    this.GeneralTabActivo = false;
    this.SeguimientoTabActivo = true;
    this.GeneralClass = '';
    this.SeguimientoClass = 'text-success tablinks active';
  }

  async leerProyecto(){
    let data = await this.proyActividadService.leerProyecto(this.Proyecto.Id_Proyecto)
    if (data['total'] == 1) {
      this.Proyecto = data['data'][0];
      //cargarFechas
      let fechaInicioArr = this.Proyecto.Inicio.split('-');
      let fechaFinArr = this.Proyecto.Fin.split('-');
      let horaIniciArr = this.Proyecto.Inicio.split(" ");
      let horaFinArr = this.Proyecto.Fin.split(" ");
      this.Proyecto.HInicio = horaIniciArr[1];
      this.Proyecto.HFin = horaFinArr[1];
      this.FechaInicio = {
        month: parseInt(fechaInicioArr[1]),
        day: parseInt(fechaInicioArr[2]),
        year: parseInt(fechaInicioArr[0]),
      }
      this.FechaFin = {
        month: parseInt(fechaFinArr[1]),
        day: parseInt(fechaFinArr[2]),
        year: parseInt(fechaFinArr[0]),
      }
    }
  }
  async getLastProyectoId(Nivel){
    //obtener el Id el ultimo portafolio para generar uno nuevo
    let data = await this.proyActividadService.getLastProyectId(Nivel);
    if (data['total'] == 0) {
      this.UltimoCodigo = '0';
    }else{
      this.UltimoCodigo = data['data'][0]['Codigo'];
    }
  }
  async nuevoPadre(){
    this.inicializarProyecto();
    await this.getLastProyectoId(1);
    this.Proyecto.Nivel = '1';
    
    this.Proyecto.Codigo = (parseInt(this.UltimoCodigo) + 1).toString();
  }
  async nuevoHijo(){
    //Deternimar el nivel
    let nivel = this.Proyecto.Nivel;
    let codigo = this.Proyecto.Codigo;
    //Determinar el codigo
    this.inicializarProyecto();
  
    this.Proyecto.Nivel = (parseInt(nivel) +1).toString();
    this.Proyecto.Tipo = this.Proyecto.Nivel;
    this.Proyecto.Padre = codigo;
   
    await this.getLastProyectoId(this.Proyecto.Nivel);
    this.Proyecto.Codigo = codigo + "."+ (parseInt(this.UltimoCodigo) + 1);
  }
  inicializarProyecto(){
    this.Proyecto = {
      Id_Proyecto:'',
      Tipo:'1',
      Nivel:'1',
      Codigo:'',
      Padre:'',
      Nombre: '',
      Descripcion:'',
      Objetivo:'',
      Alcance:'',
      Restricciones:'',
      Inicio:'',
      HInicio:'',
      Fin:'',
      HFin:'',
      Estado:'1',
      Miembros:''
    }
  }
  grabar(){
    if(this.Proyecto.Nombre == ""){
      Swal.fire('Debe suministrar el nombre para grabar');
      return false;
    }
    //Enviar evento al treee
    //Convertir Fecha 
    this.Proyecto.Inicio = this.FechaInicio.year + '-' + this.FechaInicio.month + '-' + this.FechaInicio.day + ' ' + this.Proyecto.HInicio
    this.Proyecto.Fin = this.FechaFin.year + '-' + this.FechaFin.month + '-' + this.FechaFin.day + ' ' + this.Proyecto.HFin

    if(this.Proyecto.Id_Proyecto == ''){
      //Proyecto Nuevo
      this.proyectoNuevo()
    }else{
      //actualizar proyecto
      this.actualizarProyecto();
    }
    return true;
  }
  async  proyectoNuevo(){
    let data = await this.proyActividadService.newProyecto(this.Proyecto);
    if(data['success'] == 'true'){
      this.Proyecto.Id_Proyecto = data['data'][0]['Identity'];
      this.NewItem.emit(this.Proyecto);
    }
    Swal.fire('Datos Actualizados')
  }
  async actualizarProyecto(){
    let data = await this.proyActividadService.updateProyecto(this.Proyecto);
    this.UpdateItem.emit(this.Proyecto)
    Swal.fire('Datos Actualizados')
  }

  // Eventos de los miembros
  abrirMiembrosPanel(){
    this.MiembroPanel = true;
    this.leerEmpleados();
    this.leerMiembrosProyecto();
  }
  cerrarMiembroPanel(){
    this.MiembroPanel = false;
  }
  searchMiembro(){

  }
  keytabMiembro(e){}
  async leerMiembrosProyecto(){
    let data = await this.proyActividadService.leerMiembros(this.Proyecto.Id_Proyecto);
    if (data['total'] == 0) {
      this.Miembros = [];
    }else{
      this.Miembros  = data['data'];
    }
  }
  selectMiembro(Miembro){
    this.Miembros.push(Miembro);
    this.asignarMiembrosTarea();
  }
  async deSelectMiembro(miembro,index){
    let data = await this.proyActividadService.DesasignarMiembro(this.Proyecto.Id_Proyecto,miembro.Id_Persona);
    this.Miembros.splice(index, 1);
    this.asignarMiembrosTarea();
  }
  async asignarMiembrosTarea(){
    let MiembroArray = [];
    this.Proyecto.Miembros = "";
    for (let Miembro of this.Miembros){
      let data = await this.proyActividadService.AsignarMiembro(this.Proyecto.Id_Proyecto,Miembro.Id_Persona);
      MiembroArray = Miembro.Nombre.split(' ');
      this.Proyecto.Miembros = this.Proyecto.Miembros + MiembroArray[0].substring(0,1)+this.Proyecto.Miembros + MiembroArray[1].substring(0,1)+ " "
    }
  }
  async leerEmpleados(){
    let data = await this.contactoService.loadPersonas(this.paginacion,this.searchFieldMiembro,5,1);
    if (data['total'] == 0) {
      this.Contactos = [];
    }else{
      this.Contactos  = data['data'];
    }
  }
  //Seguimientos
  async leerSeguimientos(){
    let data = await this.proyActividadService.leerNotas(this.Proyecto.Id_Proyecto);
      
    if (data['total'] == 0) {
      this.Seguimientos = [];
    }else{
      this.Seguimientos = data['data'];
      for (let Seguimiento of this.Seguimientos){
        let Letras = Seguimiento.Nombre.split(' ');
        Seguimiento.Nombre = Letras[0].substring(0,1)+ Letras[1].substring(0,1);
        Seguimiento.Fecha = Seguimiento.Fecha.substring(0,10)
      }
    }
  }
  async agregarSeguimieto(){
    let Seguimiento = {
      Id_Proyecto:this.Proyecto.Id_Proyecto,
      Id_Persona:localStorage.getItem('Id_Usuario'),
      Fecha:this.FechaHoy,
      Nombre:localStorage.getItem('Nombre_Usuario').substring(0,2),
      Nota:this.Seguimiento
    }
    this.Seguimientos.push(Seguimiento);
    this.Seguimiento = '';
    await this.proyActividadService.nuevaNota(Seguimiento);
  }
}
