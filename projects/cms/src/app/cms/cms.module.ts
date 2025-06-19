import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmsRoutingModule } from './cms-routing.module';
import { CmsPaginasComponent } from './cms-paginas/cms-paginas.component';
import { CmsSeccionesComponent } from './cms-secciones/cms-secciones.component';
import { CmsBrandingComponent } from './cms-branding/cms-branding.component';
import { CmsIntegracionesComponent } from './cms-integraciones/cms-integraciones.component';
import { CmsEmpresaConfigComponent } from './cms-empresa-config/cms-empresa-config.component';

import { SafeUrlPipe } from './safe-url.pipe';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';

@NgModule({
  imports: [
    CommonModule,
    CmsRoutingModule,
    FormsModule,
    RichTextEditorModule
  ],
  declarations: [CmsPaginasComponent,CmsSeccionesComponent,SafeUrlPipe,CmsBrandingComponent,CmsIntegracionesComponent,CmsEmpresaConfigComponent],
  exports: [
    SafeUrlPipe // importante si lo usás fuera del módulo
  ]
})
export class CmsModule { }
