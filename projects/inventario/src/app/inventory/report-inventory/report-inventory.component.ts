import { Component, OnInit } from '@angular/core';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Component({
  selector: 'app-report-inventory',
  templateUrl: './report-inventory.component.html',
  styleUrls: ['./report-inventory.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ReportInventoryComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }
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
  ngOnInit(): void {
  }
  Reporte(){
    this.Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
    this.Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;
    let param = '1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin;
    if(this.reporte == "1"){
      window.open('https://toxo.work/reportes/inventario/inv-existencia-costo.php?id=' + param, '_blank');
    }
    if(this.reporte == "2"){
      window.open('https://toxo.work/reportes/inventario/inv-minimos-maximos.php?id=' + param, '_blank');
    }
    if(this.reporte == "3"){
      window.open('https://toxo.work/reportes/inventario/inv-movimientos.php?id=' + param, '_blank');
    }
    if(this.reporte == "4"){
      window.open('https://toxo.work/reportes/inventario/inv-existencia-costo-xls.php?id=' + param, '_blank');
    }
    if(this.reporte == "5"){
      window.open('https://toxo.work/reportes/inventario/inv-movimientos-xls.php?id=' + param, '_blank');
    }
    if(this.reporte == "6"){
      window.open('https://toxo.work/reportes/inventario/bar-code.php?id=' + param, '_blank');
    }
    if(this.reporte == "7"){
      this.apiService.postRecord(
        'call sp_Inv_Recalculo_Precio_Costo_Existencia(' + localStorage.getItem("Id_Empresa") + ')'
      );
    }
  }
}
