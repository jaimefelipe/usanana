import { Component, OnInit,Input,SimpleChanges } from '@angular/core';
import { CursoService } from '../../../../../academico/src/app/config/curso/curso.service';

@Component({
  selector: 'app-cursos-pendientes-contacto',
  templateUrl: './cursos-pendientes-contacto.component.html',
  styleUrls: ['./cursos-pendientes-contacto.component.css']
})
export class CursosPendientesContactoComponent implements OnInit {
   @Input() Persona : any;
  constructor(
    private cursoService:CursoService  
  ) { }
  MateriasPendientes = [];
  searchField = '';
  searchFieldCarrera = '';
  ngOnInit() {
  }
   ngOnChanges(changes: SimpleChanges) {
      //Evento se dispara cuando hay cambios en el padre
      this.leerCursosPendientes();
  }
  search(){

  }
  keytab(e){

  }
  async leerCursosPendientes(){
    let data = await this.cursoService.leerCursosPendientes(this.Persona.Id_Persona);
    if(data['total']>0){
      this.MateriasPendientes = data['data'];
    }else{
      this.MateriasPendientes = [];
    }

  }
}
