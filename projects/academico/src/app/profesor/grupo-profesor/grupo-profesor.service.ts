import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class GrupoProfesorService {

constructor(private apiService:ApiService) { }

async cargarGrupos(paginacion,search?) {
    let sqlConfig = {
      table: 'Edu_Grupo Inner Join Edu_Curso on Edu_Grupo.Id_Curso = Edu_Curso.Id_Curso inner Join Edu_Periodo_Academico On Edu_Grupo.Id_Periodo = Edu_Periodo_Academico.Id_Periodo_Academico inner Join Gen_Sucursal on Edu_Grupo.Id_Sucursal = Gen_Sucursal.Id_Sucursal inner Join Gen_Persona on Edu_Grupo.Id_Profesor = Gen_Persona.Id_Persona',
      fields: 'Id_Grupo,Aula,Id_Periodo,Dia,Hora,Edu_Grupo.Estado,Modalidad,Edu_Curso.Codigo, Edu_Curso.Curso,Edu_Periodo_Academico.Periodo,Gen_Sucursal.Nombre',
      orderField: '',
      searchField: '',
      simple:true,
      where: 'Edu_Grupo.Estado = 1 and Gen_Persona.Id_Usuario = ' + localStorage.getItem('Id_Usuario')
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarAlumnos(Id_Grupo){
    let sqlConfig = {
      table: 'Edu_Matricula_Detalle Inner Join Edu_Matricula on Edu_Matricula_Detalle.Id_Matricula = Edu_Matricula.Id_Matricula inner Join Gen_Persona on Edu_Matricula.Id_Persona = Gen_Persona.Id_Persona',
      fields: 'Id_Matricula_Detalle, Rubrica_1,Rubrica_2,Rubrica_3,Rubrica_4,Rubrica_5,Promedio,Gen_Persona.Nombre,Edu_Matricula_Detalle.Estado',
      orderField: '',
      searchField: '',
      simple:true,
      where: 'Id_Grupo = ' + Id_Grupo
    };
     return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async grabarNotas(estudiante){
    let sqlConfig = {
      table: 'Edu_Matricula_Detalle',
      fields: 'Rubrica_1=\'' + estudiante.Rubrica_1 + '\',Rubrica_2=\'' + estudiante.Rubrica_2 + '\',Rubrica_3=\'' +  estudiante.Rubrica_3 + '\',Rubrica_4=\'' +  estudiante.Rubrica_4+ '\',Rubrica_5=\'' +  estudiante.Rubrica_5+ '\',Promedio=\'' +  estudiante.Promedio+ '\',Estado=\'' +  estudiante.Estado   + '\'',
      where: 'Id_Matricula_Detalle=' + estudiante.Id_Matricula_Detalle
    };
    return await this.apiService.updateRecord(sqlConfig);
  }
}
