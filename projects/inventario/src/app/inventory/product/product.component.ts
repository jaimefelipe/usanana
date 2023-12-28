import { ProductService } from './product.service';
import { CategoryService } from './../category/category.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  constructor(
    private productService:ProductService,
    private categoryService:CategoryService,
    private router : Router
    ) { }
  fileData!: File;
  interfazContable = localStorage.getItem("InterfazContable");
  //interfazInventario = localStorage.getItem("interfazInventario");
  interfazInventario = false;
  PrecioServicioIncluido = false;
  Admin = false;
  Restaurante = false;
  PantallaActiva = 1;
  nuevo = false;
  SeguridadStr = localStorage.getItem("ToxoSG");
  PantallaComponente = false;
  PantallaProductoRelacionado = false;
  Tipo_Codigo= '1';
  Seguridad = [];
  Articulos = [];
  Categories = [];
  SubCategorias = [];
  Componentes = [];
  searchField = ""
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  edit = false;
  Componente = {
    Id_Producto_Componente:'',
    Id_Producto_Sub_Componente:'',
    Id_Producto:'',
    Nombre:'',
    Precio:'0',
    Adicional:'1',
    Opcional:'1',
    Grupo:'1',
    Parte:'',
    Id_Producto_Relacionado:'',
    Producto_Relacionado_Nombre:'',
    Cantidad_Relacionada:''
  }
  Sub_Componentes = [];
  /**
   * Edición
   */
  Articulo = {
    Id_Producto:'',
    Descripcion: '',
    Tipo_Codigo: '1',
    Codigo:'',
    SKU:'',
    Unidad_Medida:'Unid',
    Tipo_Impuesto:'08',
    Impuesto:'13',
    Precio: '',
    Categoria : '',
    Id_Sub_Categoria:'',
    Moneda:'CRC',
    Estado:'1',
    Minimo:'0',
    Maximo:'100',
    Existencia:'0',
    Ultimo_Costo:'',
    Costo_Promedio:'',
    Codigo_Proveedor:'',
    PrecioIva:'',
    Orden:'',
    Id_Producto_Relacionado:'',
    Producto_Relacionado_Nombre:'',
    Cantidad_Relacionada:'',
    Foto:'',
    FotoSrc:''
  }

  ngOnInit(): void {
    if(this.SeguridadStr == ""){
      this.SeguridadStr = "0.0.0.0.0.0.0.0";
    }
    this.Seguridad = this.SeguridadStr.split(".");
    if(this.Seguridad[2] ==1){
      this.interfazInventario = true
    }
    if(this.Seguridad[7] ==1){
      this.Restaurante = true;
      this.PrecioServicioIncluido = true;
    }
    if(localStorage.getItem("ToxoUT") == '1'){
      this.Admin = true;
    }else{
      this.Admin = false;
    }

    this.loadProducts();
    this.loadCategories();
  }
  async loadProducts(search?){
    let data = await this.productService.loadProducts(this.paginacion,search,this.Tipo_Codigo);
    if(data['total'] == 0){
      this.Articulos = [];
    }else{
      this.Articulos = data['data'];
    }
  }
  CalculoPrecio(){
    let Tasa = 0;
    switch(this.Articulo.Tipo_Impuesto) {
      case '01':
        Tasa = 0;
        break;
      case '02':
        Tasa = 1;
        break;
      case '03':
          Tasa = 2;
          break;
      case '04':
        Tasa = 4;
          break;
      case '05':
        Tasa = 0;
          break;
      case '06':
        Tasa = 4;
        break;
      case '07':
        Tasa = 8;
          break;
      default:
        Tasa = 13;
        // code block
    }
    if(this.PrecioServicioIncluido){
      Tasa = Tasa + 10;
    }
    this.Articulo.PrecioIva =  Math.round(parseFloat(this.Articulo.Precio) + (parseFloat(this.Articulo.Precio) * Tasa /100)).toString()
  }
  CalculoPrecio2(){
    let Tasa = 0;
    switch(this.Articulo.Tipo_Impuesto) {
      case '01':
        Tasa = 0;
        break;
      case '02':
        Tasa = 1;
        break;
      case '03':
          Tasa = 2;
          break;
      case '04':
        Tasa = 4;
          break;
      case '05':
        Tasa = 0;
          break;
      case '06':
        Tasa = 4;
        break;
      case '07':
        Tasa = 8;
          break;
      default:
        Tasa = 13;
        // code block
    }
    if(this.PrecioServicioIncluido){
      Tasa = Tasa + 10;
    }
    this.Articulo.Precio = (parseFloat(this.Articulo.PrecioIva) / ( 1+ (Tasa/100))).toFixed(2).toString()
  }
  CalculoPrecio3(){
    this.PrecioServicioIncluido = !this.PrecioServicioIncluido;
    this.CalculoPrecio2()
  }
  async editRecord(articulo){
    this.edit = true;
    if(articulo){
      this.nuevo = false;
      let data = await this.productService.loadArticle(articulo.Id_Producto);
      this.Articulo = data['data'][0];
      this.Articulo.FotoSrc = "https://toxo.work/img/"+localStorage.getItem("Id_Empresa")+'/'+this.Articulo.Foto;
      //Leer Los Componentes del artículo
      await this.loadComponentes();
      this.loadCategories();
      this.CalculoPrecio();
    }else{
      this.nuevo = true;
      this.Articulo = {
        Id_Producto:'',
        Descripcion: '',
        Tipo_Codigo: '1',
        Codigo:'',
        SKU:'',
        Unidad_Medida:'Unid',
        Tipo_Impuesto:'08',
        Impuesto:'13',
        Precio: '',
        Categoria : '',
        Id_Sub_Categoria:'',
        Moneda:'CRC',
        Estado:'1',
        Minimo:'0',
        Maximo:'100',
        Existencia:'0',
        Ultimo_Costo:'',
        Costo_Promedio:'',
        Codigo_Proveedor:'',
        PrecioIva:'',
        Orden:'',
        Id_Producto_Relacionado:'',
        Producto_Relacionado_Nombre:'',
        Cantidad_Relacionada:'',
        Foto:'',
        FotoSrc:''
      }
    }
  }
  async loadComponentes(){
    let componetes = await this.productService.loadComponentes(this.Articulo.Id_Producto);
    if(componetes['total'] == 0){
      this.Componentes = [];
    }else{
      this.Componentes = componetes['data'];
    }
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
  /**
   * Eventos del
   * Formulario de edición
   */
   async loadCategories(search?:any){
    let data = await this.categoryService.loadCategories(this.paginacion,search);
    if(data['total'] == 0){
      this.Categories = [];
    }else{
      this.Categories = data['data'];
      if(this.Articulo.Categoria == ""){
        this.Articulo.Categoria = data['data'][0]['Id_Categoria'];
      }
      this.LeerSubCategorias();
    }
  }
  async LeerSubCategorias(){
    let data =  await this.productService.LeerSubCategorias(this.Articulo.Categoria);
    if(data['total'] == 0){
      this.SubCategorias = [];
    }else{
      this.SubCategorias = data['data'];
      if(this.Articulo.Id_Sub_Categoria == ""){
        this.Articulo.Id_Sub_Categoria = data['data'][0]['Id_Sub_Categoria'];
      }
    }
  }

  cambiarTarifa(){
    switch(this.Articulo.Tipo_Impuesto){
      case "01": {
        this.Articulo.Impuesto = '0';
        break;
      }
      case "02": {
        this.Articulo.Impuesto = '1';
        break;
      }
      case "03": {
        this.Articulo.Impuesto = '2';
        break;
      }
      case "04": {
        this.Articulo.Impuesto = '4';
        break;
      }
      case "05": {
        this.Articulo.Impuesto = '0';
        break;
      }
      case "06": {
        this.Articulo.Impuesto = '4';
        break;
      }
      case "07": {
        this.Articulo.Impuesto = '8';
        break;
      }
      case "08": {
        this.Articulo.Impuesto = '13';
        break;
      }
    }
    this.CalculoPrecio();
  }
  cancel(){
    this.edit = false;
  }
  async grabar(){
    if(this.Articulo.Codigo == ""){
      Swal.fire('Favor Suministrar el Código');
      return false;
    }
    if(this.Articulo.Codigo.length < 13){
      Swal.fire('Favor Suministrar el Código Cabys Valido Mayor a 13 Caracteres ' );
      return false;
    }
    if(this.Articulo.Descripcion == ""){
     Swal.fire('Favor Suministrar el nombre');
     return false;
    }
    if(this.Articulo.Precio == ""){
      Swal.fire('Favor Suministrar el Precio');
      return false;
    }
    //Eliminamos los espacios en blando del Codigo Cabys
    this.Articulo.Codigo = this.Articulo.Codigo.trim();
    //Igualamos El Codigo Caby y el SKU si No existe SKU

    if(this.Articulo.SKU == ''){
      this.Articulo.SKU = this.Articulo.Codigo
    }
    let data = await this.productService.saveArticle(this.Articulo);
    if(data['success'] =='true'){
      Swal.fire('Artículo grabado correctamente');
      this.loadProducts(this.searchField);
      this.edit = false;
    }
    return true;
  }
  AgregarCompoente(Componente){
    if(Componente == ""){
      this.Componente = {
        Id_Producto_Componente:'',
        Id_Producto_Sub_Componente:'',
        Id_Producto:'',
        Nombre:'',
        Precio:'0',
        Adicional:'1',
        Opcional:'1',
        Grupo:'1',
        Parte:'',
        Id_Producto_Relacionado:'',
        Producto_Relacionado_Nombre:'',
        Cantidad_Relacionada:''
      }
      this.Sub_Componentes = [];
    }
    this.PantallaComponente = true;
    this.Sub_Componentes = [];
  }
  async EditComponete(Componente){
    this.Componente = Componente;
    this.PantallaComponente = true;
    //Leer los Sub Componetes
    let data = await this.productService.loadSubComponetes(Componente.Id_Producto_Componente);
    if(data['success'] =='true'){
      if(data['total'] == 0){
        this.Sub_Componentes = [];
      }
      else{
        this.Sub_Componentes = data["data"];
      }
    }
  }
  closePantallaComponente(){
    this.PantallaComponente = false;
  }
  async agregarComponente(){
    //Validar si el componente esta en blanco
    if(this.Componente.Nombre == ''){
      Swal.fire('Debe especifical el Nombre del Componente');
      return false;
    }
    this.Componente.Id_Producto = this.Articulo.Id_Producto;
    if(this.Componente.Id_Producto_Componente == ''){
      let data = await this.productService.newComponent(this.Componente);
      if(data['success'] =='true'){
        this.Componente.Id_Producto_Componente = data["data"][0]["Identity"];
        //await this.agregarSubComponentes();
        await this.loadComponentes();
        await this.updateSubComponentes();
        this.closePantallaComponente();
      }
    }else{
      //Actualizar la información del Componete
      let data = await this.productService.updateComponete(this.Componente);
      //Actualizar los subComponentes
      await this.updateSubComponentes();
      await this.loadComponentes();
      this.closePantallaComponente();
    }
    return true;
  }
  //Recorrer el Arreglo de SubComponentes, si tiene indice actualizardo si no tiene indice agregarlo
  async updateSubComponentes(){
    let indice = 0
    for (let subComponete of this.Sub_Componentes){
      if(subComponete.Id_Producto_Sub_Componente){
        // Crear el sub Componente
        await this.addSubComponente(subComponete,indice);
      }else{
        //Actualizar el sub Componente
        await this.updateSubCompoente(subComponete,indice);
      }
      indice++;
    }
  }
  async agregarSubComponentes(){
    let indice = 0
    for (let subComponete of this.Sub_Componentes){
      await this.addSubComponente(subComponete,indice);
      indice++;
    }
  }
  async addSubComponente(Sub_Componente,Indice){
    Sub_Componente.Id_Producto_Componente = this.Componente.Id_Producto_Componente
    let data = await this.productService.newSubComponent(Sub_Componente);
    if(data['success'] =='true'){
      this.Sub_Componentes[Indice].Inv_Producto_Sub_Componente = data["data"][0]["Identity"];
    }
  }
  async updateSubCompoente(Sub_Componente,Indice){
    let data = await this.productService.updateSubComponete(Sub_Componente);
  }
  addParte(event){
    if (event.key === 'Enter') {
      let parte = {
        Id_Producto_Sub_Componente:this.Componente.Id_Producto_Sub_Componente,
        Nombre: this.Componente.Parte
      }
      this.Sub_Componentes.push(parte);
      this.Componente.Parte = '';
      this.Componente.Id_Producto_Sub_Componente = '';
    }
  }
  editPart(parte,indice){
    this.Componente.Id_Producto_Sub_Componente = this.Sub_Componentes[indice].Id_Producto_Sub_Componente;
    this.Componente.Parte = this.Sub_Componentes[indice].Nombre;
    this.Sub_Componentes.splice(indice,1);
  }
  deletePart(parte,indice){
    if(parte.Id_Producto_Sub_Componente != ''){
      Swal.fire({
        title: 'Desea Borrar el Sub Componete?',
        text: "Si lo elimina no podrá recuperarlo!",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Borrar Sub Componente!'
      }).then((result) => {
        if (result.value) {
          this.productService.deleteSubCompoente(parte.Id_Producto_Sub_Componente);
          this.Sub_Componentes.splice(indice,1);
        }
      });
    }else{
      this.Sub_Componentes.splice(indice,1);
    }
  }
  abrirPantallaProductoRelacionada(pantalla){
    this.PantallaActiva = pantalla;
    this.PantallaProductoRelacionado = true;
  }
  seleccionarProducto(Articulo){
    if(this.PantallaActiva == 1){
      this.Articulo.Id_Producto_Relacionado = Articulo.Id_Producto;
      this.Articulo.Producto_Relacionado_Nombre = Articulo.Descripcion;
    }else{
      this.Componente.Id_Producto_Relacionado = Articulo.Id_Producto;
      this.Componente.Producto_Relacionado_Nombre = Articulo.Descripcion;
    }
    this.cerrarPantallaProductoRelacionda();

  }
  cerrarPantallaProductoRelacionda(){
    this.PantallaProductoRelacionado = false;
  }
  async loadImage(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    if (this.fileData.type != 'image/jpeg' && this.fileData.type != 'image/png') {
      Swal.fire('El archivo no es una imagen');
      return false;
    }
    const formData = new FormData();
    formData.append('file', this.fileData);
    this.Articulo.Foto = this.fileData.name;
    this.Articulo.FotoSrc = "https://toxo.work/img/"+localStorage.getItem("Id_Empresa")+'/'+this.Articulo.Foto;
    await this.productService.loadFile(formData);
    fileInput.target.value = '';
    return true;
  }

  generaCadenaAleatoria(){
    if(this.Articulo.SKU != ''){
      Swal.fire({
        title: 'Ya existe un Codigo SKU desea volcer a generarlo?',
        text: "Si lo genera se perdera el codigo anteriror!",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Generar codigo!'
      }).then((result) => {
        if (result.value) {
          this.GenerarCodigoSKU()
        }
      });
    }else{
      this.GenerarCodigoSKU();
    }
  }
  GenerarCodigoSKU(){  
    let result = '';
    const chars = '0123456789'
    for (let i = 0; i < 13; i++){
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.Articulo.SKU= result;
  }

}
