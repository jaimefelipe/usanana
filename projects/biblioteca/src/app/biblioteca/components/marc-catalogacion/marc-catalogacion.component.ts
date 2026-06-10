import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { AutoridadCatalogacionComponent } from '../autoridad-catalogacion/autoridad-catalogacion.component';
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
  deletedSubcampoIds?: number[];
  campoId?: number;
  indicatorDropdownOpen?: Record<1 | 2, boolean>;
}

@Component({
  selector: 'app-marc-catalogacion',
  templateUrl: './marc-catalogacion.component.html',
  styleUrls: ['./marc-catalogacion.component.css']
})
export class MarcCatalogacionComponent implements OnInit {
  libros: Libro[] = [];
  libroPage = 1;
  libroPageSize = 50;
  libroTotal = 0;
  libroSearch = '';
  formatos: MarcDicFormato[] = [];
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
  currentPage = 1;
  pageSize = 50;
  secciones: number[] = [];
  pageLabels: Record<number, string> = {};
  totalTagsForFormat = 0;
  recordEntries: Record<string, CatalogacionEntrada> = {};
  subcampoModalVisible = false;
  subcamposLoading = false;
  subcamposSaving = false;
  activeSubcamposEntry?: CatalogacionEntrada;
  @ViewChild(AutoridadCatalogacionComponent)
  autoridadCatalogacion?: AutoridadCatalogacionComponent;

  catalogForm = {
    leader: '',
    control001: '',
    control005: '',
    control008: ''
  };
  activeCatalogTab: 'marc' | 'autoridad' = 'marc';

  currentTags: MarcDicCampo[] = [];
  tagFilter = '';
  indicatorOptionsByTag: Record<string, Record<number, { value: string; meaning?: string }[]>> = {};
  subcamposByTag: Record<string, MarcDicSubcampo[]> = {};
  tiposMaterial: TipoMaterial[] = [];
  currentRegistroId?: number;

  isSaving = false;
  librosLoading = false;
  editLoading = false;
  tagsLoading = false;

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

  isSystemManagedTag(tag: string) {
    return tag === '001' || tag === '003';
  }

  private buildControl003(control001?: string) {
    const numericControl001 = String(control001 || '').trim();
    return numericControl001 ? `USAJ${numericControl001}` : '';
  }

  private applySystemManagedEntryValue(tag: string) {
    const entry = this.recordEntries[tag];
    if (!entry) {
      return;
    }
    if (tag === '001') {
      entry.valor = this.catalogForm.control001 || '';
    } else if (tag === '003') {
      entry.valor = this.buildControl003(this.catalogForm.control001);
    }
    entry.ind1 = '';
    entry.ind2 = '';
  }

  private syncSystemManagedControlFields(control001?: string) {
    const control001Value = control001 ?? this.catalogForm.control001 ?? '';
    const systemControl001 = String(control001Value || '');
    this.catalogForm.control001 = systemControl001;
    this.applySystemManagedEntryValue('001');
    this.applySystemManagedEntryValue('003');
  }

  private buildMarc005Timestamp(date = new Date()) {
    const pad = (value: number) => String(value).padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
      `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}.0`;
  }

  private setSubcampoDefault(entry: CatalogacionEntrada, codigo: string, valor: string, nombre = codigo) {
    let subcampo = entry.subcampos.find(item => item.codigo === codigo);
    if (!subcampo) {
      subcampo = { codigo, nombre, valor: '' };
      entry.subcampos.push(subcampo);
    }
    if (!String(subcampo.valor || '').trim()) {
      subcampo.valor = valor;
    }
  }

  private applyNewMarcRecordDefaults() {
    if (this.currentRegistroId) {
      return;
    }
    if (!this.catalogForm.control005) {
      this.catalogForm.control005 = this.buildMarc005Timestamp();
    }
    Object.values(this.recordEntries).forEach(entry => this.applyNewMarcRecordDefaultForEntry(entry));
  }

  private applyNewMarcRecordDefaultForEntry(entry: CatalogacionEntrada) {
    if (this.currentRegistroId) {
      return;
    }
    if (entry.tag === '005' && !String(entry.valor || '').trim()) {
      const timestamp = this.catalogForm.control005 || this.buildMarc005Timestamp();
      this.catalogForm.control005 = timestamp;
      entry.valor = timestamp;
      return;
    }

    if (entry.tag !== '040') {
      return;
    }
    this.setSubcampoDefault(entry, 'a', 'CR-USAJ');
    this.setSubcampoDefault(entry, 'b', 'spa');
    this.setSubcampoDefault(entry, 'c', 'CR-USAJ');
    this.setSubcampoDefault(entry, 'e', 'rda');
    this.syncEntryValueFromSubcampos(entry, true);
  }

