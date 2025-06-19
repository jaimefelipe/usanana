import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CmsBrandingService {

constructor(private apiService: ApiService) {}

  async loadConfiguracion(Id_Empresa: number) {
    const sqlConfig = {
      table: 'Gen_Empresa_Configuracion_Web',
      fields: 'Id_Configuracion_Web,Logo_Url,Favicon_Url,Color_Primario,Color_Secundario,Color_Texto,Tipografia_Principal,Texto_Bienvenida,Mostrar_Barra_Login,Mostrar_Boton_Contacto,Mostrar_Blog,Pie_Pagina_HTML',
      where: `Id_Empresa = ${Id_Empresa}`
    };

    const result = await this.apiService.executeSqlSyn(sqlConfig);
    if (result.total === 0) return null;

    const config = result.data[0];
    delete config.rowid;

    // ✅ Decodificamos los campos visuales
    config.Color_Primario   = this.normalizeHexColor(this.decodeVisualField(config.Color_Primario));
    config.Color_Secundario = this.normalizeHexColor(this.decodeVisualField(config.Color_Secundario));
    config.Color_Texto      = this.normalizeHexColor(this.decodeVisualField(config.Color_Texto));

    return config;
  }


  crearConfigNueva(Id_Empresa: number) {
    return {
      Logo_Url: '',
      Favicon_Url: '',
      Color_Primario: '#d32f2f',
      Color_Secundario: '#ffffff',
      Color_Texto: '#000000',
      Tipografia_Principal: 'Arial',
      Texto_Bienvenida: '',
      Mostrar_Barra_Login: true,
      Mostrar_Boton_Contacto: true,
      Mostrar_Blog: false,
      Pie_Pagina_HTML: ''
    };
  }

  async guardarConfiguracion(config: any) {

    config.Color_Primario = this.encodeVisualField(config.Color_Primario);
    config.Color_Secundario = this.encodeVisualField(config.Color_Secundario);
    config.Color_Texto = this.encodeVisualField(config.Color_Texto);

    if (!config.Id_Configuracion_Web) {
      const sql = {
        table: 'Gen_Empresa_Configuracion_Web',
        fields: Object.keys(config).join(','),
        values: `'${Object.values(config).join("','")}'`
      };
      return await this.apiService.insertRecord(sql);
    } else {
      const updateStr = Object.entries(config)
        .filter(([k]) => k !== 'Id_Configuracion_Web')
        .map(([k, v]) => `${k}='${v}'`).join(',');
      const sql = {
        table: 'Gen_Empresa_Configuracion_Web',
        fields: updateStr,
        where: `Id_Configuracion_Web=${config.Id_Configuracion_Web}`
      };
      return await this.apiService.updateRecord(sql);
    }
  }

  decodeVisualField(valor: string): string {
    if (!valor) return '';
    return valor
      .replace(/\|\@\*\|/g, '#')
      .replace(/\|\@lb\|/g, '{') // por si codificás más cosas
      .replace(/\|\@rb\|/g, '}');
  }
  encodeVisualField(valor: string): string {
    if (!valor) return '';
    return valor
      .replace(/#/g, '|@*|')
      .replace(/{/g, '|@lb|')
      .replace(/}/g, '|@rb|');
  }

  normalizeHexColor(hex: string): string {
    if (!hex || !hex.startsWith('#')) return hex;

    // Si es formato corto como #e91
    if (hex.length === 4) {
      return '#' + hex[1].repeat(2) + hex[2].repeat(2) + hex[3].repeat(2);
    }

    // Ya está bien
    return hex;
  }
}
