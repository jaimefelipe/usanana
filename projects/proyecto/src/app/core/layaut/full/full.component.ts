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
  MenuRestaurante = false;
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private companyService:CompanyService,
    private route:Router
  ) { }
  ambiente = false;
  pedidosButton = false;
  cocinaButton = false;
  facturarButton = false;
  AppCaja = false;
  AppCocina = false;
  AppPedido = false;
  ngOnInit() {
    localStorage.setItem('ToxoPOV','1');
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
        let menu = await this.companyService.loadHomeMenuIndicator(localStorage.getItem('Id_Empresa'));
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
  cajas(){
    window.open('/pov/cajaventas/','_self')
  }
  facturar(){
    window.open('/pov/ventas/','_self')
  }
}
