import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskFormService {

constructor(private apiService: ApiService) {}

async leerProyecto(Id_Proyecto){
  let Id_Empresa = localStorage.getItem('Id_Empresa')
  let sqlConfig = {
    table: `Pro_Proyecto p
left join Pro_Proyecto p1 on p.Padre = p1.Codigo and p1.Id_Empresa = `+Id_Empresa+`
left join Pro_Proyecto p2 on p1.Padre = p2.Codigo and p2.Id_Empresa =  `+Id_Empresa+`
left join Pro_Proyecto p3 on p2.Padre = p3.Codigo and p3.Id_Empresa =  `+Id_Empresa+`
left join Pro_Proyecto p4 on p3.Padre = p4.Codigo and p4.Id_Empresa =  `+Id_Empresa+`
left join Pro_Proyecto p5 on p4.Padre = p5.Codigo and p5.Id_Empresa =  `+Id_Empresa+`
left join Pro_Proyecto p6 on p5.padre = p6.Codigo	and p6.Id_Empresa =  `+Id_Empresa+``,
    fields: `p.Id_Proyecto,p.Tipo,p.Nivel,p.Codigo,p.Padre,p.Nombre,p.Descripcion,p.Objetivo,p.Alcance,p.Restricciones,p.Inicio,p.Fin,p.Estado,p.Miembros,p.Prioridad,p.Progreso,p.Inicio_Planificado,p.Fin_Planificado,p.Duracion_Estimada,p.Tiempo_Real,p.Cliente,p.ClienteNombre,p.Responsable,p.ResponsableNombre,p.Supervidor,p.SupervidorNombre,p.Colaborador,p.ColaboradorNombre,p.Patrocinador,p.PatrocinadorNombre,p.Promotor,p.PromotorNombre,p.Interesado,p.InteresadoNombre, 
p1.Nombre as Tarea, p1.Codigo as Codigo_Tarea, p2.Nombre as Entregable, p2.Codigo as Codigo_Entregable, p3.Nombre as Fase, p3.Codigo as Nombre_Fase, 
p4.Nombre as Proyecto, p4.Codigo as Codigo_Proyecto, p5.Nombre as Programa, p5.Codigo as Codigo_Programa, p6.Nombre as Portafolio, p6.Codigo as Codigo_Portafolio`,
  Empresa: false,
  orderField:'p.Id_Proyecto',  
  where:"p.Id_Proyecto = " + Id_Proyecto + ' and p.Id_Empresa =' + Id_Empresa
  }
  return await this.apiService.executeSqlSyn(sqlConfig,2);

}
async newProyecto(Proyecto){
  let sql = {
    table: 'Pro_Proyecto',
    fields: 'Tipo,Nivel,Codigo,Padre,Nombre,Descripcion,Objetivo,Alcance,Restricciones,Inicio,Fin,Estado,Miembros,Prioridad,Progreso,Inicio_Planificado,Fin_Planificado,Duracion_Estimada,Tiempo_Real,Cliente,ClienteNombre,Responsable,ResponsableNombre,Supervidor,SupervidorNombre,Colaborador,ColaboradorNombre,Patrocinador,PatrocinadorNombre,Promotor,PromotorNombre,Interesado,InteresadoNombre',
    values: '\'' + Proyecto.Tipo
    + '\',\'' + Proyecto.Nivel
    + '\',\'' + Proyecto.Codigo
    + '\',\'' + Proyecto.Padre
    + '\',\'' + Proyecto.Nombre
    + '\',\'' + Proyecto.Descripcion
    + '\',\'' + Proyecto.Objetivo
    + '\',\'' + Proyecto.Alcance
    + '\',\'' + Proyecto.Restricciones
    + '\',\'' + Proyecto.Inicio
    + '\',\'' + Proyecto.Fin
    + '\',\'' + Proyecto.Estado
    + '\',\'' + Proyecto.Miembros
    + '\',\'' + Proyecto.Prioridad
    + '\',\'' + Proyecto.Progreso
    + '\',\'' + Proyecto.Inicio_Planificado
    + '\',\'' + Proyecto.Fin_Planificado
    + '\',\'' + Proyecto.Duracion_Estimada
    + '\',\'' + Proyecto.Tiempo_Real
    + '\',\'' + Proyecto.Cliente
    + '\',\'' + Proyecto.ClienteNombre
    + '\',\'' + Proyecto.Responsable
    + '\',\'' + Proyecto.ResponsableNombre
    + '\',\'' + Proyecto.Supervidor
    + '\',\'' + Proyecto.SupervidorNombre
    + '\',\'' + Proyecto.Colaborador
    + '\',\'' + Proyecto.ColaboradorNombre
    + '\',\'' + Proyecto.Patrocinador
    + '\',\'' + Proyecto.PatrocinadorNombre
    + '\',\'' + Proyecto.Promotor
    + '\',\'' + Proyecto.PromotorNombre
    + '\',\'' + Proyecto.Interesado
    + '\',\'' + Proyecto.InteresadoNombre
    + '\''
  };
  return await this.apiService.insertRecord(sql);
}
async updateProyecto(Proyecto){
  let sql = {
    table: 'Pro_Proyecto',
    fields: 'Tipo=\'' + Proyecto.Tipo
    + '\',Nivel=\'' + Proyecto.Nivel
    + '\',Codigo=\'' + Proyecto.Codigo
    + '\',Padre=\'' + Proyecto.Padre
    + '\',Nombre=\''+ Proyecto.Nombre
    + '\',Descripcion=\''+ Proyecto.Descripcion
    + '\',Objetivo=\''+ Proyecto.Objetivo
    + '\',Alcance=\''+ Proyecto.Alcance
    + '\',Restricciones=\''+ Proyecto.Restricciones
    + '\',Inicio=\''+ Proyecto.Inicio
    + '\',Fin=\''+ Proyecto.Fin
    + '\',Estado=\''+ Proyecto.Estado
    + '\',Miembros=\''+ Proyecto.Miembros
    + '\',Prioridad=\''+ Proyecto.Prioridad
    + '\',Progreso=\''+ Proyecto.Progreso
    + '\',Inicio_Planificado=\''+ Proyecto.Inicio_Planificado
    + '\',Fin_Planificado=\''+ Proyecto.Fin_Planificado
    + '\',Duracion_Estimada=\''+ Proyecto.Duracion_Estimada
    + '\',Cliente=\''+ Proyecto.Cliente
    + '\',Tiempo_Real=\''+ Proyecto.Tiempo_Real
    + '\',ClienteNombre=\''+ Proyecto.ClienteNombre
    + '\',Responsable=\''+ Proyecto.Responsable
    + '\',ResponsableNombre=\''+ Proyecto.ResponsableNombre
    + '\',Supervidor=\''+ Proyecto.Supervidor
    + '\',SupervidorNombre=\''+ Proyecto.SupervidorNombre
    + '\',Colaborador=\''+ Proyecto.Colaborador
    + '\',ColaboradorNombre=\''+ Proyecto.ColaboradorNombre
    + '\',Patrocinador=\''+ Proyecto.Patrocinador
    + '\',PatrocinadorNombre=\''+ Proyecto.PatrocinadorNombre
    + '\',Promotor=\''+ Proyecto.Promotor
    + '\',PromotorNombre=\''+ Proyecto.PromotorNombre
    + '\',Interesado=\''+ Proyecto.Interesado
    + '\',InteresadoNombre=\''+ Proyecto.InteresadoNombre
    + '\'',
    where: 'Id_Proyecto=' + Proyecto.Id_Proyecto
  };
  return await this.apiService.updateRecord(sql,2);
}
async updateProyectCode(Id_Proyecto,Codigo,Padre,Nivel){
  let sql = {
    table: 'Pro_Proyecto',
    fields: 'Codigo=\'' + Codigo
    + '\',Padre=\'' + Padre
    + '\',Nivel=\''+ Nivel
    + '\',Tipo=\''+ Nivel
    + '\'',
    where: 'Id_Proyecto=' + Id_Proyecto
  };
  return await this.apiService.updateRecord(sql,2);
}

async getLastProyectId(Id_Proyecto){
  let sqlConfig;

  // Si hay un Id_Proyecto, buscar ese proyecto y contar sus subproyectos
  if (Id_Proyecto !== '') {
    let where = `p.Id_Proyecto = '${Id_Proyecto}' AND p.Id_Empresa = ${localStorage.getItem('Id_Empresa')}`;
    sqlConfig = {
      table: 'Pro_Proyecto p',
      fields: `p.Id_Proyecto, p.Codigo, p.Padre, 
               (SELECT COUNT(*) FROM Pro_Proyecto WHERE Padre = p.Codigo) AS Cantidad_Subproyectos`,
      Empresa: false,
      where: where
    };
  } else {
    // Caso sin proyecto padre: contar cuántos proyectos no tienen padre
    sqlConfig = {
      table: '(SELECT NULL AS Id_Proyecto, 0 AS Codigo, NULL AS Padre, COUNT(*) AS Cantidad_Subproyectos FROM Pro_Proyecto WHERE (Padre IS NULL OR Padre = \'\') AND Id_Empresa = ' + localStorage.getItem('Id_Empresa') + ') AS p',
      fields: '*',
      Empresa: false,
      orderField:'Id_Proyecto',
      where: '1=1'  // ya viene filtrado en el subquery
    };
  }

  return await this.apiService.executeSqlSyn(sqlConfig);
}

async AsignarMiembro(Id_Proyecto,Id_Persona){
  let sql = {
    table: 'Pro_Miembro',
    fields: 'Id_Proyecto,Id_Persona',
    values: '\'' + Id_Proyecto
    + '\',\'' + Id_Persona
    + '\''
  };
  return await this.apiService.insertRecord(sql);
}
async DesasignarMiembro(Id_Proyecto,Id_Persona){
  let sql = "Delete from Pro_Miembro where Id_Proyecto = "+Id_Proyecto + " and Id_Persona = "+ Id_Persona;
  return await this.apiService.postRecord(sql);
}
async leerMiembros(Id_Proyecto){
  let sqlConfig = {
    table: 'Pro_Miembro inner join Gen_Persona on Pro_Miembro.Id_Persona = Gen_Persona.Id_Persona',
    fields: 'Id_Miembro,Id_Proyecto,Pro_Miembro.Id_Persona,Nombre',
    where:"Id_Proyecto = " + Id_Proyecto
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}
async nuevaNota(Nota){
  let sql = {
    table: 'Pro_Nota',
    fields: 'Id_Proyecto,Id_Persona,Nota',
    values: '\'' + Nota.Id_Proyecto
    + '\',\'' + Nota.Id_Persona
    + '\',\'' + Nota.Nota
    + '\''
  };
  return await this.apiService.insertRecord(sql);
}
async leerNotas(Id_Proyecto){
  let sqlConfig = {
    table: 'Pro_Nota inner join Gen_Persona on Pro_Nota.Id_Persona = Gen_Persona.Id_Usuario',
    fields: 'Id_Nota,Id_Proyecto,Pro_Nota.Id_Persona,Nombre,Nota,Pro_Nota.Creado_El as Fecha',
    where:"Id_Proyecto = " + Id_Proyecto
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}

  async leerPortaProyectosHijos(Padre,Nivel){
    let nivelPadre = parseInt(Nivel) - 1;
    let sqlConfig = {};
    if(Nivel == '1'){
      sqlConfig = {
        table: 'Pro_Proyecto',
        fields: 'Id_Proyecto,Nivel,Codigo,Padre,Nombre',
        where:"(Padre = '" + Padre + "' or Padre = `'`') and Nivel =" + Nivel
      }
      return await this.apiService.executeSqlSyn(sqlConfig);
    }else{
      let Id_Empresa = localStorage.getItem('Id_Empresa');
      sqlConfig = `Select Id_Proyecto,Nivel,Codigo,Padre,Nombre FROM Pro_Proyecto WHERE Padre = ( 
        Select Codigo From Pro_Proyecto where Nombre = '`+Padre+`' and Nivel = `+nivelPadre+` and  Id_Empresa = `+Id_Empresa+`) 
        and Nivel = `+Nivel+` And Id_Empresa = `+Id_Empresa+`;`
      return await this.apiService.postRecord(sqlConfig);
    }
  }

  async leerIdProyecto(Codigo){
    let sqlConfig = {
      table: 'Pro_Proyecto',
      fields: 'Id_Proyecto',
      where:"Codigo= '" + Codigo + "'"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
