import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import {
  MarcDicCampo,
  MarcDicFormato,
  MarcDicIndicador,
  MarcDicSubcampo
} from '../../models/biblioteca.models';

@Component({
  selector: 'app-marc-diccionario',
  templateUrl: './marc-diccionario.component.html',
  styleUrls: ['./marc-diccionario.component.css']
})
export class MarcDiccionarioComponent implements OnInit {
  formatos: MarcDicFormato[] = [];
  campos: MarcDicCampo[] = [];
  subcampos: MarcDicSubcampo[] = [];
  indicadores: MarcDicIndicador[] = [];

  formatoForm: MarcDicFormato = {
    id: 0,
    codigo: '',
    nombre: '',
    fuente: '',
    version: '',
    urlFuente: '',
    activo: true
  };

  campoForm: MarcDicCampo = {
    id: 0,
    formatoId: 0,
    tag: '',
    nombre: '',
    grupo: '',
    esControl: false,
    esObsoleto: false
  };

  subcampoForm: MarcDicSubcampo = {
    id: 0,
    formatoId: 0,
    tag: '',
    codigo: '',
    nombre: '',
    esObsoleto: false
  };

  indicadorForm: MarcDicIndicador = {
    id: 0,
    formatoId: 0,
    tag: '',
    posicion: 1,
    valor: '',
    significado: ''
  };

  searchFormatosField = '';
  searchCamposField = '';
  searchSubcamposField = '';
  searchIndicadoresField = '';

  formatoFormVisible = false;
  campoFormVisible = false;
  subcampoFormVisible = false;
  indicadorFormVisible = false;

  formatoEditing = false;
  campoEditing = false;
  subcampoEditing = false;
  indicadorEditing = false;

  repetibilidadOptions: Array<'NR' | 'R'> = ['NR', 'R'];
  selectedFormatoId?: number;
  selectedCampoId?: number;
  selectedSubcampoId?: number;
  selectedIndicadorId?: number;
  campoSubcampos: MarcDicSubcampo[] = [];
  campoSubcampoContext?: { formatoId: number; tag: string };
  campoIndicadores: MarcDicIndicador[] = [];
  campoIndicadorContext?: { formatoId: number; tag: string };

