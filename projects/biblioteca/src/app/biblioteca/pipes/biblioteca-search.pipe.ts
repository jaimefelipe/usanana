import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bibliotecaSearch'
})
export class BibliotecaSearchPipe implements PipeTransform {
  transform(items: any[], term: string): any[] {
    if (!items || !term) {
      return items;
    }
    const needle = term.toString().toLowerCase().trim();
    if (!needle) {
      return items;
    }
    return items.filter((item) => {
      const haystack = JSON.stringify(item ?? '').toLowerCase();
      return haystack.includes(needle);
    });
  }
}
