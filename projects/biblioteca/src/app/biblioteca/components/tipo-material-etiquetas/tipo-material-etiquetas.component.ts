import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import {
  MarcDicCampo,
  MarcDicFormato,
  TipoMaterial,
  TipoMaterialMarcCampo
} from '../../models/biblioteca.models';

@Component({
  selector: 'app-tipo-material-etiquetas',
  templateUrl: './tipo-material-etiquetas.component.html',
  styleUrls: ['./tipo-material-etiquetas.component.css']
})
export class TipoMaterialEtiquetasComponent implements OnInit {
  tiposMaterial: TipoMaterial[] = [];
  formatos: MarcDicFormato[] = [];
  campos: MarcDicCampo[] = [];
  relaciones: TipoMaterialMarcCampo[] = [];

  selectedTipoMaterialId?: number;
  selectedFormatoId?: number;
  searchField = '';
  loading = false;
  savingCampoId?: number;

  private relacionIdPorCampoId: Record<number, number> = {};

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    this.loading = true;
    try {
      const [tiposMaterial, formatos] = await Promise.all([
        this.dataService.getTiposMaterial(),
        this.dataService.getMarcDicFormatos()
      ]);
      this.tiposMaterial = tiposMaterial;
      this.formatos = formatos;
      if (formatos.length) {
        this.selectedFormatoId = formatos[0].id;
      }
      await this.recargarPantalla();
    } finally {
      this.loading = false;
    }
  }

  async onFiltroChange() {
    await this.recargarPantalla();
  }

  keytab(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  search() {
    this.searchField = this.searchField.trim();
  }

  async toggleCampo(campo: MarcDicCampo, checked: boolean) {
    if (!this.selectedTipoMaterialId) {
      Swal.fire('Seleccione el tipo de documento');
      return;
    }

    this.savingCampoId = campo.id;
    try {
      if (checked) {
        await this.dataService.createTipoMaterialMarcCampo({
          id: 0,
          tipoMaterialId: this.selectedTipoMaterialId,
          dicCampoId: campo.id
        });
      } else {
        const relacionId = this.relacionIdPorCampoId[campo.id];
        if (relacionId) {
          await this.dataService.deleteTipoMaterialMarcCampo(relacionId);
        }
      }
      await this.cargarRelaciones();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al actualizar la asignacion de etiquetas');
    } finally {
      this.savingCampoId = undefined;
    }
  }

  isCampoAsignado(campoId: number) {
    return !!this.relacionIdPorCampoId[campoId];
  }

  get totalAsignadas() {
    return Object.keys(this.relacionIdPorCampoId).length;
  }

  private async recargarPantalla() {
    await Promise.all([
      this.cargarCampos(),
      this.cargarRelaciones()
    ]);
  }

  private async cargarCampos() {
    if (!this.selectedFormatoId) {
      this.campos = [];
      return;
    }
    this.campos = await this.dataService.getMarcDicCamposByFormato(this.selectedFormatoId);
  }

  private async cargarRelaciones() {
    if (!this.selectedTipoMaterialId) {
      this.relaciones = [];
      this.relacionIdPorCampoId = {};
      return;
    }
    this.relaciones = await this.dataService.getTipoMaterialMarcCampos(
      this.selectedTipoMaterialId,
      this.selectedFormatoId
    );
    this.relacionIdPorCampoId = this.relaciones.reduce<Record<number, number>>((acc, item) => {
      acc[item.dicCampoId] = item.id;
      return acc;
    }, {});
  }
}
