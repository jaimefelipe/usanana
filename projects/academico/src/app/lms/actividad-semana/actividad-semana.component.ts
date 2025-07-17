import { Component, OnInit, Input  } from '@angular/core';
import { ActividadSemanaService } from './actividad-semana.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-actividad-semana',
  templateUrl: './actividad-semana.component.html',
  styleUrls: ['./actividad-semana.component.css']
})
export class ActividadSemanaComponent implements OnInit {

  @Input() Semana: any;
  
  constructor(private actividadService: ActividadSemanaService) {}


  Actividades: any[] = [];
  edit = false;
  fileToUpload: File | null = null;
  Actividad = {
    Id_Actividad: '',
    Id_Empresa: 1,
    Id_Semana: '',
    Nombre: '',
    Instrucciones: '',
    URL:'',
    Fecha_Limite: '',
    Tipo: '',
    Puntaje: 0
  };



  ngOnInit(): void {
    if (this.Semana?.Id_Semana) {
      this.cargarActividades();
    }
  }

  async cargarActividades() {
    if (!this.Semana?.Id_Semana) return;
    let data = await this.actividadService.getActividades(this.Semana.Id_Semana);
    if(data['total']>0){
      this.Actividades =  data['data'];
    }
    else{
      this.Actividades =  []
    }
  }
  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
    }
  }
  abrirNuevo() {
    this.Actividad = {
      Id_Actividad: '',
      Id_Empresa: 1,
      Id_Semana: this.Semana.Id_Semana,
      Nombre: '',
      Instrucciones: '',
      URL:'',
      Fecha_Limite: '',
      Tipo: '',
      Puntaje: 0
    };
    this.edit = true;
  }

  editar(a: any) {
    this.Actividad = { ...a };
    this.edit = true;
  }

  cancelar() {
    this.edit = false;
    this.Actividad = {
      Id_Actividad: '',
      Id_Empresa: 1,
      Id_Semana: this.Semana.Id_Semana,
      Nombre: '',
      Instrucciones: '',
      URL:'',
      Fecha_Limite: '',
      Tipo: '',
      Puntaje: 0
    };
  }
    // En tu componente.ts
  getTipoText(tipo: string): string {
    const tipos: {[key: string]: string} = {
      '1': 'Tarea',
      '2': 'Examen',
      '3': 'Foro',
      '4': 'Presentación'
    };
    return tipos[tipo] || 'Desconocido';
  }
  async grabar() {
    // Validar campos requeridos
    if (!this.Actividad.Nombre || !this.Actividad.Tipo || !this.Actividad.Fecha_Limite) {
      Swal.fire('Complete todos los campos requeridos');
      return;
    }

    // Asignar semana
    this.Actividad.Id_Semana = this.Semana.Id_Semana;

    // Subir archivo si existe
    if (this.fileToUpload) {
      const formData = new FormData();
      formData.append('archivo', this.fileToUpload);
      formData.append('Id_Empresa', localStorage.getItem('Id_Empresa') || '');
      formData.append('Id_Semana', this.Actividad.Id_Semana.toString());

      try {
        const resp = await this.actividadService.subirArchivo(formData);
        
        if (resp && resp.success) {
          this.Actividad.URL = resp.url.replace(/\s/g, '');
        } else {
          const errorMsg = resp?.message || 'Error al subir archivo';
          Swal.fire(errorMsg);
          return;
        }
      } catch (error) {
        console.error('Error en la subida:', error);
        Swal.fire('Error al subir archivo');
        return;
      }
    }

    // Guardar la actividad
    try {
      let resultado;
      if (this.Actividad.Id_Actividad) {
        resultado = await this.actividadService.actualizarActividad(this.Actividad);
      } else {
        resultado = await this.actividadService.crearActividad(this.Actividad);
      }

      if (resultado && resultado.success) {
        Swal.fire('Actividad guardada');
        await this.cargarActividades();
        this.cancelar();
      } else {
        const errorMsg = resultado?.message || 'Error al guardar actividad';
        Swal.fire(errorMsg);
      }
    } catch (error) {
      console.error('Error al guardar actividad:', error);
      Swal.fire('Error al guardar actividad');
    }
  }

  async eliminar(a: any) {
    const confirm = await Swal.fire({
      title: '¿Eliminar actividad?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      const resp = await this.actividadService.eliminarActividad(a.Id_Actividad);
      /*
      if (resp.success === 'true') {
        Swal.fire('Actividad eliminada');
        this.cargarActividades();
      } else {
        Swal.fire('Error al eliminar la actividad');
      }*/
    }
  }

}
