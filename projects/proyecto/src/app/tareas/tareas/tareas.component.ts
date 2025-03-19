import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { TareasService } from './tareas.service';

interface Task {
  Id_Proyecto: number;
  Nombre: string;
  Inicio_Planificado: string;
  Responsable: string;
  Prioridad:number;
  Estado:number;
}

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {
  ItemSelected = new EventEmitter<any>();
  @Output() TareaSeleccionadaEnList = new EventEmitter<any>(); 
  tasks: Task[] = [];
  tasksVencidas: Task[] = [];
  tasksHoy: Task[] = [];
  tasksManana: Task[] = [];
  tasksFuturas: Task[] = [];
  views = [
    { name: 'Lista', key: 'tareas' },
    { name: 'Gantt', key: 'gantt' },
    { name: 'Kanban', key: 'kanban' },
    { name: 'Calendar', key: 'calendar' }
  ];

  ItemSeleccionado = 0;
  Empresa = localStorage.getItem("Nombre");
  nombreUsuario = localStorage.getItem('Nombre_Usuario')
  constructor(private taskService: TareasService) {}
  Edit = false;
  ngOnInit(): void {
   this.leerTareas();
  }
  selectView(View){

  }
  async leerTareas(){
    let data = await this.taskService.getTasksByUser(localStorage.getItem('Id_Usuario')) ;
    if(data['success'] == 'true'){
     this.tasks = data['data'];
     this.categorizarTareas();
    }else{
      this.tasks = [];
    }
  }
  categorizarTareas(): void {
    const hoy = new Date();
    const manana = new Date();
    manana.setDate(hoy.getDate() + 1);

    this.tasks.forEach(task => {
      const fechaTarea = new Date(task.Inicio_Planificado);
      if (fechaTarea < hoy) {
        this.tasksVencidas.push(task);
      } else if (fechaTarea.toDateString() === hoy.toDateString()) {
        this.tasksHoy.push(task);
      } else if (fechaTarea.toDateString() === manana.toDateString()) {
        this.tasksManana.push(task);
      } else {
        this.tasksFuturas.push(task);
      }
    });
  }

  getPrioridadText(prioridad: number): string {
    return ['Alta', 'Media', 'Baja'][prioridad - 1] || 'Desconocida';
  }
  
  getPrioridadBadge(prioridad: number): string {
    return {
      1: 'badge-danger',  // Alta
      2: 'badge-warning', // Media
      3: 'badge-secondary' // Baja
    }[prioridad] || 'badge-light';
  }
  
  getEstadoText(estado: number): string {
    return ['Pendiente', 'En Proceso', 'Ajustes', 'Visto Bueno', 'Aprobada', 'Terminado', 'Bloqueada'][estado - 1] || 'Desconocido';
  }
  
  getEstadoBadge(estado: number): string {
    return {
      1: 'badge-dark',       // Pendiente
      2: 'badge-primary',    // En Proceso
      3: 'badge-warning',    // Ajustes
      4: 'badge-info',       // Visto Bueno
      5: 'badge-success',    // Aprobada
      6: 'badge-secondary',  // Terminado
      7: 'badge-danger'      // Bloqueada
    }[estado] || 'badge-light';
  }
  editarTarea(tarea){
    this.ItemSeleccionado = tarea.Id_Proyecto;
    this.Edit = true;
    this.TareaSeleccionadaEnList.emit(tarea.Id_Proyecto);
  }
  cerrarPanel(){
    this.leerTareas();
    this.Edit = false;
  }
}
