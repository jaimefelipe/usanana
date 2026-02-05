import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import { ProductoClienteService } from './producto-cliente.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { ProductService } from '../../../../../inventario/src/app/inventory/product/product.service';

@Component({
  selector: 'app-producto-cliente',
  templateUrl: './producto-cliente.component.html',
  styleUrls: ['./producto-cliente.component.css']
})
export class ProductoClienteComponent implements OnInit {

  constructor(
    private productoClienteService:ProductoClienteService,
    private peopleService:ContactoService,
    private productService:ProductService
  ) { }

  edit = false;
  searchField = '';
  searchFieldClientes ='';
  searchFieldProduct = '';
  PantallaClientes = false;
  PantallaProductos = false;
  Clientes = [];
  Productos = [];
  TipoPersona = 1;
  Productos_Cliente = [];
  Clientes_Producto = [];
  Cliente_Producto = {
    Id_Persona_Producto:'',
    Id_Persona:'',
    Nombre_Persona:'',
    Id_Producto:'',
    Nombre_Producto:'',
    Estado:''
  }
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };

  ngOnInit() {
    this.loadClientes();
    this.searchClientes(1);
    this.searchProduct();
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
    this.search();
  }
  search() {
    this.loadClientes(this.searchField);
  }
  keytab1(event) {
    if (event.key === "Enter") {
      this.search();
    }
  }
  async loadClientes(search?){
    let data = await this.productoClienteService.loadClients(this.paginacion,search);
    this.Productos_Cliente = data['data'];
  }
  async editRecord(cliente) {
    if (cliente){
      let data = await this.productoClienteService.loadProducts(cliente.Id_Persona);
      this.Clientes_Producto = data['data'];
      //this.Cliente_Producto.Id_Persona_Producto = data['data'][0]['Id_Persona_Producto'];
      this.Cliente_Producto.Id_Persona = data['data'][0]['Id_Persona'];
      this.Cliente_Producto.Nombre_Persona = data['data'][0]['Nombre_Persona'];
      this.Cliente_Producto.Estado = data['data'][0]['Estado'];
    }
    this.edit = true;
  }
  async grabar(){
    for (let i = 0; i < this.Clientes_Producto.length; i++) {
      if(this.Clientes_Producto[i].Id_Persona_Producto == ''){
        await this.productoClienteService.insertPersonaProducto(this.Clientes_Producto[i]);
      }else{
        await this.productoClienteService.updatePersonaProducto(this.Clientes_Producto[i]);
      }
    }
    Swal.fire('Productos Asociados al Cliente');
    this.loadClientes();
    this.edit = false;
  }
  cancel(){
    this.edit = false;
  }
  openClientePanel(tipo){
    this.TipoPersona = tipo;
    //this.searchClientes(tipo);
    this.PantallaClientes = true;
  }
  async searchClientes(tipo?){
    if(tipo){
      this.TipoPersona = tipo;
    }
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.peopleService.loadPersonas(paginacion, this.searchFieldClientes,this.TipoPersona );
    this.Clientes = data['data'];
  }
  keytabClientes(event){
    if (event.key === "Enter") {
      this.searchClientes(1);
    }
  }
  SeleccionarCliente(Cliente){
    this.Cliente_Producto.Id_Persona = Cliente.Id_Persona;
    this.Cliente_Producto.Nombre_Persona = Cliente.Nombre;
    this.closePantallaClientes();
  }
  closePantallaClientes(){
    this.PantallaClientes = false;
  }
  openProductoPanel(){
    this.PantallaProductos = true;
  }
  async searchProduct(){
    await this.obtenerProducto(this.searchFieldProduct,0);
  }
  keytabProduct(event){
    if (event.key === 'Enter') {
      this.searchProduct();
    }
  }
  async obtenerProducto(producto, tipo) {
    let data = await this.productService.loadProduct(producto,1,3);
    if (data['total'] === 0) {
      data = await this.productService.loadProductLike(producto,1,3);
    }
    this.Productos = data["data"];
  }
  SeleccionarProducto(producto) {
    this.Cliente_Producto.Id_Producto = producto.Id_Producto;
    this.Cliente_Producto.Nombre_Producto = producto.Descripcion;
    this.closePantallaProductos();
  }
  closePantallaProductos(){
    this.PantallaProductos = false;
  }
  addDetail(){
    if(this.Cliente_Producto.Id_Persona == ''){
      Swal.fire('Seleccione un cliente');
      return false;
    }
    if(this.Cliente_Producto.Id_Producto ==''){
      Swal.fire('Seleccione un producto');
      return false;
    }
    let prod = {
      Id_Persona_Producto:this.Cliente_Producto.Id_Persona_Producto,
      Id_Persona:this.Cliente_Producto.Id_Persona,
      Nombre_Persona:this.Cliente_Producto.Nombre_Persona,
      Id_Producto:this.Cliente_Producto.Id_Producto,
      Nombre_Producto:this.Cliente_Producto.Nombre_Producto,
      Estado:this.Cliente_Producto.Estado
    }
    this.Clientes_Producto.push(prod);
    this.Cliente_Producto.Id_Producto = '';
    this.Cliente_Producto.Nombre_Producto = '';
    this.Cliente_Producto.Estado = '';
    this.Cliente_Producto.Id_Persona_Producto = '';

    return true;
  }
  remove_Detalle(indice){
    this.Clientes_Producto.splice(indice, 1);
  }
  edit_Detalle(indice){
    this.Cliente_Producto = this.Clientes_Producto[indice];
    this.Clientes_Producto.splice(indice, 1);
  }
  disableProducto(index){
    this.Clientes_Producto[index]['Estado'] = 0;
  }
  enableProduct(index){
    this.Clientes_Producto[index]['Estado'] = 1;
  }
}
