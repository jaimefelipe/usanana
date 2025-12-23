import { CashierService } from './cashier.service';
import { BranchService } from '../../../../../main/src/app/branch/branch.service';
import { Component, OnInit } from '@angular/core';
import { CurrencyPipe} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent implements OnInit {

  constructor(
    private cashierService:CashierService,
    private branchService:BranchService,
    private currencyPipe : CurrencyPipe
    ) { }
  Cajas = [];
  Sucursales = [];
  searchField = "";
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Arqueo = {
    Id_Sucursal:'',
    Id_Caja:'',
    Cincuentamil:0,
    Veintemil:0,
    Diezmil:0,
    Cincomil:0,
    Dosmil:0,
    Mil:0,
    Quinientos:0,
    Cien:0,
    Cincuenta:0,
    Veinticinco:0,
    Diez:0,
    Cinco:0,
    CienDolares:0,
    CincuentaDolares:0,
    VeinteDolares:0,
    DiezDolares:0,
    CincoDolares:0,
    DosDolares:0,
    UnDolar:0,
    Varios:0,
    Sinpe:0,
    Deposito:0,
    DatafonoColones:0,
    DatafonoDolares:0,
    Id_Caja_Diaria:''
  }

  edit = false;
  PantallaArqueo = false;
  interfazContable = localStorage.getItem("InterfazContable");
  /**
   * Variables del
   * Formulario de Edición
   */
  Caja = {
    Id_Caja:'',
    Id_Sucursal:'',
    Numero_Caja:'',
    Consecutivo:'',
    Saldo_Apertura:'',
    Saldo_Actual:'',
    Id_Cajero:'',
    Estado:'',
    Nombre:'',
    Nombre_Usuario:'',
    Id_Caja_Diaria:''
  }
  ngOnInit(): void {
    this.loadCategories();
    this.LoadBraches();
  }
  async loadCategories(search?:any){
    let data = await this.cashierService.loadCajas(this.paginacion,search);
    if(data['total'] == 0){
      this.Cajas = [];
    }else{
      this.Cajas = data['data'];
    }
  }
  async editRecord(caja){
    this.edit = true;
    this.initCaja();
    if(caja){
      this.Caja.Id_Caja = caja.Id_Caja;
      this.loadCaja();
    }
  }
  initCaja(){
    this.Caja = {
      Id_Caja:'',
      Id_Sucursal:'',
      Numero_Caja:'',
      Consecutivo:'',
      Saldo_Apertura:'',
      Saldo_Actual:'',
      Id_Cajero:'',
      Estado:'',
      Nombre:'',
      Nombre_Usuario:'',
      Id_Caja_Diaria:''
    }
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
    this.loadCategories();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadCategories(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    if(this.Caja.Numero_Caja == ""){
      Swal.fire('Favor Suministrar el Numero de la Caja');
      return false;
    }
    if(this.Caja.Numero_Caja.length < 5){
      this.Caja.Numero_Caja = this.zfill(this.Caja.Numero_Caja,5);
    }
    let data = await this.cashierService.saveCaja(this.Caja);
    if(data === false){
      Swal.fire('El Número de caja ya existe en el sistema');
      return false;
    }
    if(data['success'] =='true'){
      Swal.fire('Caja grabada correctamente');
      this.loadCategories(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadCaja(){
    let data = await this.cashierService.loadCaja(this.Caja.Id_Caja);
    if(data['total']==1){
      this.Caja = data['data'][0];
    }else{
      Swal.fire(data['data']);
    }
   }

  zfill( number, width )
    {
      width -= number.toString().length;
      if ( width > 0 )
      {
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
      }
      return number + ""; // siempre devuelve tipo cadena
    }
    async LoadBraches(){
      let paginacion = {
        FirstRow: 1,
        LastRow: 50,
        TotalRows: 0
      };
      let data = await this.branchService.loadSucursales(paginacion,'');
      if(data['total'] == 0){
        this.Sucursales = [];
      }else{
        this.Sucursales = data['data'];
      }
    }
    async abrirCaja(){
      //Determinar si ya el usuario tiene una caja abierta
      if(localStorage.getItem('Id_Caja')){
        Swal.fire({
          title: 'Desea Abrirla de todos Modeos?',
          text: "Usuario ya cuenta con Una Caja abierta, No puede abrir otra",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, abrir la caja!'
        }).then((result) => {
          if (result.value) {
            return this.postabrirCaja();
          }else{
            return false;
          }
        });
      }else{
        this.postabrirCaja();
      }
      /*
      if(localStorage.getItem('Id_Caja')){
        Swal.fire('Usuario ya cuenta con Una Caja abierta, No puede abrir otra');
        return false;
      }
      */
      
    }
    async postabrirCaja(){
     

      //Crear Registro de Caja Diaria
      let Caja = {
        Id_Caja:this.Caja.Id_Caja,
        Id_Usuario:localStorage.getItem('Id_Usuario'),
        Saldo_Apertura:this.Caja.Saldo_Apertura,
        Estado:1
      }
      let CajaDiaria = await this.cashierService.crearRegistroDiario(Caja);
      localStorage.setItem('Id_Caja_Diaria',CajaDiaria['Identity']);

      let data = await this.cashierService.abrirCaja(this.Caja,localStorage.getItem('Id_Usuario'),CajaDiaria['Identity']);
      localStorage.setItem('Id_Caja',this.Caja.Id_Caja);



      this.search();
      this.cancel();
      return true;
    }
    async cerrarCaja(){
      //Levantar pantalla para de Arqueo de Caja.
      if(localStorage.getItem('Id_Caja') == this.Caja.Id_Caja){
        this.PantallaArqueo = true;
        let data = await this.cashierService.cerrarCaja(this.Caja.Id_Caja);
        let data1 = await this.cashierService.CerrarCierreDiario(this.Caja.Id_Caja_Diaria);
        localStorage.removeItem('Id_Caja');
        this.search();
        this.cancel();
      }else{
        Swal.fire("El cajero estra tratando de cerrar una caja a la cual no esta asociado");
      }
    }

    async GenerarCierre(){
      this.Arqueo.Id_Caja = this.Caja.Id_Caja;
      this.Arqueo.Id_Caja_Diaria = localStorage.getItem("Id_Caja_Diaria");
      let cierre = await this.cashierService.GenerarCierreCaja(this.Arqueo);
      let data = await this.cashierService.cerrarCaja(this.Caja.Id_Caja);
      // Imprimir Reporte de Arqueo de Caja
      
      this.search();
      this.cancel();
      this.closePantallaArqueo();
      let hoy = new Date();
      let FechaInicio =  {
        month: hoy.getMonth() + 1,
        day: hoy.getDate(), 
        year: hoy.getFullYear()
      }
      let Inicio = FechaInicio.day + '/' + FechaInicio.month + '/' + FechaInicio.year;
      // Si el usuario no es administrador no mostrar el cierre de Caja
      if(localStorage.getItem('ToxoUT') == '1' ){
        if(window.location.pathname == '/bar/cajaventas' ){
          let Param = 'e='+localStorage.getItem("Id_Empresa") + "&i="+Inicio+"&f="+Inicio+"&c="+this.Caja.Id_Caja+"&cc="+localStorage.getItem('Id_Caja_Diaria')
           window.open('https://usantana.com/reportes/bar/reporte-ventas.php?Id=1' + Param, '_blank');
        }else{
          let param = '1&e=' + localStorage.getItem("Id_Empresa") + '&u=' + localStorage.getItem("Id_Usuario") + '&i=' + Inicio + '&f=' + Inicio + '&c=' + localStorage.getItem('Id_Caja') + '&cc=' + localStorage.getItem('Id_Caja_Diaria');
          window.open('https://usantana.com/reportes/cajas/cierre-diario.php?id=' + param, '_blank');
        }
      }

      
      localStorage.removeItem('Id_Caja');
      localStorage.removeItem('Id_Caja_Diaria');
    }
    closePantallaArqueo(){
      this.PantallaArqueo = false;
    }
}
