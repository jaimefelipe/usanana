import { Component, OnInit } from '@angular/core';
import { CursoService } from './curso.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent implements OnInit {

  constructor(private CursoService:CursoService) { }

  edit = false;
  searchField = '';
  Cursos = [];
  Curso = {
    Id_Curso:'',
    Codigo:'',
    Curso:'',
    Descripcion:'',
    Requisitos:'',
    Creditos:'',
    Estado:'1'
  }
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  ngOnInit(): void {
    this.CargarCursos();
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
    this.CargarCursos();
  }
  search(){
    this.CargarCursos(this.searchField);
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  async CargarCursos(search?:any){
    let data = await this.CursoService.cargarCursos(this.paginacion,search);
    if(data['total'] == 0){
      this.Cursos = [];
    }else{
      this.Cursos = data['data'];
    }
  }
  async LeerCurso(Id_Curso){
    let data = await this.CursoService.cargarCurso(Id_Curso);
    this.Curso = data['data'][0];
  }

  editRecord(Curso){
    this.edit = true;
    if(Curso){
        this.LeerCurso(Curso.Id_Curso);
    }else{
      this.Curso = {
        Id_Curso:'',
        Codigo:'',
        Curso:'',
        Descripcion:'',
        Requisitos:'',
        Creditos:'',
        Estado:'1'
      }
    }
  }

  async grabar(){
    if(this.Curso.Codigo == ""){
      Swal.fire('Favor suministrar el código');
      return false;
    }
    if(this.Curso.Curso == ""){
      Swal.fire('Favor suministrar el Nombre de la Curso');
      return false;
    }
    let data = [];
    if(this.Curso.Id_Curso == ""){
      data = await this.CursoService.InsertarCurso(this.Curso);
    }else{
      data = await this.CursoService.ActualizarCurso(this.Curso);
    }

    if(data['success'] == 'true'){
      Swal.fire('Curso grabado correctamente');
      this.CargarCursos(this.searchField);
      this.edit = false;
    }
    return true;

  }
  cancel(){
    this.edit = false;
  }

}
