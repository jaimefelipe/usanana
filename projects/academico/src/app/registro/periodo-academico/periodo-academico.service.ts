import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodoAcademicoService {

  constructor(private apiService: ApiService) {}
  async loadPeriodos(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Edu_Periodo_Academico',
      fields: 'Id_Periodo_Academico,Periodo,Bloque,Anio,Inicio,Fin,Estado',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadPeriodo(Id_Periodo_Academico) {
    let sqlConfig = {
      table: 'Edu_Periodo_Academico',
      fields: 'Id_Periodo_Academico,Periodo,Bloque,Anio,Inicio,Fin,Estado',
      where: 'Id_Periodo_Academico='+Id_Periodo_Academico
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async savePeriodo(Periodo){
    if(Periodo.Id_Periodo_Academico == ""){
      let sql = {
        table: 'Edu_Periodo_Academico',
        fields: 'Periodo,Bloque,Anio,Inicio,Fin,Estado',
        values: '\'' + Periodo.Periodo
        + '\',\'' + Periodo.Bloque
        + '\',\'' + Periodo.Anio
        + '\',\'' + Periodo.Inicio
        + '\',\'' + Periodo.Fin
        + '\',\'' + Periodo.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Edu_Periodo_Academico',
        fields: 'Periodo=\'' + Periodo.Periodo
        + '\',Bloque=\'' + Periodo.Bloque
        + '\',Anio=\'' + Periodo.Anio
        + '\',Inicio=\'' + Periodo.Inicio
        + '\',Fin=\'' + Periodo.Fin
        + '\',Estado=\''+ Periodo.Estado  + '\'',
        where: 'Id_Periodo_Academico=' + Periodo.Id_Periodo_Academico
      };
      return await this.apiService.updateRecord(sql);
    }
  }

}
