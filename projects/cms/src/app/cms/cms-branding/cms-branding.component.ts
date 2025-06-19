import { Component, OnInit } from '@angular/core';
import { CmsBrandingService } from './cms-branding.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-cms-branding',
  templateUrl: './cms-branding.component.html',
  styleUrls: ['./cms-branding.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class CmsBrandingComponent implements OnInit {

  Id_Empresa = 1; // ⚠️ ajustar según sesión
  Config: any = {};
  edit = false;

  constructor(private brandingService: CmsBrandingService) {}

  async ngOnInit() {
    await this.loadConfiguracion();
  }

  async loadConfiguracion() {
    const result = await this.brandingService.loadConfiguracion(this.Id_Empresa);
    if (result) {
      this.Config = result;
    } else {
      this.Config = this.brandingService.crearConfigNueva(this.Id_Empresa);
    }
    this.edit = true;
    console.log(this.Config);
  }

  async grabar() {
    await this.brandingService.guardarConfiguracion(this.Config);
    await this.loadConfiguracion();
  }

  cancelar() {
    this.edit = false;
  }
}
