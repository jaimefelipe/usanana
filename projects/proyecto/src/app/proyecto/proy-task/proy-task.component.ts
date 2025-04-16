import { Component, OnInit,EventEmitter   } from '@angular/core';
import { TaskFormService } from '../task-form/task-form.service';
import Swal from 'sweetalert2';
import { SplitterModule } from '@syncfusion/ej2-angular-layouts'
declare var webkitSpeechRecognition: any;  // necesaria esta línea para TS
interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
@Component({
  selector: 'app-proy-task',
  templateUrl: './proy-task.component.html',
  styleUrls: ['./proy-task.component.css']
})
export class ProyTaskComponent implements OnInit {
  ItemSelected = new EventEmitter<any>();
  NewItem = new EventEmitter<any>();
  UpdateItem = new EventEmitter<any>();
  CrearItem = new EventEmitter<any>();
  nuevaTareaCreada = new EventEmitter<any>();

  PantallaLoading = false;
  ItemSeleccionado:any;
  LastItemSelected:any;
  Empresa = localStorage.getItem("Nombre");
  nivelActual = '0';
  nivelSeleccionado = false;
  NivelText = ' Portafolio';
  Edit = false;
  recognition: any;
  filtroBusqueda: string = '';
  // Para usar reconocimiento de voz
  escuchando: boolean = false;
  Proyecto = {
    Tipo:'7',
    Nivel:'7',
    Codigo:'',
    Padre:'',
    Nombre:'',
    Inicio_Planificado:'',
    Fin_Planificado:'',
    Duracion_Estimada:'1',
    Estado:'1',
    Responsable:'',
    ResponsableNombre:'',
  }
  constructor(
    private taskFormService:TaskFormService
  ) { }

  ngOnInit() {
    this.Edit = false;
    //const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    //this.recognition = new SpeechRecognition();
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'es-ES';
    this.recognition.continuous = false;
  
    this.recognition.onresult = (event: any) => {
      const texto = event.results[0][0].transcript;
      this.filtroBusqueda = texto;
      this.escuchando = false;
    };
  
    this.recognition.onend = () => {
      this.escuchando = false;
    };
  }
  
  views = [
    { name: 'Lista', key: 'tareas' },
    { name: 'Kanban', key: 'kanban' },
    { name: 'Calendar', key: 'calendar' },
    { name: 'Gantt', key: 'gantt' }
  ];

  selectedView = 'kanban';
  filteredTasks: any[] = [];

  selectView(view: any) {
    this.selectedView = view.key;
  }

  onNodeSelected(node: any) {
    this.filteredTasks = node.subtasks || [];
  }
  newItem(Item){
    this.Proyecto = Item;
  }
  updateItem(Item){
    this.Proyecto = Item;
  }
  itemSeleccionadoEnTreeView(Id){
    this.ItemSeleccionado = Id;
  }
  tareaSeleccionadaEnList(Tarea){
    this.LastItemSelected = this.ItemSeleccionado;
    this.ItemSeleccionado = Tarea;
    this.Edit = true;
  }
  cerrarPanel(){
    this.ItemSeleccionado = this.LastItemSelected;
    this.nivelSeleccionado = false;
    this.Edit = false;
  }
  nuevaTarea(){
    this.nivelSeleccionado = true;
    this.Edit = true;
  }
  cambioNivel(Nivel){
    this.nivelActual = Nivel;
    if(this.nivelActual == '0'){
      this.NivelText = ' Portafolio';
    }
    if(this.nivelActual == '1'){
      this.NivelText = ' Programa';
    }
    if(this.nivelActual == '2'){
      this.NivelText = ' Proyecto';
    }
    if(this.nivelActual == '3'){
      this.NivelText = ' Fase';
    }
    if(this.nivelActual == '4'){
      this.NivelText = ' Entregable';
    }
    if(this.nivelActual == '5'){
      this.NivelText = ' Tarea';
    }
    if(this.nivelActual == '6'){
      this.NivelText = ' Actividad';
    }
   } 
   iniciarDictado() {
    this.escuchando = true;
    this.recognition.start();
  }
  
