import { Component } from '@angular/core';
import { RELEASES, VERSION_ACTUAL, Release } from '../../version';

@Component({
  selector: 'app-novedades-campus',
  templateUrl: './novedades.component.html'
})
export class NovedadesComponent {
  versionActual = VERSION_ACTUAL;
  releases: Release[] = [...RELEASES].reverse();
}
