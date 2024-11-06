//import { CatalogoContableService } from '../../../../../conta/src/app/accountant/catalogo-contable/catalogo-contable.service';
import { CategoryService } from './../category/category.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    //private catalogoContableService: CatalogoContableService
    ) {}
  interfazInventario = false;
  appRestaurante = false;
  appConta = false;
  AccountPanel = false;
  CuentasPanel = 1;
  SeguridadStr = localStorage.getItem('ToxoSG');
  Seguridad = [];
  Categories = [];
  Accounts = [];
  searchField = '';
  searchFieldAccount = '';
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  edit = false;
  interfazContable = false; // localStorage.getItem('InterfazContable');

  /**
   * Variables del
   * Formulario de Edición
   */
  category = {
    Id_Categoria: '',
    Id_Tipo: '1',
    Nombre: '',
    Id_Cuenta_Contable_Compras: '',
    Cuenta_Contable_Compras: '',
    Id_Cuenta_Contable_Ventas: '',
    Cuenta_Contable_Ventas: '',
    Codigo_Actividad: '',
    Utilidad: '',
    Servicio:'',
    Cocina: '0',
    Estado: '1',
    Toma_Fisica:'0'
  };
  ngOnInit(): void {
    this.SeguridadStr = localStorage.getItem('ToxoSG');
    if (this.SeguridadStr == '') {
      this.SeguridadStr = '0.0.0.0.0.0.0.0';
    }
    
    this.Seguridad = this.SeguridadStr.split('.');
    console.log(this.Seguridad);
    if (this.Seguridad[2] == 1) {
      this.interfazInventario = true;
    }
    if (this.Seguridad[7] == 1) {
      this.appRestaurante = true;
    }
    if (this.Seguridad[5] == 1) {
      this.interfazContable = true;
    }
    this.loadCategories();
    this.searchAccount();
    // Revisar perfil de conta y restaurante


  }
  async loadCategories(search?: any) {
    let data = await this.categoryService.loadCategories(
      this.paginacion,
      search
    );
    if (data['total'] == 0) {
      this.Categories = [];
    } else {
      this.Categories = data['data'];
    }
  }
  async editRecord(category) {
    this.edit = true;
    if (category) {
      this.category.Id_Categoria = category.Id_Categoria;
      this.loadCategory();
    } else {
      this.category = {
        Id_Categoria: '',
        Id_Tipo: '1',
        Nombre: '',
        Id_Cuenta_Contable_Compras: '',
        Cuenta_Contable_Compras: '',
        Id_Cuenta_Contable_Ventas: '',
        Cuenta_Contable_Ventas: '',
        Codigo_Actividad: '',
        Utilidad: '',
        Cocina: '0',
        Servicio:'',
        Estado: '1',
        Toma_Fisica:'0'
      };
      this.searchFieldAccount = '';
      this.searchAccount();
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
    if (this.category.Nombre == '') {
      Swal.fire('Favor Suministrar el nombre de la Categoria');
      return false;
    }
    if (this.category.Utilidad == '') {
      this.category.Utilidad = '0';
    }
    let data = await this.categoryService.saveCategory(this.category);
    if (data['success'] == 'true') {
      Swal.fire('Categoria grabada correctamente');
      this.loadCategories(this.searchField);
      this.edit = false;
    }
    return true;
  }
  async loadCategory() {
    let data = await this.categoryService.loadCategory(
      this.category.Id_Categoria
    );
    if (data['total'] == 1) {
      this.category = data['data'][0];
    }
  }
  async openAccountPanel(panel) {
    if(panel == 1){
      this.searchFieldAccount = this.category.Id_Cuenta_Contable_Compras;
    }else{
      this.searchFieldAccount = this.category.Id_Cuenta_Contable_Ventas;
    }
    this.searchAccount();

    this.CuentasPanel = panel;
    this.AccountPanel = true;
  }
  async searchAccount(search?) {
    //let data = await this.catalogoContableService.loadParents(this.paginacion,this.searchFieldAccount,0);
    let data = [];
    if(data['total'] == 0){
      this.Accounts = [];
    }else{
      this.Accounts = data['data'];
    }
  }
  keytabAccount(event) {
    if (event.key === 'Enter') {
      this.searchAccount();
    }
  }
  closeAccountPanel(){
    this.AccountPanel = false;
  }
  selectAccount(Account){
    if(this.CuentasPanel == 1 ){
      this.category.Id_Cuenta_Contable_Compras = Account.Cuenta;
      this.category.Cuenta_Contable_Compras = Account.Cuenta  + ' - ' + Account.Descripcion;
    }else{
      this.category.Id_Cuenta_Contable_Ventas = Account.Cuenta;
      this.category.Cuenta_Contable_Ventas = Account.Cuenta  + ' - ' + Account.Descripcion;
    }

    this.closeAccountPanel();
  }
}
