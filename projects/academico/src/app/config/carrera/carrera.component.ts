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
  Carreras = [];
  CursosCarrera = [];
  CursosDisponibles = [];

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
    this.CarreraClass = 'text-success tablinks active';
    this.CursoClass = '';
  }

  activarCursos(){
    this.CarreraActive = false;
    this.CursosActive = true;
    this.CarreraClass = '';
    this.CursoClass = 'text-success tablinks active';
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
}
