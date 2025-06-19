import { Component, OnInit,Input } from '@angular/core';
import { TipoPlanillaService } from '../tipo-planilla/tipo-planilla.service';

@Component({
  selector: 'app-planilla-general',
  templateUrl: './planilla-general.component.html',
  styleUrls: ['./planilla-general.component.css']
})
export class PlanillaGeneralComponent implements OnInit {
  @Input() Planilla : any;
  constructor(
    private tipoPlanillaService:TipoPlanillaService
  ) { }
  PantallaTipos = false;
  searchFieldTipos = ''
  Tipo_Planilla = [];
  ngOnInit() {
  }
  openTipoPlanillaPanel(){
    this.leerTiposPlanilla();
    this.PantallaTipos = true;
  }
  searchTipos(){

  }
  keytabTipos(e){

  }
  SeleccionarTipo(Tipo){
    this.Planilla.Id_Tipo_Planilla = Tipo.Id_Tipo_Planilla;
    this.Planilla.Tipo_Planilla = Tipo.Nombre
    this.closePantallaTipos();
  }
  closePantallaTipos(){
    this.PantallaTipos = false;
  }
  async leerTiposPlanilla(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.tipoPlanillaService.loadTipos(paginacion);
    this.Tipo_Planilla = data['data']
  }
}
