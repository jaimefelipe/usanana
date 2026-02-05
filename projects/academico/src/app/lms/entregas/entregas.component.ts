import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';
import { EntregasService } from './entregas.service';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.css']
})
export class EntregasComponent implements OnInit, OnChanges {

  @Input() Semana: any;

  constructor(private entregasService: EntregasService) { }
  Actividades = []; // Se cargan desde Lms_Actividad
  Entregas = []; // Se cargan desde Lms_EntregaActividad

  Filtro = {
    Id_Actividad: ''
  };

  Entrega = {
    Id_Entrega: '',
    Id_Empresa: 1,
    Id_Actividad: '',
    Id_Persona: '',
    Fecha_Entrega: '',
    Archivo: '',
    Nota: null,
    Comentario_Docente: ''
  };
  ngOnInit() {
    this.cargarActividades();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['Semana'] && !changes['Semana'].firstChange) {
      this.Filtro.Id_Actividad = '';
      this.Entregas = [];
      this.cargarActividades();
    }
  }
  async cargarActividades() {
    const idSemana = this.Semana?.Id_Semana;
    const data = await this.entregasService.getActividades(idSemana);
    if (data && data['total'] > 0) {
      this.Actividades = data['data'];
    } else {
      this.Actividades = [];
    }
  }
  async cargarEntregas(){
    if (!this.Filtro.Id_Actividad) {
      this.Entregas = [];
      return;
    }
    const data = await this.entregasService.getEntregasByActividad(this.Filtro.Id_Actividad);
    if (data && data['total'] > 0) {
      this.Entregas = data['data'];
    } else {
      this.Entregas = [];
    }

  }
  async guardar(ent){
    try {
      const resp = await this.entregasService.actualizarEntrega(ent);
      if (resp && (resp['success'] === 'true' || resp['success'] === true)) {
        Swal.fire('Entrega actualizada');
      } else {
        Swal.fire(resp?.message || 'No se pudo actualizar la entrega');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la entrega');
    }
  }

  getTipoText(tipo: string): string {
    const tipos: {[key: string]: string} = {
      '1': 'Tarea',
      '2': 'Examen',
      '3': 'Foro',
      '4': 'Presentacion'
    };
    return tipos[tipo] || tipo || '';
  }

  getEntregaUrl(ent: any): string {
    const url = ent?.Url || ent?.Archivo;
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return 'https://usantana.com' + url;
  }
}
