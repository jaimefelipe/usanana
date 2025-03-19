import { Component, OnInit,Input,OnChanges,SimpleChanges   } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { TaskFormService } from './task-form.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import Swal from "sweetalert2";

interface FechaInterface {
  year: number;
  month: number;
  day: number;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class TaskFormComponent implements OnInit {
  @Input() ItemSelected: number;
  @Output() NewItem = new EventEmitter<any>();
  @Output() UpdateItem = new EventEmitter<any>();
  @Output() CerrarPanel = new EventEmitter<any>();
  @Output() CambioNivelEnForm = new EventEmitter<any>();
  @Input() nivelEnElForm:boolean;
  NivelUsuario = localStorage.getItem('ToxoUT');
  UltimoCodigo = '';
  Id_Proyecto_Actual = ''
  CantidadHijos:''
  task: any = {};
  constructor(
    private taskFormService:TaskFormService,
    private contactoService:ContactoService
  ) { 
    
  }

  public toolbarOptions: object = {
    items: ['Undo', 'Redo', '|',
        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
        'SubScript', 'SuperScript', '|',
        'LowerCase', 'UpperCase', '|',
        'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
        'Indent', 'Outdent', '|', 'CreateLink',
        'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };
  hoy = new Date();

  GeneralTabActivo = true;
  SeguimientoTabActivo = false;
  MiembroPanel = false;
  FechasPanel = false;
  NotasPanel = false;
  PanelBusquedaMiembros = false;
  EditNotasPanel = false;

  Seguimientos = [];
  Miembros = [];
  Contactos = [];

  NivelActual = '1';
  CodigoActual = '';
  Seguimiento = '';
  searchFieldMiembro = '';
  tipoActual = '1';
  GeneralClass = 'text-success tablinks active';
  SeguimientoClass = '';
  FechaHoy = this.hoy.getDate() + '-'+  this.hoy.getMonth() + 1 + "-"+ this.hoy.getFullYear();
  FechaGeneral =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  
  Proyecto = {
    Id_Proyecto:'',
    Tipo:'0',
    Nivel:'0',
    Codigo:'',
    Padre:'',
    Nombre: '',
    Descripcion:'',
    Objetivo:'',
    Alcance:'',
    Restricciones:'',
    
    Estado:'1',
    Prioridad:'1',
    Miembros:'',
    Progreso:'',
    
    Cliente:'',
    ClienteNombre:'',
    Responsable:'',
    ResponsableNombre:'',
    Supervidor:'',
    SupervidorNombre:'',
    Colaborador:'',
    ColaboradorNombre:'',
    Patrocinador:'',
    PatrocinadorNombre:'',
    Promotor:'',
    PromotorNombre:'',
    Interesado:'',
    InteresadoNombre:'',
    Inicio:'',
    FechaInicio: { year: 1, month: 1, day: 1 },
    HInicio:'',
    Fin:'',
    FechaFin: { year: 1, month: 1, day: 1 },
    HFin:'',
    Inicio_Planificado:'',
    FechaInicioPlanificado:{ year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate() },
    Fin_Planificado:'',
    FechaFinPlanificado:{ year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate() },
    Duracion_Estimada:'',
    Tiempo_Real:'',
  }
  
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  ngOnInit() {
    this.Proyecto.FechaFin = this.FechaGeneral;
    this.Proyecto.FechaInicio = this.FechaGeneral;
    this.Proyecto.FechaInicioPlanificado = this.FechaGeneral;
    this.Proyecto.FechaFinPlanificado  =this.FechaGeneral;
  }

  onChange(event: any) {
    this.Proyecto.Descripcion = event.value; // Actualiza el modelo con el contenido del editor
  }

  closeEditPanel(){
    this.inicializarProyecto();
    this.CerrarPanel.emit();
  }
  cambioEstado(event){
    //Camibios de estado
    if(this.Proyecto.Estado == '2'){
        this.Proyecto.FechaInicio = { year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate() };
    }
    if(this.Proyecto.Estado == '6'){
      this.Proyecto.FechaFin = { year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate() };
    }

  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes['ItemSelected']){
      this.Proyecto.Id_Proyecto = changes['ItemSelected']['currentValue'];
      if(this.Proyecto.Id_Proyecto){
        this.Id_Proyecto_Actual =this.Proyecto.Id_Proyecto;
        this.leerProyecto();
      }
    }else{
      if(changes['nivelEnElForm']){
        this.NivelActual = changes['nivelEnElForm']['currentValue'];
        if(this.Proyecto.Nivel == '0'){
          this.nuevoPadre();
        }else{
          this.nuevoHijo();
        }
      }
    }
  }
   /**Acciones sobre los tabs */
   activarGeneralTab(){
    this.GeneralTabActivo = true;
    this.SeguimientoTabActivo = false;
    this.GeneralClass = 'text-success tablinks active';
    this.SeguimientoClass = '';
  }
  activarSeguimientotab(){
    this.GeneralTabActivo = false;
    this.SeguimientoTabActivo = true;
    this.GeneralClass = '';
    this.SeguimientoClass = 'text-success tablinks active';
  }


  async leerProyecto(){
    let data = await this.taskFormService.leerProyecto(this.Proyecto.Id_Proyecto)
   
    if (data['total'] == 1) {
      this.Proyecto = data['data'][0];
      
       this.Proyecto.Descripcion= this.Proyecto.Descripcion.replace(/&quot;/g, '"');
       this.UltimoCodigo = this.Proyecto.Codigo;
       //cargarFechas
      let FechaInicio = this.Proyecto.Inicio.split('-');
      this.Proyecto.FechaInicio = {
        month: parseInt(FechaInicio[1]),
        day: parseInt(FechaInicio[2]),
        year: parseInt(FechaInicio[0])
      }
      let FechaFin = this.Proyecto.Fin.split('-');
      this.Proyecto.FechaFin = {
        month: parseInt(FechaFin[1]),
        day: parseInt(FechaFin[2]),
        year: parseInt(FechaFin[0])
      }
      let FechaInicioPlanificada = this.Proyecto.Inicio_Planificado.split('-');
      this.Proyecto.FechaInicioPlanificado = {
        month: parseInt(FechaInicioPlanificada[1]),
        day: parseInt(FechaInicioPlanificada[2]),
        year: parseInt(FechaInicioPlanificada[0])
      }
      let FechaFinPlanificada = this.Proyecto.Fin_Planificado.split('-');
      this.Proyecto.FechaFinPlanificado = {
        month: parseInt(FechaFinPlanificada[1]),
        day: parseInt(FechaFinPlanificada[2]),
        year: parseInt(FechaFinPlanificada[0])
      }
      let horaIniciArr = this.Proyecto.Inicio.split(" ");
      let horaFinArr = this.Proyecto.Fin.split(" ");
      this.Proyecto.HInicio = horaIniciArr[1];
      this.Proyecto.HFin = horaFinArr[1];
      
      if(!this.Proyecto.Nivel){
        this.Proyecto.Nivel = '0';
      }
      await this.leerSeguimientos();
      this.CambioNivelEnForm.emit(this.Proyecto.Nivel);
    }else{
      this.inicializarProyecto();
      this.UltimoCodigo = '';
    }
    
  }

   //Seguimientos
   async leerSeguimientos(){
    let data = await this.taskFormService.leerNotas(this.Proyecto.Id_Proyecto);
      
    if (data['total'] == 0) {
      this.Seguimientos = [];
    }else{
      this.Seguimientos = data['data'];
      for (let Seguimiento of this.Seguimientos){
        let Letras = Seguimiento.Nombre.split(' ');
        Seguimiento.Nombre = Letras[0].substring(0,1)+ Letras[1].substring(0,1);
        Seguimiento.Fecha = Seguimiento.Fecha //.substring(0,10)
      }
    }
  }

  async getLastProyectoId(Nivel?){
    console.log('getLastProyectoId',Nivel);
      //obtener el Id el ultimo portafolio para generar uno nuevo
    if(!Nivel){
      Nivel = '';
    }
    let data = await this.taskFormService.getLastProyectId(Nivel);
    if (data['total'] == 0) {
      this.UltimoCodigo = '0';
    }else{
      if(Nivel == ''){
        this.UltimoCodigo = data['total'];
       // this.CantidadHijos = ;
      }else{
        this.UltimoCodigo = data['data'][0]['Codigo'];
        this.CantidadHijos = data['data'][0]['Cantidad_Subproyectos'];
      }
    }
    
  }
    async nuevoPadre(){
      console.log('Nuevo Padre')
      this.inicializarProyecto();
      await this.getLastProyectoId('');
      this.Proyecto.Nivel = '1';
      this.Proyecto.Codigo = (parseInt(this.UltimoCodigo) + 1).toString();
      this.Proyecto.Tipo = '1';
    }
    async nuevoHijo(){
      console.log('Nuevo Hijo')
      //Deternimar el nivel
      let nivel = this.Proyecto.Nivel;
      let codigo = this.Proyecto.Codigo;
      //Determinar el codigo
      this.inicializarProyecto();
    
      this.Proyecto.Nivel = (parseInt(nivel) +1).toString();
      this.Proyecto.Tipo = this.Proyecto.Nivel;
      this.Proyecto.Padre = codigo;
      await this.getLastProyectoId(this.Id_Proyecto_Actual);
      //this.Proyecto.Codigo = codigo + "."+ (parseInt(this.UltimoCodigo) + 1);
      this.Proyecto.Codigo = this.UltimoCodigo + '.' + (parseInt(this.CantidadHijos) + 1);
    }
    async inicializarProyecto(){
      this.Proyecto = {
        Id_Proyecto:'',
        Tipo:'0',
        Nivel:'0',
        Codigo:'',
        Padre:'',
        Nombre: '',
        Descripcion:'',
        Objetivo:'',
        Alcance:'',
        Restricciones:'',
        
        Estado:'1',
        Prioridad:'1',
        Miembros:'',
        Progreso:'',
        
        Cliente:'',
        ClienteNombre:'',
        Responsable:'',
        ResponsableNombre:'',
        Supervidor:'',
        SupervidorNombre:'',
        Colaborador:'',
        ColaboradorNombre:'',
        Patrocinador:'',
        PatrocinadorNombre:'',
        Promotor:'',
        PromotorNombre:'',
        Interesado:'',
        InteresadoNombre:'',
        Inicio:'',
        FechaInicio:{ year: 1, month: 1, day: 1 },
        HInicio:'',
        Fin:'',
        FechaFin:{ year: 1, month: 1, day: 1 },
        HFin:'',
        Inicio_Planificado:'',
        FechaInicioPlanificado:{ year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate() },
        Fin_Planificado:'',
        FechaFinPlanificado: { year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate() },
        Duracion_Estimada:'',
        Tiempo_Real:'',
      }
    }
    grabar(){
      if(this.Proyecto.Nombre == ""){
        Swal.fire('Debe suministrar el nombre para grabar');
        return false;
      }
      //Enviar evento al treee
      //Convertir Fecha 
    
      this.Proyecto.Inicio = this.Proyecto.FechaInicio.year + '-' + this.Proyecto.FechaInicio.month + '-' + this.Proyecto.FechaInicio.day;
      this.Proyecto.Fin = this.Proyecto.FechaFin.year + '-' + this.Proyecto.FechaFin.month + '-' + this.Proyecto.FechaFin.day;
      this.Proyecto.Inicio_Planificado = this.Proyecto.FechaInicioPlanificado.year + '-' + this.Proyecto.FechaInicioPlanificado.month + '-' + this.Proyecto.FechaInicioPlanificado.day;
      this.Proyecto.Fin_Planificado = this.Proyecto.FechaFinPlanificado.year + '-' + this.Proyecto.FechaFinPlanificado.month + '-' + this.Proyecto.FechaFinPlanificado.day;

      if(this.Proyecto.Id_Proyecto == ''){
        //Proyecto Nuevo
        this.proyectoNuevo()
      }else{
        //actualizar proyecto
        this.actualizarProyecto();
      }
      return true;
    }
    async  proyectoNuevo(){
      let data = await this.taskFormService.newProyecto(this.Proyecto);
      if(data['success'] == 'true'){
        this.Proyecto.Id_Proyecto = data['data'][0]['Identity'];
        this.NewItem.emit(this.Proyecto);
      }
      Swal.fire('Datos Actualizados')
    }
    async actualizarProyecto(){
      let data = await this.taskFormService.updateProyecto(this.Proyecto);
      this.UpdateItem.emit(this.Proyecto)
      Swal.fire('Datos Actualizados')
    }
  
 // Eventos de los miembros
 abrirMiembrosPanel(){
  this.MiembroPanel = true;
  
  this.leerMiembrosProyecto();
}
abrirPanelEdicionNotas(){
  this.EditNotasPanel = true;
}
abrirFechasPanel(){
  this.FechasPanel = true;
}
abrirNotasPanel(){
  this.NotasPanel = true;
}
cerrarPanelEdicionNotas(){
  this.EditNotasPanel = false;
}
cerrarFechasPanel(){
  this.FechasPanel = false;
}
cerrarMiembroPanel(){
  this.MiembroPanel = false;
}
cerrarNotasPanel(){
  this.NotasPanel = false;
}

searchMiembro(){
  //jaime
  this.leerMiembros(this.tipoActual);
}



keytabMiembro(event){
  if (event.key === 'Enter') {
    this.searchMiembro();
  }
}
async leerMiembrosProyecto(){
  let data = await this.taskFormService.leerMiembros(this.Proyecto.Id_Proyecto);
  if (data['total'] == 0) {
    this.Miembros = [];
  }else{
    this.Miembros  = data['data'];
  }
}
selectMiembro(Miembro){
  if(this.tipoActual == '1'){
    this.Proyecto.Cliente = Miembro.Id_Persona;
    this.Proyecto.ClienteNombre = Miembro.Nombre;
  }
  if(this.tipoActual == '2'){
    this.Proyecto.Responsable = Miembro.Id_Persona;
    this.Proyecto.ResponsableNombre = Miembro.Nombre;
  }
  if(this.tipoActual == '3'){
    this.Proyecto.Supervidor = Miembro.Id_Persona;
    this.Proyecto.SupervidorNombre = Miembro.Nombre;
  }
  if(this.tipoActual == '4'){
    this.Proyecto.Colaborador = Miembro.Id_Persona;
    this.Proyecto.ColaboradorNombre = Miembro.Nombre;
  }
  if(this.tipoActual == '5'){
    this.Proyecto.Patrocinador = Miembro.Id_Persona;
    this.Proyecto.PatrocinadorNombre = Miembro.Nombre;
  }
  if(this.tipoActual == '6'){
    this.Proyecto.Promotor = Miembro.Id_Persona;
    this.Proyecto.PromotorNombre = Miembro.Nombre;
  }
  if(this.tipoActual == '7'){
    this.Proyecto.Interesado = Miembro.Id_Persona;
    this.Proyecto.InteresadoNombre = Miembro.Nombre;
  }
  this.cerrarPanelBusquedaMiembros();
}
/*
async deSelectMiembro(miembro,index){
  let data = await this.taskFormService.DesasignarMiembro(this.Proyecto.Id_Proyecto,miembro.Id_Persona);
  this.Miembros.splice(index, 1);
  this.asignarMiembrosTarea();
}
async asignarMiembrosTarea(){
  let MiembroArray = [];
  this.Proyecto.Miembros = "";
  for (let Miembro of this.Miembros){
    let data = await this.taskFormService.AsignarMiembro(this.Proyecto.Id_Proyecto,Miembro.Id_Persona);
    MiembroArray = Miembro.Nombre.split(' ');
    this.Proyecto.Miembros = this.Proyecto.Miembros + MiembroArray[0].substring(0,1)+this.Proyecto.Miembros + MiembroArray[1].substring(0,1)+ " "
  }
}
  */
async leerMiembros(Tipo?){
  let data = await this.contactoService.loadPersonas(this.paginacion,this.searchFieldMiembro,Tipo,1);
  if (data['total'] == 0) {
    this.Contactos = [];
  }else{
    this.Contactos  = data['data'];
  }
}

async agregarSeguimieto(){
  let Seguimiento = {
    Id_Proyecto:this.Proyecto.Id_Proyecto,
    Id_Persona:localStorage.getItem('Id_Usuario'),
    Fecha:this.FechaHoy,
    Nombre:localStorage.getItem('Nombre_Usuario').substring(0,2),
    Nota:this.Seguimiento
  }
  this.Seguimientos.push(Seguimiento);
  this.Seguimiento = '';
  await this.taskFormService.nuevaNota(Seguimiento);
  this.cerrarPanelEdicionNotas();
}

  abrirPanelBusquedaMiembros(Tipo){
    this.tipoActual = Tipo;
    if(Tipo == 1){
      this.leerMiembros(1);
    }else{
      if(Tipo == 2 || Tipo == 3 || Tipo ==4){
        this.leerMiembros(5);
      }else{
        this.leerMiembros(10);
      }
      
    }
    this.PanelBusquedaMiembros = true;
  }
  cerrarPanelBusquedaMiembros(){
    this.PanelBusquedaMiembros = false;
  }
}