  detenerDictado() {
    this.escuchando = false;
    this.recognition.stop();
  }
  
  enviarPrompt() {
    this.PantallaLoading = true;
    fetch('https://toxo.work/reportes/proyecto/procesar_prompt.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ prompt: this.filtroBusqueda })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok') {
        //console.log('Acción recibida:', data.accion);
        this.manipularData(data.accion);  // <-- aquí tienes acceso directo
      } else {
        console.error('Error:', data.message);
        if(data.raw_response){
          console.error('Respuesta incorrecta:', data.raw_response);
        }
        this.PantallaLoading = false;
      }
    })
    .catch(err => {
      console.error('Error al conectar:', err);
      this.PantallaLoading = false
    });
  }
  async manipularData(accion: any) {
    if(accion.detalle == ''){
      this.reproducirAudio('Por Favor indique un nombre o descripción');
      return false;
    }
    this.Proyecto.Nombre = accion.detalle;
    switch(accion.actividad) { 
      case 'Portafolio': { 
         //statements; 
         this.Proyecto.Nivel = '1';
         this.Proyecto.Tipo = '1';
         await this.calcularCodigoYPadre('');
         await this.crearTarea();
         break; 
      } 
      case 'Programa': { 
        this.Proyecto.Nivel = '2';
         this.Proyecto.Tipo = '2';
        //statements; 
        break; 
      }
      case 'Proyecto': { 
        //statements; 
        this.Proyecto.Nivel = '3';
         this.Proyecto.Tipo = '3';
        break; 
      } 
      case 'Fase': { 
        //statements; 
        this.Proyecto.Nivel = '4';
         this.Proyecto.Tipo = '4';
        break; 
      }
      case 'Entregable': {
        this.Proyecto.Nivel = '5';
         this.Proyecto.Tipo = '5'; 
        //statements; 
        break; 
      }  
      case 'Tarea': { 
        this.Proyecto.Nivel = '6';
         this.Proyecto.Tipo = '6';
        //statements; 
        break; 
      }  
      default: { 
        //statements; 
        this.Proyecto.Nivel = '7';
         this.Proyecto.Tipo = '7';
        this.procesarActividad(accion)
        break; 
     } 
    
   } 
    //Determinar si la fecha; o Hora no vienen;

    return true;
  }
  procesarActividad(accion){
    if( (accion.actividad =='Actividad'|| accion.actividad == 'Reunion') && (accion.fecha === '' ||  accion.hora === '')){
      this.reproducirAudio('Por Favor indique la fecha y la hora');
      //Swal.fire('Favor indique la fecha y la hora de la actividad');
      this.PantallaLoading = false;
      return false;
    }
    return true
    /*
    // Detarminar la Tarea por defecto
    if(this.TareaAtiva ==='' || !this.TareaAtiva){
      await this.seleccionarTarea(accion);
    }*/
  }
  async calcularCodigoYPadre(Id_Tarea){
    let data1 = await this.taskFormService.getLastProyectId(Id_Tarea);
    let UltimoCodigo = data1['data'][0]['Codigo'];
    let CantidadHijos = data1['data'][0]['Cantidad_Subproyectos'];
    if(UltimoCodigo == '0'){
      this.Proyecto.Codigo = (parseInt(CantidadHijos) + 1).toString();
    }else{
      this.Proyecto.Codigo = UltimoCodigo + '.' + (parseInt(CantidadHijos) + 1);
    }
  }
  async crearTarea(){
    let data2 = await this.taskFormService.newProyecto(this.Proyecto);
    this.nuevaTareaCreada.emit();
  }

  reproducirAudio(texto: string) {
    const audioUrl = 'https://toxo.work/reportes/proyecto/generar_audio.php?texto=' + encodeURIComponent(texto);
    let audio = new Audio(audioUrl);
    audio.play();
  }
}