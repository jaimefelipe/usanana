import { SignupService } from '../../../../../../seguridad/src/app/security/signup/signup.service';
import { PerfilService } from './perfil.service';
import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../productos/productos.service';
import { BranchService } from '../../../general/branch/branch.service';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

declare var $: any;
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  constructor(
    private perfilService: PerfilService,
    private productosService: ProductosService,
    private signupService: SignupService,
    private router: Router,
    private branchService: BranchService
  ) {}
  fileData!: File;
  respuestaMesage = true;
  ProductosCategoria = [];
  ProductByCompany = [];
  UserProducts = [];
  Id_User = localStorage.getItem('Id_Usuario');
  Empresa = {
    Nombre: '',
    Razon_Social: '',
    Telefono: '',
    Correo: '',
    Correo_Hacienda: '',
    Numero_Identificacion: '',
    Tipo_Identificacion: '',
    Provincia: '',
    Canton: '',
    Distrito: '',
    Barrio: '',
    Otras_Senas: '',
    Regimen: '',
    Api: '',
    Usuario_IDP: '',
    Clave_IDP: '',
    Ruta_P12: '',
    Pin_P12: '',
    Codigo_Actividad: '',
    Estado: '',
    Ruta_P12_Pruebas: '',
    Usuario_IDP_Pruebas: '',
    Clave_IDP_Pruebas: '',
    Pin_P12_Pruebas: '',
    Tipo_Usuario: '',
    Tipo_Cuenta: '',
    Notas:'',
  };
  Provinces = [];
  Cantons = [];
  Districts = [];
  userData = {
    Nombre: '',
    Correo: '',
    Telefono: '',
    Numero_Identificacion: '',
    Tipo_Cuenta: '',
    Tipo_Usuario: '',
    T4C3: '',
    Vence: '',
    CT4C3: '',
    Metodo_Pago: '3',
  };
  AppScreen = false;
  PaymentMethod = ' Sinpe Móvil ';
  phoneNumber = '^(+d{1,3}[- ]?)?d{10}$';
  //Validators.pattern(this.phoneNumber)
  Products = [];

  ngOnInit(): void {
    this.loadCiaInfo();
    this.readUserData();
    this.getProductList();
  }
  
  async loadCiaInfo() {
    let data = await this.perfilService.loadCiaInfo();
    if (data['total'] > 0) {
      this.Empresa = data['data'][0];
      if (this.Empresa.Regimen == '') {
        this.Empresa.Regimen = '3';
      }
      if (this.Empresa.Api == '') {
        this.Empresa.Api = '02';
      }
      await this.loadProvinces();
    }
    this.ProductByCompany = await this.perfilService.getProductByCompany();
  }
  async loadProvinces() {
    let data = await this.branchService.loadProvinces();
    if (data['total'] > 0) {
      this.Provinces = data['data'];
      if (this.Empresa.Provincia == '') {
        this.Empresa.Provincia = this.Provinces[0]['Provincia'];
      }
      await this.loadCantons(this.Empresa.Provincia);
    }
  }
  async loadCantons(Province) {
    let data = await this.branchService.LoadCantons(Province);
    if (data['total'] > 0) {
      this.Cantons = data['data'];
      if (this.Empresa.Canton == '') {
        this.Empresa.Canton = this.Cantons[0]['Canton'];
      }
      await this.loadDistrict(this.Empresa.Provincia, this.Empresa.Canton);
    }
  }
  async loadDistrict(Province, Canton) {
    let data = await this.branchService.LoadDistrito(Province, Canton);
    if (data['total'] > 0) {
      this.Districts = data['data'];
      if (this.Empresa.Distrito == '') {
        this.Empresa.Distrito = this.Cantons[0]['Canton'];
      }
    }
  }
  async provinceChange() {
    await this.loadCantons(this.Empresa.Provincia);
  }
  async cantonChange() {
    await this.loadDistrict(this.Empresa.Provincia, this.Empresa.Canton);
  }
  async loadImage(fileInput: any) { 
    this.fileData = <File>fileInput.target.files[0];
    if (this.fileData.type != 'application/x-pkcs12') {
      Swal.fire('El archivo no es un p12');
      return false;
    }
    const formData = new FormData();
    formData.append('file', this.fileData);
    this.Empresa.Ruta_P12 = this.fileData.name;
    await this.perfilService.loadFile(formData);
    fileInput.target.value = '';
    return true;
  }
  /**
   * lee los productos que tiene la compaña comprados
   */
  async loadProductsForCompany() {
    let data = await this.perfilService.loadProductsForCompany();
    if (data['total'] > 0) {
      this.UserProducts = data['data'];
      await this.selectDefautProducts();
    }
  }
  /**
   * Prender el swith de los productos que tiene la compañia comprados
   */
  async selectDefautProducts() {
    //let userData = this.form.controls;
    //Recorre cada uno de los productos comprados
    for (let producto of this.UserProducts) {
      let index = 0;
      //Recorre cada producto disponible
      for (let prod of this.Products) {
        //Si el producto comprado es igual al producto disponible, prender el switch
        if (producto.Id_Categoria == prod.Id_Categoria) {
          //obtener el producto de la ram
          prod.Seleccionado = true;
          //let name = "customSwitch"+prod.Id_Producto;

          //this.form.get("customSwitch"+prod.Id_Producto).setValue(true);
          //Cargar las categorias asociadas al producto comprado
          this.getCategoryForProduct(prod.Id_Categoria, index);
        } else {
          prod.Seleccionado = false;
        }
        index++;
      }
    }
  }
  async getCategoryForProduct(Id_Categoria, Indice) {
    //let data = await this.perfilService.getCategoryForProduct(Id_Producto);
    //Obtener los servicios asociados a la categoria
    let data = await this.productosService.getProducts(Id_Categoria)
    if (data['total'] > 0) {
      //Leer la subCategoría de la base de datos.

      /**
       * Carga el dropdown de las categrias de un producto
       */
      let SubCategoriaPorDefecto = await this.perfilService.getSubCategofyForProdictAndCia(Id_Categoria);
      if (SubCategoriaPorDefecto['total'] > 0) {
        for (let sub of data['data']){
          if(sub['Id_Producto'] == SubCategoriaPorDefecto['data'][0]['Id_Producto']){
            sub['Selected'] = 'selected';
          }
        }
      }

      this.ProductosCategoria[Indice] = data['data'];
      // Marcar el producto por defecto
      //jaime
      /**
       * Define el producto y categoría seleccionada por el usuario
       */
      this.UserProducts[Indice] = {
        Id_Producto: this.ProductosCategoria[Indice][0]['Id_Producto'],
        Id_Categoria: data['data'][0]['Categoria'],
      };
    }
  }
  async getProductList() {
    //let data = await this.productosService.getProducts();
    let data = await this.productosService.getGategoria();
    this.Products = data['data'];
    this.loadProductsForCompany();
  }
  async readUserData() {
    let data = await this.perfilService.getUserInfo(this.Id_User);
    if (data['total'] == 1) {
      this.userData = data['data'][0];
      if (this.userData.Tipo_Cuenta == '') {
        this.userData.Tipo_Cuenta = '0';
      }
      if (this.userData.Tipo_Usuario == '') {
        this.userData.Tipo_Usuario = '0';
      }

      if (!this.userData.Metodo_Pago) {
        this.userData.Metodo_Pago = '3';
      }
      switch (this.userData.Metodo_Pago) {
        case '1':
          this.PaymentMethod = ' Tarjeta de Cédito ';
          this.colapseCC();
          break;
        case '2':
          this.PaymentMethod = ' Pay Pal ';
          this.colapsePaypal();
          break;
        case '3':
          this.PaymentMethod = ' Sinpe Movil ';
          this.colapseMobile();
          break;
        case '4':
          this.PaymentMethod = ' Depósito Bancario ';
          this.colapseTransferencia();
          break;
      }
      this.setFormValue();
    }
  }

  setFormValue() {
    let formData = {
      name: this.userData.Nombre,
      email: this.userData.Correo,
      phone: this.userData.Telefono,
      id: this.userData.Numero_Identificacion,
      tipoCuenta: this.userData.Tipo_Cuenta,
      tipoUsuario: this.userData.Tipo_Usuario,
      tarjeta: '',
      fecha: 'mm/yy',
      ccv: '',
    };

    //this.form.setValue(formData);
  }
  async udateUserData(step) {
    //actualizar UserData con Empresa.

    this.userData.Nombre = this.Empresa.Nombre;
    this.userData.Correo = this.Empresa.Correo;
    this.userData.Telefono = this.Empresa.Telefono;
    this.userData.Numero_Identificacion = this.Empresa.Numero_Identificacion;

    let data: any;
    switch (step) {
      case 1: {
        data = await this.perfilService.updateUserInfo(
          this.userData,
          this.Id_User
        );
        data = await this.perfilService.updateGeneralData(this.Empresa);
        //Generar, Sucursa, Caja;
        data = await this.signupService.crearSucursal();
        data = await this.signupService.crearCaja();
        $('#GeneralData').collapse('hide');
        $('#DireccionData').collapse('show');
        break;
      }
      case 2: {
        data = await this.perfilService.updateAddress(this.Empresa);
        $('#DireccionData').collapse('hide');
        $('#Aplicaciones').collapse('show');
        break;
      }
      case 3: {
        data = await this.perfilService.updateSalesInfo(
          this.userData,
          this.Id_User
        );
        break;
      }
      case 4: {
        if(this.UserProducts.length  == 0){
          Swal.fire('Debe seleccionar una aplicacion');
          break;
        }else{
          data = await this.updateAppInfo(this.UserProducts);
          $('#Aplicaciones').collapse('hide');
          $('#HaciendaData').collapse('show');
          break;
        }
      }
      case 5: {
        data = await this.perfilService.updateHacienda(this.Empresa);
        if (data['success'] == 'true') {
          Swal.fire('Datos Actualizados');
        } 
        this.router.navigate(['/']);
        break;
      }
    }
    /*
    if (data['success'] == 'true') {
      Swal.fire('Datos Actualizados');
    } else {
      Swal.fire('Error actualizando datos');
    }*/
  }
  
  async updateAppInfo(productsToUpdate) {
    //UserProducts Son los productos de la ram
    //Actualizar los sistemas del usuario
    for (let productoToUpdate of productsToUpdate) {
      for (let producto of this.Products) {
          if(productoToUpdate.Id_Categoria == producto.Id_Categoria){
            if(producto.Factura == 1){
              await this.perfilService.updateFacturaUser();
              localStorage.setItem('ToxoSG','1.1.1.0.0.0.0.0.0.0.0.0.0.0');
            }
            if(producto.Pov == 1){
              await this.perfilService.updatePovUser();
              localStorage.setItem('ToxoSG','0.1.1.0.0.0.0.0.0.0.0.0.0.1')
            }
            if(producto.Bar == 1){
              await this.perfilService.updateBarUser();
              localStorage.setItem('ToxoSG','0.1.1.0.0.0.0.1.0.0.0.0.0.0')
            }
            if(producto.Conta ==1 ){
              await this.perfilService.updateContaUser();
              localStorage.setItem('ToxoSG','0.0.0.1.1.1.1.0.0.0.0.0.0.0')
            }
          }
      }
    }
    //Leer de nuevo los datos de la base de datos.
    let ProductByCompany = await this.perfilService.loadProductsForCompany();
    //aqui esta el erro.
    let data: any;
    if (ProductByCompany['total'] == 0) {
      //Si la Compañia no tiene productos asociados
      for (let producto of productsToUpdate) {
        await this.perfilService.addProductToCompany(
          producto.Id_Producto,
          producto.Id_Categoria
        );
        return true;
      }
    } else {
      /**
       * Al haber registrso en la db determinar si cada uno de los productos a grabar corresponde con el que esta en la base de datos.
       */
      for (let productoRam of productsToUpdate) {
        for (let productoHD of ProductByCompany['data']) {
          if (productoRam.Id_Sub_Categoria === productoHD.Id_Sub_Categoria) {
            /**
             * Si el producto de la Ram es igual al Producto del HD no hacer nada de lo contario alertar al usuario y actualizar los datos.
             */
            if (productoRam.Id_Producto == productoHD.Id_Producto) {
              let data = {
                success: 'true',
              };
              return data;
            } else {
              let respuesta = '';
              await Swal.fire({
                title:
                  '¿Está seguro de Cambiar el Tipo de Paquete, Esto implica cambios en su facturación así como en los privilegios de su aplicación?',
                showDenyButton: true,
                confirmButtonText: `Realizar los cambios`,
                denyButtonText: `Cancelar`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  //Swal.fire('Saved!', '', 'success')
                  //Grabar datos.
                  this.respuestaMesage = true;
                } else if (result.isDenied) {
                  this.respuestaMesage = false;
                }
              });
              if (this.respuestaMesage == true) {
                //Actualizar la Categoría
                console.log(productoRam)
                data = await this.perfilService.updateCategoryToProductCompany(
                  productoRam.Id_Producto,
                  productoRam.Id_Categoria,
                  productoHD.Id_Categoria
                );
                //Agregar Los Registros para Factura Electrónica.
                await this.addFErecords(productoRam.Id_Producto);
                data = {
                  success: 'true',
                };
                return data;
              } else {
                let data = {
                  success: this.respuestaMesage,
                };
                return data;
              }
            }
          }
        }
      }
    }
  }
  async addFErecords(Id_Product) {
    //Revisar si existe un trigger para la empresa, el sistema, el objeto y el producto si es así ejecutarlo
    let trigger = await this.perfilService.getTrigger(Id_Product);
    if (trigger['total'] == 1) {
      let storeProcedure = await this.perfilService.execSotreProcedure(
        trigger['data'][0]['Nombre'],
        Id_Product
      );
    }
  }
  colapseCC() {
    $('#SinpeMovil').collapse('hide');
    $('#Deposito').collapse('hide');
    $('#PayPal').collapse('hide');
    $('#CreditCard').collapse('show');
    this.PaymentMethod = 'Tarjeta de Crédito';
    this.userData.Metodo_Pago = '1';
  }
  colapsePaypal() {
    $('#SinpeMovil').collapse('hide');
    $('#CreditCard').collapse('hide');
    $('#Deposito').collapse('hide');
    $('#PayPal').collapse('show');
    this.PaymentMethod = 'Pay Pal';
    this.userData.Metodo_Pago = '2';
  }
  colapseMobile() {
    $('#CreditCard').collapse('hide');
    $('#Deposito').collapse('hide');
    $('#PayPal').collapse('hide');
    $('#SinpeMovil').collapse('show');
    this.PaymentMethod = 'Sinpe Movil';
    this.userData.Metodo_Pago = '3';
  }
  colapseTransferencia() {
    $('#SinpeMovil').collapse('hide');
    $('#CreditCard').collapse('hide');
    $('#PayPal').collapse('hide');
    $('#Deposito').collapse('show');
    this.PaymentMethod = 'Depósito Bancario';
    this.userData.Metodo_Pago = '4';
  }
  addApp() {
    this.AppScreen = true;
  }
  AddApplication() {
    this.AppScreen = false;
  }
  async onProductSelected(Event, Producto, Indice) {
    if (Event.target.checked) {
      await this.getCategoryForProduct(Producto.Id_Categoria, Indice);
    } else {
      this.UserProducts.splice(Indice, 1);
      this.ProductosCategoria[Indice] = [];
    }
  }
  categoryChange(event, indice) {
    this.UserProducts[indice]['Id_Producto'] = event.target.value;
   // this.UserProducts[indice]['Id_Categoria'] = Categoria;

  }
}
