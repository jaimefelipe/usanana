import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import {
  Libro,
  MarcCampo,
  MarcDicCampo,
  MarcDicFormato,
  MarcDicIndicador,
  MarcDicSubcampo,
  MarcRegistro,
  MarcSubcampo,
  TipoMaterial
} from '../../models/biblioteca.models';

interface CatalogacionSubcampoEntry {
  id?: number;
  codigo: string;
  nombre: string;
  valor: string;
}

interface CatalogacionEntrada {
  tag: string;
  nombre: string;
  valor: string;
  ind1: string;
  ind2: string;
  subcampos: CatalogacionSubcampoEntry[];
  campoId?: number;
}

@Component({
  selector: 'app-marc-catalogacion',
  templateUrl: './marc-catalogacion.component.html',
  styleUrls: ['./marc-catalogacion.component.css']
})
export class MarcCatalogacionComponent implements OnInit {
  libros: Libro[] = [];
  formatos: MarcDicFormato[] = [];
  campos: MarcDicCampo[] = [];
  subcampos: MarcDicSubcampo[] = [];
  indicadores: MarcDicIndicador[] = [];

  libroFormVisible = false;
  libroEditing = false;
  libroForm: Libro = {
    id: 0,
    titulo: '',
    autor: '',
    isbn: '',
    categoria: 'Sin categoria',
    estado: 'disponible',
    tipoMaterial: '',
    tipoMaterialId: undefined
  };

  selectedLibroId?: number;
  selectedFormatoId?: number;
  selectedSection = '00';
  secciones = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'];
  recordEntries: Record<string, CatalogacionEntrada> = {};

  catalogForm = {
    leader: '',
    control001: '',
    control005: '',
    control008: ''
  };

  currentTags: MarcDicCampo[] = [];
  indicatorOptionsByTag: Record<string, Record<number, { value: string; meaning?: string }[]>> = {};
  subcamposByTag: Record<string, MarcDicSubcampo[]> = {};
  tiposMaterial: TipoMaterial[] = [];
  currentRegistroId?: number;

