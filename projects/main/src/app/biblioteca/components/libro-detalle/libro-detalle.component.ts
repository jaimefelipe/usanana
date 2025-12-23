import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro } from '../../models/biblioteca.models';

@Component({
  selector: 'app-libro-detalle',
  templateUrl: './libro-detalle.component.html',
  styleUrls: ['./libro-detalle.component.css']
})
export class LibroDetalleComponent {
  libro?: Libro;

  constructor(private route: ActivatedRoute, private dataService: BibliotecaDataService) {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : undefined;
    if (id) {
      this.libro = this.dataService.getLibroById(id);
    }
  }
}
