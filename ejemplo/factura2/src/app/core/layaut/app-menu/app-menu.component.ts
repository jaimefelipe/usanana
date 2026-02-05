import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

@Component({
  selector: 'app-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMenuComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() collapsed = false;
  @Input() mobile: boolean = false;

  ambiente = '';
  logedIn = false;
  Company = localStorage.getItem('Id_Empresa') || '';
  User = localStorage.getItem('Nombre_Usuario') || '';
  SeguridadStr = localStorage.getItem('ToxoSG') || '';
  Master = false;
  Seguridad: string[] = [];

  AppConfiguracion = false;
  AppInventario = false;
  AppVentas = false;
  AppCompras = false;
  AppCxC = false;

  // Estados de submenús
  configuracionMenu = false;
  inventarioMenu = false;
  ventasMenu = false;
  comprasMenu = false;
  CxCMenu = false;

  // (opcionales, por si quieres usarlos en otros lados)
  configClass = 'fa fa-chevron-right';
  inventarioClass = 'fa fa-chevron-right';
  ventasClass = 'fa fa-chevron-right';
  comprasClass = 'fa fa-chevron-right';
  CxCClass = 'fa fa-chevron-right';

  deferredPrompt: any;
  showButton = true;

  UserMenu: any[] = [];
  EsAPP = false;
  appVersion = localStorage.getItem('bar') || '3.4.3';

  constructor(
    private apiService: ApiService,
    private route: Router,
    private cd: ChangeDetectorRef,   // 👈 inyecta CD
  ) {}

  ngOnInit(): void {
    const arrlocation = window.location.pathname.split('/');
    this.EsAPP = arrlocation.length === 2;

    if (localStorage.getItem('isLoggedin') === 'false') {
      if (arrlocation[2] && arrlocation[2] !== 'login') {
        this.route.navigate(['login']);
      }
    }

    localStorage.setItem('bar', this.appVersion);
    this.ambiente = localStorage.getItem('ambiente') === 'Dev' ? 'Mantenimiento' : '';

    if (localStorage.getItem('ToxoMT') === '1') this.Master = true;
    if (!this.SeguridadStr) this.SeguridadStr = '0.0.0.0.0.0.0.0.0.0.0';
    this.Seguridad = this.SeguridadStr.split('.');
    this.logedIn = localStorage.getItem('isLoggedin') === 'true';

    this.loadUserMenu();

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  }

  /** ✅ Único toggle genérico que usa el HTML */
  toggle(e: Event, section: 'config' | 'inventario' | 'ventas' | 'compras' | 'cxc'): void {
    e?.preventDefault();
    if (this.collapsed) this.collapsed = false;

    switch (section) {
      case 'config':
        this.configuracionMenu = !this.configuracionMenu;
        this.configClass = this.configuracionMenu ? 'fa fa-chevron-down' : 'fa fa-chevron-right';
        break;
      case 'inventario':
        this.inventarioMenu = !this.inventarioMenu;
        this.inventarioClass = this.inventarioMenu ? 'fa fa-chevron-down' : 'fa fa-chevron-right';
        break;
      case 'ventas':
        this.ventasMenu = !this.ventasMenu;
        this.ventasClass = this.ventasMenu ? 'fa fa-chevron-down' : 'fa fa-chevron-right';
        break;
      case 'compras':
        this.comprasMenu = !this.comprasMenu;
        this.comprasClass = this.comprasMenu ? 'fa fa-chevron-down' : 'fa fa-chevron-right';
        break;
      case 'cxc':
        this.CxCMenu = !this.CxCMenu;
        this.CxCClass = this.CxCMenu ? 'fa fa-chevron-down' : 'fa fa-chevron-right';
        break;
    }
  }

  /** ✅ Usado por el HTML: muestra chevron acorde al estado */
  chevron(open: boolean): string {
    // down = abierto, right = cerrado
    return open ? 'fa fa-chevron-down' : 'fa fa-chevron-right';
  }

  onNavClick(event: Event): void {
    if (!this.mobile || this.collapsed) return;
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const isToggle = link.getAttribute('role') === 'button' || href === '#';
    if (isToggle) return;
    this.toggleSidebar.emit();
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
    this.deferredPrompt?.prompt();
    this.deferredPrompt?.userChoice.then(() => {
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
    this.UserMenu = data?.['total'] > 0 ? data['data'] : [];
    localStorage.setItem('TUM', JSON.stringify(this.UserMenu));
    this.activateMenuOptions();
    this.cd.detectChanges();   // 👈 fuerza render al terminar la carga
  }

  async activateMenuOptions() {
    this.AppConfiguracion = false;
    this.AppInventario = false;
    this.AppVentas = false;
    this.AppCompras = false;
    this.AppCxC = false;

    if (this.UserMenu.length > 0) {
      for (const menu of this.UserMenu) {
        switch (+menu['Id_App']) {
          case 1: this.AppConfiguracion = true; break;
          case 10: this.AppInventario = true; break;
          case 12: this.AppVentas = true; break;
          case 30: this.AppCompras = true; break;
          case 1039: this.AppCxC = true; break;
        }
      }
    } else {
      const S = (i: number) => (+this.Seguridad[i] === 1);
      if (S(0)) this.AppVentas = true;
      if (S(1)) this.AppCompras = true;
      if (S(2)) this.AppInventario = true;
      if (S(3)) this.AppCxC = true;
      this.AppConfiguracion = true;

      if (localStorage.getItem('ToxoMT') === '1') {
        // extras si ocupa
      }
    }

    if (this.Master) {
      this.AppConfiguracion = true;
      this.AppInventario = true;
      this.AppVentas = true;
      this.AppCompras = true;
      this.AppCxC = true;
    }

    this.cd.detectChanges();   // 👈 asegura que aparezcan de inmediato
  }
}
