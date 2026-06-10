import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
import { Semana, ItemSemana } from './semana.model';
import { SemanaEstudioService } from './semana-estudio.service';

@Component({
  selector: 'app-semana-estudio',
  templateUrl: './semana-estudio.component.html',
  styleUrls: ['./semana-estudio.component.css']
})
export class SemanaEstudioComponent implements OnInit {
  @Input() semana!: Semana;
  constructor(
    private semanaEstudioService:SemanaEstudioService

  ) { }
  Descripcion = 'Descripcion';
  Titulo = 'Titulo';
  Avance = 10;
  Id_Semana = localStorage.getItem('Id_Semana')
  Recursos = [];
  Actividades = [];
  Semana = {
    Titulo:'',
    RutaAprendizaje:'',
    Fecha_Inicio:'',
    Fecha_Limite:''
  }
  ngOnInit() {
    this.leerSemana();
    this.LeerRecursos();
    this.leerActividades();
  }
  
  itemSeleccionado: ItemSemana | null = null;
  actividadSeleccionada: any = null;

  seleccionarItem(item: ItemSemana) {
    this.itemSeleccionado = item;
    this.actividadSeleccionada = null;
  }

  async LeerRecursos(){
    let data = await this.semanaEstudioService.leerRecursosSemana(this.Id_Semana);
    this.Recursos = data['data'];
  }
  async leerActividades(){
    let data = await this.semanaEstudioService.leerActividadesSemana(this.Id_Semana)
    this.Actividades = data['data'];
  }
  async leerSemana(){
    let data = await this.semanaEstudioService.leerInfoSemana(this.Id_Semana);
    this.Semana = data['data'][0];

  }
  volverAlCurso(){
     history.back();
  }
  seleccionarActividad(actividad: any) {
    this.itemSeleccionado = null;
    this.actividadSeleccionada = actividad;
  }
}
