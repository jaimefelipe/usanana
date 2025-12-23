import { Injectable } from '@angular/core';
import { postConControl } from './net-utils';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url = '';

  // Token especial para representar saltos de línea en SQL/BD
  private readonly NL_TOKEN = '[[__NL__]]';

  constructor() {
    //if(window.location.hostname == 'localhost'){
    //  this.url = 'https://ibo.jaimebrenes.com/core/php/db/eps_execSql.php?sql=';
    //}else{
    //  this.url = '/core/php/db/eps_execSql.php';
    //}
    //if(window.location.hostname == 'localhost'){
    //  this.url = 'http://api.usantana.com/core/db/eps_execSql.php?sql=';
    //}else{
      this.url = 'https://usantana.com/core/db/eps_execSql_v21.php?sql=';
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
    Distinct: true,
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

    let aliasTabla = '';
    const table = this.sqlConfig.table.trim();

    if (table.startsWith('(')) {
      const match = table.match(/AS\s+([a-zA-Z_]\w*)$/i);
      aliasTabla = match ? match[1] : 't'; // alias por defecto 't'
    } else {
      aliasTabla = table.split(' ')[0];
    }

    if (this.sqlConfig.Empresa) {
      EmpresaWhere = `(${aliasTabla}.Id_Empresa = ${localStorage.getItem('Id_Empresa')})`;
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

        let campo = field.trim();

        // Elimina el alias si hay un "AS" o "as"
        let regexAlias = /\s+as\s+/i;
        if (regexAlias.test(campo)) {
          campo = campo.split(regexAlias)[0].trim();
        }

        // Si el campo es un CASE, busca el alias después del THEN o END
        if (campo.trim().toUpperCase().startsWith('CASE')) {
          campo = ''; // Si deseas excluir CASE del WHERE, déjalo vacío
        }
        if (campo !== '') {
          where = where + campo + " LIKE '%" + this.sqlConfig.searchField + "%'";
        }
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
    //if (orderFieldArr.length > 1) {
    //  simpleOrderField = orderFieldArr[1];
    //} else {
    simpleOrderField = this.sqlConfig.orderField;
    //}

    if (this.sqlConfig.simple === false) {
      //Limit y Offset para Mysql
      let tamanio =
        this.sqlConfig.paginacion.LastRow - this.sqlConfig.paginacion.FirstRow + 1;
      let sql = '';
      if (this.sqlConfig.Distinct) {
        sql = sql + 'SELECT Distinct ';
      } else {
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

  async executeSqlSyn(sqlConfig: any, Tipo?) {
    this.validarLogin();
    this.sqlConfig = sqlConfig;
    this.correctConfig();
    this.makeSql();
    let data = await this.postRecord('', Tipo);
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

  async updateRecord(sqlConfig: any, Tipo?) {
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
    let data = await this.postRecord('', Tipo);
    if (data['success'] == 'true') {
      return data;
    } else {
      alert(data['error']);
      Swal.fire({
        title: 'Update',
        text: data['error'],
        footer: data['sql'],
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
      ')';

    let data = await this.postRecord();

    if (data['success'] == 'true') {
      return data;
    } else {
      alert(data['error']);
      Swal.fire({
        title: 'Insert',
        text: data['error'],
        footer: data['sql'],
      });
      return false;
    }
  }

  // ==========================
  //  Helpers de saltos de línea
  // ==========================

  /**
   * Codifica los ENTER solo dentro de valores entre comillas simples '...'
   * para no tocar el formato del SQL (saltos de línea en UPDATE, etc.).
   */
  private encodeNewlinesInSqlValues(sql: string): string {
    if (!sql || typeof sql !== 'string') return sql;

    // Busca segmentos '...'
    return sql.replace(/'([^']*)'/g, (match, group) => {
      const encoded = group
        .replace(/\r\n/g, this.NL_TOKEN)
        .replace(/\n/g, this.NL_TOKEN)
        .replace(/\r/g, this.NL_TOKEN);
      return `'${encoded}'`;
    });
  }

  /** Decodifica el token seguro a saltos de línea reales en un string */
  private decodeNewlines(input: string): string {
    if (!input || typeof input !== 'string') return input;
    // Usamos split/join para evitar problemas con los corchetes de NL_TOKEN
    return input.split(this.NL_TOKEN).join('\n');
  }

  /** Aplica la decodificación de saltos de línea a cualquier estructura */
  private decodeNewlinesDeep(value: any): any {
    if (value === null || value === undefined) return value;

    if (typeof value === 'string') {
      return this.decodeNewlines(value);
    }

    if (Array.isArray(value)) {
      return value.map((v) => this.decodeNewlinesDeep(v));
    }

    if (typeof value === 'object') {
      const out: any = {};
      for (const k of Object.keys(value)) {
        out[k] = this.decodeNewlinesDeep(value[k]);
      }
      return out;
    }

    return value;
  }

  // 🧠 Función para limpiar valores vacíos del SQL antes de enviar
  sanitizeSql(sql: string): string {
    if (!sql || typeof sql !== 'string') return sql;

    // 1) Codificar ENTER solo dentro de valores '...'
    sql = this.encodeNewlinesInSqlValues(sql);

    // 2) Reglas originales
    return sql
      // Reemplaza 'null', "null", null (sin comillas), 'undefined', etc.
      .replace(/(['"])?\b(null|undefined)\b\1/gi, 'NULL')
      // Reemplaza también cadenas vacías entre comillas simples o dobles
      .replace(/''/g, 'NULL')
      .replace(/""/g, 'NULL');
  }

  async postRecord(sql?: any, Tipo?: any): Promise<any> {
    if (!sql) sql = this.sql;

    sql = this.sanitizeSql(sql); // <-- aquí ya se codifican SOLO los ENTER dentro de valores

    if (/UPDATE\s+/i.test(sql) || /SET\s+/i.test(sql)) {
      sql = sql.replace(/\+/g, '%2B');
    }
    if (/UPDATE\s+/i.test(sql) || /SET\s+/i.test(sql)) {
      sql = sql.replace(/\+/g, '%2B');
    }

    if (!navigator.onLine) {
      Swal.fire('No hay internet, revise la conexión');
      return { success: false, total: 0, Error: 'Sin conexión' };
    }

    const url = Tipo === 2
      ? 'https://usantana.com/core/db/eps_execSql_v2.php?sql='
      : this.url;

    const sqlQuery = encodeURIComponent(sql || this.sql);

    try {
      const raw = await postConControl(url, 'sql=' + sqlQuery, 2, 10000);

      // 🔁 Decodificar token [[__NL__]] → '\n' en todo el objeto respuesta
      const decoded = this.decodeNewlinesDeep(raw);

      return decoded;
    } catch (error: any) {
      Swal.fire('Error al conectar con el servidor');
      console.error('❌ Error en postRecord:', error);
      return { success: false, total: 0, Error: error.message };
    }
  }

  async postScript(url?: any, Id?: any) {
    url = this.sanitizeSql(url);
    let data = await fetch(url + '?IdDocument=' + Id, {
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

  async obtenerApiHacienda() {
    if (localStorage.getItem('API')) {
      return localStorage.getItem('API');
    } else {
      let sql =
        'Select Api From Gen_Empresa where  Id_Empresa = ' +
        localStorage.getItem('Id_Empresa');
      let data = await this.postRecord(sql);
      localStorage.setItem('Api', data['data'][0]['Api']);
      return data['data'][0]['Api'];
    }
  }

  async aplicarFacturaHacienda(identification: any) {
    let Api = await this.obtenerApiHacienda();
    console.log('Api', Api);
    let url = 'https://usantana.com/core/php/hacienda2/Conexion_Hacienda.php?IdDocument=';
    if (Api == '02') {
      url = 'https://usantana.com/core/php/hacienda44/Conexion_Hacienda.php?IdDocument=';
    }
    return await fetch(url + identification)
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
        return JSON.parse('[{"success":"false","total":"0","eror":"' + error + '"}]');
      });
  }

  async getApiHacienda(identification: any) {
    return await fetch(
      'https://api.hacienda.go.cr/fe/ae?identificacion=' + identification
    )
      .then((response) => {
        if (response.status == 400) {
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
        return JSON.parse('[{"success":"false","total":"0","eror":"' + error + '"}]');
      });
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

  async sendPaymentmail(Id: any, Name: any) {
    return await fetch(
      'https://usantana.com/api/mailPaymentNotification/' + Id + '&' + Name
    );
  }

  async loadPublicFile(file: any): Promise<any> {
    try {
      const response = await fetch(
        'https://usantana.com/core/loadFile.php?id=' +
          localStorage.getItem('Id_Empresa'),
        {
          method: 'POST',
          body: file,
        }
      );

      // Convertir la respuesta a JSON
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al subir archivo:', error);
      return { success: false, message: 'Error en la conexión' };
    }
  }

  async loadFile(file: any) {
    fetch(
      'https://usantana.com/core/loadP12.php?id=' +
        localStorage.getItem('Id_Empresa'),
      {
        method: 'POST',
        body: file,
      }
    );
  }

  async loadImg(file: any) {
    fetch(
      'https://usantana.com/loadImg.php?id=' +
        localStorage.getItem('Id_Empresa'),
      {
        method: 'POST',
        body: file,
      }
    );
  }

  async loadImageFile(file: any) {
    let data = await fetch('https://usantana.com/core/loadImg.php', {
      method: 'POST',
      body: file,
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
    return await fetch(
      'https://usantana.com/core/php/hacienda/RecepcionDocumento.php?IdDocument=' +
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

  obtenerPaises() {
    return [
      'Sin Definir',
      'Afganistan',
      'Albania',
      'Alemania',
      'Andorra',
      'Angola',
      'Antartida',
      'Antigua y Barbuda',
      'Arabia Saudi',
      'Argelia',
      'Argentina',
      'Armenia',
      'Australia',
      'Austria',
      'Azerbaiyan',
      'Bahamas',
      'Bahrain',
      'Bangladesh',
      'Barbados',
      'Belgica',
      'Belice',
      'Benin',
      'Bermudas',
      'Bielorrusia',
      'Birmania Myanmar',
      'Bolivia',
      'Bosnia y Herzegovina',
      'Botswana',
      'Brasil',
      'Brunei',
      'Bulgaria',
      'Burkina Faso',
      'Burundi',
      'Butan',
      'Cabo Verde',
      'Camboya',
      'Camerun',
      'Canada',
      'Chad',
      'Chile',
      'China',
      'Chipre',
      'Colombia',
      'Comores',
      'Congo',
      'Corea del Norte',
      'Corea del Sur',
      'Costa de Marfil',
      'Costa Rica',
      'Croacia',
      'Cuba',
      'Dinamarca',
      'Dominica',
      'Ecuador',
      'Egipto',
      'El Salvador',
      'El Vaticano',
      'Emiratos arabes Unidos',
      'Eritrea',
      'Eslovaquia',
      'Eslovenia',
      'España',
      'Estados Unidos',
      'Estonia',
      'Etiopia',
      'Filipinas',
      'Finlandia',
      'Fiji',
      'Francia',
      'Gabon',
      'Gambia',
      'Georgia',
      'Ghana',
      'Gibraltar',
      'Granada',
      'Grecia',
      'Guam',
      'Guatemala',
      'Guinea',
      'Guinea Ecuatorial',
      'Guinea Bissau',
      'Guyana',
      'Haiti',
      'Honduras',
      'Hungria',
      'India',
      'Indian Ocean',
      'Indonesia',
      'Iran',
      'Iraq',
      'Irlanda',
      'Islandia',
      'Israel',
      'Italia',
      'Jamaica',
      'Japon',
      'Jersey',
      'Jordania',
      'Kazajstan',
      'Kenia',
      'Kirguistan',
      'Kiribati',
      'Kuwait',
      'Laos',
      'Lesoto',
      'Letonia',
      'Libano',
      'Liberia',
      'Libia',
      'Liechtenstein',
      'Lituania',
      'Luxemburgo',
      'Macedonia',
      'Madagascar',
      'Malasia',
      'Malawi',
      'Maldivas',
      'Mali',
      'Malta',
      'Marruecos',
      'Mauricio',
      'Mauritania',
      'Mexico',
      'Micronesia',
      'Moldavia',
      'Monaco',
      'Mongolia',
      'Montserrat',
      'Mozambique',
      'Namibia',
      'Nauru',
      'Nepal',
      'Nicaragua',
      'Niger',
      'Nigeria',
      'Noruega',
      'Nueva Zelanda',
      'Oman',
      'Paises Bajos',
      'Pakistan',
      'Palau',
      'Panama',
      'Papua Nueva Guinea',
      'Paraguay',
      'Peru',
      'Polonia',
      'Portugal',
      'Puerto Rico',
      'Qatar',
      'Reino Unido',
      'Republica Centroafricana',
      'Republica Checa',
      'Republica Democratica del Congo',
      'Republica Dominicana',
      'Ruanda',
      'Rumania',
      'Rusia',
      'Sahara Occidental',
      'Samoa',
      'San Cristobal y Nevis',
      'San Marino',
      'San Vicente y las Granadinas',
      'Santa Lucia',
      'Santo Tome y Principe',
      'Senegal',
      'Seychelles',
      'Sierra Leona',
      'Singapur',
      'Siria',
      'Somalia',
      'Southern Ocean',
      'Sri Lanka',
      'Swazilandia',
      'Sudafrica',
      'Sudan',
      'Suecia',
      'Suiza',
      'Surinam',
      'Tailandia',
      'Taiwan',
      'Tanzania',
      'Tayikistan',
      'Togo',
      'Tokelau',
      'Tonga',
      'Trinidad y Tobago',
      'Tunez',
      'Turkmekistan',
      'Turquia',
      'Tuvalu',
      'Ucrania',
      'Uganda',
      'Uruguay',
      'Uzbekistan',
      'Vanuatu',
      'Venezuela',
      'Vietnam',
      'Yemen',
      'Djibouti',
      'Zambia',
      'Zimbabue',
    ];
  }

  getUrl(Tipo?: any): string {
    return Tipo === 2
      ? 'https://usantana.com/core/db/eps_execSql_v2.php?sql='
      : this.url;
  }
}
