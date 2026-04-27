import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import {
  Autoridad,
  AutoridadCampo,
  AutoridadDicCampo,
  AutoridadDicFormato,
  AutoridadDicIndicador,
  AutoridadDicSubcampo
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
  indicatorDropdownOpen?: Record<1 | 2, boolean>;
  libroId?: number;
}

@Component({
  selector: 'app-autoridad-catalogacion',
  exportAs: 'autoridadCatalogacion',
  templateUrl: './autoridad-catalogacion.component.html',
  styleUrls: ['./autoridad-catalogacion.component.css']
})
export class AutoridadCatalogacionComponent implements OnInit, OnChanges {
  autoridades: Autoridad[] = [];
  formatos: AutoridadDicFormato[] = [];
  subcampos: AutoridadDicSubcampo[] = [];
  indicadores: AutoridadDicIndicador[] = [];

  selectedAutoridadId?: number;
  selectedFormatoId?: number;

  currentTags: AutoridadDicCampo[] = [];
  currentPage = 1;
  pageSize = 50;
  secciones: number[] = [];
  pageLabels: Record<number, string> = {};
  totalTagsForFormat = 0;

  recordEntries: Record<string, CatalogacionEntrada> = {};
  authorityCampoMap = new Map<string, AutoridadCampo>();

  indicatorOptionsByTag: Record<string, Record<1 | 2, { value: string; meaning?: string }[]>> = {};
  subcamposByTag: Record<string, AutoridadDicSubcampo[]> = {};

  subcampoModalVisible = false;
  activeSubcamposEntry?: CatalogacionEntrada;

