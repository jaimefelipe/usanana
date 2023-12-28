import { Component, OnInit } from '@angular/core';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ContactoService } from './contacto.service';
import { BranchService } from '../../../../../main/src/app/general/branch/branch.service';
//import { CarreraService } from '../../../../../academico/src/app/config/carrera/carrera.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ContactoComponent implements OnInit {

  constructor(
    private peopleService:ContactoService,
    private branchService:BranchService,
    //private carreraService:CarreraService
    ) { }
    myinput: string = "PluralSight" 

  hoy = new Date();
  Fecha =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  Fecha_Ingreso =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  Fecha_Graduacion =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  SeguridadStr = localStorage.getItem("ToxoSG");
  Seguridad = [];
  Carreras = [];
  CarrerasActivas = [];
  Personas = [];
  Notas = [];
  Provinces = [];
  Cantons = [];
  Districts = [];

  GeneralActivo = true;
  DireccionActivo = false;
  VentaActivo = false;
  CarreraActivo = false;
  ContactosActivo = false;
  NotasActivo = false; 
  Academico = false;
  RollActivo = false;

  PantallaCarreraContacto = false;
  PantallaCarrerasActivas = false;
  PantallaNotas = false;

  searchFieldCarrera = '';
  DireccionClass = '';
  VentaClass = '';
  CarreraClass = '';
  ContactoClass = '';
  NotasClass = '';
  RollClass = '';
  GeneralClass = 'text-success tablinks active';


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
  Persona = {
    Id_Persona:'',
    Nombre: '',
    Telefono:'',
    Correo:'',
    Identificacion:'',
    Tipo_Identificacion:'1',
    Provincia:'',
    Canton : '',
    Distrito:'',
    Barrio:'',
    Otras_Senas:'',
    Proveedor:'',
    Cliente:'',
    Alumno:'',
    Profesor:'',
    Estado:'',
    Otro_Documento:'',
    Condicion_Venta:'',
    Plazo_Credito:'',
    Metodo_Pago:'',
    Fecha_Ingreso:this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year,
    Porcenaje_Descuento:'',
    Moneda:'CRC',
    Ultima_Factura:'',
    Pagina_Web:'',
    Prospecto:'1',
    Facebook:'',
    Linkedin:'',
    Contabilidad:'',
    FacturaElectronica:'',
    PuntoVenta:'',
    Restaurante:'',
    Asesoria:'',
    Declaracion:'',
    Precio:'',
    Empleado:''
  }
  CarreraEstudiante = {
    Id_Carrera_Estudiante:'',
    Id_Persona:'',
    Id_Carrera:'',
    Carrera:'',
    Fecha_Ingreso:'',
    Fecha_Graduacion:'',
    Estado:''
  }

  Nota = {
    Id_Notas:'',
    Id_Persona:'',
    Nota:''
  }


  ngOnInit(): void {
    this.Seguridad = this.SeguridadStr.split(".");
    this.loadPersonas();
    this.leerCarreras();
    this.loadProvinces();
    if(this.Seguridad[13]==1){
      this.Academico = true;
    }else{
      this.Academico = false;
    }
  }
  /*Activar y desactivar las pestañas */
  activarGeneral(){
    this.GeneralActivo = true;
    this.DireccionActivo = false;
    this.VentaActivo = false;
    this.CarreraActivo = false;
    this.ContactosActivo = false;
    this.NotasActivo = false;
    this.RollActivo = false;

    this.GeneralClass = 'text-success tablinks active';
    this.VentaClass = '';
    this.DireccionClass = '';
    this.CarreraClass = '';
    this.ContactoClass = '';
    this.NotasClass = '';
    this.RollClass = '';
  }
  activarRoll(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.VentaActivo = false;
    this.CarreraActivo = false;
    this.ContactosActivo = false;
    this.NotasActivo = false;
    this.RollActivo = true;

    this.GeneralClass = '';
    this.VentaClass = '';
    this.DireccionClass = '';
    this.CarreraClass = '';
    this.ContactoClass = '';
    this.NotasClass = '';
    this.RollClass = 'text-success tablinks active';
  }
  activarDireccion(){
    this.GeneralActivo = false;
    this.DireccionActivo = true;
    this.VentaActivo = false;
    this.CarreraActivo = false;
    this.ContactosActivo = false;
    this.NotasActivo = false;
    this.RollActivo = false;

    this.RollClass = "";
    this.GeneralClass = '';
    this.VentaClass = ''
    this.DireccionClass = 'text-success tablinks active'
    this.CarreraClass = '';
    this.ContactoClass = '';
    this.NotasClass = '';
  }

  activarContacto(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.VentaActivo = false;
    this.CarreraActivo = false;
    this.ContactosActivo = true;
    this.NotasActivo = false;
    this.RollActivo = false;
    
    this.RollClass = "";
    this.GeneralClass = '';
    this.VentaClass = ''
    this.DireccionClass = ''
    this.CarreraClass = '';
    this.ContactoClass = 'text-success tablinks active';
    this.NotasClass = '';
  }

  activarVenta(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.VentaActivo = true;
    this.CarreraActivo = false;
    this.ContactosActivo = false;
    this.NotasActivo = false;
    this.RollActivo = false;
    
    this.RollClass = "";
    this.GeneralClass = '';
    this.VentaClass = 'text-success tablinks active'
    this.DireccionClass = ''
    this.CarreraClass = '';
    this.ContactoClass = '';
    this.NotasClass = '';
  }

  activarNotas(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.VentaActivo = false;
    this.CarreraActivo = false;
    this.ContactosActivo = false;
    this.NotasActivo = true;
    this.RollActivo = false;
    
    this.RollClass = "";
    this.GeneralClass = '';
    this.VentaClass = ''
    this.DireccionClass = ''
    this.CarreraClass = '';
    this.ContactoClass = '';
    this.NotasClass = 'text-success tablinks active';
  }
  activarCarrera(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.VentaActivo = false;
    this.CarreraActivo = true;
    this.ContactosActivo = false;
    this.NotasActivo = false;
    this.RollActivo = false;
    
    this.RollClass = "";
    this.GeneralClass = '';
    this.VentaClass = '';
    this.DireccionClass = '';
    this.ContactoClass = '';
    this.CarreraClass = 'text-success tablinks active';
    this.NotasClass = '';
  }
  /*
  */
  async loadPersonas(search?:any){
    let data = await this.peopleService.loadPersonas(this.paginacion,search);
    if(data['total'] == 0){
      this.Personas = [];
    }else{
      this.Personas = data['data'];
    }
  }
  async editRecord(Persona){
    this.edit = true;
    if(Persona){
      this.Persona.Id_Persona = Persona.Id_Persona;
      this.loadPersona();
    }else{
      this.Persona = {
        Id_Persona:'',
        Nombre: '',
        Telefono:'',
        Correo:'',
        Identificacion:'',
        Tipo_Identificacion:'1',
        Provincia:'',
        Canton : '',
        Distrito:'',
        Barrio:'',
        Otras_Senas:'',
        Proveedor:'',
        Cliente:'',
        Alumno:'',
        Profesor:'',
        Estado:'',
        Otro_Documento:'',
        Condicion_Venta:'',
        Plazo_Credito:'',
        Metodo_Pago:'',
        Fecha_Ingreso:this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year,
        Porcenaje_Descuento:'',
        Moneda:'CRC',
        Ultima_Factura:'',
        Pagina_Web:'',
        Prospecto:'1',
        Facebook:'',
        Linkedin:'',
        Contabilidad:'',
        FacturaElectronica:'',
        PuntoVenta:'',
        Restaurante:'',
        Asesoria:'',
        Declaracion:'',
        Precio:'',
        Empleado:''

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
    this.loadPersonas();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadPersonas(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    if(this.Persona.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre del Contacto');
      return false;
    }
    this.Persona.Fecha_Ingreso = this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year;
    let data = await this.peopleService.savePersona(this.Persona);
    if(data['success'] =='true'){
      Swal.fire('Contacto grabado correctamente');
      this.loadPersonas(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadPersona(){
    let data = await this.peopleService.loadPersona(this.Persona.Id_Persona);
    if(data['total']==1){
      this.Persona = data['data'][0];
      this.LeerCarreasEstudiante();
      if(data['Fecha_Registro']){
        let fechaArr = data['Fecha_Registro'].split('-');
        this.Fecha = {
          month: parseInt(fechaArr[1]),
          day: parseInt(fechaArr[2]),
          year: parseInt(fechaArr[0]),
        }
      }
      if(this.Persona.Moneda = ''){
        this.Persona.Moneda = 'CRC';
      }
      this.loadNotas();
    }
   }
   async loadProvinces() {
    let data = await this.branchService.loadProvinces();
    if (data['total'] > 0) {
      this.Provinces = data['data'];
      if (this.Persona.Provincia == '') {
        this.Persona.Provincia = this.Provinces[0]['Provincia'];
      }
      await this.loadCantons(this.Persona.Provincia);
    }
  }
  async loadCantons(Province) {
    let data = await this.branchService.LoadCantons(Province);
    if (data['total'] > 0) {
      this.Cantons = data['data'];
      if (this.Persona.Canton == '') {
        this.Persona.Canton = this.Cantons[0]['Canton'];
      }
      await this.loadDistrict(this.Persona.Provincia, this.Persona.Canton);
    }
  }
  async loadDistrict(Province, Canton) {
    let data = await this.branchService.LoadDistrito(Province, Canton);
    if (data['total'] > 0) {
      this.Districts = data['data'];
      if (this.Persona.Distrito == '') {
        this.Persona.Distrito = this.Cantons[0]['Canton'];
      }
    }
  }
  async provinceChange() {
    await this.loadCantons(this.Persona.Provincia);
  }
  async cantonChange() {
    await this.loadDistrict(this.Persona.Provincia, this.Persona.Canton);
  }
  async LeerCarreasEstudiante(){
    let data = await this.peopleService.loadCarrerasPorAlumno(this.Persona.Id_Persona);
    if(data['total']==0){
      this.Carreras = [];
    }else{
      this.Carreras = data['data'];
    }
  }
  async leerCarreras(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    }
    //let data = await this.carreraService.cargarCarreras(paginacion,this.searchFieldCarrera,1);
    let data = [];
    //jaime Corregir
    if(data['total']==0){
      this.CarrerasActivas = [];
    }else{
      this.CarrerasActivas = data['data'];
    }
  }

  /*Eventos de la pantalla Carrera del cliente */
  async abrirPantallaCarreraContacto(carrera){
    if(carrera){
      let data = await this.peopleService.loadCarreraPorAlumno(carrera.Id_Carrera_Estudiante);
      if(data['total']==0){
        this.CarreraEstudiante = {
          Id_Carrera_Estudiante:'',
          Id_Persona:'',
          Id_Carrera:'',
          Carrera:'',
          Fecha_Ingreso:this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year,
          Fecha_Graduacion:'',
          Estado:''
        };

      }else{
        this.CarreraEstudiante = data['data'][0];
      }
    }
    this.PantallaCarreraContacto = true;
  }
  cerrarPantallaCarreraContacto(){
    this.PantallaCarreraContacto = false;
  }
  async abrirPantallaNotas(Nota){
    if(Nota){
      this.Nota = Nota;
      //this.loadNota(Nota.Id_Notas);
    }
    this.PantallaNotas = true;
  }
  cerrarPantallaNotas(){
    this.PantallaNotas = false;
  }

  grabarCarrera(){
    this.CarreraEstudiante.Id_Persona = this.Persona.Id_Persona;
    this.CarreraEstudiante.Fecha_Ingreso = this.Fecha_Ingreso.day + '-' + this.Fecha_Ingreso.month + '-' + this.Fecha_Ingreso.year;
    this.CarreraEstudiante.Fecha_Graduacion = this.Fecha_Graduacion.day + '-' + this.Fecha_Graduacion.month + '-' + this.Fecha_Graduacion.year;

    if(this.CarreraEstudiante.Id_Carrera == ''){
      Swal.fire('Debe seleccionar la Carrera');
      return false;
    }
    if(this.CarreraEstudiante.Fecha_Ingreso == ''){
      Swal.fire('Debe seleccionar fecha de ingreso');
      return false;
    }
    if(this.CarreraEstudiante.Estado == '3'){
      if(this.CarreraEstudiante.Fecha_Graduacion ==''){
        Swal.fire('Debe seleccionar fecha de graduación');
      return false;
      }
    }
    if(this.CarreraEstudiante.Id_Carrera_Estudiante ==''){
      this.insertCarrera();
    }else{
      this.updateCarrera();
    }
    this.cerrarPantallaCarreraContacto();
    return true;

  }
  async insertCarrera(){
    let data = await this.peopleService.insertCarreraPorAlumno(this.CarreraEstudiante);
  }
  async updateCarrera(){
    let data = await this.peopleService.updateCarreraPorAlumno(this.CarreraEstudiante);
  }
  /*Eventos de la pantalla Carreras por Activas */
  abrirPantallaCarreraActiva(){
    this.PantallaCarrerasActivas = true;
  }

  cerrarPantallaCarreraActiva(){
    this.PantallaCarrerasActivas = false;
  }
  searchCarrera(){

  }
  keytabCarrera(event){

  }
  SeleccionarCarrera(Carrera){
    this.CarreraEstudiante.Id_Carrera = Carrera.Id_Carrera;
    this.CarreraEstudiante.Carrera = Carrera.Carrera;
    this.cerrarPantallaCarreraActiva();
  }

  async loadNota(Nota){
    let data = await this.peopleService.loadNota(Nota.Id_Notas);
    if(data['total'] != 0){
      this.Nota = data['data'][0];
    }
  }

  async loadNotas(search?:any){
    let data = await this.peopleService.loadNotas(this.Persona.Id_Persona);
    if(data['total'] == 0){
      this.Notas = [];
    }else{
      this.Notas = data['data'];
    }
  }

  async GrabarNota(){
    if(this.Nota.Nota = ''){
      Swal.fire('No Puede grabar una nota en blanco');
      return false;
    }
    this.Nota.Nota = (document.getElementById('Nota') as HTMLInputElement).value
    this.Nota.Id_Persona = this.Persona.Id_Persona;
    console.log(this.Nota);
    if(this.Nota.Id_Notas == ''){
      let data = await this.peopleService.insertNota(this.Nota);
    }else{
      let data = await this.peopleService.updateNota(this.Nota);
    }

    this.Nota = {
      Id_Notas:'',
      Id_Persona:'',
      Nota:''
    }
    this.cerrarPantallaNotas();
    this.loadNotas();
    return true;
  }
  public onValueChange(event: Event): void {
    const value = (event.target as any).value;
    this.Nota.Nota = value;
  }
}
