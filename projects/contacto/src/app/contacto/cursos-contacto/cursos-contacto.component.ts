import { Component, OnInit,Input,SimpleChanges } from '@angular/core';
import { CursoService } from '../../../../../academico/src/app/config/curso/curso.service';

@Component({
  selector: 'app-cursos-contacto',
  templateUrl: './cursos-contacto.component.html',
  styleUrls: ['./cursos-contacto.component.css']
})
export class CursosContactoComponent implements OnInit {
  @Input() Persona : any;
  constructor(
    private cursoService:CursoService
  ) { }
  searchField = '';
  Materias = [];

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
      //Evento se dispara cuando hay cambios en el padre
      this.leerCursosContacto();
  }
  search(){

  }
  keytab(e){

  }
  async leerCursosContacto(){
    let data = await this.cursoService.LeerCursosEstudiantes(this.Persona.Id_Persona);
    if(data['total']>0){
      this.Materias = data['data'];
    }else{
      this.Materias = [];
    }
    
  }
}
