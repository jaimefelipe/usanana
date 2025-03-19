import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url = '';

  constructor() {
    //if(window.location.hostname == 'localhost'){
    //  this.url = 'https://ibo.jaimebrenes.com/core/php/db/eps_execSql.php?sql=';
    //}else{
    //  this.url = '/core/php/db/eps_execSql.php';
    //}
    //if(window.location.hostname == 'localhost'){
      //this.url = 'http://api.toxo.work/core/db/eps_execSql.php?sql=';
    //}else{
      this.url = 'https://toxo.work/core/db/eps_execSql.php?sql=';
    //}
  }
  data = {
    data: [],
  };

  sqlConfig: any = {
    table: '',
    fields: '',
    where: '',
    orderField: '',
    orderDirection: ' DESC ',
    lastDirection: ' DESC ',
    searchField: '',
    values: '',
    Empresa: true,
    Distinct:true,
    simple: false,
    paginacion: {
      FirstRow: 1,
      LastRow: 25,
      TotalRows: 0,
    },
  };
  sql = '';
  indexField = '';
  sqlWhere = '';
  direccion = ' ASC ';
  async getObtenerTC(Fecha: any) {
    //return await fetch('https://tipodecambio.paginasweb.cr/api/' + Fecha)
    return await fetch('https://apis.gometa.org/tdc/tdc.json')
    .then((response) => {
      if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch(function () {
        return JSON.parse('[{"compra":"","venta":"","fecha":""}]');
        
      });
  }

  correctConfig() {
    if (typeof this.sqlConfig.where === 'undefined') {
      this.sqlConfig.where = '';
    }
    if (typeof this.sqlConfig.orderField === 'undefined') {
      this.sqlConfig.orderField = '';
    }
    if (typeof this.sqlConfig.orderDirection === 'undefined') {
      this.sqlConfig.orderDirection = ' DESC ';
    }
    if (typeof this.sqlConfig.searchField === 'undefined') {
      this.sqlConfig.searchField = '';
    }
    if (typeof this.sqlConfig.values === 'undefined') {
      this.sqlConfig.values = '';
    }
    if (typeof this.sqlConfig.Empresa === 'undefined') {
      this.sqlConfig.Empresa = true;
    }
    if (typeof this.sqlConfig.simple === 'undefined') {
      this.sqlConfig.simple = false;
    }
    if (typeof this.sqlConfig.Distinct === 'undefined') {
      this.sqlConfig.Distinct = false;
    }
    if (typeof this.sqlConfig.paginacion === 'undefined') {
      this.sqlConfig.paginacion = {
        FirstRow: 1,
        LastRow: 50,
        TotalRows: 0,
      };
    }
  }
  makeWhere() {
    let where = ' WHERE ';
    let EmpresaWhere = '';
    let tableforEmpresa = this.sqlConfig.table.split(' ');
    if (this.sqlConfig.Empresa) {
      //EmpresaWhere = ' ( '+ tableforEmpresa[0] + '.Id_Empresa = '+ localStorage.getItem('Id_Empresa') + ')';
      EmpresaWhere =
        ' ( ' +
        tableforEmpresa[0] +
        '.Id_Empresa = ' +
        localStorage.getItem('Id_Empresa') +
        ')';
    }
    this.sqlWhere = '';
    // tslint:disable-next-line: triple-equals
    if (this.sqlConfig.searchField != '') {
      //Si el search tiene datos
      let fields = this.sqlConfig.fields.split(',');
      if (this.sqlConfig.where != '') {
        if (fields.length > 1) {
          where = where + this.sqlConfig.where + ' AND ( ';
        } else {
          where = where + this.sqlConfig.where + ' OR ';
        }
      } else {
        if (fields.length > 1) {
          where = where + '(';
        }
      }

      let isFirst = true;
      for (let field of fields) {
        if (!isFirst) {
          where = where + ' OR ';
        } else {
          isFirst = false;
        }
        let fieldArray = field.split('AS');
        let campo = '';
        if (fieldArray.length > 1) {
          campo = fieldArray[0];
        } else {
          campo = field;
          let campodArray = campo.split('as');
          if (campodArray.length > 1) {
            campo = campodArray[0];
          }
        }
        where = where + campo + " Like '---" + this.sqlConfig.searchField + "---'";
      }
      if (fields.length > 1) {
        where = where + ')';
      }

      this.sqlWhere = where;
      if (this.sqlConfig.Empresa) {
        this.sqlWhere = this.sqlWhere + ' and ' + EmpresaWhere;
      }
    } else {
      //Si el search no tiene datos
      if (this.sqlConfig.where !== '') {
        if (where == ' WHERE ') {
          where = ' WHERE (';
        }
        this.sqlWhere = where + '' + this.sqlConfig.where;
        this.sqlWhere = this.sqlWhere + ')';

        if (this.sqlConfig.Empresa) {
          this.sqlWhere = this.sqlWhere + ' and ' + EmpresaWhere;
        }


      } else {
        //Viene un where
        if (this.sqlConfig.Empresa) {
          this.sqlWhere = ' WHERE ' + EmpresaWhere;
        }
      }
    }
  }
  makeSql() {
    let tableField = this.sqlConfig.fields.split(',');
    this.indexField = tableField[0];
    if (this.sqlConfig.simple) {
      this.sql =
        'SELECT ' + this.sqlConfig.fields + ' FROM ' + this.sqlConfig.table;
    }
    this.makeWhere();
    this.sql = this.sql + this.sqlWhere;

    if (this.sqlConfig.orderField !== this.indexField) {
      //console.log(this.sqlConfig.orderDirection);
      /*
      if (this.sqlConfig.orderDirection == ' DESC ') {
        this.direccion = ' ASC ';
        this.sqlConfig.orderDirection = ' ASC ';
      } else {
        this.direccion = ' DESC ';
        this.sqlConfig.orderDirection = ' DESC ';
      }*/
    }
    if (this.sqlConfig.orderField != '') {
      this.sql =
        this.sql +
        ' ORDER BY ' +
        this.sqlConfig.orderField +
        ' ' +
        this.sqlConfig.orderDirection;
        //this.direccion;
    } else {
      this.sqlConfig.orderField = this.indexField;
    }

    let orderFieldArr = this.sqlConfig.orderField.split('.');
    let simpleOrderField = '';
    if (orderFieldArr.length > 1) {
      simpleOrderField = orderFieldArr[1];
    } else {
      simpleOrderField = this.sqlConfig.orderField;
    }
    if (this.sqlConfig.simple === false) {
      //Limit y Offset para Mysql
      let tamanio =
        this.sqlConfig.paginacion.LastRow - this.sqlConfig.paginacion.FirstRow + 1;
      let sql = '';
      if(this.sqlConfig.Distinct){
        sql = sql + 'SELECT Distinct ';
      }else{
        sql = sql + 'SELECT ';
      }
      sql = sql + this.sqlConfig.fields;
      sql = sql + ' FROM ';
      sql = sql + this.sqlConfig.table;
      sql = sql + this.sqlWhere;
      sql = sql + ' ORDER BY ' + simpleOrderField + ' ' + this.sqlConfig.orderDirection;
      sql =
        sql +
        ' LIMIT ' +
        tamanio +
        ' OFFSET ' +
        (this.sqlConfig.paginacion.FirstRow - 1);
      this.sql = sql;
    }
  }
  async buildSql(sqlConfig: any) {
    this.validarLogin();
    this.sqlConfig = sqlConfig;
    this.correctConfig();
    this.makeSql();
    return this.sql;
  }

  async executeSqlSyn(sqlConfig: any,Tipo?) {
    this.validarLogin();
    this.sqlConfig = sqlConfig;
    this.correctConfig();
    this.makeSql();
    let data = await this.postRecord('',Tipo);
    if (data['success'] == 'true') {
      return data;
    } else {
      return false;
    }
  }
  validarLogin() {
    if (!localStorage.getItem('Id_Empresa')) {
      //localStorage.setItem('Id_Empresa', '1');
    }
  }
  async updateRecord(sqlConfig: any,Tipo?) {
    this.sqlConfig = sqlConfig;
    let values = this.sqlConfig.fields.split('#');
    this.sqlConfig.fields = values.join('|@*|');
    // tslint:disable-next-line: max-line-length
    this.sql =
      'UPDATE ' +
      this.sqlConfig.table +
      ' SET ' +
      this.sqlConfig.fields +
      ", Modificado_Por= '" +
      localStorage.getItem('Nombre_Usuario') +
      "', Modificado_El = NOW() WHERE " +
      this.sqlConfig.where;
    let data = await this.postRecord('',Tipo);
    if (data['success'] == "true") {
      return data;
    } else {
      Swal.fire({
        title:'Update',
        text:data['error'],
        footer:data['sql']
      });
      return false;
    }
  }
  async insertRecord(sqlConfig: any) {
    this.sqlConfig = sqlConfig;
    if (this.sqlConfig.Empresa !== false) {
      this.sqlConfig.fields =
        this.sqlConfig.fields + ',Id_Empresa,Creado_Por,Creado_El';
      this.sqlConfig.values =
        this.sqlConfig.values +
        ',' +
        localStorage.getItem('Id_Empresa') +
        ",'" +
        localStorage.getItem('Nombre_Usuario') +
        "', NOW()";
    }
    this.sql =
      'INSERT INTO ' +
      this.sqlConfig.table +
      ' (' +
      this.sqlConfig.fields +
      ') VALUES (' +
      this.sqlConfig.values +
      //");SELECT LAST_INSERT_ID() AS 'Identity'";
      ")";
    let data = await this.postRecord();
    if (data['success'] == "true") {
      return data;
    } else {
      Swal.fire({
        title:'Insert',
        text:data['error'],
        footer:data['sql']
      });
      return false;
    }
  }

  async postRecord(sql?: any,Tipo?:any) {
    //Validar conexion http
    if (!navigator.onLine) {
      Swal.fire('No hay internet, revise la conexion');
      return false;
    }

    let Url = '';
    if(Tipo ==2){
      Url = 'https://toxo.work/core/db/eps_execSql2.php?sql=';
    }else{
      Url = this.url;
    }

    let sqlQuery = '';
    if (sql) {
      sqlQuery = sql;
    } else {
      sqlQuery = this.sql;
    }

    let a = new TextEncoder();
    sqlQuery = encodeURIComponent(sqlQuery);
    const startTime = performance.now(); // Iniciamos el contador de tiempo
    let data = await fetch(Url, {
      method: 'POST',
      cache: 'no-cache',
      mode: 'cors', //no-cors,cors, *cors, same-origin
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: 'sql=' + sqlQuery,
    })
    .then((response) => {
        const endTime = performance.now(); // Obtenemos el tiempo de respuesta
        const latency = endTime - startTime; // Calculamos el tiempo de latencia en milisegundos
        // Aquí definimos el umbral de latencia que consideramos como "lento"
        const slowThreshold = 5000; // 1000 ms = 1 segundo, puedes ajustarlo según tus necesidades
        if (latency > slowThreshold) {
          Swal.fire('Internet muy lento, no responde, revise la conexion');
          return false; // La conexión es lenta
        }

        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch(function () {
        return JSON.parse('[{"success":"false","total":"0","Error":"error en catch"}]');
      });

    return data;
  }
  async postScript(url?:any,Id?:any){
    let data = await fetch(url+'?IdDocument='+Id, {
      method: 'POST',
      cache: 'no-cache',
      mode: 'cors', //no-cors,cors, *cors, same-origin
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: 'IdDocument=' + Id,
    })
    .then((response) => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then((json) => {

        return json;
      })
      .catch(function () {
        return JSON.parse('[{"success":"false","total":"0","Error":"error en catch"}]');
      });

    return data;
  }
  async aplicarFacturaHacienda(identification: any) {
    return await fetch(
      'https://toxo.work/core/php/hacienda2/Conexion_Hacienda.php?IdDocument=' +
        identification
    )
      .then((response) => {
        if (!response.ok) {
          
          //return JSON.parse('{success:"false",total:"0", eror:"Error desconocido"}');
          return JSON.parse('[{"success":"false","total":"0","Error":"Error desconocido"}]');
          
          //throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        //jaime
         return JSON.parse('[{"success":"false","total":"0","eror":"'+error+'"}]');
         
       })
  }
  async getApiHacienda(identification: any) {
    return await fetch(
      'https://api.hacienda.go.cr/fe/ae?identificacion=' + identification
    )
      .then((response) => {
        if(response.status == 400){
          return JSON.parse('[{"success":"false","total":"0","eror":"Error 400"}]');
        }
        
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
       //jaime
        return JSON.parse('[{"success":"false","total":"0","eror":"'+error+'"}]');
        
      })
  }
  async getTC(Fecha: any) {
    return await fetch('https://tipodecambio.paginasweb.cr/api//' + Fecha)
      .then((response) => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch(function () {
        console.log('error en catch');
      });
  }
  async sendPaymentmail(Id:any, Name:any) {
    return await fetch(
      'https://toxo.work/api/mailPaymentNotification/' + Id + '&' + Name
    );
  }
  async loadFile(file:any) {
    fetch(
      'https://toxo.work/core/loadP12.php?id=' +
        localStorage.getItem('Id_Empresa'),
      {
        method: 'POST',
        body: file,
      }
    );
  }
  async loadImg(file:any) {
    fetch(
      'https://toxo.work/core/loadImg.php?id=' +
        localStorage.getItem('Id_Empresa'),
      {
        method: 'POST',
        body: file,
      }
    );
  }

  async loadImageFile(file:any) {
    let data = await fetch(
      'https://toxo.work/core/loadImg.php',
      {
        method: 'POST',
        body: file,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch(function () {
        return JSON.parse('[{"success":"false","total":"0","Error":"error en catch"}]');
      });
    return data;
  }

  // Validar Licencia.
  async getUserType() {
    let sql =
      'Select Tipo_Usuario From Seg_Usuario where Id_Usuario = ' +
      localStorage.getItem('Id_Usuario');
    return await this.postRecord(sql);
  }
  async getLicence() {
    let sql =
      'Select Estado, Fecha_Vencimiento,Cantidad_Disponible from Inv_Producto_Empresa where Id_Sub_Categoria = 4 and Id_Empresa = ' +
      localStorage.getItem('Id_Empresa');
    return await this.postRecord(sql);
  }

  async recibirFacturaHacienda(identification: any) {
    //return await fetch(configObject['default']['ServerName']+'core/php/hacienda/RecepcionDocumento.php?IdDocument=' + identification)
    return await fetch(
      'https://toxo.work/core/php/hacienda/RecepcionDocumento.php?IdDocument=' +
        identification
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch(function () {
        console.log('error en catch');
      });
  }
  obtenerPaises(){
    //return this.httpClient.get('http://country.io/names.json');
    return [
    "Sin Definir",
    "Afganistan",
    "Albania",
    "Alemania",
    "Andorra",
    "Angola",
    "Antartida",
    "Antigua y Barbuda",
    "Arabia Saudi",
    "Argelia",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaiyan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belgica",
    "Belice",
    "Benin",
    "Bermudas",
    "Bielorrusia",
    "Birmania Myanmar",
    "Bolivia",
    "Bosnia y Herzegovina",
    "Botswana",
    "Brasil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Butan",
    "Cabo Verde",
    "Camboya",
    "Camerun",
    "Canada",
    "Chad",
    "Chile",
    "China",
    "Chipre",
    "Colombia",
    "Comores",
    "Congo",
    "Corea del Norte",
    "Corea del Sur",
    "Costa de Marfil",
    "Costa Rica",
    "Croacia",
    "Cuba",
    "Dinamarca",
    "Dominica",
    "Ecuador",
    "Egipto",
    "El Salvador",
    "El Vaticano",
    "Emiratos arabes Unidos",
    "Eritrea",
    "Eslovaquia",
    "Eslovenia",
    "España",
    "Estados Unidos",
    "Estonia",
    "Etiopia",
    "Filipinas",
    "Finlandia",
    "Fiji",
    "Francia",
    "Gabon",
    "Gambia",
    "Georgia",
    "Ghana",
    "Gibraltar",
    "Granada",
    "Grecia",
    "Guam",
    "Guatemala",
    "Guinea",
    "Guinea Ecuatorial",
    "Guinea Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungria",
    "India",
    "Indian Ocean",
    "Indonesia",
    "Iran",
    "Iraq",
    "Irlanda",
    "Islandia",
    "Israel",
    "Italia",
    "Jamaica",
    "Japon",
    "Jersey",
    "Jordania",
    "Kazajstan",
    "Kenia",
    "Kirguistan",
    "Kiribati",
    "Kuwait",
    "Laos",
    "Lesoto",
    "Letonia",
    "Libano",
    "Liberia",
    "Libia",
    "Liechtenstein",
    "Lituania",
    "Luxemburgo",
    "Macedonia",
    "Madagascar",
    "Malasia",
    "Malawi",
    "Maldivas",
    "Mali",
    "Malta",
    "Marruecos",
    "Mauricio",
    "Mauritania",
    "Mexico",
    "Micronesia",
    "Moldavia",
    "Monaco",
    "Mongolia",
    "Montserrat",
    "Mozambique",
    "Namibia",
    "Nauru",
    "Nepal",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Noruega",
    "Nueva Zelanda",
    "Oman",
    "Paises Bajos",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua Nueva Guinea",
    "Paraguay",
    "Peru",
    "Polonia",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reino Unido",
    "Republica Centroafricana",
    "Republica Checa",
    "Republica Democratica del Congo",
    "Republica Dominicana",
    "Ruanda",
    "Rumania",
    "Rusia",
    "Sahara Occidental",
    "Samoa",
    "San Cristobal y Nevis",
    "San Marino",
    "San Vicente y las Granadinas",
    "Santa Lucia",
    "Santo Tome y Principe",
    "Senegal",
    "Seychelles",
    "Sierra Leona",
    "Singapur",
    "Siria",
    "Somalia",
    "Southern Ocean",
    "Sri Lanka",
    "Swazilandia",
    "Sudafrica",
    "Sudan",
    "Suecia",
    "Suiza",
    "Surinam",
    "Tailandia",
    "Taiwan",
    "Tanzania",
    "Tayikistan",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad y Tobago",
    "Tunez",
    "Turkmekistan",
    "Turquia",
    "Tuvalu",
    "Ucrania",
    "Uganda",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Djibouti",
    "Zambia",
    "Zimbabue" ];
  }
}
