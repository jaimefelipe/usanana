import { Component, OnInit } from '@angular/core';
import { CatalogoContableService } from './catalogo-contable.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-contable',
  templateUrl: './catalogo-contable.component.html',
  styleUrls: ['./catalogo-contable.component.css']
})
export class CatalogoContableComponent implements OnInit {

  constructor(private catalogoContableService:CatalogoContableService) { }
  edit = false;

  PantallaCuentasPadres = false;
  searchField = "";
  searchFieldPadres = "";
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Cuentas = [];
  Padres = [];
  Cuenta = {
    Id_Cuenta_Contable:'',
    Cuenta:'',
    Padre:'',
    Descripcion:'',
    Mayor:'0',
    Deudora:'0',
    Estado:'1',
    Centro_Costo:'0',
    D151:'0',
    Balance:'1',
    Moneda:'0',
    NombrePadre:''
  }
  ngOnInit(): void {
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
  keytabPadres(event){
    if (event.key === 'Enter') {
      this.searchPadres();
    }
  }
  search(){
    this.loadAccounts(this.searchField);
  }
  searchPadres(){
    this.loadParents(this.searchFieldPadres)
  }
  async showChilds(Cuenta){

    if(Cuenta.Hijos == true || Cuenta.Hijos == 'true'){
      Cuenta.Hijos = false;
    }else{
      Cuenta.Hijos = true;
    }
  }
  async addAccount(Cuenta){
    if(Cuenta == ''){
      Cuenta = {
        Cuenta: '',
        Descripcion: ''
      }
    }
    let subcuenta = '1'
    if(Cuenta.Cuenta.length > 2){
      subcuenta = '01';
    }

    this.Cuenta = {
        Id_Cuenta_Contable:'',
        Cuenta:Cuenta.Cuenta+subcuenta,
        Padre:Cuenta.Cuenta,
        Descripcion:'',
        Mayor:'0',
        Deudora:Cuenta.Deudora,
        Estado:'1',
        Centro_Costo:Cuenta.Centro_Costo,
        D151:Cuenta.D151,
        Balance:Cuenta.Balance,
        Moneda:Cuenta.Moneda,
        NombrePadre:Cuenta.Descripcion
      }
      console.log
      this.editRecord('',2);
  }
  async showAccount(Cuenta){
    this.editRecord(Cuenta,1);
  }

  async editRecord(Cuenta,tipo){
    this.edit = true;
    if(tipo == 1){
        this.loadAccount(Cuenta.Id_Cuenta_Contable);
    }
  }
  async loadAccounts(search?:any){
    let data = await this.catalogoContableService.loadCatalogo();
    if(data['total'] == 0){
      this.Cuentas = [];
    }else{
      this.Cuentas = data['data'];
    }
  }
  async loadParents(search?:any){
    let data = await this.catalogoContableService.loadParents(this.paginacion,search);
    if(data['total'] == 0){
      this.Padres = [];
    }else{
      this.Padres = data['data'];
    }
  }
  async loadAccount(Id_Cuenta_Contable){
    let data = await this.catalogoContableService.loadAccount(Id_Cuenta_Contable);
    if(data['total'] == 0){
      this.Cuenta = {
        Id_Cuenta_Contable:'',
        Cuenta:'',
        Padre:'',
        Descripcion:'',
        Mayor:'0',
        Deudora:'0',
        Estado:'1',
        Centro_Costo:'0',
        D151:'0',
        Balance:'1',
        Moneda:'0',
        NombrePadre:''
      }
    }else{
      this.Cuenta = data['data'][0];
      this.loadAccountName(this.Cuenta.Padre);
    }
  }
  async loadAccountName(Id_Cuenta_Contable){
    if(!Id_Cuenta_Contable){
      this.Cuenta.NombrePadre = 'Cuenta Principal';
      return true;
    }
    let data = await this.catalogoContableService.loadAccountFromCode(Id_Cuenta_Contable,3);
    if(data['total'] == 0){
      this.Cuenta.NombrePadre = 'Cuenta Principal';
    }else{
      this.Cuenta.NombrePadre = data['data'][0]['Cuenta'] + '-' + data['data'][0]['Descripcion'];
    }
    return true;
  }
  async grabar(){
    if(this.Cuenta.Cuenta == ""){
      Swal.fire('Favor suministrar el código de la cuenta');
      return false;
    }
    if(this.Cuenta.Descripcion == ""){
      Swal.fire('Favor suministrar el nombre de la cuenta');
      return false;
    }
    let data = await this.catalogoContableService.saveAccount(this.Cuenta);
    if(data['success'] =='true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadAccounts(this.searchField);
      this.edit = false;
    }
    return true;
  }
  cancel(){
    this.edit = false;
  }
  openCuentasPanel(){
    this.loadParents();
    this.PantallaCuentasPadres = true;
  }
  closePantallaPadres(){
    this.PantallaCuentasPadres = false;
  }
  SeleccionarPadre(padre){
    this.Cuenta.Padre = padre.Cuenta;
    this.Cuenta.NombrePadre = padre.Cuenta + '-' + padre.Descripcion;
    //this.loadAccountName(padre.Cuenta);
    this.closePantallaPadres();
  }
  cuentaPrincipal(){
    this.Cuenta.Padre = '';
    this.Cuenta.NombrePadre = ''
    this.closePantallaPadres();
  }
}
