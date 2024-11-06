import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-toma-fisica',
  templateUrl: './toma-fisica.component.html',
  styleUrls: ['./toma-fisica.component.css']
})
export class TomaFisicaComponent implements OnInit {

  constructor(
    private productService:ProductService
  ) { }

  edit = false;
  PantallaProductos = false;
  ProductoEncontrado = false;
  hoy = new Date();

  searchField = "";
  searchFieldProduct = '';

  TomasFisicas = [];
  registros = [];
  Details = []; 
  
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  TomaFisica = {
    Fecha:'',
    Estado:'0',
  }
  Fecha =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  
  Detalle = {
    Codigo_Referencia: "",
    SKU : '',
    Id_Empresa: 0,
    Descripcion: "",
    Descuento: 0,
    IVA: 0,
    IVAPorcentaje: 0,
    IndDescuento: "",
    Id_Factura_detalle: "",
    Id_Factura: 0,
    Unidad_Medida: "",
    Precio: 0,
    Id_Producto: "",
    Cantidad: 1,
    Estado: "",
    Sub_Total: 0,
    Total: 0,
    Tipo_Impuesto: '',
    Tipo_Codigo:'',
    Adicional:'',
    Id_Categoria:''
  }

  ngOnInit() {
  }
  initDetail() {
    this.Detalle = {
      Codigo_Referencia: "",
      SKU:'',
      Id_Empresa: 0,
      Descripcion: "",
      Descuento: 0,
      IVA: 0,
      IVAPorcentaje: 0,
      IndDescuento: "",
      Id_Factura_detalle: "",
      Id_Factura: 0,
      Unidad_Medida: "",
      Precio: 0,
      Id_Producto: "",
      Cantidad: 1,
      Estado: "",
      Sub_Total: 0,
      Total: 0,
      Tipo_Impuesto: '',
      Tipo_Codigo:'',
      Adicional:'',
      Id_Categoria:''
    };
    
  }
  search(){

  }
  keytab(event:any){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytab1(event, next) {
    if (event.key === "Enter") {
      //this.processProduct(next, true);
      document.getElementById(next).focus();
    }
  }
  keytabProduct(event){
    if (event.key === 'Enter') {
      this.searchProduct();
    }
  }
  async searchProduct(){
    //this.(this.searchFieldProduct);
    await this.obtenerProducto(this.searchFieldProduct,0);
  
  }
  editRecord(e){
    this.edit = true;
  }
  ChangePage(action:any){
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
    //this.loadAsientos();
  }
  async processProduct(next, stop?) {
    if(this.PantallaProductos == true){
      //return false;
    }
    if (next === "Cantidad") {
      if (this.Detalle.SKU === "") {
        //alert('Debe digitar El codigo');
        return false;
      }
      await this.obtenerProducto(this.Detalle.SKU, 1);
     // document.getElementById('Cantidad').focus();
      // jaime
    }
    
    if (next === "SKU") {
      this.calcularTotales();
    }
    if (stop) {
      return false;
    }
    return true;
  }

  async obtenerProducto(producto, tipo) {
    if(this.ProductoEncontrado){
      //return false;
    }
    let data = await this.productService.loadProduct(producto,1,3);
    if (data['total'] === 0) {
      data = await this.productService.loadProductLike(producto,1,3);
    }
    if (data["total"] == 1) {
      if (tipo == 1) {
        //Hay un registro hay que cargarlo
        this.Detalle.Id_Producto = data["data"][0]["Id_Producto"];
        this.Detalle.Tipo_Codigo = data["data"][0]["Tipo_Codigo"];
        this.Detalle.Descripcion = data["data"][0]["Descripcion"];
        this.Detalle.Precio = data["data"][0]["Precio"];
        this.Detalle.Unidad_Medida = data["data"][0]["Unidad_Medida"];
        this.Detalle.IVAPorcentaje = data["data"][0]["Impuesto"];
        this.Detalle.Codigo_Referencia = data["data"][0]["Codigo"];
        this.Detalle.Tipo_Impuesto = data["data"][0]["Tipo_Impuesto"];
        this.Detalle.SKU = data["data"][0]["SKU"];
        this.Detalle.Id_Categoria = data["data"][0]["Categoria"];
        this.Detalle.Total = parseFloat(this.Detalle.Cantidad.toString()) + ( parseFloat(this.Detalle.Precio.toString()) * parseFloat(this.Detalle.IVAPorcentaje.toString()) /100);
        this.Detalle.Total = parseFloat(parseFloat(this.Detalle.Total.toFixed()).toFixed(2));
        this.PantallaProductos = false;
        let elemento = document.getElementById("Descripcion");
        elemento.focus();

      } else {
        this.registros = data["data"];
      }
    } else {
      this.searchFieldProduct = producto;
      if(!this.PantallaProductos){
        this.PantallaProductos = true;
      }
      this.registros = data["data"];
    }
    
    //return true;
  }
  async calcularTotales() {
    

    this.Detalle.Sub_Total = this.Detalle.Cantidad;
    this.Detalle.Total = this.Detalle.Sub_Total ;
    if (this.Detalle.Total > 0) {
      this.Details.push(this.Detalle);
    }
    
    this.initDetail()
  }
  removeVen_Factura_Detalle(index: number) {
    this.Details.splice(index, 1);
    //this.calcularTotales();
  }
  editVen_Factura_Detalle(index) {
    this.Detalle = this.Details[index];
    this.Details.splice(index, 1);
  }
  async Seleccionar(producto) {
    this.Detalle.Id_Producto = producto.Id_Producto;
    this.Detalle.SKU = producto.SKU;
    this.Detalle.Descripcion = producto.Descripcion;
    await this.processProduct('Cantidad');
    this.PantallaProductos = false;
    document.getElementById('Cantidad').focus();
    
  }
  closeModal() {
    this.PantallaProductos = false;
  }
  grabar(){
    this.grabarEncabezado();
    this.grabarDetalles();
  }
  grabarEncabezado(){};
  grabarDetalles(){};
  
}
