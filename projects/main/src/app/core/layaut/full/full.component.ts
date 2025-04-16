import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import {Router} from '@angular/router';
//import Swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrl: './full.component.css'
})
export class FullComponent implements OnInit{
  constructor(
    private titleService: Title,
    private metaService: Meta,
    //private companyService:CompanyService,
    private route:Router
  ) { }
  hideMenu = true;
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
      this.SeguridadStr = "0.0.0.0.0.0.0.0.0.0.0.0.0";
    }

    this.Seguridad = this.SeguridadStr.split(".");
    this.loadHomeMenuIdentifier();
    this.titleService.setTitle('Toxo | Sistemas de Gestión de Recursos Empresariales' );
    this.metaService.addTags([
      {name: 'keywords', content: 'Costa Rica, Sistemas, Factura Electronica, Ventas, POS, Inventario, Contabilidad, Planillas, Impuestos'},
      {name: 'description', content: 'Toxo es una empresa de tecerización de servcios tanto tecnológicos como administrativos '}
      //{name: 'robots', content: 'index, follow'}
    ]);
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
  factura(){
    if(this.Seguridad[0] == 0){
      Swal.fire('No tienes acceso al sistema de Facturación, Contacte a soporte');
      return false;
    }
    window.open('/factura/', "_self")
    return true;
  }
  venta(){
    if(this.Seguridad[13] == 0){
      Swal.fire('No tienes acceso al sistema de Ventas, Contacte a soporte');
      return false;
    }
    window.open('/pov/', "_self");
    return true;
  }
  restaurante(){
    if(this.Seguridad[7] == 0){
      Swal.fire('No tienes acceso al sistema de Restaurantes, Contacte a soporte');
      return false;
    }
    window.open('/bar/', "_self");
    return true;
  }
  transporte(){
    if(this.Seguridad[8] == 0){
      Swal.fire('No tienes acceso al sistema de Transporte, Contacte a soporte');
      return false;
    }
    window.open('/transporte/', "_self");
    return true;
  }
  viajes(){
    if(this.Seguridad[10] == 0){
      Swal.fire('No tienes acceso al sistema de Turismo, Contacte a soporte');
      return false;
    }
    window.open('/viajes/', "_self");
    return true;
  }
  conta(){
    if(this.Seguridad[5] == 0){
      Swal.fire('No tienes acceso al sistema de Contabilidad, Contacte a soporte');
      return false;
    }
    window.open('/conta/', "_self");
    return true;
  }
  academico(){
    if(this.Seguridad[13] == 0){
      Swal.fire('No tienes acceso al sistema de Transporte, Contacte a soporte');
      return false;
    }
    window.open('/academico/', "_self");
    return true;
  }
  proyectos(){
    if(this.Seguridad[14] == 0){
      Swal.fire('No tienes acceso al sistema de Proyectos, Contacte a soporte');
      return false;
    }
    window.open('/proyecto/', "_self");
    return true;
  }
}