  isSaving = false;
  @Input() showSaveButton = true;
  @Input() libroId?: number;

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargarDatosBase();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['libroId']) {
      this.refreshForLibro();
    }
  }

  private async cargarDatosBase() {
    const [autoridades, formatos] = await Promise.all([
      this.dataService.getAutoridades(),
      this.dataService.getAutoridadDicFormatos()
    ]);
    this.autoridades = autoridades;
    this.formatos = formatos;
    this.subcampos = [];
    this.indicadores = [];
    if (!this.selectedAutoridadId && autoridades.length) {
      this.selectedAutoridadId = autoridades[0].id;
    }
    if (!this.selectedFormatoId && formatos.length) {
      this.selectedFormatoId = formatos[0].id;
    }
    this.buildCaches();
    await this.actualizarCurrentTags();
    await this.loadAuthorityMap();
  }

  private async loadAuthorityMap() {
    this.authorityCampoMap.clear();
    if (!this.selectedAutoridadId) {
      this.recordEntries = {};
      return;
    }
    const campos = await this.dataService.getAutoridadCampos({
      autoridadId: this.selectedAutoridadId,
      libroId: this.libroId
    });
    campos
      .filter(c => c.autoridadId === this.selectedAutoridadId)
      .forEach(c => this.authorityCampoMap.set(c.tag, c));
    this.recordEntries = {};
  }

  async onAutoridadChange(autoridadId: number | undefined) {
    if (!autoridadId) {
      this.selectedAutoridadId = undefined;
      this.recordEntries = {};
      this.authorityCampoMap.clear();
      return;
    }
    this.selectedAutoridadId = autoridadId;
    this.recordEntries = {};
    await this.loadAuthorityMap();
  }

  async onFormatoChange() {
    this.currentPage = 1;
    this.pageLabels = {};
    this.recordEntries = {};
    await this.actualizarCurrentTags();
  }

  async refreshForLibro(libroId?: number): Promise<void> {
    if (libroId !== undefined) {
      this.libroId = libroId;
    }
    this.recordEntries = {};
    this.authorityCampoMap.clear();
    await this.loadAuthorityMap();
    await this.actualizarCurrentTags();
  }

  getTagsPorSeccion() {
    return this.currentTags;
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

  getEntry(tag: string, nombre: string) {
    const entry = this.ensureEntry(tag);
    entry.nombre = nombre || entry.nombre;
    this.ensureSubcamposForEntry(entry, tag);
    return entry;
  }

  getIndicatorOptions(tag: string, posicion: 1 | 2) {
    return this.indicatorOptionsByTag[tag]?.[posicion] || [];
  }

  getIndicatorLabel(tag: string, posicion: 1 | 2, valor: string) {
    const options = this.getIndicatorOptions(tag, posicion);
    const match = options.find(opt => String(opt.value) === String(valor));
    return match?.meaning || valor;
  }

  getIndicatorDisplayValue(entry: CatalogacionEntrada, indicador: 1 | 2) {
    const value = indicador === 1 ? entry.ind1 : entry.ind2;
    return String(value ?? '').trim() || 'x';
  }

  getTagDisplay(tag: string, entry: CatalogacionEntrada) {
    const suffix = this.getIndicatorDisplayValue(entry, 1);
    return `${tag}${suffix}`;
  }

  getIndicatorButtonLabel(tag: string, entry: CatalogacionEntrada, indicador: 1 | 2) {
    return `${tag}-${this.getIndicatorDisplayValue(entry, indicador)}`;
  }

  getSubcamposForTag(tag: string) {
    const key = this.buildTagKey(this.selectedFormatoId, tag);
    return this.subcamposByTag[key] || [];
  }

  hasSubcampos(tag: string) {
    return this.getSubcamposForTag(tag).length > 0;
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

  private buildTagKey(formatoId: number | undefined, tag: string) {
    return `${formatoId ?? 'no-formato'}::${tag}`;
  }

  private async actualizarCurrentTags() {
    if (!this.selectedFormatoId) {
      this.currentTags = [];
      this.secciones = [];
      this.currentPage = 1;
      this.totalTagsForFormat = 0;
      this.subcampos = [];
      this.indicadores = [];
      this.buildCaches();
      return;
    }
    const total = await this.dataService.countAutoridadDicCampos(this.selectedFormatoId);
    this.totalTagsForFormat = total;
    this.updateSectionPagination(total);
    const { campos } = await this.dataService.getAutoridadDicCamposPage(
      this.selectedFormatoId,
      this.currentPage,
      this.pageSize
    );
    await this.loadDictionaryForCurrentTags(campos);
    this.currentTags = campos;
    if (campos.length > 0) {
      const startTag = campos[0].tag || '---';
      const endTag = campos[campos.length - 1].tag || '---';
      this.pageLabels[this.currentPage] = `${startTag}-${endTag}`;
    }
    this.populateEntriesForCurrentTags(campos);
  }

  private async loadDictionaryForCurrentTags(campos: AutoridadDicCampo[]) {
    if (!this.selectedFormatoId || campos.length === 0) {
      this.subcampos = [];
      this.indicadores = [];
      this.buildCaches();
      return;
    }
    const tags = Array.from(new Set(campos.map(c => c.tag).filter(Boolean)));
    const [subcampos, indicadores] = await Promise.all([
      this.dataService.getAutoridadDicSubcamposPorTags(this.selectedFormatoId, tags),
      this.dataService.getAutoridadDicIndicadoresPorTags(this.selectedFormatoId, tags)
    ]);
    this.subcampos = subcampos;
    this.indicadores = indicadores;
    this.buildCaches();
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
      const mapped = this.authorityCampoMap.get(tag);
      if (mapped) {
        this.recordEntries[tag].campoId = mapped.id;
        this.recordEntries[tag].ind1 = mapped.ind1 || '';
        this.recordEntries[tag].ind2 = mapped.ind2 || '';
        this.recordEntries[tag].valor = mapped.valor || '';
      }
    }
    this.recordEntries[tag].libroId = this.libroId;
    return this.recordEntries[tag];
  }

  private populateEntriesForCurrentTags(campos: AutoridadDicCampo[]) {
    campos.forEach(campo => {
      const entry = this.ensureEntry(campo.tag);
      const mapped = this.authorityCampoMap.get(campo.tag);
      entry.libroId = this.libroId;
      if (mapped) {
        entry.campoId = mapped.id;
        entry.valor = mapped.valor || '';
        entry.ind1 = mapped.ind1 || '';
        entry.ind2 = mapped.ind2 || '';
      }
    });
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
    entry.indicatorDropdownOpen = entry.indicatorDropdownOpen || { 1: false, 2: false };
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

  async openSubcampoModal(entry: CatalogacionEntrada) {
    if (!this.selectedAutoridadId) {
      Swal.fire('Selecciona una autoridad primero');
      return;
    }
    if (!entry.campoId) {
      await this.syncAutoridadCampo(entry);
    }
    await this.reloadEntrySubcampos(entry);
    this.activeSubcamposEntry = entry;
    this.subcampoModalVisible = true;
  }

  private async reloadEntrySubcampos(entry: CatalogacionEntrada) {
    this.ensureSubcamposForEntry(entry, entry.tag);
    if (!entry.campoId) {
      return;
    }
    const saved = await this.dataService.getAutoridadSubcamposByCampo(entry.campoId);
    const definitions = new Map(this.getSubcamposForTag(entry.tag).map(def => [def.codigo, def]));
    entry.subcampos.forEach(sub => {
      const match = saved.find(item => item.codigo === sub.codigo);
      if (match) {
        sub.valor = match.valor || '';
        sub.id = match.id;
      } else {
        sub.id = undefined;
        if (!sub.valor) {
          sub.valor = '';
        }
      }
      const definition = definitions.get(sub.codigo);
      if (definition) {
        sub.nombre = definition.nombre;
      }
    });
    saved.forEach(match => {
      if (!entry.subcampos.some(sub => sub.codigo === match.codigo)) {
        const definition = definitions.get(match.codigo);
        entry.subcampos.push({
          codigo: match.codigo,
          nombre: definition ? definition.nombre : match.codigo,
          valor: match.valor || '',
          id: match.id
        });
      }
    });
  }

  async closeSubcampoModal() {
    if (this.activeSubcamposEntry?.campoId) {
      await this.syncAutoridadSubcampos(this.activeSubcamposEntry, this.activeSubcamposEntry.campoId);
    }
    this.subcampoModalVisible = false;
    this.activeSubcamposEntry = undefined;
  }

  async guardarAsignaciones(options?: { showAlert?: boolean }) {
    if (!this.selectedAutoridadId) {
      Swal.fire('Selecciona una autoridad para continuar');
      return;
    }
    try {
      this.isSaving = true;
      const entries = Object.values(this.recordEntries);
      for (const entry of entries) {
        if (this.entryHasData(entry)) {
          await this.syncAutoridadCampo(entry);
        } else if (entry.campoId) {
          await this.deleteAutoridadCampo(entry);
        }
      }
      await this.loadAuthorityMap();
      if (options?.showAlert ?? true) {
        Swal.fire('Asignaciones guardadas');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar las asignaciones');
    } finally {
      this.isSaving = false;
    }
  }

  async syncAutoridadCampo(entry: CatalogacionEntrada) {
    if (!this.selectedAutoridadId) {
      return;
    }
    const payload: AutoridadCampo = {
      id: entry.campoId || 0,
      autoridadId: this.selectedAutoridadId,
      libroId: this.libroId,
      tag: entry.tag,
      ind1: entry.ind1,
      ind2: entry.ind2,
      valor: entry.valor
    };
    let campoId = entry.campoId;
    if (campoId) {
      await this.dataService.updateAutoridadCampo(payload);
    } else {
      const newId = await this.dataService.createAutoridadCampo(payload);
      campoId = newId || undefined;
      entry.campoId = campoId;
    }
    if (campoId) {
      this.authorityCampoMap.set(entry.tag, { ...payload, id: campoId });
      await this.syncAutoridadSubcampos(entry, campoId);
    }
  }

  private async syncAutoridadSubcampos(entry: CatalogacionEntrada, campoId: number) {
    for (const sub of entry.subcampos) {
      const valor = (sub.valor || '').trim();
      if (sub.id) {
        if (valor.length > 0) {
          await this.dataService.updateAutoridadSubcampo({
            id: sub.id,
            autoridadCampoId: campoId,
            codigo: sub.codigo,
            valor: sub.valor
          });
        } else {
          await this.dataService.deleteAutoridadSubcampo(sub.id);
          sub.id = undefined;
        }
      } else if (valor.length > 0) {
        const subId = await this.dataService.createAutoridadSubcampo({
          id: 0,
          autoridadCampoId: campoId,
          codigo: sub.codigo,
          valor: sub.valor
        });
        sub.id = subId || undefined;
      }
    }
  }

  private async deleteAutoridadCampo(entry: CatalogacionEntrada) {
    if (!entry.campoId) {
      return;
    }
    for (const sub of entry.subcampos) {
      if (sub.id) {
        await this.dataService.deleteAutoridadSubcampo(sub.id);
        sub.id = undefined;
      }
    }
    await this.dataService.deleteAutoridadCampo(entry.campoId);
    entry.campoId = undefined;
    this.authorityCampoMap.delete(entry.tag);
  }

  private entryHasData(entry: CatalogacionEntrada) {
    const valor = (entry.valor || '').trim();
    const tieneSubcampos = entry.subcampos.some(sub => (sub.valor || '').trim().length > 0);
    const tieneIndicadores = (entry.ind1 || '').trim().length > 0 || (entry.ind2 || '').trim().length > 0;
    return valor.length > 0 || tieneSubcampos || tieneIndicadores;
  }
}
