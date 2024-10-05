import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {

  constructor(private apiService: ApiService) {}
  async loadLocalidades(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Rhh_Localidad',
      fields: 'Id_Localidad,Localidad',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadLocalidad(Id_Localidad) {
    let sqlConfig = {
      table: 'Rhh_Localidad',
      fields: 'Id_Localidad,Codigo,Localidad,Id_Persona,Provincia,Canton,Distrito,Barrio,Direccion,Estado',
      where: 'Id_Localidad='+Id_Localidad
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveLocalidad(Localidad){
    if(Localidad.Id_Localidad == ""){
      let sql = {
        table: 'Rhh_Localidad',
        fields: 'Codigo,Localidad,Id_Persona,Provincia,Canton,Distrito,Barrio,Direccion,Estado',
        values: '\'' + Localidad.Codigo
        + '\',\'' + Localidad.Localidad
        + '\',\'' + Localidad.Id_Persona
        + '\',\'' + Localidad.Provincia
        + '\',\'' + Localidad.Canton
        + '\',\'' + Localidad.Distrito
        + '\',\'' + Localidad.Barrio
        + '\',\'' + Localidad.Direccion
        + '\',\'' + Localidad.Estado
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Rhh_Localidad',
        fields: 'Codigo=\'' + Localidad.Codigo
        + '\',Localidad=\''+ Localidad.Localidad
        + '\',Id_Persona=\''+ Localidad.Id_Persona
        + '\',Provincia=\''+ Localidad.Provincia
        + '\',Canton=\''+ Localidad.Canton
        + '\',Distrito=\''+ Localidad.Distrito
        + '\',Barrio=\''+ Localidad.Barrio
        + '\',Direccion=\''+ Localidad.Direccion
        + '\',Estado=\''+ Localidad.Estado
         + '\'', 
        where: 'Id_Localidad=' + Localidad.Id_Localidad
      };
      return await this.apiService.updateRecord(sql);
    }
  }

}
