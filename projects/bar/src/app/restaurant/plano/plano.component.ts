import { Component, OnInit } from '@angular/core';
import { PlanoService } from './plano.service';
import { RestaurantOrderService } from '../restaurant-order/restaurant-order.service';
import { RestaurantInvoiceService } from '../restaurant-invoice/restaurant-invoice.service';
import { RestaurantZoneService } from '../restaurant-zone/restaurant-zone.service';
import { RestaurantPlaceService } from '../restaurant-place/restaurant-place.service';
import { CategoryService } from '../../../../../inventario/src/app/inventory/category/category.service';
import { SubCategoryService } from '../../../../../inventario/src/app/inventory/sub-category/sub-category.service';
import { ProductService } from '../../../../../inventario/src/app/inventory/product/product.service';
import { InvoiceService } from '../../../../../factura/src/app/sales/invoice/invoice.service';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import { CashierService } from '../../../../../caja/src/app/caja/cashier/cashier.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-plano',
  templateUrl: './plano.component.html',
  styleUrls: ['./plano.component.css']
})
export class PlanoComponent implements OnInit {

  constructor(private planoService:PlanoService,
    private restaurantOrderService:RestaurantOrderService,
    private restaurantInvoiceService:RestaurantInvoiceService,
    private restaurantZoneService:RestaurantZoneService,
    private restaurantPlaceService:RestaurantPlaceService,
    private categoryService:CategoryService,
    private subCategoryService:SubCategoryService,
    private productService:ProductService,
    private invoiceService:InvoiceService,
    private apiService:ApiService,
    private cashierService:CashierService

    ) { }
  RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  plano = true;
  Id_Zona = '99';
  Id_Categoria = '';
  Id_Sub_Categoria = '';
  Id_Articulo = '';
  NombreSalonero = localStorage.getItem('Nombre_Usuario');
  hoy = new Date();
  cobro2=false;
  cobro3=false;
  PantallaPlano = true;
  PantallaLista = false;
  PantallaCuentas = false;
  PantallaLoading = false;
  PantallaLogin = false;
  PantallaPedidosAbiertos = false;
  PantallaZona = false;
  ResZonas = true;
  PantallaCrearCuenta = false;
  PantallaInfoCuenta = false;
  PantallaCambiarMesa1 = false;
  PantallaCambiarMesa = false;
  PantallaPedirClave = false;
  PantallaEditarPrecio = false;
  PantallaProductos = false;
  PantallaFacturar = false;
  PantallaOpciones = false;
  PantallaAdicionales = false;
  validandoId = false;
  clienteExiste = false;
  facturando = false;
  Facturada = false;
  PedidoSeleccionado = false;
  comandaNegativa = false;

  ImpresoraFacturacion = "BlueTooth Printer";
  ImpresoraCocina = "BlueTooth Printer";
  ImgSrc = "https://toxo.work/img/"+localStorage.getItem("Id_Empresa")+"/"
  MensajeLoading = "";
  MultiUsuairo = 0;
  OrderTotal = 0;
  TotalGeneral = 0;
  MesaAnterior = '0';
  PeididoAnterior = '0'
  Total = 0
  Iva = 0;
  SubTotal = 0;
  Regimen = '';
  TotalOrdenActual = 0;
  TotalOrdenNueva = 0;
 
  NombreEmpresa = '';
  CodigoSalonero ='';
  ClaveSupervisor = '';
  Caja = '';
  Precio = '';
  IVA = '';
  TotalLinea = '';
  buscarProducto = '';

  Places = [];
  Pedidos = [];
  OrderProducts = [];
  Zonas = [];
  Mesas = [];
  MesasZona = [];
  Categorias = [];
  SubCategorias = [];
  Productos = [];
  Componentes = [];
  Adicionales = [];
  ProductosOrdenActual = [];
  ProductosOrdenNueva = [];

  Mesa = {
    Id_Mesa:'',
    Id_Zona:'',
    Nombre:'',
    Estado:'',
    Zona:'',
    Arriba:'',
    Derecha:'',
    Servicio:''
  }
  Pedido = {
    Id_Pedido:'',
    Id_Mesa:'',
    Id_Zona:'',
    Id_Caja:'',
    Nombre:'',
    Estado:'',
    Numero:'',
    Metodo_Pago:'99',
    Metodo_Pago1:'',
    Metodo_Pago2:'',
    Monto_Pagado:0,
    Monto_Pagado2:0,
    Monto_Pagado3:0,
    Referencia:'',
    Referencia2:'',
    Referencia3:'',
    Saldo:'',
    Saldo2:'',
    Saldo3:'',
    Total:0,
    IVA:0,
    Servicio:'',
    Monto_Servicio:0,
    Id_Nueva_Zona:'',
    Id_Nueva_Mesa:'',
    Id_Nuevo_Pedido:'-99',
    Pedido_Alterado:false,
    TotalCobrar:0
  }

  Articulo = {
    Id_Pedido_Detalle: "",
    Id_Producto: "",
    Cantidad:"0",
    Cocina:"0",
    Cuenta:"",
    Descripcion:"",
    Estado: "",
    Impuesto:"13.00000",
    Notas: "",
    Precio: "",
    Total: "",
    Indice: ''
  }

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  factura = {
    Tipo_Documento:'04',
    Numero_Identificacion:'',
    Nombre:'',
    Codigo_Identificacion:'',
    Metodo_Pago:'99',
    Correo:'',
    MontoCobrado:0,
    Condicion_Venta:'01',
    Plazo_Credito:'',
    Id_Cliente:'',
    Moneda:'CRC'
  }
  persona = {
    Id_Persona: "",
    Nombre: "",
    Telefono: "",
    Correo: "",
    Identificacion: "",
    Tipo_Identificacion: "",
    Condicion_Venta: "01",
    Plazo_Credito: "",
    Metodo_Pago: "",
    Estado: "",
    Moneda:'',
    Total:'',
    IVA:''
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
    Tipo_Codigo:'',
    SKU:'',
    Nueva_Cantidad:''
  }
  tipoCambio = {
    compra: "",
    venta: "",
    fecha: "",
  };
  Exoneracion = {
    Exonerada : 0,
    Exo_Numero_Documento : '',
    Exo_Nombre_Institucion : '',
    Exo_Fecha_Emision : '',
    Exo_Porcentaje : '0',
    Exo_Monto : '0'
  }
  log = {
    Usuario:'',
    Accion:'',
    Cantidad:'',
    Id_Pedido:'',
    Id_Pedido_Detalle:'',
    Id_Producto:''
  }
  ngOnInit(): void {
    this.apiService.postScript('https://toxo.work/core/php/hacienda2/consultar_hacienda.php',1);
    //this.LoadParametroCompania();
    if(window.innerWidth < 800){
      this.PantallaLista = true;
      this.PantallaPlano = false;
    }
    this.obtenerImpresoraFacturacion();
    this.obtenerImpresoraCocina();
    if(this.Regimen == ""){
      this.getRegimen();
    }
    this.obtenerTC();
    this.loadCaja();
    this.leerMultioUsuairo();
    this.loadPlaces();
    this.LeerZonas();
    this.loadCategories();
    this.log.Usuario = this.NombreSalonero;
  }
  async obtenerImpresoraFacturacion(){
    let data = await this.planoService.LoadInvoicePrinter();
    if(data['total'] == 1){
      this.ImpresoraFacturacion = data['data'][0]['Valor'];
    }
  }
  async obtenerImpresoraCocina(){
    let data = await this.planoService.LoadKitchenPrinter();
    if(data['total'] == 1){
      this.ImpresoraCocina = data['data'][0]['Valor'];
    }
    
  }
  async getRegimen(){
    let data = await this.invoiceService.getRegimen();
    this.Regimen = data['data'][0]['Regimen'];
  }
  async obtenerTC() {
    var fecha =
      this.hoy.getDate() +
      "/" +
      (this.hoy.getMonth() + 1) +
      "/" +
      this.hoy.getFullYear();
    this.tipoCambio = await this.apiService.getObtenerTC(fecha);
    //this.tipoCambio = tc[1];
    //console.log(this.tipoCambio);
  }
  async loadCaja(){
    this.Caja = localStorage.getItem("Id_Caja");
    //Validar si el cierre de Caja pertenece al dia en cuestion.
    // jaime
    let Id_Caja_Diaria = localStorage.getItem('Id_Caja_Diaria');
    let Data = await this.cashierService.LeerCajaDiaria(Id_Caja_Diaria);
    let Fecha_Caja_Diaria = Data['data'][0]['Creado_El'];

    // 1. Convierte tu cadena de fecha y hora en un objeto Date
    const fecha = new Date(Fecha_Caja_Diaria.replace(' ', 'T'));

    // 2. Obtén la fecha de hoy a las 6 de la mañana
    const hoy = new Date();
    hoy.setHours(6, 0, 0, 0); // Establece las 6:00 AM de hoy

    // 3. Compara ambas fechas
    if (fecha < hoy) {
      Swal.fire('No se ha realizado el cierre de caja de ayer, esto ocuacionara problemas en los informes');
      return false;
    } else {
      return true;
    }
  }
  async leerMultioUsuairo(){
    let data = await this.restaurantOrderService.LoadParameMultiUser();
    this.MultiUsuairo = data['data'][0]['Valor']
    if(this.MultiUsuairo != 1){
      this.MultiUsuairo = 0;
      this.PantallaPedidosAbiertos = true;
      this.NombreSalonero = localStorage.getItem("Nombre_Usuario")
      this.PantallaZona = false;
      this.PantallaLogin = false;
      this.log.Usuario = this.NombreSalonero;
    }else{
      this.PantallaLogin = true;
      this.PantallaZona = false;
    }
  }
  async loadPlaces(search?:any){
    this.NombreEmpresa = localStorage.getItem('Empresa');
    let data = await this.planoService.loadPlaces(this.Id_Zona);
    if(data['total'] == 0){
      this.Places = [];
    }else{
      this.Places = data['data'];
    }
  }
  /* Eventos de Pantalla de Login */
  Concat(Numero){
    this.CodigoSalonero = this.CodigoSalonero.concat(Numero);
  }
  borrar(){
    this.CodigoSalonero = this.CodigoSalonero.slice(0, -1)
  }
  async seleccionSalonero(){
    //Buscar usuario con codigo de salonero
    let data = await this.restaurantOrderService.LoadSalonero(this.CodigoSalonero);
    if(data['total'] == 0){
      Swal.fire('Código No existe');
      return false
    }else{
      localStorage.setItem('Id_Usuario',data['data'][0]['Id_Usuario']);
      localStorage.setItem('Nombre_Usuario',data['data'][0]['Nombre_Usuario']);
      this.NombreSalonero = data['data'][0]['Nombre_Usuario'];
      this.log.Usuario = this.NombreSalonero;
      this.loadOrders(1);
      this.PantallaLogin = false;
      this.PantallaPedidosAbiertos = true;
    }
    return true;
  }
  /* Fin Eventos de Pantalla de Login */

