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
  Portafolios = [];
  Programas = [];
  Proyectos = [];
  Fases = [];
  Entregables = [];
  Tareas = [];
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
  InfoPanel = false;

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
    year: this.hoy.getFullYear(),
    hour: this.hoy.getHours(),
    minute: this.hoy.getMinutes(),
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
    FechaInicio: { year: 1, month: 1, day: 1, hour:1, minute:1},
    HInicio:'',
    Fin:'',
    FechaFin: { year: 1, month: 1, day: 1, hour:1, minute:1 },
    HFin:'',
    Inicio_Planificado:'',
    FechaInicioPlanificado:{ year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate(), hour:this.hoy.getHours(), minute:this.hoy.getMinutes() },
    Fin_Planificado:'',
    FechaFinPlanificado:{ year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate(), hour:this.hoy.getHours(), minute:this.hoy.getMinutes() },
    Duracion_Estimada:'',
    Tiempo_Real:'',
    Portafolio:'',
    Codigo_Portafolio:'',
    Programa:'',
    Codigo_Programa:'',
    Proyecto:'',
    Codigo_Proyecto:'',
    Fase:'',
    Codigo_Fase:'',
    Entregable:'',
    Codigo_Entregable:'',
    Tarea:'',
    Codigo_Tarea:''
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
    this.hoy = new Date(); // asegurar fecha actualizada

    if(this.Proyecto.Estado == '2'){
        this.Proyecto.FechaInicio = { year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate(), hour:this.hoy.getHours(), minute:this.hoy.getMinutes() };
    }
    if(this.Proyecto.Estado == '6'){
      this.Proyecto.FechaFin = { year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate(), hour:this.hoy.getHours(), minute:this.hoy.getMinutes() };
      
      // Ahora calcular la diferencia:
      const fechaInicio = new Date(
        this.Proyecto.FechaInicio.year,
        this.Proyecto.FechaInicio.month - 1,
        this.Proyecto.FechaInicio.day,
        this.Proyecto.FechaInicio.hour,
        this.Proyecto.FechaInicio.minute
      );

      const fechaFin = new Date(
        this.Proyecto.FechaFin.year,
        this.Proyecto.FechaFin.month - 1,
        this.Proyecto.FechaFin.day,
        this.Proyecto.FechaFin.hour,
        this.Proyecto.FechaFin.minute
      );

      // Diferencia en milisegundos
      const diffMs = fechaFin.getTime() - fechaInicio.getTime();

      // Conversión a días, horas y minutos
      const totalMinutos = Math.floor(diffMs / 60000);
      const dias = Math.floor(totalMinutos / (24 * 60));
      const horas = Math.floor((totalMinutos % (24 * 60)) / 60);
      const minutos = totalMinutos % 60;

      // Guardar en formato días:horas:minutos
      this.Proyecto.Tiempo_Real = `${dias}:${horas}:${minutos}`;
    }
    // Agregar seguimiento
    let Estado = '';
    switch (this.Proyecto.Estado) {
      case "1":
        Estado = 'Pendiente';
        break;
      case "2":
        Estado = 'En Proceso';
        break;
      case "3":
        Estado = 'Ajustes';
        break;
      case "4":
        Estado = 'Visto Bueno';
        break;
      case "5":
        Estado = 'Aprobado';
        break;
      case "6":
        Estado = 'Terminado';
        break;
      case "7":
        Estado = 'Bloqueada';
        break;
    }
    this.Seguimiento = 'Actividad cambia estado a '+Estado;
    this.agregarSeguimieto();
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
    await this.leerSeguimientos();
    
    let data = await this.taskFormService.leerProyecto(this.Proyecto.Id_Proyecto)
    if (data['total'] == 1) {
      this.Proyecto = data['data'][0];
      
      this.Proyecto.Descripcion= this.Proyecto.Descripcion.replace(/&quot;/g, '"');
      this.UltimoCodigo = this.Proyecto.Codigo;
       //cargarFechas
      let ArrFechaHoraInicio = this.Proyecto.Inicio.split(' ');

      let ArrFechaInicio = ArrFechaHoraInicio[0];
      let ArrHoraInicio = ArrFechaHoraInicio[1];

      let FechaInicio = ArrFechaInicio.split('-');
      let FechaIncioHora = ArrHoraInicio.split(':');

      this.Proyecto.FechaInicio = {
        month: parseInt(FechaInicio[1]),
        day: parseInt(FechaInicio[2]),
        year: parseInt(FechaInicio[0]),
        hour: parseInt(FechaIncioHora[0]),
        minute: parseInt(FechaIncioHora[1])
      }

      let ArrFechaHoraFin = this.Proyecto.Fin.split(' ');
      let ArrFechaFin = ArrFechaHoraFin[0];
      let ArrHoraFin = ArrFechaHoraFin[1];

      let FechaFin = ArrFechaFin.split('-');
      let FechaFinHora = ArrHoraFin.split(':');

      this.Proyecto.FechaFin = {
        month: parseInt(FechaFin[1]),
        day: parseInt(FechaFin[2]),
        year: parseInt(FechaFin[0]),
        hour: parseInt(FechaFinHora[0]),
        minute: parseInt(FechaFinHora[1])
      }

      let ArrFechaHoraInicioPlanificado = this.Proyecto.Inicio_Planificado.split(' ');
      let ArrFechaInicioPlanificado = ArrFechaHoraInicioPlanificado[0];
      let ArrHoraInicioPlanificado = ArrFechaHoraInicioPlanificado[1];

      let FechaInicioPlanificado = ArrFechaInicioPlanificado.split('-');
      let FechaInicioPlanificadoHora = ArrHoraInicioPlanificado.split(':');

      this.Proyecto.FechaInicioPlanificado = {
        month: parseInt(FechaInicioPlanificado[1]),
        day: parseInt(FechaInicioPlanificado[2]),
        year: parseInt(FechaInicioPlanificado[0]),
        hour: parseInt(FechaInicioPlanificadoHora[0]),
        minute: parseInt(FechaInicioPlanificadoHora[1])
      }

      let ArrFechaHoraFinPlanificado = this.Proyecto.Fin_Planificado.split(' ');
      let ArrFechaFinPlanificado = ArrFechaHoraFinPlanificado[0];
      let ArrHoraFinPlanificado = ArrFechaHoraFinPlanificado[1];

      let FechaFinPlanificado = ArrFechaFinPlanificado.split('-');
      let FechaFinPlanificadoHora = ArrHoraFinPlanificado.split(':');

      this.Proyecto.FechaFinPlanificado = {
        month: parseInt(FechaFinPlanificado[1]),
        day: parseInt(FechaFinPlanificado[2]),
        year: parseInt(FechaFinPlanificado[0]),
        hour: parseInt(FechaFinPlanificadoHora[0]),
        minute: parseInt(FechaFinPlanificadoHora[1])
      }

      let horaIniciArr = this.Proyecto.Inicio.split(" ");
      let horaFinArr = this.Proyecto.Fin.split(" ");
      this.Proyecto.HInicio = horaIniciArr[1];
      this.Proyecto.HFin = horaFinArr[1];
      
      if(!this.Proyecto.Nivel){
        this.Proyecto.Nivel = '0';
      }
      console.log(this.Proyecto)
      this.CambioNivelEnForm.emit(this.Proyecto.Nivel);
    }else{
      this.inicializarProyecto();
      this.UltimoCodigo = '';
    }
  }

   //Seguimientos
   async leerSeguimientos(){
    let data1 = await this.taskFormService.leerNotas(this.Proyecto.Id_Proyecto);
      
    if (data1['total'] == 0) {
      this.Seguimientos = [];
    }else{
      this.Seguimientos = data1['data'];
      for (let Seguimiento of this.Seguimientos){
        let Letras = Seguimiento.Nombre.split(' ');
        Seguimiento.Nombre = Letras[0].substring(0,1)+ Letras[1].substring(0,1);
        Seguimiento.Fecha = Seguimiento.Fecha //.substring(0,10)
      }
    }
  }

  async getLastProyectoId(Nivel?){
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
      this.inicializarProyecto();
      await this.getLastProyectoId('');
      this.Proyecto.Nivel = '1';
      this.Proyecto.Codigo = (parseInt(this.UltimoCodigo) + 1).toString();
      this.Proyecto.Tipo = '1';
    }
    async nuevoHijo(){
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
      if(this.UltimoCodigo == '0'){
        this.Proyecto.Codigo = (parseInt(this.CantidadHijos) + 1).toString();
      }else{
        this.Proyecto.Codigo = this.UltimoCodigo + '.' + (parseInt(this.CantidadHijos) + 1);
      }
      
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
        FechaInicio: { year: 1, month: 1, day: 1, hour:1, minute:1},
        HInicio:'',
        Fin:'',
        FechaFin: { year: 1, month: 1, day: 1, hour:1, minute:1 },
        HFin:'',
        Inicio_Planificado:'',
        FechaInicioPlanificado:{ year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate(), hour:this.hoy.getHours(), minute:this.hoy.getMinutes() },
        Fin_Planificado:'',
        FechaFinPlanificado:{ year: this.hoy.getFullYear() , month: this.hoy.getMonth() + 1 , day: this.hoy.getDate(), hour:this.hoy.getHours(), minute:this.hoy.getMinutes() },
        Duracion_Estimada:'',
        Tiempo_Real:'',
        Portafolio:'',
        Codigo_Portafolio:'',
        Programa:'',
        Codigo_Programa:'',
        Proyecto:'',
        Codigo_Proyecto:'',
        Fase:'',
        Codigo_Fase:'',
        Entregable:'',
        Codigo_Entregable:'',
        Tarea:'',
        Codigo_Tarea:''
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
        if(this.Proyecto.Nivel != '7'){
          this.NewItem.emit(this.Proyecto);
        }
      }
      //Swal.fire('Datos Actualizados')
      Swal.fire({
              title: 'Datos Actualizados',
              text: "Desea cerrar pantalla actual",
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, Cerrar Pantalla'
            }).then((result) => {
              if (result.value) {
                this.closeEditPanel();
              }
            });
    }
    async actualizarProyecto(){
      let data = await this.taskFormService.updateProyecto(this.Proyecto);
      this.UpdateItem.emit(this.Proyecto)
      Swal.fire({
        title: 'Datos Actualizados',
        text: "Desea cerrar pantalla actual",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Cerrar Pantalla'
      }).then((result) => {
        if (result.value) {
          this.closeEditPanel();
        }
      });
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
abrirInfoPanel(){
  this.leerProyectosHijos('','1');
  this.InfoPanel = true;
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
cerrarInfoPanel(){
  this.InfoPanel = false;
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

  async leerProyectosHijos(Padre, Nivel) {
    let data = await this.taskFormService.leerPortaProyectosHijos(Padre, Nivel);
    if (data['total'] > 0) {
      switch (Nivel) {
        case "1":
          this.Portafolios = data['data'];
          await this.leerProyectosHijos(this.Proyecto.Portafolio, "2");
          break;
        case "2":
          this.Programas = data['data'];
          await this.leerProyectosHijos(this.Proyecto.Programa, "3");
          break;
        case "3":
          this.Proyectos = data['data'];
          await this.leerProyectosHijos(this.Proyecto.Proyecto, "4");
          break;
        case "4":
          this.Fases = data['data'];
          await this.leerProyectosHijos(this.Proyecto.Fase, "5");
          break;  
        case "5":
          this.Entregables = data['data'];
          await this.leerProyectosHijos(this.Proyecto.Entregable, "6");
          break;
        case "6":
          this.Tareas = data['data'];
          break;
      }
    }else{
      const nivel = parseInt(Nivel, 10);
      if (nivel <= 1) this.Portafolios = [];
      if (nivel <= 2) this.Programas = [];
      if (nivel <= 3) this.Proyectos = [];
      if (nivel <= 4) this.Fases = [];
      if (nivel <= 5) this.Entregables = [];
      if (nivel <= 6) this.Tareas = [];
    }
  }
  cambioTarea(Nivel?){
    this.moverNodoYReestructurar(Nivel)

  }
  async moverNodoYReestructurar(Nivel) {
    //1 Hay que saber cual es el nodo actual cual es su padre
    let NivelAcutal = this.Proyecto.Id_Proyecto;
    let PadreActual = this.Proyecto.Padre;
    //2 hay que saber cuales hijos tiene

    //3 hay que saber cual es el nodo sobre el que se quiere mover y su padre
    let NuevoPadreId = '';
    switch (Nivel) {
      case 1:
        NuevoPadreId = this.Proyecto.Codigo_Portafolio; 
        await this.leerProyectosHijos(this.Proyecto.Portafolio, "2");
        break;
      case 2:
        NuevoPadreId = this.Proyecto.Codigo_Programa; 
        await this.leerProyectosHijos(this.Proyecto.Programa, "3"); 
        break;
      case 3:
        NuevoPadreId = this.Proyecto.Codigo_Proyecto; 
        await this.leerProyectosHijos(this.Proyecto.Proyecto, "4"); 
        break;
      case 4:
        NuevoPadreId = this.Proyecto.Codigo_Fase;
        await this.leerProyectosHijos(this.Proyecto.Fase, "5"); 
        break;  
      case 5:
        NuevoPadreId = this.Proyecto.Codigo_Entregable;
        await this.leerProyectosHijos(this.Proyecto.Entregable, "6");
        break;
      case 6:
        NuevoPadreId = this.Proyecto.Codigo_Tarea;
        break;
    }
    //Generar NuevoCodigoHijo
    //let data = await this.taskFormService.getLastProyectId(Nivel.toString());
    //let CantidadHijos = data['data'][0]['Cantidad_Subproyectos'];
    //let NuevoCodigo = NuevoPadreId + '.' + (parseInt(CantidadHijos) + 1);
    //console.log(Nivel);
    //console.log(NuevoPadreId);
    //console.log(NuevoCodigo);
    
    //4 hay que ir regorriendo el array y cambiando el codigo


  }
}
