import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../../../contacto/src/app/contacto/general/general.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';
import { CursoService } from '../../../../../academico/src/app/config/curso/curso.service';
import { CarreraService } from '../../../../../academico/src/app/config/carrera/carrera.service';
import { SecurityUserService } from '../../../../../seguridad/src/app/security/security-user/security-user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor(
      private generalService:GeneralService,
      private cursoService:CursoService,
      private contactoService:ContactoService,
      private carreraService:CarreraService,
      private securityUserService:SecurityUserService
    ) { }
    Registrado = false;
    NombreValido = true;
    Paises = [];
    Nacionalidades = [];
    Carreras = [];
    Persona = {
      Id_Persona:'',
      Nombre: '',
      Telefono: '',
      Direccion: '',
      Correo: '',
      Identificacion: '',
      Otro_Documento: '',
      Estado: '',
      Tipo_Identificacion: '01',
      Genero: '',
      Apartado: '',
      Id_Nacionalidad: '1',
      Estado_Civil: '1',
      Cliente: '',
      Proveedor: '',
      Emisor: '',
      Empleado: '',
      Alumno: '',
      Profesor: '',
      Residencia: 'Costa Rica',
      Nivel:'6',
      Carrera:'',
    };
    ngOnInit() {
      this.LeerInfoUsuario();
      //Validar si hay login entonces salir
      this.Registrado = false;
      localStorage.setItem('Id_Empresa','16');
      this.leerNacionalidades();
      this.leerPaises();
    }
    async leerPaises(){
      this.Paises =  await this.generalService.leerPaises();
    }
    async leerNacionalidades(){
      let data = await this.generalService.leerNacionalidades();
      this.Nacionalidades = data['data'];
    }
    registrarse(){
       // Validar si el usuario ya existe
      if(this.Persona.Nombre ===''){
        Swal.fire('No Espcificó el Nombre');
        return false;
      }
      if(this.Persona.Identificacion ===''){
        Swal.fire('No Espcificó la Identificación');
        return false;
      }
      if(this.Persona.Telefono ===''){
        Swal.fire('No Espcificó el Número de teléfono');
        return false;
      }
      if(this.Persona.Correo ===''){
        Swal.fire('No Espcificó el Correo');
        return false;
      }
      if(this.Persona.Carrera ===''){
        Swal.fire('No Espcificó la Carrera de su Interés');
        return false;
      }
      this.validarNombreUsuario(); 
      return true
    }
    async validarNombreUsuario(){
      let ArrNombre = this.Persona.Nombre.split(' ');
      let Nombre = '';
      let Apellido = '';
      if(ArrNombre.length === 2){
        Nombre = ArrNombre[0];
        Apellido = ArrNombre[1];
      }
      if(ArrNombre.length === 3){
        Nombre = ArrNombre[0];
        Apellido = ArrNombre[1];
      }
      if(ArrNombre.length === 4){
        Nombre = ArrNombre[0];
        Apellido = ArrNombre[2];
      }
      let persona = await this.contactoService.getPersonaPorNombre(Nombre,Apellido);
      if(persona['total']>0){
        //Persona existe
        Swal.fire({
          title: "Ya Existe un Candidato Inscrito con el nombre " + persona['data'][0]['Nombre'],
          text: "Si son sus datos por favor contacte a UNELA vía telefónica",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Continuar cn el registro!'
        }).then((result) => {
          if (result.value) {
            this.aplicarRegistro();
            return true;
          }else{
            return false
          }
        });
      }else{
        //Persona no existe
        this.aplicarRegistro();
      }
    }
    async aplicarRegistro(){
      let persona  = await this.contactoService.savePersona(this.Persona);
      this.Persona.Id_Persona = persona['Identity'];
       Swal.fire('Datos actualizados correctamente');
    }
   
    async LeerInfoUsuario(){
      console.log('Id_Usuario',localStorage.getItem('Id_Usuario'));
      let data = await this.contactoService.loadPersona('',localStorage.getItem('Id_Usuario'));
      this.Persona = data['data'][0];
      console.log(this.Persona)
    }
    regresar(){
       window.location.href = '/';
    }
}
