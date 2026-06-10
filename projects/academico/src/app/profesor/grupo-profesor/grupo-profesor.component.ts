import { Component, OnInit } from '@angular/core';
import { GrupoProfesorService } from './grupo-profesor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupo-profesor',
  templateUrl: './grupo-profesor.component.html',
  styleUrls: ['./grupo-profesor.component.css']
})
export class GrupoProfesorComponent implements OnInit {

  constructor(
    private grupoProfesorService:GrupoProfesorService
  ) { }
  edit = false;
  NotasPanel = false;
  searchField = '';
  Id_Grupo = '';
  GrupoSeleccionado:any = null;
  Grupos = [];
  Alumnos = [];
  Actividades = [];
  Entregas = [];
  Id_Actividad = '';
  Notas = {

  }
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
   estudiante = {
    Id_Matricula_Detalle : '',
    Nombre : '',
    Rubrica_1 : '0',
    Rubrica_2 : '0',
    Rubrica_3 : '0',
    Rubrica_4 : '0',
    Rubrica_5 : '0',
    Promedio : '0',
    Estado : '1'

  };
  ngOnInit() {
    this.leerGrupos();
  }
  search(){

  }
  keytab(e){

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
    this.leerGrupos();
  }
  async editRecord(Grupo){
    this.Id_Grupo = Grupo.Id_Grupo;
    this.GrupoSeleccionado = Grupo;
    if(Grupo){
      let data = await this.grupoProfesorService.cargarAlumnos(Grupo.Id_Grupo);
      this.Alumnos = data?.['data'] || [];
      await this.cargarActividadesGrupo();
    }else{
      this.Alumnos = [];
      this.Actividades = [];
      this.Entregas = [];
    }
    this.edit = true;
  }
  async leerGrupos(){
    let data = await this.grupoProfesorService.cargarGrupos(this.paginacion,this.searchField);
    if(data['total']>0){
      this.Grupos = data['data'];
    }else{
      this.Grupos = [];
    }
  }
  GenerarActa(){
    let param = this.Id_Grupo  + '&e=' + localStorage.getItem('Id_Empresa') + '&u=' + localStorage.getItem('Id_Usuario');
     //window.open('http://ibo.jaimebrenes.com:/reportes/educacion/grupos/acta.php?id=' + param, '_blank');
     window.open('https://usantana.com/reportes/educacion/grupos/acta.php?id=' + param, '_blank');
  }
  CerrarPantallaGrupo(){
    this.edit = false;
    this.GrupoSeleccionado = null;
    this.Id_Actividad = '';
    this.Entregas = [];
  }
  abrirNotasPanel(Estudiante){
    this.estudiante = Estudiante;
    if(this.estudiante.Rubrica_1 === ''){
      this.estudiante.Rubrica_1 = '0';
    }
    if(this.estudiante.Rubrica_2 === ''){
      this.estudiante.Rubrica_2 = '0';
    }
    if(this.estudiante.Rubrica_3 === ''){
      this.estudiante.Rubrica_3 = '0';
    }
    if(this.estudiante.Rubrica_4 === ''){
      this.estudiante.Rubrica_4 = '0';
    }
    if(this.estudiante.Rubrica_5 === ''){
      this.estudiante.Rubrica_5 = '0';
    }
    if(this.estudiante.Promedio === ''){
      this.estudiante.Promedio = '0';
    }
    this.NotasPanel = true;
  }
  CerrarPantallaNotas(){
    this.NotasPanel = false;
  }
  async grabarNotas(){
    await this.grupoProfesorService.grabarNotas(this.estudiante);
    await this.recargarAlumnosGrupo();
    this.CerrarPantallaNotas();
  }

  CalcularPromedio(){
    let promedio = parseFloat(this.estudiante.Rubrica_1) + parseFloat(this.estudiante.Rubrica_2) + parseFloat(this.estudiante.Rubrica_3) + parseFloat(this.estudiante.Rubrica_4) + parseFloat(this.estudiante.Rubrica_5);
    if(promedio > 70){
      this.estudiante.Estado = '2';
    }else{
      this.estudiante.Estado = '3'
    }
    if(promedio>100){
      Swal.fire('Hay un error en las notras el promedio no puede ser mayor que 100');
    }
    this.estudiante.Promedio = String(promedio);
  }

  async cargarActividadesGrupo(){
    if(!this.Id_Grupo){
      this.Actividades = [];
      return;
    }
    const data = await this.grupoProfesorService.cargarActividadesGrupo(this.Id_Grupo);
    this.Actividades = data?.['data'] || [];
  }

  async cargarEntregasActividad(){
    if(!this.Id_Actividad){
      this.Entregas = [];
      return;
    }
    const data = await this.grupoProfesorService.cargarEntregasActividad(this.Id_Actividad, this.Id_Grupo);
    this.Entregas = data?.['data'] || [];
  }

  async guardarEntrega(entrega){
    if(entrega.Nota !== null && entrega.Nota !== '' && (Number(entrega.Nota) < 0 || Number(entrega.Nota) > 100)){
      Swal.fire('La nota debe estar entre 0 y 100');
      return;
    }

    const data = await this.grupoProfesorService.actualizarEntrega(entrega);
    if(data?.['success'] === 'true'){
      Swal.fire('Entrega actualizada');
      await this.cargarActividadesGrupo();
      await this.cargarEntregasActividad();
    }else{
      Swal.fire(data?.['message'] || 'No se pudo actualizar la entrega');
    }
  }

  async aplicarNotasLmsAlActa(){
    if(!this.Id_Grupo){
      return;
    }

    const confirmar = await Swal.fire({
      title: 'Aplicar notas LMS',
      text: 'Se calculara el promedio de entregas calificadas y se copiara al acta del grupo.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar'
    });

    if(!confirmar.isConfirmed){
      return;
    }

    const data = await this.grupoProfesorService.aplicarNotasLmsAlActa(this.Id_Grupo);
    if(data?.['success'] === 'true'){
      await this.recargarAlumnosGrupo();
      Swal.fire('Notas aplicadas', 'Se actualizaron ' + data['total'] + ' estudiantes con entregas calificadas.', 'success');
    }else{
      Swal.fire(data?.['message'] || 'No se pudieron aplicar las notas LMS');
    }
  }

  async recargarAlumnosGrupo(){
    if(!this.Id_Grupo){
      return;
    }
    const data = await this.grupoProfesorService.cargarAlumnos(this.Id_Grupo);
    this.Alumnos = data?.['data'] || [];
  }

  getTipoActividad(tipo){
    const tipos = {
      '1': 'Tarea',
      '2': 'Examen',
      '4': 'Presentacion'
    };
    return tipos[tipo] || tipo || '';
  }

  getEntregaUrl(entrega){
    const url = entrega?.Url || '';
    if(!url){
      return '';
    }
    if(url.startsWith('http')){
      return url;
    }
    return 'https://usantana.com' + (url.startsWith('/') ? url : '/' + url);
  }

  getEstadoEntrega(entrega){
    if(entrega.Nota === null || entrega.Nota === undefined || entrega.Nota === ''){
      return 'Pendiente';
    }
    return 'Calificada';
  }
}
