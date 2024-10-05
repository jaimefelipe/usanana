import { Component, OnInit } from '@angular/core';
import { ProgramacionService } from './programacion.service';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.css']
})
export class ProgramacionComponent implements OnInit {

  constructor(
    private programacionService:ProgramacionService
  ) { }

  edit = false;
  pantallaNuevaSemana = false;
  pantallaEditSemana = false;
  PantallaEditarEmpleado = false;

  searchField = '';

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  
  Semanas = [];
  Empleados = [];
  Semana = {
    Id_Semana:'',
    Anio:new Date().getFullYear(),
    Mes: new Date().getMonth(),
    Semana:''
  } 

  Empleado = {
    Id_Roll:'',
    Codigo:'',
    Nombre:'',
    Roll:'',
    Lunes:'',
    Inicio_Lunes:'',
    Fin_Lunes:'',
    Martes:'',
    Inicio_Martes:'',
    Fin_Martes:'',
    Miercoles:'',
    Inicio_Miercoles:'',
    Fin_Miercoles:'',
    Jueves:'',
    Inicio_Jueves:'',
    Fin_Jueves:'',
    Viernes:'',
    Inicio_Viernes:'',
    Fin_Viernes:'',
    Sabado:'',
    Inicio_Sabado:'',
    Fin_Sabado:'',
    Domingo:'',
    Inicio_Domingo:'',
    Fin_Domingo:'',
    Estado:'1'
  }

  ngOnInit() {
    this.leerSemanas();
  }

  search(){
    this.leerSemanas();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
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
    this.leerSemanas();
  }
  editRecord(Semana){
    this.Semana.Anio = Semana.Anio;
    this.Semana.Mes = Semana.Mes;
    this.Semana.Semana = Semana.Semana;
    this.edit = true;
    this.pantallaEditSemana = true;
    this.leerEmpleadosSemana(Semana);
  }

  nuevaSemana(){
    this.edit = true;
    this.pantallaNuevaSemana = true;
  }
  async generarSemana(){
    await this.programacionService.generarSemana(this.Semana);
    this.leerSemanas();
    this.cancelarSemana();
  }
  cancelarSemana(){
    this.edit = false;
    this.pantallaNuevaSemana = false;
  }
  cancelarEdicionSemana(){
    this.edit = false;
    this.pantallaEditSemana = false;
  }
  async leerSemanas(){
    let data = await this.programacionService.leerSemanas(this.paginacion,this.searchField);
    if(data['total'] == 0){
      this.Semanas = [];
    }else{
      this.Semanas = data['data'];
    }
  }

  async leerEmpleadosSemana(Semana){
    let data = await this.programacionService.leerEmpleadosSemana(this.paginacion,'',Semana.Id_Semana_Roll);
    if(data['total'] == 0){
      this.Empleados = [];
    }else{
      this.Empleados = data['data'];
    }
  }
  editarEmpleado(Empleado){
    this.Empleado = Empleado;
    console.log(Empleado)
    this.pantallaEditSemana = false;
    this.PantallaEditarEmpleado = true;
    this.edit = true;
  }
  CerrarPantallaEditarEmpleado(){
    this.PantallaEditarEmpleado = false;
    this.pantallaEditSemana = true;
    
  }

  async grabarEmpleado(){
    let data = await this.programacionService.editarEmpleadoRoll(this.Empleado);
    this.CerrarPantallaEditarEmpleado();
  }
  generarExcell(){
      let param = '1&e=' + localStorage.getItem('Id_Empresa') + '&a=' + this.Semana.Anio + '&m=' + this.Semana.Mes + '&s=' + this.Semana.Semana;
      window.open('https://toxo.work/reportes/rrhh/programacion-semanal-xls.php?id=' + param, '_blank');
  }
}
