import { ProductosService } from './productos.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  constructor(
    private router : Router,
    private productosService:ProductosService,
    private titleService: Title,
    private metaService: Meta ) {}
  Products = [];
  Product = {
    Contenido: "",
    Descripcion: "",
    Description: "",
    Foto: "",
    Id_Producto: "",
    KeyWords: "",
    Precio: "",
    Tipo_Codigo: "",
    Url: ""
  };

  DetailPage = false;
  Pagina = '';
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getProductList();
  }

  async getProductList(){
    let data = await this.productosService.getProducts();
    this.Products = data['data'];
    this.titleService.setTitle('Toxo | Productos y Servicios');
    this.metaService.addTags([
      {name: 'keywords', content: 'Toxo, Costa Rica, Productos, Servicios, Factura Electrónica, Inventarios, Contabilidad'} ,
      {name: 'description', content: 'Toxo es una empresa esperta en la tercerización de servicios para profesionales independientes, emprendedores y pequeños empresarios en las áreas de tecnología, finanzas, proyectos y administración en general'}
      //{name: 'robots', content: 'index, follow'}
    ]);
  }
}
