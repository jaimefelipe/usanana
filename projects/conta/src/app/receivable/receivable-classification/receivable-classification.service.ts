import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class ReceivableClassificationService {

  constructor(private apiService: ApiService) {}

  async loadCategories(paginacion,search?) {
    let sqlConfig = {
      table: 'Cxc_Clasificacion',
      fields: 'Id_Clasificacion,Nombre,Plazo,Estado',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadClasificacion(Id_Clasificacion){
    let sqlConfig = {
      table: 'Cxc_Clasificacion left join Cge_Cuenta_Contable on Cxc_Clasificacion.Cuenta_Contable = Cge_Cuenta_Contable.Cuenta and Cxc_Clasificacion.Id_Empresa = Cge_Cuenta_Contable.Id_Empresa',
      fields: 'Id_Clasificacion,Nombre,Plazo,Cuenta_Contable,Descripcion as Detalle_Cuenta,Cxc_Clasificacion.Estado',
      orderField: '',
      searchField: '',
      where: "Id_Clasificacion = " + Id_Clasificacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveClasificacion(Clasificacion){
    if(Clasificacion.Id_Clasificacion ==""){
      let sql = {
        table: 'Cxc_Clasificacion',
        fields: 'Nombre,Plazo,Cuenta_Contable,Estado',
        values: '\'' + Clasificacion.Nombre
        + '\',\'' + Clasificacion.Plazo
        + '\',\'' + Clasificacion.Cuenta
        + '\',\'' + Clasificacion.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Cxc_Clasificacion',
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
