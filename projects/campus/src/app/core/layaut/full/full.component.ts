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
  
   nombre =  localStorage.getItem('Nombre'); // Podés traerlo del servicio de usuario autenticado

  cursosActivos = [];

  ngOnInit() {
    //Determinar si ya se hizo login si no se ha hecho ir a la pantalla de login
    if(localStorage.getItem("isLoggedin") == 'true'){
      this.CargarCursosUsuario();
    }else{
      this.route.navigate(['/login']);
    }
    
  }
  async CargarCursosUsuario(){
    let data = await this.fullService.CargarCursosUsuario();
    this.cursosActivos = data['data'];
    console.log(data);
  }
  entrarCurso(Id_Curso,Event){
    //Almacenar el curso Activo en la ram
    localStorage.setItem('Id_Curso',Id_Curso);
    //Cargar pantalla de cursos
    this.route.navigate(['/curso']);
  }
}
