import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TitleService {
  private _title = new BehaviorSubject<string>('Inicio');
  public tituloActual$ = this._title.asObservable();

  setTitulo(titulo: string) {
    this._title.next(titulo);
  }
}