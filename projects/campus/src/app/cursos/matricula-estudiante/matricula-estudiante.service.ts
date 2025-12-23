import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class MatriculaEstudianteService {

constructor(
  private apiService:ApiService
) { }

 async cargarMatriculas() {

    let sqlConfig = {
      table: 'Edu_Grupo Inner Join Edu_Curso on Edu_Curso.Id_Curso = Edu_Grupo.Id_Curso',
      fields: 'Id_Grupo, Edu_Grupo.Id_Curso, Curso,Codigo,Creditos',
      where: 'Edu_Grupo.Id_Empresa = '+ localStorage.getItem('Id_Empresa')+' and Edu_Grupo.Estado = 1'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }


}
