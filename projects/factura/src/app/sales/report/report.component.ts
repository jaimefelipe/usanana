import { ChangeService } from './../../../../../seguridad/src/app/security/change/change.service';
import { Component, OnInit } from '@angular/core';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CashierService } from '../../../../../caja/src/app/caja/cashier/cashier.service';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ReportComponent implements OnInit {

  constructor(
    private apiService:ApiService,
    private cashierService:CashierService,
    ) { }
  hoy = new Date();
  Id_Empresa = localStorage.getItem("Id_Empresa");
  Id_Usuario = localStorage.getItem("Id_Usuario");
  Cierres = [];
  Cajas = [];
  reporte = "1";
  MostrarFecha = true;
  MostrarCaja = true;
  Id_Caja = '99';
  Id_Caja_Diaria = '99';
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
  Reporte(){
    let Id_Caja = localStorage.getItem('Id_Caja');
    if(!Id_Caja){
      Id_Caja = '';
    }
    Id_Caja = this.Id_Caja;
    this.Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
    this.Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;
    let param = '1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin + '&c=' + Id_Caja + '&cc=' + this.Id_Caja_Diaria;
    if(this.reporte == "1"){
      window.open('https://usantana.com/reportes/factura/reporte-facturacion.php?id=' + param, '_blank');
    }
    if(this.reporte == "2"){
      window.open('https://usantana.com/reportes/cajas/cierre-diario.php?id=' + param, '_blank');
    }
    if(this.reporte == "3"){
      window.open('https://usantana.com/reportes/factura/reporte-productos-vendidos.php?id=' + param, '_blank');
    }
    if(this.reporte == "4"){
      this.FacturaMasiva();
    }
    if(this.reporte == "5"){
      window.open('https://usantana.com/reportes/factura/reporte-facturacion-venta-xls.php?id=' + param, '_blank');
    }
    if(this.reporte == "6"){
      window.open('https://usantana.com/reportes/factura/reporte-facturacion-xls.php?id=' + param, '_blank');
    }
    if(this.reporte == "7"){
      window.open('https://usantana.com/core/php/hacienda2/consultar_hacienda.php', '_blank');
    }
  }
  async FacturaMasiva(){
    let sql = "CALL Ven_Generar_Factura_Masiva (" + localStorage.getItem('Id_Empresa')+')';
    let data = await this.apiService.postRecord(sql);
    if(data['success'] == 'true'){
      if(!data['data'][0]['Error']){
        //Aplicar una a una las facturas generadas.
        // Leer las facturas generadas
        let facturas = await this.LeerIdFacturasSinAplicar();
        for (let i = 0; i < facturas.length; i++) {
          //this.apiService.aplicarFacturaHacienda(facturas[i].Id_Factura);
        }
        // Ejecturar el store procedure

        Swal.fire('Proceso de Facturación Ejecutado');
      }else{
        Swal.fire('No se puede Facturar',data['data'][0]['Error']);
      }
    }else{
      Swal.fire('No se puede Facturar ',data['error']);
    }
  }
  cambiarFechaMes(){
    if(this.reporte == "1"){
      this.MostrarFecha = true;
      this.MostrarCaja = false;
    }
    if(this.reporte == "2"){
      this.MostrarFecha = true;
      this.MostrarCaja = true;
    }
    if(this.reporte == "3"){
      this.MostrarFecha = true;
      this.MostrarCaja = false;
    }
    if(this.reporte == "4"){
      this.MostrarFecha = false;
    }
  }
  async LeerIdFacturasSinAplicar(){
    let sqlConfig = {
      table: 'Ven_Factura',
      fields: 'Id_Factura',
      orderField: '',
      searchField: '',
      where: "Proceso_Automatico = 1 and Respuesta_MH = 'Registrado'"
    }
    let data = await this.apiService.executeSqlSyn(sqlConfig);
    return data['data'];
  }
  async loadCajas(search?:any){
    let data = await this.cashierService.loadCajas(this.paginacion,search);
    if(data['total'] == 0){
      this.Cajas = [];
    }else{
      this.Cajas = data['data'];
    }
  }
  async loadCierres(FechaInicio,FechaFin){
    let Inicio = FechaInicio.day + '/' + FechaInicio.month + '/' + FechaInicio.year;
    let Fin = FechaFin.day + '/' + FechaFin.month + '/' + FechaFin.year;
    let data = await this.cashierService.CargarCierre(this.Id_Caja,Inicio,Fin);
    if(data['total'] == 0){
      this.Cierres = [];
    }else{
      this.Cierres = data['data'];
    }
  }
}
