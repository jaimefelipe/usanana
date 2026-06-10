import { Component, OnInit } from '@angular/core';
import { AulaVirtualService } from './aula-virtual.service';
import { GrupoAcademicoService } from '../../registro/grupo-academico/grupo-academico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aula-virtual',
  templateUrl: './aula-virtual.component.html',
  styleUrls: ['./aula-virtual.component.css']
})
export class AulaVirtualComponent implements OnInit {

constructor(private aulaService: AulaVirtualService, private grupoService: GrupoAcademicoService) { }

  tituloSeccion = 'Aulas Virtuales';
  formularioEditando = false;
  hoy = new Date();
  edit = false;

  // Tabs
  GeneralActivo = true;
  SemanasActivo = false;
  ActividadesActivo = false;
  EvaluacionesActivo = false;

  // Aula actual
  Aula = {
    Id_AulaVirtual: '',
    Id_Empresa: 1,
    Id_Grupo: '',
    Bienvenida: '',
    Link_Reglamento: '',
    Link_Etiqueta: '',
    Imagen: '',
    Activo: true
  };

  Aulas = [];
  Grupos = [];
  imagenAulaFile: File | null = null;

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  searchField = '';

  ngOnInit(): void {
    this.loadAulas();
    this.loadGrupos();
  }

  ChangePage(action: number) {
    if (action == 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = 50;
    } else if (action == 1) {
      this.paginacion.FirstRow = Math.max(1, this.paginacion.FirstRow - 50);
      this.paginacion.LastRow = this.paginacion.FirstRow + 49;
    } else if (action == 2) {
      this.paginacion.FirstRow += 50;
      this.paginacion.LastRow += 50;
    }
    this.loadAulas();
  }

  async loadGrupos() {
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.grupoService.loadGrupos(paginacion,'');
    //onst data = await this.grupoService.getGruposActivos();
    this.Grupos = data?.data || data;
  }

  async loadAulas() {
    const data = await this.aulaService.getAulas(this.paginacion, this.searchField);
    this.Aulas = data?.data || [];
  }

  search() {
    this.loadAulas();
  }

  keytab(event: KeyboardEvent) {
    if (event.key === 'Enter') this.search();
  }

  editRecord(aula?: any) {
    this.edit = true;
    this.imagenAulaFile = null;
    this.activarGeneral();
    if (aula) {
      this.Aula = {
        ...aula,
        Imagen: aula.Imagen || '',
        Activo: aula.Activo === true || aula.Activo === 1 || aula.Activo === '1'
      };
      localStorage.setItem('Id_Grupo',this.Aula.Id_Grupo)
    } else {
      this.Aula = {
        Id_AulaVirtual: '',
        Id_Empresa: 1,
        Id_Grupo: '',
        Bienvenida: '',
        Link_Reglamento: '',
        Link_Etiqueta: '',
        Imagen: '',
        Activo: true
      };
    }
  }

  async grabar() {
    if (!this.Aula.Id_Grupo || !this.Aula.Bienvenida) {
      Swal.fire('Debe seleccionar el grupo y escribir la bienvenida');
      return;
    }

    if(this.imagenAulaFile){
      const formData = new FormData();
      formData.append('archivo', this.imagenAulaFile);
      formData.append('Id_Empresa', localStorage.getItem('Id_Empresa') || '');
      formData.append('Id_Grupo', this.Aula.Id_Grupo || '');
      formData.append('Id_AulaVirtual', this.Aula.Id_AulaVirtual || '');

      const resp = await this.aulaService.subirImagen(formData);
      if(resp && (resp.success === true || resp.success === 'true') && resp.url){
        this.Aula.Imagen = encodeURI(resp.url);
      }else{
        Swal.fire(resp?.message || 'Error al subir la imagen del aula virtual');
        return;
      }
    }

    this.aulaService.saveAula(this.Aula).then(resp => {
      Swal.fire('Aula virtual guardada correctamente');
      this.loadAulas();
      this.edit = false;
      this.imagenAulaFile = null;
    }).catch(err => {
      console.error(err);
      Swal.fire('Error al guardar el aula');
    });
  }

  cancelar() {
    this.edit = false;
    this.imagenAulaFile = null;
  }

  handleImagenAulaSeleccionada(file: File | null) {
    this.imagenAulaFile = file;
  }

  // Tabs
  activarGeneral() {
    this.GeneralActivo = true;
    this.SemanasActivo = false;
    this.ActividadesActivo = false;
    this.EvaluacionesActivo = false;
  }

  activarSemanas() {
    this.GeneralActivo = false;
    this.SemanasActivo = true;
    this.ActividadesActivo = false;
    this.EvaluacionesActivo = false;
  }

  activarActividades() {
    this.GeneralActivo = false;
    this.SemanasActivo = false;
    this.ActividadesActivo = true;
    this.EvaluacionesActivo = false;
  }

  activarEvaluaciones() {
    this.GeneralActivo = false;
    this.SemanasActivo = false;
    this.ActividadesActivo = false;
    this.EvaluacionesActivo = true;
  }
}
