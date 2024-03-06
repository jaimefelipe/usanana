import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { InvoiceService } from '../../../../../../factura/src/app/sales/invoice/invoice.service';
import { ProductService } from '../../../../../../inventario/src/app/inventory/product/product.service';
import { ContactoService } from '../../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { SignupService } from '../../../../../../seguridad/src/app/security/signup/signup.service';
import { LicenciaService } from '../../../../../../main/src/app/general/licencia/licencia.service';
import { UsuarioEmpresaService } from '../../../../../../seguridad/src/app/security/usuario-empresa/usuario-empresa.service';
import { FacturarService } from './facturar.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.css']
})
export class FacturarComponent implements OnInit {

  constructor(
    private route:Router,
    private invoiceService:InvoiceService,
    private productService:ProductService,
    private contactoService:ContactoService,
    private facturarService:FacturarService,
    private signupService:SignupService,
    private licenciaService:LicenciaService,
    private usuarioEmpresaService:UsuarioEmpresaService
  ) { }
  registro = {
    Id_Persona:'',
    paquete:'0',
    nombrePaquete:'',
    Identificacion:'',
    Nombre:'Grupo Arquetipo',
    Tipo_Identificacion:'',
    tipoCedula:'Cedula Juridica',
    Correo:'',
    Telefono:'',
    metodoPago:'0',
    nombreTarjeta:'',
    numeroTarjeta:'',
    mesTarjeta:'',
    anioTarjeta:'',
    cvvTarjeta:'',
    numeroConfirmacion:'',
    numeroDeposito:'',
    precio:0,
    Cliente:1,
    Id_Cobro:'',
    transaccionId:'',
    Estado:'1',
    Id_Usuario:'',
    CantidadDocumentos:'',
    VencimientoDocumentos:'',
    FechaVencimientoLicencia:'',
    Id_Empresa:''
  }
  persona = {
    Id_Persona:'',
    Nombre:'',
    Tipo_Identificacion:'',
    Correo:'',
    Telefono:''
  };
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  productos = [];
  expirationDate: string = '';
  expirationDateInvalid: boolean = false;
  validandoId = false;
  clienteExiste = false;
  tarjetaValida = true;
  loading: boolean = true;
  procesando = false;
  MensajeLoading = 'Procesando';

