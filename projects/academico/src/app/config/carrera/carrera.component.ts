import { Component, OnInit } from '@angular/core';
import { CarreraService } from './carrera.service';
import { CursoService } from '../curso/curso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent implements OnInit {

  constructor(private carreraService:CarreraService,
    private cursoService:CursoService
    ) { }

  edit = false;
  PantallaCursos = false;
  PantallaCurso = false;
  CarreraActive = true;
  CursosActive = false;
  FinancieroActive = false;

  searchField = '';
  searchField_Curso = '';
  searchFieldCursosDisponibles = ''

  Curso = {
    Id_Curso_Carrera:'',
    Id_Carrera:'',
    Id_Curso : '',
    Bloque : '',
    Curso : '',
    Codigo:''
  }

  CarreraClass = 'text-success tablinks active';
  CursoClass = '';
  FinancieroClass = '';
  Carreras = [];
  CursosCarrera = [];
  CursosDisponibles = [];
  BancosTexto = '';
  ConfigFinanciera = {
    Id_Config_Financiera: '',
    Nombre: '',
    Moneda: 'CRC',
    Cursos_Por_Bloque: 4,
    Creditos_Por_Curso: 3,
    Precio_Credito: 0,
    Precio_Curso: 0,
    Matricula_Bloque: 0,
    Medio_Pago_Texto: 'Realice el pago por transferencia o deposito y cargue el comprobante en el portal de seguimiento.',
    Bancos_JSON: '[]',
    Notificar_Email: 'admisiones@usantana.com'
  };

  Carrera = {
    Id_Carrera:'',
    Codigo:'',
    Carrera:'',
    Descripcion:'',
    Requisito:'',
    Duracion:'',
    Creditos:'',
    Estado:'',
    Nivel:'',
    Id_Facultad:'',
    Id_Escuela:''
  }
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  ngOnInit(): void {
    this.CargarCarreras();
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
    this.CargarCarreras();
  }
  ChangePage1(action){
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
    this.leerCursosCarrera(this.Carrera.Id_Carrera);
  }
  ChangePage3(action){
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
    this.cargarCursosDisponibles();
  }
  search(){
    this.CargarCarreras(this.searchField);
  }
  search_Curso(){
    this.leerCursosCarrera(this.Carrera.Id_Carrera);
  }
  searchCursosDiponibles(){
    this.cargarCursosDisponibles();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytab_Curso(event){
    if (event.key === 'Enter') {
      this.search_Curso();
    }
  }
  keytabCursosDisponibles(event){
    if (event.key === 'Enter') {
      this.searchCursosDiponibles();
    }
  }
  async CargarCarreras(search?:any){
    let data = await this.carreraService.cargarCarreras(this.paginacion,search);
    if(data['total'] == 0){
      this.Carreras = [];
    }else{
      this.Carreras = data['data'];
    }
  }
  async LeerCarrera(Id_Carrera){
    let data = await this.carreraService.cargarCarrera(Id_Carrera);
    this.Carrera = data['data'][0];
    await this.cargarConfigFinanciera();
  }

  editRecord(Carrera){
    this.edit = true;
    if(Carrera){
        this.LeerCarrera(Carrera.Id_Carrera);
        this.leerCursosCarrera(Carrera.Id_Carrera)
    }else{
      this.Carrera = {
        Id_Carrera:'',
        Codigo:'',
        Carrera:'',
        Descripcion:'',
        Requisito:'',
        Duracion:'',
        Creditos:'',
        Estado:'',
        Nivel:'',
        Id_Facultad:'',
        Id_Escuela:''
      }
    }
  }

  async grabar(){
    if(this.Carrera.Codigo == ""){
      Swal.fire('Favor suministrar el código');
      return false;
    }
    if(this.Carrera.Carrera == ""){
      Swal.fire('Favor suministrar el Nombre de la Carrera');
      return false;
    }
    let data = [];
    if(this.Carrera.Id_Carrera == ""){
      data = await this.carreraService.InsertarCarrera(this.Carrera);
    }else{
      data = await this.carreraService.ActualizarCarrera(this.Carrera);
    }

    if(data['success'] == 'true'){
      Swal.fire('Carrera grabada correctamente');
      this.CargarCarreras(this.searchField);
      this.edit = false;
    }
    return true;

  }
  cancel(){
    this.edit = false;
  }
  activarCarrera(){
    this.CarreraActive = true;
    this.CursosActive = false;
    this.FinancieroActive = false;
    this.CarreraClass = 'text-success tablinks active';
    this.CursoClass = '';
    this.FinancieroClass = '';
  }

  activarCursos(){
    this.CarreraActive = false;
    this.CursosActive = true;
    this.FinancieroActive = false;
    this.CarreraClass = '';
    this.CursoClass = 'text-success tablinks active';
    this.FinancieroClass = '';
  }

  activarFinanciero(){
    this.CarreraActive = false;
    this.CursosActive = false;
    this.FinancieroActive = true;
    this.CarreraClass = '';
    this.CursoClass = '';
    this.FinancieroClass = 'text-success tablinks active';
  }
  async leerCursosCarrera(Id_Carrera){
    let data = await this.carreraService.CargarCursosCarrera(Id_Carrera,this.paginacion,this.searchField_Curso);
    if(data['total'] == 0){
      this.CursosCarrera = [];
    }else{
      this.CursosCarrera = data['data'];
    }
  }
  editCurso(Curso){
    if(Curso){
      this.LeerCurso(Curso.Id_Curso);
    }else{
      this.Curso = {
        Id_Curso_Carrera:'',
        Id_Curso : '',
        Id_Carrera:'',
        Bloque : '',
        Curso : '',
        Codigo:''
      }
    }
    this.PantallaCurso = true;
  }
  async agregarCurso(){
    if(this.Curso.Id_Curso == ""){
      Swal.fire('Favor Seleccionar el Curso');
      return false;
    }
    let data = [];
    this.Curso.Id_Carrera = this.Carrera.Id_Carrera
    
    if(this.Curso.Id_Curso_Carrera == ""){
      data = await this.carreraService.InsertarCursoCarrera(this.Curso);
    }else{
      data = await this.carreraService.ActualizarCarreraCurso(this.Curso);
    }

    if(data['success'] == 'true'){
      Swal.fire('Curso Agregado correctamente');
      this.leerCursosCarrera(this.Carrera.Id_Carrera);
      this.PantallaCurso = false;
      //this.CargarCarreras(this.searchField);
      //this.edit = false;
    }
    return true;
  }
  closeModal(){
    this.PantallaCurso = false;
  }
  async LeerCurso(Id_Curso){
    let data = await this.carreraService.cargarCurso(Id_Curso);
    this.Curso = data['data'][0];
  }
  openCursosPanel(){
    this.PantallaCursos = true;
    this.cargarCursosDisponibles();
  }
  closeModalCursos(){
    this.PantallaCursos = false;
  }
  async cargarCursosDisponibles(){
    let data = await this.carreraService.cargarCursosDisponibles(this.paginacion,this.searchFieldCursosDisponibles);
    if(data['total'] == 0){
      this.CursosDisponibles = [];
    }else{
      this.CursosDisponibles = data['data'];
    }
  }
  seleccionarCurso(curso){
    this.Curso = curso;
    this.closeModalCursos();
  }

  async cargarConfigFinanciera(){
    if(!this.Carrera.Id_Carrera){
      this.resetConfigFinanciera();
      return;
    }
    let data = await this.carreraService.cargarConfigFinanciera(this.Carrera.Id_Carrera);
    if(data && data['data'] && data['data'].length){
      this.ConfigFinanciera = data['data'][0];
    }else{
      this.resetConfigFinanciera();
      this.ConfigFinanciera.Nombre = 'Configuracion admision ' + this.Carrera.Carrera;
    }
    this.BancosTexto = this.formatearBancosTexto(this.ConfigFinanciera.Bancos_JSON);
  }

  resetConfigFinanciera(){
    this.ConfigFinanciera = {
      Id_Config_Financiera: '',
      Nombre: '',
      Moneda: 'CRC',
      Cursos_Por_Bloque: 4,
      Creditos_Por_Curso: 3,
      Precio_Credito: 0,
      Precio_Curso: 0,
      Matricula_Bloque: 0,
      Medio_Pago_Texto: 'Realice el pago por transferencia o deposito y cargue el comprobante en el portal de seguimiento.',
      Bancos_JSON: '[]',
      Notificar_Email: 'admisiones@usantana.com'
    };
    this.BancosTexto = '';
  }

  parseJson(value){
    try{
      return value ? JSON.parse(value) : null;
    }catch(e){
      return null;
    }
  }

  formatearBancosTexto(json){
    const bancos = this.parseJson(json) || [];
    if(!Array.isArray(bancos) || !bancos.length){
      return '';
    }
    return bancos.map((b) => [b.banco, b.cuenta, b.iban, b.moneda, b.titular].filter(Boolean).join(' | ')).join('\n');
  }

  bancosTextoAJson(){
    const bancos = String(this.BancosTexto || '').split(/\r?\n/).map(linea => {
      const partes = linea.split('|').map(x => x.trim());
      return {
        banco: partes[0] || '',
        cuenta: partes[1] || '',
        iban: partes[2] || '',
        moneda: partes[3] || this.ConfigFinanciera.Moneda || 'CRC',
        titular: partes[4] || 'Universidad Santa Ana San Jose'
      };
    }).filter(b => b.banco || b.cuenta || b.iban);
    return JSON.stringify(bancos);
  }

  async guardarConfigFinanciera(){
    if(!this.Carrera.Id_Carrera){
      Swal.fire('Primero guarde la carrera');
      return;
    }
    this.ConfigFinanciera.Bancos_JSON = this.bancosTextoAJson();
    let data = await this.carreraService.guardarConfigFinanciera(this.Carrera,this.ConfigFinanciera);
    if(data && data['success'] == 'true'){
      Swal.fire('Configuracion financiera guardada');
      await this.cargarConfigFinanciera();
    }else{
      Swal.fire(data && data['error'] ? data['error'] : 'No se pudo guardar la configuracion financiera');
    }
  }
}
