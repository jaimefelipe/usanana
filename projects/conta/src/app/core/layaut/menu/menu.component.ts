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
  AppCxP = false;
  AppCompras = false;
  AppRestaurante = false;
  AppConta = false;
  AppTransportes = false;
  AppTurismo = false;
  AppHospedaje = false;
  AppBk = false;

  UserMenu = [];
  perfilMenu = false;
  ventasMenu = false;
  inventarioMenu = false;
  comprasMenu = false;
  CxCMenu = false;
  CxPMenu = false;
  BkMenu = false;
  restaurantMenu = false;
  seguridadMenu = false;
  ContaMenu = false;
  ServicesMenu = false;
  TransportesMenu = false;
  TurismoMenu = false;
  HospedajeMenu = false;

  deferredPrompt: any;
  showButton = true;
  configClass = 'fa fa-arrow-right';
  servicesClass = 'fa fa-arrow-right';
  ventasClass = 'fa fa-arrow-right';
  inventarioClass = 'fa fa-arrow-right';
  comprasClass = 'fa fa-arrow-right';
  CxCClass = 'fa fa-arrow-right';
  CxPClass = 'fa fa-arrow-right';
  BkClass = 'fa fa-arrow-right';
  restaurantClass = 'fa fa-arrow-right';
  seguridadClass = 'fa fa-arrow-right';
  ContaClass = 'fa fa-arrow-right';
  transportesClass = 'fa fa-arrow-right';
  turismoClass = 'fa fa-arrow-right';
  hospedajeClass = 'fa fa-arrow-right';

  //Obtener los Datos del Usuario
  //Si No hay Datos, Entonces usar menu de ventas.


  ngOnInit(): void {
    //Verificar Login
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
  clickHospedajeMenu(){
    this.HospedajeMenu = !this.HospedajeMenu;
    if(this.hospedajeClass == 'fa fa-arrow-left'){
      this.hospedajeClass = 'fa fa-arrow-right';
    }else{
      this.hospedajeClass = 'fa fa-arrow-left';
    }
  }
  clickTurismoMenu(){
    this.TurismoMenu = !this.TurismoMenu;
    if(this.turismoClass == 'fa fa-arrow-left'){
      this.turismoClass = 'fa fa-arrow-right';
    }else{
      this.turismoClass = 'fa fa-arrow-left';
    }
  }
  clickTransportesMenu(){
    this.TransportesMenu = !this.TransportesMenu;
    if(this.transportesClass == 'fa fa-arrow-left'){
      this.transportesClass = 'fa fa-arrow-right';
    }else{
      this.transportesClass = 'fa fa-arrow-left';
    }
  }
  clickServicesMenu(){
    this.ServicesMenu = !this.ServicesMenu;
    if(this.servicesClass == 'fa fa-arrow-left'){
      this.servicesClass = 'fa fa-arrow-right';
    }else{
      this.servicesClass = 'fa fa-arrow-left';
    }
  }
  clickContaMenu(){
    this.ContaMenu = !this.ContaMenu;
    if(this.ContaClass == 'fa fa-arrow-left'){
      this.ContaClass = 'fa fa-arrow-right';
    }else{
      this.ContaClass = 'fa fa-arrow-left';
    }
  }
  clickSeguridadMenu(){
    this.seguridadMenu = !this.seguridadMenu;
    if(this.seguridadClass == 'fa fa-arrow-left'){
      this.seguridadClass = 'fa fa-arrow-right';
    }else{
      this.seguridadClass = 'fa fa-arrow-left';
    }
  }
  clickRestaurantMenu(){
    this.restaurantMenu = !this.restaurantMenu;
    if(this.restaurantClass == 'fa fa-arrow-left'){
      this.restaurantClass = 'fa fa-arrow-right';
    }else{
      this.restaurantClass = 'fa fa-arrow-left';
    }
  }
  clickPerfilMenu(){
    this.perfilMenu = !this.perfilMenu;
    if(this.configClass == 'fa fa-arrow-left'){
      this.configClass = 'fa fa-arrow-right';
    }else{
      this.configClass = 'fa fa-arrow-left';
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
  clickVentasMenu(){
    this.ventasMenu = !this.ventasMenu;
    if(this.ventasClass == 'fa fa-arrow-left'){
      this.ventasClass = 'fa fa-arrow-right';
    }else{
      this.ventasClass = 'fa fa-arrow-left';
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
  clickCxCMenu(){
    this.CxCMenu = !this.CxCMenu;
    if(this.CxCClass == 'fa fa-arrow-left'){
      this.CxCClass = 'fa fa-arrow-right';
    }else{
      this.CxCClass = 'fa fa-arrow-left';
    }
  }
  clickCxPMenu(){
    this.CxPMenu = !this.CxPMenu;
    if(this.CxPClass == 'fa fa-arrow-left'){
      this.CxPClass = 'fa fa-arrow-right';
    }else{
      this.CxPClass = 'fa fa-arrow-left';
    }
  }
  clickBkMenu(){
    this.BkMenu = !this.BkMenu;
    if(this.BkClass == 'fa fa-arrow-left'){
      this.BkClass = 'fa fa-arrow-right';
    }else{
      this.BkClass = 'fa fa-arrow-left';
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
       //Activar Menus segun el usuario
       //AppCxP
       //AppBA
      if(this.Seguridad[0]==1){this.AppVentas=true}
      if(this.Seguridad[1]==1){this.AppCompras=true}
      if(this.Seguridad[2]==1){this.AppInventario=true}
      if(this.Seguridad[3]==1){this.AppCxC=true}
      if(this.Seguridad[4]==1){this.AppCxP=true}
      if(this.Seguridad[5]==1){this.AppConta=true}
      if(this.Seguridad[6]==1){this.AppBk=true}
      if(this.Seguridad[7]==1){this.AppRestaurante=true}
      if(this.Seguridad[8]==1){this.AppTransportes=true}
      if(this.Seguridad[8]==1){this.AppServices=true}
      if(this.Seguridad[9]==1){this.AppSeguridad=true}
      if(this.Seguridad[10]==1){this.AppHospedaje=true}
      if(this.Seguridad[11]==1){this.AppTurismo=true}
      //Opciones para todos los usuarios
      this.AppConfiguracion = true;
      this.AppVentas = true;
      this.AppCompras = true;
      this.AppInventario=true;

      //Opciones del Usuario maestro
      if(localStorage.getItem('ToxoMT') == '1'){
        this.AppConta = true;
        this.AppSeguridad=true
      }
    }
    //this.AppSeguridad=true
    if(this.Master){
      this.AppConfiguracion=true;
      this.AppSeguridad=true;
      this.AppInventario=true;
      this.AppVentas=true;
      this.AppConta=true;
      this.AppCompras=true;
      this.AppRestaurante=true;
      this.AppCxC=true;
      this.AppCxP=true;
      this.AppServices = true;
      this.AppTransportes = true;
      this.AppTurismo = true;
      this.AppHospedaje = true;
    }
  }
}
