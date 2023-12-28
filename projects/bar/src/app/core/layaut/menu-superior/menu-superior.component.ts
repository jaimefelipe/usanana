import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-superior',
  templateUrl: './menu-superior.component.html',
  styleUrls: ['./menu-superior.component.css']
})
export class MenuSuperiorComponent implements OnInit {

  AppVentas = true;
  AppInventario = true;
  logedIn = false;
  EsAPP = false;
  Master = false;
  Seguridad = [];

  Company = localStorage.getItem("Id_Empresa");
  User = localStorage.getItem("Nombre_Usuario");
  SeguridadStr = localStorage.getItem("ToxoSG");
  constructor() { }


  ngOnInit() {
    let arrlocation = window.location.pathname.split('/');
    if (arrlocation.length == 2){
      this.EsAPP = true;
    }

    localStorage.setItem('bar','3.4.3');
    
    //Cargar las obciones de seguridad del Usuario
    //this.loadUserMenu();
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
  }

  logOut(){
    localStorage.setItem('isLoggedin','false');
    localStorage.removeItem('Id_Empresa');
    localStorage.removeItem('Id_Usuario');
    localStorage.removeItem('Nombre_Usuario');
    localStorage.removeItem('Nombre');
    if(this.EsAPP){
      window.location.href = "/";
    }else{
      let arrlocation = window.location.pathname.split('/');
      window.location.href = "/"+arrlocation[1]+'/';
    }
  }
}
