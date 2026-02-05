import { Component, OnInit } from '@angular/core';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-report-purchase',
  templateUrl: './report-purchase.component.html',
  styleUrls: ['./report-purchase.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ReportPurchaseComponent implements OnInit {

  constructor() { }

  hoy = new Date();
  Id_Empresa = localStorage.getItem("Id_Empresa");
  Id_Usuario = localStorage.getItem("Id_Usuario");
  reporte = '1';
  MostrarFecha = true;
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
  }
  Reporte(){
    this.Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
    this.Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;
    let param = '1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin;
    if (this.reporte == '1'){
      window.open('https://toxo.work/reportes/factura/reporte-facturacion-compra.php?id=' + param, '_blank');
    }
    if (this.reporte == '2'){
      window.open('https://toxo.work/core/php/eps/procesarXML.php', '_blank');
    }
    if (this.reporte == '3'){
      window.open('https://toxo.work/reportes/factura/reporte-facturacion-compra-xls.php?id=' + param, '_blank');
    }
    //window.open('/reportes/factura/reporte-facturacion.php?id=' + param, '_blank');
  }
  cambiarFechaMes(){
    if (this.reporte == '1'){
      this.MostrarFecha = true;
    }
    if (this.reporte == '2'){
      this.MostrarFecha = false;
    }
    else{
      this.MostrarFecha = true;
    }
  }
}
