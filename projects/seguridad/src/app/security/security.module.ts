import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SecurityRoutingModule } from './security-routing.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ChangeComponent } from './change/change.component';
import { SecurityUserComponent } from './security-user/security-user.component';
import { SecurityGroupComponent } from './security-group/security-group.component';
import { SecurityAppGroupComponent } from './security-app-group/security-app-group.component';
import { SecurityAppComponent } from './security-app/security-app.component';
import { SecurityUserGroupComponent } from './security-user-group/security-user-group.component';
import { UsuarioEmpresaComponent } from './usuario-empresa/usuario-empresa.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginCampusComponent } from './login-campus/login-campus.component';


@NgModule({
  declarations: [LoginComponent, SignupComponent, ChangeComponent, SecurityUserComponent, SecurityGroupComponent, SecurityAppGroupComponent, SecurityAppComponent, SecurityUserGroupComponent,UsuarioEmpresaComponent,LoginCampusComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SecurityRoutingModule,
    MatFormFieldModule
  ]
})
export class SecurityModule { }