  async loadOrders(Estado){
    let data = await this.restaurantInvoiceService.loadOrders(this.ResZonas,Estado);
    if(data['total'] == 0){
      this.Pedidos = [];
    }else{
      this.Pedidos = data['data'];
    }
  }

  /* Eventos de Pantalla Cuentas */
  async MostrarPantallaCuentas(Mesa){
    if (!navigator.onLine) {
      Swal.fire('No hay Internet, Revise la conexion');
      return false;
    }
    this.PantallaLoading = true;
    this.Mesa = Mesa;
    await this.LeerPedidosAbiertosMesa(Mesa.Id_Mesa);
    this.PantallaCuentas = true;
    this.PantallaPlano = false;
    this.PantallaLista = false;
    this.PantallaLoading = false;
    return true;
  }

  async LeerPedidosAbiertosMesa(Id_Mesa?:any){
    if(!Id_Mesa){
      Id_Mesa = this.Mesa.Id_Mesa;
    }
    let data = await this.planoService.LeerCuentasMesa(Id_Mesa);
    if(data['total'] == 0){
      this.Pedidos = [];
    }else{
      this.Pedidos = data['data'];
    }
  }
  AbrirPantallaCrearCuenta(){
    this.PantallaCrearCuenta = true;
    this.Pedido.Id_Pedido = '';
    this.Pedido.Id_Mesa = this.Mesa.Id_Mesa;
    this.Pedido.Id_Zona = this.Mesa.Id_Zona;
    this.Pedido.Nombre = 'Cliente de Contado';
    this.Pedido.Estado = '1';
  }
  CerrarPantallaCuentas(){
    this.PantallaCuentas = false;
    this.PantallaPlano = true;
  }

  CerrarPantallaCrearCuenta(){
    this.PantallaCrearCuenta = false;
  }
  async CrearCuenta(){
    //Insertar Registro en ResPedido.
    this.Pedido.Id_Caja = this.Caja;
    this.Pedido.Servicio = this.Mesa.Servicio;
    let data = await this.planoService.NuevaCuenta(this.Pedido);
    this.Pedido.Id_Pedido =  data['data'][0]['Identity'];
    this.log.Accion = '1';
    this.log.Id_Pedido = this.Pedido.Id_Pedido;
    await this.planoService.InsertLog(this.log);
    await this.restaurantOrderService.placeOccuped(this.Mesa.Id_Mesa);
    this.LeerPedidosAbiertosMesa();
    this.loadPlaces();
    this.CerrarPantallaCrearCuenta();
    this.AbrirPantallaInfoCuenta(this.Pedido)
    //Abrir Pantalla Producto Nuevo
  }

  //Eventos de la pantalla de información de la cuenta
  async AbrirPantallaInfoCuenta(Cuenta){
    this.PantallaLoading = true;
    this.TotalGeneral = 0;
    this.Total = 0;
    this.Pedido = Cuenta;
    this.Pedido.Id_Mesa = this.Mesa.Id_Mesa;
    this.Pedido.Id_Zona = this.Mesa.Id_Zona;
    await this.loadOrderProducts(this.Pedido.Id_Pedido,1);
    this.PantallaCuentas = false;
    this.PantallaInfoCuenta = true;
    this.PantallaLoading = false;
    this.comandaNegativa = false;
  }
  async CerrarPantallaInfoCuenta(){
    this.PantallaCuentas = true;
    this.PantallaInfoCuenta = false;
    if(this.comandaNegativa){
      await this.imprimirComandaNegativa(this.Pedido.Id_Pedido);
    }
  }

  async loadOrderProducts(Id_Pedido,Cuenta){
    let products = await this.restaurantOrderService.loadOrderProducts(Id_Pedido);
    if(products['total'] == 0){
      if(Cuenta == 1){
        this.OrderProducts = [];
      }else{
        this.ProductosOrdenNueva = [];
        this.TotalOrdenNueva = 0;
      }
      
    }else{
      if(Cuenta == 1){
        this.OrderProducts = products['data'];
      }else{
        this.ProductosOrdenNueva = products['data'];
      }
      //Calcular el Total de la Orden
      this.calcularTotal();
      //Recorrer Cada Producto y Verificar si tiene Componentes.
      let string = '';
      for (let Componente of this.OrderProducts){
        let Componentes = await this.restaurantOrderService.loadPedidoDetalleAlterno(Componente.Id_Pedido_Detalle)
        if(Componentes['total'] != 0){
          string = '';
          for (let comp of Componentes['data']){
            string = string + comp['Componente'] + ' ' + comp['Sub_Componente'] + ', '
          }
          Componente['Componente'] = string;
        }
      }
    }
  }

  async SumArticle(Article){
    await this.restaurantOrderService.addProductToProduct(Article.Id_Pedido_Detalle);
    this.log.Accion = '2'
    this.log.Cantidad = '1';
    this.log.Id_Pedido = this.Pedido.Id_Pedido;
    this.log.Id_Pedido_Detalle = Article.Id_Pedido_Detalle;
    this.log.Id_Producto = Article.Id_Producto;
    this.planoService.InsertLog(this.log);
    this.loadOrderProducts(this.Pedido.Id_Pedido,1);
  }
  async minusArticle(Article){
    this.comandaNegativa = true;
    if(Article.Cantidad == 1){
      //marcar el artículo como depachado
      await this.restaurantOrderService.ceroProductToProduct(Article.Id_Pedido_Detalle,2);
      //return false
    }else{
      await this.restaurantOrderService.menusProductToProduct(Article.Id_Pedido_Detalle);
    }
    this.log.Accion = '3'
    this.log.Cantidad = '1';
    this.log.Id_Pedido = this.Pedido.Id_Pedido;
    this.log.Id_Pedido_Detalle = Article.Id_Pedido_Detalle;
    this.log.Id_Producto = Article.Id_Producto;
    this.planoService.InsertLog(this.log);

    //  Imprimir Orden Negativa
    //await this.imprimirComandaNegativa(Article.Id_Producto,this.Pedido.Id_Pedido);
    this.loadOrderProducts(this.Pedido.Id_Pedido,1);

    this.CerrarCuenta();
  }
  async CerrarCuenta(){
    
    if(this.OrderProducts.length == 0 || this.TotalGeneral == 0){
      //Preguntar si cierra la orden;
      this.TotalGeneral = 0;
      Swal.fire({
        title: 'Desea Cerrar la Cuenta?',
        text: "La Cuenta quedo sin articulos!",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Cerrar Cuenta!'
      }).then((result) => {
        if (result.value) {
          this.cerrarPedido();
        }
      });
    }
  }

  async cerrarPedido(Pedido?){
    this.Pedido.Total = 0;
    this.Pedido.Monto_Pagado = 0;
    this.Pedido.Monto_Pagado2 = 0;
    this.Pedido.Monto_Pagado3 = 0;
    this.Pedido.Metodo_Pago = '99';
    this.Pedido.Metodo_Pago1 = '';
    this.Pedido.Metodo_Pago2 = '';
    this.log.Accion = '4'
    this.log.Cantidad = '';
    this.log.Id_Pedido = this.Pedido.Id_Pedido;
    this.log.Id_Pedido_Detalle = '';
    this.planoService.InsertLog(this.log);
    await this.planoService.ActualizarDatosPedido(this.Pedido);
    await this.LeerPedidosAbiertosMesa();
    this.CerrarPantallaInfoCuenta();

    if(this.Pedidos.length == 0){
      await this.restaurantOrderService.placeFree(this.Mesa.Id_Mesa);
      await this.loadPlaces();
      this.CerrarPantallaCuentas();
    }
  }
  async imprimirBlueTooth(txt){
    // @ts-ignore-start
    ThermalPrinter.printFormattedTextAndCut({
        type: 'bluetooth',
        id: this.ImpresoraFacturacion,
        text:txt,
        mmFeedPaper:20
      }, function() {

      }, function(error) {
        Swal.fire('Error: ' + error)
      });
    // @ts-ignore-end
    this.planoService.actualizarComanda(this.Pedido.Id_Pedido);
  }

  async imprimirCuenta(){
    // @ts-ignore-start
    if(window.location.host != 'localhost'){
      window.open('https://toxo.work/reportes/bar/cuenta.php?IdDocument='+this.Pedido.Id_Pedido);
    }else{
      let data = await this.planoService.carcarScript('https://toxo.work/reportes/bar/cuenta2.php',this.Pedido.Id_Pedido);
      this.imprimirBlueTooth(data['data']);
    }
    // @ts-ignore-end
    this.log.Accion = '5'
    this.log.Cantidad = '';
    this.log.Id_Pedido_Detalle = '';
    this.log.Id_Pedido = this.Pedido.Id_Pedido;
    this.planoService.InsertLog(this.log);
  }

  async imprimirComandaNegativa(Id_Pedido?){
    if(window.location.host != 'localhost'){
      let a =  window.open('https://toxo.work/reportes/bar/comandaNegativa.php?IdDocument='+Id_Pedido+'&Id_Pedido='+Id_Pedido);
      setTimeout(()=>{
        this.planoService.actualizarComanda(this.Pedido.Id_Pedido);
      },10000) 
    }else{
      let data = await this.planoService.carcarScript('https://toxo.work/reportes/bar/comandaNegativa2.php?IdDocument='+Id_Pedido+'&Id_Pedido='+Id_Pedido,'&Id_Pedido='+Id_Pedido);
      if(data['success']){
        this.imprimirBlueTooth(data['data']);
      }
      //await this.planoService.actualizarComanda(this.Pedido.Id_Pedido);
    }
    this.log.Accion = '10'
    this.log.Id_Pedido = this.Pedido.Id_Pedido;
    this.log.Cantidad = '';
    this.log.Id_Pedido_Detalle = '';
    this.planoService.InsertLog(this.log);
  }
  async imprimirComanda(){
    if(window.location.host != 'localhost'){
      window.open('https://toxo.work/reportes/bar/comandaB.php?IdDocument='+this.Pedido.Id_Pedido);
      /*
      setTimeout(()=>{
        this.planoService.actualizarComanda(this.Pedido.Id_Pedido);
        
      },10000)
      */ 
      //await this.planoService.actualizarComanda(this.Pedido.Id_Pedido);
    }else{
      let data = await this.planoService.carcarScript('https://toxo.work/reportes/bar/comanda2.php',this.Pedido.Id_Pedido);
      this.imprimirBlueTooth(data['data']);
      //await this.planoService.actualizarComanda(this.Pedido.Id_Pedido);
    }
    this.log.Accion = '6'
    this.log.Id_Pedido = this.Pedido.Id_Pedido;
    this.log.Cantidad = '';
    this.log.Id_Pedido_Detalle = '';
    this.planoService.InsertLog(this.log);
  }
  async imprimirTiqueteElectronico(){
    this.log.Accion = '7'
    this.log.Cantidad = '';
    this.log.Id_Pedido_Detalle = '';
    this.log.Id_Pedido = this.Pedido.Id_Pedido;
    this.planoService.InsertLog(this.log);
    if(window.location.host != 'localhost'){
      window.open('https://toxo.work/reportes/bar/tiquete-caja.php?IdDocument='+this.Pedido.Id_Pedido);
    }else{
      let data = await this.planoService.carcarScript('https://toxo.work/reportes/bar/tiquete-caja2.php',this.Pedido.Id_Pedido);
      this.imprimirBlueTooth(data['data']);
    }
  }
  /*Eventos pantalla cambiar mesa */

  abrirPantallaCambiarMesa(){
    this.ProductosOrdenNueva = [];
    this.TotalOrdenNueva = 0;
    this.PeididoAnterior  = this.Pedido.Id_Pedido
    this.MesaAnterior = this.Mesa.Id_Mesa;

    this.Pedido.Id_Nueva_Mesa = this.Pedido.Id_Mesa;
    this.Pedido.Id_Nueva_Zona = this.Pedido.Id_Zona;
    this.Pedido.Id_Nuevo_Pedido = '-99';
    this.PantallaInfoCuenta = false;
    this.PantallaCambiarMesa = true;
    this.Pedido.Pedido_Alterado = false;
    
    for (let Orden of this.OrderProducts){
      Orden['Nueva_Cantidad'] = "";
    }
    this.ProductosOrdenActual = JSON.parse(JSON.stringify(this.OrderProducts)) ;
    this.LeerMesasPorZona();
    this.TotalizarPedidoActual();
  }
  cerrarPantallaCambarMesa(){
    this.PantallaCambiarMesa = false;
  }
  async cambiarMesa(){
    this.PantallaLoading = true;
    //Determinar el tipo de acción a realizar.
    // 1. No cambio la información del Detalle.
    // 1.1 Cambió la mesa ha una cuenta nueva.
    // 1.2 Cambió la mesa a una cuenta existente.
    // 2. Cambió la información del detalle
    // 2.1 Cambiar Detalle ana cuenta Nueva.
    // 2.2 Cambiar Detalle a una cuenta existente.
    let cambios = {
      Id_Zona:this.Pedido.Id_Nueva_Zona,
      Nombre_Zona:'',
      Id_Mesa:this.Pedido.Id_Nueva_Mesa,
      Nombre_Mesa:'',
      Id_Pedido:this.Pedido.Id_Nuevo_Pedido
    };
    if(this.Pedido.Pedido_Alterado == false){
      // No ha cabiado el detalle
      if(this.Pedido.Id_Nuevo_Pedido == '-99'){
        // Crear nuevo pedido en la nueva mesa
        // Cambiar todos los detalles al nuevo pedido
        await this.CambiarMesa11(cambios)
      }else{
        // Asignar todos los detalles al pedido existente
        await this.CambiarMesa12();
      }
    }else{
       // Los detalles fueron alterados
      if(this.Pedido.Id_Nuevo_Pedido == '-99'){
        await this.CambiarMesa21();
        // Crear nuevo pedido en la nueva mesa
        // Asignar los detalles que sean mayor a cero a esta nueva cuenta
        // Actualizar las nuevas cantidades al detalle existente
      }else{
        // Asignar los detalles que sean mayor a cero a al pedido existente
        // Actualizar las nuevas cantidades al detalle existente
        await this.CambiarMesa22();
      }
    }
    await this.loadPlaces();
    // Leer las cuentas de la mesa
    await this.LeerPedidosAbiertosMesa();
    this.cerrarPantallaCambarMesa();
    this.CerrarPantallaInfoCuenta();
    Swal.fire('Cliente cambiado de sitio');
    this.PantallaLoading = false;
    return false;
  }
  async CambiarMesa22(){
    // Asignar los detalles que sean mayor a cero a al pedido existente
    // Actualizar las nuevas cantidades al detalle existente
    let NuevoId = this.Pedido.Id_Nuevo_Pedido;
    let Sub_Total_Actual = 0;
    let Nuevo_Sub_Total = 0;
    for (let Orden of this.OrderProducts){
      if(Orden.Candiad != Orden.Nueva_Cantidad){
        let NuevaCantidad
        //1. Insertar un nuevo registro en la orden nueva
        let NuevoProducto = Object.assign({} , Orden)
        NuevoProducto.Id_Pedido = NuevoId;
        NuevoProducto.Cantidad = Orden.Nueva_Cantidad;
        await this.restaurantOrderService.addProduct(NuevoProducto,NuevoId);
        await this.restaurantOrderService.updateProductTotal(NuevoId);
        Nuevo_Sub_Total = Nuevo_Sub_Total + (NuevoProducto.Cantidad * NuevoProducto.Precio);
        //Actualizar Total de la Orden
        //2. actualizar los nuevos registros en la orden existente.
        // Actualizar las nuevas cantidades al detalle existente
        Orden.Cantidad = parseInt(Orden.Cantidad) - parseInt(Orden.Nueva_Cantidad);

        await this.restaurantOrderService.UpdateProductPrice(Orden.Id_Pedido_Detalle,Orden.Precio,Orden.Cantidad,Orden.Total);
        await this.restaurantOrderService.updateProductTotal(Orden.Id_Pedido);
        Sub_Total_Actual = Sub_Total_Actual + (Orden.Cantidad * Orden.Precio);
      }

      let IVA_Actual = (Sub_Total_Actual * 10) / 100;
      let Total_Actual = Sub_Total_Actual + IVA_Actual;
      let IVA_Nuevo = (Nuevo_Sub_Total * 10)/100;
      let Nuevo_Total = Nuevo_Sub_Total + IVA_Nuevo;
      await this.restaurantOrderService.UpdateOrderTotal(Sub_Total_Actual,IVA_Actual,Total_Actual,this.Pedido.Id_Pedido);
      await this.restaurantOrderService.UpdateOrderTotal(Nuevo_Sub_Total,IVA_Nuevo,Nuevo_Total,NuevoId);
    }
  }
  async CambiarMesa21(){
    // Crear nuevo pedido en la nueva mesa
    let cuenta = {
      Id_Mesa: this.Pedido.Id_Nueva_Mesa,
      Id_Zona: this.Pedido.Id_Nueva_Zona,
      Nombre: this.Pedido.Nombre + '1',
      Servicio:this.Pedido.Servicio,
      Estado:1
    }
    let data = await this.planoService.NuevaCuenta(cuenta);
    let NuevoId = data['Identity'];
    // Cambiar el estado de la Mesa a Ocupada
    await this.restaurantOrderService.placeOccuped(this.Pedido.Id_Nueva_Mesa);
    // Asignar los detalles que sean mayor a cero a esta nueva cuenta
    let Sub_Total_Actual = 0;
    let Nuevo_Sub_Total = 0;
    for (let Orden of this.OrderProducts){
      if(Orden.Candiad != Orden.Nueva_Cantidad){
        
        //1. Insertar un nuevo registro en la orden nueva
        let NuevoProducto = JSON.parse(JSON.stringify(Orden)) ;
        NuevoProducto.Id_Pedido = NuevoId;
        NuevoProducto.Cantidad = Orden.Nueva_Cantidad;

        await this.restaurantOrderService.addProduct(NuevoProducto,NuevoId);
        await this.restaurantOrderService.updateProductTotal(NuevoId);
        Nuevo_Sub_Total = Nuevo_Sub_Total + (NuevoProducto.Cantidad * NuevoProducto.Precio);
        //Actualizar Total de la Orden
        //2. actualizar los nuevos registros en la orden existente.
        // Actualizar las nuevas cantidades al detalle existente
        Orden.Cantidad = Orden.Cantidad - Orden.Nueva_Cantidad;
        await this.restaurantOrderService.UpdateProductPrice(Orden.Id_Pedido_Detalle,Orden.Precio,Orden.Cantidad,Orden.Total);
        await this.restaurantOrderService.updateProductTotal(Orden.Id_Pedido);
        Sub_Total_Actual = Sub_Total_Actual + (Orden.Cantidad * Orden.Precio);
      }
      let IVA_Actual = (Sub_Total_Actual * 10) / 100;
      let Total_Actual = Sub_Total_Actual + IVA_Actual;
      let IVA_Nuevo = (Nuevo_Sub_Total * 10)/100;
      let Nuevo_Total = Nuevo_Sub_Total + IVA_Nuevo;
      await this.restaurantOrderService.UpdateOrderTotal(Sub_Total_Actual,IVA_Actual,Total_Actual,this.Pedido.Id_Pedido);
      await this.restaurantOrderService.UpdateOrderTotal(Nuevo_Sub_Total,IVA_Nuevo,Nuevo_Total,NuevoId);
    }
  }
  async CambiarMesa12(){
    // Asignar todos los detalles al pedido existente
    await this.planoService.CambiarIdPedido(this.Pedido.Id_Nuevo_Pedido,this.Pedido.Id_Pedido);
  }
  async CambiarMesa11(cambios){
    // Crear nuevo pedido en la nueva mesa
    let cuenta = {
      Id_Mesa: this.Pedido.Id_Nueva_Mesa,
      Id_Zona: this.Pedido.Id_Nueva_Zona,
      Nombre: this.Pedido.Nombre + '1',
      Servicio:this.Pedido.Servicio,
      Estado:1
    }
    let data = await this.planoService.NuevaCuenta(cuenta);
    let NuevoId = data['Identity'];
    // Cambiar el estado de la Mesa a Ocupada
    await this.restaurantOrderService.placeOccuped(this.Pedido.Id_Nueva_Mesa);
    // Cambiar todos los detalles al nuevo pedido
    await this.planoService.CambiarIdPedido(NuevoId,this.Pedido.Id_Pedido);
  }

