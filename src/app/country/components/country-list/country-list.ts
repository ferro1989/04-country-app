import { Component, effect, input, output, signal, viewChild } from '@angular/core';
import { Country } from '../../interfaces/country.inteface';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchInput } from '../search-input/search-input';

@Component({
  selector: 'country-list',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './country-list.html',
})
export class CountryList {
  countries = input.required<Country[]>();

  errorMessage = input<string | unknown | null>();
  isLoading = input<boolean>(false);
  isEmpty = input<boolean>(false);

  // Referencia al componente SearchInput
  searchInput = viewChild.required<SearchInput>(SearchInput);

  // Nuevo input para el tipo de búsqueda
  searchType = input<string>(''); // valor por defecto

  closeErrorEvent = output<void>();

  showModal = signal(false);

  // Effect simplificado
  private modalEffect = effect(() => {
    this.showModal.set(!!this.errorMessage());
  });

  closeError() {
    this.showModal.set(false);
    this.closeErrorEvent.emit();
  }
}
