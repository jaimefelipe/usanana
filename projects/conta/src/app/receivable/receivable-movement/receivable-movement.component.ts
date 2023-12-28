import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import { ReceivableMovementService } from './receivable-movement.service';
import { ReceivableDocumentService } from '../receivable-document/receivable-document.service';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BankAccountService } from './../../bank/bank-account/bank-account.service';
//import { CatalogoContableService } from '../../accountant/catalogo-contable/catalogo-contable.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-Receivable-movement',
  templateUrl: './receivable-movement.component.html',
  styleUrls: ['./receivable-movement.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ReceivableMovementComponent implements OnInit {

  constructor(
    private receivableMovementService:ReceivableMovementService,
    private receivableDocumentService:ReceivableDocumentService,
    private apiService:ApiService,
    private bankAccountService:BankAccountService,
    //private catalogoContableService:CatalogoContableService
  ) { }
  PantallaDocumentos = false;
  PantallaCuentasHijas = false;
  tipoCambio = {
    compra: "",
    venta: "",
    fecha: "",
  };
  hoy = new Date();
  edit = false;
  searchField = "";
  searchFieldDocuments = '';
  searchFieldHijas = '';
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  Movements = [];
  Documents = [];
  Hijas = [];
  bankAccountans = [];
  Movement = {
    Id_Movimiento: '',
    Id_Transaccion: '2',
    Id_Documento: '',
    Cuenta_Bancaria:'0',
    Cuenta_Contable:'',
    Nombre_Cuenta: '',
    Nombre_Cuenta_Contable:'',
    Fecha:  {
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Creado_El: '',
    Documento: '',
    Moneda: '1',
    Moneda_Documento:'',
    Monto: '',
    Monto_Otra_Moneda: 0,
    Nombre: '',
    Estado: '1',
    Saldo:'',
    Docu: '',
    Tipo_Cambio:''
  }

  ngOnInit(): void {
    this.loadMovements();
    this.obtenerTC();
    this.loadBankAccounts();
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
    this.loadMovements(this.searchField);
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
    this.loadMovements(this.searchField);
  }
  async loadMovements(search?){
    let data = await this.receivableMovementService.loadMovements(this.paginacion,search);
    if (data["total"] == 0) {
      this.Movements = [];
    } else {
      this.Movements = data["data"];
    }

  }
  async editRecord(Movimiento){
    this.edit = true;
    if(Movimiento){
      this.Movement.Id_Movimiento = Movimiento.Id_Movimiento;
      this.loadMovement();
    }else{
      this.Movement = {
        Id_Movimiento: '',
        Id_Transaccion: '2',
        Id_Documento: '',
        Cuenta_Bancaria:'0',
        Cuenta_Contable:'',
        Nombre_Cuenta: '',
       Nombre_Cuenta_Contable:'',
        Fecha:  {
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Creado_El: '',
        Documento: '',
        Moneda: '1',
        Moneda_Documento:'',
        Monto: '',
        Monto_Otra_Moneda: 0,
        Nombre: '',
        Estado: '1',
        Saldo:'',
        Docu:'',
        Tipo_Cambio:this.tipoCambio.venta
      }
    }
    this.Movement.Creado_El = this.Movement.Fecha.day + '/' + this.Movement.Fecha.month + '/' + this.Movement.Fecha.year;
  }
  async loadMovement(){
    let data = await this.receivableMovementService.loadMovement(this.Movement.Id_Movimiento);
    if(data['total']==1){
      this.Movement = data['data'][0];
      this.Movement.Nombre_Cuenta = '# '+ data['data'][0]['Documento'] + ', ' + data['data'][0]['Cuenta'];
      let fechaArr = data['data'][0]['Fecha'].split('-');
      this.Movement.Fecha = {
        month: parseInt(fechaArr[1]),
        day: parseInt(fechaArr[2]),
        year: parseInt(fechaArr[0]),
      }
      this.Movement.Creado_El = this.Movement.Fecha.day + '/' + this.Movement.Fecha.month + '/' + this.Movement.Fecha.year;
      if (this.Movement.Tipo_Cambio == '' || parseFloat(this.Movement.Tipo_Cambio) == 0){
        this.Movement.Tipo_Cambio = this.tipoCambio.venta;
      }
    }
  }
  async grabar(){
    this.Movement.Creado_El = this.Movement.Fecha.year  + '-' + this.Movement.Fecha.month + '-' + this.Movement.Fecha.day;
    if(!this.Movement.Saldo){
      this.Movement.Saldo = '0';
    }
    // Calcular el Monto de la Otra Moneda.
    let Otra_Moneda = '';
    if(this.Movement.Moneda == '1'){
      //Colones
      Otra_Moneda = (parseFloat(this.Movement.Monto) / parseFloat(this.Movement.Tipo_Cambio)).toFixed(5);
    }else{
      //Dolares
      Otra_Moneda = (parseFloat(this.Movement.Monto) * parseFloat(this.Movement.Tipo_Cambio)).toFixed(5);
    }
    this.Movement.Monto_Otra_Moneda = parseFloat(Otra_Moneda);
    let MontoComparar:any;
    if(this.Movement.Id_Transaccion == '2' || this.Movement.Id_Transaccion == '4' ){
      if(this.Movement.Moneda_Documento == '1'){
        //La Moneda del documento es Colones
        if(this.Movement.Moneda == '1'){
          //la moneda del movimiento es colones
          MontoComparar = this.Movement.Monto;
        }else{
          // La moneda del movimiento es dolares
          MontoComparar = this.Movement.Monto_Otra_Moneda;
        }
      }
      else{
        // La moneda del documento es dolares
        if(this.Movement.Moneda == '1'){
          //la moneda del movimiento es colones
          MontoComparar = this.Movement.Monto_Otra_Moneda;
        }else{
          // La moneda del movimiento es dolares
          MontoComparar = this.Movement.Monto;
        }
      }
       if(MontoComparar > this.Movement.Saldo){
        Swal.fire('El monto que desea aplicar es superior al saldo del Documento, Saldo :' + this.Movement.Saldo);
        return false;
      }
    }
    if(this.Movement.Id_Transaccion == '1'){
      Swal.fire('No se puede registrar un documento desde los movimientos, debe ir al registro de documentos');
      return false;
    }
    if(this.Movement.Id_Documento == ""){
      Swal.fire('Favor Seleccionar una cuenta por cobrar');
      return false;
    }
    if(this.Movement.Documento == ""){
      Swal.fire('Favor Suministrar el Número de Documento');
      return false;
    }
    if(this.Movement.Nombre == ""){
      Swal.fire('Favor Suministrar el Detalle de la Transacción');
      return false;
    }
    let data:any;
    if(this.Movement.Id_Movimiento == ""){
      data = await this.receivableMovementService.newMovement(this.Movement);
      this.Movement.Id_Movimiento = data["data"][0]["Identity"];
    }else{
      data = await this.receivableMovementService.updateMovement(this.Movement);
    }
    if(data['success'] =='true'){
      //Swal.fire('Categoria grabada correctamente');
      this.applyMovement();
      this.loadMovements(this.searchField);
      this.edit = false;
    }
    return true;
  }
  async applyMovement(){
    if(this.Movement.Estado == '1'){
      //Aplicar el documento
      Swal.fire({
        title: 'Desea Aplicar el Movimiento?',
        text: 'Si aplica el movimiento no le podra realizar ninún cambio!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Aplicar el movimiento!'
      }).then((result) => {
        if (result.value) {

          this.receivableMovementService.aplicarMovimiento(this.Movement.Id_Movimiento);
          this.cancel();
          this.search();
        }
      });
    }
  }
  async cancel(){
    this.edit = false;
  }
  openDocumentPanel(){
    this.searchDocuments();
    this.PantallaDocumentos = true;
  }
  async searchDocuments(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.receivableDocumentService.loadDocuments(paginacion, this.searchFieldDocuments);
    this.Documents = data['data'];
  }
  async keytabDocuments(event){
    if (event.key === "Enter") {
      this.searchDocuments();
    }
  }
  closeModal(){
    this.PantallaDocumentos = false;
  }
  Seleccionar(Documento){
    this.Movement.Id_Documento = Documento.Id_Documento;
    this.Movement.Nombre_Cuenta = '# ' + Documento.Documento + ',' + Documento.Cuenta;
    this.Movement.Monto = Documento.Saldo;
    this.Movement.Moneda = Documento.Moneda;
    this.Movement.Moneda_Documento = Documento.Moneda;
    this.Movement.Saldo = Documento.Saldo;
    if(this.Movement.Id_Transaccion == '2'){
      this.Movement.Nombre = 'Abono a Documento #' + Documento.Documento + ', de: ' + Documento.Cuenta;
    }
    this.closeModal();
  }

  async loadBankAccounts(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.bankAccountService.loadAccounts(paginacion,'');
    if(data['success'] == "true"){
      this.bankAccountans = data['data'];
    }else{
      this.bankAccountans = [];
    }
  }

  openCuentasPanel(){
    this.loadHijas(this.searchFieldHijas);
    this.PantallaCuentasHijas = true;
  }
  async loadHijas(search?:any){
    //let data = await this.catalogoContableService.loadParents(this.paginacion,search,0);
    let data = [];
    if(data['total'] == 0){
      this.Hijas = [];
    }else{
      this.Hijas = data['data'];
    }
  }
  searchHijas(){
    this.loadHijas(this.searchFieldHijas)
  }
  SeleccionarCuenta(Cuenta:any){
    this.Movement.Cuenta_Contable = Cuenta.Cuenta;
    this.Movement.Nombre_Cuenta_Contable = Cuenta.Descripcion;
    this.closePantallaHijas();
  }
  closePantallaHijas(){
    this.PantallaCuentasHijas = false;
  }
  keytabHijas(event:any){
    if (event.key === 'Enter') {
      this.searchHijas();
    }
  }
}