  ngOnInit() {
    this.loading = true;
    this.loadProducts();
  }
  reiniciarDatos(){
    this.registro = {
      Id_Persona:'',
      paquete:'0',
      nombrePaquete:'',
      Identificacion:'',
      Nombre:'Grupo Arquetipo',
      Tipo_Identificacion:'',
      tipoCedula:'Cedula Juridica',
      Correo:'',
      Telefono:'',
      metodoPago:'0',
      nombreTarjeta:'',
      numeroTarjeta:'',
      mesTarjeta:'',
      anioTarjeta:'',
      cvvTarjeta:'',
      numeroConfirmacion:'',
      numeroDeposito:'',
      precio:0,
      Cliente:1,
      Id_Cobro:'',
      transaccionId:'',
      Estado:'1',
      Id_Usuario:'',
      CantidadDocumentos:'',
      VencimientoDocumentos:'',
      FechaVencimientoLicencia:'',
      Id_Empresa:''
    }
  }
  validateExpirationDate() {
    // Expresión regular para validar el formato MM/YY
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    
    // Comprobar si el valor coincide con el formato
    if (!regex.test(this.expirationDate)) {
      this.expirationDateInvalid = true;
    } else {
      this.expirationDateInvalid = false;
    }
  }
  cerrarSesion(){
    localStorage.setItem('isLoggedin','false');
    localStorage.removeItem('Id_Empresa');
    localStorage.removeItem('Id_Usuario');
    localStorage.removeItem('Nombre_Usuario');
    localStorage.removeItem('Nombre');
    this.route.navigate(['login']); 
  }
  async IdValidation() {
    this.loading = true;
    if(this.registro.Identificacion == ''){
      this.loading = false;
      return true;
    }
    if(this.validandoId == true){
      return false;
    }else{
      this.validandoId = true;
    }
    //validar si la cedula existe en la base de datos.
    let data = await this.invoiceService.validClient(this.registro.Identificacion);
    if (data["total"] === 0) {
      this.clienteExiste = false;
      //El Cliente no existe en la base de datos. hay que consultar hacienda para ver si es un usuario registrado de hacienda.
      let persona = await this.invoiceService.getApiHacienda(this.registro.Identificacion);
      if(persona){
        if(persona[0]){
          Swal.fire('Cliente no existe ni en la base de datos, ni en Hacienda, revise el formato');
          this.procesando = false;
          this.loading = false;
          return false;
        }else{
          this.registro.Nombre = persona.nombre;
          this.registro.Tipo_Identificacion = persona.tipoIdentificacion;
        }
      }else{
        this.procesando = false;
        this.loading = false;
        Swal.fire('Error al procesar cédula');
      }

    } else {
      //Cliente si existe, cargar el registro.
      this.clienteExiste = true;
      this.persona = data["data"][0];
      this.registro.Id_Persona = this.persona.Id_Persona;
      this.registro.Nombre = this.persona.Nombre;
      this.registro.Tipo_Identificacion  = this.persona.Tipo_Identificacion;
      this.registro.Correo = this.persona.Correo;
      this.registro.Telefono = this.persona.Telefono
    }

    if(this.registro.Tipo_Identificacion =='01'){
      this.registro.tipoCedula = 'Cédula  FÍsica'
    }
    if(this.registro.Tipo_Identificacion =='02'){
      this.registro.tipoCedula = 'Cédula  JurÍdica'
    }
    if(this.registro.Tipo_Identificacion =='03'){
      this.registro.tipoCedula = 'Dimex'
    }
    if(this.registro.Tipo_Identificacion =='04'){
      this.registro.tipoCedula = 'NITE'
    }
    this.validandoId = false;
    this.loading = false;
    return true;
  }
  async ClienteNuevo(){
    //
  }
  async loadProducts(search?){
    this.MensajeLoading = "Leyendo Paquetes";
    let data = await this.productService.loadProducts(this.paginacion,search,3);
    if(data['total'] == 0){
      this.productos = [];
    }else{
      this.productos = data['data'];
    }
    this.loading = false;
  }
  cabmioPaquete(paquete){
    let idProducto = paquete.target.value;
    let productoSeleccionado = this.productos.find(producto => producto.Id_Producto === idProducto);
    this.registro.precio = parseInt((productoSeleccionado.Precio * 1.13).toFixed());
    this.registro.nombrePaquete = productoSeleccionado.Descripcion + '| ' + this.registro.precio;
    this.registro.CantidadDocumentos = productoSeleccionado.Cantidad_Documento;
    this.registro.VencimientoDocumentos = productoSeleccionado.Vencimiento_Documento;
  }
  
