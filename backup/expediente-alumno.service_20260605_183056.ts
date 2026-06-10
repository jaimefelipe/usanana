import { Injectable, SimpleChange } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteAlumnoService {

constructor(
  private apiService:ApiService
) { }

  async cargarCarrerasAlumno(Id_Persona) {
    let sqlConfig = {
      table: 'Edu_Carrera_Estudiante inner join Edu_Carrera on Edu_Carrera_Estudiante.Id_Carrera = Edu_Carrera.Id_Carrera',
      fields: 'Edu_Carrera_Estudiante.Id_Carrera,Id_Persona,Edu_Carrera.Carrera,Edu_Carrera_Estudiante.Estado',
      orderField: '',
      searchField: '',
      where: 'Edu_Carrera_Estudiante.Id_Persona = ' +Id_Persona,
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async cargarCursosAlumno(Id_Carrera,Id_Persona) {
    let sqlConfig = {
      table: 'Edu_Carrera inner Join Edu_Curso_Carrera on Edu_Carrera.Id_Carrera = Edu_Curso_Carrera.Id_Carrera inner join Edu_Curso on Edu_Curso_Carrera.Id_Curso = Edu_Curso.Id_Curso left join (select Edu_Grupo.Id_Curso,Edu_Periodo_Academico.Periodo, Edu_Matricula_Detalle.Estado,Edu_Matricula_Detalle.Promedio  from Edu_Grupo inner join Edu_Periodo_Academico on Edu_Grupo.Id_Periodo = Edu_Periodo_Academico.Id_Periodo_Academico inner join Edu_Matricula_Detalle on Edu_Grupo.Id_Grupo = Edu_Matricula_Detalle.Id_Grupo inner Join Edu_Matricula on Edu_Matricula_Detalle.Id_Matricula = Edu_Matricula.Id_Matricula where Edu_Grupo.Id_Empresa = '+localStorage.getItem('Id_Empresa')+' and Edu_Matricula.Id_Persona = ' + Id_Persona + ') as Grupo on Edu_Curso.Id_Curso = Grupo.Id_Curso',
      fields: 'Edu_Curso.Id_Curso, Edu_Curso.Codigo, Edu_Curso.Curso, Grupo.Periodo, Grupo.Estado, Grupo.Promedio ',
      orderField: 'Grupo.Periodo',
      searchField: '',
      where: "Edu_Curso_Carrera.Id_Carrera = " + Id_Carrera
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async obtenerIdUsuario(){
    let Id_Persona = localStorage.getItem('Id_Persona');
    if(Id_Persona){
      return Id_Persona;
    }
    else{
      let sqlConfig = {
        table: 'Seg_Usuario JOIN Gen_Persona  ON Gen_Persona.Nombre = Seg_Usuario.Nombre',
        fields: 'Gen_Persona.Id_Persona',
        orderField: '',
        searchField: '',
        Empresa:false,
        where: "Seg_Usuario.Id_Usuario  = " + localStorage.getItem('Id_Usuario') + ' and Gen_Persona.Id_Empresa =' + localStorage.getItem('Id_Empresa')
      }
      let data = await this.apiService.executeSqlSyn(sqlConfig);
      Id_Persona = data['data'][0]['Id_Persona']
      localStorage.setItem('Id_Persona',Id_Persona);
      return Id_Persona;
    }
  }
}
