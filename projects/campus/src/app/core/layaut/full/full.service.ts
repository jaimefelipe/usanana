import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class FullService {

constructor(
  private apiService:ApiService
) { }

  async CargarCursosUsuario() {
    let sqlConfig = {
      table: 'Gen_Persona p INNER JOIN Edu_Matricula m ON p.Id_Persona = m.Id_Persona INNER JOIN Edu_Matricula_Detalle md ON m.Id_Matricula = md.Id_Matricula INNER JOIN Edu_Grupo g ON md.Id_Grupo = g.Id_Grupo INNER JOIN Edu_Curso c ON g.Id_Curso = c.Id_Curso',
      fields: 'p.Id_Persona,m.Id_Matricula,md.Id_Grupo,g.Id_Curso, c.Curso, g.Modalidad',
      orderField: '',
      searchField: '',
      Empresa:false,
      where: 'p.Id_Empresa = '+localStorage.getItem('Id_Empresa')+' AND c.Estado = 1 AND p.Id_Usuario = ' + localStorage.getItem('Id_Usuario')
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
