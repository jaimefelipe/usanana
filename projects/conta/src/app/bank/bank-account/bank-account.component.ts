import { Component, OnInit } from '@angular/core';
import { CatalogoContableService } from '../../accountant/catalogo-contable/catalogo-contable.service';
import { BankAccountService } from './bank-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})
export class BankAccountComponent implements OnInit {

  constructor(
    private catalogoContableService:CatalogoContableService,
    private bankAccountService:BankAccountService
  ) { }
  edit = false;
  searchField = '';
  searchFieldHijas = '';
  PantallaCuentasHijas = false;
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  Accounts = [];
  Hijas = [];
  Account = {
    Id_Cuenta:'',
    Emisor:'',
    Cuenta:'',
    IBAN:'',
    Nombre:'',
    Moneda:'0',
    Cuenta_Contable:'',
    Detalle_Cuenta:'',
    Saldo:'',
    Estado:'1'
  }
  ngOnInit() {
    this.loadAccounts();
  }
  ChangePage(action){
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
    this.loadAccounts();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadAccounts(this.searchField);
  }
  async loadAccounts(search?:any){
    let data = await this.bankAccountService.loadAccounts(this.paginacion,search);
    if (data['total'] == 0) {
      this.Accounts = [];
    } else {
      this.Accounts = data['data'];
    }
  }
  searchHijas() {
    this.loadHijas(this.searchFieldHijas);
  }
  keytabHijas(event: any) {
    if (event.key === 'Enter') {
      this.searchHijas();
    }
  }
  editRecord(Account){
    this.edit = true;
    if (Account){
      this.Account.Id_Cuenta = Account.Id_Cuenta;
      this.loadAcount();
    }else{
      this.Account = {
        Id_Cuenta:'',
        Emisor:'',
        Cuenta:'',
        IBAN:'',
        Nombre:'',
        Moneda:'0',
        Cuenta_Contable:'',
        Detalle_Cuenta:'',
        Saldo:'',
        Estado:'1'
      }
    }
  }
  async loadAcount(){
    let data = await this.bankAccountService.loadAccount(this.Account.Id_Cuenta);
    if (data['total'] == 1) {
      this.Account = data['data'][0];
    }
  }
  async grabar(){
    if (this.Account.Cuenta == '') {
      Swal.fire('Favor Suministrar el numero de la cuenta');
      return false;
    }
    if (this.Account.Nombre == '') {
      Swal.fire('Favor Suministrar el nombre de la cuenta');
      return false;
    }
    if (this.Account.IBAN == '') {
      Swal.fire('Favor Suministrar el IBAN de la cuenta');
      return false;
    }
    let data ={}
    if(this.Account.Id_Cuenta == ''){
      data = await this.bankAccountService.insertAccount(this.Account);
    }else{
      data = await this.bankAccountService.updateAccount(this.Account);
    }
    if (data['success'] == 'true') {
      Swal.fire('Clasificacion grabada correctamente');
      this.loadAccounts(this.searchField);
      this.edit = false;
    }
    return true;
  }
  async cancel(){
    this.edit = false;
  }

  openAccountPanel(){
    this.loadHijas(this.searchFieldHijas);
    this.PantallaCuentasHijas = true;
  }
  async loadHijas(search?:any){
    let data = await this.catalogoContableService.loadParents(this.paginacion,search,0);
    if(data['total'] == 0){
      this.Hijas = [];
    }else{
      this.Hijas = data['data'];
    }
  }
  SeleccionarCuenta(Cuenta:any){
    this.Account.Cuenta_Contable = Cuenta.Cuenta;
    this.Account.Detalle_Cuenta = Cuenta.Descripcion;
    this.closePantallaHijas();
  }
  closePantallaHijas(){
    this.PantallaCuentasHijas = false;
  }
}
