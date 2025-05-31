import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { TomaFisicaService } from './toma-fisica.service';
import Swal from "sweetalert2";
import { ApiService } from "../../../../../core/src/app/lib/api.service";

@Component({
  selector: 'app-toma-fisica',
  templateUrl: './toma-fisica.component.html',
  styleUrls: ['./toma-fisica.component.css']
})
export class TomaFisicaComponent implements OnInit {

  constructor(
    private productService:ProductService,
    private tomaFisicaService:TomaFisicaService,
    private apiService:ApiService
  ) { }

  loading = false;
  MensajeLoading = 'aplicando';
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
    Id_Toma_Fisica:'',
    Fecha:'',
    Estado:'0'
  }
  Fecha =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  
  Detalle = {
    Id_Toma_Fisica_Detalle:'',
    Id_Toma_Fisica:'',
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
    Cantidad: "",
    Estado: "",
    Sub_Total: 0,
    Total: 0,
    Tipo_Impuesto: '',
    Tipo_Codigo:'',
    Adicional:'',
    Id_Categoria:'',
    Existencia:''
  }

  ngOnInit() {
    this.leerTomasFisicas();
  }
  initDetail() {
    this.Detalle = {
      Id_Toma_Fisica_Detalle:'',
      Id_Toma_Fisica:'',
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
      Cantidad: "",
      Estado: "",
      Sub_Total: 0,
      Total: 0,
      Tipo_Impuesto: '',
      Tipo_Codigo:'',
      Adicional:'',
      Id_Categoria:'',
      Existencia:''
    };
    
  }
  search(){

  }
  cerrar(){
    this.edit = false;
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
  editRecord(Toma_Fisica){
    if(!Toma_Fisica){
      this.TomaFisica = {
        Id_Toma_Fisica:'',
        Fecha:'',
        Estado:'0'
      }
      this.initDetail();
      this.Details = [];
    }else{
      this.leerTomaFisica(Toma_Fisica);
    }
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
    if(tipo = 2){
      let data = await this.productService.loadProductLike(producto,1,3);
      this.registros = data["data"];
      this.PantallaProductos =true;
      return false;
    }
    let data = await this.productService.loadProduct(producto,1,3);
    if (data['total'] === 0) {
      data = await this.productService.loadProductLike(producto,1,3);
    }
    if (data["total"] === 1) {
      if (tipo === 1) {
        //Hay un registro hay que cargarlo
        this.Detalle.Id_Producto = data["data"][0]["Id_Producto"];
        this.Detalle.Tipo_Codigo = data["data"][0]["Tipo_Codigo"];
        this.Detalle.Descripcion = data["data"][0]["Descripcion"];
        this.Detalle.Precio = data["data"][0]["Ultimo_Costo"];
        this.Detalle.Unidad_Medida = data["data"][0]["Unidad_Medida"];
        this.Detalle.IVAPorcentaje = data["data"][0]["Impuesto"];
        this.Detalle.Codigo_Referencia = data["data"][0]["Codigo"];
        this.Detalle.Tipo_Impuesto = data["data"][0]["Tipo_Impuesto"];
        this.Detalle.SKU = data["data"][0]["SKU"];
        this.Detalle.Id_Categoria = data["data"][0]["Categoria"];
        this.Detalle.Existencia = data["data"][0]["Existencia"];
        //this.Detalle.Total = this.Detalle.Precio * this.Detalle.Cantidad;  //parseFloat(this.Detalle.Precio.toString()) + ( parseFloat(this.Detalle.Precio.toString()) * parseFloat(this.Detalle.IVAPorcentaje.toString()) /100);
        //this.Detalle.Total = parseFloat(parseFloat(this.Detalle.Total.toFixed()).toFixed(2));
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
    
    return true;
  }
  async calcularTotales() {
    if(!this.Detalle.Precio){
      this.Detalle.Precio = 1;
    }
    this.Detalle.Sub_Total = parseInt(this.Detalle.Cantidad) * this.Detalle.Precio;
    
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
    this.Detalle.Existencia = producto.Existencia;
    this.Detalle.Precio = producto.Ultimo_Costo;
    await this.processProduct('Cantidad');
    this.PantallaProductos = false;
    document.getElementById('Cantidad').focus();
    
  }
  closeModal() {
    this.PantallaProductos = false;
  }

  async leerTomasFisicas(){
    let data = await this.tomaFisicaService.loadTomasFisicas(this.paginacion,this.searchField);
    if (data['total'] == 0) {
      this.TomasFisicas = [];
    } else {
      this.TomasFisicas = data['data'];
    }
  }

  async grabar(){
    await this.grabarEncabezado();
    //aplicar Movimientos
    Swal.fire({
        title: 'Desea Aplicar la Toma Fisica?',
        text: "Si aplica la toma fisica no le podra realizar ninún cambio!",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Aplicar la toma Fisica!'
      }).then((result) => {
        if (result.value) {
          this.aplicarTomaFisica()
        }
      });
    this.cerrar();
  }

  async aplicarTomaFisica(){
    this.loading = true;
    await this.apiService.postRecord('Call sp_Inv_Generar_Movimientos_Toma_Fisica(' + localStorage.getItem('Id_Empresa') +  "," + this.TomaFisica.Id_Toma_Fisica +  ",'" + localStorage.getItem('Nombre_Usuario') + "')" );
    this.loading = false;
  }
  async grabarEncabezado(){
    this.loading = true;
    this.TomaFisica.Fecha = this.Fecha.year + '-' + this.Fecha.month + '-' +this.Fecha.day;
    let data = await this.tomaFisicaService.saveTomaFisica(this.TomaFisica);
    if(this.TomaFisica.Id_Toma_Fisica == ''){
      this.TomaFisica.Id_Toma_Fisica = data["Identity"];
    }
    let ListaDetalles = '';
    for (let i = 0; i < this.Details.length; i++) {
      
      if(i > 0){
        ListaDetalles = ListaDetalles + ',';
      }
      ListaDetalles =  await this.grabarDetalles(this.Details[i],ListaDetalles);
    }
    this.eliminarDetalles(ListaDetalles)
    this.leerTomasFisicas();
    this.loading = false;
  };

  async eliminarDetalles(lista){
    let del = await this.tomaFisicaService.deleteDetails(this.TomaFisica.Id_Toma_Fisica,lista);
}

  async grabarDetalles(Detalle,ListaDetalles){
    Detalle.Id_Toma_Fisica = this.TomaFisica.Id_Toma_Fisica;
    let data = await this.tomaFisicaService.saveTomaFisicaDetalle(Detalle);
    if(Detalle.Id_Toma_Fisica_Detalle == ''){
      ListaDetalles = ListaDetalles + String(data['Identity']);
    }else{
      ListaDetalles = ListaDetalles + String(Detalle.Id_Toma_Fisica_Detalle);
    }
    return ListaDetalles;
  };

  async leerTomaFisica(Toma_Fisica){
    let data = await this.tomaFisicaService.loadTomaFisica(Toma_Fisica.Id_Toma_Fisica);
    this.TomaFisica = data['data'][0];
    let fechaArr = this.TomaFisica['Fecha'].split('-');
      this.Fecha = {
        month: parseInt(fechaArr[1]),
        day: parseInt(fechaArr[2]),
        year: parseInt(fechaArr[0]),
      }
    let paginacion = {
      FirstRow: 1,
      LastRow: 500,
      TotalRows: 0
    };
    let detalle = await this.tomaFisicaService.loadTomasFisicasDetalles(Toma_Fisica.Id_Toma_Fisica,paginacion,'');
    if (detalle['total'] == 0) {
      this.Details = [];
    } else {
      this.Details = detalle['data'];
    }
    
  }
}
