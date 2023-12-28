import { Component, OnInit } from '@angular/core';
//import { CatalogoContableService } from '../../../../../conta/src/app/accountant/catalogo-contable/catalogo-contable.service';
import { SubCategoryService } from './sub-category.service';
import { CategoryService } from '../category/category.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {

  constructor(
    private subCategoryService: SubCategoryService,
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
  Sub_Category = {
    Id_Categoria:'',
    Id_Sub_Categoria: '',
    Id_Tipo: '1',
    Nombre: '',
    Id_Cuenta_Contable_Compras: '',
    Cuenta_Contable_Compras: '',
    Id_Cuenta_Contable_Ventas: '',
    Cuenta_Contable_Ventas: '',
    Codigo_Actividad: '',
    Utilidad: '',
    Cocina: '0',
    Estado: '1',
  };
  Caregoria = {
    Id_Categoria:'',
    Nombre:''
  }
  Categorias = [];
  ngOnInit(): void {
    if (this.SeguridadStr == '') {
      this.SeguridadStr = '0.0.0.0.0.0.0.0';
    }
    this.Seguridad = this.SeguridadStr.split('.');
    if (this.Seguridad[3] == 1) {
      this.interfazInventario = true;
    }
    if (this.Seguridad[7] == 1) {
      this.appRestaurante = true;
    }
    if (this.Seguridad[5] == 1) {
      this.interfazContable = true;
    }
    this.loadCategories();
    this.loadSubCategories();
    this.searchAccount();
    // Revisar perfil de conta y restaurante


  }
  async loadCategories(search?: any) {
    let data = await this.categoryService.loadCategories(
      this.paginacion,
      search
    );
    if (data['total'] == 0) {
      this.Categorias = [];
    } else {
      this.Categorias = data['data'];
    }
  }
  async loadSubCategories(search?: any) {
    let data = await this.subCategoryService.loadSubCategories(
      this.paginacion,
      search
    );
    if (data['total'] == 0) {
      this.Categories = [];
    } else {
      this.Categories = data['data'];
    }
  }
  async editRecord(Sub_Category) {
    this.edit = true;
    if (Sub_Category) {
      this.Sub_Category.Id_Sub_Categoria = Sub_Category.Id_Sub_Categoria;
      this.loadSub_Category();
    } else {
      this.Sub_Category = {
        Id_Categoria:'',
        Id_Sub_Categoria: '',
        Id_Tipo: '1',
        Nombre: '',
        Id_Cuenta_Contable_Compras: '',
        Cuenta_Contable_Compras: '',
        Id_Cuenta_Contable_Ventas: '',
        Cuenta_Contable_Ventas: '',
        Codigo_Actividad: '',
        Utilidad: '',
        Cocina: '0',
        Estado: '1',
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
    this.loadSubCategories();
  }
  keytab(event) {
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search() {
    this.loadSubCategories(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
  cancel() {
    this.edit = false;
  }
  async grabar() {
    if (this.Sub_Category.Nombre == '') {
      Swal.fire('Favor Suministrar el nombre de la Sub_Categoria');
      return false;
    }
    if (this.Sub_Category.Utilidad == '') {
      this.Sub_Category.Utilidad = '0';
    }
    let data = await this.subCategoryService.saveSubCategory(this.Sub_Category);
    if (data['success'] == 'true') {
      Swal.fire('Sub_Categoria grabada correctamente');
      this.loadSubCategories(this.searchField);
      this.edit = false;
    }
    return true;
  }
  async loadSub_Category() {
    let data = await this.subCategoryService.loadSubCategory(
      this.Sub_Category.Id_Sub_Categoria
    );
    if (data['total'] == 1) {
      this.Sub_Category = data['data'][0];
    }
  }
  async openAccountPanel(panel) {
    if(panel == 1){
      this.searchFieldAccount = this.Sub_Category.Id_Cuenta_Contable_Compras;
    }else{
      this.searchFieldAccount = this.Sub_Category.Id_Cuenta_Contable_Ventas;
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
      this.Sub_Category.Id_Cuenta_Contable_Compras = Account.Cuenta;
      this.Sub_Category.Cuenta_Contable_Compras = Account.Cuenta  + ' - ' + Account.Descripcion;
    }else{
      this.Sub_Category.Id_Cuenta_Contable_Ventas = Account.Cuenta;
      this.Sub_Category.Cuenta_Contable_Ventas = Account.Cuenta  + ' - ' + Account.Descripcion;
    }

    this.closeAccountPanel();
  }

}
