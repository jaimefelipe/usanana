import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private route:Router
  ) { }
  ambiente = '';
  logedIn = false;
  showMenu = false;
  Company = localStorage.getItem("Id_Empresa");
  User = localStorage.getItem("Nombre_Usuario");
  SeguridadStr = localStorage.getItem("ToxoSG");
  Master = false;
  Seguridad = [];
  AppServices = false;
  AppConfiguracion = false;
  AppInventario = false;
  AppSeguridad = false;  
  AppVentas = false;
  AppCxC = false;
  AppCompras = false;
  AppRestaurante = false;
  AppConta = false;
  AppTransportes = false;
  AppTurismo = false;
  AppHospedaje = false;
  AppPersona = false;
  AppPOV = false;
  inventarioMenu = false;
  comprasMenu = false;
  

  UserMenu = [];
  ventasMenu = false;


  deferredPrompt: any;
  showButton = true;
  ventasClass = 'fa fa-arrow-right';
  inventarioClass = 'fa fa-arrow-right';
  comprasClass = 'fa fa-arrow-right';
  

  //Obtener los Datos del Usuario
  //Si No hay Datos, Entonces usar menu de ventas.


  ngOnInit(): void {
    //Verificar Login
    localStorage.setItem('ToxoPOV','1');
    if(localStorage.getItem('isLoggedin') == 'false'){
      let arrlocation = window.location.pathname.split('/');
      if(arrlocation[2] !== 'login'){
        this.route.navigate(['login']);
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
      this.SeguridadStr = "0.0.0.0.0.0.0.0.0.0.0.0";
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
  hideMenu(){
    this.showMenu = false;
  }
  click(){
    this.showMenu = !this.showMenu;
  }

  clickVentasMenu(){
    this.ventasMenu = !this.ventasMenu;
    if(this.ventasClass == 'fa fa-arrow-left'){
      this.ventasClass = 'fa fa-arrow-right';
    }else{
      this.ventasClass = 'fa fa-arrow-left';
    }
  }
  clickInventarioMenu(){
    this.inventarioMenu = !this.inventarioMenu;
    if(this.inventarioClass == 'fa fa-arrow-left'){
      this.inventarioClass = 'fa fa-arrow-right';
    }else{
      this.inventarioClass = 'fa fa-arrow-left';
    }
  }
  
  clickComprasMenu(){
    this.comprasMenu = !this.comprasMenu;
    if(this.comprasClass == 'fa fa-arrow-left'){
      this.comprasClass = 'fa fa-arrow-right';
    }else{
      this.comprasClass = 'fa fa-arrow-left';
    }
  }

  logOut(){
    localStorage.setItem('isLoggedin','false');
    localStorage.removeItem('Id_Empresa');
    localStorage.removeItem('Id_Usuario');
    localStorage.removeItem('Nombre_Usuario');
    localStorage.removeItem('Nombre');
    window.location.href = '/pov/';
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
    if(this.UserMenu.length > 0){
      //Opción para cuando el Sistema de Seguridad Esta Activo
      for (let menu of this.UserMenu) {
        if(menu['Id_App']==1){this.AppConfiguracion=true}
        if(menu['Id_App']==3){this.AppSeguridad=true}
        if(menu['Id_App']==10){this.AppInventario=true}
        if(menu['Id_App']==12){this.AppVentas=true}
        //if(menu['Id_App']==15){this.AppEducacion=true}
        //if(menu['Id_App']==18){this.AppContactos=true}
        if(menu['Id_App']==15){this.AppConta=true}
        if(menu['Id_App']==30){this.AppCompras=true}
        if(menu['Id_App']==1035){this.AppRestaurante=true}
        if(menu['Id_App']==1039){this.AppCxC=true}
      }
    }else{
      //Opciones para Cuando El Sistema de this.Seguridad No esta Activo
      if(this.Seguridad[13]==1){
        this.AppPOV=true;
        this.AppVentas = true 
      }
      if(this.Seguridad[2]==1){this.AppInventario=true}
      if(this.Seguridad[1]==1){this.AppCompras=true}
      //Opciones del Usuario maestro
      if(localStorage.getItem('ToxoMT') == '1'){
        this.AppPOV=true
        this.AppVentas = true

      }
    }
    //this.AppSeguridad=true
    if(this.Master){
      this.AppPOV
    }
  }
}
