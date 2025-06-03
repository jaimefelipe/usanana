import { Component, OnInit, EventEmitter } from '@angular/core';
import { TareasService } from '../tareas/tareas.service';
import { TaskFormService } from '../../proyecto/task-form/task-form.service';
import { TareasMainService } from './tareas-main.service';
import Swal from 'sweetalert2';


declare var webkitSpeechRecognition: any;  // necesaria esta línea para TS
interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
@Component({
  selector: 'app-tareas-main',
  templateUrl: './tareas-main.component.html',
  styleUrls: ['./tareas-main.component.css']
})
export class TareasMainComponent implements OnInit {
  ItemSelected = new EventEmitter<any>();
  nuevaTareaCreada = new EventEmitter<any>();
  constructor(
    private tareasService:TareasService,
    private taskFormService:TaskFormService,
    private tareasMainService:TareasMainService
  ) { }
  Edit = false;
  PantallaLoading = false;
  ItemSeleccionado = 0;
  Empresa = localStorage.getItem("Empresa");
  nombreUsuario = localStorage.getItem('Nombre_Usuario')
  selectedView = 'tareas';
  LastItemSelected:any;
  TareaAtiva:'';
  prompt = '';
  views = [
    { name: 'Lista', key: 'tareas' },
    { name: 'Kanban', key: 'kanban' },
    { name: 'Calendar', key: 'calendar' }
  ];
  recognition: any;
  transcript: string = '';
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
  ngOnInit() {
    this.leerDatosUsuario();
    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'es-ES'; // idioma español
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      this.transcript = event.results[0][0].transcript;
      console.log('Prompt capturado:', this.transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Error en el reconocimiento:', event.error);
    };
  }
  async leerDatosUsuario(){
    let data = await this.tareasMainService.ObtenerIdPersona(localStorage.getItem('Id_Usuario'));
    if (data.total === 1) {
      this.Proyecto.Responsable = data['data'][0]['Id_Persona'];
      this.Proyecto.ResponsableNombre = data['data'][0]['Nombre'];
    }
  }
  startListening() {
    this.transcript = '';
    this.recognition.start();
  }
  enviarPrompt() {
    this.PantallaLoading = true;
    fetch('https://toxo.work/reportes/proyecto/procesar_prompt.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ prompt: this.transcript })
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
    //Determinar si la fecha; o Hora no vienen;
    if( accion.fecha === '' ||  accion.hora === ''){
      this.reproducirAudio('Favor indique la fecha y la hora de la actividad');
      Swal.fire('Favor indique la fecha y la hora de la actividad');
      this.PantallaLoading = false;
      return false;
    }
    // Detarminar la Tarea por defecto
    if(this.TareaAtiva ==='' || !this.TareaAtiva){
      await this.seleccionarTarea(accion);

    }
    return true;
  }
  seleccionarTarea(accion){
    //Preguntar si se agregan las actividades a la ultima tarea o a alguna de las tareas activas
    Swal.fire({
            title: 'Crear Actividad en la ulitma tarea en que se trabajo?',
            text: "Se tilizara la ultima tarea que recibio cualquier tipo de cambio!",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Usuar la ultima tarea!'
          }).then((result) => {
            if (result.value) {
              //Seleccionar Ultima tarea asignada
              this.ultimaTareadelUsiario(accion);
            }else{
              //Recuperar tareas asignadas al usuario.
              this.PantallaLoading = false;
            }
          });
  }
  async ultimaTareadelUsiario(accion){
    let data = await this.tareasService.getLastTaskByUser();
    if (data.total === 1) {
      this.Proyecto.Padre = data['data'][0]['Padre'];
      this.TareaAtiva = data['data'][0]['Id_Proyecto'];
      
      let data1 = await this.taskFormService.getLastProyectId(this.TareaAtiva);
      let UltimoCodigo = data1['data'][0]['Codigo'];
      let CantidadHijos = data1['data'][0]['Cantidad_Subproyectos'];
      this.Proyecto.Codigo = UltimoCodigo + '.' + (parseInt(CantidadHijos) + 1);
      this.Proyecto.Nombre = accion.detalle;
      this.Proyecto.Inicio_Planificado = accion.fecha + ' ' + accion.hora;
      this.Proyecto.Fin_Planificado = accion.fechaFin + ' ' + accion.horaFin;
      this.Proyecto.Duracion_Estimada = accion.duracion;
      
      let data2 = await this.taskFormService.newProyecto(this.Proyecto);
      this.nuevaTareaCreada.emit();
    }
    this.PantallaLoading = false;
  }

  stopListening() {
    this.recognition.stop();
  }
  selectView(view){
    this.selectedView = view.key;
  }
  cerrarPanel(){
    this.Edit = false;
    this.ItemSeleccionado = -1;
  }
  tareaSeleccionadaEnList(Tarea){
    this.LastItemSelected = this.ItemSeleccionado;
    this.ItemSeleccionado = Tarea;
    this.Edit = true;
  }
  obtenerTareasUsuario(){
    //Otener las tareas que estan activas para el usuario.

  }
  obtenerIdDelUsuario(){

  }

  reproducirAudio(texto: string) {
    const audioUrl = 'https://toxo.work/reportes/proyecto/generar_audio.php?texto=' + encodeURIComponent(texto);
    let audio = new Audio(audioUrl);
    audio.play();
  }
}
