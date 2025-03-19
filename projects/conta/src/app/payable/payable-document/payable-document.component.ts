import { PayableDocumentService } from './payable-document.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/src/public-api';

import { NgbDateFRParserFormatter } from './../../_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { AccountPayableService } from '../account-payable/account-payable.service';
import { CatalogoContableService } from '../../accountant/catalogo-contable/catalogo-contable.service';
import Swal from 'sweetalert2';
//import { CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-payable-document',
  templateUrl: './payable-document.component.html',
  styleUrls: ['./payable-document.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class PayableDocumentComponent implements OnInit {

  constructor(
    private payableDocumentService:PayableDocumentService,
    private accountPayableService:AccountPayableService,
    private apiService:ApiService,
    private catalogoContableService:CatalogoContableService
    //private currencyPipe : CurrencyPipe
  ) { }
  PantallaCuentas = false;
  ListaDetalles = '';
  PantallaCuentasHijas = false;
  tipoCambio = {
    compra: "",
    venta: "",
    fecha: "",
  };
  hoy = new Date();
  edit = false;
  searchField = "";
  searchFieldAccounts = "";
  searchFieldHijas = "";
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  Documents = [];
  Accounts = [];
  Detalles = [];
  Hijas = [];
  Documento = {
    Id_Documento: '',
    Id_Tipo_Documento: '1',
    Id_Cuenta: '',
    Nombre_Cuenta: '',
    Fecha:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Fecha_Doc:'',
    Plazo:'',
    Fecha_v:'',
    Fecha_Vencimiento:'',
    Documento: '',
    Moneda: '1',
    Monto: '0',
    Monto_Otra_Moneda: 0,
    Saldo: '0',
    Nombre: '',
    Estado: '1',
    Tipo_Cambio:'',
    Total_Detalles:'0'
  }
  Detalle = {
    Id_Documento_Detalle:'',
    Id_Documento:'',
    Cuenta:'',
    Detalle:'',
    Monto:'0'
  }

  ngOnInit(): void {
    this.loadDocuments();
    this.obtenerTC();
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
  search() {
    this.loadDocuments(this.searchField);
  }
  keytab(event) {
    if (event.key === "Enter") {
      this.search();
    }
  }
  ChangePage(action) {
    if (action == 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion.FirstRow < 50) {
        this.paginacion.FirstRow = 1;
        this.paginacion.LastRow = 50;
      } else {
        this.paginacion.FirstRow = this.paginacion.FirstRow - 50;
        this.paginacion.LastRow = this.paginacion.LastRow - 50;
      }
    }
    if (action == 2) {
      this.paginacion.FirstRow = this.paginacion.FirstRow + 50;
      this.paginacion.LastRow = this.paginacion.LastRow + 50;
    }
    this.loadDocuments(this.searchField);
  }
  async loadDocuments(search?){
    let data = await this.payableDocumentService.loadDocuments(this.paginacion,search);
    if (data["total"] == 0) {
      this.Documents = [];
    } else {
      this.Documents = data["data"];
    }
  }
  async editRecord(Documento) {
    this.edit = true;
    if(Documento){
      this.Documento.Id_Documento = Documento.Id_Documento;
      await this.loadDocument();
    }else{
      this.Detalles = [];
      this.Documento = {
        Id_Documento: '',
        Id_Tipo_Documento: '1',
        Id_Cuenta: '',
        Nombre_Cuenta: '',
        Fecha:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Fecha_Doc: '',
        Plazo:'',
        Fecha_v:'',
        Fecha_Vencimiento:'',
        Documento: '',
        Moneda: '1',
        Monto: '0',
        Monto_Otra_Moneda: 0,
        Saldo: '0',
        Nombre: '',
        Estado: '1',
        Tipo_Cambio:'',
        Total_Detalles:'0'
      }
      this.Documento.Tipo_Cambio = this.tipoCambio.venta;
    }
    this.Documento.Fecha_Doc = this.Documento.Fecha.day + '/' + this.Documento.Fecha.month + '/' + this.Documento.Fecha.year;
  }
  async loadDocument(){
    this.Detalles = [];
    let data = await this.payableDocumentService.loadDocument(this.Documento.Id_Documento);
    if(data['total']==1){
      this.Documento = data['data'][0];
      let fechaArr = data['data'][0]['Fecha'].split('-');
      this.Documento.Fecha = {
        month: parseInt(fechaArr[1]),
        day: parseInt(fechaArr[2]),
        year: parseInt(fechaArr[0]),
      }
      this.Documento.Fecha_Doc = this.Documento.Fecha.day + '/' + this.Documento.Fecha.month + '/' + this.Documento.Fecha.year;
      if(this.Documento.Tipo_Cambio == ''){
        this.Documento.Tipo_Cambio = this.tipoCambio.venta;
      }
      this.calcularVencimiento();
    }
    data = await this.payableDocumentService.loadDetails(this.Documento.Id_Documento);
    if(data['total'] > 0){
      this.Detalles = data['data'];
      this.calcularTotales();
      /*
      let total = 0
      for (let i = 0; i < this.Detalles.length; i++) {
        total = total + parseFloat(this.Detalles[i]['Total']);
      }
      this.Documento.Total_Detalles = total.toString()  ;
      */
    }
  }
  async grabar(){
    this.Documento.Fecha_Doc = this.Documento.Fecha.year + '-' + this.Documento.Fecha.month + '-' + this.Documento.Fecha.day ;
    await this.calcularTotales();
    if(this.Documento.Id_Cuenta == ""){
      Swal.fire('Favor Seleccionar una cuenta por cobrar');
      return false;
    }
    if(this.Documento.Documento == ""){
      Swal.fire('Favor Suministrar el Número de Documento');
      return false;
    }
    if(this.Documento.Nombre == ""){
      Swal.fire('Favor Suministrar el Detalle de la Transacción');
      return false;
    }
    if(parseFloat(this.Documento.Monto) != parseFloat(this.Documento.Total_Detalles)){
      Swal.fire('El total de los detalles debe ser igual al monto del Documento');
      return false;
    }
    if(this.Documento.Saldo == '0' ){
      this.Documento.Saldo = this.Documento.Monto
    }
    let data:any;
    if(this.Documento.Id_Documento == ""){
      data = await this.payableDocumentService.newDocument(this.Documento);
      this.Documento.Id_Documento = data["data"][0]["Identity"];
    }else{
      data = await this.payableDocumentService.updateDocument(this.Documento);
    }
    if(data['success'] =='true'){
      //Grabar los detalles
      await this.grabarDetalles()
      //Swal.fire('Categoria grabada correctamente');
      this.applyDocument();
      this.loadDocuments(this.searchField);
      this.edit = false;
    }
    return true;
  }
  async grabarDetalles(){
    this.ListaDetalles = '';
    for (let i = 0; i < this.Detalles.length; i++) {
      await this.grabarUnDetalle(i)
    }
    this.borrarDetalles();
  }
  async borrarDetalles(){
    await this.payableDocumentService.deleteDetails(this.Documento.Id_Documento,this.ListaDetalles);
  }
  async grabarUnDetalle(i){
    if(this.Detalles[i].Id_Documento_Detalle == ''){
      await this.InsertarDetalle(i);
    }else{
      await this.UpdateDetalle(i);
    }
  }
  async InsertarDetalle(i){
    let data = await this.payableDocumentService.newDetail(this.Detalles[i],this.Documento.Id_Documento);
    this.Detalles[i].Id_Documento_Detalle = data["data"][0]["Identity"];
    if(i > 0){
      this.ListaDetalles = this.ListaDetalles + ',';
    }
    this.ListaDetalles = this.ListaDetalles + String(data['data'][0]['Identity']);
  }
  async UpdateDetalle(i){
    await this.payableDocumentService.UpdateDetail(this.Detalles[i]);
    if(i > 0){
      this.ListaDetalles = this.ListaDetalles + ',';
    }
    this.ListaDetalles = this.ListaDetalles + String(this.Detalles[i]['Id_Documento_Detalle']);
  }
  async applyDocument(){
    if(this.Documento.Estado == '1'){
      //Aplicar el documento
      Swal.fire({
        title: 'Desea Aplicar el documento?',
        text: 'Si aplica el documento no le podra realizar ninún cambio!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Aplicar el documento!'
      }).then((result) => {
        if (result.value) {
          this.payableDocumentService.aplicarDocumento(this.Documento.Id_Documento);
          this.cancel();
          this.search();
        }
      });
    }
  }
  cancel(){
    this.edit = false;
  }
  openAccountPanel(){
    this.searchAccounts();
    this.PantallaCuentas = true;
  }
  async searchAccounts(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.accountPayableService.loadCentas(paginacion, this.searchFieldAccounts);
    this.Accounts = data['data'];
  }
  async keytabAccounts(event){
    if (event.key === "Enter") {
      this.searchAccounts();
    }
  }
  async closeModal(){
    this.PantallaCuentas = false;
  }
  Seleccionar(account){
    this.Documento.Id_Cuenta = account.Id_Cuenta;
    this.Documento.Nombre_Cuenta = account.Nombre;
    this.Documento.Plazo = account.Plazo;
    this.calcularVencimiento();
    this.closeModal();
  }
  calcularVencimiento(){
    let fecha = new Date(this.Documento.Fecha.month + '/' + this.Documento.Fecha.day + '/' + this.Documento.Fecha.year);
    let Vencimiento = new Date (fecha.getTime() + (parseInt(this.Documento.Plazo) * ((1000 * 60 * 60 * 24))));
    //Calcular Fecha de Vencimiento
    this.Documento.Fecha_Vencimiento = Vencimiento.getFullYear() + '-' + ( Vencimiento.getMonth() + 1) + '-'+ Vencimiento.getDate();
    this.Documento.Fecha_v = Vencimiento.getDate() + '/' + ( Vencimiento.getMonth() + 1) + '/'+ Vencimiento.getFullYear();
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
    //if(this.pantallaCuentas == true){
    //  return false;
    //}
    if (next === "Detalle_Cuenta") {
      if (this.Detalle.Cuenta === "") {
        
        return false;
      }
      this.obtenerCuenta(this.Detalle.Cuenta);
    }
    if(this.Detalle.Monto == '0'){
      this.Detalle.Monto = (parseFloat(this.Documento.Monto) - parseFloat(this.Documento.Total_Detalles)).toString();
    }

    if (next === "Cuenta") {
      if (parseFloat(this.Detalle.Monto) > 0) {
        this.Detalles.push(this.Detalle);
      }else{
        return false;
      }
      this.calcularTotales();
    }

    return true;
  }
  async obtenerCuenta(cuenta:any) {
    let data = await this.catalogoContableService.loadAccountFromCode(cuenta,0);
    if (data['total'] === 0) {
      data = await this.catalogoContableService.loadAccountLike(cuenta,0);
    }
    if (data["total"] == 1) {
      this.Detalle.Cuenta = data["data"][0]['Cuenta'];
      this.Detalle.Detalle = data["data"][0]['Descripcion'];
    } else {
      this.searchFieldHijas = this.Detalle.Cuenta;
      this.openCuentasPanel();
    }
  }
  openCuentasPanel(){
    this.loadHijas(this.searchFieldHijas);
    this.PantallaCuentasHijas = true;
  }
  searchHijas(){
    this.loadHijas(this.searchFieldHijas)
  }
  keytabHijas(event:any){
    if (event.key === 'Enter') {
      this.searchHijas();
    }
  }
  SeleccionarCuenta(Cuenta:any){
    this.Detalle.Cuenta = Cuenta.Cuenta;
    this.Detalle.Detalle = Cuenta.Descripcion;
    document.getElementById('Detalle_Cuenta').focus();
    this.closePantallaHijas();
  }
  closePantallaHijas(){
    this.PantallaCuentasHijas = false;
  }
  async loadHijas(search?:any){
    let data = await this.catalogoContableService.loadParents(this.paginacion,search,0);
    if(data['total'] == 0){
      this.Hijas = [];
    }else{
      this.Hijas = data['data'];
    }
  }
  removerDetalle(index:any){
    this.Detalles.splice(index, 1);
    this.calcularTotales();
  }
  editarDetalle(index:any){
    this.Detalle = this.Detalles[index];
    this.Detalles.splice(index, 1);
  }
  calcularTotales(){
    let TotalDetalles = 0;
    for (let i = 0; i < this.Detalles.length; i++) {
      TotalDetalles = TotalDetalles + parseFloat(this.Detalles[i].Monto);
    }
    this.Documento.Total_Detalles = TotalDetalles.toString();
    // Calcular el Monto de la Otra Moneda.
    let Otra_Moneda = 0;
    if(this.Documento.Moneda == '1'){
       //Colones
      //Otra_Moneda = (parseFloat(this.Documento.Monto) / parseFloat(this.Documento.Tipo_Cambio)).toFixed(5);
      Otra_Moneda = parseFloat(this.Documento.Monto) / parseFloat(this.Documento.Tipo_Cambio);
    }else{
       //Dolares
      Otra_Moneda = parseFloat(this.Documento.Monto) * parseFloat(this.Documento.Tipo_Cambio);
    }
    this.Documento.Monto_Otra_Moneda = Otra_Moneda;
    this.Detalle = {
      Id_Documento_Detalle:'',
      Id_Documento:'',
      Cuenta:'',
      Detalle:'',
      Monto:'0'
    }
    return true;
  }
  imprimir(){
    window.open('https://toxo.work/reportes/cobrar/cxc-documento.php?id='+this.Documento.Id_Documento,'_blank')
  }
}
