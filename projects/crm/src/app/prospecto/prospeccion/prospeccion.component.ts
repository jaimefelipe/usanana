import { Component, OnInit,ViewChild, TemplateRef,ChangeDetectorRef  } from '@angular/core';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { BranchService } from '../../../../../main/src/app/general/branch/branch.service';
import { ActionEventArgs, CardSettingsModel,KanbanComponent, CardClickEventArgs, } from '@syncfusion/ej2-angular-kanban';
import { Prospecto } from './prospecto.model';

import Swal from 'sweetalert2';

@Component({ 
  selector: 'app-prospeccion',
  templateUrl: './prospeccion.component.html',
  styleUrls: ['./prospeccion.component.css']
})
export class ProspeccionComponent implements OnInit {
  @ViewChild('kanbanObj') kanbanObj!: KanbanComponent;
  @ViewChild('cardSettingsTemplate', { static: false }) cardTemplate!: TemplateRef<any>; 
  
  constructor(
    private contactoService:ContactoService,
    private branchService:BranchService,
    private cd: ChangeDetectorRef
    ) { }
    Empresa = localStorage.getItem('Empresa');
    nombreUsuario = localStorage.getItem('Nombre_Usuario');
/* ───────── Kanban ───────── */
  columnas = [
    { headerText: 'Saludo',           keyField: 'P1' },
    { headerText: 'Info general',     keyField: 'P2' },
    { headerText: 'Datos parciales',  keyField: 'P3' },
    { headerText: 'Info específica',  keyField: 'P4' },
    { headerText: 'Solicita agente',  keyField: 'P5' },
    { headerText: 'Cita programada',  keyField: 'P6' },
    { headerText: 'Cotización',       keyField: 'P7' },
    { headerText: 'Seguimiento',      keyField: 'P8' },
    { headerText: 'Descartado',       keyField: 'P9' }
  ];

  public  cardSettings: CardSettingsModel = {
    headerField : 'Id_Persona',
    contentField: 'Nombre',
    template    : null,
  };

  MensajesActivo = false;
  MensajesClass = '';

  edit = false
  GeneralActivo = true;
  DireccionActivo = false;
  VentaActivo = false;
  CarreraActivo = false;
  ContactosActivo = false;
  NotasActivo = false; 
  CobroActivo = false; 
  TareaActivo = false; 

  searchField = "";

  DireccionClass = '';
  VentaClass = '';
  ContactoClass = '';
  NotasClass = '';
  CobroClass = '';
  TareaClass = '';
  GeneralClass = 'text-success tablinks active';