  isSaving = false;

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargarDatosBase();
  }

  private resetCatalogForm() {
    this.catalogForm = {
      leader: '',
      control001: '',
      control005: '',
      control008: ''
    };
  }

  private async cargarDatosBase() {
    const [libros, formatos, campos, subcampos, indicadores, tiposMaterial] = await Promise.all([
      this.dataService.getLibros(),
      this.dataService.getMarcDicFormatos(),
      this.dataService.getMarcDicCampos(),
      this.dataService.getMarcDicSubcampos(),
      this.dataService.getMarcDicIndicadores(),
      this.dataService.getTiposMaterial()
    ]);
    this.libros = libros;
    this.formatos = formatos;
    this.campos = campos;
    this.subcampos = subcampos;
    this.indicadores = indicadores;
    this.tiposMaterial = tiposMaterial;
    if (!this.selectedFormatoId && formatos.length) {
      this.selectedFormatoId = formatos[0].id;
    }
    this.buildCaches();
  }

  getTagsPorSeccion() {
    return this.currentTags;
  }

  getSectionLabel(section: string) {
    const ranges: Record<string, string> = {
      '00': '000-009',
      '10': '010-019',
      '20': '020-029',
      '30': '030-039',
      '40': '040-049',
      '50': '050-059',
      '60': '060-069',
      '70': '070-079',
      '80': '080-089',
      '90': '090-099'
    };
    return ranges[section] || section;
  }

  selectSection(section: string) {
    this.selectedSection = section;
    this.actualizarCurrentTags();
  }

  onTipoMaterialChange() {
    const tipo = this.tiposMaterial.find(t => t.id === this.libroForm.tipoMaterialId);
    this.libroForm.tipoMaterial = tipo ? tipo.nombre : '';
  }

  get selectedLibro() {
    return this.libros.find(libro => libro.id === this.selectedLibroId);
  }

  private async cargarLibros() {
    this.libros = await this.dataService.getLibros();
  }

  onFormatoChange() {
    this.recordEntries = {};
    this.actualizarCurrentTags();
  }

  getEntry(tag: string, nombre: string) {
    const entry = this.ensureEntry(tag);
    entry.nombre = nombre || entry.nombre;
    const indicatorMap = this.indicatorOptionsByTag[tag] || {};
    if (!entry.ind1) {
      entry.ind1 = indicatorMap[1]?.[0]?.value || '';
    }
    if (!entry.ind2) {
      entry.ind2 = indicatorMap[2]?.[0]?.value || '';
    }
    this.ensureSubcamposForEntry(entry, tag);
    return entry;
  }

  getSubcamposForTag(tag: string) {
    const key = this.buildTagKey(this.selectedFormatoId, tag);
    return this.subcamposByTag[key] || [];
  }

  hasSubcampos(tag: string) {
    return this.getSubcamposForTag(tag).length > 0;
  }

  getIndicatorOptions(tag: string, posicion: number) {
    const options = this.indicatorOptionsByTag[tag]?.[posicion] || [];
    return options;
  }

  private buildCaches() {
    this.buildIndicatorCache();
    this.buildSubcamposMap();
    this.actualizarCurrentTags();
  }

  private buildIndicatorCache() {
    this.indicatorOptionsByTag = {};
    this.indicadores.forEach(ind => {
      if (!this.indicatorOptionsByTag[ind.tag]) {
        this.indicatorOptionsByTag[ind.tag] = { 1: [], 2: [] };
      }
      this.indicatorOptionsByTag[ind.tag][ind.posicion].push({
        value: ind.valor,
        meaning: ind.significado
      });
    });
  }

  private buildSubcamposMap() {
    this.subcamposByTag = {};
    this.subcampos.forEach(sub => {
      const key = this.buildTagKey(sub.formatoId, sub.tag);
      if (!this.subcamposByTag[key]) {
        this.subcamposByTag[key] = [];
      }
      this.subcamposByTag[key].push(sub);
    });
  }

  private actualizarCurrentTags() {
    if (!this.selectedFormatoId) {
      this.currentTags = [];
      return;
    }
    const rangoInicio = Number(this.selectedSection);
    this.currentTags = this.campos.filter(
      campo =>
        campo.formatoId === this.selectedFormatoId &&
        Number(campo.tag) >= rangoInicio &&
        Number(campo.tag) < rangoInicio + 10
    );
  }

  private buildTagKey(formatoId: number | undefined, tag: string) {
    return `${formatoId ?? 'no-formato'}::${tag}`;
  }

  ensureSubcamposForEntry(entry: CatalogacionEntrada, tag: string) {
    const definitions = this.getSubcamposForTag(tag);
    definitions.forEach(def => {
      const existing = entry.subcampos.find(sub => sub.codigo === def.codigo);
      if (!existing) {
        entry.subcampos.push({
          codigo: def.codigo,
          nombre: def.nombre,
          valor: ''
        });
      } else {
        existing.nombre = def.nombre;
      }
    });
  }

  removeSubcampo(tag: string, index: number) {
    const entry = this.ensureEntry(tag);
    entry.subcampos.splice(index, 1);
  }

  nuevoLibro() {
    this.resetLibroForm();
    this.recordEntries = {};
    this.resetCatalogForm();
    this.selectedSection = '00';
    this.selectedLibroId = undefined;
    if (!this.selectedFormatoId && this.formatos.length) {
      this.selectedFormatoId = this.formatos[0].id;
    }
    this.actualizarCurrentTags();
    this.libroFormVisible = true;
  }

  async editarLibro(libro: Libro) {
    this.libroForm = { ...libro };
    this.selectedLibroId = libro.id;
    this.recordEntries = {};
    this.resetCatalogForm();
    this.selectedSection = '00';
    this.libroEditing = true;
    this.onTipoMaterialChange();
    this.actualizarCurrentTags();
    this.libroFormVisible = true;
    await this.cargarMarcParaLibro(libro.id);
  }

  private resetLibroForm() {
    this.libroForm = {
      id: 0,
      titulo: '',
      autor: '',
      isbn: '',
      categoria: 'Sin categoria',
      estado: 'disponible',
      tipoMaterial: '',
      tipoMaterialId: undefined
    };
    this.libroEditing = false;
    this.currentRegistroId = undefined;
  }

  private async persistirLibro(): Promise<number> {
    const libroId = await this.dataService.createLibro(this.libroForm);
    if (!libroId) {
      throw new Error('No se pudo obtener el identificador del libro');
    }
    this.libroForm.id = libroId;
    this.selectedLibroId = libroId;
    this.libroEditing = true;
    await this.cargarDatosBase();
    return libroId;
  }

  private async actualizarLibroExistente(libroId: number) {
    await this.dataService.updateLibro(this.libroForm);
    const index = this.libros.findIndex(libro => libro.id === libroId);
    if (index >= 0) {
      this.libros[index] = { ...this.libroForm };
    }
  }

  private entryHasData(entry: CatalogacionEntrada) {
    const valor = (entry.valor || '').trim();
    const tieneSubcampos = entry.subcampos.some(sub => (sub.valor || '').trim().length > 0);
    return valor.length > 0 || tieneSubcampos;
  }

  async guardarLibroYRegistro() {
    if (!this.libroForm.titulo) {
      Swal.fire('Complete el título para continuar');
      return;
    }
    if (!this.selectedFormatoId) {
      Swal.fire('Seleccione un formato MARC para continuar');
      return;
    }

    try {
      this.isSaving = true;
      let libroId = this.selectedLibroId;
      if (this.libroEditing && libroId) {
        await this.actualizarLibroExistente(libroId);
      } else {
        libroId = await this.persistirLibro();
      }
      if (!libroId) {
        throw new Error('No se pudo determinar el identificador del libro');
      }

      const formato = this.formatos.find(f => f.id === this.selectedFormatoId);
      if (!formato) {
        throw new Error('No se encontró el formato seleccionado');
      }

      const registroId = await this.syncMarcRegistro(libroId, formato);
      if (!registroId) {
        throw new Error('No se pudo determinar el identificador del registro MARC');
      }

      for (const entry of Object.values(this.recordEntries)) {
        if (this.entryHasData(entry)) {
          await this.syncCampo(entry, registroId);
        } else if (entry.campoId) {
          await this.deleteCampo(entry);
        }
      }

      Swal.fire('Libro y registro MARC guardados correctamente');
    } catch (error: any) {
      console.error(error);
      const detail = error?.error?.message || error?.message || 'Error desconocido';
      Swal.fire('Ocurrió un error al guardar el libro y el MARC', detail, 'error');
    } finally {
      this.isSaving = false;
    }
  }

  cancelarLibro() {
    this.resetLibroForm();
    this.recordEntries = {};
    this.resetCatalogForm();
    this.selectedSection = '00';
    this.libroFormVisible = false;
  }

  private ensureEntry(tag: string) {
    if (!this.recordEntries[tag]) {
      this.recordEntries[tag] = {
        tag,
        nombre: '',
        valor: '',
        ind1: '',
        ind2: '',
        subcampos: []
      };
    }
    return this.recordEntries[tag];
  }

  private async cargarMarcParaLibro(libroId: number) {
    this.recordEntries = {};
    this.currentRegistroId = undefined;
    const [registros, campos, subcampos] = await Promise.all([
      this.dataService.getMarcRegistros(),
      this.dataService.getMarcCampos(),
      this.dataService.getMarcSubcampos()
    ]);
    const registro = registros.find(r => r.libroId === libroId);
    if (!registro) {
      this.resetCatalogForm();
      return;
    }
    this.currentRegistroId = registro.id;
    const formatoMatch = this.formatos.find(f => f.codigo === registro.formato);
    if (formatoMatch) {
      this.selectedFormatoId = formatoMatch.id;
      this.actualizarCurrentTags();
    }
    this.catalogForm = {
      leader: registro.leader || '',
      control001: registro.control001 || '',
      control005: registro.control005 || '',
      control008: registro.control008 || ''
    };
    const registroCampos = campos.filter(c => c.marcRegistroId === registro.id);
    registroCampos.forEach(campo => {
      const entry = this.ensureEntry(campo.tag);
      entry.campoId = campo.id;
      entry.valor = campo.valor || '';
      entry.ind1 = campo.ind1 || '';
      entry.ind2 = campo.ind2 || '';
      this.ensureSubcamposForEntry(entry, campo.tag);
      const campoSubcampos = subcampos.filter(sub => sub.marcCampoId === campo.id);
      campoSubcampos.forEach(sub => {
        const target = entry.subcampos.find(s => s.codigo === sub.codigo);
        if (target) {
          target.valor = sub.valor || '';
          target.id = sub.id;
        }
      });
    });
  }

  private async syncMarcRegistro(libroId: number, formato: MarcDicFormato): Promise<number | null> {
    const registroPayload: MarcRegistro = {
      id: 0,
      libroId,
      formato: formato.codigo,
      leader: this.catalogForm.leader,
      control001: this.catalogForm.control001,
      control005: this.catalogForm.control005,
      control008: this.catalogForm.control008
    };
    if (this.currentRegistroId) {
      await this.dataService.updateMarcRegistro({ ...registroPayload, id: this.currentRegistroId });
      return this.currentRegistroId;
    }
    const registroId = await this.dataService.createMarcRegistro(registroPayload);
    if (registroId) {
      this.currentRegistroId = registroId;
    }
    return registroId;
  }

  private async syncCampo(entry: CatalogacionEntrada, registroId: number) {
    const payload: MarcCampo = {
      id: entry.campoId || 0,
      marcRegistroId: registroId,
      tag: entry.tag,
      ind1: entry.ind1,
      ind2: entry.ind2,
      valor: entry.valor
    };
    let campoId = entry.campoId;
    if (campoId) {
      await this.dataService.updateMarcCampo({ ...payload, id: campoId });
    } else {
      const newId = await this.dataService.createMarcCampo(payload);
      campoId = newId || undefined;
      entry.campoId = campoId;
    }
    if (!campoId) {
      return;
    }
    await this.syncSubcampos(entry, campoId);
  }

  private async syncSubcampos(entry: CatalogacionEntrada, campoId: number) {
    for (const sub of entry.subcampos) {
      const valor = (sub.valor || '').trim();
      if (sub.id) {
        if (valor.length > 0) {
          await this.dataService.updateMarcSubcampo({
            id: sub.id,
            marcCampoId: campoId,
            codigo: sub.codigo,
            valor: sub.valor
          });
        } else {
          await this.dataService.deleteMarcSubcampo(sub.id);
          sub.id = undefined;
        }
      } else if (valor.length > 0) {
        const subId = await this.dataService.createMarcSubcampo({
          id: 0,
          marcCampoId: campoId,
          codigo: sub.codigo,
          valor: sub.valor
        });
        sub.id = subId || undefined;
      }
    }
  }

  private async deleteCampo(entry: CatalogacionEntrada) {
    if (!entry.campoId) {
      return;
    }
    for (const sub of entry.subcampos) {
      if (sub.id) {
        await this.dataService.deleteMarcSubcampo(sub.id);
        sub.id = undefined;
      }
    }
    await this.dataService.deleteMarcCampo(entry.campoId);
    entry.campoId = undefined;
  }
}
