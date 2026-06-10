import { Component, OnInit,Input,SimpleChanges } from '@angular/core';
import { ContactoService } from '../contacto/contacto.service';
import { CarreraService } from '../../../../../academico/src/app/config/carrera/carrera.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-carreras-contacto',
  templateUrl: './carreras-contacto.component.html',
  styleUrls: ['./carreras-contacto.component.css']
})
export class CarrerasContactoComponent implements OnInit {
 @Input() Persona : any;
  constructor(
    private contactoService:ContactoService,
    private carreraService:CarreraService
  ) { }
  Carreras = [];
  CarrerasActivas = [];
  searchField = '';
  searchFieldCarrera = '';

  hoy = new Date();
  Fecha =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  Fecha_Ingreso =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  Fecha_Graduacion =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  
  PantallaCarreraContacto = false;
  PantallaCarrerasActivas = false;
  CarreraEstudiante = {
    Id_Carrera_Estudiante:'',
    Id_Persona:'',
    Id_Carrera:'',
    Carrera:'',
    Fecha_Ingreso:'',
    Fecha_Graduacion:'',
    Estado:''
  }
 
  ngOnInit() {
    this.leerCarrerasActivas();
  }

  search(){

  }
  keytab(e){

  }
  searchCarrera(){

  }
  keytabCarrera(event){

  }
  async abrirPantallaCarreraContacto(carrera){
    if(carrera){
      let data = await this.contactoService.loadCarreraPorAlumno(carrera.Id_Carrera_Estudiante);
      if(data['total']==0){
        this.CarreraEstudiante = {
          Id_Carrera_Estudiante:'',
          Id_Persona:'',
          Id_Carrera:'',
          Carrera:'',
          Fecha_Ingreso:this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year,
          Fecha_Graduacion:'',
          Estado:''
        };

      }else{
        this.CarreraEstudiante = data['data'][0];
      }
    }
    this.PantallaCarreraContacto = true;
  }
  abrirPantallaCarreraActiva(){
    this.leerCarreras();
    this.PantallaCarrerasActivas = true;
  }
  ngOnChanges(changes: SimpleChanges) {
      //Evento se dispara cuando hay cambios en el padre
      this.loadCarrerasPorContacato();
  }
  async loadCarrerasPorContacato(){
    let data = await this.contactoService.loadCarrerasPorAlumno(this.Persona.Id_Persona);
    if(data['total']==0){
      this.CarrerasActivas = [];
    }else{
      this.CarrerasActivas = data['data'];
    }
  }

  cerrarPantallaCarreraContacto(){
    this.PantallaCarreraContacto = false;
  }

  grabarCarrera(){
    this.CarreraEstudiante.Id_Persona = this.Persona.Id_Persona;
    this.CarreraEstudiante.Fecha_Ingreso = this.Fecha_Ingreso.day + '-' + this.Fecha_Ingreso.month + '-' + this.Fecha_Ingreso.year;
    this.CarreraEstudiante.Fecha_Graduacion = this.Fecha_Graduacion.day + '-' + this.Fecha_Graduacion.month + '-' + this.Fecha_Graduacion.year;

    if(this.CarreraEstudiante.Id_Carrera == ''){
      Swal.fire('Debe seleccionar la Carrera');
      return false;
    }
    if(this.CarreraEstudiante.Fecha_Ingreso == ''){
      Swal.fire('Debe seleccionar fecha de ingreso');
      return false;
    }
    if(this.CarreraEstudiante.Estado == '3'){
      if(this.CarreraEstudiante.Fecha_Graduacion ==''){
        Swal.fire('Debe seleccionar fecha de graduación');
      return false;
      }
    }
    if(this.CarreraEstudiante.Id_Carrera_Estudiante ==''){
      this.insertCarrera();
    }else{
      this.updateCarrera();
    }
    this.cerrarPantallaCarreraContacto();
    return true;

  }
  async insertCarrera(){
    let data = await this.contactoService.insertCarreraPorAlumno(this.CarreraEstudiante);
  }
  async updateCarrera(){
    let data = await this.contactoService.updateCarreraPorAlumno(this.CarreraEstudiante);
  }
  SeleccionarCarrera(Carrera){
    this.CarreraEstudiante.Id_Carrera = Carrera.Id_Carrera;
    this.CarreraEstudiante.Carrera = Carrera.Carrera;
    this.cerrarPantallaCarreraActiva();
  }
  cerrarPantallaCarreraActiva(){
    this.PantallaCarrerasActivas = false;
  }
  async leerCarrerasActivas(){
    let data = await this.carreraService.leerCarrerasActivas(this.Persona.Id_Persona);
    this.CarrerasActivas = data['data'];

  }
  async leerCarreras(){
    let data = await this.carreraService.cargarCarreras();
    this.Carreras = data['data'];
  }
  
  
}
