import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ReceivableClassificationService } from './receivable-classification.service';
//import { CatalogoContableService } from '../../accountant/catalogo-contable/catalogo-contable.service';


@Component({
  selector: 'app-receivable-classification',
  templateUrl: './receivable-classification.component.html',
  styleUrls: ['./receivable-classification.component.css'],
})
export class ReceivableClassificationComponent implements OnInit {
  constructor(
    private receivableClassificationService: ReceivableClassificationService,
    //private catalogoContableService:CatalogoContableService
  ) {}
  Categories = [];
  Hijas = [];
  searchField = '';
  searchFieldHijas = '';
  PantallaCuentasHijas = false;
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  edit = false;
  interfazContable = localStorage.getItem('InterfazContable');

  /**
   * Variables del
   * Formulario de Edición
   */
  Clasificacion = {
    Id_Clasificacion: '',
    Id_Tipo: '1',
    Nombre: '',
    Plazo: '',
    Estado: '1',
    Cuenta:'',
    Detalle_Cuenta:''
  };
  ngOnInit(): void {
    this.loadCategories();
  }
  async loadCategories(search?: any) {
    let data = await this.receivableClassificationService.loadCategories(
      this.paginacion,
      search
    );
    if (data['total'] == 0) {
      this.Categories = [];
    } else {
      this.Categories = data['data'];
    }
  }
  async editRecord(Clasificacion) {
    this.edit = true;
    if (Clasificacion) {
      this.Clasificacion.Id_Clasificacion = Clasificacion.Id_Clasificacion;
      this.loadClasificacion();
    } else {
      this.Clasificacion = {
        Id_Clasificacion: '',
        Id_Tipo: '1',
        Nombre: '',
        Plazo: '',
        Estado: '1',
        Cuenta:'',
        Detalle_Cuenta:''
      };
    }
  }
  ChangePage(action) {
    if (action == 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion.FirstRow < 50) {
        this.paginacion.FirstRow = 1;
        this.paginacion.LastRow = 50;
      } else {
        this.paginacion.FirstRow = this.paginacion.FirstRow - 50;
        this.paginacion.LastRow = this.paginacion.LastRow - 50;
      }
    }
    if (action == 2) {
      this.paginacion.FirstRow = this.paginacion.FirstRow + 50;
      this.paginacion.LastRow = this.paginacion.LastRow + 50;
    }
    this.loadCategories();
  }
  keytab(event) {
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search() {
    this.loadCategories(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
  cancel() {
    this.edit = false;
  }
  async grabar() {
    if (this.Clasificacion.Nombre == '') {
      Swal.fire('Favor Suministrar el nombre de la Clasificacion');
      return false;
    }
    let data = await this.receivableClassificationService.saveClasificacion(
      this.Clasificacion
    );
    if (data['success'] == 'true') {
      Swal.fire('Clasificacion grabada correctamente');
      this.loadCategories(this.searchField);
      this.edit = false;
    }
    return true;
  }
  async loadClasificacion() {
    let data = await this.receivableClassificationService.loadClasificacion(
      this.Clasificacion.Id_Clasificacion
    );
    if (data['total'] == 1) {
      this.Clasificacion = data['data'][0];
    }
  }

  searchHijas() {
    this.loadHijas(this.searchFieldHijas);
  }
  keytabHijas(event: any) {
    if (event.key === 'Enter') {
      this.searchHijas();
    }
  }
  openCuentasPanel(){
    this.loadHijas(this.searchFieldHijas);
    this.PantallaCuentasHijas = true;
  }
  closePantallaHijas(){
    this.PantallaCuentasHijas = false;
  }
  SeleccionarCuenta(Cuenta:any){
    this.Clasificacion.Cuenta = Cuenta.Cuenta;
    this.Clasificacion.Detalle_Cuenta = Cuenta.Descripcion;
    this.closePantallaHijas();
  }
  async loadHijas(search?:any){
    //let data = await this.catalogoContableService.loadParents(this.paginacion,search,0);
    let data = [];
    if(data['total'] == 0){
      this.Hijas = [];
    }else{
      this.Hijas = data['data'];
    }
  }
}