  @ViewChild('campoFormSection') campoFormSection?: ElementRef<HTMLElement>;
  @ViewChild('subcampoFormSection') subcampoFormSection?: ElementRef<HTMLElement>;
  @ViewChild('indicadorFormSection') indicadorFormSection?: ElementRef<HTMLElement>;

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargarTodo();
  }

  private async cargarTodo() {
    const [formatos, campos, subcampos, indicadores] = await Promise.all([
      this.dataService.getMarcDicFormatos(),
      this.dataService.getMarcDicCampos(),
      this.dataService.getMarcDicSubcampos(),
      this.dataService.getMarcDicIndicadores()
    ]);
    this.formatos = formatos;
    this.campos = campos;
    this.subcampos = subcampos;
    this.indicadores = indicadores;
    if (this.campoSubcampoContext) {
      await this.loadCampoSubcampos(this.campoSubcampoContext.formatoId, this.campoSubcampoContext.tag);
    }
    if (this.campoIndicadorContext) {
      await this.loadCampoIndicadores(this.campoIndicadorContext.formatoId, this.campoIndicadorContext.tag);
    }
  }

  private async loadCampoSubcampos(formatoId?: number, tag?: string) {
    if (!formatoId || !tag) {
      this.campoSubcampos = [];
      return;
    }
    this.campoSubcampos = await this.dataService.getMarcDicSubcamposPorTag(formatoId, tag);
  }

  private async loadCampoIndicadores(formatoId?: number, tag?: string) {
    if (!formatoId || !tag) {
      this.campoIndicadores = [];
      return;
    }
    this.campoIndicadores = await this.dataService.getMarcDicIndicadoresPorTag(formatoId, tag);
  }

  private scrollToSection(ref?: ElementRef<HTMLElement>) {
    if (!ref?.nativeElement) return;
    setTimeout(() => {
      ref.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  searchFormatos() {
    this.searchFormatosField = this.searchFormatosField.trim();
  }

  searchCampos() {
    this.searchCamposField = this.searchCamposField.trim();
  }

  searchSubcampos() {
    this.searchSubcamposField = this.searchSubcamposField.trim();
  }

  searchIndicadores() {
    this.searchIndicadoresField = this.searchIndicadoresField.trim();
  }

  private resetFormatoForm() {
    this.formatoForm = {
      id: 0,
      codigo: '',
      nombre: '',
      fuente: '',
      version: '',
      urlFuente: '',
      activo: true
    };
    this.formatoEditing = false;
  }

  nuevoFormato() {
    this.resetFormatoForm();
    this.formatoFormVisible = true;
  }

  editarFormato(item: MarcDicFormato) {
    this.formatoForm = { ...item };
    this.formatoEditing = true;
    this.formatoFormVisible = true;
    this.selectedFormatoId = item.id;
  }

  async guardarFormato() {
    if (!this.formatoForm.codigo || !this.formatoForm.nombre) {
      Swal.fire('Complete el código y el nombre del formato');
      return;
    }

    try {
      if (this.formatoEditing) {
        await this.dataService.updateMarcDicFormato(this.formatoForm);
        Swal.fire('Formato actualizado');
      } else {
        await this.dataService.createMarcDicFormato(this.formatoForm);
        Swal.fire('Formato creado');
      }
      await this.cargarTodo();
      this.cancelarFormato();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el formato');
    }
  }

  cancelarFormato() {
    this.resetFormatoForm();
    this.formatoFormVisible = false;
    this.selectedFormatoId = undefined;
  }

  async eliminarFormato(item: MarcDicFormato) {
    const result = await Swal.fire({
      title: 'Eliminar formato',
      text: 'Se eliminará el formato seleccionado y su relación con el diccionario',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteMarcDicFormato(item.id);
      await this.cargarTodo();
      if (this.formatoEditing && this.formatoForm.id === item.id) {
        this.cancelarFormato();
      }
      Swal.fire('Formato eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el formato');
    }
  }

  private resetCampoForm() {
    this.campoForm = {
      id: 0,
      formatoId: 0,
      tag: '',
      nombre: '',
      grupo: '',
      esControl: false,
      esObsoleto: false
    };
    this.campoEditing = false;
  }

  nuevoCampo() {
    this.resetCampoForm();
    this.campoFormVisible = true;
    this.selectedCampoId = undefined;
    this.scrollToSection(this.campoFormSection);
  }

  async editarCampo(item: MarcDicCampo) {
    this.campoForm = { ...item };
    this.campoEditing = true;
    this.campoFormVisible = true;
    this.selectedCampoId = item.id;
    this.scrollToSection(this.campoFormSection);
    this.campoSubcampoContext = { formatoId: item.formatoId, tag: item.tag };
    await this.loadCampoSubcampos(item.formatoId, item.tag);
    this.campoIndicadorContext = { formatoId: item.formatoId, tag: item.tag };
    await this.loadCampoIndicadores(item.formatoId, item.tag);
  }

  async guardarCampo() {
    if (!this.campoForm.formatoId || !this.campoForm.tag || !this.campoForm.nombre) {
      Swal.fire('Complete el formato, el tag y el nombre del campo');
      return;
    }

    try {
      if (this.campoEditing) {
        await this.dataService.updateMarcDicCampo(this.campoForm);
        Swal.fire('Campo actualizado');
      } else {
        await this.dataService.createMarcDicCampo(this.campoForm);
        Swal.fire('Campo creado');
      }
      await this.cargarTodo();
      this.cancelarCampo();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el campo');
    }
  }

  cancelarCampo() {
    this.resetCampoForm();
    this.campoFormVisible = false;
    this.selectedCampoId = undefined;
    this.campoSubcampoContext = undefined;
    this.campoSubcampos = [];
    this.campoIndicadorContext = undefined;
    this.campoIndicadores = [];
  }

  async eliminarCampo(item: MarcDicCampo) {
    const result = await Swal.fire({
      title: 'Eliminar campo',
      text: 'Se eliminará el campo del diccionario',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteMarcDicCampo(item.id);
      await this.cargarTodo();
      if (this.campoEditing && this.campoForm.id === item.id) {
        this.cancelarCampo();
      }
      Swal.fire('Campo eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el campo');
    }
  }

  private resetSubcampoForm() {
    this.subcampoForm = {
      id: 0,
      formatoId: 0,
      tag: '',
      codigo: '',
      nombre: '',
      esObsoleto: false
    };
    this.subcampoEditing = false;
  }

  nuevoSubcampo(contextFormatoId?: number, contextTag?: string) {
    this.resetSubcampoForm();
    this.subcampoFormVisible = true;
    this.selectedSubcampoId = undefined;
    if (contextFormatoId) {
      this.subcampoForm.formatoId = contextFormatoId;
    }
    if (contextTag) {
      this.subcampoForm.tag = contextTag;
    }
    if (contextFormatoId && contextTag) {
      this.campoSubcampoContext = { formatoId: contextFormatoId, tag: contextTag };
    } else {
      this.campoSubcampoContext = undefined;
    }
    this.scrollToSection(this.subcampoFormSection);
  }

  editarSubcampo(item: MarcDicSubcampo) {
    this.subcampoForm = { ...item };
    this.subcampoEditing = true;
    this.subcampoFormVisible = true;
    this.selectedSubcampoId = item.id;
    this.scrollToSection(this.subcampoFormSection);
    if (this.campoEditing) {
      this.campoSubcampoContext = { formatoId: item.formatoId, tag: item.tag };
    } else {
      this.campoSubcampoContext = undefined;
    }
  }

  async guardarSubcampo() {
    if (!this.subcampoForm.formatoId || !this.subcampoForm.tag || !this.subcampoForm.codigo || !this.subcampoForm.nombre) {
      Swal.fire('Complete el formato, tag, codigo y nombre del subcampo');
      return;
    }

    try {
      if (this.subcampoEditing) {
        await this.dataService.updateMarcDicSubcampo(this.subcampoForm);
        Swal.fire('Subcampo actualizado');
      } else {
        await this.dataService.createMarcDicSubcampo(this.subcampoForm);
        Swal.fire('Subcampo creado');
      }
      await this.cargarTodo();
      this.cancelarSubcampo();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el subcampo');
    }
  }

  cancelarSubcampo() {
    this.resetSubcampoForm();
    this.subcampoFormVisible = false;
    this.selectedSubcampoId = undefined;
    if (!this.campoSubcampoContext) {
      this.campoSubcampos = [];
    }
  }

  async eliminarSubcampo(item: MarcDicSubcampo) {
    const result = await Swal.fire({
      title: 'Eliminar subcampo',
      text: 'Se eliminará el subcampo del diccionario',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteMarcDicSubcampo(item.id);
      await this.cargarTodo();
      if (this.subcampoEditing && this.subcampoForm.id === item.id) {
        this.cancelarSubcampo();
      }
      Swal.fire('Subcampo eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el subcampo');
    }
  }

  private resetIndicadorForm() {
    this.indicadorForm = {
      id: 0,
      formatoId: 0,
      tag: '',
      posicion: 1,
      valor: '',
      significado: ''
    };
    this.indicadorEditing = false;
  }

  nuevoIndicador(contextFormatoId?: number, contextTag?: string) {
    this.resetIndicadorForm();
    this.indicadorFormVisible = true;
    this.selectedIndicadorId = undefined;
    if (contextFormatoId) {
      this.indicadorForm.formatoId = contextFormatoId;
    }
    if (contextTag) {
      this.indicadorForm.tag = contextTag;
    }
    if (contextFormatoId && contextTag) {
      this.campoIndicadorContext = { formatoId: contextFormatoId, tag: contextTag };
    } else {
      this.campoIndicadorContext = undefined;
    }
    this.scrollToSection(this.indicadorFormSection);
  }

  editarIndicador(item: MarcDicIndicador) {
    this.indicadorForm = { ...item };
    this.indicadorEditing = true;
    this.indicadorFormVisible = true;
    this.selectedIndicadorId = item.id;
    this.scrollToSection(this.indicadorFormSection);
    this.campoIndicadorContext = { formatoId: item.formatoId, tag: item.tag };
  }

  async guardarIndicador() {
    if (!this.indicadorForm.formatoId || !this.indicadorForm.tag || !this.indicadorForm.valor || !this.indicadorForm.significado) {
      Swal.fire('Complete el formato, tag, valor y significado del indicador');
      return;
    }

    try {
      if (this.indicadorEditing) {
        await this.dataService.updateMarcDicIndicador(this.indicadorForm);
        Swal.fire('Indicador actualizado');
      } else {
        await this.dataService.createMarcDicIndicador(this.indicadorForm);
        Swal.fire('Indicador creado');
      }
      await this.cargarTodo();
      this.cancelarIndicador();
      if (this.campoIndicadorContext) {
        await this.loadCampoIndicadores(this.campoIndicadorContext.formatoId, this.campoIndicadorContext.tag);
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el indicador');
    }
  }

  cancelarIndicador() {
    this.resetIndicadorForm();
    this.indicadorFormVisible = false;
    this.selectedIndicadorId = undefined;
  }

  async eliminarIndicador(item: MarcDicIndicador) {
    const result = await Swal.fire({
      title: 'Eliminar indicador',
      text: 'Se eliminará el indicador del diccionario',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteMarcDicIndicador(item.id);
      await this.cargarTodo();
      if (this.indicadorEditing && this.indicadorForm.id === item.id) {
        this.cancelarIndicador();
      }
      Swal.fire('Indicador eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el indicador');
    }
  }
}