  private async cargarDatosBase() {
    const [formatos, tiposMaterial] = await Promise.all([
      this.dataService.getMarcDicFormatos(),
      this.dataService.getTiposMaterial()
    ]);
    await this.cargarLibros();
    this.formatos = formatos;
    this.subcampos = [];
    this.indicadores = [];
    this.tiposMaterial = tiposMaterial;
    if (!this.selectedFormatoId && formatos.length) {
      this.selectedFormatoId = formatos[0].id;
    }
    this.buildCaches();
    await this.actualizarCurrentTags();
  }

  getTagsPorSeccion() {
    return this.currentTags;
  }

  get isTagFilterActive() {
    return this.tagFilter.trim().length > 0;
  }

  getSectionLabel(section: number) {
    return this.pageLabels[section] || this.getSectionRangePlaceholder(section);
  }

  private getSectionRangePlaceholder(section: number) {
    const total = this.totalTagsForFormat || 0;
    if (total === 0) {
      return '000-000';
    }
    const start = (section - 1) * this.pageSize + 1;
    const end = Math.min(section * this.pageSize, total);
    return `${this.formatTagIndex(start)}-${this.formatTagIndex(end)}`;
  }

  private formatTagIndex(value: number) {
    return value.toString().padStart(3, '0');
  }

  async selectSection(section: number) {
    if (this.currentPage === section) {
      return;
    }
    this.currentPage = section;
    await this.actualizarCurrentTags();
  }

  private syncTipoMaterialSeleccionado() {
    const tipo = this.tiposMaterial.find(t => t.id === this.libroForm.tipoMaterialId);
    this.libroForm.tipoMaterial = tipo ? tipo.nombre : '';
  }

  async onTipoMaterialChange() {
    this.syncTipoMaterialSeleccionado();
    this.clearTagFilter();
    this.currentPage = 1;
    this.pageLabels = {};
    await this.actualizarCurrentTags();
  }

  async onTagFilterChange(value: string) {
    this.tagFilter = String(value || '').trim();
    this.currentPage = 1;
    this.pageLabels = {};
    await this.actualizarCurrentTags();
  }

  clearTagFilter() {
    this.tagFilter = '';
  }

  async limpiarFiltroTags() {
    this.clearTagFilter();
    this.currentPage = 1;
    this.pageLabels = {};
    await this.actualizarCurrentTags();
  }

  onTagValueChange(tag: string, value: string) {
    if (this.isSystemManagedTag(tag)) {
      this.syncSystemManagedControlFields();
      return;
    }
    if (tag === '005') {
      this.catalogForm.control005 = value || '';
      return;
    }
    if (tag !== '245') {
      return;
    }
    const safeValue = value || '';
    const entry245 = this.ensureEntry('245');
    this.ensureSubcamposForEntry(entry245, '245');
    const tituloSubcampo = entry245.subcampos.find(sub => sub.codigo === 'a');
    if (tituloSubcampo) {
      tituloSubcampo.valor = safeValue;
      this.syncEntryValueFromSubcampos(entry245, true);
      return;
    }
    this.libroForm.titulo = this.extractTitulo245FromMarcValue(safeValue) || safeValue;
  }

  get selectedLibro() {
    return this.libros.find(libro => libro.id === this.selectedLibroId);
  }

  private async cargarLibros(setLoading = true) {
    if (setLoading) {
      this.librosLoading = true;
    }
    const page = Math.max(1, this.libroPage);
    try {
      const result = await this.dataService.getLibrosPage(page, this.libroPageSize, this.libroSearch);
      this.libros = result.libros;
      this.libroTotal = result.total;
      const totalPages = this.libroTotalPages;
      if (totalPages > 0 && page > totalPages) {
        this.libroPage = totalPages;
        await this.cargarLibros(false);
      }
    } catch (error: any) {
      console.error(error);
      const detail = error?.error?.message || error?.message || 'No se pudo cargar la pagina de libros.';
      Swal.fire('Error al cargar libros', detail, 'error');
      this.libros = [];
      this.libroTotal = 0;
    } finally {
      if (setLoading) {
        this.librosLoading = false;
      }
    }
  }

