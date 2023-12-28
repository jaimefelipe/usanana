import { Component, OnInit } from '@angular/core';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TareasService } from './tareas.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class TareasComponent implements OnInit {

  constructor(
    private contactoService:ContactoService,
    private tareasService:TareasService
    ) { }
    hoy = new Date();
  edit = false;
  PantallaBeneficiario= false;
  PantallaPersona = false;
  searchField = '';
  searchFieldBeneficiarios = '';
  searchFieldPersona = '';
  BotonActivo = 0;
  TipoPersona = '';


  Tareas =[];
  Beneficiarios=[];
  Personas = [];
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
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  paginacionBeneficiario = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  paginacionPersona = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

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
  

  ngOnInit(): void {
    this.cargarBeneficiarios();
    this.leerTareas();
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
    //this.loadPeriodos();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
   // this.loadPeriodos(this.searchField);
  }

  cancel(){
    this.edit = false;
  }
  editRecord(Tarea){
   this.edit = true;
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
   }
  }

  async leerTareas(){
    let data = await this.tareasService.leerTareas(this.paginacion,this.searchField)
    if(data['total'] == 0){
      this.Tareas = [];
    }else{
      this.Tareas = data['data'];
      console.log(data)
    }
  }
  async grabar(){
    if(this.Tarea.Id_Tarea == ''){
      await this.tareasService.nuevaTarea(this.Tarea);
    }else{
      await this.tareasService.actualizarTarea(this.Tarea);
    }
    this.leerTareas()
    this.closePantallaBeneficiario();
  }

  openBeneficiarioPanel(){
    this.PantallaBeneficiario = true;
  }
  closePantallaBeneficiario(){
    this.edit = false;
  }
  searchBeneficiarios(){
    this.cargarBeneficiarios();
  }
  keytabBeneficiarios(event){
    if (event.key === 'Enter') {
      this.searchBeneficiarios();
    }
  }
  async SeleccionarBeneficiario(Beneficiario){
    this.Tarea.Id_Beneficiario = Beneficiario.Id_Persona;
    this.Tarea.NombreBeneficiario = Beneficiario.Nombre;
    this.closePantallaBeneficiario();
  }
  async cargarBeneficiarios(){
    let data = await this.contactoService.loadPersonas(this.paginacionBeneficiario,this.searchFieldBeneficiarios);
    this.Beneficiarios = data.data;
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
  