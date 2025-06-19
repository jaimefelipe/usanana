import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CmsIntegracionesService {

 constructor(private apiService: ApiService) {}

  async loadIntegraciones(Id_Empresa: number) {
    const sqlConfig = {
      table: 'Gen_Empresa_Integracion_Externa',
      fields: 'Id_Integracion,Id_Empresa,Tipo_Integracion,Url_Conexion,Token_API,Estado,Notas,Creado_El',
      orderField: 'Tipo_Integracion',
      where: `Id_Empresa = ${Id_Empresa}`
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async guardarIntegracion(integ: any) {
    if (!integ.Id_Integracion) {
      const sql = {
        table: 'Gen_Empresa_Integracion_Externa',
        fields: 'Tipo_Integracion,Url_Conexion,Token_API,Estado,Notas',
        values: `'${integ.Tipo_Integracion}','${integ.Url_Conexion}','${integ.Token_API}','${integ.Estado ? 1 : 0}','${integ.Notas}'`
      };
      return await this.apiService.insertRecord(sql);
    } else {
      const sql = {
        table: 'Gen_Empresa_Integracion_Externa',
        fields: `Tipo_Integracion='${integ.Tipo_Integracion}',
                 Url_Conexion='${integ.Url_Conexion}',
                 Token_API='${integ.Token_API}',
                 Estado='${integ.Estado ? 1 : 0}',
                 Notas='${integ.Notas}'`,
        where: `Id_Integracion=${integ.Id_Integracion}`
      };
      return await this.apiService.updateRecord(sql);
    }
  }

  async eliminarIntegracion(Id_Integracion: number) {
    const sql = {
      table: 'Gen_Empresa_Integracion_Externa',
      where: `Id_Integracion=${Id_Integracion}`
    };
    //return await this.apiService.deleteRecord(sql);
  }

}
