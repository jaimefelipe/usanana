import { Component, OnInit, Input } from '@angular/core';
import { ActividadAlumnoService } from './actividad-alumno.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividad-alumno',
  templateUrl: './actividad-alumno.component.html',
  styleUrls: ['./actividad-alumno.component.css']
})
export class ActividadAlumnoComponent implements OnInit {
  @Input() actividad: any;
  @Input() IdPersona: number;

  archivoSeleccionado: File | null = null;
  fileToUpload: File | null = null;
  participacion = null;
  enviandoActividad = false;
  actividadEnviada = false;
  mensajeEnvio = '';

  EntregaAlumno = {
    URL: ''
  };

  constructor(
    private actividadAlumnoService: ActividadAlumnoService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    console.log(this.actividad);
    this.leerEntregas();
  }

  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }

  entregar() {
    if (!this.archivoSeleccionado) {
      alert('Debe seleccionar un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', this.archivoSeleccionado);
    formData.append('IdActividad', this.actividad.Id_Actividad);
    formData.append('IdPersona', this.IdPersona.toString());
  }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

      if (!validExtensions.includes(extension || '')) {
        Swal.fire('Tipo de archivo no permitido');
        event.target.value = '';
        return;
      }

      this.fileToUpload = file;
      this.actividadEnviada = false;
      this.mensajeEnvio = '';
    }
  }

  async enviarActividad() {
    if (this.enviandoActividad) {
      return;
    }

    if (!this.actividad.Comentario && !this.fileToUpload) {
      Swal.fire('Debe ingresar un comentario o adjuntar un archivo');
      return;
    }

    this.enviandoActividad = true;
    this.actividadEnviada = false;
    this.mensajeEnvio = 'Enviando actividad...';

    if (this.fileToUpload) {
      const formData = new FormData();
      formData.append('archivo', this.fileToUpload);
      formData.append('Id_Empresa', localStorage.getItem('Id_Empresa') || '');
      formData.append('Id_Actividad', this.actividad.Id_Actividad.toString());

      try {
        const resp = await this.actividadAlumnoService.subirArchivo(formData);
        console.log(resp);
        if (resp && resp.success === true) {
          this.actividad.Url = encodeURI(resp.url);
          console.log(this.actividad.Url);
        } else {
          Swal.fire(resp?.message || 'Error al subir archivo');
          this.mensajeEnvio = '';
          this.enviandoActividad = false;
          return;
        }
      } catch (error) {
        console.error('Error en subida:', error);
        Swal.fire('Error al comunicarse con el servidor');
        this.mensajeEnvio = '';
        this.enviandoActividad = false;
        return;
      }
    }

    try {
      const resultado = await this.actividadAlumnoService.guardarParticipacion(this.actividad);

      if (resultado && (resultado.success === 'true' || resultado.success === true)) {
        this.actividadEnviada = true;
        this.mensajeEnvio = 'Actividad enviada correctamente';
        Swal.fire('Actividad enviada correctamente');
        this.actividad.Comentario = '';
        this.fileToUpload = null;
        await this.leerEntregas();
      } else {
        const mensaje = this.obtenerMensajeErrorEntrega(resultado?.message || 'Error al enviar actividad');
        this.mensajeEnvio = '';
        Swal.fire('Error al enviar actividad', mensaje, 'error');
      }
    } catch (error) {
      console.error(error);
      const mensaje = this.obtenerMensajeErrorEntrega(error?.['message'] || error);
      this.mensajeEnvio = '';
      Swal.fire('Error al guardar participacion', mensaje, 'error');
    } finally {
      this.enviandoActividad = false;
    }
  }

  async leerEntregas() {
    try {
      const data = await this.actividadAlumnoService.obtenerParticipaciones(this.actividad.Id_Actividad);
      this.participacion = data?.['data'] || [];
      console.log(this.participacion);
    } catch (error) {
      console.error(error);
      this.participacion = [];
    }
  }

  obtenerNombreArchivo(url: string): string {
    return url?.split('/').pop() || 'Ver archivo';
  }

  getEntregaUrl(entrega: any): string {
    const url = entrega?.Url || '';
    if (!url) {
      return '';
    }
    if (url.startsWith('http')) {
      return url;
    }
    return 'https://usantana.com' + (url.startsWith('/') ? url : '/' + url);
  }

  private obtenerMensajeErrorEntrega(error: any): string {
    const mensaje = String(error || '');
    if (mensaje.includes('Lms_EntregaActividad')) {
      return 'Falta ejecutar la reparacion de estructura db/migrations/20260804_01_lms_entrega_actividad.sql en la base de datos de usantana.';
    }
    return mensaje || 'No se pudo guardar la entrega.';
  }
}
