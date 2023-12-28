import { ProductosService } from '../productos/productos.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  constructor(
    private router : Router,
    private productosService:ProductosService,
    private titleService: Title,
    private metaService: Meta,
    private sanitizer: DomSanitizer ) {}
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
  Pagina = '';
  Contenido;
  transformYourHtml(htmlTextWithStyle) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
  }
  ngOnInit(): void {
    window.scrollTo(0, 0);
    let href = this.router.url;
    //this.Pagina= href.replace('/producto;prod=','');
    this.Pagina= href.replace('/producto/','');
    this.getProduct();
  }
  async getProduct(){
    let data = await this.productosService.getProduct(this.Pagina);
    this.Product = data['data'][0];
    this.Contenido = this.transformYourHtml(this.Product.Contenido);
    this.titleService.setTitle('Toxo |'+this.Product.Descripcion );
    this.metaService.addTags([
      {name: 'keywords', content: this.Product.KeyWords},
      {name: 'description', content: this.Product.Description.replace(/<p>/g, "").replace(/<\/p>/g, "-")}
      //{name: 'robots', content: 'index, follow'}
    ]);
  }

}
