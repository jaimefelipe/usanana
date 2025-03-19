import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ContactoService } from '../contacto/contacto.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  @Input() Persona : any;
  @Input() edit:any;
  @Input() TipoPersona:any;
  @Output() close = new EventEmitter<string>();
  PantallaAgentes= false;
  searchFieldAgentes = "";

  Agentes = [];
  constructor(
    private contactoService:ContactoService
  ) { }

  ngOnInit(): void {
    this.buscarAgentes();
    if(this.TipoPersona =='1'){
      this.Persona.Empleado =='1';
      this.Persona.Prospecto =='0';
    }
    this.Persona.Prospecto = '1';
  }
  cancel(){
    this.close.emit(this.Persona);
  }
  grabar(){}
  OpenAgentePanel(){
    this.PantallaAgentes = true;
  }
  searchAgentes(){}
  keytabAgentes(event:any){}
  SeleccionarAgente(Agente){
    this.Persona.Id_Agente = Agente.Id_Persona;
    this.Persona.Nombre_Agente = Agente.Nombre;
    this.closePantallaAgentes();
  }
  closePantallaAgentes(){
    this.PantallaAgentes = false;
  }
  
  async buscarAgentes(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.contactoService.loadPersonas(paginacion, this.searchFieldAgentes, 7); 
    this.Agentes = data['data'];
  }
}
