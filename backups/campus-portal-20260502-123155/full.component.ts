import { Component, OnInit } from '@angular/core';
import { FullService } from './full.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.css']
})
export class FullComponent implements OnInit {
  
  constructor(
    private fullService:FullService,
    private route:Router
  ) { }
  
   nombre = '';

  cursosActivos = [];
  readonly imagenCursoDefault = 'assets/estudiante-docente.png';

  ngOnInit() {
    //Determinar si ya se hizo login si no se ha hecho ir a la pantalla de login
    if(this.tieneSesionCampus()){
      this.nombre = localStorage.getItem('Nombre') || '';
      this.CargarCursosUsuario();
    }else{
      this.route.navigate(['/login']);
    }
    
  }
  async CargarCursosUsuario(){
    let data = await this.fullService.CargarCursosUsuario();
    this.cursosActivos = data?.['data'] || [];
    console.log(data);
  }

  private tieneSesionCampus(){
    const tieneIdentidad = !!localStorage.getItem('Id_Empresa') && !!localStorage.getItem('Id_Usuario');
    if(tieneIdentidad && localStorage.getItem('isLoggedin') !== 'true'){
      localStorage.setItem('isLoggedin', 'true');
    }
    return tieneIdentidad;
  }
  entrarCurso(Id_Curso,Event){
    //Almacenar el curso Activo en la ram
    localStorage.setItem('Id_Curso',Id_Curso);
    //Cargar pantalla de cursos
    this.route.navigate(['/curso']);
  }

  getImagenCurso(curso: any){
    const imagen = curso?.Imagen || '';
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