  Clientes = [];
  Provinces = [];
  Cantons = [];
  Districts = [];
  Agentes = [];

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
    Estado:'11',
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
    Id_Agente:'',
    Nombre_Agente:'',
    Estado_Prospeccion:''
  }

  ngOnInit(): void {
    this.loadPersonas();
    //this.loadProvinces();
  }
  ngAfterViewInit() {
      // Convierte el TemplateRef en una función compatible con Syncfusion
      this.cardSettings.template = () => this.cardTemplate;
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

onKanbanAction(e){

}

  activarGeneral(){
    this.GeneralActivo = true;
    this.DireccionActivo = false;
    this.VentaActivo = false;
    this.CarreraActivo = false;
    this.ContactosActivo = false;
    this.NotasActivo = false;
    this.CobroActivo = false;
    this.TareaActivo = false;
    this.MensajesActivo = false;
    this.MensajesClass = '';


    this.GeneralClass = 'text-success tablinks active';
    this.VentaClass = '';
    this.DireccionClass = '';
    this.ContactoClass = '';
    this.NotasClass = '';
    this.CobroClass = '';
    this.TareaClass = '';

  }

activarMensajes() {
  this.GeneralActivo = false;
  this.DireccionActivo = false;
  this.VentaActivo = false;
  this.CarreraActivo = false;
  this.ContactosActivo = false;
  this.NotasActivo = false;
  this.CobroActivo = false;
  this.TareaActivo = false;
  this.MensajesActivo = true;

  this.GeneralClass = '';
  this.VentaClass = '';
  this.DireccionClass = '';
  this.ContactoClass = '';
  this.NotasClass = '';
  this.CobroClass = '';
  this.TareaClass = '';
  this.MensajesClass = 'text-success tablinks active';
}


  activarDireccion(){
    this.GeneralActivo = false;
    this.DireccionActivo = true;
    this.VentaActivo = false;
    this.CarreraActivo = false;
    this.ContactosActivo = false;
    this.NotasActivo = false;
    this.CobroActivo = false;
    this.TareaActivo = false;
        this.MensajesActivo = false;
    this.MensajesClass = '';


    this.GeneralClass = '';
    this.VentaClass = ''
    this.DireccionClass = 'text-success tablinks active'
    this.ContactoClass = '';
    this.NotasClass = '';
    this.CobroClass = '';
    this.TareaClass = '';
  }

  activarContacto(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.VentaActivo = false;
    this.CarreraActivo = false;
    this.ContactosActivo = true;
    this.NotasActivo = false;
    this.CobroActivo = false;
    this.TareaActivo = false;
        this.MensajesActivo = false;
    this.MensajesClass = '';

    
    this.GeneralClass = '';
    this.VentaClass = ''
    this.DireccionClass = ''
    this.ContactoClass = 'text-success tablinks active';
    this.NotasClass = '';
    this.CobroClass = '';
    this.TareaClass = '';
  }

  activarVenta(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.VentaActivo = true;
    this.CarreraActivo = false;
    this.ContactosActivo = false;
    this.NotasActivo = false;
    this.CobroActivo = false;
    this.TareaActivo = false;
        this.MensajesActivo = false;
    this.MensajesClass = '';

    
    this.GeneralClass = '';
    this.VentaClass = 'text-success tablinks active'
    this.DireccionClass = ''
    this.ContactoClass = '';
    this.NotasClass = '';
    this.CobroClass = '';
    this.TareaClass = '';
  }

  activarNotas(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.VentaActivo = false;
    this.CarreraActivo = false;
    this.ContactosActivo = false;
    this.NotasActivo = true;
    this.CobroActivo = false;
    this.TareaActivo = false;
    
    this.GeneralClass = '';
    this.VentaClass = ''
    this.DireccionClass = ''
    this.ContactoClass = '';
    this.NotasClass = 'text-success tablinks active';
    this.CobroClass = '';
    this.TareaClass = '';
        this.MensajesActivo = false;
    this.MensajesClass = '';

  }
  activarCobro(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.VentaActivo = false;
    this.CarreraActivo = false;
    this.ContactosActivo = false;
    this.NotasActivo = false;
    this.CobroActivo = true
    this.TareaActivo = false;
        this.MensajesActivo = false;
    this.MensajesClass = '';


    this.GeneralClass = '';
    this.VentaClass = '';
    this.DireccionClass = '';
    this.ContactoClass = '';
    this.NotasClass = '';
    this.CobroClass = 'text-success tablinks active';
    this.TareaClass = '';

  }
  activarTarea(){
    this.GeneralActivo = false;
    this.DireccionActivo = false;
    this.VentaActivo = false;
    this.CarreraActivo = false;
    this.ContactosActivo = false;
    this.NotasActivo = false;
    this.CobroActivo = false;
    this.TareaActivo = true;
        this.MensajesActivo = false;
    this.MensajesClass = '';


    this.GeneralClass = '';
    this.VentaClass = '';
    this.DireccionClass = '';
    this.ContactoClass = '';
    this.NotasClass = '';
    this.CobroClass = '';
    this.TareaClass = 'text-success tablinks active';

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
    let data = await this.contactoService.loadPersonas(this.paginacion,search,6);
    if(data['total'] == 0){
      this.Clientes = [];
    }else{
      this.Clientes = data.data;
    }
  }
  async editRecord(event: CardClickEventArgs) {
    let Persona = event.data as any; 
    this.cd.detectChanges();

    this.edit = true;
    if(Persona){
      this.Persona.Id_Persona = Persona.Id_Persona;
      this.Persona.Prospecto = '1';
      this.Persona = { ...this.Persona };
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
        Estado:'11',
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
        Id_Agente:'',
        Nombre_Agente:'',
        Estado_Prospeccion:''
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
    }
   }
   cancel(){
    this.edit = false;
   }
   async grabar(){
    if(this.Persona.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre del Cliente');
      return false;
    }
    //this.Persona.Fecha_Ingreso = this.Fecha.day + '-' + this.Fecha.month + '-' + this.Fecha.year;
    console.log('Gravando Persona')
    let data = await this.contactoService.savePersona(this.Persona);
    if(data['success'] =='true'){
      Swal.fire('Contacto grabado correctamente');
      this.loadPersonas(this.searchField);
      this.edit = false;
    }
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
  onActionComplete(event: any) {
    if (event.requestType === 'cardChanged') {
        const updatedCard = event.changedRecords[0]; // Tarjeta movida
        this.contactoService.actualizarEstadoProspeccion(updatedCard.Id_Persona,updatedCard.Estado_Prospeccion)
        //this.updateCardStatus(updatedCard.Id, updatedCard.Status);
        //Cambiar Fechas reales en estado de las tareas;
    }
  }
}
