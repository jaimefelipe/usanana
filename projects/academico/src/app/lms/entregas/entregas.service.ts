import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class EntregasService {
  constructor(private apiService: ApiService) {}

  async getActividades(Id_Semana?: number) {
    let table = 'Lms_Actividad A';
    let fields = 'A.Id_Actividad, A.Nombre, A.Tipo';
    let where = '';

    if (Id_Semana) {
      where = 'A.Id_Semana = ' + Id_Semana;
    } else {
      const idGrupo = localStorage.getItem('Id_Grupo');
      if (idGrupo) {
        table = 'Lms_Actividad A inner join Lms_SemanaCurso S on A.Id_Semana = S.Id_Semana inner join Lms_AulaVirtual AV on S.Id_AulaVirtual = AV.Id_AulaVirtual';
        fields = 'A.Id_Actividad, A.Nombre, A.Tipo, S.Numero_Semana, S.Titulo as Semana';
        where = 'AV.Id_Grupo = ' + idGrupo;
      }
    }

    const sqlConfig = {
      table,
      fields,
      where,
      orderField: 'A.Id_Actividad',
      orderDirection: ' DESC ',
      Empresa: false
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async getEntregasByActividad(Id_Actividad: any) {
    const sqlConfig = {
      table: 'Lms_EntregaActividad EA inner join Seg_Usuario U on EA.Id_Usuario = U.Id_Usuario',
      fields: 'EA.Id_Entrega, EA.Id_Actividad, EA.Id_Usuario, EA.Url, EA.Nota, EA.Comentario_Docente, EA.Creado_El, U.Nombre as Estudiante',
      where: 'EA.Id_Actividad = ' + Id_Actividad,
      orderField: 'EA.Creado_El',
      orderDirection: ' DESC ',
      Empresa: true
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async actualizarEntrega(entrega: any) {
    const nota =
      entrega.Nota === null || entrega.Nota === undefined || entrega.Nota === ''
        ? 'NULL'
        : entrega.Nota;
    const comentario = entrega.Comentario_Docente
      ? `'${entrega.Comentario_Docente}'`
      : 'NULL';

    const where = entrega.Id_Entrega
      ? 'Id_Entrega = ' + entrega.Id_Entrega
      : 'Id_Actividad = ' +
        entrega.Id_Actividad +
        ' and Id_Usuario = ' +
        entrega.Id_Usuario;

    const sqlConfig = {
      table: 'Lms_EntregaActividad',
      fields: `Nota = ${nota}, Comentario_Docente = ${comentario}`,
      where
    };
    return await this.apiService.updateRecord(sqlConfig);
  }
}
