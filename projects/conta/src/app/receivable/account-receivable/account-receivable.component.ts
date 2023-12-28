import { Component, OnInit } from '@angular/core';
import { AccountReceivableService } from './account-receivable.service';
import { ReceivableClassificationService } from '../receivable-classification/receivable-classification.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-account-receivable',
  templateUrl: './account-receivable.component.html',
  styleUrls: ['./account-receivable.component.css']
})
export class AccountReceivableComponent implements OnInit {

  constructor(
    private accountReceivableService:AccountReceivableService,
    private receivableClassificationService:ReceivableClassificationService
    ) { }
  Classifications = [];
  Cuentas = [];
  searchField = ""
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  edit = false;
  interfazContable = localStorage.getItem("InterfazContable");

  /**
   * Variables del
   * Formulario de Edición
   */
  Cuenta = {
    Id_Cuenta: '',
    Id_Clasificacion: '',
    Id_Cliente:'',
    Nombre:'',
    Moneda:'',
    Plazo:'',
    Credito:'',
    Saldo:'',
    Dia_Tramite:'',
    Hora_Tramite:'',
    Dia_Pago:'',
    Hora_Pago:'',
    Lugar_Pago:'',
    Notas:'',
    Estado:'1'
  }
  ngOnInit(): void {
    this.loadCuentas();
    this.loadClasifications();
  }
  async loadClasifications(search?:any){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.receivableClassificationService.loadCategories(paginacion,'');
    if(data['total'] == 0){
      this.Classifications = [];
    }else{
      this.Classifications = data['data'];
    }
  }
  changeClasification(){
    for (let i = 0; i < this.Classifications.length; i++) {
      if(this.Classifications[i]['Id_Clasificacion'] == this.Cuenta.Id_Clasificacion){
        this.Cuenta.Plazo = this.Classifications[i]['Plazo'];
      }
    }
  }

  async loadCuentas(search?:any){
    let data = await this.accountReceivableService.loadCentas(this.paginacion,search);
    if(data['total'] == 0){
      this.Cuentas = [];
    }else{
      this.Cuentas = data['data'];
    }
  }
  async editRecord(Cuenta){
    this.edit = true;
    if(Cuenta){
      this.Cuenta.Id_Cuenta = Cuenta.Id_Cuenta;
      this.loadCuenta();
    }else{
      this.Cuenta = {
        Id_Cuenta: '',
        Id_Clasificacion: '',
        Id_Cliente:'',
        Nombre:'',
        Moneda:'',
        Plazo:'',
        Credito:'',
        Saldo:'',
        Dia_Tramite:'',
        Hora_Tramite:'',
        Dia_Pago:'',
        Hora_Pago:'',
        Lugar_Pago:'',
        Notas:'',
        Estado:'1'
      }
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
    this.loadCuentas();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadCuentas(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    if(this.Cuenta.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre de la Cuenta');
      return false;
    }
    let data = await this.accountReceivableService.saveCuenta(this.Cuenta);
    if(data['success'] =='true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadCuentas(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadCuenta(){
    let data = await this.accountReceivableService.loadCuenta(this.Cuenta.Id_Cuenta);
    if(data['total']==1){
      this.Cuenta = data['data'][0];
    }
   }

}
