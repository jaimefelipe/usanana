import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class RrhhService {

  constructor(private apiService: ApiService) {}

  async leerRRHH(Id_Persona){
    let sqlConfig = {
      table: 'Rhh_Empleado',
      fields: 'Id_Empleado,Estado,Id_Persona,Fecha_Ingreso,Fecha_Salida,Tipo_Contrato,Jornada,Numero_Contrato,Salario_Mes,Salario_Mes,Id_Roll,Nombre_Roll as Roll,Id_Escolaridad,Fecha_Examen_Psicologico,Fecha_Curso_Basico',
      orderField: '',
      searchField: '',
      where: "Id_Persona = " + Id_Persona
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async grabarRRHH(Persona){
    if(Persona.Id_Empleado == ""){
      let sql = {
        table: 'Rhh_Empleado',
        fields: 'Id_Persona,Tipo_Contrato,Jornada,Numero_Contrato,Salario_Mes,Estado,Id_Roll,Nombre_Roll,Id_Escolaridad.Fecha_Examen_Psicologico,Fecha_Curso_Basico',
        values: '\'' + Persona.Id_Persona
        + '\',\'' + Persona.Tipo_Contrato
        + '\',\'' + Persona.Jornada
        + '\',\'' + Persona.Numero_Contrato
        + '\',\'' + Persona.Salario_Mes
        + '\',\'' + Persona.Estado
        + '\',\'' + Persona.Id_Roll
        + '\',\'' + Persona.Roll
        + '\',\'' + Persona.Id_Escolaridad
        + '\',\'' + Persona.Fecha_Examen_Psicologico
        + '\',\'' + Persona.Fecha_Curso_Basico
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Rhh_Empleado',
        fields: 'Id_Persona=\'' + Persona.Id_Persona
        + '\',Tipo_Contrato=\'' + Persona.Tipo_Contrato
        + '\',Jornada=\'' + Persona.Jornada
        + '\',Numero_Contrato=\''+ Persona.Numero_Contrato
        + '\',Salario_Mes=\''+ Persona.Salario_Mes
        + '\',Estado=\''+ Persona.Estado
        + '\',Id_Roll=\''+ Persona.Id_Roll
        + '\',Nombre_Roll=\''+ Persona.Roll
        + '\',Id_Escolaridad=\''+ Persona.Id_Escolaridad
        + '\',Fecha_Examen_Psicologico=\''+ Persona.Fecha_Examen_Psicologico
        + '\',Fecha_Curso_Basico=\''+ Persona.Fecha_Curso_Basico
        + '\'',
        where: 'Id_Empleado=' + Persona.Id_Empleado
      };
      return await this.apiService.updateRecord(sql);
    }
  }

}
