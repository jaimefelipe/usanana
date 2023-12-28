import { ChangeComponent } from './change/change.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SecurityUserComponent } from './security-user/security-user.component';
import { SecurityGroupComponent } from './security-group/security-group.component';
import { SecurityAppGroupComponent } from './security-app-group/security-app-group.component';
import { SecurityUserGroupComponent } from './security-user-group/security-user-group.component';
import { UsuarioEmpresaComponent } from './usuario-empresa/usuario-empresa.component';

const routes: Routes = [
  {path : 'login', component : LoginComponent},
  {path : 'signup', component : SignupComponent},
  {path : 'cambiar', component : ChangeComponent},
  {path : 'usuario', component : SecurityUserComponent},
  {path : 'seggrupo', component : SecurityGroupComponent},
  {path : 'segappgrupo', component : SecurityAppGroupComponent},
  {path : 'segusergrupo', component : SecurityUserGroupComponent},
  {path : 'usuarioempresa', component : UsuarioEmpresaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