  validarNumeroTarjeta() {
    let numero = this.registro.numeroTarjeta;
    // Eliminar espacios en blanco y guiones del número de tarjeta
    const numeroLimpio = numero.replace(/\s+/g, '').replace(/-/g, '');
  
    // Verificar si el número de tarjeta sigue un formato común (16 dígitos para Visa, MasterCard, etc.)
    if (!/^(\d{16})$/.test(numeroLimpio)) {
      this.tarjetaValida = false;
    }
  
    // Aplicar algoritmo de Luhn para verificar la validez del número de tarjeta
    let suma = 0;
    let shouldDouble = false;
    for (let i = numeroLimpio.length - 1; i >= 0; i--) {
      let digit = parseInt(numeroLimpio.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      suma += digit;
      shouldDouble = !shouldDouble;
    }
    this.tarjetaValida =  suma % 10 === 0;
  }
  atras(){
    this.reiniciarDatos();
    this.route.navigate(['/']);
  }
  async procesar(){
    this.MensajeLoading = 'Cargando Tarjeta';
    this.loading = true;
    this.procesando = true;
    // Se valida que el formulario este correctamente ingresado
    if(await this.validarRegistro()){
      if(!this.clienteExiste){
        await this.insertarPersona();
      }
      await this.insertCobro();
      if(this.registro.metodoPago == '1'){
        await this.cobrarTarjeta();
        await this.updateCobro();
      }
      await this.generarUsuario();
      await this.asignarSistemaUsuario();
      await this.asignarLicenciaEmpresa();
      this.loading = false;
      this.mostrarMensaje();
    }
  }
  async asignarLicenciaEmpresa(){
    this.MensajeLoading = 'Generando Licencia';
    //Leer el Producto para ver cuantos documentos y vencimiento tiene.
    let data = await this.productService.leerDocVencimientoProducto(this.registro.paquete);
    if(data['total'] == 1){
      this.registro.CantidadDocumentos = data['data'][0]['Cantidad_Documento'];
      this.registro.VencimientoDocumentos = data['data'][0]['Vencimiento_Documento'];
    }
    this.definirFechaVencimientoLicencia();
    await this.leerEmpresaDelUsuario();
    await this.updateLicencia();
  }
  async leerEmpresaDelUsuario(){
    let data = await this.usuarioEmpresaService.cargarEmpresaDeUnUsuario(this.registro.Id_Usuario);
    if(data['total'] == 1){
      this.registro.Id_Empresa = data['data'][0]['Id_Empresa'];
    }
  }
  async updateLicencia(){
    //Validar si la licencia existe
    let licencia = await this.licenciaService.getLicenciaCia(this.registro.Id_Empresa);
    let reg = {
      Fecha_Vencimiento: this.registro.FechaVencimientoLicencia,
      Cantidad_Disponible: this.registro.CantidadDocumentos,
      Id_Empresa:this.registro.Id_Empresa,
      Id_Producto:this.registro.paquete,
      Empresa_Estado:1
    }
    if(licencia['total'] == 1){
      let data = await this.licenciaService.updateLicenciaCia(reg);
    }else{
      //Crear el registro de licencia.
      let data = await this.licenciaService.NuevaLicenciaCia(reg);
    }
  }
  async definirFechaVencimientoLicencia(){
    let hoy: Date = new Date();
    if(this.registro.VencimientoDocumentos == '1'){
      hoy.setMonth(hoy.getMonth() + 1);
    }else{
      hoy.setFullYear(hoy.getFullYear() + 1);
    } 

    // Obtener los componentes de la fecha
    const mes = hoy.getMonth() + 1; // Sumamos 1 porque los meses van de 0 a 11
    const dia = hoy.getDate();
    const anio = hoy.getFullYear();

    // Formatear la fecha como 'MM/DD/YYYY'
    const fechaFormateada = `${mes}/${dia}/${anio}`;

    this.registro.FechaVencimientoLicencia = fechaFormateada;
    //this.registro.FechaVencimientoLicencia = hoy.toISOString().slice(0, 10);
  }

  async asignarSistemaUsuario(){
    this.MensajeLoading = 'Asignando Sistema';
    //se asignan sistemas de ventas, compras, e inventario al usuario
    this.facturarService.updateUser(this.registro.Id_Usuario);
  }
  async generarUsuario(){
    //generar usuario en el sistema si no existe, si existe obtener el Id del Usuario.
    this.MensajeLoading = 'Generando Usuario';
    await this.validateIfUserExist();
  }
  async mostrarMensaje(){
    this.procesando = false;
    if(this.registro.metodoPago =='1'){
      if(this.registro.Estado == '2'){
        Swal.fire('Tarjeta procesada con el Id '+ this.registro.transaccionId);
        this.reiniciarDatos();
      }else{
        Swal.fire('Error al procesar tarjeta:  '+ this.registro.transaccionId);
      }
    }else{
      Swal.fire('Se ha reportado el Pago con el Id '+ this.registro.Id_Cobro);
      this.reiniciarDatos();
    }
  }
  async validarRegistro(){
    //Validar si los datos estan bien.
    if(this.registro.paquete == '0') {
      Swal.fire('Seleccione el paquete');
      this.loading = false;
      this.procesando = false;
      return false
    }
    if(this.registro.Identificacion == '') {
      Swal.fire('Suministre la cédula de cliente');
      this.loading = false;
      this.procesando = false;
      return false
    }
    if(this.registro.Correo == '') {
      Swal.fire('Suministre el correo de cliente');
      this.loading = false;
      this.procesando = false;
      return false
    }
    if(this.registro.Telefono == '') {
      Swal.fire('Suministre el telefono de cliente');
      this.loading = false;
      this.procesando = false;
      return false
    }
    if(this.registro.metodoPago == "1"){
      if(this.registro.mesTarjeta == '') {
        Swal.fire('Suministre el Mes de la tarjeta');
        this.loading = false;
        this.procesando = false;
        return false
      }
      if(this.registro.anioTarjeta == '') {
        Swal.fire('Suministre el Año de la tarjeta');
        this.loading = false;
        this.procesando = false;
        return false
      }
      if(this.registro.numeroTarjeta == '') {
        Swal.fire('Suministre el número de la tarjeta');
        this.loading = false;
        this.procesando = false;
        return false
      }
      if(!this.tarjetaValida) {
        Swal.fire('El número de la tarjeta es invalido');
        this.loading = false;
        this.procesando = false;
        return false
      }
      if(this.registro.cvvTarjeta == '') {
        Swal.fire('Suministre el codigo de verificación');
        this.loading = false;
        this.procesando = false;
        return false
      }
    }
    if(this.registro.metodoPago == '0') {
      Swal.fire('Seleccione el método de pago');
      this.loading = false;
      this.procesando = false;
      return false
    }
    return true;
  }
  async insertarPersona(){
    let data = await this.contactoService.savePersona(this.registro);
    if(data['total'] == 0){
      this.registro.Id_Persona = '';
    }else{
      this.registro.Id_Persona = data['Identity'];
    }
    return true;
  }
  async insertCobro(){
    let cobro = {
      Id_Persona: this.registro.Id_Persona,
      Id_Producto: this.registro.paquete,
      Monto:this.registro.precio,
      TC:this.registro.numeroTarjeta,
      Estado: 1,
      Metodo:this.registro.metodoPago,
      Respuesta: this.registro.numeroConfirmacion + this.registro.numeroDeposito 
    }
    let data = await this.facturarService.insertCobro(cobro);
    this.registro.Id_Cobro = data['Identity'];
  }
  async updateCobro(){
    let cobro = {
      transaccionId: this.registro.transaccionId,
      Estado:this.registro.Estado,
      Id_Cobro:this.registro.Id_Cobro
    }
    let data = await this.facturarService.updateCobro(cobro);
  }
  async cobrarTarjeta(){
    let reg = {
      AMT:this.registro.precio,
      DSC: this.registro.nombrePaquete + '|' + this.registro.Nombre +' | ' + this.registro.Identificacion,
      Client:this.registro.Nombre +' - ' + this.registro.Identificacion,
      Moneda:'crc',
      CCN:this.registro.numeroTarjeta,
      CVV:this.registro.cvvTarjeta,
      MM:this.registro.mesTarjeta,
      YY:this.registro.anioTarjeta
    }
    let data = await this.facturarService.conexionCon4Geeks(reg);
    if(data['success'] == 'true'){
      this.registro.transaccionId = data['Charge_Id'];
      this.registro.Estado = '2';
      return true;
    }else{
      this.registro.transaccionId = data['error'];
      this.registro.Estado = '3';
      return false;
    }
    
  }
  /*Crear cuenta en el sistema de facturacion */
  async validateIfUserExist(){
    let reg = {
      correo: this.registro.Correo
    }
    let user = await this.signupService.userExist(reg);
    if(user['total']>0){
      this.registro.Id_Usuario = user['data'][0]['Id_Usuario']
      return true;
    }else{
      return await this.createUser();
    }

  }
  async createUser(){
    let reg = {
      nombre: this.registro.Nombre,
      correo: this.registro.Correo,
      clave1: 'password'
    }
    await this.signupService.createUser(reg);
    let user = await this.signupService.userExist(reg);
    if(user['total']>0){
      this.registro.Id_Usuario = user['data'][0]['Id_Usuario']
    }
  }
}