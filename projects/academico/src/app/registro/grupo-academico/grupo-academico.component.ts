import { Component, OnInit } from '@angular/core';
import { GrupoAcademicoService } from './grupo-academico.service';
import { BranchService } from '../../../../../main/src/app/general/branch/branch.service';
import { PeriodoAcademicoService } from '../periodo-academico/periodo-academico.service';
import { CursoService } from '../../config/curso/curso.service';
import { CarreraService } from '../../config/carrera/carrera.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupo-academico',
  templateUrl: './grupo-academico.component.html',
  styleUrls: ['./grupo-academico.component.css']
})
export class GrupoAcademicoComponent implements OnInit {

  constructor(private grupoAcademicoService:GrupoAcademicoService,
    private branchService:BranchService,
    private periodoAcademicoService:PeriodoAcademicoService,
    private CursoService:CursoService,
    private carreraService:CarreraService,
    private contactoService:ContactoService
    ) { }

  edit = false;
  PantallaCursos = false;
  PantallaProfesores = false;

  searchField = '';
  searchFieldCursosDisponibles = '';
  searchFieldProfesores = '';

  bankAccountans = [];
  Sucursales = []
  Grupos = [];
  Periodos = [];
  Cursos = [];
  Profesores = [];

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

  Grupo = {
    Id_Grupo:'',
    Id_Sucursal:'',
    Nombre:'',
    Aula:'',
    Id_Profesor:'',
    Profesor:'',
    Id_Curso:'',
    Curso:'',
    Id_Periodo:'',
    Dia:'',
    Hora:'',
    Modalidad:'',
    Estado:''
  }
  Curso = {
    Id_Curso:'',
    Curso:''
  }

  ngOnInit(): void {
    this.cargarCedes();
    this.cargarPeriodos();
    this.loadGrupos();
  }
  /*Cargar los datos por defecto */
  async cargarCedes(){

    let data = await this.branchService.loadSucursales(this.paginacion2,'');
    if(data['total'] == 0){
      this.Sucursales = [];
    }else{
      this.Sucursales = data['data'];
    }
  }
  async cargarPeriodos(){
    let data = await this.periodoAcademicoService.loadPeriodos(this.paginacion2,'',1);
    if(data['total'] == 0){
      this.Periodos = [];
    }else{
      this.Periodos = data['data'];
    }
  }
  async cargarCursos(){
    let pag = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.CursoService.cargarCursos(pag,'',1);
    if(data['total'] == 0){
      this.Cursos = [];
    }else{
      this.Cursos = data['data'];
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
    this.loadGrupos();
  }
  ChangePage1(action,pantalla){
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
    if(pantalla = 1){
      this.carcarCursosDisponibles();
    }
    if(pantalla = 1){
      this.carcarProfesores();
    }
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadGrupos(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   editRecord(Grupo){
    this.edit = true;
    if(Grupo){
        this.loadGrupo(Grupo.Id_Grupo);
    }else{
      this.Grupo = {
        Id_Grupo:'',
        Id_Sucursal:'',
        Nombre:'',
        Aula:'',
        Id_Profesor:'',
        Profesor:'',
        Id_Curso:'',
        Curso:'',
        Id_Periodo:'',
        Dia:'',
        Hora:'',
        Modalidad:'1',
        Estado:'1'
      }
      this.Grupo.Id_Sucursal = this.Sucursales[0]['Id_Sucursal'];
      this.Grupo.Id_Periodo = this.Periodos[0]['Id_Periodo_Academico'];
    }
   }
  async loadGrupos(search?:any){
    let data = await this.grupoAcademicoService.loadGrupos(this.paginacion,search);
    if(data['total'] == 0){
      this.Grupos = [];
    }else{
      this.Grupos = data['data'];
    }
  }
  async loadGrupo(Id_Grupo){
    let data = await this.grupoAcademicoService.loadGrupo(Id_Grupo);
    if(data['total'] == 0){
      this.Grupo = {
        Id_Grupo:'',
        Id_Sucursal:'',
        Nombre:'',
        Aula:'',
        Id_Profesor:'',
        Profesor:'',
        Id_Curso:'',
        Curso:'',
        Id_Periodo:'',
        Dia:'',
        Hora:'',
        Modalidad:'',
        Estado:''
      }
    }else{
      this.Grupo = data['data'][0];
    }
  }
  async grabar(){
    if(this.Grupo.Id_Profesor == ""){
      Swal.fire('Favor suministrar el Bloque');
      return false;
    }
    if(this.Grupo.Id_Curso == ""){
      Swal.fire('Favor suministrar el año');
      return false;
    }
    this.Grupo.Nombre = this.Grupo.Id_Sucursal + '-' + this.Grupo.Id_Curso + '-' + this.Grupo.Dia + this.Grupo.Hora + this.Grupo.Modalidad +'-'+ this.Grupo.Aula;
    let data = await this.grupoAcademicoService.saveGrupo(this.Grupo);

    if(data['success'] == 'true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadGrupos(this.searchField);
      this.edit = false;
    }
    return true;
  }
  /* Eventos de la pantalla cursos*/
  searchCursosDiponibles(){
    this.carcarCursosDisponibles();
  }
  keytabCursosDisponibles(event){
    if (event.key === 'Enter') {
      this.searchCursosDiponibles();
    }
  }
  openCursosPanel(){
    this.PantallaCursos = true;
    this.carcarCursosDisponibles();
  }
  closeModalCursos(){
    this.PantallaCursos = false;
  }
  async carcarCursosDisponibles(){
    let data = await this.CursoService.cargarCursos(this.paginacion2,this.searchFieldCursosDisponibles,1);
    if(data['total'] == 0){
      this.Cursos = [];
    }else{
      this.Cursos = data['data'];
    }
  }
  seleccionarCurso(curso){
    this.Grupo.Id_Curso = curso.Id_Curso;
    this.Grupo.Curso = curso.Curso;
    this.closeModalCursos();
  }

  /* Evento de Pantalla profesores*/
  async carcarProfesores(){
    let data = await this.contactoService.loadPersonas(this.paginacion2,this.searchFieldProfesores,3);
    if(data['total'] == 0){
      this.Profesores = [];
    }else{
      this.Profesores = data['data'];
    }
  }
  searchProfesores(){
    this.carcarProfesores();
  }
  keytabProfesores(event){
    if (event.key === 'Enter') {
      this.searchProfesores();
    }
  }
  openProfesoresPanel(){
    this.PantallaProfesores = true;
    this.carcarProfesores();
  }
  closeProfesoresPanel(){
    this.PantallaProfesores = false;
  }
  seleccionarProfesor(profesor){
    this.Grupo.Id_Profesor = profesor.Id_Persona;
    this.Grupo.Profesor = profesor.Nombre;
    this.closeProfesoresPanel();
  }
}
