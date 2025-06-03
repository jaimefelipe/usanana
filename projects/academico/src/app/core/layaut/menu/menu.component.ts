import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
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
  
  UserMenu = [];
  perfilMenu = false;
  AcademicoMenu = false;
  TesoreriaMenu = false;
  ProfesorMenu = false;
  AlumnoMenu = false;

  deferredPrompt: any;
  showButton = true;
  ConfigClass = 'fa fa-arrow-right';
  AcademicoClass = 'fa fa-arrow-right';
  TesoreriaClass = 'fa fa-arrow-right';
  ProfesorClass = 'fa fa-arrow-right';
  AlumnoClass = 'fa fa-arrow-right';

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
    if(this.ConfigClass == 'fa fa-arrow-left'){
      this.ConfigClass = 'fa fa-arrow-right';
    }else{
      this.ConfigClass = 'fa fa-arrow-left';
    }
  }
  clickAcademicoMenu(){
    this.AcademicoMenu = !this.AcademicoMenu;
    if(this.AcademicoClass == 'fa fa-arrow-left'){
      this.AcademicoClass = 'fa fa-arrow-right';
    }else{
      this.AcademicoClass = 'fa fa-arrow-left';
    }
  }
  clickTesoreriaMenu(){
    this.TesoreriaMenu = !this.TesoreriaMenu;
    if(this.TesoreriaClass == 'fa fa-arrow-left'){
      this.TesoreriaClass = 'fa fa-arrow-right';
    }else{
      this.TesoreriaClass = 'fa fa-arrow-left';
    }
  }
  clickProfesorMenu(){
    this.ProfesorMenu = !this.ProfesorMenu;
    if(this.ProfesorClass == 'fa fa-arrow-left'){
      this.ProfesorClass = 'fa fa-arrow-right';
    }else{
      this.ProfesorClass = 'fa fa-arrow-left';
    }
  }
  clickAlumnoMenu(){
    this.AlumnoMenu = !this.AlumnoMenu;
    if(this.AlumnoClass == 'fa fa-arrow-left'){
      this.AlumnoClass = 'fa fa-arrow-right';
    }else{
      this.AlumnoClass = 'fa fa-arrow-left';
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
