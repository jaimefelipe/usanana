import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class PayableClassificationService {

  constructor(private apiService: ApiService) {}

  async loadCategories(paginacion,search?,Estado?) {
    let where = '';
    if(Estado){
      where = ' estado = ' + Estado;
    }
    let sqlConfig = {
      table: 'Cxp_Clasificacion',
      fields: 'Id_Clasificacion,Nombre,Plazo,Estado',
      orderField: '',
      searchField: search,
      paginacion: paginacion,
      where: where
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadClasificacion(Id_Clasificacion){
    let sqlConfig = {
      table: 'Cxp_Clasificacion left join Cge_Cuenta_Contable on Cxp_Clasificacion.Cuenta_Contable = Cge_Cuenta_Contable.Cuenta  and Cxp_Clasificacion.Id_Empresa = Cge_Cuenta_Contable.Id_Empresa',
      fields: 'Id_Clasificacion,Nombre,Plazo,Cuenta_Contable,Descripcion as Detalle_Cuenta,Cxp_Clasificacion.Estado',
      orderField: '',
      searchField: '',
      where: "Id_Clasificacion = " + Id_Clasificacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveClasificacion(Clasificacion){
    if(Clasificacion.Id_Clasificacion ==""){
      let sql = {
        table: 'Cxp_Clasificacion',
        fields: 'Nombre,Plazo,Cuenta_Contable,Estado',
        values: '\'' + Clasificacion.Nombre
        + '\',\'' + Clasificacion.Plazo
        + '\',\'' + Clasificacion.Cuenta
        + '\',\'' + Clasificacion.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Cxp_Clasificacion',
        fields: 'Nombre=\'' + Clasificacion.Nombre
        + '\',Plazo=\'' + Clasificacion.Plazo
        + '\',Cuenta_Contable=\'' + Clasificacion.Cuenta
        + '\',Estado=\''+ Clasificacion.Estado  + '\'',
        where: 'Id_Clasificacion=' + Clasificacion.Id_Clasificacion
      };
      return await this.apiService.updateRecord(sql);
    }
  }
}
