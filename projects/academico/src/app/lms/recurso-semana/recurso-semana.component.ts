import { Component, OnInit, Input } from '@angular/core';
import { RecursoSemanaService } from './recurso-semana.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recurso-semana',
  templateUrl: './recurso-semana.component.html',
  styleUrls: ['./recurso-semana.component.css']
})
export class RecursoSemanaComponent implements OnInit {
 @Input() Semana: any;

  Recursos: any[] = [];
  Recurso: any = this.nuevoRecurso();

  edit = false;
  fileToUpload: File | null = null;
  previewURL: any = null;

  

  constructor(
    private recursoService: RecursoSemanaService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (this.Semana?.Id_Semana) {
      this.cargarRecursos();
    }
  }

  nuevoRecurso() {
    return {
      Id_Recurso: '',
      Id_Empresa: 1,
      Id_Semana: this.Semana?.Id_Semana || '',
      Titulo: '',
      Tipo: 'Texto',
      URL: '',
      Contenido:''
    };
  }

  async cargarRecursos() {
    this.Recursos = await this.recursoService.getRecursos(this.Semana.Id_Semana);
  }

  abrirNuevo() {
    this.Recurso = this.nuevoRecurso();
    this.fileToUpload = null;
    this.previewURL = null;
    this.edit = true;
  }

  editar(rec: any) {
    this.Recurso = { ...rec };
    this.fileToUpload = null;
    this.previewURL = null;
    this.edit = true;
  }

  cancelar() {
    this.edit = false;
    this.Recurso = this.nuevoRecurso();
    this.fileToUpload = null;
    this.previewURL = null;
  }

  handleFileInput(event: any) {
  const file: File = event.target.files[0];
  
  if (file) {
    // Obtener extensión
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    // Validar según tipo de recurso
    if (this.Recurso.Tipo === '4' && extension !== 'pdf') {
      Swal.fire('Solo se permiten archivos PDF');
      event.target.value = '';
      return;
    }
    
    if (this.Recurso.Tipo === '5' && !['ppt', 'pptx'].includes(extension || '')) {
      Swal.fire('Solo se permiten archivos PowerPoint');
      event.target.value = '';
      return;
    }
    
    // Validar extensiones para todos los tipos de documentos
    const validExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    if (!validExtensions.includes(extension || '')) {
      Swal.fire('Tipo de archivo no permitido');
      event.target.value = '';
      return;
    }
    
    this.fileToUpload = file;
  }
}

  getTipoText(tipo: string): string {
  switch(tipo) {
    case '1': return 'Texto';
    case '2': return 'Enlace';
    case '3': return 'Video';
    case '4': return 'PDF';
    case '5': return 'Presentación';
    default: return 'Desconocido';
  }
}
   onCongenidoChange(event: any) {
    this.Recurso.Contenido = event.value; // Actualiza el modelo con el contenido del editor
  }

  async grabar() {
    this.Recurso.Id_Semana = this.Semana.Id_Semana;

    if (!this.Recurso.Titulo || !this.Recurso.Tipo) {
      Swal.fire('Complete todos los campos requeridos');
      return;
    }

    // Manejar archivos para PDF (tipo 4) y Presentación (tipo 5)
    if (['4', '5'].includes(this.Recurso.Tipo)) {
      if (!this.fileToUpload && !this.Recurso.URL) {
        Swal.fire('Debe seleccionar un archivo o proporcionar la URL');
        return;
      }

      // Subir archivo si existe
      if (this.fileToUpload) {
        const formData = new FormData();
        formData.append('archivo', this.fileToUpload);
        formData.append('Id_Empresa', localStorage.getItem('Id_Empresa') || '');
        formData.append('Id_Semana', this.Recurso.Id_Semana.toString());

        try {
          const resp = await this.recursoService.subirArchivo(formData);
          console.log('Respuesta de subida:', resp);
          
          // Verificar respuesta del servidor
          if (resp && resp.success === true) {
            // Limpiar espacios en la URL
            //this.Recurso.URL = resp.url.replace(/\s/g, '');
            this.Recurso.URL = encodeURI(resp.url);
          } else {
            const errorMsg = resp?.message || 'Error desconocido al subir archivo';
            Swal.fire(errorMsg);
            return;
          }
        } catch (error) {
          console.error('Error en la subida:', error);
          Swal.fire('Error al comunicarse con el servidor');
          return;
        }
      }
    }

    // Guardar el recurso
    try {
      const resultado = await this.recursoService.guardarRecurso(this.Recurso);
      console.log('Resultado de guardarRecurso:', resultado);
      
      // Verificar respuesta de guardarRecurso
      if (resultado && resultado.success === 'true') {
        Swal.fire('Recurso guardado');
        await this.cargarRecursos();
        this.cancelar();
      } else {
        const errorMsg = resultado?.message || 'Error al guardar recurso';
        Swal.fire(errorMsg);
      }
    } catch (error) {
      console.error('Error al guardar recurso:', error);
      Swal.fire('Error al guardar recurso');
    }
  }

  async eliminar(rec: any) {
    const confirm = await Swal.fire({
      title: '¿Eliminar recurso?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    });

    if (confirm.isConfirmed) {
      const resp = await this.recursoService.eliminarRecurso(rec.Id_Recurso);
      /*if (resp.success === 'true') {
        Swal.fire('Recurso eliminado');
        this.cargarRecursos();
      } else {
        Swal.fire('Error al eliminar recurso');
      }*/
    }
  }

  getYoutubeEmbedUrl(url: string): any {
    const videoId = this.extractYoutubeId(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

  extractYoutubeId(url: string): string {
    const match = url.match(/[?&]v=([^&#]*)/) || url.match(/youtu\.be\/([^&#]*)/);
    return match && match[1] ? match[1] : '';
  }
}
