import { Component, OnInit } from '@angular/core';
import { BankAccountService } from '../bank-account/bank-account.service';
import { BankMovementService } from './bank-movement.service';
import { NgbDateFRParserFormatter } from './../../_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bank-movement',
  templateUrl: './bank-movement.component.html',
  styleUrls: ['./bank-movement.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class BankMovementComponent implements OnInit {

  constructor(private bankAccountService:BankAccountService,
    private bankMovementService:BankMovementService) { }
  edit= false;
  PantallaCuentas = false;
  searchField = '';
  searchFieldCuentas = '';
  Cuentas = [];
  Movements = [];
  hoy = new Date();
  Fecha =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  Movement = {
    Id_Movimiento:'',
    Id_Cuenta:'',
    Nombre_Cuenta:'',
    Tipo_Movimiento:'1',
    Documento:'',
    Descripcion:'',
    Fecha:'',
    FechaMov:{
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Estado:'1',
    Monto:''
  };

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  ngOnInit(): void {
    this.loadMovements();
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
    this.loadMovements();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabCuentas(event){

  }
  search(){
    this.loadMovements(this.searchField);
  }
  searchCuentas(){

  }
  async loadMovements(search?:any){
    let data = await this.bankMovementService.loadMovements(this.paginacion,search);
    if (data['success'] == 'true') {
      this.Movements = data['data'];
    }else{
      this.Movements = [];
    }
  }
  editRecord(Account){
    this.edit = true;
  }
  grabar(){
    if (this.Movement.Id_Cuenta == '') {
      Swal.fire('Favor Suministrar la cuenta');
      return false;
    }
    if (this.Movement.Documento == '') {
      Swal.fire('Favor Suministrar el número de documento');
      return false;
    }
    if (this.Movement.Descripcion == '') {
      Swal.fire('Favor Suministrar la descripción del movimiento');
      return false;
    }
    if (this.Movement.Monto == '') {
      Swal.fire('Favor Suministrar el monto');
      return false;
    }
    this.Movement.Fecha = this.Movement.FechaMov.day + '/' + this.Movement.FechaMov.month + '/' + this.Movement.FechaMov.year;
    let data ={}
    if(this.Movement.Id_Movimiento == ''){
      data = this.bankMovementService.saveMovement(this.Movement)
    }else{
      data = this.bankMovementService.updateMovement(this.Movement)
    }
    if (data['success'] == 'true') {
      Swal.fire('Movimiento grabado correctamente');
      //this.loadAccounts(this.searchField);
      this.edit = false;
    }
    return true;
  }


  cancel(){
    this.edit = false;
  }
  openCuentaPanel(){
    this.PantallaCuentas = true;
  }
  Seleccionar(Cuenta){
    this.Movement.Id_Cuenta = Cuenta.Id_Cuenta;
    this.Movement.Nombre_Cuenta = Cuenta.Cuenta + '-' +Cuenta.Nombre;
    this.PantallaCuentas = false;
  }
  closeModal(){
    this.PantallaCuentas = false;
  }
  async loadAccounts(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.bankAccountService.loadAccounts(paginacion,'');
    if (data['total'] == 1) {
      this.Cuentas = data['data'];
    }

  }
}
