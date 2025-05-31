import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  constructor(
    private apiService: ApiService
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
  AppCG = false;
  AppBA = false;
  AppCompras = false;
  AppRestaurante = false;
  AppConta = false;
  AppTransportes = false;
  AppTurismo = false;
  AppHospedaje = false;
  AppPersona = false;
  AppAcademico = false;
  AppSistemas = false;
  AppPOV = false;

  UserMenu = [];
  perfilMenu = false;
  sistemasMenu = false;
  seguridadMenu = false;

  deferredPrompt: any;
  showButton = true;
  configClass = 'fa fa-arrow-right';
  sistemasClass = 'fa fa-arrow-right';
  seguridadClass = 'fa fa-arrow-right';

  //Obtener los Datos del Usuario
  //Si No hay Datos, Entonces usar menu de ventas.


  ngOnInit(): void {
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
    this.SeguridadStr = localStorage.getItem("ToxoSG");
    console.log(this.SeguridadStr)
    if(!this.SeguridadStr){
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
  hideMenu(id?){
    this.showMenu = false;
    if(id ==1){
      window.open('/factura','_self');
    }
    if(id ==2){
      window.open('/pov','_self');
    }
    if(id ==3){
      window.open('/restaurante','_self');
    }
    if(id ==4){
      window.open('/transporte','_self');
    }
    if(id ==5){
      window.open('/viajes','_self');
    }
    if(id ==6){
      window.open('/conta','_self');
    }
  }
  click(){
    this.showMenu = !this.showMenu;
  }
  clickSistemasMenu(){
    this.sistemasMenu = !this.sistemasMenu;
    if(this.sistemasClass == 'fa fa-arrow-left'){
      this.sistemasClass = 'fa fa-arrow-right';
    }else{
      this.sistemasClass = 'fa fa-arrow-left';
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

  clickPerfilMenu(){
    this.perfilMenu = !this.perfilMenu;
    if(this.configClass == 'fa fa-arrow-left'){
      this.configClass = 'fa fa-arrow-right';
    }else{
      this.configClass = 'fa fa-arrow-left';
    }
  }

  logOut(){
    localStorage.setItem('isLoggedin','false');
    localStorage.removeItem('Id_Empresa');
    localStorage.removeItem('Id_Usuario');
    localStorage.removeItem('Empresa');
    localStorage.removeItem('Nombre_Usuario');
    localStorage.removeItem('Nombre');
    localStorage.removeItem('ToxoSG');
    localStorage.removeItem('ToxoMT'); 
    localStorage.removeItem('TII'); 
    localStorage.removeItem('Id_Caja_Diaria');
    localStorage.removeItem('Id_Caja');
    
    window.location.href = '/main'; 
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
       /*
        0. Ventas
        1. Compras
        2. Inventario
        3. CXC
        4. CXP
        5. CG
        6. BA
        7. Restaurante
        8. Transporte
        9. Seguridad
        10. Hospedaje
        11. Turismo
        */
      if(this.Seguridad[0]==1){this.AppVentas=true}
      if(this.Seguridad[1]==1){this.AppCompras=true}
      if(this.Seguridad[2]==1){this.AppInventario=true}
      if(this.Seguridad[3]==1){this.AppCxC=true}
      if(this.Seguridad[4]==1){this.AppCxP=true}
      if(this.Seguridad[5]==1){this.AppCG=true}
      if(this.Seguridad[6]==1){this.AppBA=true}
      if(this.Seguridad[7]==1){this.AppRestaurante=true}
      if(this.Seguridad[8]==1){this.AppTransportes=true}
      if(this.Seguridad[9]==1){this.AppSeguridad=true}
      if(this.Seguridad[10]==1){this.AppHospedaje=true}
      if(this.Seguridad[11]==1){this.AppTurismo=true}
      if(this.Seguridad[12]==1){this.AppAcademico=true}
      if(this.Seguridad[13]==1){this.AppPOV=true}
      if(this.Seguridad[14]==1){this.AppPersona=true}
      //jaime
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
      this.AppSeguridad=true;
      this.AppSistemas = true;
    }
    this.AppSistemas = true;
  }
}
