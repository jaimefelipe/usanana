import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CursoVisorService {

constructor(private apiService:ApiService) { }

  async leerCurso(){
    let sqlConfig = {
        table: 'Edu_Curso  inner Join Edu_Grupo on Edu_Grupo.Id_Curso = Edu_Curso.Id_Curso inner Join Gen_Persona Profesor on Profesor.Id_Persona = Edu_Grupo.Id_Profesor inner Join Edu_Matricula_Detalle on Edu_Matricula_Detalle.Id_Grupo = Edu_Grupo.Id_Grupo inner join Edu_Matricula on Edu_Matricula.Id_Matricula = Edu_Matricula_Detalle.Id_Matricula inner join Gen_Persona on Edu_Matricula.Id_Persona = Gen_Persona.Id_Persona',
        fields: 'Edu_Curso.Codigo, Edu_Curso.Curso,Edu_Curso.Creditos,Edu_Curso.Horas,Edu_Curso.Descripcion,Profesor.Nombre',
        orderField: '',
        searchField: '',
        Empresa:false,
        where: 'Edu_Curso.Id_Curso = ' + localStorage.getItem('Id_Curso') + ' and Edu_Grupo.Estado = 1 and Gen_Persona.Id_Usuario =' + localStorage.getItem('Id_Usuario')
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async leerSemanas(){
    let sqlConfig = {
        table: 'Lms_SemanaCurso inner Join Lms_AulaVirtual on Lms_AulaVirtual.Id_AulaVirtual = Lms_SemanaCurso.Id_AulaVirtual inner Join Edu_Grupo On Edu_Grupo.Id_Grupo = Lms_AulaVirtual.Id_Grupo',
        fields: 'Id_Semana,Numero_Semana,Titulo',
        orderField: 'Numero_Semana',
        orderDirection: ' ASC ',
        searchField: '',
        where: 'Edu_Grupo.Id_Curso = ' + localStorage.getItem('Id_Curso')
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
