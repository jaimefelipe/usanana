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
    const idEmpresa = localStorage.getItem('Id_Empresa');
    const idUsuario = localStorage.getItem('Id_Usuario');

    if(!idEmpresa || !idUsuario){
      return { data: [], total: 0, success: 'false' };
    }

    let sqlConfig = {
      table: 'Gen_Persona p INNER JOIN Edu_Matricula m ON p.Id_Persona = m.Id_Persona INNER JOIN Edu_Matricula_Detalle md ON m.Id_Matricula = md.Id_Matricula INNER JOIN Edu_Grupo g ON md.Id_Grupo = g.Id_Grupo INNER JOIN Edu_Curso c ON g.Id_Curso = c.Id_Curso LEFT JOIN Lms_AulaVirtual av ON av.Id_Grupo = g.Id_Grupo AND av.Activo = 1',
      fields: "p.Id_Persona,m.Id_Matricula,md.Id_Grupo,g.Id_Curso, c.Curso, g.Modalidad, IF(av.Imagen IS NOT NULL AND LENGTH(av.Imagen) > 0, av.Imagen, c.Imagen) AS Imagen",
      orderField: '',
      searchField: '',
      Empresa:false,
      where: 'p.Id_Empresa = '+idEmpresa+' AND md.Estado = 1 AND c.Estado = 1 AND p.Id_Usuario = ' + idUsuario
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
