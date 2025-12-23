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

  constructor(
    private actividadAlumnoService: ActividadAlumnoService,
    private sanitizer: DomSanitizer
  ) { }
  EntregaAlumno = {
    URL: '' //'https://tu-servidor.com/uploads/tarea-alumno123.pdf'
  };
  ngOnInit() {
    console.log(this.actividad)
    this.leerEntregas();
  }
  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }
  entregar() {
    if (!this.archivoSeleccionado) return alert("Debe seleccionar un archivo.");
    
    const formData = new FormData();
    formData.append('archivo', this.archivoSeleccionado);
    formData.append('IdActividad', this.actividad.Id_Actividad);
    formData.append('IdPersona', this.IdPersona.toString());
    /*
    this.servicio.entregarActividad(formData).subscribe(resp => {
      alert("Entrega realizada con éxito.");
    });
    */
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
    }
  }

  async enviarActividad() {
    if (!this.actividad.Comentario && !this.fileToUpload) {
      Swal.fire('Debe ingresar un comentario o adjuntar un archivo');
      return;
    }

    // Subir archivo si se seleccionó
    if (this.fileToUpload) {
      const formData = new FormData();
      formData.append('archivo', this.fileToUpload);
      formData.append('Id_Empresa', localStorage.getItem('Id_Empresa') || '');
      formData.append('Id_Actividad', this.actividad.Id_Actividad.toString());

      try {
        const resp = await this.actividadAlumnoService.subirArchivo(formData);
        console.log(resp)
        if (resp && resp.success === true) {
          this.actividad.Url = encodeURI(resp.url); // importante usar encodeURI aquí
          console.log(this.actividad.Url)
        } else {
          Swal.fire(resp?.message || 'Error al subir archivo');
          return;
        }
      } catch (error) {
        console.error('Error en subida:', error);
        Swal.fire('Error al comunicarse con el servidor');
        return;
      }
    }

    // Guardar participación
    try {
      
      const resultado = await this.actividadAlumnoService.guardarParticipacion(this.actividad);
      
      if (resultado && resultado.success === 'true') {
        Swal.fire('Actividad enviada correctamente');
        this.actividad.Comentario = '';
        this.fileToUpload = null;
      } else {
        Swal.fire(resultado?.message || 'Error al enviar actividad');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar participación');
    }
  }
  async leerEntregas(){
    let data = await this.actividadAlumnoService.obtenerParticipaciones(this.actividad.Id_Actividad);
    this.participacion = data['data'];
    console.log(this.participacion)
  }
  obtenerNombreArchivo(url: string): string {
  return url?.split('/').pop() || 'Ver archivo';
}

}
