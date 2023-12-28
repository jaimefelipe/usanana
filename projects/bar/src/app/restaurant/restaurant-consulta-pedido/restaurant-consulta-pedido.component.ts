import { Component, OnInit } from '@angular/core';
import { RestaurantConsultaPedidoService } from './restaurant-consulta-pedido.service';
import { RestaurantOrderService } from '../restaurant-order/restaurant-order.service';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import { PlanoService } from '../plano/plano.service';
import { InvoiceService } from '../../../../../factura/src/app/sales/invoice/invoice.service';
import { RestaurantInvoiceService } from '../restaurant-invoice/restaurant-invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurant-consulta-pedido',
  templateUrl: './restaurant-consulta-pedido.component.html',
  styleUrls: ['./restaurant-consulta-pedido.component.css']
})
export class RestaurantConsultaPedidoComponent implements OnInit {

  constructor(
    private restaurantConsultaPedidoService:RestaurantConsultaPedidoService,
    private restaurantOrderService:RestaurantOrderService,
    private apiService:ApiService,
    private planoService:PlanoService,
    private invoiceService:InvoiceService,
    private restaurantInvoiceService:RestaurantInvoiceService,
    ) { }

  edit = false;
  hoy = new Date();
  searchField = '';
  Regimen = '';
  Caja = '';

  Total = 0
  Iva = 0;
  SubTotal = 0;
  OrderTotal = 0;
  TotalGeneral = 0;

  Pedidos = [];
  Detalles = [];
  OrderProducts = [];

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Pedido = {
    Id_Pedido:'',
    Nombre:'',
    Estado:'',
    Mesa:'',
    Zona:'',
    Creado_El:'',
    Creado_Por:'',
    Id_Factura:'',
    Id_Caja_Diaria:'',
    Metodo_Pago:'',
    Total:0,
    Id_Mesa:'',
    Id_Zona:'',
    Id_Caja:'',
    Numero:'',
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
    IVA:0,
    Servicio:'',
    Monto_Servicio:0,
    Id_Nueva_Zona:'',
    Id_Nueva_Mesa:'',
    Id_Nuevo_Pedido:'-99',
    Pedido_Alterado:false,
    TotalCobrar:0
  }
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
  ngOnInit() {
    this.loadPedidos();
    this.obtenerTC();
    this.loadCaja();
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
  async loadCaja(){
    this.Caja = localStorage.getItem("Id_Caja");
    return true;
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
    this.loadPedidos();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadPedidos(this.searchField);
  }
  async editRecord(pedido){
    this.edit = true;
    let data = await this.restaurantConsultaPedidoService.loadPedido(pedido.Id_Pedido)
    this.Pedido = data['data'][0];
    this.loadDetails(pedido.Id_Pedido);
  }
  async loadPedidos(search?:any){
    let data = await this.restaurantConsultaPedidoService.loadPedidos(this.paginacion,search);
    if(data['total'] == 0){
      this.Pedidos = [];
    }else{
      this.Pedidos = data['data'];
    }
  }
  async loadDetails(Id_Pedido){
    let data = await this.restaurantOrderService.loadOrderProducts(Id_Pedido);
    if(data['total'] == 0){
      this.Detalles = [];
    }else{
      this.Detalles = data['data'];
      this.OrderProducts = this.Detalles;
    }
  }
  async imprimirBlueTooth(txt){
    // @ts-ignore-start
    ThermalPrinter.printFormattedTextAndCut({
        type: 'bluetooth',
        id: 'BlueTooth Printer',
        text:txt,
        mmFeedPaper:20
      }, function() {

      }, function(error) {
        Swal.fire('No se puede imprimir')
        Swal.fire(error)
      });
    // @ts-ignore-end
  }
  async reimprimir(){
    if(window.location.host != 'localhost'){
      window.open('https://toxo.work/reportes/bar/tiquete-caja.php?IdDocument='+this.Pedido.Id_Pedido);
     }else{
      let data = await this.restaurantConsultaPedidoService.carcarScript('https://toxo.work/reportes/bar/tiquete-caja2.php',this.Pedido.Id_Pedido);
      this.imprimirBlueTooth(data['data']);
     }
  }
  cancel(){
    this.edit = false;
  }

  refacturar(){
    this.generarFacturaElectronica();
  }

  async generarFacturaElectronica(){
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
        Notas: 'Rest-Orden:'+ this.Mesa.Id_Mesa + '-'+this.Pedido.Id_Pedido
      }
      let data = await this.invoiceService.insertHeader(Invoice, this.Caja,this.Exoneracion);
      Invoice.Id_Factura = data["data"][0]["Identity"];
      await this.restaurantConsultaPedidoService.ActualizarFechaPedido(this.Pedido.Creado_El,Invoice.Id_Factura);
      //Actualizar el Id de la factura en el pedido
      await this.restaurantInvoiceService.UpdateIdFactura(Invoice.Id_Factura,this.Pedido.Id_Pedido);
      for (let i = 0; i < this.OrderProducts.length; i++) {
          await this.grabarUnDetalleFactura(i,Invoice.Id_Factura);
          //Actualizar los Datos en la base de datos.
          //await this.restaurantInvoiceService.updateAmount(this.OrderProducts[i]['Id_Pedido_Detalle'],this.OrderProducts[i]['Facturar'])
      }
      //aplicar la factura
      //Actualizar la fecha
      
      await this.apiService.postRecord('Call sp_Ven_Aplicar_Factura(' + Invoice.Id_Factura+ ')' );
      //
      if(this.Regimen !== '3' ){
        this.AplicandoFacturaHacienda(Invoice.Id_Factura);
      }
      //alert('Re-facturado');
      this.loadPedidos();
      this.cancel()
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
    let data = await this.apiService.aplicarFacturaHacienda(Id_Factura);
    if(data['success'] == 'false'){
      Swal.fire('Error: ' + data['error']);
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
    }
    return true;
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
}
