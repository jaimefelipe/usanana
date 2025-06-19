import { Component, OnInit } from '@angular/core';
import { CmsPaginasService } from './cms-paginas.service';

@Component({
  selector: 'app-cms-paginas',
  templateUrl: './cms-paginas.component.html',
  styleUrls: ['./cms-paginas.component.css']
})
export class CmsPaginasComponent implements OnInit {

  edit = false;
  searchField = '';
  tituloSeccion = 'Páginas';
  Paginas: any[] = [];
  PaginasMenuPadre: any[] = [];
  Pagina: any = {};
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  GeneralActivo = true;
  SeccionesActivo = false;
  SeoActivo = false;
  MenuActivo = false;

  constructor(private cmsService: CmsPaginasService) {}

  async ngOnInit(): Promise<void> {
    await this.cargarPaginas();
  }

  async cargarPaginas(): Promise<void> {
    const result = await this.cmsService.getPaginas(this.paginacion, this.searchField);
    if (result.total > 0) {
      this.Paginas = result.data;
      this.paginacion.TotalRows = result.total;
    } else {
      this.Paginas = [];
      this.paginacion.TotalRows = 0;
    }
    // Excluí la misma página en edición si se desea prevenir recursividad
    this.PaginasMenuPadre = this.Paginas.filter(p => p.Id_Pagina !== this.Pagina?.Id_Pagina);
  }

  async search(): Promise<void> {
    await this.cargarPaginas();
  }

  keytab(event: any): void {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  editRecord(pagina: any): void {
    this.Pagina = pagina ? { ...pagina } : this.crearNuevaPagina();
    this.edit = true;
    this.GeneralActivo = true;
    this.SeccionesActivo = false;
    this.SeoActivo = false;
  }

  crearNuevaPagina(): any {
    return {
      Id_Pagina: null,
      Id_Empresa: null,
      Url_Amigable: '',
      Titulo: '',
      Es_Dinamica: true,
      Ruta_Estatica: '',
      Activa: true,
      Meta_Descripcion: '',
      Meta_Keywords: ''
    };
  }

  async grabar(): Promise<void> {
     const result = await this.cmsService.savePagina(this.Pagina);

    // Si era nueva, result debe tener el ID insertado
    if (!this.Pagina.Id_Pagina && result?.Id_Pagina) {
      this.Pagina.Id_Pagina = result.Id_Pagina;
    }

    await this.cargarPaginas();
    // Mantenemos edit = true para permitir editar secciones después de grabar
  }

  cancel(): void {
    this.edit = false;
  }

  ChangePage(op: number): void {
    console.log('Cambiar de página:', op);
  }

  activarGeneral(): void {
    this.GeneralActivo = true;
    this.SeccionesActivo = false;
    this.SeoActivo = false;
    this.MenuActivo = false;
  }

  activarSecciones(): void {
    this.GeneralActivo = false;
    this.SeccionesActivo = true;
    this.SeoActivo = false;
    this.MenuActivo = false;
  }

  activarSeo(): void {
    this.GeneralActivo = false;
    this.SeccionesActivo = false;
    this.SeoActivo = true;
    this.MenuActivo = false;
  }
  activarMenu(): void {
    this.GeneralActivo = false;
    this.SeccionesActivo = false;
    this.SeoActivo = false;
    this.MenuActivo = true;
  }
}
