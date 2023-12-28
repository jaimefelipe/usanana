import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
@Component({
  selector: 'app-existencias',
  templateUrl: './existencias.component.html',
  styleUrls: ['./existencias.component.css']
})
export class ExistenciasComponent implements OnInit {

  constructor(private productService:ProductService,) { }

  Articulos = [];
  searchField = "";
  Tipo_Codigo= '1';
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
  search(){
    this.loadProducts(this.searchField);
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  async loadProducts(search?){
    let data = await this.productService.loadProducts(this.paginacion,search,this.Tipo_Codigo);
    if(data['total'] == 0){
      this.Articulos = [];
    }else{
      this.Articulos = data['data'];
    }
  }
}
