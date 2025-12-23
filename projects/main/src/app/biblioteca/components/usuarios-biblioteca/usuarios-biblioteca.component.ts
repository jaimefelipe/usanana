import { Component } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { UsuarioBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-usuarios-biblioteca',
  templateUrl: './usuarios-biblioteca.component.html',
  styleUrls: ['./usuarios-biblioteca.component.css']
})
export class UsuariosBibliotecaComponent {
  usuarios: UsuarioBiblioteca[] = [];

  constructor(private dataService: BibliotecaDataService) {
    this.usuarios = this.dataService.getUsuarios();
  }
}
