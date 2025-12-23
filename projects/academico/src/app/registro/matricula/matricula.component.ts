import { Component, OnInit } from '@angular/core';
import { MatriculaService } from './matricula.service';
import { PeriodoAcademicoService } from '../periodo-academico/periodo-academico.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.css']
})
export class MatriculaComponent implements OnInit {

  constructor(
    private matriculaService:MatriculaService,
    private periodoAcademicoService:PeriodoAcademicoService,
    private contactoService:ContactoService
    ) { }
  edit = false;
  PantallaAlumnos = false;
  PantallaCursos = false;
  PantallaDetalle = false;

  searchField = '';
  searchFieldAlumnos = '';
  searchFieldCursosDisponibles = '';

  Matriculas  = [];
  Periodos = [];
  Cursos = [];
  Alumnos = [];
  CursosDisponibles = [];
  MatriculaDetalle = [];

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  paginacion1 = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  paginacion2 = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Matricula = {
    Id_Matricula:'',
    Id_Persona:'',
    Nombre:'',
    Id_Periodo:'',
    Periodo:'',
    Bloque:'',
    Anio:''
  }

  Detalle = {
    Nombre:'',
    Id_Matricula_Detalle:'',
    Estado:'',
    Rubrica_1:'',
    Rubrica_2:'',
    Rubrica_3:'',
    Rubrica_4:'',
    Rubrica_5:'',
    Promedio:'',
    Notas:'',
  }
  ngOnInit() {
    this.cargarMatriculas();
    this.cargarPeriodosAcademicos();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabAlumnos(event){
    if (event.key === 'Enter') {
      this.searchAlumnos();
    }
  }
  keytabCursosDisponibles(event){
    if (event.key === 'Enter') {
      this.searchCursosDiponibles();
    }
  }
  search(){
    this.cargarMatriculas();
  }
  searchAlumnos(){
    this.cargarAlumnos();
  }
  searchCursosDiponibles(){
    this.cargarCursosDisponibles();
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
    this.cargarMatriculas();
  }
  ChangePage1(action){
    if (action == 0) {
      this.paginacion1.FirstRow = 1;
      this.paginacion1.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion1.FirstRow < 50) {
        this.paginacion1.FirstRow = 1;
        this.paginacion1.LastRow = 50;
      } else {
        this.paginacion1.FirstRow= this.paginacion1.FirstRow -50;
        this.paginacion1.LastRow= this.paginacion1.LastRow -50;
      }
    }
    if (action == 2) {
      this.paginacion1.FirstRow = this.paginacion1.FirstRow +50;
      this.paginacion1.LastRow = this.paginacion1.LastRow + 50;
    }
    this.cargarMatriculas();
  }
  ChangePage2(action){
    if (action == 0) {
      this.paginacion2.FirstRow = 1;
      this.paginacion2.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion2.FirstRow < 50) {
        this.paginacion2.FirstRow = 1;
        this.paginacion2.LastRow = 50;
      } else {
        this.paginacion2.FirstRow= this.paginacion2.FirstRow -50;
        this.paginacion2.LastRow= this.paginacion2.LastRow -50;
      }
    }
    if (action == 2) {
      this.paginacion2.FirstRow = this.paginacion2.FirstRow +50;
      this.paginacion2.LastRow = this.paginacion2.LastRow + 50;
    }
    this.cargarCursosDisponibles();
  }
  async cargarMatriculas(){
    let data = await this.matriculaService.cargarMatriculas(this.paginacion,this.searchField);
    console.log(data)
    if(data['total'] == 0){
      this.Matriculas = [];
    }else{
      this.Matriculas = data['data'];
    }
  }
  async cargarPeriodosAcademicos(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.periodoAcademicoService.loadPeriodos(paginacion,'',1);
    if(data['total'] == 0){
      this.Periodos = [];
    }else{
      this.Periodos = data['data'];
    }
  }
  editRecord(Matricula){
    this.edit = true;
    if(Matricula){
      this.cargarMatricula(Matricula.Id_Matricula);
      this.cargarMatriculaDetalle(Matricula.Id_Matricula)
    }else{
      this.Matricula = {
        Id_Matricula:'',
        Id_Persona:'',
        Nombre:'',
        Id_Periodo:'',
        Periodo:'',
        Bloque:'',
        Anio:''
      }
      this.MatriculaDetalle = [];
    }
  }
  async cargarMatricula(Id_Matricula){
    let data = await this.matriculaService.cargarMatricula(Id_Matricula);
    this.Matricula = data['data'][0];
    this.Matricula.Periodo = this.Matricula.Bloque +'-'+  this.Matricula.Anio;
  }
  async cargarMatriculaDetalle(Id_Matricula){
    let data = await this.matriculaService.cargarMatriculaDetalle(Id_Matricula);
    if(data['total']==0){
      this.MatriculaDetalle = [];
    }else{
      this.MatriculaDetalle = data['data'];
    }
  }

  async grabar(){
    if(this.Matricula.Id_Periodo == ""){
      Swal.fire('Favor suministrar el Periodo');
      return false;
    }
    if(this.Matricula.Id_Persona == ""){
      Swal.fire('Favor suministrar el alumno');
      return false;
    }
    let data = [];
    if(this.Matricula.Id_Matricula == ""){
      data = await this.matriculaService.NuevaMatricula(this.Matricula);
    }else{
      data = await this.matriculaService.ActualizarMatricual(this.Matricula);
    }
    if(data['success'] == 'true'){
      this.Matricula.Id_Matricula = data['Identity'];
      this.cargarMatriculas();
      //jaime
      //this.cargarMatriculaDetalle(this.Matricula.Id_Matricula)
      Swal.fire('Matricula grabada correctamente');
    }
    
    return true;

  }
  cancel(){
    this.edit = false;
  }

  /*Eventos de la pantalla Busqueda de Alunnos*/
  abrirPantallaAlumnos(){
    this.cargarAlumnos();
    this.PantallaAlumnos = true;
  }
  async cargarAlumnos(){
    let data = await this.contactoService.loadPersonas(this.paginacion,this.searchFieldAlumnos,4);
    if(data['total'] == 0){
      this.Alumnos = [];
    }else{
      this.Alumnos = data['data'];
    }
  }
  cerrarPantallaAlumnos(){
    this.PantallaAlumnos = false;
  }
  seleccionarAlumno(Alumno){
    this.Matricula.Id_Persona = Alumno.Id_Persona;
    this.Matricula.Nombre = Alumno.Nombre;
    this.cerrarPantallaAlumnos();
  }
  /* Eventos de la pantalla de busqueda de cursos para matricular */
  abrirPantallaCursos(curso){
    this.cargarCursosDisponibles();
    this.PantallaCursos = true;
  }
  cerrarPantallaCursos(){
    this.PantallaCursos = false;
  }
  async cargarCursosDisponibles(){
    let data = await this.matriculaService.cargarCursosDisponibles(this.Matricula.Id_Persona,this.Matricula.Id_Periodo);
    if(data['total'] == 0){
      this.CursosDisponibles = [];
    }else{
      this.CursosDisponibles = data['data'];
    }
  }
  async seleccionarCurso(Curso){
    let data = await this.matriculaService.grabarMatriculaDetalle(this.Matricula.Id_Matricula,Curso.Id_Grupo);
    this.cargarMatriculaDetalle(this.Matricula.Id_Matricula);
    this.cerrarPantallaCursos();
  }
  async seleccionarDetalle(Detalle){
    let data = await this.matriculaService.CargarDetalle(Detalle.Id_Matricula_Detalle);
    this.Detalle = data['data'][0];
    this.Detalle.Nombre = Detalle.Curso + '-' + Detalle.Modalidad + Detalle.Dia + Detalle.Hora

    this.PantallaDetalle = true;
  }
  cerrarPantallaDetalles(){
    this.PantallaDetalle = false;
  }
  async grabarDetalle(){
    await this.matriculaService.updateMatriculaDetalle(this.Detalle.Id_Matricula_Detalle,this.Detalle.Estado,this.Detalle.Notas);
    this.cargarMatriculaDetalle(this.Matricula.Id_Matricula);
    this.cerrarPantallaDetalles();
  }
  GenerarBooleta(){
    let param = this.Matricula.Id_Matricula + '&e=' + localStorage.getItem('Id_Empresa') + '&u=' + localStorage.getItem('Id_Usuario');
    //window.open('http://ibo.jaimebrenes.com:/reportes/educacion/matricula/Boleta_Matricula.php?id=' + param, '_blank');
    window.open('https://usantana.com/reportes/educacion/matricula/Boleta_Matricula.php?id=' + param, '_blank');
  }
}
