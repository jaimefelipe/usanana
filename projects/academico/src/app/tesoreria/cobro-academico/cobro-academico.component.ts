import { Component, OnInit } from '@angular/core';
import { CobroAcademicoService } from './cobro-academico.service';
import { ProductService } from '../../../../../inventario/src/app/inventory/product/product.service';

@Component({
  selector: 'app-cobro-academico',
  templateUrl: './cobro-academico.component.html',
  styleUrls: ['./cobro-academico.component.css']
})
export class CobroAcademicoComponent implements OnInit {

  constructor(
    private cobroAcademicoService:CobroAcademicoService,
    private productService:ProductService
  ) { }
  Cobros = [];
  Productos = [];
  edit = false;
  PantallaProductos = false;
  searchField = '';
  searchFieldProduct = '';

  paginacion = {
    FirstRow: 1, 
    LastRow: 50,
    TotalRows: 0
  };

  Cobro = {
    Id_Cobro: '',
    Id_Producto: '',
    NombreProducto:'',
    Nombre: '',
    Nivel: '',
    Estado: '',
    Credito_Universitario:'',
    Unico:''
  };

  ngOnInit() {
    this.loadCobros();
    this.loadProduct();
  }
  ChangePage(action){
    if (action == 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion.FirstRow < 50) {
        this.paginacion.FirstRow = 1;
        this.paginacion.LastRow = 50;
      } else {
        this.paginacion.FirstRow= this.paginacion.FirstRow -50;
        this.paginacion.LastRow= this.paginacion.LastRow -50;
      }
    }
    if (action == 2) {
      this.paginacion.FirstRow = this.paginacion.FirstRow +50;
      this.paginacion.LastRow = this.paginacion.LastRow + 50;
    }
    this.loadCobros();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }

  keytabProduct(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }

  search(){
    this.loadCobros(this.searchField);
  }
  async loadCobros(search?){
    let data = await this.cobroAcademicoService.loadCostos(this.paginacion,this.searchField);
    if(data['total']>0){
      this.Cobros = data['data'];
    }else{
      this.Cobros = [];
    }
  }
  async editRecord(registro){
    if (registro) {
      let data = await this.cobroAcademicoService.leerCobro(registro.Id_Cobro);      
      if(data['total']==1){
        this.Cobro = data['data'][0];
      }
      console.log(this.Cobro)
      let nombre = await this.cobroAcademicoService.LeerNombreProducto(this.Cobro.Id_Producto);
      this.Cobro.NombreProducto = nombre['data'][0]['Descripcion'];
    } else {
      this.Cobro = {
        Id_Cobro: '',
        Id_Producto: '',
        NombreProducto:'',
        Nombre: '',
        Nivel: '',
        Estado: '',
        Credito_Universitario:'',
        Unico:''
      };
    }

    this.edit = true;
  }
  grabar(){
    if (!this.Cobro.Id_Cobro){
      this.cobroAcademicoService.NuevoCobro(this.Cobro);
    }else{
      this.cobroAcademicoService.ActualizarCobro(this.Cobro);
    }
    this.loadCobros();
    this.cancel();
  }
  cancel(){
    this.edit = false;
  }
  async loadProduct(){
    let data = await this.productService.loadProductLike('%',1,3);
    if(data['total']>0){
      this.Productos = data['data'];
    }else{
      this.Productos = [];
    }
  } 
  openProducto(){
    this.PantallaProductos = true
  }
  SeleccionarProducto(producto){
    this.Cobro.Id_Producto = producto.Id_Producto;
    this.Cobro.NombreProducto = producto.Descripcion;
    this.Cobro.Nombre = producto.Descripcion;
    this.PantallaProductos = false;
  }
  closeModal(){
    this.PantallaProductos = false;
  }
}
