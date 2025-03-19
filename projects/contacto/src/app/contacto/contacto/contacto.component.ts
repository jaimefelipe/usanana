import { Component, OnInit } from '@angular/core';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ContactoService } from './contacto.service';
import { BranchService } from '../../../../../main/src/app/general/branch/branch.service';
import { SecurityUserService } from '../../../../../seguridad/src/app/security/security-user/security-user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class ContactoComponent implements OnInit {
  edit = false;
  activeTab: string = 'General';
  searchField = '';
  contactList = [];
  provinces = [];
  cantons = [];
  districts = [];
  Contactos: any[] = [];
  paginacion = { FirstRow: 1, LastRow: 50, TotalRows: 0 };

  Persona = this.resetPersona();

  GeneralActivo: boolean = true;
  DireccionActivo: boolean = false;
  VentaActivo: boolean = false;
  ContactosActivo: boolean = false;
  NotasActivo: boolean = false;
  CobroActivo: boolean = false;
  TareaActivo: boolean = false;
  RollActivo: boolean = false;

  GeneralClass: string = 'btn-active';
  DireccionClass: string = 'btn-inactive';
  VentaClass: string = 'btn-inactive';
  NotasClass: string = 'btn-inactive';
  CobroClass: string = 'btn-inactive';
  TareaClass: string = 'btn-inactive';
  RollClass: string = 'btn-inactive';

  SeguridadStr = localStorage.getItem("ToxoSG");
  Seguridad = [];
  BotonGeneral = true;
  BotonDireccion = true;
  BotonRoll = true;
  BotonVentas = false;
  BotonNotas = false;
  BotonCobros = false;
  BotonTareas = false;

  /**
   * Seguridad
   * 0 = Ventas
   * 1 = Compras
   * 2 = Inventario
   * 3 = CxC
   * 4 = CXP
   * 5 = Conta
   * 6 = BA
   * 7 = Restaurante
   * 8 = Transporte
   * 9 = Seguridad
   * 10 = Hospedaje
   * 11 = Turismo
   * 12 = Proyectos
   * 13 = CRM
   * 
  */


  constructor(
    private contactoService: ContactoService,
    private branchService: BranchService,
    private securityUserService: SecurityUserService
  ) {}

  ngOnInit(): void {
    if(this.SeguridadStr == ""){
      this.SeguridadStr = "0.0.0.0.0.0.0.0.0.0.0";
    }
    this.Seguridad = this.SeguridadStr.split(".");
    this.loadPersonas();
    this.loadProvinces();
    this.prenderBotones();
  }

  prenderBotones(){
    if(this.Seguridad[0]==='1'){
      this.BotonVentas = true;
    }
  }

  resetPersona() {
    return {
      Id_Persona: '', Nombre: '', Telefono: '', Correo: '', Identificacion: '', Tipo_Identificacion: '1',
      Provincia: '', Canton: '', Distrito: '', Barrio: '', Otras_Senas: '', Proveedor: '', Cliente: '',
      Alumno: '', Profesor: '', Estado: '', Otro_Documento: '', Condicion_Venta: '', Plazo_Credito: '',
      Metodo_Pago: '', Porcenaje_Descuento: '', Moneda: 'CRC', Ultima_Factura: '', Pagina_Web: '',
      Prospecto: '1', Facebook: '', Linkedin: '', Contabilidad: '', FacturaElectronica: '', PuntoVenta: '',
      Restaurante: '', Asesoria: '', Declaracion: '', Precio: '',Codigo_Activdad_Economica:'',Nombre_Actividad_Economica:''
    };
  }

  changePage(action: number) {
    const step = 50;
    if (action === 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = step;
    } else if (action === 1 && this.paginacion.FirstRow > step) {
      this.paginacion.FirstRow -= step;
      this.paginacion.LastRow -= step;
    } else if (action === 2) {
      this.paginacion.FirstRow += step;
      this.paginacion.LastRow += step;
    }
    this.loadPersonas();
  }
  activarGeneral() {
    this.resetTabs();
    this.GeneralActivo = true;
    this.GeneralClass = 'btn-active';
  }
  activarRoll() {
    this.resetTabs();
    this.RollActivo = true;
    this.RollClass = 'btn-active';
  }


  activarDireccion() {
    this.resetTabs();
    this.DireccionActivo = true;
    this.DireccionClass = 'btn-active';
  }

  activarVenta() {
    this.resetTabs();
    this.VentaActivo = true;
    this.VentaClass = 'btn-active';
  }

  activarNotas() {
    this.resetTabs();
    this.NotasActivo = true;
    this.NotasClass = 'btn-active';
  }

  activarCobro() {
    this.resetTabs();
    this.CobroActivo = true;
    this.CobroClass = 'btn-active';
  }

  activarTarea() {
    this.resetTabs();
    this.TareaActivo = true;
    this.TareaClass = 'btn-active';
  }

  resetTabs() {
    this.GeneralActivo = this.DireccionActivo = this.VentaActivo = 
    this.NotasActivo = this.CobroActivo = this.TareaActivo = this.RollActivo = false;
    this.GeneralClass = this.DireccionClass = this.VentaClass = 
    this.NotasClass = this.CobroClass = this.TareaClass = this.RollClass = 'btn-inactive';
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  async loadPersonas(search: string = '') {
    //Depende del sistema donde este asi recupera el tipo de persona
    const data = await this.contactoService.loadPersonas(this.paginacion, search);
    this.Contactos = data.total ? data.data : [];
  }

  async editRecord(persona?: any) {
    this.edit = true;
    this.Persona = persona ? { ...persona } : this.resetPersona();
    if (persona) this.loadPersona();
  }

  async loadPersona() {
    const data = await this.contactoService.loadPersona(this.Persona.Id_Persona);
    if (data.total === 1) {
      this.Persona = data.data[0];
      this.provinceChange();
      this.Persona.Moneda ||= 'CRC';
    }
  }

  cancel() {
    this.edit = false;
  }

  async save() {
    if (!this.Persona.Nombre) {
      Swal.fire('Favor suministrar el nombre del Cliente');
      return;
    }
   
    const data = await this.contactoService.savePersona(this.Persona);
    if (data.success === 'true') {
      Swal.fire('Contacto grabado correctamente');
      this.loadPersonas(this.searchField);
      this.edit = false;
    }
  }

  async loadProvinces() {
    const data = await this.branchService.loadProvinces();
    if (data.total > 0) {
      this.provinces = data.data;
      this.Persona.Provincia ||= this.provinces[0]?.Provincia || '';
      await this.loadCantons(this.Persona.Provincia);
    }
  }

  async loadCantons(province: string) {
    const data = await this.branchService.LoadCantons(province);
    if (data.total > 0) {
      this.cantons = data.data;
      this.Persona.Canton ||= this.cantons[0]?.Canton || '';
      await this.loadDistrict(this.Persona.Provincia, this.Persona.Canton);
    }
  }

  async loadDistrict(province: string, canton: string) {
    const data = await this.branchService.LoadDistrito(province, canton);
    if (data.total > 0) {
      this.districts = data.data;
      this.Persona.Distrito ||= this.districts[0]?.Distrito || '';
    }
  }

  async provinceChange() {
    await this.loadCantons(this.Persona.Provincia);
  }

  async cantonChange() {
    await this.loadDistrict(this.Persona.Provincia, this.Persona.Canton);
  }

  search() {
    this.loadPersonas(this.searchField);
  }

  keytab(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }
}