  get libroTotalPages() {
    return this.libroTotal > 0 ? Math.ceil(this.libroTotal / this.libroPageSize) : 0;
  }

  get libroPageNumbers() {
    const total = this.libroTotalPages;
    if (total <= 0) {
      return [];
    }
    const start = Math.max(1, this.libroPage - 2);
    const end = Math.min(total, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  get libroRangeStart() {
    return this.libroTotal === 0 ? 0 : ((this.libroPage - 1) * this.libroPageSize) + 1;
  }

  get libroRangeEnd() {
    return Math.min(this.libroPage * this.libroPageSize, this.libroTotal);
  }

  async cambiarPaginaLibros(page: number) {
    const totalPages = this.libroTotalPages;
    if (page < 1 || (totalPages > 0 && page > totalPages) || page === this.libroPage) {
      return;
    }
    this.libroPage = page;
    await this.cargarLibros();
  }

  async onLibroSearchChange(value: string) {
    this.libroSearch = value || '';
    this.libroPage = 1;
    await this.cargarLibros();
  }

  async onFormatoChange() {
    this.recordEntries = {};
    this.clearTagFilter();
    this.currentPage = 1;
    this.pageLabels = {};
    await this.actualizarCurrentTags();
  }

  getEntry(tag: string, nombre: string) {
    const entry = this.ensureEntry(tag);
    entry.nombre = nombre || entry.nombre;
    this.ensureSubcamposForEntry(entry, tag);
    this.applyNewMarcRecordDefaultForEntry(entry);
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

  getIndicatorLabel(tag: string, posicion: 1 | 2, valor: string) {
    const options = this.getIndicatorOptions(tag, posicion);
    const match = options.find(opt => String(opt.value) === String(valor));
    return match?.meaning || valor;
  }

  getIndicatorDisplayValue(entry: CatalogacionEntrada, indicador: 1 | 2) {
    const value = indicador === 1 ? entry.ind1 : entry.ind2;
    return String(value ?? '').trim() || '#';
  }

  getTagDisplay(tag: string, entry: CatalogacionEntrada) {
    const suffix = this.getIndicatorDisplayValue(entry, 1);
    return `${tag}${suffix}`;
  }

  getIndicatorButtonLabel(tag: string, entry: CatalogacionEntrada, indicador: 1 | 2) {
    return `${tag}-${this.getIndicatorDisplayValue(entry, indicador)}`;
  }

  private buildCaches() {
    this.buildIndicatorCache();
    this.buildSubcamposMap();
  }

  private buildIndicatorCache() {
    this.indicatorOptionsByTag = {};
    this.indicadores.forEach(ind => {
      if (!this.indicatorOptionsByTag[ind.tag]) {
        this.indicatorOptionsByTag[ind.tag] = { 1: [], 2: [] };
      }
      this.indicatorOptionsByTag[ind.tag][ind.posicion].push({
        value: String(ind.valor ?? ''),
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

  private async actualizarCurrentTags() {
    this.tagsLoading = true;
    if (!this.selectedFormatoId || !this.libroForm.tipoMaterialId) {
      this.currentTags = [];
      this.secciones = [];
      this.currentPage = 1;
      this.totalTagsForFormat = 0;
      this.subcampos = [];
      this.indicadores = [];
      this.buildCaches();
      this.tagsLoading = false;
      return;
    }
    try {
      const filter = this.tagFilter.trim();
      const total = await this.dataService.countMarcDicCampos(this.selectedFormatoId, this.libroForm.tipoMaterialId, filter);
      this.totalTagsForFormat = total;
      this.updateSectionPagination(total);
      const { campos } = await this.dataService.getMarcDicCamposPage(
        this.selectedFormatoId,
        this.currentPage,
        this.pageSize,
        this.libroForm.tipoMaterialId,
        filter
      );
      await this.loadDictionaryForCurrentTags(campos);
      this.currentTags = campos;
      if (campos.length > 0) {
        const startTag = campos[0].tag || '---';
        const endTag = campos[campos.length - 1].tag || '---';
        this.pageLabels[this.currentPage] = `${startTag}-${endTag}`;
      }
      await this.populateEntriesForCurrentTags(campos);
      this.applyNewMarcRecordDefaults();
    } catch (error: any) {
      console.error(error);
      this.currentTags = [];
      const detail = error?.error?.message || error?.message || 'No se pudieron cargar las etiquetas MARC.';
      Swal.fire('Error al cargar etiquetas MARC', detail, 'error');
    } finally {
      this.tagsLoading = false;
    }
  }

  private async loadDictionaryForCurrentTags(campos: MarcDicCampo[]) {
    if (!this.selectedFormatoId || campos.length === 0) {
      this.subcampos = [];
      this.indicadores = [];
      this.buildCaches();
      return;
    }
    const tags = Array.from(new Set(campos.map(c => c.tag).filter(Boolean)));
    const [subcampos, indicadores] = await Promise.all([
      this.dataService.getMarcDicSubcamposPorTags(this.selectedFormatoId, tags),
      this.dataService.getMarcDicIndicadoresPorTags(this.selectedFormatoId, tags)
    ]);
    this.subcampos = subcampos;
    this.indicadores = indicadores;
    this.buildCaches();
  }

  private async populateEntriesForCurrentTags(campos: MarcDicCampo[]) {
    if (!this.currentRegistroId || campos.length === 0) {
      campos.forEach(campo => {
        if (this.isSystemManagedTag(campo.tag)) {
          this.ensureEntry(campo.tag);
          this.applySystemManagedEntryValue(campo.tag);
        }
      });
      return;
    }
    const tags = campos.map(c => c.tag);
    const stored = await this.dataService.getMarcCamposByRegistroAndTags(this.currentRegistroId, tags);
    const storedMap = new Map(stored.map(c => [c.tag, c]));
    const storedSubcampos = await this.dataService.getMarcSubcamposByCampos(stored.map(c => c.id));
    const storedSubcamposByCampoId = new Map<number, MarcSubcampo[]>();
    storedSubcampos.forEach(subcampo => {
      const list = storedSubcamposByCampoId.get(subcampo.marcCampoId) || [];
      list.push(subcampo);
      storedSubcamposByCampoId.set(subcampo.marcCampoId, list);
    });
    campos.forEach(campo => {
      const entry = this.ensureEntry(campo.tag);
      if (this.isSystemManagedTag(campo.tag)) {
        this.applySystemManagedEntryValue(campo.tag);
        return;
      }
      const match = storedMap.get(campo.tag);
      if (match) {
        entry.campoId = match.id;
        entry.valor = match.valor || '';
        entry.ind1 = match.ind1 || '';
        entry.ind2 = match.ind2 || '';
        this.hydrateEntrySubcampos(entry, storedSubcamposByCampoId.get(match.id) || []);
        if (campo.tag === '245') {
          this.libroForm.titulo = this.extractTitulo245FromMarcValue(entry.valor || '') || '';
        }
      }
    });
  }

  private updateSectionPagination(total: number) {
    const pages = total > 0 ? Math.max(1, Math.ceil(total / this.pageSize)) : 0;
    if (pages === 0) {
      this.currentPage = 1;
      this.secciones = [];
      this.pageLabels = {};
      return;
    }
    this.secciones = Array.from({ length: pages }, (_, idx) => idx + 1);
    if (this.currentPage > pages) {
      this.currentPage = pages;
    }
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

  isSubcampoRepeatable(tag: string, codigo: string) {
    const def = this.getSubcamposForTag(tag).find(item => item.codigo === codigo);
    return (def?.repetibilidad || '').toUpperCase() === 'R';
  }

  countSubcampoInstances(entry: CatalogacionEntrada, codigo: string) {
    return entry.subcampos.filter(sub => sub.codigo === codigo).length;
  }

  canRemoveSubcampo(entry: CatalogacionEntrada, index: number) {
    const sub = entry.subcampos[index];
    if (!sub) {
      return false;
    }
    if (!this.isSubcampoRepeatable(entry.tag, sub.codigo)) {
      return false;
    }
    return this.countSubcampoInstances(entry, sub.codigo) > 1;
  }

  addRepeatableSubcampo(entry: CatalogacionEntrada, codigo: string, index: number) {
    if (!this.isSubcampoRepeatable(entry.tag, codigo)) {
      return;
    }
    const def = this.getSubcamposForTag(entry.tag).find(item => item.codigo === codigo);
    entry.subcampos.splice(index + 1, 0, {
      codigo,
      nombre: def?.nombre || codigo,
      valor: ''
    });
  }

  removeSubcampo(tag: string, index: number) {
    const entry = this.ensureEntry(tag);
    const removed = entry.subcampos[index];
    if (!removed) {
      return;
    }
    if (removed.id) {
      entry.deletedSubcampoIds = entry.deletedSubcampoIds || [];
      entry.deletedSubcampoIds.push(removed.id);
    }
    entry.subcampos.splice(index, 1);
    this.syncEntryValueFromSubcampos(entry, true);
  }

  onSubcampoValueChange(entry: CatalogacionEntrada) {
    this.syncEntryValueFromSubcampos(entry, true);
  }

  private hasPersistedOrFilledSubcampos(entry: CatalogacionEntrada) {
    return entry.subcampos.some(sub => !!sub.id || String(sub.valor ?? '').trim().length > 0);
  }

  private syncEntryValueFromSubcampos(entry: CatalogacionEntrada, force = false) {
    if (!entry.subcampos.length) {
      if (force) {
        entry.valor = '';
        this.syncLibroTituloFrom245(entry, '');
      }
      return;
    }
    const rebuiltValue = entry.subcampos
      .map(sub => {
        const codigo = String(sub.codigo ?? '').trim();
        const valor = String(sub.valor ?? '').trim();
        if (!codigo || !valor) {
          return '';
        }
        return `$${codigo} ${valor}`;
      })
      .filter(Boolean)
      .join(' ');
    if (force || rebuiltValue.length > 0) {
      entry.valor = rebuiltValue;
    }
    this.syncLibroTituloFrom245(entry);
  }

  private extractTitulo245FromMarcValue(value?: string) {
    const rawValue = String(value || '').trim();
    if (!rawValue) {
      return '';
    }
    const normalizedValue = rawValue.replace(/\$/g, '\n$');
    const match = normalizedValue.match(/\$a\s*([\s\S]*?)(?=\n\$\w|\s*$)/i);
    return match?.[1]?.trim() || '';
  }

  private syncLibroTituloFrom245(entry: CatalogacionEntrada, fallback?: string) {
    if (entry.tag !== '245') {
      return;
    }
    const tituloSubcampo = entry.subcampos.find(sub => sub.codigo === 'a' && String(sub.valor ?? '').trim().length > 0);
    if (tituloSubcampo) {
      this.libroForm.titulo = tituloSubcampo.valor.trim();
      return;
    }
    const fallbackTitulo = this.extractTitulo245FromMarcValue(entry.valor || '') || fallback || this.libroForm.titulo;
    this.libroForm.titulo = fallbackTitulo;
  }

  private hydrateEntrySubcampos(entry: CatalogacionEntrada, saved: MarcSubcampo[]) {
    const definitions = this.getSubcamposForTag(entry.tag);
    const definitionsByCode = new Map(definitions.map(def => [def.codigo, def]));
    const savedByCode = new Map<string, MarcSubcampo[]>();
    saved.forEach(item => {
      const list = savedByCode.get(item.codigo) || [];
      list.push(item);
      savedByCode.set(item.codigo, list);
    });
    const orderedCodes = Array.from(new Set([
      ...definitions.map(def => def.codigo),
      ...saved.map(item => item.codigo)
    ]));
    const rebuilt: CatalogacionSubcampoEntry[] = [];
    orderedCodes.forEach(codigo => {
      const definition = definitionsByCode.get(codigo);
      const repeatable = (definition?.repetibilidad || '').toUpperCase() === 'R';
      const matches = savedByCode.get(codigo) || [];
      if (matches.length === 0) {
        if (definition) {
          rebuilt.push({
            codigo,
            nombre: definition.nombre,
            valor: ''
          });
        }
        return;
      }
      if (repeatable) {
        matches.forEach(match => {
          rebuilt.push({
            codigo,
            nombre: definition ? definition.nombre : codigo,
            valor: match.valor || '',
            id: match.id
          });
        });
        return;
      }
      const match = matches[0];
      rebuilt.push({
        codigo,
        nombre: definition ? definition.nombre : codigo,
        valor: match.valor || '',
        id: match.id
      });
    });
    entry.subcampos = rebuilt;
    this.ensureSubcamposForEntry(entry, entry.tag);
    this.syncEntryValueFromSubcampos(entry, saved.length > 0);
  }

  setIndicator(entry: CatalogacionEntrada, indicador: 1 | 2, value: string) {
    const safeValue = String(value ?? '');
    if (indicador === 1) {
      entry.ind1 = safeValue;
    } else {
      entry.ind2 = safeValue;
    }
    this.closeIndicatorDropdown(entry);
  }

  toggleIndicatorDropdown(entry: CatalogacionEntrada, indicador: 1 | 2, event: MouseEvent) {
    event.stopPropagation();
    entry.indicatorDropdownOpen =
      entry.indicatorDropdownOpen || { 1: false, 2: false };
    entry.indicatorDropdownOpen[indicador] = !entry.indicatorDropdownOpen[indicador];
  }

  isIndicatorDropdownOpen(entry: CatalogacionEntrada, indicador: 1 | 2) {
    return !!entry.indicatorDropdownOpen?.[indicador];
  }

  closeIndicatorDropdown(entry: CatalogacionEntrada) {
    if (entry.indicatorDropdownOpen) {
      entry.indicatorDropdownOpen[1] = false;
      entry.indicatorDropdownOpen[2] = false;
    }
  }

  private async reloadEntrySubcampos(entry: CatalogacionEntrada) {
    // Si el campo no está en memoria, se busca por registro+tag para recuperar
    // su ID y poder consultar los subcampos persistidos.
    if (!entry.campoId && this.currentRegistroId) {
      const stored = await this.dataService.getMarcCamposByRegistroAndTags(this.currentRegistroId, [entry.tag]);
      const match = stored.find(item => item.tag === entry.tag);
      if (match) {
        entry.campoId = match.id;
        entry.ind1 = match.ind1 || entry.ind1 || '';
        entry.ind2 = match.ind2 || entry.ind2 || '';
        entry.valor = match.valor || entry.valor || '';
      }
    }

    if (!entry.campoId) {
      this.ensureSubcamposForEntry(entry, entry.tag);
      return;
    }
    const saved = await this.dataService.getMarcSubcamposByCampo(entry.campoId);
    if (saved.length === 0 && String(entry.valor || '').includes('$')) {
      this.hydrateEntrySubcampos(entry, this.buildSubcamposFromMarcValue(entry));
      return;
    }
    this.hydrateEntrySubcampos(entry, saved);
  }

async setActiveCatalogTab(tab: 'marc' | 'autoridad') {
    this.activeCatalogTab = tab;
    if (tab === 'autoridad') {
      await this.autoridadCatalogacion?.refreshForLibro(this.selectedLibroId);
    }
  }

  async guardarTodo() {
    await this.guardarLibroYRegistro();
    if (this.autoridadCatalogacion) {
      await this.autoridadCatalogacion.guardarAsignaciones({ showAlert: false });
    }
  }

  async openSubcampoModal(entry: CatalogacionEntrada) {
    this.subcampoModalVisible = true;
    this.activeSubcamposEntry = entry;
    this.subcamposLoading = true;
    entry.subcampos = [];
    entry.deletedSubcampoIds = [];
    try {
      await this.reloadEntrySubcampos(entry);
    } catch (error: any) {
      console.error(error);
      const detail = error?.error?.message || error?.message || 'Error desconocido';
      Swal.fire('No se pudieron cargar los subcampos del tag', detail, 'error');
    } finally {
      this.subcamposLoading = false;
    }
  }

  closeSubcampoModal() {
    this.subcampoModalVisible = false;
    this.subcamposLoading = false;
    this.activeSubcamposEntry = undefined;
  }

  async guardarSubcamposModal() {
    if (!this.activeSubcamposEntry) {
      return;
    }
    try {
      this.subcamposSaving = true;
      const registroId = await this.ensureRegistroIdForSubcampos();
      if (!registroId) {
        return;
      }
      await this.syncCampo(this.activeSubcamposEntry, registroId);
      await this.reloadEntrySubcampos(this.activeSubcamposEntry);
      Swal.fire('Subcampos guardados correctamente');
    } catch (error: any) {
      console.error(error);
      const detail = error?.error?.message || error?.message || 'Error desconocido';
      Swal.fire('Ocurrió un error al guardar los subcampos', detail, 'error');
    } finally {
      this.subcamposSaving = false;
    }
  }

  private async ensureRegistroIdForSubcampos(): Promise<number | null> {
    if (this.currentRegistroId) {
      return this.currentRegistroId;
    }
    if (!this.selectedLibroId) {
      Swal.fire('Guarde primero el libro para poder guardar subcampos');
      return null;
    }
    if (!this.selectedFormatoId) {
      Swal.fire('Seleccione un formato MARC para poder guardar subcampos');
      return null;
    }
    const formato = this.formatos.find(f => f.id === this.selectedFormatoId);
    if (!formato) {
      Swal.fire('No se encontró el formato MARC seleccionado');
      return null;
    }
    const registroId = await this.syncMarcRegistro(this.selectedLibroId, formato);
    if (!registroId) {
      Swal.fire('No se pudo crear u obtener el registro MARC');
      return null;
    }
    return registroId;
  }

  async nuevoLibro() {
    this.resetLibroForm();
    this.recordEntries = {};
    this.resetCatalogForm();
    this.clearTagFilter();
    this.currentPage = 1;
    this.pageLabels = {};
    this.selectedLibroId = undefined;
    this.syncSystemManagedControlFields('');
    if (!this.selectedFormatoId && this.formatos.length) {
      this.selectedFormatoId = this.formatos[0].id;
    }
    await this.actualizarCurrentTags();
    this.libroFormVisible = true;
  }

  async editarLibro(libro: Libro) {
    this.selectedLibroId = libro.id;
    this.libroForm = { ...libro };
    this.recordEntries = {};
    this.resetCatalogForm();
    this.clearTagFilter();
    this.currentPage = 1;
    this.pageLabels = {};
    this.libroEditing = true;
    this.syncSystemManagedControlFields('');
    this.libroFormVisible = true;
    this.editLoading = true;
    try {
      const libroActual = await this.dataService.getLibroById(libro.id);
      if (!libroActual) {
        throw new Error('No se encontro el libro seleccionado en la base de datos.');
      }
      this.libroForm = { ...libroActual };
      this.syncTipoMaterialSeleccionado();
      await this.cargarMarcParaLibro(libroActual.id);
      await this.autoridadCatalogacion?.refreshForLibro(this.selectedLibroId);
      await this.actualizarCurrentTags();
    } catch (error: any) {
      console.error(error);
      const detail = error?.error?.message || error?.message || 'No se pudo cargar el libro para catalogacion.';
      Swal.fire('Error al cargar el libro', detail, 'error');
      this.cancelarLibro();
    } finally {
      this.editLoading = false;
    }
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
    this.syncSystemManagedControlFields('');
  }

  private async persistirLibro(): Promise<number> {
    const libroId = await this.dataService.createLibro(this.libroForm);
    if (!libroId) {
      throw new Error('No se pudo obtener el identificador del libro');
    }
    this.libroForm.id = libroId;
    this.selectedLibroId = libroId;
    this.syncSystemManagedControlFields('');
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
    const tieneIndicadores = (entry.ind1 || '').trim().length > 0 || (entry.ind2 || '').trim().length > 0;
    return valor.length > 0 || tieneSubcampos || tieneIndicadores;
  }

  async guardarLibroYRegistro() {
    if (!this.libroForm.titulo) {
      Swal.fire('Complete el título para continuar');
      return;
    }
    if (!this.libroForm.tipoMaterialId) {
      Swal.fire('Seleccione el tipo de documento para continuar');
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
        if (entry.tag === '001') {
          if (entry.campoId) {
            await this.deleteCampo(entry);
          }
          this.syncSystemManagedControlFields();
          continue;
        }
        if (entry.tag === '003') {
          this.syncSystemManagedControlFields();
          await this.syncCampo(entry, registroId);
          continue;
        }
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
    this.clearTagFilter();
    this.currentPage = 1;
    this.pageLabels = {};
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
        subcampos: [],
        deletedSubcampoIds: []
      };
    }
    return this.recordEntries[tag];
  }

  private async cargarMarcParaLibro(libroId: number) {
    this.recordEntries = {};
    this.currentRegistroId = undefined;
    const formatoActual = this.formatos.find(f => f.id === this.selectedFormatoId);
    const registro = await this.dataService.getMarcRegistroByLibroId(libroId, formatoActual?.codigo);
    if (!registro) {
      this.resetCatalogForm();
      this.syncSystemManagedControlFields('');
      return;
    }
    if (!registro.control001) {
      registro.control001 = await this.dataService.ensureMarcRegistroControl001(registro);
    }
    this.currentRegistroId = registro.id;
    const formatoMatch = this.formatos.find(f => f.codigo === registro.formato);
    if (formatoMatch) {
      this.selectedFormatoId = formatoMatch.id;
    }
    this.catalogForm = {
      leader: registro.leader || '',
      control001: registro.control001 || '',
      control005: registro.control005 || '',
      control008: registro.control008 || ''
    };
    this.syncSystemManagedControlFields(registro.control001 || '');
    await this.loadTituloFromTag245();
  }

  private async loadTituloFromTag245() {
    if (!this.currentRegistroId) {
      return;
    }
    const stored245 = await this.dataService.getMarcCamposByRegistroAndTags(this.currentRegistroId, ['245']);
    const campo245 = stored245.find(item => item.tag === '245');
    if (!campo245) {
      return;
    }
    const entry245 = this.ensureEntry('245');
    entry245.campoId = campo245.id;
    entry245.valor = campo245.valor || '';
    entry245.ind1 = campo245.ind1 || '';
    entry245.ind2 = campo245.ind2 || '';

    const savedSubcampos = await this.dataService.getMarcSubcamposByCampo(campo245.id);
    if (savedSubcampos.length > 0) {
      entry245.subcampos = savedSubcampos.map(sub => ({
        codigo: sub.codigo,
        nombre: sub.codigo,
        valor: sub.valor || '',
        id: sub.id
      }));
      this.syncLibroTituloFrom245(entry245);
      return;
    }

    this.libroForm.titulo = this.extractTitulo245FromMarcValue(campo245.valor || '') || this.libroForm.titulo;
  }

  private buildSubcamposFromMarcValue(entry: CatalogacionEntrada): MarcSubcampo[] {
    const rawValue = String(entry.valor || '').trim();
    if (!rawValue) {
      return [];
    }
    const normalizedValue = rawValue.replace(/\$/g, '\n$');
    const matches = Array.from(normalizedValue.matchAll(/\$([a-z0-9])\s*([\s\S]*?)(?=\n\$\w|\s*$)/gi));
    return matches
      .map(match => ({
        id: 0,
        marcCampoId: entry.campoId || 0,
        codigo: (match[1] || '').trim(),
        valor: (match[2] || '').trim()
      }))
      .filter(sub => sub.codigo.length > 0 && sub.valor.length > 0);
  }

  private async resolveCampoIdAfterCreate(entry: CatalogacionEntrada, registroId: number) {
    const expectedValue = String(entry.valor || '').trim();
    for (let attempt = 0; attempt < 3; attempt++) {
      const stored = await this.dataService.getMarcCamposByRegistroAndTags(registroId, [entry.tag]);
      const match = stored.find(item =>
        item.tag === entry.tag &&
        String(item.ind1 || '') === String(entry.ind1 || '') &&
        String(item.ind2 || '') === String(entry.ind2 || '') &&
        String(item.valor || '').trim() === expectedValue
      ) || stored[0];
      if (match?.id) {
        entry.campoId = match.id;
        return match.id;
      }
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    return undefined;
  }

  private async syncMarcRegistro(libroId: number, formato: MarcDicFormato): Promise<number | null> {
    if (!this.catalogForm.control005) {
      this.catalogForm.control005 = this.buildMarc005Timestamp();
    }
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
      this.syncSystemManagedControlFields(registroPayload.control001 || '');
      return this.currentRegistroId;
    }
    const registroId = await this.dataService.createMarcRegistro(registroPayload);
    if (registroId) {
      this.currentRegistroId = registroId;
      this.syncSystemManagedControlFields(registroPayload.control001 || '');
    }
    return registroId;
  }

  private async syncCampo(entry: CatalogacionEntrada, registroId: number) {
    this.syncEntryValueFromSubcampos(entry, this.hasPersistedOrFilledSubcampos(entry));
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
      campoId = newId || await this.resolveCampoIdAfterCreate(entry, registroId);
      entry.campoId = campoId;
    }
    if (!campoId) {
      return;
    }
    await this.syncSubcampos(entry, campoId);
  }

  private async syncSubcampos(entry: CatalogacionEntrada, campoId: number) {
    if (entry.deletedSubcampoIds?.length) {
      const ids = Array.from(new Set(entry.deletedSubcampoIds.filter(id => !!id)));
      for (const id of ids) {
        await this.dataService.deleteMarcSubcampo(id);
      }
      entry.deletedSubcampoIds = [];
    }
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
    this.syncEntryValueFromSubcampos(entry, true);
  }
}
