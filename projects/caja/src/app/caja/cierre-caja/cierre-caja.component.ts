import { Component, OnInit } from '@angular/core';
import { CashierService } from '../cashier/cashier.service';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Component({
  selector: 'app-cierre-caja',
  templateUrl: './cierre-caja.component.html',
  styleUrls: ['./cierre-caja.component.css']
})
export class CierreCajaComponent implements OnInit {
  constructor(
    private cashierService:CashierService,
    private apiService:ApiService
  ) { }

  hoy = new Date();

  Id_Caja = '99';
  Id_Caja_Diaria = '99';
  Id_Empresa = localStorage.getItem("Id_Empresa");
  Id_Usuario = localStorage.getItem("Id_Usuario");
  Totales = [];
  Productos = [];
  ProductosPivote = [];
  TotalesActivo = true;
  ProductosActivo = false;
  ProductosActivoPivote = false;
  EntradasActivo = false;
  SalidasActivo = false;

  loading = false;

  TotalesClass = 'text-success tablinks active';
  ProductosClass = '';
  ProductosPivoteClass = '';
  EntradasClass = '';
  SalidasClass = '';
  MensajeLoading = 'Leyendo Cierres';

  Cierres = [];
  Cajas = [];
  Entradas = [];
  Salidas = [];
  fechas: string[] = []; // Se llena dinámicamente al cargar Productos

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  FechaInicio =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  FechaFin =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
  Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;

  ngOnInit(): void {
    this.loadCajas();
    this.loadCierres(this.FechaInicio,this.FechaFin);
  }

  InicioChange(FechaInicio){
    this.loadCierres(FechaInicio,this.FechaFin);
  }
  FinChange(FechaFin){
    this.loadCierres(this.FechaInicio,FechaFin);
  }
  async loadCajas(search?:any){
    let data = await this.cashierService.loadCajas(this.paginacion,search);
    if(data['total'] == 0){
      this.Cajas = [];
    }else{
      this.Cajas = data['data'];
      this.Id_Caja = '99';
      //this.Id_Caja = this.Cajas[0]['Id_Caja'];
    }
  }
  async loadCierres(FechaInicio,FechaFin){
    let Inicio = FechaInicio.day + '/' + FechaInicio.month + '/' + FechaInicio.year;
    let Fin = FechaFin.day + '/' + FechaFin.month + '/' + FechaFin.year;
    if(!this.Id_Caja){
      this.Id_Caja = '99'
    }
    let data = await this.cashierService.CargarCierre(this.Id_Caja,Inicio,Fin);
    if(data['total'] == 0){
      this.Cierres = [];
    }else{
      this.Cierres = data['data'];
      this.Id_Caja_Diaria = '99';
      //this.Id_Caja_Diaria = this.Cierres[0]['Id_Caja_Diaria'];
    }
  }
  activarTotales(){
    this.ProductosActivo = false;
    this.ProductosActivoPivote = false;
    this.TotalesActivo = true;
    this.EntradasActivo = false;
    this.SalidasActivo = false;

    this.TotalesClass = 'text-success tablinks active';
    this.ProductosClass = '';
    this.EntradasClass = '';
    this.SalidasClass = '';
  }
  activarProductos(){
    this.ProductosActivo = true;
    this.ProductosActivoPivote = false;
    this.TotalesActivo = false;
    this.EntradasActivo = false;
    this.SalidasActivo = false;
    this.ProductosClass = 'text-success tablinks active';
    this.TotalesClass = '';
    this.EntradasClass = '';
    this.SalidasClass = '';
  }

  activarProductosPrivote(){
    this.ProductosActivo = false;
    this.ProductosActivoPivote = true;
    this.TotalesActivo = false;
    this.EntradasActivo = false;
    this.SalidasActivo = false;
    this.ProductosClass = 'text-success tablinks active';
    this.TotalesClass = '';
    this.EntradasClass = '';
    this.SalidasClass = '';
  }

