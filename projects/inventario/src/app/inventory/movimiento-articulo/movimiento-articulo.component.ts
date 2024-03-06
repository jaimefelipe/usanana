import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { MovementInventoryService } from '../movement-inventory/movement-inventory.service';
@Component({
  selector: 'app-movimiento-articulo',
  templateUrl: './movimiento-articulo.component.html',
  styleUrl: './movimiento-articulo.component.css'
})
export class MovimientoArticuloComponent implements OnInit {
  constructor(
    private productService:ProductService,
    private movementInventoryService:MovementInventoryService
  ) { }
  edit = false;
  Tipo_Codigo = '1';
  searchField = "";
  Articulos = [];
  Movimientos = [];
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  ngOnInit(): void {
    this.loadProducts();
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
    this.loadProducts(this.searchField);
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadProducts(this.searchField);
  }
  async loadProducts(search?){
    let data = await this.productService.loadProducts(this.paginacion,search,this.Tipo_Codigo);
    if(data['total'] == 0){
      this.Articulos = [];
    }else{
      this.Articulos = data['data'];
    }
  }
  async leerDetalles(Producto){
   
  }
  async editRecord(articulo){
    this.edit = true;
    let data = await this.movementInventoryService.leerDetallesPorProducto(articulo.Id_Producto);
    if(data['total'] == 0){
      this.Movimientos = [];
    }else{
      this.Movimientos = data['data'];
    }
    
  }
  cancel(){
    this.edit = false;
  }
}
