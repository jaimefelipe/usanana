import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './contacto/contacto.component';
import { MarcasComponent } from './marcas/marcas.component';
const routes: Routes = [
  {path : 'contactos', component : ContactoComponent},
  {path : 'marcas', component : MarcasComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactoRoutingModule { }
