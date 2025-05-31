import { RestaurantInvoiceService } from './restaurant-invoice.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { InvoiceService } from '../../../../../factura/src/app/sales/invoice/invoice.service';
import { RestaurantZoneService } from '../restaurant-zone/restaurant-zone.service';
import { RestaurantPlaceService } from '../restaurant-place/restaurant-place.service';

@Component({
  selector: 'app-restaurant-invoice',
  templateUrl: './restaurant-invoice.component.html',
  styleUrls: ['./restaurant-invoice.component.css']
})
export class RestaurantInvoiceComponent implements OnInit {

  constructor(
    private restaurantInvoiceService:RestaurantInvoiceService,
    private invoiceService:InvoiceService,
    private apiService: ApiService,
    private route:Router,
    private restaurantZoneService:RestaurantZoneService,
    private restaurantPlaceService:RestaurantPlaceService
    ) { }
  EstadoOrdenes = 1;
  PantallaEfectivo = false;
  Facturada = false;
  PantallaPedido = false;
  facturando = false;
  Total = 0;
  SubTotal = 0;
  Iva = 0;
  MontoCobrado = 0;
  PantallaTiquete = false;
  iFrame = '';
  Zonas = [];
  Mesas = [];
  Orders = [];
  ResZonas = true;
  OrderDetails = [];
  searchField = ""
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Exoneracion = {
    Exonerada : 0,
    Exo_Numero_Documento : '',
    Exo_Nombre_Institucion : '',
    Exo_Fecha_Emision : '',
    Exo_Porcentaje : '0',
    Exo_Monto : '0'
  }
  edit = false;
  Caja = '';
  hoy = new Date();
  Pedido = {
    Id_Pedido:'',
    Nombre:'Cliente de Contado',
    Id_Zona:'',
    Zona_Nombre:'',
    Tipo_Cuenta:'',
    Id_Mesa:'',
    Mesa_Zona:'',
    Metodo_Pago:'01',
    Estado:'',
    Id_Factura:''
  }
  tipoCambio = {
    compra: "",
    venta: "",
    fecha: "",
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
    SKU:''
  }
  ngOnInit(): void {
    this.loadCaja();
    this.obtenerTC();
    this.loadOrders(1);
    this.loadZones();
    /*
    setInterval(()=>{
      this.loadOrders();
    },6000);*/

  }
  async loadZones(){
    let data = await this.restaurantZoneService.loadZones(this.paginacion,'');
    this.Zonas = data['data'];
  }
  async loadPlaces(Id_Zona){
    let data = await this.restaurantPlaceService.loadPlacesZone(Id_Zona);
    this.Mesas = data['data'];
  }
  newOrder(){
    this.PantallaPedido = true;
  }
  CloseOrders(){
    this.loadOrders(1);
    this.PantallaPedido = false;
  }
  async loadCaja(){
    this.Caja = localStorage.getItem("Id_Caja");
    /*if(!this.Caja){
      let data = await this.invoiceService.loadCaja();
      this.Caja = data['data'][0]['Id_Caja'];
    }*/
    if(!this.Caja){
      //No permitir facturar si no está habierta la caja
      Swal.fire('No esta habierta una caja, No se puede facturar');
      this.Caja = '';
      this.route.navigate(['/']);
      return false;
    }
    return true;
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
  async loadOrders(Estado){
    this.EstadoOrdenes = Estado;
    let data = await this.restaurantInvoiceService.loadOrders(this.ResZonas,Estado);
    if(data['total'] == 0){
      this.Orders = [];
    }else{
      this.Orders = data['data'];
    }
  }


/** */

  async editRecord(Pedido){
    this.edit = true;
    if(Pedido){
      this.Pedido = Pedido;
      if(Pedido.Nombre){
        this.Pedido.Nombre = Pedido.Nombre;
      }else{
        this.Pedido.Nombre = Pedido.Cliente;
      }
      this.loadOrderDetails();
      //();
    }else{
      this.Pedido = {
        Id_Pedido:'',
        Nombre:'Cliente de Contado',
        Id_Zona:'',
        Zona_Nombre:'',
        Tipo_Cuenta:'',
        Id_Mesa:'',
        Mesa_Zona:'',
        Metodo_Pago:'01',
        Estado:'',
        Id_Factura:''
      }
    }
    if(this.Pedido.Metodo_Pago == ''){
      //this.Pedido.Nombre = 'Cliente de Contado';
      this.Pedido.Metodo_Pago = '01';
    }
  }
  async loadOrderDetails(){
    if(this.EstadoOrdenes==2){
      this.Facturada = true;
    }else{
      this.Facturada = false;
    }
    let data = await this.restaurantInvoiceService.loadOrderDetails(this.Pedido.Id_Pedido,this.EstadoOrdenes);
    if(data['total'] == 0){
      this.OrderDetails = [];
      await this.restaurantInvoiceService.updateStatus(this.Pedido.Id_Pedido);
      //Cambiar Estatus de la mesa;
      await this.restaurantInvoiceService.updatePlaceStatus(this.Pedido.Id_Mesa);
      Swal.fire('Orden ya fue facturada en su totalidad');
      this.cancel();
    }else{
      this.OrderDetails = data['data'];
      let Cantidad = 0;
      let Facturado = 0;
      let Facturar = 0;
      for (let i = 0; i < this.OrderDetails.length; i++) {
        if(this.OrderDetails[i]['Facturado'] == ''){
          this.OrderDetails[i]['Facturado'] = 0;
        }
        Cantidad = parseFloat(this.OrderDetails[i]['Cantidad']);
        Facturado = parseFloat(this.OrderDetails[i]['Facturado']);

        Facturar = Cantidad - Facturado;
        this.OrderDetails[i]['Facturar']  = Facturar;
        //this.OrderDetails[i]['Facturar'] = parseInt(this.OrderDetails['Cantidad']) - parseInt(this.OrderDetails['Facturado']);
      }
    }
    this.calcularTotal();
    this.loadPlaces(this.Pedido.Id_Zona);
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
    //this.loadZones();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  cambiarZona(){
    this.loadPlaces(this.Pedido.Id_Zona);
  }
  async cambiarMesa(){
    await this.restaurantInvoiceService.updatePlace(this.Pedido.Id_Pedido,this.Pedido.Id_Zona,this.Pedido.Id_Mesa);
    Swal.fire('Cliente cambiado de sitio');
    this.loadOrders(1);
  }
  async calcularTotal(){
    this.Total = 0
    this.Iva = 0;
    this.SubTotal = 0;
    for (let i = 0; i < this.OrderDetails.length; i++) {
      if(parseFloat(this.OrderDetails[i]['Cantidad']) < parseFloat(this.OrderDetails[i]['Facturar'])){
        Swal.fire('Esta tratando de facturar mas ' + this.OrderDetails[i]['Descripcion'] + ' que los que fue despachados.');
        this.facturando = false;
        return false;
      }
      if(this.Facturada == true){
        this.Total = this.Total + (this.OrderDetails[i]['Cantidad'] * this.OrderDetails[i]['Precio']);
      }else{
        this.Total = this.Total + (this.OrderDetails[i]['Facturar'] * this.OrderDetails[i]['Precio']);
      }

      this.SubTotal = this.Total; /// 1.13;
      this.Iva = this.Total - this.SubTotal;
    }
    return true;
  }

  async cerrarPantallaEfectivo(){
    this.PantallaEfectivo =false;
  }
  async facturar(){
    if(this.Pedido.Metodo_Pago == '01'){
      // Abrir pantalla de Cobro
      this.MontoCobrado = 0;
      this.PantallaEfectivo = true;
    }else{
      this.facturar1();
    }
  }

  async facturar1(){

    this.facturando = true;
    //Verificar si quiere factura más articulos de los depachados.
    await this.calcularTotal();
    //Generar Encabezado de Factura.
    let Invoice = {
      Id_Factura:'',
      Id_Cliente : '1',
      Nombre : this.Pedido.Nombre,
      Correo : '',
      Numero_Identificacion : '',
      Codigo_Identificacion : '01',
      Metodo_Pago : this.Pedido.Metodo_Pago,
      Plazo_Credito:'0',
      Condicion_Venta:'01',
      IVA:this.Iva,
      Sub_Total:this.SubTotal,
      Total:this.Total,
      Tipo_Documento:'04',
      Moneda:'CRC',
      Tipo_Cambio:this.tipoCambio.venta,
      Notas: 'Orden '+ this.Pedido.Id_Mesa
    }

    let data = await this.invoiceService.insertHeader(Invoice, this.Caja,this.Exoneracion);
    Invoice.Id_Factura = data["Identity"];
    //Actualizar el Id de la factura en el pedido
    await this.restaurantInvoiceService.UpdateIdFactura(Invoice.Id_Factura,this.Pedido.Id_Pedido);
    //Generar Detalle de Factura.
    let detalles = 0;
    for (let i = 0; i < this.OrderDetails.length; i++) {
      if(this.OrderDetails[i]['Facturar'] > 0){
        detalles = detalles + 1;
        this.grabarUnDetalleFactura(i,Invoice.Id_Factura);
        //Disminuir la cantidad de productos Facturados.
        this.OrderDetails[i]['Cantidad'] = this.OrderDetails[i]['Cantidad']  - this.OrderDetails[i]['Facturar'];
        //Actualizar los Datos en la base de datos.
        await this.restaurantInvoiceService.updateAmount(this.OrderDetails[i]['Id_Pedido_Detalle'],this.OrderDetails[i]['Facturar'])
      }
    }
    let Ordenes = [];

    //Eliminar los registros que fueron facturados al 100 %
    for (let i = 0; i < this.OrderDetails.length; i++) {
      if(this.OrderDetails[i]['Cantidad'] > 0){
        Ordenes.push(this.OrderDetails[i]);
      }
    }
    this.OrderDetails = Ordenes;
    if(detalles == 0){
      Swal.fire('No se seleccionaron productos a facturar.');
      this.facturando = false;
      return false;
    }
    //Si No hay más lineas de detalle para facturar, Actualizar Estado.
    if(this.OrderDetails.length == 0){
      await this.restaurantInvoiceService.updateStatus(this.Pedido.Id_Pedido);
      await this.restaurantInvoiceService.updatePlaceStatus(this.Pedido.Id_Mesa);
    }
    //Imprimir Tiquete de Caja.
    await this.apiService.postRecord('Call sp_Ven_Aplicar_Factura(' + Invoice.Id_Factura+ ')' );
    this.imprimirTiquete(Invoice.Id_Factura);
    this.facturando = false;
    if (this.OrderDetails.length == 0 ){
      this.loadOrders(1);
      this.edit = false;
    }
    return true;
  }
  async grabarUnDetalleFactura(i,Id_Factura) {
    this.Detalle['Codigo_Referencia'] = this.OrderDetails[i]['Id_Producto'];
    this.Detalle['SKU'] = this.OrderDetails[i]['Id_Producto'];
    this.Detalle['Descripcion'] = this.OrderDetails[i]['Descripcion'];
    this.Detalle['Id_Factura_detalle'] = this.OrderDetails[i]['Id_Factura_detalle'];
    this.Detalle['Id_Factura'] = this.OrderDetails[i]['Id_Factura'];
    this.Detalle['Unidad_Medida'] = this.OrderDetails[i]['Unidad_Medida'];
    this.Detalle['Precio'] = parseFloat(this.OrderDetails[i]['Precio']);
    this.Detalle['Id_Producto'] = this.OrderDetails[i]['Id_Producto'];
    this.Detalle['Cantidad'] = parseInt(this.OrderDetails[i]['Facturar']);
    this.Detalle['Total'] = this.Detalle['Precio'] * this.Detalle['Cantidad'];
    this.Detalle['Sub_Total'] = this.Detalle['Total']; // / 1.13 ;
    this.Detalle['IVA'] = this.Detalle['Total']  -  this.Detalle['Sub_Total'];
    this.Detalle['Unidad_Medida'] = 'Unid';
    let data = await this.invoiceService.insertDetail(this.Detalle,Id_Factura);
  }
  imprimirTiquete(Id_Factura){
    if(Id_Factura == ''){
      Id_Factura = this.Pedido.Id_Factura;
    }
    window.open('https://toxo.work/reportes/factura/tiquete-caja.php?IdDocument='+Id_Factura);
  }
  imprimirTiqueteCaja(){
    window.open('https://toxo.work/reportes/bar/cuenta.php?IdDocument='+this.Pedido.Id_Pedido);
  }
  search(){
    //this.loadZones(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    /*
    if(this.Zone.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre de la Zona');
      return false;
    }
    let data = await this.restaurantInvoiceService.saveZone(this.Zone);
    if(data['success'] =='true'){
      Swal.fire('Zona grabada correctamente');
      //this.loadZones(this.searchField);
      this.edit = false;
    }*/
   }

}
