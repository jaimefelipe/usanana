import { CashierService } from '../cashier/cashier.service';
import { CashierMovementService } from './cashier-movement.service';
import { InvoiceService } from '../../../../../factura/src/app/sales/invoice/invoice.service';
import { ProductService } from '../../../../../inventario/src/app/inventory/product/product.service';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-cashier-movement',
  templateUrl: './cashier-movement.component.html',
  styleUrls: ['./cashier-movement.component.css']
})
export class CashierMovementComponent implements OnInit {

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cashierMovementService: CashierMovementService,
    private cashierService:CashierService,
    private invoiceService:InvoiceService,
    private productService:ProductService
  ) {}
  tipoCambio = {
    compra: "",
    venta: "",
    fecha: "",
  };
  Id_Caja = localStorage.getItem('Id_Caja');
  Id_Caja_Diaria = localStorage.getItem('Id_Caja_Diaria');
  hoy = new Date();
  PantallaLoading = false;
  PantallaProductos = false;
  PantallaArticuloNuevo = false;
  validandoId = false;
  clienteExiste = false;
  mostrarCliente = false;
  edit = false;
  indice_Articulo_Nuevo = 0;
  searchField = "";
  searchFieldProduct = "";
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  Movements = [];
  Details = [];
  registros = [];
  Movement = {
    Id_Movimiento: "",
    Tipo_Movimiento: "03",
    Id_Caja: '',
    Id_Cliente: "",
    Descripcion: "",
    Descripcion2: "",
    Codigo_Identificacion: "",
    Tipo_Identificacion:"",
    Numero_Identificacion: "",
    Correo: "",
    Condicion_Venta: "01",
    Plazo_Credito: "0",
    Metodo_Pago: "01",
    Moneda: "CRC",
    Tipo_Cambio: "",
    IVA: 0,
    Sub_Total: 0,
    Total: 0,
    Estado: 0,
    Creado_El: "",
    Consecutivo: "",
    Notas:'',
    Id_Comprobante:'',
    Nombre_Cliente:'',
    Id_Caja_Diaria:''
  };
  Detalle = {
    Codigo_Referencia: "",
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
    Tipo_Codigo:''
  };

  Articulo = {
    Id_Producto:'',
    Descripcion: '',
    Tipo_Codigo: '4',
    Codigo:'',
    SKU:'',
    Unidad_Medida:'Unid',
    Tipo_Impuesto:'08',
    Impuesto:'13',
    Precio: '',
    Categoria : '',
    Moneda:'CRC',
    Estado:'1',
    Minimo:'0',
    Maximo:'100',
    Existencia:'0',
    Ultimo_Costo:'',
    Costo_Promedio:'',
    Codigo_Proveedor:''
  }

  ngOnInit(): void {
    this.obtenerTC();
    this.search();
  }
  async obtenerTC() {
    var fecha =
      this.hoy.getDate() +
      "/" +
      (this.hoy.getMonth() + 1) +
      "/" +
      this.hoy.getFullYear();
    this.tipoCambio = await this.apiService.getObtenerTC(fecha);
  }
  search() {
    this.loadMovements(this.searchField);
  }
  keytab(event) {
    if (event.key === "Enter") {
      this.search();
    }
  }
  async searchProduct(){
    //this.(this.searchFieldProduct);
    await this.obtenerProducto(this.searchFieldProduct,0);
  }
  keytabProduct(event){
    if (event.key === 'Enter') {
      this.searchProduct();
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
    this.loadMovements(this.searchField);
  }
  async editRecord(movimiento) {
    let licencia = await this.loadUserType();

    if (licencia != true){
      Swal.fire("Su licencia esta inactiva, Contacte a Soporte Técnico");
      return false;
    }
    this.edit = true;
    window.scrollTo(0, 0);
    if (movimiento) {
      let data = await this.cashierMovementService.loadMovement(movimiento.Id_Movimiento);
      this.Movement = data["data"][0];
      // Load Details
      let details = await this.cashierMovementService.loadMovementDetails(
        movimiento.Id_Movimiento
      );
      if (details["total"] > 0) {
        this.Details = details["data"];
      } else {
        this.Details = [];
      }
    } else {
      this.Movement = {
        Id_Movimiento: "",
        Tipo_Movimiento: "03",
        Id_Caja: '',
        Id_Cliente: "",
        Descripcion: "",
        Descripcion2: "",
        Codigo_Identificacion: "01",
        Tipo_Identificacion:"",
        Numero_Identificacion: "",
        Correo: "",
        Condicion_Venta: "01",
        Plazo_Credito: "0",
        Metodo_Pago: "01",
        Moneda: "CRC",
        Tipo_Cambio: "",
        IVA: 0,
        Sub_Total: 0,
        Total: 0,
        Estado: 0,
        Creado_El:
          this.hoy.getDate() +
          "/" +
          (this.hoy.getMonth() + 1) +
          "/" +
          this.hoy.getFullYear(),
        Consecutivo: "",
        Notas:'',
        Id_Comprobante:'',
        Nombre_Cliente:'',
        Id_Caja_Diaria:''
      };
      this.initDetail();

      this.Details = [];
      this.Movement.Tipo_Cambio = this.tipoCambio.venta;
    }
    return true;
  }
  edit_Detalle(index) {
    this.Detalle = this.Details[index];
    this.Details.splice(index, 1);
  }
  remove_Detalle(index: number) {
    this.Details.splice(index, 1);
    this.calcularTotales();
  }
  async loadUserType(){
    let data = await this.apiService.getUserType();
    if(data['data'][0]['Tipo_Usuario'] != '1'){
      //Determinar si la licencia esta activa.
      let licencia = await this.apiService.getLicence();
      if(licencia['data'][0]['Estado'] != '1'){
        return false;
      }else{
        //Validar Cantidad de documentos
        let cantidad = licencia['data'][0]['Cantidad_Disponible'];
        if(cantidad <1){
          return false;
        }
        //Validar Fecha.
        let fecha =  new Date(licencia['data'][0]['Fecha_Vencimiento']);

        if( fecha < this.hoy ){
          return false;
        }
        return true;
      }
    }
    return true;
  }
  async loadMovements(search?){
    let data = await this.cashierMovementService.loadMovements(this.paginacion,search);
    if (data["total"] == 0) {
      this.Movements = [];
    } else {
      this.Movements = data["data"];
    }
  }
  cancel() {
    this.edit = false;
    this.PantallaLoading = false;
    window.scrollTo(0, 0);
  }
  closeModal() {
    this.PantallaProductos = false;
  }
  keytab1(event, next) {
    if (event.key === "Enter") {
      this.processProduct(next, true);
    }
  }
  initDetail() {
    this.Detalle = {
      Codigo_Referencia: "",
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
      Tipo_Codigo:''
    };
  }
  processProduct(next, stop?) {

    if (next === "Descripcion2") {
      if (this.Detalle.Codigo_Referencia === "") {
        //alert('Debe digitar El codigo');
        return false;
      }
      this.obtenerProducto(this.Detalle.Codigo_Referencia, 1);
    }
    if (next === "Precio") {
      if (this.Detalle.Cantidad === 0) {
        Swal.fire("Debe digitar la cantidad");
        return false;
      }
    }
    if (next === "Codigo_Referencia") {
      this.calcularTotales();
    }

    let element = document.getElementById(next);

    if (next != "Codigo_Referencia") {
      element.focus();
    }
    (<HTMLInputElement>document.getElementById(next)).select();
    if (stop) {
      return false;
    }
    return true;
  }
  Seleccionar(producto) {
    this.Detalle.Id_Producto = producto.Id_Producto;
    this.Detalle.Descripcion = producto.Descripcion;
    this.Detalle.Precio = producto.Precio;
    this.Detalle.Unidad_Medida = producto.Unidad_Medida;
    this.Detalle.IVAPorcentaje = producto.Impuesto;
    this.Detalle.Codigo_Referencia = producto.Codigo;
    this.PantallaProductos = false;
    let element = document.getElementById("Cantidad");
    element.focus();
  }
  calcularTotales() {
    if(this.Detalle.Precio >0){
      this.Detalle.Sub_Total = this.Detalle.Cantidad * this.Detalle.Precio;
      this.Detalle.Total = this.Detalle.Sub_Total;
      if (this.Detalle.Total > 0) {
        this.Details.push(this.Detalle);
      }
    }
    this.Movement.Sub_Total = 0;
    this.Movement.IVA = 0;
    this.Movement.Total = 0;
    for (let i = 0; i < this.Details.length; i++) {
      this.Movement.Sub_Total = this.Movement.Sub_Total + parseFloat(this.Details[i]["Sub_Total"]);
      this.Movement.IVA = this.Movement.IVA + parseFloat(this.Details[i]["IVA"]);
      this.Movement.Total = this.Movement.Total + parseFloat(this.Details[i]["Total"]);
    }
    this.initDetail();
  } 

  async obtenerProducto(producto, tipo) {
    let data = await this.productService.loadProduct(producto,4);
    if (data['total'] === 0) {
      data = await this.productService.loadProductLike(producto,4);
    }
    if (data["total"] === 1) {
      if (tipo == 1) {
        //Hay un registro hay que cargarlo
        this.Detalle.Id_Producto = data["data"][0]["Id_Producto"];
        this.Detalle.Tipo_Codigo = data["data"][0]["Tipo_Codigo"];
        this.Detalle.Descripcion = data["data"][0]["Descripcion"];
        this.Detalle.Precio = data["data"][0]["Ultimo_Costo"];
        this.Detalle.Unidad_Medida = data["data"][0]["Unidad_Medida"];
        this.Detalle.IVAPorcentaje = data["data"][0]["Impuesto"];
        this.Detalle.Codigo_Referencia = data["data"][0]["Codigo"];
        this.Detalle.Tipo_Impuesto = data["data"][0]["Tipo_Impuesto"];
      } else {
        this.registros = data["data"];
      }
    } else {
      this.searchFieldProduct = producto;
      this.PantallaProductos = true;
      this.registros = data["data"];
    }
  }
  async grabarMovimiento() {
    this.PantallaLoading = true;
    //jbrenes
    this.Movement.Creado_El = this.hoy.getDate() + "/" + (this.hoy.getMonth() + 1) + "/" + this.hoy.getFullYear();
    if (this.Details.length === 0) {
      Swal.fire("No a seleccionado Articulos");
      return false;
    }
    if (this.Movement.Id_Movimiento == "") {
      //factura nueva, grabar encabezado y detalle
      //Grabar encabezado de la factura
      //Cargar la Caja
      this.Movement.Id_Caja = localStorage.getItem('Id_Caja');
      this.Movement.Id_Caja_Diaria = localStorage.getItem('Id_Caja_Diaria');
      let data = await this.cashierMovementService.insertHeader(this.Movement);
      this.Movement.Id_Movimiento = data["data"][0]["Identity"];
      for (let i = 0; i < this.Details.length; i++) {
        this.grabarUnDetalleFactura(i);
      }
      this.aplicarMovimiento();
    } else {
      //actualizar los detalles de la factura
      let data = await this.cashierMovementService.updateHeader(this.Movement);
      let del = await this.cashierMovementService.deleteDetails(this.Movement.Id_Movimiento);
      for (let i = 0; i < this.Details.length; i++) {
        this.grabarUnDetalleFactura(i);
      }
      this.aplicarMovimiento();
    }
    this.PantallaLoading = false;
    return true;
  }
  async grabarUnDetalleFactura(i) {
    let data = await this.cashierMovementService.insertDetail(this.Details[i],this.Movement.Id_Movimiento);
  }
  async aplicarMovimiento() {
    Swal.fire({
      title: 'Desea Aplicar el Movimiento?',
      text: "Si aplica la factura no le podra realizar ninún cambio!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Aplicar el Movimiento!'
    }).then((result) => {
      this.PantallaLoading = true;
      if (result.value) {
        this.preAplicarMovimiento();
      }else{
        this.search();
        this.cancel();
      }
    });
  }
  imprimirFactura(){
    let Id_Empresa = localStorage.getItem('Id_Empresa');
    window.open('https://toxo.work/reportes/inventario/inv-comprobante.php?id='+this.Movement.Id_Movimiento);
  }
  async preAplicarMovimiento(){
    //Si el movimiento es de resta averiguar el saldo, si el saldo es inferior al movimiento no aplicar
    let data = await this.cashierService.loadCaja(this.Id_Caja);
    let Nuevo_Saldo = 0;
    let Saldo = parseFloat(data['data'][0]['Saldo_Actual']);
    if(this.Movement.Tipo_Movimiento == '03'){
      if(this.Movement.Total > Saldo){
        Swal.fire("Saldo Actual No es suficiente para aplicar el Movimiento");
        this.PantallaLoading = false;
        return false;
      }else{
        Nuevo_Saldo = Saldo - this.Movement.Total;
      }
    }else{
      Nuevo_Saldo = Saldo + this.Movement.Total;
    }
    this.cashierMovementService.aplicarMovimiento(this.Movement.Id_Movimiento);
    this.cashierService.ActualizarSaldo(this.Id_Caja,Nuevo_Saldo);
    // Actualizar es estado de la caja
    this.search();
    this.cancel();
    return true;
  }
  /** Datos del cliente */
  ClienteNuevo(){
    Swal.fire('Proceso en contrucción, Consulte a soporte')
  }
  enterValidation(event){
    if (event.key === "Enter") {
      //await this.IdValidation();
      let elemento = document.getElementById("NombreCliente");
      elemento.focus();
    }
  }

  async IdValidation(){
    if(this.Movement.Numero_Identificacion == ''){
      return true;
    }
    if(this.validandoId == true){
      return false;
    }else{
      this.validandoId = true;
    }
    this.PantallaLoading = true;
    //validar si la cedula existe en la base de datos.
    let data = await this.invoiceService.validClient(this.Movement.Numero_Identificacion);
    if (data["total"] === 0) {
      this.clienteExiste = false;
      if(!Number.isInteger(this.Movement.Numero_Identificacion)){
        Swal.fire('No es posible realizar la consulta');
        this.PantallaLoading = false;
        return false;
        
      }
      let persona = await this.invoiceService.getApiHacienda(this.Movement.Numero_Identificacion);
      
      if(persona){
        this.Movement.Nombre_Cliente = persona.nombre;
        this.Movement.Tipo_Identificacion = persona.tipoIdentificacion;
        this.Movement.Codigo_Identificacion = this.Movement.Tipo_Identificacion;
        this.Movement.Condicion_Venta = '01';
        this.Movement.Metodo_Pago = '01';
        this.Movement.Plazo_Credito = '0';
        let data = await this.invoiceService.insertClient(this.Movement);
        this.Movement.Id_Cliente = data["data"][0]["Identity"];
        
      }else{
        this.PantallaLoading = false;
      }
    }else {
      //Cliente si existe, cargar el registro.
      this.clienteExiste = true;
      let persona = data["data"][0];
      this.Movement.Id_Cliente = persona.Id_Persona;
      this.Movement.Numero_Identificacion = persona.Identificacion;
      this.Movement.Nombre_Cliente = persona.Nombre;
      this.Movement.Codigo_Identificacion = persona.Tipo_Identificacion;
      this.Movement.Correo = persona.Correo;
      this.Movement.Condicion_Venta = persona.Condicion_Venta;
      this.Movement.Plazo_Credito = persona.Plazo_Credito;
      this.Movement.Metodo_Pago = persona.Metodo_Pago;
      this.Movement.Moneda = persona.Moneda;
      if(this.Movement.Tipo_Movimiento == '06'){
        this.Movement.Condicion_Venta = '02';
        this.Movement.Descripcion = 'Vale ' + this.Movement.Creado_El
      }
      if(this.Movement.Moneda ==''){
        this.Movement.Moneda = 'CRC';
      }
      this.PantallaLoading = false;
    }
    let elemento = document.getElementById("NombreCliente");
    elemento.focus();
    this.validandoId = false;
    this.PantallaLoading = false;
    return true;
  }
  cambioMovimiento(){
    switch(this.Movement.Tipo_Movimiento) { 
      case '06': { 
        this.mostrarCliente = true;
        break; 
      } 
      case '07': { 
        this.mostrarCliente = true;
        break; 
      } 
      case '08': { 
        this.mostrarCliente = true;
        break; 
      } 
      case '09': { 
        this.mostrarCliente = true;
        break; 
      } 
      default: { 
        this.mostrarCliente = false;
        break; 
         
      } 
   } 
  }

  Nuevo_Articulo(){
    this.PantallaProductos = false;
    this.PantallaArticuloNuevo = true;
  }
  async grabarArticulo(){
    if(this.Articulo.Descripcion == ""){
     Swal.fire('Favor Suministrar el nombre');
     return false;
    }
    if(this.Articulo.Precio == ""){
      Swal.fire('Favor Suministrar el Precio');
      return false;
    }
    this.Articulo.Codigo = this.Articulo.SKU;
    let data = await this.productService.saveArticle(this.Articulo);
    if(data['success'] =='true'){
      this.Detalle.Codigo_Referencia = this.Articulo.Codigo
      this.Detalle.Descripcion = this.Articulo.Descripcion;
      this.Detalle.Cantidad = 1;
      this.Detalle.Precio = parseFloat(this.Articulo.Precio);
      let element = document.getElementById('SKU');
      element.focus();
    (<HTMLInputElement>document.getElementById('SKU')).select();
      this.closePantallaArticuloNuevo();
    }
    
    return true;
  }
  closePantallaArticuloNuevo(){
    this.PantallaArticuloNuevo = false;
  }

}
