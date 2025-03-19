import { ApiService } from "../../../../../core/src/app/lib/api.service";
import { Component, OnInit } from "@angular/core";
import { InvoiceService } from "./invoice.service";
import Swal from "sweetalert2";
import { ProductService } from '../../../../../inventario/src/app/inventory/product/product.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { ParametrosCiaService } from '../../../../../main/src/app/general/parametros-cia/parametros-cia.service';
import { CategoryService } from '../../../../../inventario/src/app/inventory/category/category.service';

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.css"],
})
export class InvoiceComponent implements OnInit {
  constructor(
    private invoiceService: InvoiceService,
    private apiService: ApiService,
    private productService:ProductService,
    private peopleService:ContactoService,
    private parametrosCiaService:ParametrosCiaService,
    private categoryService:CategoryService
  ) {}
  ProductoEncontrado = false;
  Id_Factura = '';
  POV = false;
  validandoId = false;
  TipoArchivo = 1;
  sistemaConfigurado = true;
  SeguridadStr = localStorage.getItem("ToxoSG");
  Seguridad = [];
  AppRestaurante = false;
  PantallaCobro = false;
  IvaIncluido = 1;
  Regimen = "";
  Caja = "";
  tipoCambio = {
    compra: "",
    venta: "",
    fecha: "",
  };
  Exoneracion = {
    Exonerada : 0,
    Tipo_Cocumento : '',
    Exo_Numero_Documento : '',
    Exo_Nombre_Institucion : '',
    Exo_Fecha_Emision : '',
    Exo_Porcentaje : '0',
    Exo_Monto : 0
  }
  registros = [];
  Invoices = [];
  Details = [];
  Categories = [];
  Cargos= [];
  clienteExiste = false;
  PantallaProductos = false;
  PantallaLoading = false;
  PantallaExoneracion = false;
  PantallaClienteNuevo = false;

