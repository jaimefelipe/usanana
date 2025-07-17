import { Component, OnInit, Input,Output ,EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SemanaCursoService } from './semana-curso.service';

@Component({
  selector: 'app-semana-curso',
  templateUrl: './semana-curso.component.html',
  styleUrls: ['./semana-curso.component.css']
})
export class SemanaCursoComponent implements OnInit,OnChanges  {
   @Input() Aula: any;
   @Output() editando = new EventEmitter<boolean>();

  Semanas = [];
  edit = false;

  activo = 'recursos'; // pestaña activa
  Filtro = { Id_AulaVirtual: null };
  
  Semana = {
    Id_Semana: '',
    Id_Empresa: 1,
    Id_AulaVirtual: '',
    Numero_Semana: '',
    Titulo: '',
    RutaAprendizaje: '',
    Fecha_Inicio: '',
    Fecha_Limite: ''
  };

  constructor(private semanaService: SemanaCursoService) {}

  ngOnInit(): void {
    this.editando.emit(this.edit);
    if (this.Aula?.Id_AulaVirtual) {
      this.cargarSemanas();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Aula'] && this.Aula?.Id_AulaVirtual) {
      this.Filtro.Id_AulaVirtual = this.Aula.Id_AulaVirtual;
      this.cargarSemanas();
    }
  }

  async cargarSemanas() {
    let data  = await this.semanaService.getSemanas(this.Aula.Id_AulaVirtual);
    this.Semanas = data['data'];
  }

  agregar() {
    
    this.Semana = {
      Id_Semana: '',
      Id_Empresa: 1,
      Id_AulaVirtual: this.Aula.Id_AulaVirtual,
      Numero_Semana: '',
      Titulo: '',
      RutaAprendizaje: '',
      Fecha_Inicio: '',
      Fecha_Limite: ''
    };
    this.edit = true;
    this.editando.emit(this.edit);
  }

  editar(sem: any) {
    this.Semana = { ...sem };
    this.edit = true;
    this.editando.emit(this.edit);
  }

  cancelar() {
    this.edit = false;
    this.editando.emit(this.edit);
    
    this.Semana = {
      Id_Semana: '',
      Id_Empresa: 1,
      Id_AulaVirtual: this.Aula.Id_AulaVirtual,
      Numero_Semana: '',
      Titulo: '',
      RutaAprendizaje: '',
      Fecha_Inicio: '',
      Fecha_Limite: ''
    };
  }

  async grabar() {
    this.Semana.Id_AulaVirtual = this.Aula.Id_AulaVirtual;
    const resp = await this.semanaService.guardarSemana(this.Semana);
    if (resp.success === 'true') {
      await this.cargarSemanas();
      this.cancelar();
    }
  }

  async eliminar(sem: any) {
    if (confirm('¿Desea eliminar esta semana?')) {
      await this.semanaService.eliminarSemana(sem.Id_Semana);
      this.cargarSemanas();
    }
  }

}
