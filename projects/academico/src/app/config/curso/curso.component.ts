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
  imagenCursoFile: File | null = null;
  imagenCursoPreview: string | null = null;
  readonly imagenCursoDefault = 'assets/nofoto.jpg';
  Curso = {
    Id_Curso:'',
    Codigo:'',
    Curso:'',
    Descripcion:'',
    Requisitos:'',
    Creditos:'',
    Imagen:'',
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
    this.imagenCursoFile = null;
    this.imagenCursoPreview = null;
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
        Imagen:'',
        Estado:'1'
      }
      this.imagenCursoFile = null;
      this.imagenCursoPreview = null;
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
    if(this.imagenCursoFile){
      const formData = new FormData();
      formData.append('archivo', this.imagenCursoFile);
      formData.append('Id_Empresa', localStorage.getItem('Id_Empresa') || '');
      formData.append('Id_Curso', this.Curso.Id_Curso || '');

      const resp = await this.CursoService.subirImagen(formData);
      if(resp && (resp.success === true || resp.success === 'true') && resp.url){
        this.Curso.Imagen = encodeURI(resp.url);
      }else{
        Swal.fire(resp?.message || 'Error al subir la imagen del curso');
        return false;
      }
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
      this.imagenCursoFile = null;
      this.imagenCursoPreview = null;
    }
    return true;

  }
  cancel(){
    this.edit = false;
    this.imagenCursoFile = null;
    this.imagenCursoPreview = null;
  }

  handleImagenCursoInput(event: Event){
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];

    if(!file){
      this.imagenCursoFile = null;
      this.imagenCursoPreview = null;
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const extensionesValidas = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const tiposValidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if(!extensionesValidas.includes(extension || '') || !tiposValidos.includes(file.type)){
      Swal.fire('Solo se permiten imagenes JPG, PNG, WEBP o GIF');
      input.value = '';
      return;
    }

    this.imagenCursoFile = file;
    this.imagenCursoPreview = URL.createObjectURL(file);
  }

  limpiarImagenCurso(){
    this.Curso.Imagen = '';
    this.imagenCursoFile = null;
    this.imagenCursoPreview = null;
  }

  getImagenCurso(Curso?: any){
    const imagen = this.imagenCursoPreview || Curso?.Imagen || '';
    if(!imagen){
      return this.imagenCursoDefault;
    }
    if(imagen.startsWith('http') || imagen.startsWith('assets/')){
      return imagen;
    }
    return 'https://usantana.com' + (imagen.startsWith('/') ? imagen : '/' + imagen);
  }

  usarImagenCursoDefault(event: Event){
    const img = event.target as HTMLImageElement;
    img.src = this.imagenCursoDefault;
  }

}
