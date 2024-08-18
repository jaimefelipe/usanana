import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CompanyService } from '../../../../../../main/src/app/general/company/company.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.css']
})
export class FullComponent implements OnInit {
  hideMenu = true;
  logedIn = false;
  MenuRestaurante = false;
  Empresa = localStorage.getItem("Empresa")
  ambiente = false;
  pedidosButton = false;
  cocinaButton = false;
  facturarButton = false;
  AppCaja = false;
  AppCocina = false;
  AppPedido = false;
  SeguridadStr:any = '';
  Seguridad = [];
  
  
  ngOnInit() {
    //Cargar los sistemas a los que se esta asociado.
    this.SeguridadStr = localStorage.getItem("ToxoSG");
    if(this.SeguridadStr == ""){
      this.SeguridadStr = "0.0.0.0.0.0.0.0.0.0.0";
    }

    this.Seguridad = this.SeguridadStr.split(".");
    this.loadHomeMenuIdentifier();
    
  }
  async loadHomeMenuIdentifier(){
    if(localStorage.getItem('ambiente') == 'Dev'){
      this.ambiente = false;
      this.hideMenu = true;
      this.MenuRestaurante = false;
    }else{

      this.ambiente = true;
      if (localStorage.getItem('isLoggedin') == 'true'){
        //let menu = await this.companyService.loadHomeMenuIndicator(localStorage.getItem('Id_Empresa'));
        let menu =[];
        if(menu['data'][0]['Show_Home_Menu'] == ''){
          this.hideMenu = true;
          this.MenuRestaurante  = false;
          this.ambiente = true;

        }else{
          this.ambiente = false;
          this.hideMenu = false;
          this.MenuRestaurante  = true;
          //Determinar Cual menu mostrarle al usuario
          let UserMenu = JSON.parse(localStorage.getItem("TUM"));
          //Recorre las Opciones del Menu
          for (let menu of UserMenu) {
            if(menu['Id_App']==3075){this.AppCaja=true}
            if(menu['Id_App']==3074){this.AppCocina=true}
            if(menu['Id_App']==3076){this.AppPedido=true}

          }
        }
      }
    }
  }
  async loadButtonOptions(){

  }



}
