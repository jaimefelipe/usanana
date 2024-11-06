import { Component, OnInit,Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { RollService } from '../roll/roll.service';
@Component({
  selector: 'app-rrhh',
  templateUrl: './rrhh.component.html',
  styleUrls: ['./rrhh.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class RrhhComponent implements OnInit {
  @Input() Persona : any;
  constructor(
    private rollService:RollService
  ) { }
  hoy = new Date();
  Fecha =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  PantallaRoles = false;
  searchField= '';

  Roles = [];
  
  ngOnInit() {
    this.leerRoles();
  }
  openRollPanel(){
    this.PantallaRoles = true;
  }
  searchRolles(){
    this.leerRoles();
  }
  keytabRoles(event:any){
    if (event.key === 'Enter') {
      this.searchRolles();
    }
  }
  SeleccionarRoll(roll){
    this.Persona.Roll = roll.Nombre;
    this.Persona.Id_Roll = roll.Id_Roll;
    this.closePantallaRoles();
  }
  closePantallaRoles(){
    this.PantallaRoles = false;
  }
  async leerRoles(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.rollService.loadRolles(paginacion,this.searchField);
    if(data['total'] == 0){
      this.Roles = [];
    }else{
      this.Roles = data['data'];
    }
    
  }
}