  async LeerZonas(search?:any){
    let data = await this.restaurantZoneService.loadZones(this.paginacion,'');
    if(data['total'] == 0){
      this.Zonas = [];
    }else{
      this.Zonas = data['data'];
    }
  }

  async LeerMesasPorZona(){
    this.PedidoSeleccionado = false;
    this.ProductosOrdenActual = JSON.parse(JSON.stringify(this.OrderProducts));
    this.ProductosOrdenNueva = [];
    this.TotalOrdenNueva = 0;
    let data:any;
    if(this.Pedido.Id_Zona != this.Pedido.Id_Nueva_Zona){
      data = await this.restaurantPlaceService.loadPlacesZone(this.Pedido.Id_Nueva_Zona);
    }else{
      data = await this.restaurantPlaceService.loadPlacesZone(this.Pedido.Id_Zona);
    }

    if(data['total'] == 0){
      this.MesasZona = [];
    }else{
      this.MesasZona = data['data'];
    }
  }

  /* Eventos Pantalla de clave de supervisor */
  abrirPantallaClave(Articulo,Indice){
    this.Articulo = Articulo;
    this.Articulo.Indice = Indice;
    this.ClaveSupervisor = '';
    this.PantallaPedirClave = true;
  }
  cerrarPantallaClave(){
    this.PantallaPedirClave = false;
  }
  async validarClaveSupervisor(){
    if(this.ClaveSupervisor == ''){
      Swal.fire('Suministre la clave de supervisor');
      return false;
    }
    let data = await this.restaurantOrderService.LoadSupervisor(this.ClaveSupervisor);
    this.cerrarPantallaClave();
    if(data['total'] == 0){
      Swal.fire('Clave de Supervisor Incorrecta');
      return false;
    }else{
      this.Precio  = '';
      this.PantallaEditarPrecio = true;
      return true;
    }
  }

  /*Eventos pantalla cambio de precio */
  cambiarPrecio(){
    //this.Articulo.Precio = this.Precio;
    //this.Articulo.Total = this.TotalLinea;
    //Actualizar la Linea de Detalle
    this.cambioPrecio();
    this.cerrarPantallaEditarPrecio();
    this.log.Accion = '8'
    this.log.Id_Pedido = this.Pedido.Id_Pedido;
    this.log.Id_Pedido_Detalle = this.Articulo.Id_Pedido_Detalle;
    this.log.Cantidad = this.Articulo.Cantidad;
    this.log.Id_Pedido_Detalle = this.Articulo.Id_Producto;
    this.planoService.InsertLog(this.log);
  }
  cerrarPantallaEditarPrecio(){
    this.PantallaEditarPrecio = false;
  }
  //async cambioPrecio(event){
  async cambioPrecio(){
    //if (event.key === "Enter") {
      let Cantidad = parseFloat(this.Articulo.Cantidad);
      let Precio = parseFloat(this.Precio);
      let Impuesto = parseFloat(this.Articulo.Impuesto);
      //let IVA = Precio / Impuesto;
      //let NuevoPrecio = Precio + IVA;
      let NuevoPrecio  = Precio / (1+(Impuesto/100));
      let IVA = Precio - NuevoPrecio;
      let Total = Precio * Cantidad;
      this.IVA = IVA.toString();
      this.TotalLinea = Total.toString();
      this.Articulo.Precio = NuevoPrecio.toString();
      //Actualizar Registro en la base de datos
      let TotalLInea = parseFloat(this.Articulo.Precio) * parseFloat(this.Articulo.Cantidad);
      await this.restaurantOrderService.UpdateProductPrice(this.Articulo.Id_Pedido_Detalle,this.Articulo.Precio,this.Articulo.Cantidad,TotalLInea);
      await this.restaurantOrderService.updateProductTotal(this.Articulo.Id_Pedido_Detalle);
      this.OrderProducts[this.Articulo.Indice].Precio = NuevoPrecio;
      this.OrderProducts[this.Articulo.Indice].Total = NuevoPrecio * Cantidad;
      this.calcularTotal();
    //}
  }

