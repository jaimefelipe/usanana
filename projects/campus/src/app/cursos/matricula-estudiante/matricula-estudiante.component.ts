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

  ngOnInit() {
    this.cargarMatriculas();
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
