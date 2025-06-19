import { Component, OnInit, Input } from '@angular/core';
import { CmsSeccionesService } from './cms-secciones.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-cms-secciones',
  templateUrl: './cms-secciones.component.html',
  styleUrls: ['./cms-secciones.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class CmsSeccionesComponent implements OnInit {

  @Input() IdPagina: number;

  Secciones: any[] = [];
  Seccion: any = {};
  edit = false;

  tipos = ['texto', 'imagen', 'video', 'html', 'formulario'];


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


  constructor(private cmsService: CmsSeccionesService) {}

  async ngOnInit() {
    if (this.IdPagina) {
      await this.cargarSecciones();
    }
  }
  onChange(event: any) {
    this.Seccion.Contenido = event.value; // Actualiza el modelo con el contenido del editor
  }

  async cargarSecciones() {
    const result = await this.cmsService.getSeccionesPorPagina(this.IdPagina);
    if (result.total > 0) {
      this.Secciones = result.data;
    } else {
      this.Secciones = [];
    }
  }

  editRecord(seccion: any) {
    
    this.Seccion = seccion ? { ...seccion } : this.nuevaSeccion();
    this.edit = true;
    
  }

  // Al crear una nueva sección
  nuevaSeccion() {
    return {
      Id_Seccion: null,
      Id_Pagina: this.IdPagina,
      Tipo_Seccion: 'texto',
      Titulo: '',
      Contenido: '',
      ContenidoCampos: [],
      Estilo_Extra: '',
      Orden: this.Secciones.length + 1,
      Visible: true
    };
  }
  // Para añadir campos en formulario dinámico
  agregarCampo() {
    if (!this.Seccion.ContenidoCampos) {
      this.Seccion.ContenidoCampos = [];
    }
    this.Seccion.ContenidoCampos.push('');
  }

  async grabar() {
    if (this.Seccion.Tipo_Seccion === 'formulario') {
      this.Seccion.Contenido = JSON.stringify(this.Seccion.ContenidoCampos);
    }
    await this.cmsService.saveSeccion(this.Seccion);
    this.edit = false;
    this.Seccion = {};
  
    await this.cargarSecciones();

  }

  cancelar() {
    this.edit = false;
    this.Seccion = {}; // opcional, para evitar residuos visuales
  }

  async eliminar(seccion) {
    if (confirm('¿Eliminar esta sección?')) {
      await this.cmsService.deleteSeccion(seccion.Id_Seccion);
      await this.cargarSecciones();
    }
  }

}
