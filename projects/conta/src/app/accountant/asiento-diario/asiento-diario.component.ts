import { ApiService } from '../../../../../core/src/app/lib/api.service';
import { Component, OnInit } from '@angular/core';
import { AsientoDiarioService } from './asiento-diario.service';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoContableService } from '../catalogo-contable/catalogo-contable.service';
import { PeriodoContableService } from "../periodo-contable/periodo-contable.service";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-asiento-diario',
  templateUrl: './asiento-diario.component.html',
  styleUrls: ['./asiento-diario.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class AsientoDiarioComponent implements OnInit {

  constructor(private asientoDiarioService:AsientoDiarioService,
    private catalogoContableService:CatalogoContableService,
    private apiService:ApiService,
    private periodoContableService:PeriodoContableService
    ) { }
  PantallaLoading = false;
  edit = false;
  hoy = new Date();
  ListaDetalles = '';
  Fecha =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  tipoCambio = {
    compra: "",
    venta: "",
    fecha: "",
  };
  searchField = '';
  searchFieldHijas = '';
  pantallaCuentas = false;
  PantallaCuentasHijas = false;
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Hijas = [];
  Asientos = [];
  Periodos = [];
  Asiento = {
    Id_Asiento_Contable_Encabezado:'',
    Descripcion:'',
    Documento:'',
    Tipo_Cambio:'',
    Registro_Origen:'',
    Sistema_Origen:'CGE',
    Id_Periodo:'',
    Fecha:this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year,
    Debitos:0,
    Creditos:0,
    Diferencia:0,
    Estado:'0'
  }
  Detalles = [];
  Detalle = {
    Id_Asiento_Contable_Detalle:'',
    Id_Asiento_Contable_Encabezado:'',
    Cuenta:'',
    Moneda:'',
    Detalle_Cuenta:'',
    Documento:'',
    Debe:0,
    Haber:0,
    Debe_Me:0,
    Haber_Me:0
  }
  ngOnInit(): void {
    this.obtenerTC();
    this.loadAsientos();
    this.loadPeriodo();
  }
  async obtenerTC() {
    var fecha =
      this.hoy.getDate() +
      "/" +
      (this.hoy.getMonth() + 1) +
      "/" +
      this.hoy.getFullYear();
    this.tipoCambio = await this.apiService.getObtenerTC(fecha);
  }
  ChangePage(action:any){
    if (action == 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion.FirstRow < 50) {
        this.paginacion.FirstRow = 1;
        this.paginacion.LastRow = 50;
      } else {
        this.paginacion.FirstRow= this.paginacion.FirstRow -50;
        this.paginacion.LastRow= this.paginacion.LastRow -50;
      }
    }
    if (action == 2) {
      this.paginacion.FirstRow = this.paginacion.FirstRow +50;
      this.paginacion.LastRow = this.paginacion.LastRow + 50;
    }
    this.loadAsientos();
  }
  keytab(event:any){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabHijas(event:any){
    if (event.key === 'Enter') {
      this.searchHijas();
    }
  }
  keytab1(event:any, next:any) {
    if (event.key === "Enter") {
      if(next == 'Haber'){
        let value = (<HTMLInputElement>document.getElementById('Debe')).value;
        if(parseFloat(value) !=0){
          next = 'Cuenta';
          this.processAccount(next);
        }
      }
      document.getElementById(next).focus();
      (<HTMLInputElement>document.getElementById(next)).select();
    }
  }
  processAccount(next:any) {
    if(this.pantallaCuentas == true){
      return false;
    }
    if (next === "Detalle_Cuenta") {
      if (this.Detalle.Cuenta === "") {
       
        return false;
      }
      this.obtenerCuenta(this.Detalle.Cuenta);
    }
    if (next === "Cuenta") {
      this.calcularTotales();
    }
    document.getElementById(next).focus();
    (<HTMLInputElement>document.getElementById(next)).select();
    return true;
  }
  async obtenerCuenta(cuenta:any) {
    let data = await this.catalogoContableService.loadAccountFromCode(cuenta,0);
    if (data['total'] === 0) {
      data = await this.catalogoContableService.loadAccountLike(cuenta,0);
    }
    if (data["total"] === 1) {
      this.Detalle.Cuenta = data["data"][0]['Cuenta'];
      this.Detalle.Detalle_Cuenta = data["data"][0]['Descripcion'];
    } else {
      this.searchFieldHijas = this.Detalle.Cuenta;
      this.openCuentasPanel();
      //Abrir la busqueda
      /*
      this.searchFieldProduct = producto;
      this.PantallaProductos = true;
      this.registros = data["data"];
      */
    }
  }
  search(){
    this.loadAsientos(this.searchField);
  }
  searchHijas(){
    this.loadHijas(this.searchFieldHijas)
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   closePantallaHijas(){
    this.PantallaCuentasHijas = false;
  }
   editRecord(Asiento:any){
    this.edit = true;
    if(Asiento){
        this.leerAsientoDiario(Asiento.Id_Asiento_Contable_Encabezado);
    }else{
      this.Asiento = {
        Id_Asiento_Contable_Encabezado:'',
        Descripcion:'',
        Documento:'',
        Tipo_Cambio:'',
        Registro_Origen:'',
        Sistema_Origen:'CGE',
        Id_Periodo:'',
        Fecha:this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year,
        Debitos:0,
        Creditos:0,
        Diferencia:0,
        Estado:'0'
      }
      this.Asiento.Tipo_Cambio = this.tipoCambio.venta;
      this.Detalles = [];
      this.initDetail();
    }
   }
  async leerAsientoDiario(Id_Asiento_Contable_Encabezado:any){
    let data = await this.asientoDiarioService.loadAsientoDiarioEncabezado(Id_Asiento_Contable_Encabezado);
    if(data['total'] == 0){
      this.Asiento = {
        Id_Asiento_Contable_Encabezado:'',
        Descripcion:'',
        Documento:'',
        Tipo_Cambio:'',
        Registro_Origen:'',
        Sistema_Origen:'CGE',
        Id_Periodo:'',
        Fecha:this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year,
        Debitos:0,
        Creditos:0,
        Diferencia:0,
        Estado:'0'
      }
      this.Asiento.Tipo_Cambio = this.tipoCambio.venta;
    }else{
      this.Asiento = data['data'][0];
      let fechaArr = this.Asiento['Fecha'].split('-');
      this.Fecha = {
        month: parseInt(fechaArr[1]),
        day: parseInt(fechaArr[2]),
        year: parseInt(fechaArr[0]),
      }
      let detalles = await this.asientoDiarioService.loadAsientoDiarioDetalle(Id_Asiento_Contable_Encabezado);
      if(detalles['total'] == 0){
        this.Detalles = [];
      }else{
        this.Detalles = detalles['data'];
      }
      if(this.Asiento.Tipo_Cambio == '1.00'){
        this.Asiento.Tipo_Cambio = this.tipoCambio.venta;
      }
    }
  }
  async loadAsientos(search?:any){
    let data = await this.asientoDiarioService.loadAsientos(this.paginacion,search);
    if(data['total'] == 0){
      this.Asientos = [];
    }else{
      this.Asientos = data['data'];
    }
  }
  async loadPeriodo(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.periodoContableService.loadPeriodos(paginacion,'',1);
    if(data['total'] != 0){
      this.Periodos = data['data'];
    }
  }
  async loadHijas(search?:any){
    let data = await this.catalogoContableService.loadParents(this.paginacion,search,0);
    if(data['total'] == 0){
      this.Hijas = [];
    }else{
      this.Hijas = data['data'];
    }
  }

  openCuentasPanel(){
    this.loadHijas(this.searchFieldHijas);
    this.PantallaCuentasHijas = true;
  }
  calcularTotales(){
    if (this.Detalle.Debe > 0 || this.Detalle.Haber > 0) {
      this.Detalles.push(this.Detalle);
    }
    this.Asiento.Creditos = 0;
    this.Asiento.Debitos = 0;
    for (let i = 0; i < this.Detalles.length; i++) {
      //Calcular datos de Moneda extranjera
      //Jaime
      if(parseFloat(this.Detalles[i]['Debe']) > 0){
        this.Detalles[i]['Debe_Me'] = parseFloat(this.Detalles[i]['Debe']) / parseFloat(this.Asiento.Tipo_Cambio);
      }else{
        this.Detalles[i]['Debe_Me'] = '0';
      }
      if(parseFloat(this.Detalles[i]['Haber']) > 0){
        this.Detalles[i]['Haber_Me'] = parseFloat(this.Detalles[i]['Haber']) / parseFloat(this.Asiento.Tipo_Cambio);
      }else{
        this.Detalles[i]['Haber_Me'] = '0';
      }
        //Agregar Validación de Exoneración
      if(!this.Detalles[i]['Debe']){
        this.Detalles[i]['Debe'] = 0;
      }
      if(!this.Detalles[i]['Haber']){
        this.Detalles[i]['Haber'] = 0;
      }
      this.Asiento.Debitos =  this.Asiento.Debitos + parseFloat(this.Detalles[i]['Debe']);
      this.Asiento.Creditos =  this.Asiento.Creditos + parseFloat(this.Detalles[i]['Haber']);
    }
    this.Asiento.Diferencia = this.Asiento.Debitos - this.Asiento.Creditos;
    this.initDetail();
  }
  initDetail(){
    this.Detalle = {
      Id_Asiento_Contable_Detalle:'',
      Id_Asiento_Contable_Encabezado:'',
      Cuenta:'',
      Moneda:'',
      Detalle_Cuenta:'',
      Documento:'',
      Debe:0,
      Haber:0,
      Debe_Me:0,
      Haber_Me:0
    }
  }
  SeleccionarCuenta(Cuenta:any){
    this.Detalle.Cuenta = Cuenta.Cuenta;
    this.Detalle.Detalle_Cuenta = Cuenta.Descripcion;
    document.getElementById('Detalle_Cuenta').focus();
    this.closePantallaHijas();
  }
  removerDetalle(index:any){
    this.Detalles.splice(index, 1);
    this.calcularTotales();
  }
  editarDetalle(index:any){
    this.Detalle = this.Detalles[index];
    this.Detalles.splice(index, 1);
  }
  async aplicarAsiento(){
    this.PantallaLoading = true;
    this.calcularTotales();
    if (!this.Asiento.Id_Periodo) {
      Swal.fire("Debe seleccionar un periodo");
      return false;
    }
    if (this.Detalles.length === 0) {
      Swal.fire("El asiento no tiene detalles");
      return false;
    }
    this.Asiento.Fecha = this.Fecha.year + '-' + this.Fecha.month + '-' +this.Fecha.day;

    if(this.Asiento.Id_Asiento_Contable_Encabezado ==''){
      let data = await this.asientoDiarioService.insertAsientoEncabezado(this.Asiento);
      this.Asiento.Id_Asiento_Contable_Encabezado = data["data"][0]["Identity"];
    }else{
      await this.asientoDiarioService.updateAsientoEncabezado(this.Asiento);
    }
    this.procesarDetalles();

    return true;
  }
  async procesarDetalles(){
    this.ListaDetalles = '';
    for (let i = 0; i < this.Detalles.length; i++) {
      if(this.Detalles[i]['Id_Asiento_Contable_Detalle'] == ''){
         this.Detalles[i]['Id_Asiento_Contable_Encabezado'] = this.Asiento.Id_Asiento_Contable_Encabezado;
          await this.insertDetalle(i);
      }else{
          await this.updateDetalle(i);
      }
    }
    this.BorrarDetalles();
  }
  async updateDetalle(indice:any){
    let data = await this.asientoDiarioService.updateAsientoDetalle(this.Detalles[indice]);
    if(indice > 0){
      this.ListaDetalles = this.ListaDetalles + ',';
    }
    this.ListaDetalles = this.ListaDetalles + String(this.Detalles[indice]['Id_Asiento_Contable_Detalle']);
  }
  async insertDetalle(indice:any){
    let data = await this.asientoDiarioService.insertAsientoDetalle(this.Detalles[indice]);
    this.Detalles[indice]['Id_Asiento_Contable_Detalle'] = data["data"][0]["Identity"];
    if(indice > 0){
      this.ListaDetalles = this.ListaDetalles + ',';
    }
    this.ListaDetalles = this.ListaDetalles + String(data['data'][0]['Identity']);
  }
  async BorrarDetalles(){
    await this.asientoDiarioService.deleteDetails(this.Asiento.Id_Asiento_Contable_Encabezado,this.ListaDetalles);
    Swal.fire("Asiento Actualizado");
    this.loadAsientos();
    this.PantallaLoading = false;
    this.edit = false;
  }
  imprimirAsiento(){
    //window.open('http://ibo.jaimebrenes.com/reportes/contabilidad/cge-asiento-diario.php?id='+this.Asiento.Id_Asiento_Contable_Encabezado,'_blank')
    window.open('https://toxo.work/reportes/contabilidad/cge-asiento-diario.php?id='+this.Asiento.Id_Asiento_Contable_Encabezado,'_blank')
  }
}
