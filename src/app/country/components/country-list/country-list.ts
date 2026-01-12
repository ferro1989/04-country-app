import { Component, input, output, signal } from '@angular/core';
import { Country } from '../../interfaces/country.inteface';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'country-list',
  imports: [DecimalPipe,RouterLink],
  templateUrl: './country-list.html',
})
export class CountryList {

  countries= input.required<Country[]>();

  errorMessage= input<string|unknown|null>();
  isLoading = input<boolean>(false);
  isEmpty = input<boolean>(false);

  // Nuevo input para el tipo de búsqueda
  searchType = input<string>(''); // valor por defecto

  closeErrorEvent = output<void>();

  closeError() {
    this.closeErrorEvent.emit();
  }
}
