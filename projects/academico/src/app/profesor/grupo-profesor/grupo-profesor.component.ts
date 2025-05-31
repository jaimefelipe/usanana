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
  Grupos = [];
  Alumnos = [];
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
    if(Grupo){
      let data = await this.grupoProfesorService.cargarAlumnos(Grupo.Id_Grupo);
      this.Alumnos = data['data'];
    }else{
      this.Alumnos = [];
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
     window.open('https://toxo.work/reportes/educacion/grupos/acta.php?id=' + param, '_blank');
  }
  CerrarPantallaGrupo(){
    this.edit = false;
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
}
