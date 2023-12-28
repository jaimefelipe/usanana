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

  AppTurismo = false;
  AppHospedaje = false;
  AppTransporte = false;
  AppTour = false;


  UserMenu = [];
  ConfigMenu = false;
  ItinerarioMenu = false;
  TransporteMenu = false;
  HospedajeMenu = false;
  TourMenu = false;

  deferredPrompt: any;
  showButton = true;

  configClass = 'fa fa-arrow-right';
  itinerarioClass = 'fa fa-arrow-right';
  turismoClass = 'fa fa-arrow-right';
  hospedajeClass = 'fa fa-arrow-right';
  transporteClass = 'fa fa-arrow-right';
  tourClass = 'fa fa-arrow-right';

  //Obtener los Datos del Usuario
  //Si No hay Datos, Entonces usar menu de ventas.


  ngOnInit(): void {
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

  clickConfigMenu(){
    this.ConfigMenu = !this.ConfigMenu;
    if(this.configClass == 'fa fa-arrow-left'){
      this.configClass = 'fa fa-arrow-right';
    }else{
      this.configClass = 'fa fa-arrow-left';
    }
  }
  clickTourMenu(){
    this.TourMenu = !this.TourMenu;
    if(this.tourClass == 'fa fa-arrow-left'){
      this.tourClass = 'fa fa-arrow-right';
    }else{
      this.tourClass = 'fa fa-arrow-left';
    }
  }
  clickHospedajeMenu(){
    this.HospedajeMenu = !this.HospedajeMenu;
    if(this.hospedajeClass == 'fa fa-arrow-left'){
      this.hospedajeClass = 'fa fa-arrow-right';
    }else{
      this.hospedajeClass = 'fa fa-arrow-left';
    }
  }
  clickItinerarioMenu(){
    this.ItinerarioMenu = !this.ItinerarioMenu;
    if(this.itinerarioClass == 'fa fa-arrow-left'){
      this.itinerarioClass = 'fa fa-arrow-right';
    }else{
      this.itinerarioClass = 'fa fa-arrow-left';
    }
  }
  clickTransporteMenu(){
    this.TransporteMenu = !this.TransporteMenu;
    if(this.transporteClass == 'fa fa-arrow-left'){
      this.transporteClass = 'fa fa-arrow-right';
    }else{
      this.transporteClass = 'fa fa-arrow-left';
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
    if(this.UserMenu.length > 0){
      //Opción para cuando el Sistema de Seguridad Esta Activo
      for (let menu of this.UserMenu) {
        /*
        if(menu['Id_App']==1){this.AppConfiguracion=true}
        if(menu['Id_App']==3){this.AppSeguridad=true}
        if(menu['Id_App']==13){this.AppAcademico=true}
        if(menu['Id_App']==12){this.AppVentas=true}
        //if(menu['Id_App']==15){this.AppEducacion=true}
        //if(menu['Id_App']==18){this.AppContactos=true}
        if(menu['Id_App']==15){this.AppConta=true}
        if(menu['Id_App']==30){this.AppCompras=true}
        if(menu['Id_App']==1035){this.AppRestaurante=true}
        if(menu['Id_App']==1039){this.AppCxC=true}
        */
      }
    }else{
      //Opciones para Cuando El Sistema de this.Seguridad No esta Activo
       //Activar Menus segun el usuario
       //AppCxP
       //AppBA
       /*
      if(this.Seguridad[0]==1){this.AppVentas=true}
      if(this.Seguridad[1]==1){this.AppCompras=true}
      if(this.Seguridad[13]==1){this.AppAcademico=true}
      if(this.Seguridad[3]==1){this.AppCxC=true}
      //if(this.Seguridad[4]==1){this.AppCxP=true}
      if(this.Seguridad[5]==1){this.AppConta=true}
      //if(this.Seguridad[6]==1){this.AppBA=true}
      if(this.Seguridad[7]==1){this.AppRestaurante=true}
      if(this.Seguridad[8]==1){this.AppTransportes=true}
      if(this.Seguridad[8]==1){this.AppServices=true}
      if(this.Seguridad[9]==1){this.AppSeguridad=true}
      */
      if(this.Seguridad[10]==1){this.AppHospedaje=true}
      if(this.Seguridad[11]==1){this.AppTurismo=true}
      if(this.Seguridad[11]==1){this.AppTransporte=true}
      //Opciones para todos los usuarios

      //Opciones del Usuario maestro

    }
    //this.AppSeguridad=true
    if(this.Master){
      this.AppTurismo = true;
      this.AppHospedaje = true;
      this.AppTransporte = true;
    }
  }
}