  /*Evento de la pantalla agregar Productos */
  abrirPantallaProductos(){
    this.PantallaProductos = true;
    this.PantallaInfoCuenta = false;
  }
  async cerrarPantallaProductos(){
    this.PantallaProductos = false;
    this.PantallaInfoCuenta = true;
    this.PantallaLoading = false;
  }
  SeleccionarCategoria(Categoria){
    this.Id_Categoria = Categoria.Id_Categoria;
    this.loadSubCategories(Categoria.Id_Categoria);
  }
  async loadCategories(search?: any) {
    let data = await this.categoryService.loadCategories(this.paginacion,search,1);
    if (data['total'] == 0) {
      this.Categorias = [];
    } else {
      this.Categorias = data['data'];
      this.Id_Sub_Categoria = this.Categorias[0]['Id_Categoria'];
      this.loadSubCategories(this.Categorias[0]['Id_Categoria']);
    }
  }
  async loadSubCategories(Id_Categoria) {
    let data = await this.subCategoryService.loadSubCategoriesByCategoria(Id_Categoria,1);
    if (data['total'] == 0) {
      this.SubCategorias = [];
      await this.LoadArticulosbyCategory(Id_Categoria);
    } else {
      this.SubCategorias = data['data'];
      await this.LoadArticulosBySubCategory(this.SubCategorias[0].Id_Sub_Categoria)
    }
  }
  async SeleccionarSubCategoria(subCategoria){
    this.Id_Sub_Categoria = subCategoria.Id_Sub_Categoria;
    await this.LoadArticulosBySubCategory(subCategoria.Id_Sub_Categoria);
  }
  async LoadArticulosBySubCategory(Id_Sub_Categoria){
    let data = await this.productService.loadProductsBySubCategory(Id_Sub_Categoria,this.buscarProducto,1);
    if (data['total'] == 0) {
      this.Productos = [];
    } else {
      this.Productos = data['data'];
    }
  }
  async LoadArticulosbyCategory(Id_Categoria){
    let data = await this.productService.loadProductsByCategory(Id_Categoria,this.buscarProducto,1);
    if (data['total'] == 0) {
      this.Productos = [];
    } else {
      this.Productos = data['data'];
    }
  }
  search(){
    if(this.SubCategorias.length == 0){
      this.LoadArticulosbyCategory(this.Id_Categoria)
    }else{
      this.LoadArticulosBySubCategory(this.Id_Sub_Categoria);
    }
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  async SeleccionarProducto(Article){
    this.Articulo = Article;
    /*
    if(Article.Cocina == 1){
      //Imprimir Comanda
      this.imprimirComanda(Article.Id_Producto);
    }*/

    //Verificar si el artículo tiene Componetes opcionales.
    this.Componentes = [];
    this.Id_Articulo = Article.Id_Producto;
    let componentes = await this.restaurantOrderService.loadComponete(Article.Id_Producto,1);
    if(componentes['total'] != 0){
      let Grupo = 1;
      let row = [];
      for (let Componente of componentes['data']){
        if(parseInt(Componente['Grupo']) == Grupo){
          row.push(Componente);
        }else{
          if(row.length > 0){
            this.Componentes.push(row);
            Grupo++;
            row =[];
            row.push(Componente);
          }
        }
      }
      if(row.length > 0){
        this.Componentes.push(row);
      }
      this.PantallaOpciones = true;
    }else{
      this.agregarArticulo(Article);
    }
  }

  async agregarArticulo(Article){
    this.PantallaLoading = true;
    let totalAdicionales = 0;
    //seleccionarTipoCuenta

    //Article.IVA = Article.Sub_Total - Article.Precio;
    //Article.Total = Article.Sub_Total;
    let data = await this.restaurantOrderService.addProduct(Article,this.Pedido.Id_Pedido);
    let identity = data["data"][0]["Identity"];

    //Agregar los Componentes y del Artículo
    for (let ComponenteInterno of this.Componentes){
      for (let Componente of ComponenteInterno){
        if(Componente['Selected'] == 1){
          Componente['Id_Pedido_Detalle'] = identity;
          let detalle = await this.restaurantOrderService.addComponente(Componente);
        }
      }
    }
    //Agregar los Adicionales
    for (let ComponenteInterno of this.Adicionales){
      for (let Componente of ComponenteInterno){
        if(Componente['Selected'] == 1){
          Componente['Id_Pedido_Detalle'] = identity;
          Componente['Adicional'] = 1;
          totalAdicionales = totalAdicionales + parseFloat(Componente['Precio']);
          let detalle = await this.restaurantOrderService.addComponente(Componente);
        }
      }
    }

    this.log.Accion = '9'
    this.log.Cantidad = '1';
    this.log.Id_Pedido = this.Pedido.Id_Pedido;
    this.log.Id_Pedido_Detalle = identity;
    this.log.Id_Producto = Article.Id_Producto;
    this.planoService.InsertLog(this.log);
    this.loadOrderProducts(this.Pedido.Id_Pedido,1);
    this.cerrarPantallaProductos();
  }
  /* Eventos Pantalla Facturar */
  abrirPantallaFacturar(){
    for (let Orden of this.OrderProducts){
      Orden['Nueva_Cantidad'] = "";
    }
    if(!this.Caja){
      //No permitir facturar si no está habierta la caja
      Swal.fire('No esta habierta una caja, No se puede facturar');
      this.Caja = '';
      return false;
    }
    this.cobro3 = false;
    this.cobro2 = false;
    this.factura.Tipo_Documento = '04';
    this.factura.Numero_Identificacion = '';
    this.factura.Correo = '';
    this.factura.Nombre = this.Pedido.Nombre;
    this.factura.Condicion_Venta = '01';
    this.Pedido.Metodo_Pago = '99';
    this.Pedido.Metodo_Pago1 = '';
    this.Pedido.Metodo_Pago2 = '';
    this.Pedido.Monto_Pagado = 0;
    this.Pedido.Monto_Pagado2 = 0;
    this.Pedido.Monto_Pagado3 = 0;
    this.Pedido.Referencia ='';
    this.Pedido.Referencia2 ='';
    this.Pedido.Referencia3 ='';
    this.Pedido.Monto_Pagado = this.TotalGeneral;
    this.PantallaFacturar = true;


    this.calcularTotalFactura();
    return true
  }
  cerrarPantallaFacturar(){
    this.facturando = false;
    this.factura.Metodo_Pago = '99';
    this.factura.Nombre = '';
    this.factura.MontoCobrado = 0;
    this.PantallaFacturar  = false;
    this.calcularTotal();
  }
  async IdValidation(){
    if(this.factura.Numero_Identificacion == ''){
      return true;
    }
    if(this.validandoId == true){
      return false;
    }else{
      this.validandoId = true;
    }
    this.PantallaLoading = true;
    //validar si la cedula existe en la base de datos.
    let data = await this.invoiceService.validClient(this.factura.Numero_Identificacion);
    if (data["total"] === 0) {
      this.clienteExiste = false;
      //El Cliente no existe en la base de datos. hay que   ultar hacienda para ver si es un usuario registrado de hacienda.
      let persona = await this.invoiceService.getApiHacienda(this.factura.Numero_Identificacion);
      if(persona){
        if(persona[0] == 'false'){
          Swal.fire('Cliente no existe ni en la base de datos, ni en Hacienda, revise el formato');
          this.PantallaLoading = false;
          return false;
        }else{
          this.persona.Nombre = persona.nombre;
          this.persona.Tipo_Identificacion = persona.tipoIdentificacion;
          this.factura.Nombre = this.persona.Nombre;
          this.factura.Codigo_Identificacion = this.persona.Tipo_Identificacion;
          this.factura.Condicion_Venta = '01';
          this.factura.Metodo_Pago = '99';
          this.factura.Plazo_Credito = '0';

          let data = await this.invoiceService.insertClient(this.factura);
          this.factura.Id_Cliente = data["data"][0]["Identity"];
        }
      }else{
        this.PantallaLoading = false;
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
      this.factura.Id_Cliente = this.persona.Id_Persona;
      this.factura.Numero_Identificacion = this.persona.Identificacion;
      this.factura.Nombre = this.persona.Nombre;
      this.factura.Codigo_Identificacion = this.persona.Tipo_Identificacion;
      this.factura.Correo = this.persona.Correo;
      this.factura.Condicion_Venta = this.persona.Condicion_Venta;
      this.factura.Plazo_Credito = this.persona.Plazo_Credito;
      this.factura.Metodo_Pago = this.persona.Metodo_Pago;
      this.factura.Moneda = this.persona.Moneda;
      if (this.factura.Moneda === "") {
        this.factura.Moneda = "CRC";
      }
      if (this.factura.Condicion_Venta === "") {
        this.factura.Condicion_Venta = "01";
      }
      if (this.factura.Plazo_Credito === "") {
        this.factura.Plazo_Credito = "0";
      }
      if (this.factura.Metodo_Pago === "") {
        this.factura.Metodo_Pago = "99";
      }
      if (this.factura.Codigo_Identificacion == "") {
        this.factura.Codigo_Identificacion = "01";
      }
    }
    let elemento = document.getElementById("Correo");
    elemento.focus();
    this.validandoId = false;
    this.PantallaLoading = false;
    return true;
  }
  enterValidation(event){
    if (event.key === "Enter") {
      //await this.IdValidation();
      let elemento = document.getElementById("NombreCliente");
      elemento.focus();
    }
  }
  ClienteNuevo(){
    Swal.fire('En Construcción, Consulte a soporte');
  }
  async dividirCuenta(){
    await this.validarCuentaParcial();
    this.cerrarPantallaCambarMesa();
    await this.LeerPedidosAbiertosMesa();
    this.CerrarPantallaInfoCuenta();
  }
  async validarCuentaParcial(){
    let Parcial = false;
    for (let i = 0; i < this.OrderProducts.length; i++) {
      if(parseInt(this.OrderProducts[i]['Facturar']) != parseInt(this.OrderProducts[i]['Cantidad'])){
        Parcial = true;
      }
    }
    if(Parcial){
      //Copiar el encabezado de la orden
      let data = await this.planoService.NuevaCuenta(this.Pedido);
      let NuevoId = data['Identity']; //872
      //Agregar los detalles
      for (let i = 0; i < this.OrderProducts.length; i++) {
        let Cantidad = this.OrderProducts[i]['Cantidad'];
        let Facturar = this.OrderProducts[i]['Facturar'];
        let NuevaCantidad = this.OrderProducts[i]['Cantidad'] - this.OrderProducts[i]['Facturar'];

        let record = Object.assign({},this.OrderProducts[i]) ;

        record.Cantidad = NuevaCantidad;
        record.Sub_Total = record.Precio * record.Cantidad;
        record.IVA = (record.Sub_Total * record.Impuesto) /100;
        record.Total = record.Sub_Total + record.IVA;

        let InsertarRegistro = false;
        let FacturarRegistro = false;
        if(Facturar == 0 ){
          InsertarRegistro = true;
          FacturarRegistro = false;
        }
        if(Cantidad == Facturar){
          InsertarRegistro = false;
          FacturarRegistro = true;
        }
        if(Facturar < Cantidad){
          InsertarRegistro = true;
          FacturarRegistro = true;
        }
        if(InsertarRegistro){

          record.Facturar = 0;
          let data = await this.restaurantOrderService.addProduct(record,NuevoId);
        }
        if(FacturarRegistro){
          if(Facturar == 0 ){
            // Hay que eliminar el articulo de la orden ya que se está dejando en cero
            this.OrderProducts[i].Cantidad = 0;
            this.OrderProducts[i].Facturar = 0;
            this.OrderProducts[i].Sub_Total = 0;
            this.OrderProducts[i].IVA = 0;
            this.OrderProducts[i].Total = 0;
            await this.restaurantOrderService.ceroProductToProduct(this.OrderProducts[i]['Id_Pedido_Detalle'],3);
          }else{
            this.OrderProducts[i].Cantidad = Facturar;
            this.OrderProducts[i].Facturar = Facturar;
            this.OrderProducts[i].Sub_Total = this.OrderProducts[i].Precio * this.OrderProducts[i].Cantidad;
            this.OrderProducts[i].IVA = (this.OrderProducts[i].Sub_Total * this.OrderProducts[i].Impuesto) /100;
            this.OrderProducts[i].Total = this.OrderProducts[i].Sub_Total + this.OrderProducts[i].IVA;
            await this.planoService.ActualizarDatosPedidoDetalle(this.OrderProducts[i]);
          }
        }
      }
    }
  }
  async facturar(){
    if (!navigator.onLine) {
      Swal.fire('No hay internet, revise la conexion');
      return false;
    }
    //Validar el Email
    if(this.factura.Tipo_Documento == '01'){
      const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      const result: boolean = expression.test(this.factura.Correo);
      if(!result){
        Swal.fire("El formato del correo es incorrecto, debe corregirlo");
        return false;
      } 
      //Eliminar blancos al final y al principio de la cedula
      this.factura.Numero_Identificacion.trim();

      const regex = /^[0-9]*$/;
      const onlyNumbers = regex.test(this.factura.Numero_Identificacion); // true
      if(!onlyNumbers){
        Swal.fire("El formato de la cedula solo debe tener numeros, debe corregirlo");
        return false;
      } 
    } 
    this.PantallaLoading = true;
    for (let Orden of this.OrderProducts){
      Orden.Facturar = Orden.Nueva_Cantidad;
    }
    //Validar si es de crédito debe ser por fuerza tiquete electrónico.
    if(this.factura.Tipo_Documento == '04'){
      if(this.factura.Condicion_Venta == '02'){
        Swal.fire('La Condición de Crédito solo puede aplicarse a factura no a tiquete electrónico');
        return false;
      }
    }else{
      if(this.factura.Condicion_Venta == '02'){
        //Actualizar el Id del cliente en el pedido
        await this.planoService.ActualizarIdClientePedido(this.Pedido.Id_Pedido,this.factura.Id_Cliente);
      }
    }
    //Validar si no se esta facturando el total Si es así entonces copiar la orden y facturar el monto ajustado
    await this.validarCuentaParcial();
    //return false;
    await this.calcularTotalFactura();
    //Validar que exista metodo de pago y monto seleccionado
    if(this.Pedido.Monto_Pagado == 0){
      this.Pedido.Monto_Pagado = Math.round(this.Pedido.Total);
    }
    this.facturando = true;
    //Actualizar Nombre de Cliente
    await this.ActualizarDatosOrden();
    this.cerrarPantallaFacturar();
    this.CerrarPantallaInfoCuenta();
    await this.LeerPedidosAbiertosMesa();
    //Determinar si no hay ordenes abiertas
    if(this.Pedidos.length == 0){
      this.CerrarPantallaCuentas();
      await this.restaurantOrderService.placeFree(this.Mesa.Id_Mesa);
      this.loadPlaces();
    }
    if(this.Pedido.Metodo_Pago != '99'){
      //Generar Factura
      await this.generarFacturaElectronica();
    }else{
      //Ejecutar interfaz inventario.
      if(this.factura.Condicion_Venta == '02'){
        //Generar Cuenta por cobrar
        await this.apiService.postRecord('Call sp_Res_Crear_CxC(' + this.Pedido.Id_Pedido+ ')' );
      }
      await this.apiService.postRecord('Call sp_Inv_Movimiento_Pedido_Restaurante(' + this.Pedido.Id_Pedido+ ')' );
      // Actulizar Saldo de Caja
      await this.planoService.actualizarSaldoCaja(this.Pedido.Total);
    }
    //Agregarle al pedido el numero de caja y Caja diaria al cuál está asociado.
    let cajaDiaria = {
      Id_Caja: localStorage.getItem('Id_Caja'),
      Id_Caja_Diaria: localStorage.getItem('Id_Caja_Diaria'),
      Id_Pedido:this.Pedido.Id_Pedido
    }
    await this.planoService.actualizarCajaPedido(cajaDiaria);
    this.imprimirTiqueteElectronico();
    this.PantallaLoading = false;
    return true;
  }
  async ActualizarDatosOrden(){
    this.calcularTotal();
    if(this.factura.Nombre  ==''){
      this.factura.Nombre = 'Cliente de Contado';
    }
    this.Pedido.Nombre = this.factura.Nombre;
    //this.Pedido.Metodo_Pago = this.Pedido.Metodo_Pago;
    //this.Pedido.Monto_Pagado = (parseFloat(this.Pedido.Monto_Pagado) + parseFloat(this.Pedido.Monto_Pagado2) + parseFloat(this.Pedido.Monto_Pagado3)).toString();
    this.Pedido.Total =this.TotalGeneral;
    await this.planoService.ActualizarDatosPedido(this.Pedido);
  }
  async calcularTotal(){
    this.Total = 0
    this.Iva = 0;
    this.SubTotal = 0;
    this.OrderTotal = 0;
    this.TotalGeneral = 0;
    for (let i = 0; i < this.OrderProducts.length; i++) {
      this.OrderProducts[i]['Sub_Total'] = parseFloat(this.OrderProducts[i]['Precio']) * parseFloat(this.OrderProducts[i]['Cantidad']);
      this.OrderProducts[i]['IVA'] = (this.OrderProducts[i]['Sub_Total'] * this.OrderProducts[i]['Impuesto']) / 100;
      this.OrderProducts[i]['IVA'] = parseFloat(this.OrderProducts[i]['IVA']).toFixed(2);
      this.OrderProducts[i]['Total'] = parseFloat(this.OrderProducts[i]['Sub_Total']) + parseFloat(this.OrderProducts[i]['IVA']);

      this.SubTotal =  this.SubTotal+ parseFloat(this.OrderProducts[i]['Sub_Total']);
      this.Iva = this.Iva + parseFloat(this.OrderProducts[i]['IVA']);
      this.OrderProducts[i]['Total'] = parseFloat(this.OrderProducts[i]['Total']).toFixed(2);
      this.Total = this.Total + parseFloat(this.OrderProducts[i]['Total']);
      this.OrderTotal = this.OrderTotal + parseFloat(this.OrderProducts[i]['Total'])
      this.TotalGeneral = this.OrderTotal;
    }
    //Validar que el servicio no se nulo
    if(this.Pedido.Servicio ==''){
      this.Pedido.Servicio = '0';
    }
    this.Pedido.Total = this.Total;
    this.Pedido.IVA = this.Iva;
    this.Pedido.Monto_Servicio = parseInt((parseFloat((this.SubTotal * parseInt(this.Pedido.Servicio) / 100).toString()).toFixed(0)));
    this.TotalGeneral = parseFloat(this.TotalGeneral.toString()) + parseFloat(this.Pedido.Monto_Servicio.toString());
    this.TotalGeneral =Math.round(this.TotalGeneral);
    return true;
  }
  calcularTotalFactura(){
    this.Total = 0
    this.Iva = 0;
    this.SubTotal = 0;
    this.OrderTotal = 0;
    this.TotalGeneral = 0;
    for (let i = 0; i < this.OrderProducts.length; i++) {
      if(this.OrderProducts[i]['Nueva_Cantidad'] === ""){
        this.OrderProducts[i]['Nueva_Cantidad'] = this.OrderProducts[i]['Cantidad'];
      }
      this.OrderProducts[i]['Sub_Total'] = parseFloat(this.OrderProducts[i]['Precio']) * parseFloat(this.OrderProducts[i]['Nueva_Cantidad']);
      this.OrderProducts[i]['IVA'] = (this.OrderProducts[i]['Sub_Total'] * this.OrderProducts[i]['Impuesto']) / 100;
      this.OrderProducts[i]['Total'] = this.OrderProducts[i]['Sub_Total'] + this.OrderProducts[i]['IVA'];
      this.SubTotal =  this.SubTotal+ parseFloat(this.OrderProducts[i]['Sub_Total']);
      this.Iva = this.Iva + parseFloat(this.OrderProducts[i]['IVA']);
      this.Total = this.Total + parseFloat(this.OrderProducts[i]['Total']);
      this.OrderTotal = this.OrderTotal + this.OrderProducts[i]['Total']
      this.TotalGeneral = this.OrderTotal;
    }
    this.Pedido.Total = Math.round(this.Total);
    this.Pedido.IVA = this.Iva;
    this.Pedido.Monto_Servicio = parseInt((parseFloat((this.SubTotal * parseInt(this.Pedido.Servicio) / 100).toString()).toFixed(0)));
    this.Pedido.Total = parseFloat(this.TotalGeneral.toString()) + parseFloat(this.Pedido.Monto_Servicio.toString());
    this.TotalGeneral = Math.round(this.Pedido.Total);
    this.Pedido.Monto_Pagado = Math.round(this.Pedido.Total);
    return true;
  }

  async generarFacturaElectronica(){
    //Actualizar la condicion de venta del Movimiento 
    await this.planoService.actualizarCondicionVentaPedido(this.Pedido.Id_Pedido,this.factura.Condicion_Venta);
    if(this.Pedido.Metodo_Pago == '99'){
      if(this.factura.Condicion_Venta == '02'){
        //Generar Cuenta por cobrar
        await this.apiService.postRecord('Call sp_Res_Crear_CxC(' + this.Pedido.Id_Pedido+ ')' );
      }
      await this.apiService.postRecord('Call sp_Inv_Movimiento_Pedido_Restaurante(' + this.Pedido.Id_Pedido+ ')' );
      // Actulizar Saldo de Caja
      await this.planoService.actualizarSaldoCaja(this.Pedido.Total);

    }else{
      await this.calcularTotal();
      let Invoice = {
        Id_Factura:'',
        Id_Cliente : '1',
        Nombre : this.Pedido.Nombre,
        Correo : this.factura.Correo,
        Numero_Identificacion : this.factura.Numero_Identificacion,
        Codigo_Identificacion : this.factura.Codigo_Identificacion,
        Metodo_Pago : this.Pedido.Metodo_Pago,
        Plazo_Credito:'0',
        Condicion_Venta:this.factura.Condicion_Venta,
        IVA:this.Iva,
        Sub_Total:this.SubTotal,
        Total:this.Total,
        Tipo_Documento:this.factura.Tipo_Documento,
        Moneda:'CRC',
        Tipo_Cambio:this.tipoCambio.venta,
        Sistema_Origen:'RES',
        Registro_Origen:this.Pedido.Id_Pedido,
        Notas: 'Rest-Orden:'+ this.Mesa.Id_Mesa + '-'+this.Pedido.Id_Pedido
      }
      let data = await this.invoiceService.insertHeader(Invoice, this.Caja,this.Exoneracion);
      Invoice.Id_Factura = data["data"][0]["Identity"];
      //Actualizar el Id de la factura en el pedido
      await this.restaurantInvoiceService.UpdateIdFactura(Invoice.Id_Factura,this.Pedido.Id_Pedido);
      for (let i = 0; i < this.OrderProducts.length; i++) {
          await this.grabarUnDetalleFactura(i,Invoice.Id_Factura);
      }
      //aplicar la factura
      await this.apiService.postRecord('Call sp_Ven_Aplicar_Factura(' + Invoice.Id_Factura+ ')' );
      //
      if(this.Regimen !== '3' ){
        this.PantallaLoading = false;
        this.AplicandoFacturaHacienda(Invoice.Id_Factura);
      }
    }
  }

  async grabarUnDetalleFactura(i,Id_Factura) {
    if(this.OrderProducts[i]['Facturar']==0){
      return false;
    }
    let Sub_Total = parseInt(this.OrderProducts[i]['Facturar']) * parseFloat(this.OrderProducts[i]['Precio']);
    let IVA = (Sub_Total * this.OrderProducts[i]['Impuesto']) /100;
    let Total = Sub_Total + IVA;
    this.Detalle['Codigo_Referencia'] = this.OrderProducts[i]['Codigo'];
    this.Detalle['SKU'] = this.OrderProducts[i]['Codigo'];
    this.Detalle['Descripcion'] = this.OrderProducts[i]['Descripcion'];
    this.Detalle['Id_Factura_detalle'] = this.OrderProducts[i]['Id_Factura_detalle'];
    this.Detalle['Id_Factura'] = this.OrderProducts[i]['Id_Factura'];
    this.Detalle['Precio'] = parseFloat(this.OrderProducts[i]['Precio']);
    this.Detalle['Id_Producto'] = this.OrderProducts[i]['Id_Producto'];
    this.Detalle['Cantidad'] = parseInt(this.OrderProducts[i]['Facturar']);
    this.Detalle['Total'] = Total;
    this.Detalle['Sub_Total'] = Sub_Total; // / 1.13 ;
    this.Detalle['IVA'] = IVA; ;
    this.Detalle['Unidad_Medida'] = 'Unid';
    this.Detalle['Tipo_Codigo'] = '1';
    this.Detalle['IVAPorcentaje'] = this.OrderProducts[i]['Impuesto'];

    let data = await this.invoiceService.insertDetail(this.Detalle,Id_Factura);
    //actualizar el detalle del pedido
    await this.restaurantInvoiceService.updateAmount(this.OrderProducts[i]['Id_Pedido_Detalle'],this.OrderProducts[i]['Facturar'])
    return true;
  }

  async AplicandoFacturaHacienda(Id_Factura){
    this.MensajeLoading = ''; 
    let data = await this.apiService.aplicarFacturaHacienda(Id_Factura);
    if(data['success'] == 'false'){
      Swal.fire('Error: ' + data['error']);
      return false;
    }
    if(data['respuesta'] == "procesando"){
      this.MensajeLoading = 'Hacienda respondio que esta procesando..';
      //this.AplicandoFacturaHacienda(Id_Factura);
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
    }
    return true;
  }

  cambioPago(event){
    if (event.key === "Enter") {
      this.cambiarMetodoPago();
    }
  }

  cambiarMetodoPago(){
    this.factura.MontoCobrado = (this.Pedido.Monto_Pagado) + (this.Pedido.Monto_Pagado2) + (this.Pedido.Monto_Pagado3);

    this.Pedido.Saldo = ( this.Pedido.Monto_Pagado - this.TotalGeneral ).toString();

    if(this.cobro2 == false){
      this.Pedido.Saldo2 = '0';
      if((parseFloat(this.Pedido.Monto_Pagado.toString())  )<this.TotalGeneral){
        this.cobro2 = true;
        this.Pedido.Monto_Pagado2 = Math.abs(parseFloat(this.Pedido.Saldo));
        this.Pedido.Saldo2 = ((parseFloat(this.Pedido.Monto_Pagado.toString()) + parseFloat(this.Pedido.Monto_Pagado2.toString())) - this.TotalGeneral ).toString();
      }
    }else{
      if(this.cobro3 == false){
        if(( parseFloat(this.Pedido.Monto_Pagado.toString()) + parseFloat(this.Pedido.Monto_Pagado2.toString()) ) < this.TotalGeneral ){
          this.Pedido.Saldo3 = '0';
          //if((this.Pedido.Monto_Pagado2) > 0)
          this.Pedido.Saldo3 =  ((parseFloat(this.Pedido.Monto_Pagado.toString()) + parseFloat(this.Pedido.Monto_Pagado2.toString()) + parseFloat(this.Pedido.Monto_Pagado3.toString())) - this.TotalGeneral ).toString();
          this.Pedido.Saldo2 = this.Pedido.Saldo3;
          this.Pedido.Monto_Pagado3 = Math.abs(parseFloat(this.Pedido.Saldo2));
          //this.Pedido.Monto_Pagado3 = Math.abs(parseFloat(this.Pedido.Saldo2));
          this.cobro3 = true;
        }
      }else{
        this.Pedido.Saldo3 =  ((parseFloat(this.Pedido.Monto_Pagado.toString()) + parseFloat(this.Pedido.Monto_Pagado2.toString()) + parseFloat(this.Pedido.Monto_Pagado3.toString())) - this.TotalGeneral ).toString();
      }

    }
  }
  cambiarPlano(Pantalla){
    if(Pantalla == 1){
      this.PantallaPlano = false;
      this.PantallaLista = true;
    }else{
      if(Pantalla == 2){
        this.PantallaPlano = true;
        this.PantallaLista = false;
      }else{
        this.loadPlaces();
      }
    }
  }

  async SeleccionarComponente(Componente,i,j){
    for (let ComponenteInterno of this.Componentes[i]){
      if(ComponenteInterno['Nombre'] == Componente['Nombre']){
        ComponenteInterno['Selected'] = 1;
        // Leer si Existen Sub Componentes que deben ser seleccionados.
        let subComponentes = await this.restaurantOrderService.loadSubComponete(Componente['Id_Producto_Componente']);
        if(subComponentes['total'] > 1){
          //Desplegar la Información del Sub componente.
          ComponenteInterno['Display'] = 1;
          ComponenteInterno['Sub_Compoente'] = subComponentes['data'];
        }else{
          ComponenteInterno['Display'] = 0;
        }
      }else{
        ComponenteInterno['Selected'] = 0;
        ComponenteInterno['Display'] = 0;
      }
    }
  }

  async agregarComponete(){
    //Recorrer el Array de componentes para asegurarse que se han seleccionado todas las opciones obligatorias
    let Seleccionado = false;
    for (let ComponenteInterno of this.Componentes){
      Seleccionado = false;
      for (let Componente of ComponenteInterno){
        if(Componente['Selected'] == 1){
          Seleccionado = true;
        }
      }
      if(Seleccionado == false){
        Swal.fire('Debe seleccionar una de las opciones');
        return false;
      }
    }
    // Abrir pantalla con los productos adicionales
    //Leer los Adicionales del producto
    await this.leerAdicionales();
    this.PantallaAdicionales = true;
    this.PantallaOpciones = false;
    return true;
  }
  async leerAdicionales(){
    this.Adicionales = [];
    let componentes = await this.restaurantOrderService.loadComponete(this.Id_Articulo,2);
    if(componentes['total'] != 0){
      //this.Componentes = ;
      let Grupo = 1;
      let row = [];
      for (let Componente of componentes['data']){
        if(parseInt(Componente['Grupo']) == Grupo){
          row.push(Componente);
        }else{
          if(row.length > 0){
            this.Adicionales.push(row);
            Grupo++;
            row =[];
            row.push(Componente);
          }
        }
      }
      if(row.length > 0){
        this.Adicionales.push(row);
      }
    }
  }
  closePantallaOpciones(){
    this.PantallaOpciones = false;
  }
  getColor(current): string {
    if(current%2==0) {
      return 'blue';
    } else {
      return 'black';
    }
  }
  async SeleccionarAdicional(Componente,i,j){
    for (let ComponenteInterno of this.Adicionales[i]){
      if(ComponenteInterno['Nombre'] == Componente['Nombre']){

        ComponenteInterno['Selected'] = 1 //!ComponenteInterno['Selected'];
        // Leer si Existen Sub Componentes que deben ser seleccionados.
        let subComponentes = await this.restaurantOrderService.loadSubComponete(Componente['Id_Producto_Componente']);
        if(subComponentes['total'] > 1){
          //Desplegar la Información del Sub componente.
          ComponenteInterno['Display'] = 1;
          ComponenteInterno['Sub_Compoente'] = subComponentes['data'];
        }else{
          ComponenteInterno['Display'] = 0;
        }
        if(!ComponenteInterno['Selected']){
          ComponenteInterno['Display'] = 0;
        }
      }
    }
  }
  async quitarSeleccionarAdicional (Componente,i,j){
    for (let ComponenteInterno of this.Adicionales[i]){
      if(ComponenteInterno['Nombre'] == Componente['Nombre']){
        ComponenteInterno['Selected'] = '0';
        ComponenteInterno['Display'] = 0;
      }
    }
  }
  async agregarAdicional(){
    // this.SaveArticle(this.Article);
    this.agregarArticulo(this.Articulo);
    this.PantallaAdicionales = false;
  }
  closePantallaAdicionales(){
    this.PantallaAdicionales = false;
  }
  LeerCuentasPorMesa(){
    this.PedidoSeleccionado =false;
    this.ProductosOrdenActual = JSON.parse(JSON.stringify(this.OrderProducts));
    this.ProductosOrdenNueva = [];
    this.TotalOrdenNueva = 0;
    if(this.Pedido.Id_Nueva_Mesa != this.Pedido.Id_Mesa){
      this.LeerPedidosAbiertosMesa(this.Pedido.Id_Nueva_Mesa);
    }else{
      this.LeerPedidosAbiertosMesa(this.Pedido.Id_Mesa);
    }
  }
  RestarArticuloDetalle(Producto,Indice){

    this.Pedido.Pedido_Alterado = true;
    let Cantidad = 0;
    let NuevaCantidad = 0;
    Cantidad = parseInt(this.OrderProducts[Indice]['Cantidad']);
    if(this.OrderProducts[Indice]['Nueva_Cantidad']){
      NuevaCantidad = parseInt(this.OrderProducts[Indice]['Nueva_Cantidad']);
    }
    if(this.OrderProducts[Indice]['Nueva_Cantidad'] == ''){
      NuevaCantidad = this.OrderProducts[Indice]['Cantidad'];
    }
    if(this.OrderProducts[Indice]['Nueva_Cantidad'] === 0){
      return false;
    }
    this.OrderProducts[Indice]['Nueva_Cantidad'] = NuevaCantidad  - 1;
    this.calcularTotalFactura();
    return true;
  }

  SuprimirArticuloDetalle(Producto,Indice){
    if(!this.OrderProducts[Indice]['Nueva_Cantidad']){
      this.OrderProducts[Indice]['Nueva_Cantidad'] = this.OrderProducts[Indice]['Cantidad'];
    }
    this.Pedido.Pedido_Alterado = true;
    this.OrderProducts[Indice]['Nueva_Cantidad'] = 0;
    this.calcularTotalFactura();
  }
  async AgregarNota(){
    await this.planoService.agregarNota(this.Articulo);
    this.cerrarPantallaClave();
  }

  CalcularTotal(Producto){
    Producto.Sub_Total = Producto.Cantidad * parseFloat(Producto.Precio);
    Producto.IVA = ( Producto.Sub_Total * parseFloat(Producto.Impuesto) ) /100;
    Producto.Total = Producto.Sub_Total + Producto.IVA;
    return Producto;
  }
  async cambiarTodosLasCantidades(Producto,indice){
    if(Producto.Cantidad == 0){
      this.ProductosOrdenActual.splice(indice,1);
      return false;
    }
    
    //buscar el Id del Producto en el array Nuevo
    let ProductoEntontrado = false;
    let NuevoProducto = JSON.parse(JSON.stringify(Producto)) ;
  
    NuevoProducto.Id_Pedido ='';
    //NuevoProducto.Id_Pedido_Detalle = '';
    NuevoProducto.Cantidad = Producto.Cantidad;

    NuevoProducto = this.CalcularTotal(NuevoProducto);
  
    for (let Componente of this.ProductosOrdenNueva){
      if(Producto.Id_Producto == Componente.Id_Producto){
        Componente.Cantidad = parseInt(Componente.Cantidad) + parseInt(Producto.Cantidad);
        Producto.Cantidad = 0;
        Producto = this.CalcularTotal(Producto);
        Componente = this.CalcularTotal(Componente);
        ProductoEntontrado = true;
      }
    }
  
    if(ProductoEntontrado == false){
      this.ProductosOrdenNueva.push(NuevoProducto);
      Producto.Cantidad = 0;
      Producto = this.CalcularTotal(Producto);
    }else{
      //Agregar los productos
    }
    
    if(Producto.Cantidad == 0){
      this.ProductosOrdenActual.splice(indice,1);
    }
    this.TotalizarPedidoActual();
    this.TotalizarPedidoNuevo();
    
    return true;
  }


  async PasarProductoAOrdenNueva(Producto,indice){
    if(Producto.Cantidad == 0){
      this.ProductosOrdenActual.splice(indice,1);
      return false;
    }
    //buscar el Id del Producto en el array Nuevo
    let ProductoEntontrado = false;
    let NuevoProducto = JSON.parse(JSON.stringify(Producto)) ;
    NuevoProducto.Id_Pedido ='';
    //NuevoProducto.Id_Pedido_Detalle = '';
    NuevoProducto.Cantidad = 1;
    NuevoProducto = this.CalcularTotal(NuevoProducto);
    for (let Componente of this.ProductosOrdenNueva){
      if(Producto.Id_Producto == Componente.Id_Producto){
        Producto.Cantidad = Producto.Cantidad -1;
        Componente.Cantidad = parseInt(Componente.Cantidad) + 1;
        Producto = this.CalcularTotal(Producto);
        Componente = this.CalcularTotal(Componente);
        ProductoEntontrado = true;
      }
    }
   
    if(ProductoEntontrado == false){
      this.ProductosOrdenNueva.push(NuevoProducto);
      Producto.Cantidad = Producto.Cantidad -1;
      Producto = this.CalcularTotal(Producto);
    }
    if(Producto.Cantidad == 0){
      this.ProductosOrdenActual.splice(indice,1);
    }

    this.TotalizarPedidoActual();
    this.TotalizarPedidoNuevo();
    return true;
  }
  async PasarProductoaOrdenOriginal(Producto,indice){
    return false;
    if(Producto.Cantidad == 0){
      this.ProductosOrdenNueva.splice(indice,1);
      return false;
    }
    //buscar el Id del Producto en el array Nuevo
    let ProductoEntontrado = false;
    let NuevoProducto = JSON.parse(JSON.stringify(Producto));
    NuevoProducto.Id_Pedido ='';
    //NuevoProducto.Id_Pedido_Detalle = '';
    NuevoProducto.Cantidad = 1;
    for (let Componente of this.ProductosOrdenActual){
      if(Producto.Id_Producto == Componente.Id_Producto){
        Producto.Cantidad = parseInt(Producto.Cantidad)-1;
        Componente.Cantidad = parseInt(Componente.Cantidad) + 1;
        ProductoEntontrado = true;
      }
    }
    if(ProductoEntontrado == false){
      this.ProductosOrdenActual.push(NuevoProducto);
      Producto.Cantidad = Producto.Cantidad -1;
    }
    if(Producto.Cantidad == 0){
      this.ProductosOrdenNueva.splice(indice,1);
    }
    this.TotalizarPedidoActual();
    this.TotalizarPedidoNuevo();
    
    return true;
  }
  async cambiarTodosLosProductos(){
    let NuevoProductosOrdenActual = JSON.parse(JSON.stringify(this.ProductosOrdenActual));
    for (let Articulo of NuevoProductosOrdenActual){
      await this.cambiarTodosLasCantidades(Articulo,0);
    }
    this.ProductosOrdenActual = [];
    this.TotalizarPedidoActual();
    this.TotalizarPedidoNuevo();
  }

  cerrarPantallaCambiarMesa(){
    this.PantallaInfoCuenta = true;
    this.PantallaCambiarMesa = false;
  }
  async LeerProductosPedido(){
    this.PedidoSeleccionado = true;
    this.ProductosOrdenActual = JSON.parse(JSON.stringify(this.OrderProducts));
    this.ProductosOrdenNueva = [];
    this.TotalOrdenNueva = 0;
    if(this.Pedido.Id_Pedido == this.Pedido.Id_Nuevo_Pedido){
      Swal.fire("Se esta seleccionando la misma cuenta");
      this.Pedido.Id_Nuevo_Pedido = '-99';
      return false;
    }
    await this.loadOrderProducts(this.Pedido.Id_Nuevo_Pedido,2);
    
    this.TotalizarPedidoNuevo();
    return true;
  }
  TotalizarPedidoActual(){
    this.TotalOrdenActual = 0
    for (let Componente of this.ProductosOrdenActual){
      this.TotalOrdenActual =  this.TotalOrdenActual + parseInt(Componente.Total);
    }
  }
  TotalizarPedidoNuevo(){
    this.TotalOrdenNueva = 0
    for (let Componente of this.ProductosOrdenNueva){
      this.TotalOrdenNueva =this.TotalOrdenNueva+  parseInt(Componente.Total);
    }
  }
  async cambiarProductosCuenta(){
    this.PantallaLoading =true;
    // Cuenta Nuevo
    if(this.Pedido.Id_Nuevo_Pedido == '-99'){
      //Cuenta No existe
      //alert("Cuenta No existe")
      await this.CrearPedidoNuevo();
    }
    //Actualizar cada uno de los productos al pedido existente.
    await this.ActualizarProductosAPedidoExistente();
    // Pedido Actual
    // Recorrer La orden y evaluarla contra los cambios
    await this.ActualizarPedidoActual();
    await this.calcularTotal();
    
    await this.cerrarPantallaCambiarMesa();
    //Cargar Las cuentas
    await this.LeerPedidosAbiertosMesa(this.Mesa.Id_Mesa);
    this.PantallaLoading = false;
  }
  async CrearPedidoNuevo(){
    let cuenta = {
      Id_Mesa: this.Pedido.Id_Nueva_Mesa,
      Id_Zona: this.Pedido.Id_Nueva_Zona,
      Nombre: this.Pedido.Nombre + '1',
      Servicio:this.Pedido.Servicio,
      Estado:1
    }
    let data = await this.planoService.NuevaCuenta(cuenta);
    let NuevoId = data['Identity'];
    this.Pedido.Id_Nuevo_Pedido = NuevoId;
    await this.restaurantOrderService.placeOccuped(this.Pedido.Id_Nueva_Mesa);
    //Recargar el Plano
    await this.loadPlaces();
  }
  async ActualizarPedidoActual(){
    let encontrado = false;
    let Largo = this.OrderProducts.length;
   
    
    // hay que recorrer el Actual y si los articulos no estan en el original hay que agregarlos al original.
    for (let Componente of this.ProductosOrdenActual){
      let encontrado = false;
      for (let articulo of this.OrderProducts){
        if(Componente.Id_Producto == articulo.Id_Producto){
          encontrado = true;
        }
      }
      if(encontrado == false){
        //Agregar el Articulo a la lista Original.
        //Componente.Id_Pedido_Detalle = '';
        this.OrderProducts.push(Componente)
      }
    }

    //Recorriendo el Original y se obtiene la primera instancia del Original
    while (Largo --){
      let Articulo = this.OrderProducts[Largo];
      encontrado = false
      //Se recorre el actual para ver si el actual esta en el original.
      for (let Componente of this.ProductosOrdenActual){
        if(this.OrderProducts[Largo].Id_Producto == Componente.Id_Producto){
          this.OrderProducts[Largo] = Componente;
          encontrado = true;
        }
      }
      // Si no esta en el actual pero si en el Original entonces hay que poner todo en ceros En el original.
      if(encontrado == false){
        // El Articulo no esta en la lista original
          Articulo.Cantidad = 0;
          Articulo.Sub_Total = 0;
          Articulo.IVA = 0;
          Articulo.Total = 0;
      }
    }
    
    let Posicion = 0;
    let Sub_Total = 0;
    let IVA = 0;
    let Total = 0;

    Largo = this.OrderProducts.length;
    while (Largo --){
      let Articulo = this.OrderProducts[Largo];
      //Actualizar la base de datos;
      
      if(Articulo.Id_Pedido_Detalle == ''){
        await this.restaurantOrderService.addProduct(Articulo,this.Pedido.Id_Pedido);
      }else{
        await this.restaurantOrderService.UpdateProductPrice(Articulo.Id_Pedido_Detalle,Articulo.Precio,Articulo.Cantidad,Articulo.Total);
      }

      if(Articulo.Cantidad == 0){
       
        this.OrderProducts.splice(Largo,1);
      }else{
        Sub_Total = Sub_Total + parseFloat(Articulo.Sub_Total);
        IVA = IVA + parseFloat(Articulo.IVA);
        Total = Total + parseFloat(Articulo.Total);
      }
      Posicion = Posicion + 1;
    }



    this.OrderProducts = JSON.parse(JSON.stringify(this.ProductosOrdenActual));
    this.calcularTotal();
    //Actualizar los Totales del Pedido
    await this.restaurantOrderService.UpdateOrderTotal(Sub_Total,IVA,Total,this.Pedido.Id_Pedido); 
    if(this.OrderProducts.length == 0){
      this.cerrarPedido();
    }
  }
  async ActualizarProductosAPedidoExistente(){
    //Leer el producto para ver si hay que actualizar o insertar. 
    let data = await this.restaurantOrderService.loadOrderProducts(this.Pedido.Id_Nuevo_Pedido);
    let OrdenNueva = data['data'];
    let Posicion = 0;
    let Sub_Total = 0;
    let IVA = 0;
    let Total = 0;
    //Verificiar si la orden nueva no tiene productos entonces actualizar a cero todos los productos de la orden
    if(this.ProductosOrdenNueva.length == 0){
      await this.planoService.ponerACeroTodo(this.Pedido.Id_Nuevo_Pedido);
      Sub_Total = 0;
      IVA = 0;
      Total = 0;
    }
    for (let Componente of this.ProductosOrdenNueva){
      Sub_Total = Sub_Total + parseFloat(Componente.Sub_Total);
      IVA = IVA + parseFloat(Componente.IVA);
      Total = Total + parseFloat(Componente.Total);
      let Nuevo = true;
      for (let Producto of OrdenNueva){
        if(Componente.Id_Producto == Producto.Id_Producto){
          Nuevo = false;
        }
      }
     
      if(Nuevo){
        await this.restaurantOrderService.addProduct(Componente,this.Pedido.Id_Nuevo_Pedido);
      }else{
        await this.restaurantOrderService.UpdateProductPrice(Componente.Id_Pedido_Detalle,Componente.Precio,Componente.Cantidad,Componente.Total);
      }
    }
    //Actualizar los Totales del Pedido
    await this.restaurantOrderService.UpdateOrderTotal(Sub_Total,IVA,Total,this.Pedido.Id_Nuevo_Pedido); 
  }

}
