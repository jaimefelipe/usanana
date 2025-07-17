import { Component, OnInit , Output, EventEmitter  } from '@angular/core';
import { TitleService } from './title.service';

@Component({
  selector: 'app-app-menu-superior',
  templateUrl: './app-menu-superior.component.html',
  styleUrls: ['./app-menu-superior.component.css']
})
export class AppMenuSuperiorComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  constructor(
    private titleService: TitleService
  ) { }
  titulo = '';
  ngOnInit() {
    this.titleService.tituloActual$.subscribe(titulo => {
      this.titulo = titulo;
    });
  }
  logout(){
    localStorage.setItem('isLoggedin', 'false');
    localStorage.removeItem('Id_Empresa');
    localStorage.removeItem('Id_Usuario');
    localStorage.removeItem('Nombre_Usuario');
    localStorage.removeItem('Nombre');
    localStorage.removeItem('Id_Caja_Diaria');
    localStorage.removeItem('Id_Caja');
    localStorage.removeItem('ToxoSG');
    localStorage.removeItem('ToxoMT');
    localStorage.removeItem('Empresa');

    const arrlocation = window.location.pathname.split('/');
    window.location.href = "/"+arrlocation[1]+'/';
  }
}
