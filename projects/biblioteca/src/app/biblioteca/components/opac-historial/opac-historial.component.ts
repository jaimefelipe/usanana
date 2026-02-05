import { Component, OnInit } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { OpacHistorialBusqueda } from '../../models/biblioteca.models';

@Component({
  selector: 'app-opac-historial',
  templateUrl: './opac-historial.component.html',
  styleUrls: ['./opac-historial.component.css']
})
export class OpacHistorialComponent implements OnInit {
  historial: OpacHistorialBusqueda[] = [];
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    this.historial = await this.dataService.getOpacHistorial();
  }

  keytab(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  search() {
    this.searchField = this.searchField.trim();
  }
}
