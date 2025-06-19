import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CmsPaginasService {
constructor(private apiService: ApiService) {}

  // Listar páginas CMS de una empresa
  async getPaginas(paginacion?, search = '') {
    const sqlConfig = {
      table: 'Cms_Pagina',
      fields: 'Id_Pagina,Id_Empresa,Url_Amigable,Titulo,Es_Dinamica,Ruta_Estatica,Activa,Meta_Descripcion,Meta_Keywords',
      orderField: 'Titulo',
      orderDirection: 'ASC',
      where: '1=1',
      searchField: search,
      paginacion: paginacion
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  // Cargar una sola página por ID
  async getPagina(Id_Pagina) {
    const sqlConfig = {
      table: 'Cms_Pagina',
      fields: '*',
      where: `Id_Pagina = ${Id_Pagina}`
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

    // Guardar (Insertar o Actualizar) una página CMS
  async savePagina(Pagina: any) {
    // Codifica valores si es necesario aquí...

    if (!Pagina.Id_Pagina) {
      // INSERT
      const sql = {
        table: 'Cms_Pagina',
        fields: `Titulo, Url_Amigable, Es_Dinamica, Ruta_Estatica, Activa, 
                Meta_Descripcion, Meta_Keywords,
                Mostrar_En_Menu, Etiqueta_Menu, Icono_Menu, Ruta, Orden_Menu, Menu_Padre`,
        values: `'${Pagina.Titulo}', '${Pagina.Url_Amigable}', '${Pagina.Es_Dinamica ? 1 : 0}', 
                '${Pagina.Ruta_Estatica || ''}', '${Pagina.Activa ? 1 : 0}',
                '${Pagina.Meta_Descripcion || ''}', '${Pagina.Meta_Keywords || ''}',
                '${Pagina.Mostrar_En_Menu ? 1 : 0}', '${Pagina.Etiqueta_Menu || ''}', 
                '${Pagina.Icono_Menu || ''}', '${Pagina.Ruta || ''}', 
                '${Pagina.Orden_Menu || 0}', ${Pagina.Menu_Padre ?? 'NULL'}`
      };
      return await this.apiService.insertRecord(sql);
    } else {
      // UPDATE
      const sql = {
        table: 'Cms_Pagina',
        fields: `
          Titulo='${Pagina.Titulo}',
          Url_Amigable='${Pagina.Url_Amigable}',
          Es_Dinamica='${Pagina.Es_Dinamica ? 1 : 0}',
          Ruta_Estatica='${Pagina.Ruta_Estatica || ''}',
          Activa='${Pagina.Activa ? 1 : 0}',
          Meta_Descripcion='${Pagina.Meta_Descripcion || ''}',
          Meta_Keywords='${Pagina.Meta_Keywords || ''}',
          Mostrar_En_Menu='${Pagina.Mostrar_En_Menu ? 1 : 0}',
          Etiqueta_Menu='${Pagina.Etiqueta_Menu || ''}',
          Icono_Menu='${Pagina.Icono_Menu || ''}',
          Ruta='${Pagina.Ruta || ''}',
          Orden_Menu='${Pagina.Orden_Menu || 0}',
          Menu_Padre=${Pagina.Menu_Padre ?? 'NULL'}
        `,
        where: `Id_Pagina=${Pagina.Id_Pagina}`
      };
      return await this.apiService.updateRecord(sql);
    }
  }

  // Eliminar página (si se habilita)
  async deletePagina(Id_Pagina: number) {
    const sql = {
      table: 'Cms_Pagina',
      where: `Id_Pagina = ${Id_Pagina}`
    };
    //return await this.apiService.deleteRecord(sql);
  }

}
