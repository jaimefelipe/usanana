import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes-registro',
  templateUrl: './reportes-registro.component.html',
  styleUrls: ['./reportes-registro.component.css']
})
export class ReportesRegistroComponent implements OnInit {

  constructor() { }
  reporte = "1";
  ngOnInit() {
  }
  Reporte(){
    let param = '1&e=' + localStorage.getItem('Id_Empresa') + '&u=' + localStorage.getItem('Id_Usuario');
    if(this.reporte == "1"){
      window.open('https://toxo.work/reportes/educacion/alumnos/activos.php?id=' + param, '_blank');
    }
    if(this.reporte == "2"){
      window.open('https://toxo.work/reportes/educacion/alumnos/inactivos.php?id=' + param, '_blank');
    }
    if(this.reporte == "3"){
      window.open('https://toxo.work/reportes/educacion/alumnos/candidatos.php?id=' + param, '_blank');
    }
    if(this.reporte == "4"){
      window.open('https://toxo.work/reportes/educacion/alumnos/candidatos_excell.php?id=' + param, '_blank');
    }
  }
}
