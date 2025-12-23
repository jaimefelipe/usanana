import { Component, OnInit } from '@angular/core';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { PeriodoContableService } from '../periodo-contable/periodo-contable.service';
import { CentroCostoService } from '../centro-costo/centro-costo.service';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accountant-report',
  templateUrl: './accountant-report.component.html',
  styleUrls: ['./accountant-report.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class AccountantReportComponent implements OnInit {

  constructor(
    private periodoContableService:PeriodoContableService,
    private apiService:ApiService,
    private centroCostoService:CentroCostoService
  ) { }

  fecha = false;
  mes = false;
  centro = false;
  Periodos = [];
  Centros = [];

  hoy = new Date();
  Id_Empresa = localStorage.getItem("Id_Empresa");
  Id_Usuario = localStorage.getItem("Id_Usuario");
  Id_Periodo = 0;
  Id_Centro_Costo = "999";
  reporte = "6";
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
    this.loadPeriodo();
    this.loadCentros();
  }
  async loadCentros(search?:any){
    let data = await this.centroCostoService.loadCentros(this.paginacion,'',1);
    if(data['total'] == 0){
      this.Centros = [];
    }else{
      this.Centros = data['data'];
    }
  }
  async Reporte(){
    if(this.reporte =='1'){
      this.Inicio = this.FechaInicio.day + '/' + this.FechaInicio.month + '/' + this.FechaInicio.year;
      this.Fin = this.FechaFin.day + '/' + this.FechaFin.month + '/' + this.FechaFin.year;
      let param = '1&e=' + this.Id_Empresa + '&u=' + this.Id_Usuario + '&i=' + this.Inicio + '&f=' + this.Fin;
      if(this.reporte == "1"){
        window.open('https://usantana.com/reportes/contabilidad/cge-reporte-iva.php?id=' + param, '_blank');
      }
    }
    if(this.reporte =='2'){
      for (let i = 0; i < this.Periodos.length; i++) {
        if(this.Periodos[i].Id_Periodo_Contable == this.Id_Periodo){
            // Ejecutar el proceso de mayorizacion.
          await this.ejecutarMayorizacion(this.Periodos[i].Mes,this.Periodos[i].Anio)
        }
      }
    }
    if(this.reporte =='3'){
      for (let i = 0; i < this.Periodos.length; i++) {
        if(this.Periodos[i].Id_Periodo_Contable == this.Id_Periodo){
            // Ejecutar el proceso de mayorizacion.
          this.balanceComprobacion(this.Periodos[i].Mes,this.Periodos[i].Anio,1)
        }
      }
    }
    if(this.reporte =='4'){
      for (let i = 0; i < this.Periodos.length; i++) {
        if(this.Periodos[i].Id_Periodo_Contable == this.Id_Periodo){
            // Ejecutar el proceso de mayorizacion.
          this.estadoResultados(this.Periodos[i].Mes,this.Periodos[i].Anio)
        }
      }
    }
    if(this.reporte =='5'){
      for (let i = 0; i < this.Periodos.length; i++) {
        if(this.Periodos[i].Id_Periodo_Contable == this.Id_Periodo){
            // Ejecutar el proceso de mayorizacion.
          this.estadoSituacion(this.Periodos[i].Mes,this.Periodos[i].Anio)
        }
      }
    }
    if(this.reporte =='6'){
      for (let i = 0; i < this.Periodos.length; i++) {
        if(this.Periodos[i].Id_Periodo_Contable == this.Id_Periodo){
            // Ejecutar el proceso de mayorizacion.
          this.estadoResultados2(this.Periodos[i].Mes,this.Periodos[i].Anio)
        }
      }
    }
    // Proceso de contabilización de Compras
    if(this.reporte =='66'){
      await this.ContabilizarCompras();
    }
    if(this.reporte =='7'){
      await this.ContabilizarVentas();
    }
    if(this.reporte =='8'){
      await this.catalogo();
    }
    if(this.reporte =='9'){
      for (let i = 0; i < this.Periodos.length; i++) {
        if(this.Periodos[i].Id_Periodo_Contable == this.Id_Periodo){
            // Ejecutar el proceso de mayorizacion.
            await this.movimientosCuenta(this.Periodos[i].Mes,this.Periodos[i].Anio);
        }
      }
    }
    if(this.reporte =='10'){
      for (let i = 0; i < this.Periodos.length; i++) {
        if(this.Periodos[i].Id_Periodo_Contable == this.Id_Periodo){
            // Ejecutar el proceso de mayorizacion.
          await this.ejecutarDesMayorizacion(this.Periodos[i].Mes,this.Periodos[i].Anio)
        }
      }
    }
    if(this.reporte =='11'){
      for (let i = 0; i < this.Periodos.length; i++) {
        if(this.Periodos[i].Id_Periodo_Contable == this.Id_Periodo){
            // Ejecutar el proceso de mayorizacion.
          this.balanceComprobacion(this.Periodos[i].Mes,this.Periodos[i].Anio,2)
        }
      }
    }
    if(this.reporte =='12'){
      for (let i = 0; i < this.Periodos.length; i++) {
        if(this.Periodos[i].Id_Periodo_Contable == this.Id_Periodo){
            // Ejecutar el proceso de mayorizacion.
          this.balanceMensual(this.Periodos[i].Mes,this.Periodos[i].Anio)
        }
      }
    }
  }
  cambiarFechaMes(){
    if(this.reporte =='1'){
      this.fecha =true;
      this.mes = false;
    }
    if(this.reporte =='2'){
      this.fecha =false;
      this.mes = true;
    }
    if(this.reporte =='3'){
      this.fecha =false;
      this.mes = true;
      this.centro = false;
    }
    if(this.reporte =='4'){
      this.fecha =false;
      this.mes = true;
      this.centro = true;
    }
    if(this.reporte =='5'){
      this.fecha =false;
      this.mes = true;
      this.centro = false;
    }
    if(this.reporte =='6'){
      this.fecha =false;
      this.mes = true;
      this.centro = true;
    }
    if(this.reporte =='7'){
      this.fecha =false;
      this.mes = false;
      this.centro = false;
    }
    if(this.reporte =='8'){
      this.fecha =false;
      this.mes = false;
      this.centro = false;
    }
    if(this.reporte =='9'){
      this.fecha =false;
      this.mes = true;
      this.centro = false;
    }
    if(this.reporte =='10'){
      this.fecha =false;
      this.mes = true;
      this.centro = false;
    }
    if(this.reporte =='11'){
      this.fecha =false;
      this.mes = true;
      this.centro = false;
    }
  }

  async loadPeriodo(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.periodoContableService.loadPeriodos(paginacion,'',1);
    if(data['total'] != 0){
      this.Periodos = data['data'];
    }
  }

  async ejecutarMayorizacion(Mes:any,Anio:any){
    let sql = "CALL sp_Cge_Mayorizacion (" + localStorage.getItem('Id_Empresa')+','+Mes+','+Anio + ','+ this.Id_Periodo + ')';
    let data = await this.apiService.postRecord(sql);
    if(data['success'] == 'true'){
      Swal.fire('Proceso de Mayorización Ejecutado');
    }
  }
  async ejecutarDesMayorizacion(Mes:any,Anio:any){
    let sql = "CALL sp_Cge_DesMayorizacion_2 (" + localStorage.getItem('Id_Empresa')+','+Mes+','+Anio + ','+ this.Id_Periodo+ ')';
    let data = await this.apiService.postRecord(sql);
    if(data['success'] == 'true'){
      Swal.fire('Proceso de DesMayorización Ejecutado');
    }
  }
  async ContabilizarCompras(){
    let sql = "CALL sp_Com_Crear_Asiento_Contable (" + localStorage.getItem('Id_Empresa')+')';
    let data = await this.apiService.postRecord(sql);
    if(data['success'] == 'true'){
      if(!data['data'][0]['Error']){
        Swal.fire('Proceso de Contabilización Ejecutado');
      }else{
        Swal.fire('No se puede Contabilizar',data['data'][0]['Error']);
      }
    }
  }
  async ContabilizarVentas(){
    let sql = "CALL sp_Ven_Crear_Asiento_Contable (" + localStorage.getItem('Id_Empresa')+')';
    let data = await this.apiService.postRecord(sql);
    if(data['success'] == 'true'){
      if(!data['data'][0]['Error']){
        Swal.fire('Proceso de Contabilización Ejecutado');
      }else{
        Swal.fire('No se puede Contabilizar',data['data'][0]['Error']);
      }
    }else{
      Swal.fire('No se puede Contabilizar',data['error']);
    }
  }
  async balanceComprobacion(Mes:any,Anio:any,Informe){
    if(Informe == 1){
      window.open('https://usantana.com/reportes/contabilidad/cge-balance-comprobacion.php?id='+localStorage.getItem('Id_Empresa')+'&m='+Mes+'&a='+Anio+'&p='+this.Id_Periodo,'_blank')
    }else{
      window.open('https://usantana.com/reportes/contabilidad/cge-balance-comprobacion2.php?id='+localStorage.getItem('Id_Empresa')+'&m='+Mes+'&a='+Anio+'&p='+this.Id_Periodo,'_blank')
    }
  }
  async estadoResultados(Mes:any,Anio:any){
    window.open('https://usantana.com/reportes/contabilidad/cge-estado-resultados.php?id='+localStorage.getItem('Id_Empresa')+'&m='+Mes+'&a='+Anio+'&p='+this.Id_Periodo+'&cc='+this.Id_Centro_Costo,'_blank')
  }
  async estadoResultados2(Mes:any,Anio:any){
    window.open('https://usantana.com/reportes/contabilidad/cge-estado-resultados2.php?id='+localStorage.getItem('Id_Empresa')+'&m='+Mes+'&a='+Anio+'&p='+this.Id_Periodo+'&cc='+this.Id_Centro_Costo,'_blank')
  }
  async estadoSituacion(Mes:any,Anio:any){
    window.open('https://usantana.com/reportes/contabilidad/cge-estado-situacion.php?id='+localStorage.getItem('Id_Empresa')+'&m='+Mes+'&a='+Anio+'&p='+this.Id_Periodo,'_blank')
  }
  async catalogo(){
    window.open('https://usantana.com/reportes/contabilidad/cge-catalogo.php?id='+localStorage.getItem('Id_Empresa'),'_blank')
  }
  async movimientosCuenta(Mes:any,Anio:any){
    window.open('https://usantana.com/reportes/contabilidad/cge-mov-cta.php?id='+localStorage.getItem('Id_Empresa')+'&m='+Mes+'&a='+Anio,'_blank')
  }
  async balanceMensual(Mes:any,Anio:any){
    window.open('https://usantana.com/reportes/contabilidad/cge-balance-mensual-xls.php?id='+localStorage.getItem('Id_Empresa')+'&m='+Mes+'&a='+Anio+'&p='+this.Id_Periodo,'_blank')
  }
}
