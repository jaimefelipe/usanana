import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
import { TareasService } from './tareas.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}],
})
export class TareasComponent implements OnInit {

  @Input() Persona : any;
  constructor(
    private tareasService:TareasService,
    private contactoService:ContactoService
  ) { }
  hoy = new Date();
  PantallaTareas = false;
  PantallaPersona = false;
  searchField = '';
  searchFieldPersona= "";
  TipoPersona = '';
  BotonActivo = 0;
  FechaInicio =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  FechaFin=  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  Tareas = [];
  Personas = [];
  Tarea = {
    Id_Tarea:'',
    Id_Beneficiario:'',
    NombreBeneficiario:'',
    NombreEncargado:'',
    NombreAsistente:'',
    NombreSupervisor:'',
    Id_Encargado:localStorage.getItem('Id_Usuario'),
    Id_Asistente:'',
    Id_Supervisor:'',
    Tipo:'1',
    Estado:'1',
    Avance:'',
    Tarea:'',
    Inicio:'',
    FechaInicio:'',
    Fin:'',
    FechaFin:''
  }
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  paginacionPersona = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  ngOnInit(): void {
    this.Tareas = [];
    //this.loadTareas();
  }

  ngOnChanges(changes: SimpleChanges) {
    //Evento se dispara cuando hay cambios en el padre
    if (changes['Persona'] && !changes['Persona'].currentValue) {
      this.loadTareas();
    }
  }
  search(){

  }
  keytab(e){

  }
  editRecord(Tarea){
    this.PantallaTareas = true;
    if(Tarea){
      this.Tarea = Tarea;
      let fechaArr1 = this.Tarea.Inicio.split('-');
      this.FechaInicio = {
        month: parseInt(fechaArr1[1]),
        day: parseInt(fechaArr1[2]),
        year: parseInt(fechaArr1[0]),
      }
      let fechaArr2 = this.Tarea.Fin.split('-');
      this.FechaFin = {
        month: parseInt(fechaArr2[1]),
        day: parseInt(fechaArr2[2]),
        year: parseInt(fechaArr2[0]),
      }
    }else{
       this.Tarea = {
         Id_Tarea:'',
         Id_Beneficiario:'',
         NombreBeneficiario:'',
         NombreEncargado:'',
         NombreAsistente:'',
         NombreSupervisor:'',
         Id_Encargado:localStorage.getItem('Id_Usuario'),
         Id_Asistente:'',
         Id_Supervisor:'',
         Tipo:'1',
         Estado:'1',
         Avance:'',
         Tarea:'',
         Inicio:'',
        FechaInicio:'',
        Fin:'',
        FechaFin:''
       }  
    }
   }
  abrirPantallaTareas(Tarea){
    if(Tarea){
      this.Tarea = Tarea;
    }else{
      this.Tarea = {
        Id_Tarea:'',
        Id_Beneficiario:'',
        NombreBeneficiario:'',
        NombreEncargado:'',
        NombreAsistente:'',
        NombreSupervisor:'',
        Id_Encargado:localStorage.getItem('Id_Usuario'),
        Id_Asistente:'',
        Id_Supervisor:'',
        Tipo:'1',
        Estado:'1',
        Avance:'',
        Tarea:'',
        Inicio:'',
        FechaInicio:'',
        Fin:'',
        FechaFin:''
      }
      this.Tarea.NombreBeneficiario = this.Persona.Nombre;
      this.Tarea.Id_Beneficiario = this.Persona.Id_Persona;
      this.Tarea.Id_Encargado = localStorage.getItem('Id_Usuario');
      this.Tarea.NombreEncargado = localStorage.getItem('Nombre_Usuario');
    }
    this.PantallaTareas = true;
    this.loadTareas();
  }
  async GrabarTarea(){
    this.Tarea.Inicio =  this.FechaInicio.year + '-' + this.FechaInicio.month + '-' +this.FechaInicio.day;
    this.Tarea.Fin =  this.FechaFin.year + '-' + this.FechaFin.month + '-' +this.FechaFin.day;
    this.Tarea.Id_Beneficiario = this.Persona.Id_Persona
    if(this.Tarea.Id_Tarea == ''){
      await this.tareasService.nuevaTarea(this.Tarea);
    }else{
      await this.tareasService.actualizarTarea(this.Tarea);
    }

    this.Tarea = {
      Id_Tarea:'', 
      Id_Beneficiario:'',
      NombreBeneficiario:'',
      NombreEncargado:'',
      NombreAsistente:'',
      NombreSupervisor:'',
      Id_Encargado:localStorage.getItem('Id_Usuario'),
      Id_Asistente:'',
      Id_Supervisor:'',
      Tipo:'1',
      Estado:'1',
      Avance:'',
      Tarea:'',
      Inicio:'',
      FechaInicio:'',
      Fin:'',
      FechaFin:''
    }
    this.cerrarPantallaTareas();
    this.loadTareas();
    return true;
  }
  cerrarPantallaTareas(){
    this.PantallaTareas = false;
  }
  async loadTarea(Tarea){
    this.Tarea = Tarea;
  }

  async loadTareas(search?:any){
    this.Tareas = [];
    let data = await this.tareasService.leerTareas(this.paginacion,'',this.Persona.Id_Persona);
    if(data['total'] == 0){
      this.Tareas = [];
    }else{
      this.Tareas = data['data'];
    }
  }
  searchPersona(){

  }
  keytabPersona(e){}
  SeleccionarPersona(Perso){
    if(this.BotonActivo == 1){
      this.Tarea.Id_Beneficiario = Perso.Id_Persona;
      this.Tarea.NombreBeneficiario = Perso.Nombre;
    }
    if(this.BotonActivo == 2){
      this.Tarea.Id_Encargado = Perso.Id_Persona;
      this.Tarea.NombreEncargado = Perso.Nombre;    
    }
    if(this.BotonActivo == 3){
      this.Tarea.Id_Asistente = Perso.Id_Persona;
      this.Tarea.NombreAsistente = Perso.Nombre;   
    }
    if(this.BotonActivo == 4){
      this.Tarea.Id_Supervisor = Perso.Id_Persona;
      this.Tarea.NombreSupervisor = Perso.Nombre;
    }
    this.closePantallaPersona();
  }
  closePantallaPersona(){
    this.PantallaPersona = false;
  }
  openPantallaPersona(Boton){
    this.BotonActivo = Boton;
    if(Boton ==1){
      this.TipoPersona = 'Beneficiario';
    }
    if(Boton ==2){
      this.TipoPersona = 'Encargado';
    }
    if(Boton ==3){
      this.TipoPersona = 'Asistente';
    }
    if(Boton ==4){
      this.TipoPersona = 'Supervisor';
    }
    this.PantallaPersona = true;
    this.cargarPersona();
  }

  async cargarPersona(){
    let data = await this.contactoService.loadPersonas(this.paginacionPersona,this.searchFieldPersona,5,1);
    this.Personas = data.data;
  }
}
