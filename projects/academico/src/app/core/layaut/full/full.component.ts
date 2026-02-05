import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CompanyService } from '../../../../../../main/src/app/general/company/company.service';
import {Router} from '@angular/router';
import {
  AcademicoDashboardService,
  AcademicoDashboardKpis
} from '../../services/academico-dashboard.service';


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
    private route:Router,
    private dashboardService: AcademicoDashboardService
  ) { }
  ambiente = false;
  pedidosButton = false;
  cocinaButton = false;
  facturarButton = false;
  AppCaja = false;
  AppCocina = false;
  AppPedido = false;
  logedIn = false;
  kpiLoading = false;

  quickLinks = [
    {
      title: 'Carreras',
      description: 'Gestiona carreras, niveles y requisitos.',
      icon: 'fa-graduation-cap',
      route: '/carrera'
    },
    {
      title: 'Cursos',
      description: 'Administra la oferta academica.',
      icon: 'fa-book',
      route: '/curso'
    },
    {
      title: 'Grupos',
      description: 'Secciones activas por periodo.',
      icon: 'fa-users',
      route: '/grupo'
    },
    {
      title: 'Matricula',
      description: 'Registro de estudiantes.',
      icon: 'fa-id-card',
      route: '/matricula'
    },
    {
      title: 'Aula virtual',
      description: 'Cursos y recursos en linea.',
      icon: 'fa-laptop',
      route: '/aulavirtual'
    },
    {
      title: 'Cobros',
      description: 'Pagos y tesoreria academica.',
      icon: 'fa-money',
      route: '/cobroacademico'
    }
  ];

  kpiCards: Array<{
    key: keyof AcademicoDashboardKpis;
    label: string;
    value: number | null;
    hint: string;
    icon: string;
    tone: 'primary' | 'success' | 'warning' | 'info';
  }> = [
    {
      key: 'carrerasActivas',
      label: 'Carreras activas',
      value: null,
      hint: 'Programas habilitados',
      icon: 'fa-graduation-cap',
      tone: 'success'
    },
    {
      key: 'cursosActivos',
      label: 'Cursos activos',
      value: null,
      hint: 'Oferta disponible',
      icon: 'fa-book',
      tone: 'primary'
    },
    {
      key: 'gruposActivos',
      label: 'Grupos activos',
      value: null,
      hint: 'Secciones en marcha',
      icon: 'fa-users',
      tone: 'info'
    },
    {
      key: 'matriculasPeriodo',
      label: 'Matriculas activas',
      value: null,
      hint: 'Periodo abierto',
      icon: 'fa-id-card',
      tone: 'warning'
    },
    {
      key: 'periodosAbiertos',
      label: 'Periodos abiertos',
      value: null,
      hint: 'Ciclos vigentes',
      icon: 'fa-calendar',
      tone: 'success'
    },
    {
      key: 'aulasActivas',
      label: 'Aulas virtuales',
      value: null,
      hint: 'Cursos en linea',
      icon: 'fa-laptop',
      tone: 'primary'
    }
  ];
  ngOnInit() {
    if(localStorage.getItem('isLoggedin') == "true") {
      this.logedIn = true;
    }
    this.loadHomeMenuIdentifier();
    this.loadKpis();
    this.titleService.setTitle('Toxo | Sistemas de Gestión de Recursos Empresariales' );
    this.metaService.addTags([
      {name: 'keywords', content: 'Costa Rica, Sistemas, Factura Electronica, Ventas, POS, Inventario, Contabilidad, Planillas, Impuestos'},
      {name: 'description', content: 'Toxo es una empresa de tecerización de servcios tanto tecnológicos como administrativos '}
      //{name: 'robots', content: 'index, follow'}
    ]);
  }
  pedidos(){
    this.route.navigate(['pedidorestaurant']);
  }
  facturar(){
    this.route.navigate(['restaurantinvoice']);
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

  async loadKpis() {
    this.kpiLoading = true;
    const values = await this.dashboardService.loadKpis();
    this.kpiCards = this.kpiCards.map((card) => ({
      ...card,
      value: values[card.key] ?? 0
    }));
    this.kpiLoading = false;
  }
  factura(){
    window.open('/factura/','_self')
  }
  venta(){
    window.open('/venta/','_self')
  }
  restaurante(){
    window.open('/restaurante/','_self')
  }
  transporte(){
    window.open('/transporte/','_self')
  }
  viajes(){
    window.open('/viajes/','_self')
  }
  conta(){
    window.open('/conta/','_self')
  }
}
