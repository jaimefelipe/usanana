import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsPaginasComponent } from './cms-paginas/cms-paginas.component';
import { CmsBrandingComponent } from './cms-branding/cms-branding.component';
import { CmsIntegracionesComponent } from './cms-integraciones/cms-integraciones.component';
import { CmsEmpresaConfigComponent } from './cms-empresa-config/cms-empresa-config.component';

const routes: Routes = [
  //{path : '', component : FullComponent},
  {path : 'cmspaginas', component : CmsPaginasComponent},
  {path : 'cmsbrand', component : CmsBrandingComponent},
  {path : 'cmsintegra', component : CmsIntegracionesComponent},
  {path : 'cmsconfig', component : CmsEmpresaConfigComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
