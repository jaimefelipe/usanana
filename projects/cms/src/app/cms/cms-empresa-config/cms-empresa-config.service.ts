import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CmsEmpresaconfigService {

constructor(private apiService: ApiService) {}

  async loadEmpresa(Id_Empresa: number) {
    const sqlConfig = {
      table: 'Gen_Empresa',
      fields: `Id_Empresa, Nombre_Comercial, Dominio_Principal, Sitio_Desde_CMS, Ruta_Archivo_HTML, Tiene_LMS, LMS_Integrado_Web`,
      where: `Id_Empresa = ${Id_Empresa}`
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveEmpresaCMS(empresa: any) {
    const sql = {
      table: 'Gen_Empresa',
      fields:
        `Dominio_Principal='${empresa.Dominio_Principal}',` +
        `Sitio_Desde_CMS='${empresa.Sitio_Desde_CMS ? 1 : 0}',` +
        `Ruta_Archivo_HTML='${empresa.Ruta_Archivo_HTML}',` +
        `Tiene_LMS='${empresa.Tiene_LMS ? 1 : 0}',` +
        `LMS_Integrado_Web='${empresa.LMS_Integrado_Web ? 1 : 0}'`,
      where: `Id_Empresa=${empresa.Id_Empresa}`
    };
    return await this.apiService.updateRecord(sql);
  }

}
