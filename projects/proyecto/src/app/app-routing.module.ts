import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//const routes: Routes = [];
const routes: Routes = [
  {
    path: 'proyectos',
    loadChildren: () => import('./proyecto/proyecto.module').then(m => m.ProyectoModule)
  },{
    path: 'seguridad',
    loadChildren: () =>import('../../../seguridad/src/app/security/security.module').then(m => m.SecurityModule)
   },
   {
    path: 'general',
    loadChildren: () =>import('../../../main/src/app/general/general.module').then(m => m.GeneralModule)
   },
   {
    path: 'contacto',
    loadChildren: () =>import('../../../contacto/src/app/contacto/contacto.module').then(m => m.ContactoModule)
   },
   {
    path: 'tareas',
    loadChildren: () =>import('./tareas/tareas.module').then(m => m.TareasModule)
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
