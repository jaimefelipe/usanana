import { Component, OnInit, Input } from '@angular/core';
import { CmsEmpresaconfigService } from './cms-empresa-config.service';

@Component({
  selector: 'app-cms-empresa-config',
  templateUrl: './cms-empresa-config.component.html',
  styleUrls: ['./cms-empresa-config.component.css']
})
export class CmsEmpresaConfigComponent implements OnInit {

 @Input() Id_Empresa: number;
  Empresa: any = {};
  loading = false;
  guardando = false;

  constructor(private empresaService: CmsEmpresaconfigService) {}

  async ngOnInit() {
    await this.loadEmpresaConfig();
  }

  async loadEmpresaConfig() {
    this.loading = true;
    const data = await this.empresaService.loadEmpresa(this.Id_Empresa);
    if (data.total > 0) {
      this.Empresa = data.data[0];
    } else {
      this.Empresa = {
        Id_Empresa: this.Id_Empresa,
        Dominio_Principal: '',
        Sitio_Desde_CMS: false,
        Ruta_Archivo_HTML: '',
        Tiene_LMS: false,
        LMS_Integrado_Web: false
      };
    }
    this.loading = false;
  }

  async grabar() {
    this.guardando = true;
    const result = await this.empresaService.saveEmpresaCMS(this.Empresa);
    this.guardando = false;
    if (result.success) {
      alert('Configuración actualizada con éxito.');
    } else {
      alert('Ocurrió un error al guardar los datos.');
    }
  }


}