  activarEntradas(){
    this.ProductosActivo = false;
    this.ProductosActivoPivote = false;
    this.TotalesActivo = false;
    this.EntradasActivo = true;
    this.SalidasActivo = false;
    this.ProductosClass = '';
    this.TotalesClass = '';
    this.SalidasClass = '';
    this.EntradasClass = 'text-success tablinks active';
  }
  activarSalidas(){
    this.ProductosActivo = false;
    this.ProductosActivoPivote = false;
    this.TotalesActivo = false;
    this.EntradasActivo = false;
    this.SalidasActivo = true;
    this.ProductosClass = '';
    this.TotalesClass = '';
    this.EntradasClass = ''
    this.SalidasClass = 'text-success tablinks active';
  }
  async cargarDatos(){
    this.loading = true;
    await this.cargarTotalesCierre();
    await this.cargarProductosCierre();
    await this.cargarEntradasCierre();
    await this.cargarSalidasCierre();
    await this.cargarProductosPivote();
    this.loading = false;
  }
  async cargarTotalesCierre(){
    let Id_Caja = localStorage.getItem('Id_Caja');
    if(!Id_Caja){
      Id_Caja = '';
    }
    this.Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
    this.Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;
    let param = '1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin + '&c=' + this.Id_Caja + '&cc=' + this.Id_Caja_Diaria;
    let data = await this.apiService.postScript('https://toxo.work/reportes/cajas/totales-cierre2.php',param);
    this.Totales = data['data'];
  }

  async cargarProductosCierre(){
    let Id_Caja = localStorage.getItem('Id_Caja');
    if(!Id_Caja){
      Id_Caja = '';
    }
    this.Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
    this.Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;
    let param = '1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin + '&c=' + this.Id_Caja + '&cc=' + this.Id_Caja_Diaria;
    let data = await this.apiService.postScript('https://toxo.work/reportes/cajas/productos-cierre.php',param);
    this.Productos = data['data'];
  }
  async cargarProductosPivote(){
    let Id_Caja = localStorage.getItem('Id_Caja');
    if(!Id_Caja){
      Id_Caja = '';
    }
    this.Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
    this.Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;
    let param = '1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin + '&c=' + this.Id_Caja + '&cc=' + this.Id_Caja_Diaria;
    let data = await this.apiService.postScript('https://toxo.work/reportes/cajas/productos_cierre_pivot.php',param);
    this.ProductosPivote = data['data'];

    this.ProductosPivote = data.data;

    if (this.Productos.length > 0) {
      // Detectar columnas que son fechas (excluyendo 'Categoria' y 'Producto')
      const keys = Object.keys(this.Productos[0]);
      this.fechas = keys.filter(k => !['Categoria', 'Producto'].includes(k));
    }

  }



  async cargarEntradasCierre(){
    let Id_Caja = localStorage.getItem('Id_Caja');
    if(!Id_Caja){
      Id_Caja = '';
    }
    this.Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
    this.Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;
    let param = '1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin + '&c=' + this.Id_Caja + '&cc=' + this.Id_Caja_Diaria;
    let data = await this.apiService.postScript('https://toxo.work/reportes/cajas/entradas-cierre.php',param);
    this.Entradas = data['data'];
  }
  async cargarSalidasCierre(){
    let Id_Caja = localStorage.getItem('Id_Caja');
    if(!Id_Caja){
      Id_Caja = '';
    }
    this.Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
    this.Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;
    let param = '1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin + '&c=' + this.Id_Caja + '&cc=' + this.Id_Caja_Diaria;
    let data = await this.apiService.postScript('https://toxo.work/reportes/cajas/salidas-cierre.php',param);
    this.Salidas = data['data'];
  }
  esInformeHija(): boolean {
    return this.Totales.length > 0 && this.Totales[0].hasOwnProperty('id');
  }
  
  esInformeMatriz(): boolean {
    return this.Totales.length > 0 && this.Totales[0].hasOwnProperty('Metodo');
  }
  
  // Calculá dinámicamente las columnas (excluyendo 'Metodo')
  get columnasMatriz(): string[] {
    if (!this.esInformeMatriz()) return [];
    const keys = Object.keys(this.Totales[0]);
    return keys.filter(k => k !== 'Metodo');
  }
}
