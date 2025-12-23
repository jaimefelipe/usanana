import { Component, OnInit } from '@angular/core';
import { MatriculaEstudianteService } from './matricula-estudiante.service';

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
    this.Matriculas = data['data'];
  }
}
