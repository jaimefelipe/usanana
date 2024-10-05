import { Component, OnInit } from '@angular/core';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { BranchService } from '../../../../../main/src/app/general/branch/branch.service';
import { RrhhService } from '../rrhh/rrhh.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  constructor(
    private contactoService:ContactoService,
    private branchService:BranchService,
    private rrhhService:RrhhService
    ) { }
  hoy = new Date();
  edit = false
  GeneralActivo = true;
  DireccionActivo = false;
  VentaActivo = false;
  CarreraActivo = false;
  ContactosActivo = false;
  NotasActivo = false; 
  CobroActivo = false; 
  TareaActivo = false;
  RhhActivo = false;

  searchField = "";

  DireccionClass = '';
  RhhClass = '';
  ContactoClass = '';
  NotasClass = '';
  CobroClass = '';
  TareaClass = '';
  GeneralClass = 'text-success tablinks active';


  Clientes = [];
  Provinces = [];
  Cantons = [];
  Districts = [];
  
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Persona = {
    Id_Persona:'',
    Nombre: '',
    Telefono:'',
    Correo:'',
    Identificacion:'',
    Tipo_Identificacion:'1',
    Provincia:'',
    Canton : '',
    Distrito:'',
    Barrio:'',
    Otras_Senas:'',
    Proveedor:'',
    Cliente:'',
    Alumno:'',
    Profesor:'',
    Empleado:'1',
    Estado:'1',
    Otro_Documento:'',
    Condicion_Venta:'',
    Plazo_Credito:'',
    Metodo_Pago:'',
    //Fecha_Ingreso:this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year,
    Porcenaje_Descuento:'',
    Moneda:'CRC',
    Ultima_Factura:'',
    Pagina_Web:'',
    Prospecto:'1',
    Facebook:'',
    Linkedin:'',
    Contabilidad:'',
    FacturaElectronica:'',
    PuntoVenta:'',
    Restaurante:'',
    Asesoria:'',
    Declaracion:'',
    Precio:'',
    Id_Empleado:'',
    Fecha_Ingreso:'',
    Fecha_I:{
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Fecha_Salida:'',
    Fecha_S:{
      month: this.hoy.getMonth() + 1,
      day: this.hoy.getDate(),
      year: this.hoy.getFullYear()
    },
    Tipo_Contrato:'',
    Jornada:'',
    Numero_Contrato:'',
    Salario_Mes:'',
    Id_Roll:'',
    Roll:''
  }

  ngOnInit(): void {
    this.loadPersonas();
    this.loadProvinces();
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
    this.loadPersonas();
  }

  activarGeneral(){
    this.GeneralActivo = true;
    this.DireccionActivo = false;
    this.RhhActivo = false;
   


    this.GeneralClass = 'text-success tablinks active';
    this.RhhClass = '';
    this.DireccionClass = '';
    this.ContactoClass = '';
    this.NotasClass = '';
    this.CobroClass = '';
    this.TareaClass = '';

  }

  activarDireccion(){
    this.GeneralActivo = false;
    this.DireccionActivo = true;
    this.RhhActivo = false;
   

    this.GeneralClass = '';
    this.RhhClass = ''
    this.DireccionClass = 'text-success tablinks active'
    this.ContactoClass = '';
    this.NotasClass = '';
    this.CobroClass = '';
    this.TareaClass = '';
  }

  activarContacto(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.RhhActivo = false;
   
    
    this.GeneralClass = '';
    this.RhhClass = ''
    this.DireccionClass = ''
    this.ContactoClass = 'text-success tablinks active';
    this.NotasClass = '';
    this.CobroClass = '';
    this.TareaClass = '';
  }

  activarRhh(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.RhhActivo = true;
   
    
    this.GeneralClass = '';
    this.RhhClass = 'text-success tablinks active'
    this.DireccionClass = ''
    this.ContactoClass = '';
    this.NotasClass = '';
    this.CobroClass = '';
    this.TareaClass = '';
  }

  

  search(){
    this.loadPersonas(this.searchField);
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  async loadPersonas(search?:any){
    let data = await this.contactoService.loadPersonas(this.paginacion,search,5);
    if(data['total'] == 0){
      this.Clientes = [];
    }else{
      this.Clientes = data.data;
    }
  }
  async editRecord(Persona){
    this.edit = true;
    if(Persona){
      this.Persona.Id_Persona = Persona.Id_Persona;
      this.loadPersona();
    }else{
      this.Persona = {
        Id_Persona:'',
        Nombre: '',
        Telefono:'',
        Correo:'',
        Identificacion:'',
        Tipo_Identificacion:'1',
        Provincia:'',
        Canton : '',
        Distrito:'',
        Barrio:'',
        Otras_Senas:'',
        Proveedor:'',
        Cliente:'',
        Alumno:'',
        Profesor:'',
        Empleado:'1',
        Estado:'1',
        Otro_Documento:'',
        Condicion_Venta:'',
        Plazo_Credito:'',
        Metodo_Pago:'',
        //Fecha_Ingreso:this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year,
        Porcenaje_Descuento:'',
        Moneda:'CRC',
        Ultima_Factura:'',
        Pagina_Web:'',
        Prospecto:'1',
        Facebook:'',
        Linkedin:'',
        Contabilidad:'',
        FacturaElectronica:'',
        PuntoVenta:'',
        Restaurante:'',
        Asesoria:'',
        Declaracion:'',
        Precio:'',
        Id_Empleado:'',
        Fecha_Ingreso:'',
        Fecha_I:{
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Fecha_Salida:'',
        Fecha_S:{
          month: this.hoy.getMonth() + 1,
          day: this.hoy.getDate(),
          year: this.hoy.getFullYear()
        },
        Tipo_Contrato:'',
        Jornada:'',
        Numero_Contrato:'',
        Salario_Mes:'',
        Id_Roll:'',
        Roll:''
      }
    }
  }
  async loadPersona(){
    let data = await this.contactoService.loadPersona(this.Persona.Id_Persona);
    if(data['total']==1){
      this.Persona = data['data'][0];
      this.provinceChange();
      
      if(this.Persona.Moneda == ''){
        this.Persona.Moneda = 'CRC';
      }
      //Leer RRhh
      let dataRrhh = await this.rrhhService.leerRRHH(this.Persona.Id_Persona);
      if(dataRrhh['total']==1){
        this.Persona.Fecha_Ingreso = dataRrhh['data'][0]['Fecha_Ingreso'];
        this.Persona.Fecha_Salida = dataRrhh['data'][0]['Fecha_Salida'];
        this.Persona.Tipo_Contrato = dataRrhh['data'][0]['Tipo_Contrato'];
        this.Persona.Jornada = dataRrhh['data'][0]['Jornada'];
        this.Persona.Numero_Contrato = dataRrhh['data'][0]['Numero_Contrato'];
        this.Persona.Salario_Mes = dataRrhh['data'][0]['Salario_Mes'];
        this.Persona.Estado = dataRrhh['data'][0]['Estado'];
        this.Persona.Id_Roll = dataRrhh['data'][0]['Id_Roll'];
        this.Persona.Roll = dataRrhh['data'][0]['Roll'];
        let fechaIngresoArr = this.Persona.Fecha_Ingreso.split('-');
        this.Persona.Fecha_I = {
          month: parseInt(fechaIngresoArr[1]),
          day: parseInt(fechaIngresoArr[2]),
          year: parseInt(fechaIngresoArr[0]),
        }
        let fechaSalidaArr = this.Persona.Fecha_Salida.split('-');
        this.Persona.Fecha_S = {
          month: parseInt(fechaSalidaArr[1]),
          day: parseInt(fechaSalidaArr[2]),
          year: parseInt(fechaSalidaArr[0]),
        }
      }else{
        this.Persona.Id_Empleado = "";
        this.Persona.Fecha_Ingreso = "";
        this.Persona.Fecha_Salida = "";
        this.Persona.Tipo_Contrato = "";
        this.Persona.Jornada = "";
        this.Persona.Numero_Contrato = "";
        this.Persona.Salario_Mes = "";
      }
    }
   }
   cancel(){
    this.edit = false;
   }
   async grabar(){
    this.Persona.Fecha_Ingreso = this.Persona.Fecha_I.year + '/' + this.Persona.Fecha_I.month + '/' + this.Persona.Fecha_I.day;
    this.Persona.Fecha_Salida = this.Persona.Fecha_S.year + '/' + this.Persona.Fecha_S.month + '/' + this.Persona.Fecha_S.day;
    this.Persona.Empleado = '1';
    if(this.Persona.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre del Cliente');
      return false;
    }
    //this.Persona.Fecha_Ingreso = this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year;
    let data = await this.contactoService.savePersona(this.Persona);
    if(data['success'] =='true'){
      this.Persona.Id_Empleado = data['data'][0]['Identity'];
      Swal.fire('Empleado grabado correctamente');
      this.loadPersonas(this.searchField);
      this.edit = false;
    }
    //Grabar informacion de RRhh.
    let dataRrhh = await this.rrhhService.grabarRRHH(this.Persona);
    return true;
   }
   async loadProvinces() {
    let data = await this.branchService.loadProvinces();
    if (data['total'] > 0) {
      this.Provinces = data['data'];
      if (this.Persona.Provincia == '') {
        this.Persona.Provincia = this.Provinces[0]['Provincia'];
      }
      await this.loadCantons(this.Persona.Provincia);
    }
  }
  async loadCantons(Province) {
    let data = await this.branchService.LoadCantons(Province);
    if (data['total'] > 0) {
      this.Cantons = data['data'];
      if (this.Persona.Canton == '') {
        this.Persona.Canton = this.Cantons[0]['Canton'];
      }
      await this.loadDistrict(this.Persona.Provincia, this.Persona.Canton);
    }
  }
  async loadDistrict(Province, Canton) {
    let data = await this.branchService.LoadDistrito(Province, Canton);
    if (data['total'] > 0) {
      this.Districts = data['data'];
      if (this.Persona.Distrito == '') {
        this.Persona.Distrito = this.Cantons[0]['Canton'];
      }
    }
  }
  async provinceChange() {
    await this.loadCantons(this.Persona.Provincia);
  }
  async cantonChange() {
    await this.loadDistrict(this.Persona.Provincia, this.Persona.Canton);
  }

}
