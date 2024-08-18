import { ProductService } from '../../../../../inventario/src/app/inventory/product/product.service';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { CategoryService } from '../../../../../inventario/src/app/inventory/category/category.service';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxXml2jsonService } from 'ngx-xml2json';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.css'],
})
export class PurchaseInvoiceComponent implements OnInit {
  constructor(
    private router: Router,
    private apiService: ApiService,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private productService: ProductService,
    private categoryService:CategoryService
  ) {}
  Factura_Inventario = '2';
  Id_Empresa = localStorage.getItem('Id_Empresa');
  indice_Articulo_Nuevo = 0;
  interfazInventario = false;
  PrecioServicioIncluido = false;
  SeguridadStr = localStorage.getItem("ToxoSG");
  Seguridad = [];
  SKU_OK = true;
  fileData: File = null;
  inputFileText = 'Escoger archivo XML';
  contenidoArchivo = '';
  FactuaCompraCargada = {};
  Regimen = '';
  Caja = '';
  tipoCambio = {
    compra: '',
    venta: '',
    fecha: '',
  };
  registros = [];
  Invoices = [];
  Details = [];
  Categories = [];
  clienteExiste = true;
  PantallaProductos = false;
  PantallaArticuloNuevo = false;
  PantallaLoading = false;
  hoy = new Date();
  searchField = '';
  searchFieldProduct = '';
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0,
  };
  edit = false;
  Invoice = {
    Id_Factura: '',
    Tipo_Documento: '01',
    Id_Cliente: '',
    Nombre: '',
    Codigo_Identificacion: '',
    Numero_Identificacion: '',
    Correo: '',
    Condicion_Venta: '01',
    Plazo_Credito: '0',
    Metodo_Pago: '01',
    Moneda: 'CRC',
    Tipo_Cambio: '',
    IVA: 0,
    Sub_Total: 0,
    Total: 0,
    Respuesta_MH: 'Registrado',
    Creado_El: '',
    Consecutivo: '',
    Notas: '',
    Error_MH: '',
    Clave_Numerica: '',
    Provincia: '',
    Canton: '',
    Distrito: '',
    Barrio: '',
    Direccion: '',
    Fecha: '',
    Telefono: '',
    Estado: '',
  };
  Detalle = {
    Codigo_Referencia: '',
    SKU:'',
    Codigo_Proveedor:'',
    Id_Empresa: 0,
    Descripcion: '',
    Descuento: 0,
    IVA: 0,
    IVAPorcentaje: 0,
    IndDescuento: '',
    Id_Factura_detalle: '',
    Id_Factura: 0,
    Unidad_Medida: '',
    Precio: 0,
    Id_Producto: '',
    Cantidad: 1,
    Estado: '',
    Sub_Total: 0,
    Total: 0,
    Tipo_Impuesto: '',
    Tipo_Codigo: '',
    Porcentaje_descuento:'',
    Detalle_Descuento : '',
    Precio_Sin_Descuento : ''
  };

  persona = {
    Id_Persona: '',
    Nombre: '',
    Telefono: '',
    Correo: '',
    Identificacion: '',
    Tipo_Identificacion: '',
    Condicion_Venta: '',
    Plazo_Credito: '',
    Metodo_Pago: '',
    Estado: '',
  };

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
    PrecioIva:'',
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

  Cia_ID = '';
  ngOnInit(): void {
    if(this.SeguridadStr == ""){
      this.SeguridadStr = "0.0.0.0.0.0.0.0";
    }
    this.Seguridad = this.SeguridadStr.split(".");
    this.interfazInventario = Boolean(this.Seguridad[2]);
    if(this.interfazInventario){
      this.Factura_Inventario = '1';
    }
    this.loadCategories();
    this.getCiaID();
    this.loadInvoices();
    this.obtenerTC();
    this.loadCaja();
    if (this.Regimen == '') {
      this.getRegimen();
    }
  }
  async getCiaID(){
    let data = await this.purchaseInvoiceService.getCiaID();
    this.Cia_ID = data['data'][0]['Numero_Identificacion'];
  }
  async loadUserType() {
    let data = await this.apiService.getUserType();
    if (data['data'][0]['Tipo_Usuario'] != '1') {
      //Determinar si la licencia esta activa.
      let licencia = await this.apiService.getLicence();
      if (licencia['data'][0]['Estado'] != '1') {
        return false;
      } else {
        //Validar Cantidad de documentos
        let cantidad = licencia['data'][0]['Cantidad_Disponible'];
        if (cantidad < 1) {
          return false;
        }
        //Validar Fecha.
        let fecha = new Date(licencia['data'][0]['Fecha_Vencimiento']);

        if (fecha < this.hoy) {
          return false;
        }
        return true;
      }
    }
    return true;
  }
  async loadCaja() {
    let data = await this.purchaseInvoiceService.loadCaja();
    this.Caja = data['data'][0]['Id_Caja'];
  }
  async getRegimen() {
    let data = await this.purchaseInvoiceService.getRegimen();
    this.Regimen = data['data'][0]['Regimen'];
  }
  async obtenerTC() {
    var fecha =
      this.hoy.getDate() +
      '/' +
      (this.hoy.getMonth() + 1) +
      '/' +
      this.hoy.getFullYear();
    this.tipoCambio = await this.apiService.getObtenerTC(fecha);
  }
  async loadInvoices(search?) {
    let data = await this.purchaseInvoiceService.loadInvoices(
      this.paginacion,
      search
    );
    if (data['total'] == 0) {
      this.Invoices = [];
    } else {
      this.Invoices = data['data'];
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
    if (event.key === 'Enter') {
      if(next == 'SKU' && this.Factura_Inventario == '2'){
        document.getElementById('Codigo_Referencia').focus();
      }else{
        document.getElementById(next).focus();
      }
    }
  }
  processProduct(next, stop?) {
    if(this.PantallaProductos == true){
      return false;
    }
    if (next === 'Descripcion') {
      if (this.Detalle.SKU === '') {
        //alert('Debe digitar El codigo');
        return false;
      }
      this.obtenerProducto(this.Detalle.SKU, 1);
    }
    if (next === 'Precio') {
      if (this.Detalle.Cantidad === 0) {
        Swal.fire('Debe digitar la cantidad');
        return false;
      }
    }
    if (next === 'SKU') {
      this.calcularTotales();
    }
    /*let element = document.getElementById(next);

    if (next == 'Codigo_Referencia') {
      element.focus();
    }*/
    if (stop) {
      return false;
    }
    return true;
  }
  calcularTotales() {
    this.Detalle.Sub_Total = this.Detalle.Cantidad * this.Detalle.Precio;
    this.Detalle.IVA = (this.Detalle.Sub_Total * this.Detalle.IVAPorcentaje) / 100;
    this.Detalle.Total = this.Detalle.Sub_Total + this.Detalle.IVA;
    if (this.Detalle.Total > 0) {
      this.Details.push(this.Detalle);
    }
    this.Invoice.Sub_Total = 0;
    this.Invoice.IVA = 0;
    this.Invoice.Total = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.Details.length; i++) {
      this.Invoice.Sub_Total = this.Invoice.Sub_Total + parseFloat(this.Details[i]['Sub_Total']);
      this.Invoice.IVA = this.Invoice.IVA + parseFloat(this.Details[i]['IVA']);
      this.Invoice.Total = this.Invoice.Sub_Total + this.Invoice.IVA;
    }
    this.initDetail();
  }

  async obtenerProducto(producto, tipo) {
    let data = await this.productService.loadProduct(producto);
    if (data['total'] === 0) {
      data = await this.productService.loadProductLike(producto);
    }
    if (data['total'] === 1) {
      if (tipo == 1) {
        //Hay un registro hay que cargarlo
        this.Detalle.Id_Producto = data['data'][0]['Id_Producto'];
        this.Detalle.Descripcion = data['data'][0]['Descripcion'];
        if(this.Detalle.Precio==0){
          this.Detalle.Precio = data['data'][0]['Ultimo_Costo'];
        }
        this.Detalle.Unidad_Medida = data['data'][0]['Unidad_Medida'];
        this.Detalle.IVAPorcentaje = data['data'][0]['Impuesto'];
        this.Detalle.Codigo_Referencia = data['data'][0]['Codigo'];
        this.Detalle.Tipo_Impuesto = data['data'][0]['Tipo_Impuesto'];
      } else {
        this.registros = data['data'];
      }
    } else {
      this.searchFieldProduct = producto;
      this.PantallaProductos = true;
      this.registros = data['data'];
    }
  }
  initDetail() {
    this.Detalle = {
      Codigo_Referencia: '',
      SKU:'',
      Codigo_Proveedor:'',
      Id_Empresa: 0,
      Descripcion: '',
      Descuento: 0,
      IVA: 0,
      IVAPorcentaje: 0,
      IndDescuento: '',
      Id_Factura_detalle: '',
      Id_Factura: 0,
      Unidad_Medida: '',
      Precio: 0,
      Id_Producto: '',
      Cantidad: 1,
      Estado: '',
      Sub_Total: 0,
      Total: 0,
      Tipo_Impuesto: '',
      Tipo_Codigo: '',
      Porcentaje_descuento:'',
      Detalle_Descuento : '',
      Precio_Sin_Descuento : ''
    };
  }
  keytab1(event) {
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search() {
    this.loadInvoices(this.searchField);
  }
  async editRecord(factura) {
    this.inputFileText = 'Escoger archivo XML';
    let licencia = await this.loadUserType();

    if (licencia != true) {
      Swal.fire('Su licencia esta inactiva, Contacte a Soporte Técnico');
      return false;
    }

    this.edit = true;
    window.scrollTo(0, 0);
    if (factura) {
      let data = await this.purchaseInvoiceService.loadInvoice(
        factura.Id_Factura
      );
      this.Invoice = data['data'][0];
      //Verificar si la factura esta siendo procesada por hacienda, disparar la consulta y regresar.
      if (this.Invoice.Respuesta_MH == 'procesando') {
        /*
        let data = this.apiService.recibirFacturaHacienda(
          this.Invoice.Id_Factura
        );*/
        this.search();
        this.cancel();
      }

      // Load Details
      let details = await this.purchaseInvoiceService.loadInvoiceDetails(
        factura.Id_Factura
      );
      if (details['total'] > 0) {
        this.Details = details['data'];
        //Recorrer los detalles para actualizar el Id del Producto de una manera Correcta
        //jbrenes

        for (let i = 0; i < this.Details.length; i++) {
          if(this.Details[i]['Id_Producto'] != this.Details[i]['Id_Prod']){
            this.Details[i]['Id_Producto'] = this.Details[i]['Id_Prod']
          }
        }

      } else {
        this.Details = [];
      }
    } else {
      this.Invoice = {
        Id_Factura: '',
        Tipo_Documento: '01',
        Id_Cliente: '',
        Nombre: '',
        Codigo_Identificacion: '',
        Numero_Identificacion: '',
        Correo: '',
        Condicion_Venta: '01',
        Plazo_Credito: '0',
        Metodo_Pago: '01',
        Moneda: 'CRC',
        Tipo_Cambio: '',
        IVA: 0,
        Sub_Total: 0,
        Total: 0,
        Respuesta_MH: 'Registrado',
        Creado_El: '',
        Consecutivo: '',
        Notas: '',
        Error_MH: '',
        Clave_Numerica: '',
        Provincia: '',
        Canton: '',
        Distrito: '',
        Barrio: '',
        Direccion: '',
        Fecha: '',
        Telefono: '',
        Estado: '',
      };
      this.initDetail();
      this.persona = {
        Id_Persona: '',
        Nombre: '',
        Telefono: '',
        Correo: '',
        Identificacion: '',
        Tipo_Identificacion: '01',
        Condicion_Venta: '01',
        Plazo_Credito: '0',
        Metodo_Pago: '01',
        Estado: '',
      };
      this.Details = [];
      this.Invoice.Tipo_Cambio = this.tipoCambio.venta;
    }
    return true;
  }
  async aplicarFactura() {
    this.PantallaLoading = true;
    //Verificar Si no existe Caja, y cargarla
    //jbrenes
    this.Invoice.Creado_El =
      this.hoy.getDate() +
      '/' +
      (this.hoy.getMonth() + 1) +
      '/' +
      this.hoy.getFullYear();
    if (this.Invoice.Tipo_Documento === '01') {
      if (this.Invoice.Numero_Identificacion === '') {
        Swal.fire('No a seleccionado un cliente');
        this.cancel();
        return false;
      }
    }
    if (this.Details.length === 0) {
      Swal.fire('No a seleccionado Articulos');
      this.cancel();
      return false;
    }

    //Verificar si el cliente existe
    if (this.clienteExiste === false) {
      let data = await this.purchaseInvoiceService.insertClient(this.Invoice);
      this.clienteExiste = true;
      this.Invoice.Id_Cliente = data['data'][0]['Identity'];
    }
    //Validar que todos los registros tengan un Producto asociado
    let continuar = true;
    for (let i = 0; i < this.Details.length; i++) {
      if (!this.Details[i].Id_Producto) {
        Swal.fire(this.Details[i]['Descripcion'] + ' No se Cargo Correctamente, No se Puede grabar' )
        continuar =false;
      }else{
        if(this.Details[i]['Precio_Sin_Descuento'] == ''){
          this.Details[i]['Precio_Sin_Descuento'] = this.Details[i]['Precio'];
        }
      }
    }
    if(continuar == false){
      return false;
    }

    // tslint:disable-next-line: align
    if (this.Invoice.Id_Factura == '') {
      //factura nueva, grabar encabezado y detalle
      //Grabar encabezado de la factura

      let data = await this.purchaseInvoiceService.insertHeader(
        this.Invoice,
        this.Caja
      );
      this.Invoice.Id_Factura = data['data'][0]['Identity'];

      this.SKU_OK = true;
      for (let i = 0; i < this.Details.length; i++) {
        this.grabarUnDetalleFactura(i);
      }
      if(this.Factura_Inventario == '2'){
        this.SKU_OK = true;
      }
      if(this.SKU_OK){
        this.aplicarFacturaHacienda();
      }else{
        Swal.fire('Hay Artículos sin SKU');
        this.PantallaLoading = false;
        return false;
      }
    } else {
      //actualizar los detalles de la factura
      let data = await this.purchaseInvoiceService.updateHeader(
        this.Invoice,
        this.Caja
      );
      //let del = await this.purchaseInvoiceService.deleteDetails(this.Invoice.Id_Factura);
      this.SKU_OK = true;
      let ListaDetalles = ''
      this.PantallaLoading = true;
      for (let i = 0; i < this.Details.length; i++) {
        if(String(this.Details[i]['Id_Factura_detalle']) == ""){
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
      await this.eliminarDetalles(ListaDetalles);
      if(this.Factura_Inventario == '2'){
        this.SKU_OK = true;
      }
      if(this.SKU_OK){
        this.aplicarFacturaHacienda();
      }else{
        Swal.fire('Hay Artículos sin SKU');
        this.PantallaLoading = false;
        return false;
      }

    }
    return true;
  }
  async eliminarDetalles(lista){
    let del = await this.purchaseInvoiceService.deleteDetails(this.Invoice.Id_Factura,lista);
  }
  async modificarUnDetalleFactura(i){
    if (!this.Details[i].Id_Producto) {
      return false;
    }
    let data = await this.purchaseInvoiceService.updateDetail(this.Details[i]);
    return true;
  }
  async grabarUnDetalleFactura(i) {
    if (!this.Details[i].Id_Producto) {
      return false;
    }
    if(this.Details[i].SKU == ''){
      this.SKU_OK = false;
    }
    let Codigo = 1;
    if(this.Factura_Inventario == '1'){
      Codigo = 1;
    }else{
      Codigo = 2;
    }
    return await this.purchaseInvoiceService.insertDetail(this.Details[i],this.Invoice.Id_Factura,Codigo);
  }

  async aplicarFacturaHacienda() {
    this.PantallaLoading = false;
    Swal.fire({
      title: 'Desea Aplicar la Factura?',
      text: 'Si aplica la factura no le podra realizar ninún cambio!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Aplicar la Factura!',
    }).then((result) => {
      this.PantallaLoading = true;
      if (result.value) {
        if (this.Regimen !== '3') {
          //let data = this.apiService.aplicarFacturaHacienda(this.Invoice.Id_Factura);
          //this.AplicandoFacturaHacienda(this.Invoice.Id_Factura);
        }
        //'EXEC sp_Com_Aplicar_Factura @p_Id_Factura = ' +
       //     this.Invoice.Id_Factura
        this.apiService.postRecord(
          'call sp_Com_Aplicar_Factura('+this.Invoice.Id_Factura+')'
        );
        this.search();
        this.cancel();
      } else {
        this.search();
        this.cancel();
      }
    });
  }
  async AplicandoFacturaHacienda(Id_Factura) {
    let data = await this.apiService.recibirFacturaHacienda(
      this.Invoice.Id_Factura
    );
    if (data['respuesta'] == 'procesando') {
      this.AplicandoFacturaHacienda(Id_Factura);
    } else {
      if (data['respuesta'] == 'rechazado') {
        Swal.fire('Factura Rechazada por Hacienda, Comunicate con Soporte');
      }
      if (data['respuesta'] == 'aceptado') {
        Swal.fire('Factura Aplicada');
      }
      this.search();
      this.cancel();
    }
  }
  cancel() {
    this.edit = false;
    this.PantallaLoading = false;
    window.scrollTo(0, 0);
  }
  enterValidation(event) {
    if (event.key === 'Enter') {
      this.IdValidation();
    }
  }
  async IdValidation() {
    //if (event.key === 'Enter') {
    //validar si la cedula existe en la base de datos.
    let data = await this.purchaseInvoiceService.validClient(
      this.Invoice.Numero_Identificacion
    );
    if (data['total'] === 0) {
      this.clienteExiste = false;
      //El Cliente no existe en la base de datos. hay que consultar hacienda para ver si es un usuario registrado de hacienda.
      let persona = await this.purchaseInvoiceService.getApiHacienda(
        this.Invoice.Numero_Identificacion
      );
      this.persona.Nombre = persona.nombre;
      this.persona.Tipo_Identificacion = persona.tipoIdentificacion;
      this.Invoice.Nombre = this.persona.Nombre;
      this.Invoice.Codigo_Identificacion = this.persona.Tipo_Identificacion;
      this.Invoice.Condicion_Venta = '01';
      this.Invoice.Metodo_Pago = '01';
      this.Invoice.Plazo_Credito = '0';
    } else {
      //Cliente si existe, cargar el registro.
      this.clienteExiste = true;
      this.persona = data['data'][0];
      this.Invoice.Id_Cliente = this.persona.Id_Persona;
      this.Invoice.Numero_Identificacion = this.persona.Identificacion;
      this.Invoice.Nombre = this.persona.Nombre;
      this.Invoice.Codigo_Identificacion = this.persona.Tipo_Identificacion;
      this.Invoice.Correo = this.persona.Correo;
      this.Invoice.Condicion_Venta = this.persona.Condicion_Venta;
      this.Invoice.Plazo_Credito = this.persona.Plazo_Credito;
      this.Invoice.Metodo_Pago = this.persona.Metodo_Pago;
      if (this.Invoice.Condicion_Venta === '') {
        this.Invoice.Condicion_Venta = '01';
      }
      if (this.Invoice.Plazo_Credito === '') {
        this.Invoice.Plazo_Credito = '0';
      }
      if (this.Invoice.Metodo_Pago === '') {
        this.Invoice.Metodo_Pago = '01';
      }
      if (this.Invoice.Codigo_Identificacion == '') {
        this.Invoice.Codigo_Identificacion = '01';
      }
    }
    let elemento = document.getElementById('Correo');
    elemento.focus();
    //}
  }
  closeModal() {
    this.PantallaProductos = false;
  }
  Seleccionar(producto) {
    this.Detalle.SKU = producto.SKU;
    this.Detalle.Id_Producto = producto.Id_Producto;
    this.Detalle.Descripcion = producto.Descripcion;
    //this.Detalle.Precio = producto.Precio;
    this.Detalle.Unidad_Medida = producto.Unidad_Medida;
    this.Detalle.IVAPorcentaje = producto.Impuesto;
    this.Detalle.Codigo_Referencia = producto.Codigo;

    this.PantallaProductos = false;
    document.getElementById('Descripcion').focus();
    //element.focus();
  }
  editVen_Factura_Detalle(index) {
    this.Detalle = this.Details[index];
    this.Details.splice(index, 1);
    if(this.Factura_Inventario == '1'){
      document.getElementById('SKU').focus();
    }else{
      document.getElementById('Codigo_Referencia').focus();
    }

  }
  removeVen_Factura_Detalle(index: number) {
    this.Details.splice(index, 1);
    this.calcularTotales();
  }
  imprimirFactura() {
    let Id_Empresa = localStorage.getItem('Id_Empresa');
    if (this.Invoice.Tipo_Documento == '01') {
      window.open(
        'https://toxo.work/public/' +
          Id_Empresa +
          '/Comprobantes-FE/PDF-FE/' +
          this.Invoice.Consecutivo +
          '.pdf'
      );
      window.open(
        'https://toxo.work/public/' +
          Id_Empresa +
          '/Comprobantes-FE/XML-DGT/' +
          this.Invoice.Consecutivo +
          '-DGT.xml'
      );
      window.open(
        'https://toxo.work/public/' +
          Id_Empresa +
          '/Comprobantes-FE/XML-Firmado/' +
          this.Invoice.Consecutivo +
          '.xml'
      );
    }
    if (this.Invoice.Tipo_Documento == '02') {
      window.open(
        'https://toxo.work/public/' +
          Id_Empresa +
          '/Comprobantes-ND/PDF-ND/' +
          this.Invoice.Consecutivo +
          '.pdf'
      );
    }
    if (this.Invoice.Tipo_Documento == '03') {
      window.open(
        'https://toxo.work/public/' +
          Id_Empresa +
          '/Comprobantes-NC/PDF-NC/' +
          this.Invoice.Consecutivo +
          '.pdf'
      );
      window.open(
        'https://toxo.work/public/' +
          Id_Empresa +
          '/Comprobantes-NC/XML-DGT/' +
          this.Invoice.Consecutivo +
          '-DGT.xml'
      );
      window.open(
        'https://toxo.work/public/' +
          Id_Empresa +
          '/Comprobantes-NC/XML-Firmado/' +
          this.Invoice.Consecutivo +
          '.xml'
      );
    }
    if (this.Invoice.Tipo_Documento == '04') {
      window.open(
        'https://toxo.work/public/' +
          Id_Empresa +
          '/Comprobantes-TE/PDF-TE/' +
          this.Invoice.Consecutivo +
          '.pdf'
      );
      window.open(
        'https://toxo.work/public/' +
          Id_Empresa +
          '/Comprobantes-TE/XML-DGT/' +
          this.Invoice.Consecutivo +
          '-DGT.xml'
      );
      window.open(
        'https://toxo.work/public/' +
          Id_Empresa +
          '/Comprobantes-TE/XML-Firmado/' +
          this.Invoice.Consecutivo +
          '.xml'
      );
    }
  }
  async AnularFactura() {
    //Duplicar ecabezado de factura como si fuera nota de Credito
    let sql =
      "Insert into ven_factura (Id_Empresa,Id_Caja,Id_Cliente,Tipo_Documento,Consecutivo,Nombre,Codigo_Identificacion,Numero_Identificacion,Correo,Condicion_Venta,Plazo_Credito,Metodo_Pago,Moneda,Tipo_Cambio,Descuento,IVA,Sub_Total,Total,Clave_Numerica,Respuesta_MH,Sistema_Origen,Registro_Origen,Creado_El) select Id_Empresa,Id_Caja,Id_Cliente,'03',Consecutivo,Nombre,Codigo_Identificacion,Numero_Identificacion,Correo,Condicion_Venta,Plazo_Credito,Metodo_Pago,Moneda,Tipo_Cambio,Descuento,IVA,Sub_Total,Total,Clave_Numerica,'Registrado','VE'," +
      this.Invoice.Id_Factura +
      ',[Creado_El] from Ven_Factura where Id_Factura =' +
      this.Invoice.Id_Factura +
      ";";
    let dataEncabezado = await this.apiService.postRecord(sql);
    let Identity = dataEncabezado['data']['0']['IDENTITY'];
    //Obtener todos los detalles de la factura;
    let sqlDetalles =
      'Select Id_Factura_detalle,Id_Empresa,Id_Factura,Id_Producto,Tipo_Codigo,Codigo_Referencia,Descripcion,Unidad_Medida,Cantidad,Precio,Descuento,Detalle_Descuento,Tasa,IVA,Sub_Total,Total from Ven_Factura_Detalle where Id_Factura = ' +
      this.Invoice.Id_Factura;
    let detalles = await this.apiService.postRecord(sqlDetalles);
    for (let detalle of detalles['data']) {
      let sqlDetail =
        "Insert into Ven_Factura_Detalle ( Id_Empresa,Id_Factura,Id_Producto,Tipo_Codigo,Codigo_Referencia,Descripcion,Unidad_Medida,Cantidad,Precio,Descuento,Detalle_Descuento,Tasa,IVA,Sub_Total,Total,Creado_El,Creado_Por) values ( '";
      sqlDetail = sqlDetail + detalle['Id_Empresa'] + "','";
      sqlDetail = sqlDetail + Identity + "','";
      sqlDetail = sqlDetail + detalle['Id_Producto'] + "','";
      sqlDetail = sqlDetail + detalle['Tipo_Codigo'] + "','";
      sqlDetail = sqlDetail + detalle['Codigo_Referencia'] + "','";
      sqlDetail = sqlDetail + detalle['Descripcion'] + "','";
      sqlDetail = sqlDetail + detalle['Unidad_Medida'] + "','";
      sqlDetail = sqlDetail + detalle['Cantidad'] + "','";
      sqlDetail = sqlDetail + detalle['Precio'] + "',";
      sqlDetail = sqlDetail + detalle['Descuento'] + ",'";
      sqlDetail = sqlDetail + detalle['Detalle_Descuento'] + "','";
      sqlDetail = sqlDetail + detalle['Tasa'] + "','";
      sqlDetail = sqlDetail + detalle['IVA'] + "','";
      sqlDetail = sqlDetail + detalle['Sub_Total'] + "','";
      sqlDetail = sqlDetail + detalle['Total'] + "',";
      sqlDetail = sqlDetail + "NOW(),'";
      sqlDetail = sqlDetail + localStorage.getItem('Nombre_Usuario') + "')";
      sqlDetail = sqlDetail.replace(',,', ',NULL,');
      let detall = await this.apiService.postRecord(sqlDetail);
    }
    this.search();
    this.cancel();
  }
  LoadFile(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    if (this.fileData.type != 'text/xml') {
      Swal.fire(
        'El archivo seleccionado no tiene formato XML' + this.fileData.type
      );
      return false;
    }
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.contenidoArchivo = fileReader.result.toString();
      const parser = new DOMParser();
      const xml = parser.parseFromString(this.contenidoArchivo, 'text/xml');
      this.FactuaCompraCargada = this.ngxXml2jsonService.xmlToJson(xml);

      this.cargarFactuaDeCompra(xml.firstChild.nodeName);
    };
    fileReader.readAsText(this.fileData);
    fileInput.target.value = '';
    return true;
  }
  async cargarFactuaDeCompra(tipo) {
    this.PantallaLoading = true;
    if(tipo == 'FacturaElectronica'){
      this.Invoice.Tipo_Documento = '01';
      var FactuaElectronica = this.FactuaCompraCargada['FacturaElectronica'];
    }
    if(tipo == 'NotaCreditoElectronica'){
      this.Invoice.Tipo_Documento = '03';
      var FactuaElectronica = this.FactuaCompraCargada['NotaCreditoElectronica'];
    }
    if(tipo == 'NotaDebitoElectronica'){
      this.Invoice.Tipo_Documento = '02';
      var FactuaElectronica = this.FactuaCompraCargada['NotaDebitoElectronica'];
    }
    if(tipo == 'TiqueteElectronico'){
      this.Invoice.Tipo_Documento = '04';
      var FactuaElectronica = this.FactuaCompraCargada['TiqueteElectronico'];
    }

    if (
      FactuaElectronica['Receptor']['Identificacion']['Numero'].trim() !=
      this.Cia_ID.trim()
    ) {

      //swal.fire('El archivo seleccionado no Pertenecer a la empresa, Seleccione Otro');
      this.PantallaLoading = false;
      Swal.fire({
        title: 'El archivo seleccionado no es correcto',
        text:
          'El archivo pertenece a ' +
          FactuaElectronica['Receptor']['Nombre'] +
          ' Cédula ' +
          FactuaElectronica['Receptor']['Identificacion']['Numero'] +
          ' No a ' +
          localStorage.getItem('Nombre'),
      });
      //this.PantallaLoading = false;
      return false;
    }
    //Validar si la factura ya existe en la base de datos
    let FacturaExiste = await this.purchaseInvoiceService.getInvoiceNumber(FactuaElectronica['Clave'],FactuaElectronica['Emisor']['Identificacion']['Numero']);
    if(FacturaExiste['total'] > 0 ){
      this.Invoice.Id_Factura = FacturaExiste['data'][0]['Id_Factura'];
      Swal.fire({
        title: 'El archivo seleccionado no es correcto',
        text:
          'El archivo ya fue Importado ' +
          FactuaElectronica['Emisor']['Nombre'] +
          ' Cédula ' +
          FactuaElectronica['Emisor']['Identificacion']['Numero'] +
          ' No a ' + FactuaElectronica['Clave'] + " ID #" +
          FacturaExiste['data'][0]['Id_Factura'],
      });
      this.PantallaLoading = false;
      //return false;
    }

    this.inputFileText = FactuaElectronica['NumeroConsecutivo'];
    this.Invoice.Clave_Numerica = FactuaElectronica['Clave'];

    this.Invoice.Consecutivo = FactuaElectronica['NumeroConsecutivo'];

    let fechaArr = FactuaElectronica['FechaEmision'].split('T');
    this.Invoice.Fecha = fechaArr[0];
    this.Invoice.Numero_Identificacion =
      FactuaElectronica['Emisor']['Identificacion']['Numero'];
    this.enterValidation({ key: 'Enter' });
    this.Invoice.Codigo_Identificacion =
      FactuaElectronica['Emisor']['Identificacion']['Tipo'];
    this.Invoice.Nombre = FactuaElectronica['Emisor']['Nombre'];
    this.Invoice.Correo = FactuaElectronica['Emisor']['CorreoElectronico'];
    if (FactuaElectronica['Emisor']['Telefono']) {
      this.Invoice.Telefono =
        FactuaElectronica['Emisor']['Telefono']['CodigoPais'] +
        ' ' +
        FactuaElectronica['Emisor']['Telefono']['NumTelefono'];
    } else {
      this.Invoice.Telefono = 'NULL';
    }
    this.Invoice.Provincia =
      FactuaElectronica['Emisor']['Ubicacion']['Provincia'];
    this.Invoice.Canton = FactuaElectronica['Emisor']['Ubicacion']['Canton'];
    this.Invoice.Distrito =
      FactuaElectronica['Emisor']['Ubicacion']['Distrito'];
    this.Invoice.Barrio = FactuaElectronica['Emisor']['Ubicacion']['Barrio'];
    this.Invoice.Direccion =
      FactuaElectronica['Emisor']['Ubicacion']['OtrasSenas'];

    this.Invoice.Condicion_Venta = FactuaElectronica['CondicionVenta'];
    this.Invoice.Plazo_Credito = FactuaElectronica['PlazoCredito'];
    if (!this.Invoice.Plazo_Credito) {
      this.Invoice.Plazo_Credito = '0';
    }
    this.Invoice.Metodo_Pago = FactuaElectronica['MedioPago'];
    if (FactuaElectronica['ResumenFactura']['CodigoTipoMoneda']) {
      this.Invoice.Tipo_Cambio =
        FactuaElectronica['ResumenFactura']['CodigoTipoMoneda']['TipoCambio'];
      this.Invoice.Moneda =
        FactuaElectronica['ResumenFactura']['CodigoTipoMoneda']['CodigoMoneda'];
    } else {
      this.Invoice.Tipo_Cambio = 'NULL';
      this.Invoice.Moneda = 'NULL';
    }

    this.Invoice.Sub_Total = FactuaElectronica['ResumenFactura']['TotalVenta'];
    this.Invoice.Total =
      FactuaElectronica['ResumenFactura']['TotalComprobante'];
    this.Invoice.IVA = FactuaElectronica['ResumenFactura']['TotalImpuesto'];
    if (!this.Invoice.IVA) {
      this.Invoice.IVA = 0;
    }
    this.Invoice.Estado = '0';
    this.PantallaLoading =true;
    if (FactuaElectronica['DetalleServicio']['LineaDetalle'].length) {
      
      for (let i = 0;i < FactuaElectronica['DetalleServicio']['LineaDetalle'].length;i++) {
      
        await this.procesarDetalle(FactuaElectronica['DetalleServicio']['LineaDetalle'][i]);
      }
    } else {
      await this.procesarDetalle(FactuaElectronica['DetalleServicio']['LineaDetalle']);
    }
    eval('document.getElementById("customFile").value = ""');
    this.PantallaLoading = false;
    return true;
  }
  async procesarDetalle(Detalle) {
    let Porcentaje_Descuento = 0;
    this.initDetail();
    this.Detalle.Codigo_Referencia = Detalle['Codigo'];
    if (typeof Detalle['CodigoComercial'] === 'undefined') {
      this.Detalle.Id_Producto = '01';
      this.Detalle.Tipo_Codigo = '01';
      this.Detalle.Codigo_Proveedor  ='';
    } else {
      //this.Detalle.Id_Producto = Detalle['CodigoComercial']['Codigo'];
      if(Detalle['CodigoComercial'].length > 1){
        this.Detalle.Id_Producto = '01';
        this.Detalle.Codigo_Proveedor = Detalle['CodigoComercial'][0]['Codigo'];
        this.Detalle.Tipo_Codigo = Detalle['CodigoComercial'][0]['Tipo'];
      }else{
        this.Detalle.Id_Producto = '01';
        this.Detalle.Codigo_Proveedor = Detalle['CodigoComercial']['Codigo'];
        this.Detalle.Tipo_Codigo = Detalle['CodigoComercial']['Tipo'];
      }

    }
    this.Detalle.Descripcion = Detalle['Detalle'];
    // Buscar el codigo SKU para la descripción en el sistema de inventario

    let SKU = await this.productService.loadSKU(Detalle['Detalle']);
    if (SKU['total'] > 0) {
      this.Detalle.SKU = SKU['data'][0]['SKU'];
      this.Detalle.Id_Producto = SKU['data'][0]['Id_Producto'];
    }else{
      //Buscar el codigo del proveedor por si no coincide la descripción.
      if(Detalle['CodigoComercial']){
        let Codigo_Proveedor = await this.productService.loadCodigoProveedor(Detalle['CodigoComercial']['Codigo']);
        if (Codigo_Proveedor['total'] > 0) {
          this.Detalle.SKU = Codigo_Proveedor['data'][0]['SKU'];
          this.Detalle.Id_Producto = Codigo_Proveedor['data'][0]['Id_Producto'];
        }
      }
    }
    this.Detalle.Unidad_Medida = Detalle['UnidadMedida'];
    this.Detalle.Cantidad = Detalle['Cantidad'];
    this.Detalle.Precio = Detalle['PrecioUnitario'];
    //Determinar si Existe Descuento
    if(Detalle['Descuento']){
      this.Detalle.Descuento = Detalle['Descuento']['MontoDescuento'];
      this.Detalle.Detalle_Descuento = Detalle['Descuento']['NaturalezaDescuento'];
      this.Detalle.Precio_Sin_Descuento = Detalle['PrecioUnitario'];
      Porcentaje_Descuento = this.Detalle.Descuento / parseFloat(this.Detalle.Precio_Sin_Descuento);
      this.Detalle.Precio = parseFloat(Detalle['SubTotal']) / parseFloat(Detalle['Cantidad']);
    }else{
      this.Detalle.Precio_Sin_Descuento = Detalle['PrecioUnitario'];
    }
    if (Detalle['Impuesto']) {
      this.Detalle.IVA = Detalle['Impuesto']['Monto'];
      this.Detalle.IVAPorcentaje = Detalle['Impuesto']['Tarifa'];
    } else {
      this.Detalle.IVA = 0;
      this.Detalle.IVAPorcentaje = 0;
    }
    this.Detalle.Sub_Total = Detalle['SubTotal'];
    this.Detalle.Total = Detalle['MontoTotal'];
    this.Details.push(this.Detalle);
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
  }
  async loadCategories(search?:any){
    let data = await this.categoryService.loadCategories(this.paginacion,search);
    if(data['total'] == 0){
      this.Categories = [];
    }else{
      this.Categories = data['data'];
      if(this.Articulo.Categoria == ""){
        this.Articulo.Categoria = data['data'][0]['Id_Categoria'];
      }
    }
  }
  closePantallaArticuloNuevo(){
    this.PantallaArticuloNuevo = false;
  }
  Nuevo_Articulo(Articulo,indice){
    //this.Articulo.
    this.indice_Articulo_Nuevo = indice;
    this.Articulo.Codigo_Proveedor = Articulo.Codigo_Proveedor;
    this.Articulo.Codigo = Articulo.Codigo_Referencia;
    this.Articulo.Descripcion = Articulo.Descripcion;
    this.Articulo.Unidad_Medida = Articulo.Unidad_Medida;
    this.PantallaArticuloNuevo = true;
  }
  async grabarArticulo(){
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
    let data = await this.productService.saveArticle(this.Articulo);
    if(data['success'] =='true'){
      this.Details[this.indice_Articulo_Nuevo].SKU = this.Articulo.SKU
      Swal.fire('Artículo grabado correctamente');
      this.closePantallaArticuloNuevo();
    }
    return true;
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
}