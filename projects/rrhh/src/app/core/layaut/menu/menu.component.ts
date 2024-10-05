import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';
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
  AppSeguridad = false;
  AppRRHH = true;
  EsAPP = false;


  UserMenu = [];
  perfilMenu = false;
  rrhhMenu = false;


  deferredPrompt: any;
  showButton = true;
  configClass = 'fa fa-arrow-right';
  rrhhClass ='fa fa-arrow-right';


  //Obtener los Datos del Usuario
  //Si No hay Datos, Entonces usar menu de ventas.


  ngOnInit(): void {
    let arrlocation = window.location.pathname.split('/');
    if (arrlocation.length == 2){
      this.EsAPP = true;
    }
    if(localStorage.getItem('isLoggedin') == 'false'){
      let arrlocation = window.location.pathname.split('/');
      if(arrlocation[2] !== 'login'){
        this.route.navigate(['login']);
      } 
    }

    localStorage.setItem('bar','3.4.3');
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
  hideMenu(){
    this.showMenu = false;
  }
  click(){
    this.showMenu = !this.showMenu;
  }
 
  clickPerfilMenu(){
    this.perfilMenu = !this.perfilMenu;
    if(this.configClass == 'fa fa-arrow-left'){
      this.configClass = 'fa fa-arrow-right';
    }else{
      this.configClass = 'fa fa-arrow-left';
    }
  }
  clickrrhhMenu(){
    this.rrhhMenu = !this.rrhhMenu;
    if(this.rrhhClass  == 'fa fa-arrow-left'){
      this.rrhhClass = 'fa fa-arrow-right';
    }else{
      this.rrhhClass = 'fa fa-arrow-left';
    }
  }

  logOut(){
    localStorage.setItem('isLoggedin','false');
    localStorage.removeItem('Id_Empresa');
    localStorage.removeItem('Id_Usuario');
    localStorage.removeItem('Nombre_Usuario');
    localStorage.removeItem('Nombre');
    localStorage.removeItem('Id_Caja_Diaria');
    localStorage.removeItem('Id_Caja');
    localStorage.removeItem('ToxoSG');
    localStorage.removeItem('ToxoMT');
    localStorage.removeItem('Empresa');
    if(this.EsAPP){
      window.location.href = "/";
    }else{
      let arrlocation = window.location.pathname.split('/');
      window.location.href = "/"+arrlocation[1]+'/';
    }
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
      }
    }else{
      //Opciones para Cuando El Sistema de this.Seguridad No esta Activo
       //Activar Menus segun el usuario
       //AppCxP
       //AppBA
     
      if(this.Seguridad[8]==1){this.AppServices=true}
      if(this.Seguridad[9]==1){this.AppSeguridad=true}

      //Opciones para todos los usuarios
      this.AppConfiguracion = true;

      //Opciones del Usuario maestro
      if(localStorage.getItem('ToxoMT') == '1'){
        this.AppSeguridad=true
      }
    }
    //this.AppSeguridad=true
    if(this.Master){
      this.AppConfiguracion=true;
      
      this.AppServices = true;
      
    }
  }
}
