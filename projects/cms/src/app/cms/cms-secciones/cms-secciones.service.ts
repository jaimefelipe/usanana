import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';

@Injectable({
  providedIn: 'root'
})
export class CmsSeccionesService {

constructor(
  private apiService:ApiService
) { }
// =======================
// 📄 Secciones de página
// =======================

// Cargar todas las secciones de una página
async getSeccionesPorPagina(Id_Pagina: number) {
  const sqlConfig = {
    table: 'Cms_Seccion',
    fields: 'Id_Seccion,Id_Pagina,Tipo_Seccion,Titulo,Contenido,Estilo_Extra,Orden,Visible',
    where: `Id_Pagina = ${Id_Pagina}`,
    orderField: 'Orden',
    orderDirection: 'ASC'
  };
  return await this.apiService.executeSqlSyn(sqlConfig);
}

// Insertar o actualizar una sección
async saveSeccion(seccion: any) {
  if (!seccion.Id_Seccion) {
    // Insert
    const sql = {
      table: 'Cms_Seccion',
      fields: 'Id_Pagina,Tipo_Seccion,Titulo,Contenido,Estilo_Extra,Orden,Visible',
      values: `'${seccion.Id_Pagina}','${seccion.Tipo_Seccion}','${seccion.Titulo}','${seccion.Contenido}','${seccion.Estilo_Extra}','${seccion.Orden}','${seccion.Visible ? 1 : 0}'`
    };
    return await this.apiService.insertRecord(sql);
  } else {
    // Update
    const sql = {
      table: 'Cms_Seccion',
      fields: `Tipo_Seccion='${seccion.Tipo_Seccion}', Titulo='${seccion.Titulo}', Contenido='${seccion.Contenido}', Estilo_Extra='${seccion.Estilo_Extra}', Orden='${seccion.Orden}', Visible='${seccion.Visible ? 1 : 0}'`,
      where: `Id_Seccion = ${seccion.Id_Seccion}`
    };
    return await this.apiService.updateRecord(sql);
  }
}

// Eliminar sección
async deleteSeccion(Id_Seccion: number) {
  const sql = {
    table: 'Cms_Seccion',
    where: `Id_Seccion = ${Id_Seccion}`
  };
  //return await this.apiService.deleteRecord(sql);
}

}
