import { Component, OnInit } from '@angular/core';
import { MatriculaEstudianteService } from './matricula-estudiante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matricula-estudiante',
  templateUrl: './matricula-estudiante.component.html',
  styleUrls: ['./matricula-estudiante.component.css']
})
export class MatriculaEstudianteComponent implements OnInit {

  constructor(
    private matriculaEstudianteService:MatriculaEstudianteService
  ) { }
  edit = false;
  searchField = '';

  Matriculas = [];
  MatriculandoIdGrupo = '';

  // ── Filtro Facultad / Carrera (para alumnos matriculados en varias carreras) ──
  facultadSel = '';
  carreraSel = '';

  ngOnInit() {
    this.cargarMatriculas();
  }

  private lista(valor: string): string[] {
    return String(valor || '').split(',').map(v => v.trim()).filter(Boolean);
  }

  mostrarFiltroCarrera(): boolean {
    return this.carrerasDisponibles().length > 1;
  }

  facultadesDisponibles(): any[] {
    const vistos = new Map<string, string>();
    for (const m of this.Matriculas) {
      const ids = this.lista(m.Id_Facultad_Lista);
      const nombres = this.lista(m.Facultad);
      ids.forEach((id, idx) => { if (!vistos.has(id)) vistos.set(id, nombres[idx] || nombres[0] || ''); });
    }
    return Array.from(vistos, ([Id_Facultad, Facultad]) => ({ Id_Facultad, Facultad }));
  }

  carrerasDisponibles(): any[] {
    const vistos = new Map<string, string>();
    for (const m of this.Matriculas) {
      if (this.facultadSel && !this.lista(m.Id_Facultad_Lista).includes(this.facultadSel)) continue;
      const ids = this.lista(m.Id_Carrera_Lista);
      const nombres = this.lista(m.Carrera);
      ids.forEach((id, idx) => { if (!vistos.has(id)) vistos.set(id, nombres[idx] || nombres[0] || ''); });
    }
    return Array.from(vistos, ([Id_Carrera, Carrera]) => ({ Id_Carrera, Carrera }));
  }

  onFacultadChange(): void {
    this.carreraSel = '';
  }

  matriculasFiltradas(): any[] {
    return this.Matriculas.filter(m => {
      if (this.facultadSel && !this.lista(m.Id_Facultad_Lista).includes(this.facultadSel)) return false;
      if (this.carreraSel && !this.lista(m.Id_Carrera_Lista).includes(this.carreraSel)) return false;
      return true;
    });
  }
  search(){
    this.cargarMatriculas();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  editRecord(e){

  }
  async cargarMatriculas(){
    let data = await this.matriculaEstudianteService.cargarMatriculas();
    this.Matriculas = data?.['data'] || [];
  }

  async matricular(Matricula){
    const confirmacion = await Swal.fire({
      title: 'Confirmar matricula',
      text: `${Matricula.Codigo} - ${Matricula.Curso}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Solicitar matricula',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    this.MatriculandoIdGrupo = Matricula.Id_Grupo;
    const data = await this.matriculaEstudianteService.matricularCurso(Matricula);
    this.MatriculandoIdGrupo = '';

    if (data?.['success'] === 'true') {
      await Swal.fire('Solicitud registrada', data['message'], 'success');
      this.cargarMatriculas();
    } else {
      Swal.fire('No se pudo matricular', data?.['message'] || 'Revise la disponibilidad del curso.', 'warning');
    }
  }
}
