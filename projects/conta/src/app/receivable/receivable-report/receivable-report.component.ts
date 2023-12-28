import { Component, OnInit } from '@angular/core';
import { AccountReceivableService } from '../account-receivable/account-receivable.service';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-receivable-report',
  templateUrl: './receivable-report.component.html',
  styleUrls: ['./receivable-report.component.css']
})
export class ReceivableReportComponent implements OnInit {

  constructor(private accountReceivableService:AccountReceivableService) { }

  ngOnInit(): void {
  }
  PantallaCuentas = false;
  searchFieldAccounts = '';
  Id_Cuenta = '';
  Nombre_Cuenta = '';
  Accounts = [];
  cobrar = false;
  hoy = new Date();
  Id_Empresa = localStorage.getItem("Id_Empresa");
  Id_Usuario = localStorage.getItem("Id_Usuario");
  reporte = "1";

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

  cambiarReporte(){
    if(this.reporte =='1'){
      this.cobrar =false;
    }
    if(this.reporte =='2'){
      this.cobrar =false;
    }
    if(this.reporte =='3'){
      this.cobrar =true;
    }
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
    let data = await this.accountReceivableService.loadCentas(paginacion, this.searchFieldAccounts);
    this.Accounts = data['data'];
  }
  async closeModal(){
    this.PantallaCuentas = false;
  }
  async keytabAccounts(event){
    if (event.key === "Enter") {
      this.searchAccounts();
    }
  }
  Seleccionar(account){
    this.Id_Cuenta = account.Id_Cuenta;
    this.Nombre_Cuenta = account.Nombre;
    this.closeModal();
  }
  Reporte(){
    /*this.Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
    this.Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;
    let param = '1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin;
    */
    let param = this.Id_Empresa;

    if(this.reporte == "1"){
      window.open('https://toxo.work/reportes/cobrar/cxc-resumen-cuentas.php?id=' + param, '_blank');
    }
    if(this.reporte == "2"){
      window.open('https://toxo.work/reportes/cobrar/cxc-detalle-cuentas.php?id=' + param, '_blank');
    }
    if(this.reporte == "3"){
      param = param + "&c="+this.Id_Cuenta;
      window.open('https://toxo.work/reportes/cobrar/cxc-estado-cuenta.php?id=' + param, '_blank');
    }

  }

}
