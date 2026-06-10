import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

type SectionKey = 'config' | 'registro' | 'tesoreria' | 'profesor' | 'alumno';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }
  @Input() collapsed = false;
  @Input() mobile = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  ambiente = '';
  logedIn = false;
  Company = localStorage.getItem("Id_Empresa");
  User = localStorage.getItem("Nombre_Usuario");
  SeguridadStr = localStorage.getItem("ToxoSG");
  Master = false;
  Seguridad = [];
  
  UserMenu = [];
  sectionState: Record<SectionKey, boolean> = {
    config: false,
    registro: false,
    tesoreria: false,
    profesor: false,
    alumno: false
  };

  deferredPrompt: any;
  showButton = true;

  //Obtener los Datos del Usuario
  //Si No hay Datos, Entonces usar menu de ventas.


  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedin') === 'true';
    if (!isLoggedIn) {
      const pathParts = window.location.pathname.split('/');
      const currentRoute = pathParts[2] || '';
      const allowedRoutes = new Set(['login', 'signup', 'cambiar', 'primeringreso']);
      if (!allowedRoutes.has(currentRoute)) {
        this.router.navigate(['/login']);
        return;
      }
    }
    if(localStorage.getItem('ambiente') == 'Dev'){
      this.ambiente = 'Mantenimiento';
    }else{
      this.ambiente = '';
    }
    //Cargar las obciones de seguridad del Usuario
    this.loadUserMenu();
    if(localStorage.getItem("ToxoMT") == '1'){
      this.Master = true;
    }else{
      this.Master = false;
    }
    if(this.SeguridadStr == ""){
      this.SeguridadStr = "0.0.0.0.0.0.0.0.0.0.0";
    }
    this.Seguridad = this.SeguridadStr.split(".");
    if(localStorage.getItem('isLoggedin') == "true") {
      this.logedIn = true;
    }
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });

  }
  toggleSection(event: Event, key: SectionKey) {
    event.preventDefault();
    this.sectionState[key] = !this.sectionState[key];
  }

  chevron(open: boolean): string {
    return open ? 'v' : '>';
  }

  onNavClick(event: Event): void {
    if (!this.mobile) return;
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const isToggle = target.closest('[data-toggle="menu"]');
    const link = target.closest('a');
    if (link && !isToggle) {
      this.toggleSidebar.emit();
    }
  }
 
  logOut(){
    localStorage.setItem('isLoggedin','false');
    localStorage.removeItem('Id_Empresa');
    localStorage.removeItem('Id_Usuario');
    localStorage.removeItem('Nombre_Usuario');
    localStorage.removeItem('Nombre');
    window.location.href = '/';
  }

  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    this.showButton = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

  //Leer los Menus a que tiene acceso el usuario
  async loadUserMenu(){
    let sqlConfig = {
      table: 'Seg_Usuario_Grupo inner join App_Grupo on Seg_Usuario_Grupo.Id_Grupo = App_Grupo.ID_Grupo inner join App on App_Grupo.Id_App = App.Id_App',
      fields: 'App_Grupo.Id_App,App_Grupo.Estado,Editar,Agregar,App.Principal,App.Padre',
      orderField: '',
      where: 'Id_Usuario = '+localStorage.getItem('Id_Usuario')+' and App_Grupo.Estado = 1'
    }
    let data =  await this.apiService.executeSqlSyn(sqlConfig);
    if(data['total']>0){
      this.UserMenu = data['data'];
      localStorage.setItem('TUM',JSON.stringify(this.UserMenu));
    }else{
      this.UserMenu = [];
    }
    this.activateMenuOptions();
    //Recorrer las opciones del Usuario y habilidar o desabilidar las obciones del menu
  }
  async activateMenuOptions(){
  
  }
}