  hoy = new Date();
  searchField = "";
  searchFieldProduct = "";
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  edit = false;
  Invoice = {
    Id_Factura: "",
    Tipo_Documento: "",
    Id_Cliente: "",
    Nombre: "",
    Codigo_Identificacion: "",
    Numero_Identificacion: "",
    Correo: "",
    Condicion_Venta: "01",
    Plazo_Credito: "0",
    Metodo_Pago: "1",
    Moneda: "CRC",
    Tipo_Cambio: "",
    IVA: 0,
    Sub_Total: 0,
    Total: 0,
    Respuesta_MH: "Registrado",
    Creado_El: "",
    Consecutivo: "",
    Notas:'',
    Error_MH:'',
    Exonerada : 0,
    Exo_Numero_Documento : '',
    Exo_Nombre_Institucion : '',
    Exo_Fecha_Emision : '',
    Exo_Porcentaje : '0',
    Exo_Monto : 0,
    Clave_Numerica:'',
    Cobro:0,
    Id_Caja_Diaria:localStorage.getItem('Id_Caja_Diaria')
  };
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
  };
  persona = {
    Id_Persona: "",
    Nombre: "",
    Telefono: "",
    Correo: "",
    Identificacion: "",
    Tipo_Identificacion: "",
    Condicion_Venta: "",
    Plazo_Credito: "",
    Metodo_Pago: "01",
    Estado: "",
    Moneda:'',
    Codigo_Actividad_Economica:'',
    Nombre_Actividad_Economica:''
  };
  ngOnInit(): void {
    //Validar Configuracion Contable;
    this.LeerParametroIVA()
    if(localStorage.getItem('ToxoPOV') == '1'){
      this.POV = true;
    }
    if(localStorage.getItem('TIC') == '1'){
      this.ValidarContabilidad();
    }else{

    }
    this.loadInvoices();
    this.obtenerTC();
    this.loadCaja();
    this.loadCargos();
    if(this.Regimen == ""){
      this.getRegimen();
    }
    if(this.SeguridadStr == ""){
      this.SeguridadStr = "0.0.0.0.0.0.0.0.0.0.0";
    }
    this.Seguridad = this.SeguridadStr.split(".");
    if(this.Seguridad[7]==1){this.AppRestaurante=true}
  }
  async LeerParametroIVA(){
    let data = await this.invoiceService.LoadIVAIncludio();
    if(data['total'] == 1){
      this.IvaIncluido = data['data'][0]['Valor'];
    }else{
      this.IvaIncluido = 1;
    }
  }
  async ValidarContabilidad(){
    // Validar que este configurada la cuenta contable de efectivo
    this.ValidarCuentaEfectivo();
    this.ValidarCuentaCobrar();
    this.ValidarCuentaPagar();
    this.ValidarCuentasInventario();
  }
  async ValidarCuentaEfectivo(){
    let data = await this.parametrosCiaService.loadParameterCia(localStorage.getItem('Id_Empresa'),'Cge_Cuenta_Efectivo');
    if(data['total'] == 0){
      this.sistemaConfigurado = false;
      Swal.fire('No esta configurada la cuenta de efectivo');
    }
  }
  async ValidarCuentaCobrar(){
    let data = await this.parametrosCiaService.loadParameterCia(localStorage.getItem('Id_Empresa'),'Cge_Cuenta_Cobrar_Defecto');
    if(data['total'] == 0){
      this.sistemaConfigurado = false;
      Swal.fire('No esta configurada la cuenta por cobrar');
    }
  }
  async ValidarCuentaPagar(){
    let data = await this.parametrosCiaService.loadParameterCia(localStorage.getItem('Id_Empresa'),'Cge_Cuenta_Pagar_Defecto');
    if(data['total'] == 0){
      this.sistemaConfigurado = false;
      Swal.fire('No esta configurada la cuenta por pagar');
    }
  }
  async ValidarCuentasInventario(){
    let data = await this.categoryService.loadCategoryWithoutAccount();
    if(data['data'][0]['count(Id_Categoria)'] > 0){
      this.sistemaConfigurado = false;
      Swal.fire('No estan configuradas las cuentas de las categorias de inventario');
    }
  }
  async loadCargos(){
    let data = await this.invoiceService.loadCargos();
    this.Cargos = data['data'];
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
  async loadCaja(){
    this.Caja = localStorage.getItem("Id_Caja");
    if(!this.Caja){
      let data = await this.invoiceService.loadCaja();
      this.Caja = data['data'][0]['Id_Caja'];
    }
  }
  async getRegimen(){
    let data = await this.invoiceService.getRegimen();
    this.Regimen = data['data'][0]['Regimen'];
  }
  async obtenerTC() {
    let obtener = false;
    var fecha = this.hoy.getDate() +"/" +(this.hoy.getMonth() + 1) +"/" +this.hoy.getFullYear();
    if(localStorage.getItem('TC') == null){
      obtener = true;
    }else{
      let tipoCambio = JSON.parse(localStorage.getItem('TC'));
      if(fecha == tipoCambio.fecha){
        this.tipoCambio = tipoCambio;
      }else{
        obtener = true;
      }
    }
    if(obtener){
      let respuesta = await this.LeerTipoCambio(fecha);
      if(respuesta == false){
        let TipoCambio = await this.apiService.getObtenerTC(fecha);
        this.tipoCambio.compra = TipoCambio.compra;
        this.tipoCambio.venta = TipoCambio.venta;
        this.tipoCambio.fecha = fecha;
        //this.tipoCambio 
        
        //Almacenar en cache
        localStorage.setItem('TC',JSON.stringify(this.tipoCambio));
        //Grabar el TC en la Base de datos.
        await this.invoiceService.GrabarTC(this.tipoCambio);
      }
    }
  }
  async loadInvoices(search?) {
    let data = await this.invoiceService.loadInvoices(this.paginacion, search);
    if (data["total"] == 0) {
      this.Invoices = [];
    } else {
      this.Invoices = data["data"];
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
    this.loadInvoices();
  }
  keytab(event, next) {
    if (event.key === "Enter") {
      //this.processProduct(next, true);
      document.getElementById(next).focus();
    }
  }
  async processProduct(next, stop?) {
    if(this.PantallaProductos == true){
      //return false;
    }
    if (next === "Descripcion") {
      if (this.Detalle.SKU === "") {
       
        return false;
      }
      await this.obtenerProducto(this.Detalle.SKU, 1);
    }
    if (next === "Precio") {
      if (this.Detalle.Cantidad === 0) {
        Swal.fire("Debe digitar la cantidad");
        return false;
      }
    }
    if (next === "SKU") {
      this.calcularTotales();
    }
    if (stop) {
      return false;
    }
    return true;
  }
  procesaAdicionales(){
    let adicionales = [];
    for (let i = 0; i < this.Cargos.length; i++) {
      let detail = {
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
      //para Cada Cargo Analizar las lineas
      let SubTotalCargo = 0;
      let IvaCargao = 0;
      let TotalCago = 0;
      //Eliminar la linea que ya existe
      for (let x = 0; x < this.Details.length; x++) {
        let Nombre = 'ADC'+this.Cargos[i]['Id_Factura_Cargos'];
        if (Nombre == this.Details[x]['SKU']){
          this.Details.splice(x, 1);
        }
      }
      for (let x = 0; x < this.Details.length; x++) {
        if (this.Cargos[i]['Id_Categoria'] == this.Details[x]['Id_Categoria']){
          detail.Id_Factura = this.Details[x]['Id_Factura'];
          detail.Id_Empresa = this.Details[x]['Id_Empresa'];
          detail.Id_Producto = 'ADC'+this.Cargos[i]['Id_Factura_Cargos'];
          detail.Descripcion = this.Cargos[i]['Nombre'];
          detail.Precio = 0;
          detail.Precio = ( parseFloat(this.Details[x]['Cantidad']) * parseFloat(this.Details[x]['Precio']) * parseFloat(this.Cargos[i]['Porcentaje']) ) /100;

          detail.Cantidad = 1;
          detail.Sub_Total = detail.Precio;
          if(this.Cargos[i]['IVA'] ==1 ){
            detail.IVA = (detail.Sub_Total * parseFloat(this.Details[x]['IVAPorcentaje'])) / 100;
            detail.Total = detail.Sub_Total + detail.IVA;
            detail.IVAPorcentaje = this.Details[x]['IVAPorcentaje'];
            detail.Tipo_Impuesto = this.Details[x]['Tipo_Impuesto'];
          }else{
            detail.IVA = 0;
            detail.IVAPorcentaje = 0;
            detail.Total = detail.Sub_Total;
            detail.Tipo_Impuesto = '01'
            detail.Tipo_Codigo = '3'
          }
          detail.Unidad_Medida = 'Unid';

          detail.Codigo_Referencia = 'ADC'+this.Cargos[i]['Id_Factura_Cargos'];

          detail.SKU = 'ADC'+this.Cargos[i]['Id_Factura_Cargos'];
          detail.Id_Categoria = this.Cargos[i]['Id_Categoria'];
          detail.Total = detail.Precio
          detail.Adicional = '1';
        }
        SubTotalCargo = SubTotalCargo + detail.Sub_Total;
        IvaCargao = IvaCargao + detail.IVA;
        TotalCago = TotalCago + detail.Total;
      }
      //detail.Sub_Total = SubTotalCargo;
      //detail.IVA = IvaCargao;
      //detail.Total = TotalCago;
      if(detail.Total > 0){
        //this.Details.push(detail);
        adicionales.push(detail)
      }
    }
    for (let z = 0; z < adicionales.length; z++) {
      this.Details.push(adicionales[z]);
    }

  }
  async calcularTotales() {
    if(this.IvaIncluido == 1){
      this.Detalle.Precio =  this.Detalle.Precio / (1 + (this.Detalle.IVAPorcentaje / 100));
      this.Detalle.Precio = parseFloat(parseFloat(this.Detalle.Precio.toString()).toFixed(2));
    }

    this.Detalle.Sub_Total = this.Detalle.Cantidad * this.Detalle.Precio;
    this.Detalle.IVA = (this.Detalle.Sub_Total * this.Detalle.IVAPorcentaje) / 100;
    this.Detalle.IVA = parseFloat(parseFloat(this.Detalle.IVA.toString()).toFixed(2));
    this.Detalle.Total = this.Detalle.Sub_Total + this.Detalle.IVA;
    if (this.Detalle.Total > 0) {
      this.Details.push(this.Detalle);
    }
    this.Invoice.Sub_Total = 0;
    this.Invoice.IVA = 0;
    this.Invoice.Total = 0;
    // tslint:disable-next-line: prefer-for-of
    await this.procesaAdicionales();
    for (let i = 0; i < this.Details.length; i++) {
      //Agregar Validación de Exoneración
      this.Invoice.Sub_Total =
        this.Invoice.Sub_Total + parseFloat(this.Details[i]["Sub_Total"]);
      this.Invoice.IVA = this.Invoice.IVA + parseFloat(this.Details[i]["IVA"]);
      this.Invoice.Total = this.Invoice.Sub_Total + this.Invoice.IVA;
    }
    this.initDetail()
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
        if(this.IvaIncluido == 1){
          this.Detalle.Precio = this.Detalle.Precio * (1 + (this.Detalle.IVAPorcentaje/100));
          this.Detalle.Precio = parseFloat(parseFloat(this.Detalle.Precio.toFixed()).toFixed(2));
        }
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
    if(this.POV){
      await this.calcularTotales();
    }
    //return true;
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
    if(this.POV){
      document.getElementById('SKU').focus();
    }
  }
  keytab1(event) {
    if (event.key === "Enter") {
      this.search();
    }
  }
  search() {
    this.loadInvoices(this.searchField);
  }
  async editRecord(factura) {
    if(this.POV){
      let Caja_Diaria = localStorage.getItem('Id_Caja_Diaria');
      if(!Caja_Diaria){
        Swal.fire('Caja no ha sido abierta, no es posible facturar');
        return false;
      }
    }
    if(this.sistemaConfigurado == false){
      Swal.fire('Sistema no esta configurado correctamente, Contacte con Soporte Técnico');
      return false;
    }
    let licencia = await this.loadUserType();

    if (licencia != true){
      Swal.fire("Su licencia esta inactiva, Contacte a Soporte Técnico");
      return false;
    }


    this.edit = true;
    window.scrollTo(0, 0);
    if (factura) {
      this.clienteExiste = true;
      let data = await this.invoiceService.loadInvoice(factura.Id_Factura);
      this.Invoice = data["data"][0];
      //Cargar Exoneración
      this.Exoneracion.Exonerada = this.Invoice.Exonerada;
      this.Exoneracion.Exo_Numero_Documento = this.Invoice.Exo_Numero_Documento;
      this.Exoneracion.Exo_Nombre_Institucion = this.Invoice.Exo_Nombre_Institucion;
      this.Exoneracion.Exo_Fecha_Emision = this.Invoice.Exo_Fecha_Emision;
      this.Exoneracion.Exo_Porcentaje = this.Invoice.Exo_Porcentaje;
      this.Exoneracion.Exo_Monto = this.Invoice.Exo_Monto
      //Verificar si la factura esta siendo procesada por hacienda, disparar la consulta y regresar.
      if(this.Invoice.Respuesta_MH == 'procesando'){
        let data = this.apiService.aplicarFacturaHacienda(this.Invoice.Id_Factura);
        this.cancel();
      }

      // Load Details
      let details = await this.invoiceService.loadInvoiceDetails(factura.Id_Factura);
      if (details["total"] > 0) {
        this.Details = details["data"];
      } else {
        this.Details = [];
      }
      if(this.Invoice.Id_Caja_Diaria == '0'){
        this.Invoice.Id_Caja_Diaria = localStorage.getItem('Id_Caja_Diaria');
      }
    } else {
      this.Invoice = {
        Id_Factura: "",
        Tipo_Documento: "01",
        Id_Cliente: "",
        Nombre: "",
        Codigo_Identificacion: "01",
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
        Respuesta_MH: "Registrado",
        Creado_El:
          this.hoy.getDate() +
          "/" +
          (this.hoy.getMonth() + 1) +
          "/" +
          this.hoy.getFullYear(),
        Consecutivo: "",
        Notas:'',
        Error_MH:'',
        Exonerada : 0,
        Exo_Numero_Documento : '',
        Exo_Nombre_Institucion : '',
        Exo_Fecha_Emision : '',
        Exo_Porcentaje : '0',
        Exo_Monto : 0,
        Clave_Numerica:'',
        Cobro:0,
        Id_Caja_Diaria:localStorage.getItem('Id_Caja_Diaria'),
      };
      if(this.POV){
        this.Invoice.Metodo_Pago = '98'
        this.Invoice.Tipo_Documento =  '04'
        this.Invoice.Numero_Identificacion = 'Contado';
        this.Invoice.Nombre = 'Cliente de Contado';
      }else{
        this.Invoice.Metodo_Pago = '01';
      }
      this.initDetail();
      this.persona = {
        Id_Persona: "",
        Nombre: "",
        Telefono: "",
        Correo: "",
        Identificacion: "",
        Tipo_Identificacion: "01",
        Condicion_Venta: "01",
        Plazo_Credito: "0",
        Metodo_Pago: "01",
        Estado: "",
        Moneda:'',
        Codigo_Actividad_Economica:'',
        Nombre_Actividad_Economica:''
      };
      this.Details = [];
      this.Invoice.Tipo_Cambio = this.tipoCambio.venta;
    }
    return true;
  }
  aplicarFactura(){
    if(this.POV){
      this.PantallaCobro = true;
    }else{
      this.PreAplicarFactura();
    }
  }
  async PreAplicarFactura() {
    this.PantallaLoading = true;
    if (this.Invoice.Tipo_Documento === "01") {
      if (this.Invoice.Numero_Identificacion === "") {
        Swal.fire("No a seleccionado un cliente");
        this.PantallaLoading = false;
        return false;
      }
    }
    if (this.Details.length === 0) {
      Swal.fire("No a seleccionado Articulos");
      this.PantallaLoading = false;
      return false;
    }
    //Verificar que el cliente tenga correo electrónico.
    if(!this.POV){
      if(this.Invoice.Tipo_Documento === '01'){
        if (this.Invoice.Correo === '') {
          Swal.fire("No a Suministrado El correo del Cliente");
          this.PantallaLoading = false;
          return false;
        }
      }
    }

    //Verificar si el cliente existe
    if (this.clienteExiste == false) {
      let data = await this.invoiceService.insertClient(this.Invoice);
      this.clienteExiste = true;
      this.Invoice.Id_Cliente = data["data"][0]["Identity"];
    }
    //Validar que todos los registros tengan un Producto asociado
    let continuar = true;
    for (let i = 0; i < this.Details.length; i++) {
      if (!this.Details[i].Id_Producto) {
        Swal.fire(this.Details[i]['Descripcion'] + ' No se Cargo Correctamente, No se Puede grabar' )
        this.PantallaLoading = false;
        continuar =false;
      }
    }
    if(continuar == false){
      this.PantallaLoading = false;
      return false;
    }
    // tslint:disable-next-line: align
    if (this.Invoice.Id_Factura == "") {
      //factura nueva, grabar encabezado y detalle
      //Grabar encabezado de la factura
      let data = await this.invoiceService.insertHeader(this.Invoice, this.Caja,this.Exoneracion);
      this.Invoice.Id_Factura = data["data"][0]["Identity"];
      for (let i = 0; i < this.Details.length; i++) {
        await this.grabarUnDetalleFactura(i);
      }
      await this.aplicarFacturaHacienda();
    } else {
      //actualizar los detalles de la factura
      let data = await this.invoiceService.updateHeader(this.Invoice,this.Caja,this.Exoneracion);
      //Actualizar los detalles
      let ListaDetalles = ''

      for (let i = 0; i < this.Details.length; i++) {
        if(String(this.Details[i]['Id_Factura_detalle']) == ""){
          //2 Insertar los nuevos detalles
          let data = await this.grabarUnDetalleFactura(i);
          if(i > 0){
            ListaDetalles = ListaDetalles + ',';
          }
          ListaDetalles = ListaDetalles + String(data['data'][0]['Identity']);
        }else{
          //3 Actualizar los detalles existentes.
          await this.modificarUnDetalleFactura(i);
          if(i > 0){
            ListaDetalles = ListaDetalles + ',';
          }
          ListaDetalles = ListaDetalles + String(this.Details[i]['Id_Factura_detalle']);
        }
      }
      this.eliminarDetalles(ListaDetalles);
      //1 Eliminar los detalles que no estan en la lista.
      //
      this.aplicarFacturaHacienda();
    }
    return true;
  }
  async eliminarDetalles(lista){
      let del = await this.invoiceService.deleteDetails(this.Invoice.Id_Factura,lista);
  }
  async modificarUnDetalleFactura(i){
    if (!this.Details[i].Id_Producto) {
      return false;
    }
    let data = await this.invoiceService.updateDetail(this.Details[i]);
    return true;
  }
  async grabarUnDetalleFactura(i) {
    if (!this.Details[i].Id_Producto) {
      return false;
    }
    return await this.invoiceService.insertDetail(this.Details[i],this.Invoice.Id_Factura);
  }
  async aplicarFacturaHacienda() {
    this.PantallaLoading = false;
    if(this.POV){
      if(this.Regimen !== '3' ){
        this.AplicandoFacturaHacienda(this.Invoice.Id_Factura);
      }else{
        this.updateInvoiceStatus(this.Invoice.Id_Factura);
      }
      await this.apiService.postRecord('Call sp_Ven_Aplicar_Factura(' + this.Invoice.Id_Factura + ')' );
      this.imprimirTiquete();

    }else{
      Swal.fire({
        title: 'Desea Aplicar la Factura?',
        text: "Si aplica la factura no le podra realizar ninún cambio!",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Aplicar la Factura!'
      }).then((result) => {
        this.PantallaLoading = true;
        if (result.value) {
          this.aplicandoFactura()

        }else{
          this.search();
          this.cancel();
        }
      });
    }
  }
  async aplicandoFactura(){
    await this.apiService.postRecord('Call sp_Ven_Aplicar_Factura(' + this.Invoice.Id_Factura + ')' );
    
    if(this.Regimen !== '3' ){
      await this.AplicandoFacturaHacienda(this.Invoice.Id_Factura);
    }else{
      await this.updateInvoiceStatus(this.Invoice.Id_Factura);
    }
    
    Swal.fire(
      'Factura Aplicada'
    );
    // validar si es restaurante
    if(localStorage.getItem('TTC') == '1'){
      this.imprimirTiquete();
    }
    this.search();
    this.cancel();
  }
  async updateInvoiceStatus(Id_Factura){
    await this.invoiceService.updateInvoiceStatus(Id_Factura);
  }
  async AplicandoFacturaHacienda(Id_Factura){
    if(this.Id_Factura == ''){
      this.Id_Factura = this.Invoice.Id_Factura;
    }
    if(!Id_Factura){
      Id_Factura = this.Id_Factura;
    }
    if(Id_Factura == ''){
      Id_Factura = this.Id_Factura;
    }
    if(this.Invoice.Metodo_Pago == '98'){
      //Actualizar el estado de la factura agegar consecutivo y clave numerica
      await this.updateInvoiceStatus(this.Invoice.Id_Factura);
      await this.apiService.postRecord('Call sp_Ven_Aplicar_Factura(' + this.Invoice.Id_Factura + ')' );
      return false;
    }
    let data = await this.apiService.aplicarFacturaHacienda(Id_Factura);
    if(data['success'] == 'false'){
      Swal.fire(data['error']);
      return false;
    }
    if(data['respuesta'] == "procesando"){
      await this.AplicandoFacturaHacienda(Id_Factura);
    }else{
      if(data['respuesta'] == "rechazado"){
        Swal.fire(
          'Factura Rechazada por Hacienda, Comunicate con Soporte'
        );
      }
      if(data['respuesta'] == "aceptado"){
        Swal.fire(
          'Factura Aplicada'
        );
      }
      //this.search();
      //this.cancel();
    }
    return true;
  }
  cancel() {
    this.edit = false;
    this.PantallaLoading = false;
    window.scrollTo(0, 0);
    if(this.POV){
      this.search();
    }
  }
  async enterValidation(event) {
    this.validandoId = false;
    if (event.key === "Enter") {
      //await this.IdValidation();
      let elemento = document.getElementById("NombreCliente");
      elemento.focus();
    }
  }
  async ClienteNuevo(){
    this.persona.Id_Persona = '';
    this.persona.Nombre = '';
    this.persona.Correo = '';
    this.persona.Identificacion = '';
    this.PantallaClienteNuevo = true;
    this.persona.Moneda = 'CRC';
  }
  async IdValidation() {
    if(this.Invoice.Numero_Identificacion == ''){
      return true;
    }
    this.Invoice.Numero_Identificacion = this.Invoice.Numero_Identificacion.replace(/[^0-9]/g, '');
    if(this.validandoId == true){
      return false;
    }else{
      this.validandoId = true;
    }
    //validar si la cedula existe en la base de datos.
    let data = await this.invoiceService.validClient(
      this.Invoice.Numero_Identificacion
    );

    if (data["total"] === 0) {
      //jbrenes
      this.clienteExiste = false;
      //El Cliente no existe en la base de datos. hay que consultar hacienda para ver si es un usuario registrado de hacienda.
      let persona = await this.invoiceService.getApiHacienda(this.Invoice.Numero_Identificacion);
      if(persona){
        if(persona[0]){
          Swal.fire('Cliente no existe ni en la base de datos, ni en Hacienda, revise el formato');
          this.PantallaLoading = false;
          return false;
        }else{
          this.persona.Nombre = persona.nombre;
          this.persona.Tipo_Identificacion = persona.tipoIdentificacion;
          this.persona.Codigo_Actividad_Economica = persona['actividades'][0]['codigo'];
          this.persona.Nombre_Actividad_Economica = persona['actividades'][0]['descripcion'];
          this.Invoice.Nombre = this.persona.Nombre;
          this.Invoice.Codigo_Identificacion = persona.tipoIdentificacion;
          if(this.Invoice.Numero_Identificacion.length == 10){
            if(this.Invoice.Codigo_Identificacion == '01'){
              this.Invoice.Codigo_Identificacion = '02';
              this.persona.Tipo_Identificacion = '02';
            }
          }
          this.Invoice.Condicion_Venta = '01';
          this.Invoice.Metodo_Pago = '01';
          this.Invoice.Plazo_Credito = '0';

        }
      }else{
        Swal.fire({
          title: 'Cliente No Existe',
          text: "Desea Crear un Cliente Nuevo",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Crear Cliente  !'
        }).then((result) => {
         // aqui va el codigo de crear nuevo
          if (result.value) {
            this.ClienteNuevo();
          }
        });
        let elemento = document.getElementById("Correo");
        elemento.focus();
      }

    } else {
      //Cliente si existe, cargar el registro.
      this.clienteExiste = true;
      this.persona = data["data"][0];
      this.Invoice.Id_Cliente = this.persona.Id_Persona;
      this.Invoice.Numero_Identificacion = this.persona.Identificacion;
      this.Invoice.Nombre = this.persona.Nombre;
      this.Invoice.Codigo_Identificacion = this.persona.Tipo_Identificacion;
      this.Invoice.Correo = this.persona.Correo;
      this.Invoice.Condicion_Venta = this.persona.Condicion_Venta;
      this.Invoice.Plazo_Credito = this.persona.Plazo_Credito;
      this.Invoice.Metodo_Pago = this.persona.Metodo_Pago;
      this.Invoice.Moneda = this.persona.Moneda;
      if (this.Invoice.Moneda === "") {
        this.Invoice.Moneda = "CRC";
      }
      if (this.Invoice.Condicion_Venta === "") {
        this.Invoice.Condicion_Venta = "01";
      }
      if (this.Invoice.Plazo_Credito === "") {
        this.Invoice.Plazo_Credito = "0";
      }
      if (this.Invoice.Metodo_Pago === "") {
        this.Invoice.Metodo_Pago = "01";
      }
      if (this.Invoice.Codigo_Identificacion == "") {
        this.Invoice.Codigo_Identificacion = "01";
      }
    }
    let elemento = document.getElementById("Correo");
    elemento.focus();
    this.validandoId = false;
    return true;
  }
  closeModal() {
    this.PantallaProductos = false;
  }
  async Seleccionar(producto) {
    //Jaime
    this.Detalle.Id_Producto = producto.Id_Producto;
    this.Detalle.SKU = producto.SKU;
    this.Detalle.Descripcion = producto.Descripcion;
    //this.PantallaProductos = false;
    await this.processProduct('Descripcion');
    this.PantallaProductos = false;
    document.getElementById('Descripcion').focus();
    
    /*
    this.Detalle.Precio = producto.Precio;
    this.Detalle.Unidad_Medida = producto.Unidad_Medida;
    this.Detalle.IVAPorcentaje = producto.Impuesto;
    this.Detalle.Codigo_Referencia = producto.Codigo;
    this.Detalle.Id_Categoria = producto.Categoria;
    this.PantallaProductos = false;
    this.Detalle.Total = parseFloat(this.Detalle.Cantidad.toString()) + ( parseFloat(this.Detalle.Precio.toString()) * parseFloat(this.Detalle.IVAPorcentaje.toString()) /100);
    this.Detalle.Total = parseFloat(parseFloat(this.Detalle.Total.toString()).toFixed(2))
    document.getElementById('Descripcion').focus();
    */
  }
  editVen_Factura_Detalle(index) {
    this.Detalle = this.Details[index];
    if(this.IvaIncluido == 1){
        this.Detalle.Precio = ( this.Detalle.Precio * (1 + (this.Detalle.IVAPorcentaje / 100)))
        this.Detalle.Precio = parseFloat(parseFloat(this.Detalle.Precio.toString()).toFixed(2))
    }
    this.Details.splice(index, 1);
  }
  removeVen_Factura_Detalle(index: number) {
    this.Details.splice(index, 1);
    this.calcularTotales();
  }
  async imprimirCotizacion(){
    if(this.Invoice.Id_Factura == ''){
      await this.aplicarFactura();
    }
    let Id_Empresa = localStorage.getItem('Id_Empresa');
    window.open('https://toxo.work/core/php/hacienda2/cotizacion.php?Id='+this.Invoice.Id_Factura);
  }
  imprimirFactura(){
    let Id_Empresa = localStorage.getItem('Id_Empresa');
    if(this.Invoice.Tipo_Documento == '01'){
      if(this.TipoArchivo == 1){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-FE/PDF-FE/'+this.Invoice.Clave_Numerica+".pdf");
      }
      if(this.TipoArchivo == 2){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-FE/XML-Firmado/'+this.Invoice.Clave_Numerica+".xml");
      }
      if(this.TipoArchivo == 3){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-FE/XML-DGT/'+this.Invoice.Clave_Numerica+"-DGT.xml");
      }

    }
    if(this.Invoice.Tipo_Documento == '02'){
      if(this.TipoArchivo == 1){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-ND/PDF-ND/'+this.Invoice.Clave_Numerica+".pdf");
      }
      if(this.TipoArchivo == 2){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-ND/XML-Firmado/'+this.Invoice.Clave_Numerica+".xml");
      }
      if(this.TipoArchivo == 3){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-ND/XML-DGT/'+this.Invoice.Clave_Numerica+"-DGT.xml");
      }
    }
    if(this.Invoice.Tipo_Documento == '03'){
      if(this.TipoArchivo == 1){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-NC/PDF-NC/'+this.Invoice.Clave_Numerica+".pdf");
      }
      if(this.TipoArchivo == 2){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-NC/XML-Firmado/'+this.Invoice.Clave_Numerica+".xml");
      }
      if(this.TipoArchivo == 3){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-NC/XML-DGT/'+this.Invoice.Clave_Numerica+"-DGT.xml");
      }

    }
    if(this.Invoice.Tipo_Documento == '04'){
      if(this.TipoArchivo == 1){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-TE/PDF-TE/'+this.Invoice.Clave_Numerica+".pdf");
      }
      if(this.TipoArchivo == 2){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-TE/XML-Firmado/'+this.Invoice.Clave_Numerica+".xml");
      }
      if(this.TipoArchivo == 3){
        window.open('https://toxo.work/public/'+Id_Empresa+'/Comprobantes-TE/XML-DGT/'+this.Invoice.Clave_Numerica+"-DGT.xml");
      }
    }
  }
  imprimirTiquete(){
    //if(localStorage.getItem('TTC') == '1'){
      window.open('https://toxo.work/reportes/factura/tiquete-caja.php?IdDocument='+this.Invoice.Id_Factura);
    //}

  }
  async AnularFactura(){
    //Duplicar ecabezado de factura como si fuera nota de Credito
    let sql = "Insert into Ven_Factura (Id_Empresa,Id_Caja,Id_Cliente,Tipo_Documento,Consecutivo,Nombre,Codigo_Identificacion,Numero_Identificacion,Correo,Condicion_Venta,Plazo_Credito,Metodo_Pago,Moneda,Tipo_Cambio,Descuento,IVA,Sub_Total,Total,Clave_Numerica,Respuesta_MH,Sistema_Origen,Registro_Origen,Creado_El) select Id_Empresa,Id_Caja,Id_Cliente,'03',Consecutivo,Nombre,Codigo_Identificacion,Numero_Identificacion,Correo,Condicion_Venta,Plazo_Credito,Metodo_Pago,Moneda,Tipo_Cambio,Descuento,IVA,Sub_Total,Total,Clave_Numerica,'Registrado','VE'," + this.Invoice.Id_Factura + ",Creado_El from Ven_Factura where Id_Factura =" + this.Invoice.Id_Factura + ";";
    let dataEncabezado = await this.apiService.postRecord(sql);
    let Identity = dataEncabezado['data']['0']['Identity'];
    //Obtener todos los detalles de la factura;
    let sqlDetalles = "Select Id_Factura_detalle,Id_Empresa,Id_Factura,Id_Producto,Tipo_Codigo,Codigo_Referencia,Descripcion,Unidad_Medida,Cantidad,Precio,Descuento,Detalle_Descuento,Tasa,IVA,Sub_Total,Total from Ven_Factura_Detalle where Id_Factura = " + this.Invoice.Id_Factura;
    let detalles = await this.apiService.postRecord(sqlDetalles);
    for (let detalle of detalles['data']){
      let sqlDetail = "Insert into Ven_Factura_Detalle ( Id_Empresa,Id_Factura,Id_Producto,Tipo_Codigo,Codigo_Referencia,Descripcion,Unidad_Medida,Cantidad,Precio,Descuento,Detalle_Descuento,Tasa,IVA,Sub_Total,Total,Creado_El,Creado_Por) values ( '"
      sqlDetail = sqlDetail + detalle['Id_Empresa'] + "','";
      sqlDetail = sqlDetail + Identity + "','"
      sqlDetail = sqlDetail + detalle['Id_Producto']  + "','"
      sqlDetail = sqlDetail + detalle['Tipo_Codigo']  + "','"
      sqlDetail = sqlDetail + detalle['Codigo_Referencia']  + "','"
      sqlDetail = sqlDetail + detalle['Descripcion']  + "','"
      sqlDetail = sqlDetail + detalle['Unidad_Medida']  + "','"
      sqlDetail = sqlDetail + detalle['Cantidad']  + "','"
      sqlDetail = sqlDetail + detalle['Precio']  + "',"
      sqlDetail = sqlDetail + detalle['Descuento']  + ",'"
      sqlDetail = sqlDetail + detalle['Detalle_Descuento']  + "','"
      sqlDetail = sqlDetail + detalle['Tasa']  + "','"
      sqlDetail = sqlDetail + detalle['IVA']  + "','"
      sqlDetail = sqlDetail + detalle['Sub_Total']  + "','"
      sqlDetail = sqlDetail + detalle['Total']  + "',"
      sqlDetail = sqlDetail +  "NOW(),'"
      sqlDetail = sqlDetail +  localStorage.getItem('Nombre_Usuario')  + "')";
      sqlDetail = sqlDetail.replace(',,', ',NULL,');
      let detall = await this.apiService.postRecord(sqlDetail);
    }
    this.search();
    this.cancel();
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
  exoneracion(){
    this.PantallaExoneracion = true;
  }
  closeExoneracion(){
    this.PantallaExoneracion = false;
  }
  exonerar(){
    if(this.Exoneracion.Exo_Porcentaje == ''){
      Swal.fire('Especificar Porcentaje');
      return false;
    }
    if(this.Exoneracion.Exo_Fecha_Emision == ''){
      Swal.fire('Especificar Fecha');
      return false;
    }
    if(this.Exoneracion.Exo_Nombre_Institucion == ''){
      Swal.fire('Especificar Institución');
      return false;
    }
    if(this.Exoneracion.Exo_Numero_Documento == ''){
      Swal.fire('Especificar Número de Documento');
      return false;
    }
    this.Exoneracion.Exonerada = 1;
    this.Invoice.Exonerada = 1;
    this.closeExoneracion();
    return true;
  }
  async LeerTipoCambio(fecha){
    let data = await this.invoiceService.ObtenerTC(fecha);
    if (data["total"] > 0) {
      this.tipoCambio = data['data'][0];
      return true;
    }else{
      return false;
    }
  }
  async crearCliente(){
    if(this.persona.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre del Contacto');
      return false;
    }
    let data = await this.peopleService.savePersona(this.persona);
    if(data['success'] =='true'){
      this.Invoice.Id_Cliente = data['data'][0]['Identity'];
      this.Invoice.Numero_Identificacion = this.persona.Identificacion;
      this.Invoice.Nombre = this.persona.Nombre;
      this.Invoice.Codigo_Identificacion = this.persona.Tipo_Identificacion;
      this.Invoice.Correo = this.persona.Correo;
      this.Invoice.Condicion_Venta = this.persona.Condicion_Venta;
      this.Invoice.Plazo_Credito = this.persona.Plazo_Credito;
      this.Invoice.Metodo_Pago = this.persona.Metodo_Pago;
      this.Invoice.Moneda = this.persona.Moneda;
      if (this.Invoice.Moneda === "") {
        this.Invoice.Moneda = "CRC";
      }
      if (this.Invoice.Condicion_Venta === "") {
        this.Invoice.Condicion_Venta = "01";
      }
      if (this.Invoice.Plazo_Credito === "") {
        this.Invoice.Plazo_Credito = "0";
      }
      if (this.Invoice.Metodo_Pago === "") {
        this.Invoice.Metodo_Pago = "01";
      }
      if (this.Invoice.Codigo_Identificacion == "") {
        this.Invoice.Codigo_Identificacion = "01";
      }
      Swal.fire('Contacto grabado correctamente');
      this.cerrarPantallaClienteNuevo();
    }
    return true;
  }
  cerrarPantallaClienteNuevo(){
    this.PantallaClienteNuevo = false;
  }
  async aplicarCobro(){
    await this.PreAplicarFactura();
    await this.CerrarPantallaCobro();
    await this.editRecord('');
  }
  CerrarPantallaCobro(){
    this.PantallaCobro = false;
  }
}
