import { RestaurantOrderService } from './restaurant-order.service';
import { Component, OnInit } from '@angular/core';
import { RestaurantZoneService } from '../restaurant-zone/restaurant-zone.service';
import { RestaurantPlaceService } from '../restaurant-place/restaurant-place.service';
import { CategoryService } from '../../../../../inventario/src/app/inventory/category/category.service';
import { ProductService } from '../../../../../inventario/src/app/inventory/product/product.service';
import { RestaurantInvoiceService } from '../restaurant-invoice/restaurant-invoice.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-pedido',
  templateUrl: './restaurant-order.component.html',
  styleUrls: ['./restaurant-order.component.css']
})
export class RestaurantOrderComponent implements OnInit {

  constructor(
    private restaurantZoneService:RestaurantZoneService,
    private restaurantPlaceService:RestaurantPlaceService,
    private categoryService:CategoryService,
    private productService:ProductService,
    private restaurantOrderService:RestaurantOrderService,
    private restaurantInvoiceService:RestaurantInvoiceService
  ) { }
  Article = {
    Id_Producto:''
  };
  NombreEmpresa = '';
  NombreSalonero = '';
  CodigoSalonero = '';
  PantallaLogin = false;
  MultiUsuairo = 0;
  PantallaLoading = false;
  NumeroPedido = 0;
  active_Place: any;
  active_Zone:any;
  PantallaZona = true;
  PantallaPlace = false;
  PantallaCategorias = false;
  PantallaEstado = false;
  PantallaProductos = false;
  PantallaNotas = false;
  PantallaOpciones = false;
  PantallaAdicionales = false;
  PantallaSubCuentas = false;
  PantallaPedidosAbiertos = false;
  ResZonas = true;
  Nota = '';
  NotaIndice = 0;
  Zones = [];
  Places = [];
  Categories = [];
  Products = [];
  OrderProducts = [];
  Componentes = [];
  Adicionales = [];
  Sub_Componentes = [];
  Sub_Cuentas = [];
  Pedidos = [];
  Pedido = {
    Id_Pedido : '',
    Id_Zona : '',
    Zone_Name:'',
    Id_Place : '',
    Place_Status:'',
    Place_Name: '',
    Estado:'0',
    Tipo_Cuenta:'0',
    Nombre:'Cliente Contado'
  }
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  OrderTotal = 0;
  ngOnInit(): void {
    this.leerMultioUsuairo();
    this.loadOrders(1);
    this.initPedido();
    this.loadZones();
    this.loadCategories();
    if(this.ResZonas == false){
      this.leerNumeroPedido();
    }
    this.NombreEmpresa = localStorage.getItem('Empresa');
  }
  newAccount(){
    this.PantallaZona = true;
    this.PantallaPedidosAbiertos = false;
    this.SubCuenta();
  }
  closeUser(){
    this.CodigoSalonero = "";
    this.PantallaPedidosAbiertos = false;
    this.PantallaLogin = true;
  }
  async loadOrders(Estado){
    let data = await this.restaurantInvoiceService.loadOrders(this.ResZonas,Estado);
    if(data['total'] == 0){
      this.Pedidos = [];
    }else{
      this.Pedidos = data['data'];
    }
  }
  async leerNumeroPedido(){
    let PedidoNumero = await this.restaurantOrderService.LoadNumber();
    this.NumeroPedido = PedidoNumero['data'][0]['Numero'];
    this.IniciarSinZonas();
  }
  IniciarSinZonas(){
    this.Pedido.Id_Zona = '1';
    this.Pedido.Zone_Name = 'Orden'
    this.Pedido.Id_Place = '1';
    this.PantallaZona = false;
    this.PantallaEstado = true;
    this.Pedido.Id_Place = this.NumeroPedido.toString();
    this.Pedido.Place_Name = this.Pedido.Id_Place;
  }
  initPedido() {
    this.Pedido = {
      Id_Pedido : '',
      Id_Zona : '',
      Zone_Name:'',
      Id_Place : '',
      Place_Status:'',
      Place_Name: '',
      Estado:'0',
      Tipo_Cuenta:'0',
      Nombre:'Cliente Contado'
    }
    if(this.ResZonas == false){
      this.leerNumeroPedido();
    }
    this.Pedido.Id_Place = this.NumeroPedido.toString();
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
    }else{
      this.PantallaLogin = true;
      this.PantallaZona = false;
    }
  }
  Concat(Numero){
    this.CodigoSalonero = this.CodigoSalonero.concat(Numero);
  }
  borrar(){
    this.CodigoSalonero = this.CodigoSalonero.slice(0, -1)
  }
  async seleccionarTipoCuenta(Tipo){
    this.Pedido.Tipo_Cuenta = Tipo;
    this.Pedido.Estado = '1';
    await this.restaurantOrderService.placeOccuped(this.Pedido.Id_Place);
    if(this.ResZonas == false){
      this.Pedido.Id_Place = this.NumeroPedido.toString();
    }
    let data = await this.restaurantOrderService.newOrder(this.Pedido);
    if(data['total'] == 1){
      this.Pedido.Id_Pedido = data['Identity'];
    }
  }
  async cancel(pantalla){
    this.PantallaZona = false;
    this.PantallaPlace = false;
    this.PantallaCategorias = false;
    this.PantallaEstado = false;
    this.PantallaProductos = false;
    this.PantallaSubCuentas = false;
    if(pantalla == 1){
      if(this.ResZonas == false){
        this.PantallaEstado = true;
        this.OrderTotal = 0;
      }else{
        this.PantallaZona = true;
      }

    }
    if(pantalla == 2){
      this.loadOrderProducts();
      this.PantallaPedidosAbiertos = true;
      /*
      if(this.ResZonas == false){
        this.PantallaEstado = true;
        this.PantallaPlace = false;
      }else{
        this.PantallaPlace = true;
      }
      this.initPedido();
      this.OrderProducts = [];
      this.loadPlaces(this.active_Zone);
      */
    }
    if(pantalla == 3){
      this.PantallaEstado = true;
    }
    if(pantalla == 4){
      this.PantallaCategorias = true;
    }
  }
  async cerrarCuenta(){
    await this.loadOrderProducts();
    //Verificar si Hay alguna orden en la Cocina
    for (let i = 0; i < this.OrderProducts.length; i++) {
      if(this.OrderProducts[i]['Cocina'] == 1){
        if(this.OrderProducts[i]['Estado'] == 1){
          Swal.fire(this.OrderProducts[i]['Descripcion'] + ' No ha sido despachado de la Cocina, Orden No se puede cerrar');
          return false;
        }
      }
    }
    //Cerrar la Cuenta
    await this.restaurantOrderService.closeOrder(this.Pedido.Id_Pedido);
    //Liberar la Mesa
    await this.restaurantOrderService.placeFree(this.Pedido.Id_Place);
    this.PantallaZona = true;
    this.PantallaPlace = false;
    this.PantallaCategorias = false;
    this.PantallaEstado = false;
    this.PantallaProductos = false;
    return true;
  }
  async SubCuenta(){
    //Crear Sub_Cuenta
    //jaime
    this.Pedido.Nombre = '';
    this.Pedido.Id_Pedido = '';
    this.OrderProducts = [];
    this.OrderTotal = 0;
  }
  async loadZones(search?:any){
    let data = await this.restaurantZoneService.loadZones(this.paginacion,search);
    if(data['total'] == 0){
      this.Zones = [];
    }else{
      this.Zones = data['data'];
    }
  }
  async loadPlaces(Zone){
    this.active_Zone = Zone;
    if(this.ResZonas == false){
      this.Pedido.Id_Zona = '1';
      this.Pedido.Zone_Name = 'Orden';
    }else{
      this.Pedido.Id_Zona = Zone.Id_Zona;
      this.Pedido.Zone_Name = Zone.Nombre;
      this.PantallaZona = false;
      this.PantallaPlace = true;
    }

    let data = [];
    if(this.ResZonas == false){
      data = await this.restaurantOrderService.LoadPedidos();
    }else{
      data = await this.restaurantPlaceService.loadPlacesZone(Zone.Id_Zona);
    }
    if(data['total'] == 0){
      this.Places = [];
    }else{
      this.Places = data['data'];
    }
  }
  async loadCategories(){
    let data = await this.categoryService.loadCategories(this.paginacion,'');
    if(data['total'] == 0){
      this.Categories = [];
    }else{
      this.Categories = data['data'];
    }
  }
  async loadPlaceStatus(Place){
    //Cargar el Estado de la Mesa
    this.Nota = '';
    this.PantallaPedidosAbiertos = false;
    this.active_Place = Place;
    this.PantallaZona = false;
    this.PantallaPlace = false;
    this.PantallaCategorias = false;
    this.Pedido.Id_Place = Place.Id_Mesa;
    this.Pedido.Place_Name = Place.Nombre;
    this.Pedido.Place_Status = Place.Estado;
    let Estado = '2';
    if(this.ResZonas == false){
      Estado = '1';
    }
    if(Place.Estado == Estado){
      let order = await this.restaurantOrderService.loadOrder(this.Pedido.Id_Place);
      if(order['total']>0){
        if(order['total']>1){
          this.Sub_Cuentas = order['data'];
          this.PantallaSubCuentas = true;
          this.PantallaEstado = false;
        }else{
          this.PantallaEstado = true;
          this.Pedido.Tipo_Cuenta = order['data'][0]['Tipo_Cuenta'];
          this.Pedido.Id_Pedido = order['data'][0]['Id_Pedido'];
          this.Pedido.Estado = '1';
          this.Pedido.Nombre = order['data'][0]['Nombre'];
          this.loadOrderProducts();
        }
      }
    }else{
      this.PantallaEstado = true;
    }
    return true;
    /*else{
      this.initPedido();
      this.OrderProducts = [];
    }*/
  }
  async loadSubCuenta(Cuenta){
    this.Pedido.Id_Place = Cuenta.Id_Mesa;
    this.Pedido.Id_Zona = Cuenta.Id_Zona;
    this.PantallaPedidosAbiertos = false;
    this.PantallaSubCuentas = false;
    this.PantallaEstado = true;
    this.Pedido.Tipo_Cuenta = Cuenta.Tipo_Cuenta;
    this.Pedido.Id_Pedido = Cuenta.Id_Pedido;

    if(Cuenta.Nombre){
      this.Pedido.Nombre = Cuenta.Nombre;
    }else{
      this.Pedido.Nombre = Cuenta.Cliente;
    }
    this.Pedido.Estado = '1';
    this.loadOrderProducts();
  }
  async loadOrderProducts(){
    let products = await this.restaurantOrderService.loadOrderProducts(this.Pedido.Id_Pedido);
    if(products['total'] == 0){
      this.OrderProducts = [];
    }else{
      this.OrderProducts = products['data'];
      //Calcular el Total de la Orden
      this.OrderTotal = 0;
      for (let i = 0; i < this.OrderProducts.length; i++) {
        this.OrderTotal = this.OrderTotal + (this.OrderProducts[i].Precio * this.OrderProducts[i].Cantidad);
      }
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
  async showCagegories(){
    if(this.Pedido.Nombre == ''){
      Swal.fire('Defina el nombre del Cliente antes de continuar');
      return false;
    }
    this.PantallaZona = false;
    this.PantallaPlace = false;
    this.PantallaCategorias = true;
    this.PantallaEstado = false;
    return true;
  }
  async loadArticles(Categoria){
    let data = await this.productService.loadProductsByCategory(Categoria.Id_Categoria);
    if(data['total'] == 0){
      this.Products = [];
    }else{
      this.Products = data['data'];
    }
    this.PantallaZona = false;
    this.PantallaPlace = false;
    this.PantallaCategorias = false;
    this.PantallaEstado = false;
    this.PantallaProductos = true;
  }
  closePantallaOpciones(){
    this.PantallaOpciones = false;
  }
  closePantallaAdicionales(){
    this.PantallaAdicionales = false;
  }
  async addArticle(Article){
   //Agregar el Artículo Seleccionado.
   //Verificar si el artículo tiene Componetes opcionales.
    this.Componentes = [];
    let componentes = await this.restaurantOrderService.loadComponete(Article.Id_Producto,1);
    if(componentes['total'] != 0){
      //this.Componentes = ;
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
      this.Article = Article;
      this.PantallaOpciones = true;
    }
    else{
      this.SaveArticle(Article);
    }
  }
  async SaveArticle(Article){
    this.PantallaLoading = true;
    let totalAdicionales = 0;
    if(this.Pedido.Id_Pedido == ''){
      await this.seleccionarTipoCuenta(1);
    }
    //seleccionarTipoCuenta
    Article.Total = Article.Precio
    let data = await this.restaurantOrderService.addProduct(Article,this.Pedido.Id_Pedido);
    let identity = data["Identity"];
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
    Article.Total = parseFloat(Article.Total) + totalAdicionales;
    //Actualizar el Monto total si existen Adicionales.
    let detalle = await this.restaurantOrderService.updateTotal(Article.Id_Producto,this.Pedido.Id_Pedido,Article.Total);

    //Leer los Articulos asosiados al Pedido
    this.PantallaOpciones = false;
    this.PantallaEstado = true;
    this.PantallaProductos = false;
    this.PantallaLoading = false;
    this.loadOrderProducts();
  }
  async SumArticle(Article){
    await this.restaurantOrderService.addProductToProduct(Article.Id_Pedido_Detalle);
    this.loadOrderProducts();
  }
  async minusArticle(Article){
    if(Article.Cantidad == 1){
      //marcar el artículo como depachado
      await this.restaurantOrderService.ceroProductToProduct(Article.Id_Pedido_Detalle,2);
      //return false
    }else{
      await this.restaurantOrderService.menusProductToProduct(Article.Id_Pedido_Detalle);
    }
    this.loadOrderProducts();
  }
  editNote(Indice){
    this.Nota = this.OrderProducts[Indice].Notas;
    this.PantallaNotas = true;
    this.NotaIndice = Indice;
  }
  closeModal(){
    this.PantallaNotas = false;
  }
  async agregarNota(){
    this.OrderProducts[this.NotaIndice].Nota = this.Nota;
    await this.restaurantOrderService.updateNote(this.Nota, this.OrderProducts[this.NotaIndice].Id_Pedido_Detalle);
    this.loadOrderProducts();
    //Actualizar Nota en la base de datos
    this.closeModal();
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

  async agregarAdicional(){
    this.SaveArticle(this.Article);
    this.PantallaAdicionales = false;
  }

  async leerAdicionales(){
    this.Adicionales = [];
    let componentes = await this.restaurantOrderService.loadComponete(this.Article.Id_Producto,2);
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
      this.loadOrders(1);
      this.PantallaLogin = false;
      this.PantallaPedidosAbiertos = true;
    }
    return true;
  }
}
