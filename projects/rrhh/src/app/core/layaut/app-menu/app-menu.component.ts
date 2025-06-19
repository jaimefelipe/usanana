import { Component, OnInit,Input  } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

@Component({
  selector: 'app-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css']
})
export class AppMenuComponent implements OnInit {
   @Input() collapsed = false;
   @Input() mobile: boolean = false;    // 🔥 Esto resuelve el error
   
   ambiente = '';
  logedIn = false;
  Company = localStorage.getItem("Id_Empresa");
  User = localStorage.getItem("Nombre_Usuario");
  SeguridadStr = localStorage.getItem("ToxoSG") || '';
  Master = false;
  Seguridad = [];

  AppServices = false;
  AppConfiguracion = false;
  AppSeguridad = false;
  AppRRHH = true;
  AppPL = true;
  EsAPP = false;

  UserMenu = [];
  perfilMenu = false;
  rrhhMenu = false;
  PLMenu = false;

  rrhhClass = 'fa fa-chevron-down';
  configClass = 'fa fa-chevron-down';
  PLClass = 'fa fa-chevron-down';

  deferredPrompt: any;
  showButton = true;

  constructor(
    private apiService: ApiService,
    private route: Router
  ) {}

  ngOnInit(): void {
    const arrlocation = window.location.pathname.split('/');
    this.EsAPP = arrlocation.length === 2;

    if (localStorage.getItem('isLoggedin') === 'false') {
      if (arrlocation[2] !== 'login') this.route.navigate(['login']);
    }

    localStorage.setItem('bar', '3.4.3');

    this.ambiente = localStorage.getItem('ambiente') === 'Dev' ? 'Mantenimiento' : '';

    if (localStorage.getItem("ToxoMT") === '1') this.Master = true;
    if (!this.SeguridadStr) this.SeguridadStr = "0.0.0.0.0.0.0.0.0.0.0";

    this.Seguridad = this.SeguridadStr.split(".");
    this.logedIn = localStorage.getItem('isLoggedin') === "true";

    this.loadUserMenu();

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  }

  clickPerfilMenu() {
    if (event) event.preventDefault(); // 👈 Evita redirección a home
     if (this.collapsed) this.collapsed = false;
    this.perfilMenu = !this.perfilMenu;
    this.configClass = this.perfilMenu ? 'fa fa-chevron-up' : 'fa fa-chevron-down';
  }

  clickrrhhMenu() {
    if (event) event.preventDefault(); // 👈 Evita redirección a home
    if (this.collapsed) this.collapsed = false;  // 👈 Descolapsar para mostrar submenú
    this.rrhhMenu = !this.rrhhMenu;
    this.rrhhClass = this.rrhhMenu ? 'fa fa-chevron-up' : 'fa fa-chevron-down';
  }

  clickPLMenu() {
    if (event) event.preventDefault(); // 👈 Evita redirección a home
    if (this.collapsed) this.collapsed = false;
    this.PLMenu = !this.PLMenu;
    this.PLClass = this.PLMenu ? 'fa fa-chevron-up' : 'fa fa-chevron-down';
  }

  logOut() {
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
    window.location.href = this.EsAPP ? '/' : `/${arrlocation[1]}/`;
  }

  addToHomeScreen() {
    this.showButton = false;
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choiceResult) => {
      this.deferredPrompt = null;
    });
  }

  async loadUserMenu() {
    const sqlConfig = {
      table: 'Seg_Usuario_Grupo inner join App_Grupo on Seg_Usuario_Grupo.Id_Grupo = App_Grupo.ID_Grupo inner join App on App_Grupo.Id_App = App.Id_App',
      fields: 'App_Grupo.Id_App,App_Grupo.Estado,Editar,Agregar,App.Principal,App.Padre',
      orderField: '',
      where: `Id_Usuario = ${localStorage.getItem('Id_Usuario')} and App_Grupo.Estado = 1`
    };

    const data = await this.apiService.executeSqlSyn(sqlConfig);
    this.UserMenu = data['total'] > 0 ? data['data'] : [];
    localStorage.setItem('TUM', JSON.stringify(this.UserMenu));
    this.activateMenuOptions();
  }

  async activateMenuOptions() {
    if (this.UserMenu.length > 0) {
      for (let menu of this.UserMenu) {
        if (menu['Id_App'] == 1) this.AppConfiguracion = true;
        if (menu['Id_App'] == 3) this.AppSeguridad = true;
      }
    } else {
      if (this.Seguridad[8] == '1') this.AppServices = true;
      if (this.Seguridad[9] == '1') this.AppSeguridad = true;
      this.AppConfiguracion = true;
      if (localStorage.getItem('ToxoMT') === '1') this.AppSeguridad = true;
    }

    if (this.Master) {
      this.AppConfiguracion = true;
      this.AppServices = true;
    }
  }

}
