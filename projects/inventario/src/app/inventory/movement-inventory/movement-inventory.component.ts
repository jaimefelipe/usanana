
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { MovementInventoryService } from "./movement-inventory.service";
import { ProductService } from "../product/product.service";

@Component({
  selector: 'app-movement-inventory',
  templateUrl: './movement-inventory.component.html',
  styleUrls: ['./movement-inventory.component.css']
})
export class MovementInventoryComponent implements OnInit {

  constructor(
    private router: Router,
    private apiService: ApiService,
    private movementInventoryService: MovementInventoryService,
    private productService:ProductService
  ) {}
  tipoCambio = {
    compra: "",
    venta: "",
    fecha: "",
  };
  hoy = new Date();
  PantallaLoading = false;
  PantallaProductos = false;
  searchFieldProduct = '';
  edit = false;
  searchField = "";
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
    Tipo_Movimiento: "",
    Id_Cliente: "",
    Nombre: "",
    Codigo_Identificacion: "",
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
    Registro_Origen:''
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
    Ultimo_Costo:0
  };

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
      let data = await this.movementInventoryService.loadMovement(movimiento.Id_Movimiento);
      this.Movement = data["data"][0];
      // Load Details
      let details = await this.movementInventoryService.loadMovementDetails(
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
        Tipo_Movimiento: "01",
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
        Estado: 0,
        Creado_El:
          this.hoy.getDate() +
          "/" +
          (this.hoy.getMonth() + 1) +
          "/" +
          this.hoy.getFullYear(),
        Consecutivo: "",
        Notas:'',
        Registro_Origen:''
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
    let data = await this.movementInventoryService.loadMovements(this.paginacion,search);
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
      //this.processProduct(next, true);
      document.getElementById(next).focus();
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
      Tipo_Codigo:'',
      Ultimo_Costo:0
    };
  }
  processProduct(next, stop?) {

    if(this.PantallaProductos == true){
      return false;
    }
    if (next === "Descripcion") {
      if (this.Detalle.Codigo_Referencia === "") {
        //alert('Debe digitar El codigo');
        return false;
      }
      this.obtenerProducto(this.Detalle.Codigo_Referencia, 1);
      //return false;
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
    /*
    let element = document.getElementById(next);

    if (next != "Codigo_Referencia") {
      element.focus();
    }
    */
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
    let element = document.getElementById("Descripcion");
    element.focus();
  }
  calcularTotales() {
    if(this.Detalle.Precio >0){
      // Si es compra es el costo.
      if(this.Movement.Tipo_Movimiento == '02' || this.Movement.Tipo_Movimiento == '04'){
        this.Detalle.Sub_Total = this.Detalle.Cantidad * this.Detalle.Precio;
        this.Detalle.IVA = 0;
        this.Detalle.Total = this.Detalle.Sub_Total;
      }else{
        this.Detalle.Sub_Total = this.Detalle.Cantidad * this.Detalle.Precio;
        this.Detalle.IVA = (this.Detalle.Sub_Total * this.Detalle.IVAPorcentaje) / 100;
       
      }
      if (this.Detalle.Total > 0) {
        this.Details.push(this.Detalle);
      }
    }
    this.Movement.Sub_Total = 0;
    this.Movement.IVA = 0;
    this.Movement.Total = 0;
    
    for (let i = 0; i < this.Details.length; i++) {
      this.Movement.Sub_Total = this.Movement.Sub_Total + parseFloat(this.Details[i]["Sub_Total"]);
      if(this.Movement.Tipo_Movimiento == '02' || this.Movement.Tipo_Movimiento == '04'){
        this.Movement.IVA = 0;
      }else{
        this.Movement.IVA = this.Movement.IVA + parseFloat(this.Details[i]["IVA"]);
      }
      this.Movement.Total = this.Movement.Sub_Total + this.Movement.IVA;
    }
    this.initDetail();
  }

  async obtenerProducto(producto, tipo) {
    let data = await this.productService.loadProduct(producto); 
    if (data['total'] === 0) {
      data = await this.productService.loadProductLike(producto);
    }
    if (data["total"] === 1) {
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
        this.Detalle.Ultimo_Costo = data["data"][0]["Ultimo_Costo"];

        if(this.Movement.Tipo_Movimiento == '02' || this.Movement.Tipo_Movimiento == '04'){
          this.Detalle.Precio = this.Detalle.Ultimo_Costo;
        }

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

    if (this.Movement.Id_Movimiento == "") {
      //factura nueva, grabar encabezado y detalle
      //Grabar encabezado de la factura

      let data = await this.movementInventoryService.insertHeader(this.Movement);
      this.Movement.Id_Movimiento = data["data"][0]["Identity"];
      for (let i = 0; i < this.Details.length; i++) {
        this.grabarUnDetalleFactura(i);
      }
      this.aplicarMovimiento();
    } else {
      //actualizar los detalles de la factura
      let data = await this.movementInventoryService.updateHeader(this.Movement);
      //let del = await this.movementInventoryService.deleteDetails(this.Movement.Id_Movimiento);
      let ListaDetalles = ''
      for (let i = 0; i < this.Details.length; i++) {
        //this.grabarUnDetalleFactura(i);
        if(!this.Details[i]['Id_Movimiento_Detalle']){
          let data = await this.grabarUnDetalleFactura(i);
          if(i > 0){
            ListaDetalles = ListaDetalles + ',';
          }
          ListaDetalles = ListaDetalles + String(data['data'][0]['Identity']);
        }else{
          //3 Actualizar los detalles existentes.
          this.modificarUnDetalleFactura(i);
          if(i > 0){
            ListaDetalles = ListaDetalles + ',';
          }
          ListaDetalles = ListaDetalles + String(this.Details[i]['Id_Movimiento_Detalle']);

        }
      }
      this.eliminarDetalles(ListaDetalles);
      this.aplicarMovimiento();
    }
    this.PantallaLoading = false;
    return true;
  }
  async eliminarDetalles(lista){
    let del = await this.movementInventoryService.deleteDetails(this.Movement.Id_Movimiento,lista);
  }
  async modificarUnDetalleFactura(i){
    if (!this.Details[i].Id_Producto) {
      return false;
    }
    let data = await this.movementInventoryService.updateDetail(this.Details[i]);
    return true;
  }
  async grabarUnDetalleFactura(i) {
    if (!this.Details[i].Id_Producto) {
      return false;
    }
    return await this.movementInventoryService.insertDetail(this.Details[i],this.Movement.Id_Movimiento);
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
        this.movementInventoryService.aplicarMovimiento(this.Movement.Id_Movimiento);
      }
      this.search();
      this.cancel();
    });
  }
  imprimirFactura(){
    let Id_Empresa = localStorage.getItem('Id_Empresa');
    window.open('https://toxo.work/reportes/inventario/inv-comprobante.php?id='+this.Movement.Id_Movimiento);
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

}
