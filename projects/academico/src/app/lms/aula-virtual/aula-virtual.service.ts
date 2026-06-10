import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class AulaVirtualService {


  constructor(private apiService: ApiService) {}

  async getAulas(paginacion: any, filtro: string = '') {
  const sqlConfig: any = {
    table: 'Lms_AulaVirtual inner Join Edu_Grupo on Lms_AulaVirtual.Id_Grupo =  Edu_Grupo.Id_Grupo inner Join Edu_Curso on Edu_Grupo.Id_Curso = Edu_Curso.Id_Curso inner Join Gen_Persona on Edu_Grupo.Id_Profesor = Gen_Persona.Id_Persona',
    fields: 'Lms_AulaVirtual.Id_AulaVirtual,Lms_AulaVirtual.Id_Grupo,Bienvenida,Link_Reglamento,Link_Etiqueta,Lms_AulaVirtual.Imagen as Imagen,Edu_Curso.Imagen as ImagenCurso,Edu_Grupo.Nombre as Grupo, Gen_Persona.Nombre as Profesor,Lms_AulaVirtual.Activo,Edu_Curso.Curso,Edu_Curso.Codigo',
    orderField: 'Lms_AulaVirtual.Id_AulaVirtual',
    orderDirection: ' DESC ',
    paginacion: paginacion
  };

  if (filtro && filtro.trim() !== '') {
    sqlConfig.where = `(Bienvenida LIKE '%${filtro}%' OR Link_Reglamento LIKE '%${filtro}%' OR Edu_Curso.Curso LIKE '%${filtro}%')`;
  }

  return await this.apiService.executeSqlSyn(sqlConfig);
}

  async saveAula(aula: any, userId: number = null) {
    if (!aula.Id_AulaVirtual || aula.Id_AulaVirtual === '') {
      // INSERT
      const sql = {
        table: 'Lms_AulaVirtual',
        fields: 'Id_Grupo, Bienvenida, Link_Reglamento, Link_Etiqueta, Imagen, Activo' +
                (userId ? ', Creado_Por' : ''),
        values: `'${aula.Id_Grupo}', '${aula.Bienvenida}', '${aula.Link_Reglamento}', '${aula.Link_Etiqueta}', '${aula.Imagen}', '${aula.Activo ? 1 : 0}'` +
                (userId ? `, '${userId}'` : '')
      };
      return await this.apiService.insertRecord(sql);
    } else {
      // UPDATE
      const sql = {
        table: 'Lms_AulaVirtual',
        fields:
          `Id_Grupo = '${aula.Id_Grupo}', ` +
          `Bienvenida = '${aula.Bienvenida}', ` +
          `Link_Reglamento = '${aula.Link_Reglamento}', ` +
          `Link_Etiqueta = '${aula.Link_Etiqueta}', ` +
          `Imagen = '${aula.Imagen}', ` +
          `Activo = '${aula.Activo ? 1 : 0}', ` +
          `Modificado_El = NOW()` +
          (userId ? `, Modificado_Por = '${userId}'` : ''),
        where: `Id_AulaVirtual = ${aula.Id_AulaVirtual}`
      };
      console.log(sql);
      return await this.apiService.updateRecord(sql);
    }
  }

  async subirImagen(file){
    const resp = await this.apiService.loadImageFile(file);
    return this.normalizarRespuestaImagen(resp);
  }

  private normalizarRespuestaImagen(resp: any){
    const data = Array.isArray(resp)
      ? resp[0]
      : Array.isArray(resp?.data)
        ? resp.data[0]
        : resp?.data || resp;

    const url = data?.url || data?.Url || data?.URL || data?.archivo || data?.Archivo || data?.file || data?.File || data?.path || data?.Path;
    const success = data?.success === true || data?.success === 'true' || data?.Success === true || data?.Success === 'true' || !!url;

    return {
      ...data,
      success,
      url,
      message: data?.message || data?.Message || data?.Error || data?.error
    };
  }
}
